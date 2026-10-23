import {useRef,useState} from 'react'
import {api} from '../../api.js'
import {slug} from '../../utils/format.js'
import {Field,TextInput,PageHeader,Section} from '../../components/ui/Form.jsx'

export default function CreateTenantPage({onCreated}){
 const [form,setForm]=useState({name:'',slug:'',website_url:'',email:'',password:''})
 const [busy,setBusy]=useState(false),[error,setError]=useState('')
 const pending=useRef(false)
 const set=(key,value)=>setForm(x=>({...x,[key]:value}))
 const submit=async event=>{
  event.preventDefault()
  if(pending.current)return
  const body={...form,website_url:form.website_url.trim(),name:form.name.trim(),email:form.email.trim(),slug:slug(form.slug||form.name)}
  if(!body.name||!body.slug||!body.email||body.password.length<8){setError('Completa los datos. La contraseña debe tener al menos 8 caracteres.');return}
  if(body.website_url){try{const url=new URL(body.website_url);if(!['https:','http:'].includes(url.protocol))throw 0;body.website_url=url.href}catch{setError('Escribe una URL completa con https:// o http://.');return}}
  pending.current=true;setBusy(true);setError('')
  try{const tenant=await api.createTenant(body);setForm({name:'',slug:'',website_url:'',email:'',password:''});onCreated(tenant)}
  catch(e){setError(e.message)}
  finally{pending.current=false;setBusy(false)}
 }
 return <div>
  <PageHeader title="Crear negocio" text="Crea un negocio y la cuenta que usará su administrador para entrar al panel."/>
  <form onSubmit={submit}>
   <fieldset disabled={busy} style={{border:0,padding:0,margin:0,minWidth:0}}>
    <Section title="Negocio" text="Datos iniciales del nuevo negocio.">
     <Field label="Nombre del negocio"><TextInput value={form.name} onChange={v=>set('name',v)} required/></Field>
     <Field label="Slug (opcional)" hint={`Identificador para la web: ${slug(form.slug||form.name)||'mi-negocio'}. Se genera desde el nombre si lo dejas vacío.`}><TextInput value={form.slug} onChange={v=>set('slug',v)} placeholder="mi-negocio"/></Field>
     <Field label="URL del sitio (opcional)" hint="Dirección pública de este negocio, por ejemplo https://minegocio.com."><TextInput value={form.website_url} onChange={v=>set('website_url',v)} type="url" placeholder="https://minegocio.com"/></Field>
    </Section>
    <Section title="Usuario administrador" text="Esta cuenta tendrá acceso al nuevo negocio.">
     <Field label="Correo"><TextInput value={form.email} onChange={v=>set('email',v)} type="email" autoComplete="off" required/></Field>
     <Field label="Contraseña" hint="Mínimo 8 caracteres."><TextInput value={form.password} onChange={v=>set('password',v)} type="password" autoComplete="new-password" minLength={8} required/></Field>
    </Section>
    {error&&<p className="err" role="alert">{error}</p>}
    <button className="b" type="submit">{busy?'Creando…':'Crear negocio y usuario'}</button>
   </fieldset>
  </form>
 </div>
}
