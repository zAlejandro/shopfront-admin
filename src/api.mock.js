// Capa de datos. Hoy: mock en localStorage. Para producción reemplaza cada función (misma firma):
//  login  -> supabase.auth.signInWithPassword; el negocio sale de session.user.app_metadata.tenant_id (nunca de user_metadata)
//  tenants/get/set -> supabase.from('sites'|'categories'|'products'|'media') con RLS por tenant_id
//  upload -> pedir URL firmada a tu backend, subir a R2 y guardar solo la ruta relativa ("tenant/archivo.jpg")
const E=import.meta.env,K='vitrina-admin-mock-v1'
export const assetUrl=p=>!p?'':/^(https?:|data:)/.test(p)?p:`${(E.VITE_ASSETS_URL||'').replace(/\/$/,'')}/${p}`
const trust=[['🛡️','Garantía incluida','Equipos originales con garantía'],['💳','Financiamiento','Llévalo hoy con facilidades'],['🔁','Aceptamos tu equipo','Como parte de pago'],['🚚','Envíos nacionales','A todo el país']].map(([icon,title,text])=>({icon,title,text}))
const site=o=>({name:'',slogan:'',description:'',logo:'',phone:'',whatsapp:'',whatsappMsg:'Hola, quiero información',email:'',address:'',hours:'Lunes a sábado, 9:00 a. m. a 6:00 p. m.\nDomingos cerrados',mapQuery:'',socials:{instagram:'',facebook:'',tiktok:'',youtube:'',x:'',web:''},primary:'#1b4fd8',dark:'#0a1a4f',heroTitle:'',heroSubtitle:'',heroImage:'',bannerTitle:'',bannerText:'',trust,slides:[],showReviews:true,showBanner:true,showTicker:true,...o})
const P=(id,name,category,price,spec,extra)=>({id,name,category,price,spec,from:false,description:'',image:'',featured:false,active:true,status:'available',onSale:false,salePrice:null,...extra})
const seed={
 users:[{email:'admin@mrphone.test',password:'demo1234',role:'tenant',tenant:'mrphone'},{email:'admin@otro.test',password:'demo1234',role:'tenant',tenant:'otro'},{email:'owner@plataforma.test',password:'demo1234',role:'owner',tenant:null}],
 tenants:{
  mrphone:{site:site({name:'Mr. Phone',slogan:'Tu iPhone, más cerca',description:'iPhones y celulares con garantía, financiamiento y envíos a todo el país.',phone:'809-445-8442',whatsapp:'18094458442',address:'Ave. Martin Luther King Jr., Plaza Granada Oriental, 2do nivel, local 26, Invivienda, Santo Domingo Este',mapQuery:'Plaza Granada Oriental, Santo Domingo Este',socials:{instagram:'https://www.instagram.com/mrphone_rd',facebook:'',tiktok:'',youtube:'',x:'',web:''},heroTitle:'Tu iPhone, más cerca',heroSubtitle:'Garantía, financiamiento y envíos a todo el país.',bannerTitle:'¿Tienes un iPhone viejo?',bannerText:'Lo recibimos como parte de pago por uno nuevo.',slides:[{image:'',title:'Tu iPhone, más cerca',text:'Garantía, financiamiento y envíos a todo el país.',buttonLabel:'Ver catálogo',buttonLink:'/catalogo'},{image:'',title:'Aceptamos tu iPhone como parte de pago',text:'Evaluación justa en menos de 5 minutos.',buttonLabel:'Cotizar mi iPhone',buttonLink:''},{image:'',title:'Financiamiento disponible',text:'Llévalo hoy con facilidades.',buttonLabel:'Escríbenos',buttonLink:''}]}),
   categories:[{id:'iphone',name:'iPhone'},{id:'celulares',name:'Otros celulares'},{id:'accesorios',name:'Accesorios'}],
   products:[P('iphone-13','iPhone 13','iphone',18500,'6.1" · 128 GB',{featured:true,onSale:true,salePrice:17500}),P('iphone-14','iPhone 14','iphone',25000,'6.1" · 128 GB',{from:true,status:'out'}),P('iphone-15-pro-max','iPhone 15 Pro Max','iphone',42000,'6.7" · 256 GB',{status:'soon'}),P('m17','M-Horse M17 Pro Max 4G','celulares',null,'128 GB + 8 GB RAM')],media:[]},
  otro:{site:site({name:'Negocio de ejemplo',slogan:'Otro cliente, otros datos',phone:'809-000-0000',whatsapp:'18090000000',address:'Calle Ejemplo 1, Santo Domingo',mapQuery:'Santo Domingo',primary:'#0e7c86',dark:'#0b2f33'}),categories:[{id:'general',name:'General'}],products:[P('prod-1','Producto de ejemplo','general',1500,'Descripción corta')],media:[]}}}
const load=()=>JSON.parse(localStorage.getItem(K)||'null')||seed
const save=d=>localStorage.setItem(K,JSON.stringify(d))
const tick=v=>new Promise(r=>setTimeout(()=>r(structuredClone(v)),120))
const shrink=f=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)})
export const api={
 async login(email,password){const u=load().users.find(x=>x.email===email&&x.password===password);if(!u)throw new Error('Correo o contraseña incorrectos.');return tick({email,role:u.role,tenant:u.tenant})},
 tenants:async()=>tick(Object.entries(load().tenants).map(([id,t])=>({id,name:t.site.name,website_url:t.website_url||''}))),
 async createTenant({slug:id,name,email,password,website_url}){
  const d=load();
  if(Object.hasOwn(d.tenants,id))throw new Error('Ya existe un negocio con ese slug.');
  if(d.users.some(u=>u.email.toLowerCase()===email.toLowerCase()))throw new Error('Ese correo ya tiene una cuenta.');
  d.tenants[id]={website_url,site:site({name}),categories:[],products:[],media:[]};
  d.users.push({email,password,role:'tenant',tenant:id});save(d);
  return tick({id,slug:id,name,website_url});
 },
 get:async t=>{const d=load().tenants[t];return tick({...d,tenant:{id:t,website_url:d.website_url||''}})},
 async set(t,key,val){const d=load();d.tenants[t][key]=val;save(d);return tick(val)},
 async upload(t,f){const d=load(),m={id:'m'+Date.now(),name:f.name,path:await shrink(f)};d.tenants[t].media.push(m);try{save(d)}catch{throw new Error('No hay espacio en el navegador para más imágenes de prueba.')}return tick(m)}
}
export const blankSite=site
