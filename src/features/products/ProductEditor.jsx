import { Field, TextInput, Checkbox } from "../../components/ui/Form.jsx";
import ImageField from "../../components/media/ImageField.jsx";
import { PRODUCT_STATUS } from "./constants.js";
export default function ProductEditor({
  product,
  categories,
  media,
  upload,
  toast,
  onChange,
  onClose,
  onSave,
  onDelete,
}) {
  return (
    <div className="modal" onClick={onClose}>
      <div className="sheet wide" onClick={(event) => event.stopPropagation()}>
        <h3>{product.id ? "Editar producto" : "Nuevo producto"}</h3>
        <Field label="Nombre">
          <TextInput
            value={product.name}
            onChange={(value) => onChange("name", value)}
          />
        </Field>
        <div className="two">
          <Field label="Categoría">
            <select
              value={product.category}
              onChange={(event) => onChange("category", event.target.value)}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Precio (RD$)" hint="Vacío = Consultar precio">
            <TextInput
              value={product.price}
              type="number"
              min="0"
              onChange={(value) =>
                onChange("price", value === "" ? null : Number(value))
              }
            />
          </Field>
        </div>

        {product.onSale && (
          <Field
            label="Precio de oferta (RD$)"
            hint={
              product.price == null
                ? "Primero escribe el precio normal."
                : "Debe ser menor al precio normal."
            }
          >
            <TextInput
              value={product.salePrice}
              type="number"
              min="0"
              onChange={(value) =>
                onChange("salePrice", value === "" ? null : Number(value))
              }
            />
          </Field>
        )}
        <Field label="Detalle corto">
          <TextInput
            value={product.spec}
            onChange={(value) => onChange("spec", value)}
          />
        </Field>
        <Field label="Descripción">
          <TextInput
            multiline
            value={product.description}
            onChange={(value) => onChange("description", value)}
          />
        </Field>
        <Field
          label="Disponibilidad"
          hint="Próximamente y Agotado siguen visibles en la web, pero sin compra directa."
        >
          <select
            value={product.status || "available"}
            onChange={(event) => onChange("status", event.target.value)}
          >
            {Object.entries(PRODUCT_STATUS).map(([status, value]) => (
              <option key={status} value={status}>
                {value}
              </option>
            ))}
          </select>
        </Field>
        <ImageField
          label="Imagen"
          value={product.image}
          onChange={(value) => onChange("image", value)}
          media={media}
          onUpload={upload}
          toast={toast}
        />
        <div className="checks">
          <Checkbox
            label='Mostrar "Desde"'
            value={product.from}
            onChange={(value) => onChange("from", value)}
          />
          <Checkbox
            label="En oferta"
            value={product.onSale}
            onChange={(value) => onChange("onSale", value)}
          />
          <Checkbox
            label="Destacado en inicio"
            value={product.featured}
            onChange={(value) => onChange("featured", value)}
          />
          <Checkbox
            label="Visible en la web (si lo desmarcas, se oculta)"
            value={product.active}
            onChange={(value) => onChange("active", value)}
          />
        </div>
        <div className="between">
          {product.id ? (
            <button className="b danger" onClick={() => onDelete(product)}>
              Eliminar
            </button>
          ) : (
            <span />
          )}
          <div className="row">
            <button className="b ghost" onClick={onClose}>
              Cancelar
            </button>
            <button className="b" onClick={() => onSave(product)}>
              Guardar producto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
