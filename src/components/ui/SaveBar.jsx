export default function SaveBar({ dirty, onSave, onReset }) {
  return dirty ? (
    <div className="savebar">
      <span>Tienes cambios sin guardar</span>
      <button className="b ghost" onClick={onReset}>
        Descartar
      </button>
      <button className="b" onClick={onSave}>
        Guardar cambios
      </button>
    </div>
  ) : null;
}
