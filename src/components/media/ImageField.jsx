import { useState } from "react";
import { assetUrl } from "../../services/api.js";
import ImagePicker from "./ImagePicker.jsx";
export default function ImageField({
  label,
  value,
  onChange,
  media,
  onUpload,
  toast,
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="f">
      <span>{label}</span>
      <div className="img">
        <div className="thumb">
          {value ? <img src={assetUrl(value)} alt="" /> : "Sin imagen"}
        </div>
        <button type="button" className="b ghost" onClick={() => setOpen(true)}>
          {value ? "Cambiar" : "Elegir imagen"}
        </button>
        {value && (
          <button
            type="button"
            className="b ghost"
            onClick={() => onChange("")}
          >
            Quitar
          </button>
        )}
      </div>

      {open && (
        <ImagePicker
          media={media}
          onUpload={onUpload}
          toast={toast}
          onClose={() => setOpen(false)}
          onPick={(path) => {
            onChange(path);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
