import { useState } from "react";
import { PageHeader } from "../../components/ui/Form.jsx";
import SaveBar from "../../components/ui/SaveBar.jsx";
import { slug } from "../../utils/format.js";
export default function CategoriesPage({ data, save, toast }) {
  const [categories, setCategories] = useState(data.categories);
  const [newName, setNewName] = useState("");
  const dirty = JSON.stringify(categories) !== JSON.stringify(data.categories);
  const isCategoryUsed = (id) =>
    data.products.some((product) => product.category === id);
  const moveCategory = (index, targetIndex) => {
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    setCategories(reordered);
  };
  const addCategory = () => {
    const id = slug(newName);
    if (!id || categories.some((category) => category.id === id))
      return toast("Esa categoría ya existe o está vacía.");
    setCategories([
      ...categories,
      {
        id,
        name: newName.trim(),
      },
    ]);
    setNewName("");
  };
  return (
    <div>
      <PageHeader
        title="Categorías"
        text="El orden de esta lista es el orden del menú de la web."
      />
      <div className="list">
        {categories.map((category, index) => (
          <div className="row" key={category.id}>
            <input
              value={category.name}
              onChange={(e) =>
                setCategories(
                  categories.map((category, targetIndex) =>
                    targetIndex === index
                      ? {
                          ...category,
                          name: e.target.value,
                        }
                      : category,
                  ),
                )
              }
            />
            <small className="mut">{category.id}</small>
            <button
              className="b ghost"
              onClick={() => moveCategory(index, index - 1)}
              aria-label="Subir"
            >
              ↑
            </button>
            <button
              className="b ghost"
              onClick={() => moveCategory(index, index + 1)}
              aria-label="Bajar"
            >
              ↓
            </button>
            <button
              className="b danger"
              disabled={isCategoryUsed(category.id)}
              title={isCategoryUsed(category.id) ? "Tiene productos" : ""}
              onClick={() =>
                setCategories(
                  categories.filter((_, targetIndex) => targetIndex !== index),
                )
              }
            >
              Eliminar
            </button>
          </div>
        ))}
        <div className="row">
          <input
            placeholder="Nueva categoría"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
          />
          <button className="b" onClick={addCategory}>
            Agregar categoría
          </button>
        </div>
      </div>
      <SaveBar
        dirty={dirty}
        onReset={() => setCategories(data.categories)}
        onSave={async () => {
          await save("categories", categories);
          toast("Categorías guardadas");
        }}
      />
    </div>
  );
}
