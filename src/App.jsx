import {useState,useEffect,useRef} from 'react'
import {api,assetUrl} from './api.js'
import {SlidesEditor} from './SlidesEditor.jsx'
import CreateTenantPage from './features/owner/CreateTenantPage.jsx'

const slug=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const money=n=>n==null||n===''?'Consultar precio':'RD$'+Number(n).toLocaleString('en-US')
const ST={available:'Disponible',soon:'Próximamente',out:'Agotado'}
export const F=({label,hint,children})=><label className="f"><span>{label}</span>{children}{hint&&<small>{hint}</small>}</label>
export const T=({v,on,area,...p})=>area?<textarea rows="3" value={v??''} onChange={e=>on(e.target.value)} {...p}/>:<input value={v??''} onChange={e=>on(e.target.value)} {...p}/>
const Chk=({label,v,on})=><label className="chk"><input type="checkbox" checked={!!v} onChange={e=>on(e.target.checked)}/>{label}</label>
const Sec=({title,text,children})=><section className="sec"><div><h3>{title}</h3><p>{text}</p></div><div className="fields">{children}</div></section>
const Head=({title,text,right})=><div className="head"><div><h2>{title}</h2><p>{text}</p></div>{right}</div>

function Picker({media,onUpload,onPick,onClose,toast}){
 const ref=useRef()
 const up=async e=>{const f=e.target.files[0];if(!f)return;try{onPick((await onUpload(f)).path)}catch(x){toast(x.message)}}
 return <div className="modal" onClick={onClose}><div className="sheet" onClick={e=>e.stopPropagation()}>
  <div className="between"><h3>Imágenes</h3><button className="b ghost" onClick={onClose}>Cerrar</button></div>
  <input ref={ref} type="file" accept="image/*" hidden onChange={up}/><button className="b" onClick={()=>ref.current.click()}>Subir imagen</button>
  {!media.length&&<p className="mut">Aún no hay imágenes. Sube la primera para usarla aquí.</p>}
  <div className="mgrid">{media.map(m=><button key={m.id} className="mi" onClick={()=>onPick(m.path)}><img src={assetUrl(m.path)} alt=""/><small>{m.name}</small></button>)}</div></div></div>
}
export function ImageField({label,value,on,media,onUpload,toast}){
 const [open,setOpen]=useState(false)
 return <div className="f"><span>{label}</span><div className="img"><div className="thumb">{value?<img src={assetUrl(value)} alt=""/>:'Sin imagen'}</div>
  <button type="button" className="b ghost" onClick={()=>setOpen(true)}>{value?'Cambiar':'Elegir imagen'}</button>{value&&<button type="button" className="b ghost" onClick={()=>on('')}>Quitar</button>}</div>
  {open&&<Picker media={media} onUpload={onUpload} toast={toast} onClose={()=>setOpen(false)} onPick={p=>{on(p);setOpen(false)}}/>}</div>
}
const SaveBar=({dirty,onSave,onReset})=>dirty?<div className="savebar"><span>Tienes cambios sin guardar</span><button className="b ghost" onClick={onReset}>Descartar</button><button className="b" onClick={onSave}>Guardar cambios</button></div>:null

function SitePage({d,save,upload,toast}){
 const [s,setS]=useState(d.site),set=(k,v)=>setS(x=>({...x,[k]:v})),dirty=JSON.stringify(s)!==JSON.stringify(d.site)
 const soc=(k,v)=>set('socials',{...s.socials,[k]:v}),tr=(i,k,v)=>set('trust',s.trust.map((x,j)=>j===i?{...x,[k]:v}:x))
 const img=(k,l)=><ImageField label={l} value={s[k]} on={v=>set(k,v)} media={d.media} onUpload={upload} toast={toast}/>
 return <div><Head title="Sitio web" text="Todo lo que se ve en la web pública."/>
  <Sec title="Negocio" text="Nombre, eslogan y logo."><F label="Nombre del negocio"><T v={s.name} on={v=>set('name',v)}/></F><F label="Eslogan"><T v={s.slogan} on={v=>set('slogan',v)}/></F><F label="Descripción corta"><T area v={s.description} on={v=>set('description',v)}/></F>{img('logo','Logo')}</Sec>
  <Sec title="Contacto" text="Cómo te escriben tus clientes."><F label="Teléfono visible"><T v={s.phone} on={v=>set('phone',v)}/></F><F label="WhatsApp" hint="Solo números con código de país. Ej: 18094458442"><T v={s.whatsapp} on={v=>set('whatsapp',v)} inputMode="numeric"/></F><F label="Mensaje inicial de WhatsApp"><T v={s.whatsappMsg} on={v=>set('whatsappMsg',v)}/></F><F label="Correo"><T v={s.email} on={v=>set('email',v)} type="email"/></F><F label="Dirección"><T area v={s.address} on={v=>set('address',v)}/></F><F label="Horario" hint="Una línea por renglón."><T area v={s.hours} on={v=>set('hours',v)}/></F></Sec>
  <Sec title="Ubicación en el mapa" text="Lo que escribas aquí es lo que busca Google Maps."><F label="Búsqueda del mapa" hint="Nombre del negocio, calle o dirección completa."><T v={s.mapQuery} on={v=>set('mapQuery',v)}/></F>{s.mapQuery&&<iframe className="map" title="Mapa" src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`}/>}</Sec>
  <Sec title="Redes sociales" text="Deja vacías las que no uses y no se mostrarán.">{Object.keys(s.socials).map(k=><F key={k} label={k[0].toUpperCase()+k.slice(1)}><T v={s.socials[k]} on={v=>soc(k,v)} placeholder="https://"/></F>)}</Sec>
  <Sec title="Portada y colores" text="La primera impresión de la web."><div className="two"><F label="Color principal"><input type="color" value={s.primary} onChange={e=>set('primary',e.target.value)}/></F><F label="Color oscuro"><input type="color" value={s.dark} onChange={e=>set('dark',e.target.value)}/></F></div><F label="Título de portada"><T v={s.heroTitle} on={v=>set('heroTitle',v)}/></F><F label="Subtítulo"><T v={s.heroSubtitle} on={v=>set('heroSubtitle',v)}/></F>{img('heroImage','Imagen de portada')}<F label="Título del banner"><T v={s.bannerTitle} on={v=>set('bannerTitle',v)}/></F><F label="Texto del banner"><T v={s.bannerText} on={v=>set('bannerText',v)}/></F></Sec>
  <Sec title="Carrusel de portada" text="Slides de la plantilla con carrusel. Si no agregas ninguno se usa la imagen de portada."><SlidesEditor value={s.slides||[]} onChange={v=>set('slides',v)} media={d.media} onUpload={upload} toast={toast}/></Sec>
  <Sec title="Franja de confianza" text="Cuatro puntos que dan seguridad al cliente.">{s.trust.map((t,i)=><div className="two trust" key={i}><F label="Ícono"><T v={t.icon} on={v=>tr(i,'icon',v)}/></F><F label="Título"><T v={t.title} on={v=>tr(i,'title',v)}/></F><F label="Texto"><T v={t.text} on={v=>tr(i,'text',v)}/></F></div>)}</Sec>
  <Sec title="Secciones visibles" text="Activa o quita bloques de la web."><Chk label="Reseñas" v={s.showReviews} on={v=>set('showReviews',v)}/><Chk label="Banner de cotización" v={s.showBanner} on={v=>set('showBanner',v)}/><Chk label="Cinta de anuncios" v={s.showTicker} on={v=>set('showTicker',v)}/></Sec>
  <SaveBar dirty={dirty} onReset={()=>setS(d.site)} onSave={async()=>{await save('site',s);toast('Cambios guardados')}}/></div>
}

function Cats({d,save,upload,toast}){
 const [c,setC]=useState(d.categories),[n,setN]=useState(''),dirty=JSON.stringify(c)!==JSON.stringify(d.categories)
 const used=id=>d.products.some(p=>p.category===id),mv=(i,j)=>{if(j<0||j>=c.length)return;const a=[...c];[a[i],a[j]]=[a[j],a[i]];setC(a)}
 const add=()=>{const id=slug(n);if(!id||c.some(x=>x.id===id))return toast('Esa categoría ya existe o está vacía.');setC([...c,{id,name:n.trim(),image:''}]);setN('')}
 return <div><Head title="Categorías" text="El orden de esta lista es el orden del menú de la web."/>
  <div className="list">{c.map((x,i)=><div className="row" key={x.id}><input value={x.name} onChange={e=>setC(c.map((y,j)=>j===i?{...y,name:e.target.value}:y))}/><ImageField label="" value={x.image} on={v=>setC(c.map((y,j)=>j===i?{...y,image:v}:y))} media={d.media} onUpload={upload} toast={toast}/><small className="mut">{x.id}</small>
   <button className="b ghost" onClick={()=>mv(i,i-1)} aria-label="Subir">↑</button><button className="b ghost" onClick={()=>mv(i,i+1)} aria-label="Bajar">↓</button>
   <button className="b danger" disabled={used(x.id)} title={used(x.id)?'Tiene productos':''} onClick={()=>setC(c.filter((_,j)=>j!==i))}>Eliminar</button></div>)}
   <div className="row"><input placeholder="Nueva categoría" value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>e.key==='Enter'&&add()}/><button className="b" onClick={add}>Agregar categoría</button></div></div>
  <SaveBar dirty={dirty} onReset={()=>setC(d.categories)} onSave={async()=>{await save('categories',c);toast('Categorías guardadas')}}/></div>
}

function Products({d,save,upload,toast}){
 const [q,setQ]=useState(''),[cat,setCat]=useState(''),[ed,setEd]=useState(null),[st,setSt]=useState('')
 const list=d.products.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())&&(!cat||p.category===cat)&&(!st||(st==='sale'?p.onSale:(p.status||'available')===st)))
 const blank={name:'',category:d.categories[0]?.id||'',price:null,from:false,spec:'',description:'',image:'',featured:false,active:true,status:'available'}
 const commit=async p=>{if(!p.name.trim())return toast('Escribe el nombre del producto.');if(p.onSale&&(p.price==null||p.salePrice==null||p.salePrice>=p.price))return toast('El precio de oferta debe ser menor al precio normal.');const all=p.id?d.products.map(x=>x.id===p.id?p:x):[...d.products,{...p,id:slug(p.name)+'-'+Date.now().toString(36)}];await save('products',all);setEd(null);toast('Producto guardado')}
 const del=async p=>{if(confirm(`¿Eliminar "${p.name}"?`)){await save('products',d.products.filter(x=>x.id!==p.id));setEd(null);toast('Producto eliminado')}}
 const e=ed,set=(k,v)=>setEd(x=>({...x,[k]:v}))
 return <div><Head title="Productos" text={`${d.products.length} productos en total.`} right={<button className="b" onClick={()=>setEd(blank)}>Nuevo producto</button>}/>
  <div className="filters"><input placeholder="Buscar producto" value={q} onChange={e=>setQ(e.target.value)}/><select value={cat} onChange={e=>setCat(e.target.value)}><option value="">Todas las categorías</option>{d.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><select value={st} onChange={e=>setSt(e.target.value)}><option value="">Todos los estados</option>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}<option value="sale">En oferta</option></select></div>
  <div className="list">{list.map(p=><button className="row prod" key={p.id} onClick={()=>setEd(p)}><div className="thumb sm">{p.image?<img src={assetUrl(p.image)} alt=""/>:''}</div><b>{p.name}</b><span className="mut">{d.categories.find(c=>c.id===p.category)?.name}</span><span>{p.onSale&&p.salePrice!=null?<><s className="mut">{money(p.price)}</s> <b>{money(p.salePrice)}</b></>:<>{p.from&&p.price!=null?'Desde ':''}{money(p.price)}</>}</span><span className={'tag '+(p.active?(p.status||'available'):'off')}>{p.active?ST[p.status||'available']:'Oculto'}</span></button>)}
   {!list.length&&<p className="mut pad">No hay productos con ese filtro. Prueba otra búsqueda o crea uno nuevo.</p>}</div>
  {e&&<div className="modal" onClick={()=>setEd(null)}><div className="sheet wide" onClick={x=>x.stopPropagation()}><h3>{e.id?'Editar producto':'Nuevo producto'}</h3>
   <F label="Nombre"><T v={e.name} on={v=>set('name',v)}/></F>
   <div className="two"><F label="Categoría"><select value={e.category} onChange={x=>set('category',x.target.value)}>{d.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></F><F label="Precio (RD$)" hint="Vacío = Consultar precio"><T v={e.price} type="number" min="0" on={v=>set('price',v===''?null:Number(v))}/></F></div>
   {e.onSale&&<F label="Precio de oferta (RD$)" hint={e.price==null?'Primero escribe el precio normal.':'Debe ser menor al precio normal.'}><T v={e.salePrice} type="number" min="0" on={v=>set('salePrice',v===''?null:Number(v))}/></F>}
   <F label="Detalle corto"><T v={e.spec} on={v=>set('spec',v)}/></F><F label="Descripción"><T area v={e.description} on={v=>set('description',v)}/></F>
   <F label="Disponibilidad" hint="Próximamente y Agotado siguen visibles en la web, pero sin compra directa."><select value={e.status||'available'} onChange={x=>set('status',x.target.value)}>{Object.entries(ST).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></F>
   <ImageField label="Imagen" value={e.image} on={v=>set('image',v)} media={d.media} onUpload={upload} toast={toast}/>
   <div className="checks"><Chk label='Mostrar "Desde"' v={e.from} on={v=>set('from',v)}/><Chk label="En oferta" v={e.onSale} on={v=>set('onSale',v)}/><Chk label="Destacado en inicio" v={e.featured} on={v=>set('featured',v)}/><Chk label="Visible en la web (si lo desmarcas, se oculta)" v={e.active} on={v=>set('active',v)}/></div>
   <div className="between">{e.id?<button className="b danger" onClick={()=>del(e)}>Eliminar</button>:<span/>}<div className="row"><button className="b ghost" onClick={()=>setEd(null)}>Cancelar</button><button className="b" onClick={()=>commit(e)}>Guardar producto</button></div></div></div></div>}</div>
}

function Media({d,upload,save,toast}){
 const ref=useRef()
 const up=async e=>{for(const f of e.target.files){try{await upload(f)}catch(x){toast(x.message)}}toast('Imágenes subidas')}
 return <div><Head title="Imágenes" text="Biblioteca del negocio. Se eligen desde productos y sitio." right={<><input ref={ref} type="file" accept="image/*" multiple hidden onChange={up}/><button className="b" onClick={()=>ref.current.click()}>Subir imágenes</button></>}/>
  {!d.media.length&&<p className="mut pad">Todavía no hay imágenes. Sube fotos de tus productos y del local.</p>}
  <div className="mgrid big">{d.media.map(m=><div className="mi" key={m.id}><img src={assetUrl(m.path)} alt=""/><small>{m.name}</small><button className="b danger" onClick={()=>confirm('¿Eliminar esta imagen?')&&save('media',d.media.filter(x=>x.id!==m.id))}>Eliminar</button></div>)}</div></div>
}

function Login({onLogin}){
 const [email,setE]=useState(''),[pw,setP]=useState(''),[err,setErr]=useState('')
 const go=async ev=>{ev.preventDefault();try{onLogin(await api.login(email,pw))}catch(x){setErr(x.message)}}
 return <div className="login"><form onSubmit={go}><h1>Panel de administración</h1><p className="mut">Entra para editar tu web.</p>
  <F label="Correo"><T v={email} on={setE} type="email" autoComplete="username"/></F><F label="Contraseña"><T v={pw} on={setP} type="password" autoComplete="current-password"/></F>
  {err&&<p className="err" role="alert">{err}</p>}<button className="b big">Entrar</button>
  <div className="demo"><b>Cuentas de prueba</b><p>admin@mrphone.test (negocio Mr. Phone)<br/>admin@otro.test (otro negocio)<br/>owner@plataforma.test (ve todos los negocios)<br/>Contraseña: demo1234</p></div></form></div>
}

const tabs=[['site','Sitio web'],['products','Productos'],['cats','Categorías'],['media','Imágenes']]
function Shell({u,onLogout}){
 const [t,setT]=useState(u.tenant),[all,setAll]=useState([]),[tab,setTab]=useState('site'),[msg,setMsg]=useState('')
 const [d,setD]=useState(null)
 useEffect(()=>{if(u.role==='owner')api.tenants().then(l=>{setAll(l);setT(x=>x||l[0]?.id)}).catch(e=>toast(e.message))},[])
 useEffect(()=>{if(t){setD(null);api.get(t).then(setD).catch(e=>toast(e.message))}},[t])
 const toast=m=>{setMsg(m);setTimeout(()=>setMsg(''),2400)}
 const save=async(k,v)=>{try{const r=await api.set(t,k,v);setD(x=>({...x,[k]:r??v}));return r}catch(e){toast(e.message);throw e}}
 const upload=async f=>{const m=await api.upload(t,f);setD(x=>({...x,media:[...x.media,m]}));return m}
 const created=tenant=>{setAll(items=>[...items,tenant]);setT(tenant.id);setTab('site');toast('Negocio y usuario creados correctamente')}
 const rawSiteUrl=u.role==='owner'?all.find(x=>x.id===t)?.website_url:d?.tenant?.website_url
 let siteUrl=''
 try{const url=new URL(rawSiteUrl);if(['https:','http:'].includes(url.protocol))siteUrl=url.href}catch{}
 const P={d,save,upload,toast,key:t+tab}
 return <div className="shell"><aside><div className="brand">{d?.site.name||'Panel'}</div>
  <nav>{tabs.map(([k,l])=><button key={k} className={tab===k?'on':''} onClick={()=>setTab(k)}>{l}</button>)}{u.role==='owner'&&<button className={tab==='createTenant'?'on':''} onClick={()=>setTab('createTenant')}>Crear negocio</button>}</nav>
  <div className="foot">{u.role==='owner'&&<select value={t||''} onChange={e=>setT(e.target.value)} aria-label="Negocio">{all.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>}
   {siteUrl?<a className="b ghost" href={siteUrl} target="_blank" rel="noopener noreferrer">Ver sitio</a>:<button className="b ghost" disabled title="Este negocio no tiene una URL de sitio configurada">Ver sitio</button>}<small>{u.email}</small><button className="b ghost" onClick={onLogout}>Cerrar sesión</button></div></aside>
  <main>{u.role==='owner'&&tab==='createTenant'?<CreateTenantPage onCreated={created}/>:!t?<p className="mut">No hay negocios. Crea el primero desde el menú.</p>:!d?<p className="mut">Cargando…</p>:tab==='site'?<SitePage {...P}/>:tab==='products'?<Products {...P}/>:tab==='cats'?<Cats {...P}/>:<Media {...P}/>}</main>
  {msg&&<div className="toast" role="status">{msg}</div>}</div>
}
export default function App(){
 const [u,setU]=useState(()=>JSON.parse(sessionStorage.getItem('u')||'null'))
 const on=x=>{sessionStorage.setItem('u',JSON.stringify(x));setU(x)},out=()=>{api.logout?.();sessionStorage.removeItem('u');setU(null)}
 return u?<Shell u={u} onLogout={out}/>:<Login onLogin={on}/>
}
