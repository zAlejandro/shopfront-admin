import { useState } from "react";
import { assetUrl } from "../../services/api.js";
import { PageHeader } from "../../components/ui/Form.jsx";
import { slug, money } from "../../utils/format.js";
import { PRODUCT_STATUS } from "./constants.js";
import ProductEditor from "./ProductEditor.jsx";
export default function ProductsPage({ data, save, upload, toast }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [status, setStatus] = useState("");
  const filteredProducts = data.products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) &&
      (!category || product.category === category) &&
      (!status ||
        (status === "sale"
          ? product.onSale
          : (product.status || "available") === status)),
  );
  const newProduct = {
    name: "",
    category: data.categories[0]?.id || "",
    price: null,
    from: false,
    spec: "",
    description: "",
    image: "",
    featured: false,
    active: true,
    status: "available",
  };
  const saveProduct = async (product) => {
    if (!product.name.trim()) return toast("Escribe el nombre del producto.");
    if (
      product.onSale &&
      (product.price == null ||
        product.salePrice == null ||
        product.salePrice >= product.price)
    )
      return toast("El precio de oferta debe ser menor al precio normal.");
    const all = product.id
      ? data.products.map((item) => (item.id === product.id ? product : item))
      : [
          ...data.products,
          {
            ...product,
            id: slug(product.name) + "-" + Date.now().toString(36),
          },
        ];
    await save("products", all);
    setEditingProduct(null);
    toast("Producto guardado");
  };
  const deleteProduct = async (product) => {
    if (confirm(`¿Eliminar "${product.name}"?`)) {
      await save(
        "products",
        data.products.filter((item) => item.id !== product.id),
      );
      setEditingProduct(null);
      toast("Producto eliminado");
    }
  };
  const setProductField = (key, value) =>
    setEditingProduct((item) => ({
      ...item,
      [key]: value,
    }));
  return (
    <div>
      <PageHeader
        title="Productos"
        text={`${data.products.length} productos en total.`}
        right={
          <button className="b" onClick={() => setEditingProduct(newProduct)}>
            Nuevo producto
          </button>
        }
      />
      <div className="filters">
        <input
          placeholder="Buscar producto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {data.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(PRODUCT_STATUS).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
          <option value="sale">En oferta</option>
        </select>
      </div>
      <div className="list">
        {filteredProducts.map((product) => (
          <button
            className="row prod"
            key={product.id}
            onClick={() => setEditingProduct(product)}
          >
            <div className="thumb sm">
              {product.image ? (
                <img src={assetUrl(product.image)} alt="" />
              ) : (
                ""
              )}
            </div>
            <b>{product.name}</b>
            <span className="mut">
              {
                data.categories.find(
                  (category) => category.id === product.category,
                )?.name
              }
            </span>
            <span>
              {product.onSale && product.salePrice != null ? (
                <>
                  <s className="mut">{money(product.price)}</s>{" "}
                  <b>{money(product.salePrice)}</b>
                </>
              ) : (
                <>
                  {product.from && product.price != null ? "Desde " : ""}
                  {money(product.price)}
                </>
              )}
            </span>
            <span
              className={
                "tag " +
                (product.active ? product.status || "available" : "off")
              }
            >
              {product.active
                ? PRODUCT_STATUS[product.status || "available"]
                : "Oculto"}
            </span>
          </button>
        ))}
        {!filteredProducts.length && (
          <p className="mut pad">
            No hay productos con ese filtro. Prueba otra búsqueda o crea uno
            nuevo.
          </p>
        )}
      </div>

      {editingProduct && (
        <ProductEditor
          product={editingProduct}
          categories={data.categories}
          media={data.media}
          upload={upload}
          toast={toast}
          onChange={setProductField}
          onClose={() => setEditingProduct(null)}
          onSave={saveProduct}
          onDelete={deleteProduct}
        />
      )}
    </div>
  );
}
