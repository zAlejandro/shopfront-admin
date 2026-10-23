import { F, T, ImageField } from './App.jsx'

const MAX = 8
const blank = { image: '', title: '', text: '', buttonLabel: '', buttonLink: '' }

// Editor de la lista de slides del carrusel de portada. Guarda en site.slides (JSON, sin cambios en la base de datos).
export function SlidesEditor({ value, onChange, media, onUpload, toast }) {
  const update = (i, key, v) => onChange(value.map((s, j) => (j === i ? { ...s, [key]: v } : s)))
  const move = (i, j) => {
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="slides">
      {!value.length && <p className="mut">Sin slides, la plantilla usa la imagen de portada.</p>}
      {value.map((s, i) => (
        <div className="slide-edit" key={i}>
          <div className="between">
            <b>Slide {i + 1}</b>
            <div className="acts">
              <button className="b ghost" onClick={() => move(i, i - 1)} aria-label="Subir">↑</button>
              <button className="b ghost" onClick={() => move(i, i + 1)} aria-label="Bajar">↓</button>
              <button className="b danger" onClick={() => onChange(value.filter((_, j) => j !== i))}>Eliminar</button>
            </div>
          </div>
          <ImageField label="Imagen" value={s.image} on={(v) => update(i, 'image', v)} media={media} onUpload={onUpload} toast={toast} />
          <F label="Título"><T v={s.title} on={(v) => update(i, 'title', v)} /></F>
          <F label="Texto"><T area v={s.text} on={(v) => update(i, 'text', v)} /></F>
          <div className="two">
            <F label="Texto del botón" hint="Vacío = Escríbenos por WhatsApp"><T v={s.buttonLabel} on={(v) => update(i, 'buttonLabel', v)} /></F>
            <F label="Enlace del botón" hint="Vacío = abre WhatsApp. Ej: /catalogo"><T v={s.buttonLink} on={(v) => update(i, 'buttonLink', v)} /></F>
          </div>
        </div>
      ))}
      <button className="b" disabled={value.length >= MAX} onClick={() => onChange([...value, { ...blank }])}>
        {value.length >= MAX ? `Máximo ${MAX} slides` : 'Agregar slide'}
      </button>
    </div>
  )
}
