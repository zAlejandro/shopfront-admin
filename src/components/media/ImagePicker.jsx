import { useRef } from "react";
import { assetUrl } from "../../services/api.js";
export default function ImagePicker({
  media,
  onUpload,
  onPick,
  onClose,
  toast,
}) {
  const fileInputRef = useRef();
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      onPick((await onUpload(file)).path);
    } catch (error) {
      toast(error.message);
    }
  };
  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet" onClick={(event) => event.stopPropagation()}>
        <div className="between">
          <h3>Imágenes</h3>
          <button className="b ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleUpload}
        />
        <button className="b" onClick={() => fileInputRef.current.click()}>
          Subir imagen
        </button>

        {!media.length && (
          <p className="mut">
            Aún no hay imágenes. Sube la primera para usarla aquí.
          </p>
        )}
        <div className="mgrid">
          {media.map((mediaItem) => (
            <button
              key={mediaItem.id}
              className="mi"
              onClick={() => onPick(mediaItem.path)}
            >
              <img src={assetUrl(mediaItem.path)} alt="" />
              <small>{mediaItem.name}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
