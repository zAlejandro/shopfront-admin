// Panel -> vitrina-api. El login también pasa por la API: el panel no conoce ninguna clave de Supabase.
import {blankSite} from './api.mock.js'
const API=import.meta.env.VITE_API_URL,SK='vitrina-session'
let known={products:[],media:[]},refreshing   // known = último estado del servidor, para saber qué cambió al guardar
const session=()=>JSON.parse(sessionStorage.getItem(SK)||'null')
const keep=s=>sessionStorage.setItem(SK,JSON.stringify({access_token:s.access_token,refresh_token:s.refresh_token,expires_at:s.expires_at}))
const expire=()=>{sessionStorage.removeItem(SK);sessionStorage.removeItem('u');location.reload()}
async function send(method,path,body,headers){
  const res=await fetch(API+path,{method,body:body===undefined?undefined:JSON.stringify(body),headers:{'Content-Type':'application/json',...headers}})
  const j=res.status===204?null:await res.json().catch(()=>({}))
  return {res,j}
}
async function token(){                         // token vigente; se renueva solo si le queda menos de 1 minuto
  const s=session();if(!s)return ''
  if(s.expires_at*1000-Date.now()>60000)return s.access_token
  refreshing??=send('POST','/auth/refresh',{refresh_token:s.refresh_token}).then(({res,j})=>{if(!res.ok)throw 0;keep(j);return j.access_token}).catch(()=>{expire()}).finally(()=>{refreshing=null})
  return refreshing
}
async function call(method,path,tenant,body){
  const {res,j}=await send(method,path,body,{Authorization:`Bearer ${await token()}`,...(tenant?{'X-Tenant':tenant}:{})})
  if(res.status===401)expire()
  if(!res.ok)throw new Error(j?.error||'Error del servidor')
  return j
}
const base=blankSite({})
const withDefaults=s=>({...base,...s,socials:{...base.socials,...s.socials},trust:s.trust?.length?s.trust:base.trust})
// Reduce la foto (máx. 1600px, JPEG) antes de subirla: más rápido y siempre dentro del límite de 5 MB
const shrink=f=>new Promise((ok,no)=>{const i=new Image();i.onerror=()=>no(new Error('Archivo de imagen inválido'));i.onload=()=>{const k=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(new Error('No se pudo procesar la imagen')),'image/jpeg',.85)};i.src=URL.createObjectURL(f)})

export const api={
  async login(email,password){
    const {res,j}=await send('POST','/auth/login',{email,password})
    if(!res.ok)throw new Error(j?.error||'No se pudo iniciar sesión.')
    keep(j);return j.user                                            // {email,role,tenant}
  },
  async logout(){const s=session();sessionStorage.removeItem(SK);if(s)await send('POST','/auth/logout',{},{Authorization:`Bearer ${s.access_token}`}).catch(()=>{})},
  tenants:()=>call('GET','/owner/tenants'),
  createTenant:body=>call('POST','/owner/tenants',null,body),
  async get(t){const d=await call('GET','/admin/tenant',t);known={products:d.products,media:d.media};return {...d,site:withDefaults(d.site||{})}},
  async set(t,key,val){
    if(key==='site'){await call('PUT','/admin/site',t,val);return val}
    if(key==='categories')return call('PUT','/admin/categories',t,val)
    if(key==='products'){                                            // la API es por producto: compara y manda solo lo que cambió
      const out=[]
      for(const p of val){const o=known.products.find(x=>x.id===p.id)
        out.push(!o?await call('POST','/admin/products',t,p):JSON.stringify(o)!==JSON.stringify(p)?await call('PUT',`/admin/products/${p.id}`,t,p):p)}
      for(const o of known.products)if(!val.some(x=>x.id===o.id))await call('DELETE',`/admin/products/${o.id}`,t)
      return known.products=out
    }
    if(key==='media'){for(const m of known.media)if(!val.some(x=>x.id===m.id))await call('DELETE',`/admin/media/${m.id}`,t);return known.media=val}
  },
  async upload(t,f){                                                 // 1) pedir URL firmada  2) subir a R2  3) registrar
    const blob=await shrink(f),name=f.name.replace(/\.[^.]+$/,'')+'.jpg'
    const s=await call('POST','/admin/media/sign',t,{name,type:'image/jpeg',size:blob.size})
    const up=await fetch(s.uploadUrl,{method:'PUT',headers:{'Content-Type':'image/jpeg'},body:blob})
    if(!up.ok)throw new Error('No se pudo subir a R2. Revisa el CORS del bucket.')
    const m=await call('POST','/admin/media',t,{name,path:s.key})
    known.media=[...known.media,m];return m
  }
}
