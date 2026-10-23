import { useRef } from "react";
import { assetUrl } from "../../services/api.js";
import { PageHeader } from "../../components/ui/Form.jsx";
export default function MediaPage({ data, upload, save, toast }) {
  const fileInputRef = useRef();
  const handleUpload = async (event) => {
    for (const file of event.target.files) {
      try {
        await upload(file);
      } catch (error) {
        toast(error.message);
      }
    }
    toast("Imágenes subidas");
  };
  return (
    <div>
      <PageHeader
        title="Imágenes"
        text="Biblioteca del negocio. Se eligen desde productos y sitio."
        right={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleUpload}
            />
            <button className="b" onClick={() => fileInputRef.current.click()}>
              Subir imágenes
            </button>
          </>
        }
      />

      {!data.media.length && (
        <p className="mut pad">
          Todavía no hay imágenes. Sube fotos de tus productos y del local.
        </p>
      )}
      <div className="mgrid big">
        {data.media.map((mediaItem) => (
          <div className="mi" key={mediaItem.id}>
            <img src={assetUrl(mediaItem.path)} alt="" />
            <small>{mediaItem.name}</small>
            <button
              className="b danger"
              onClick={() =>
                confirm("¿Eliminar esta imagen?") &&
                save(
                  "media",
                  data.media.filter((error) => error.id !== mediaItem.id),
                )
              }
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
