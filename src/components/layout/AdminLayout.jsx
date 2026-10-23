import { useState } from "react";
import useAdminData from "../../hooks/useAdminData.js";
import SitePage from "../../features/site/SitePage.jsx";
import ProductsPage from "../../features/products/ProductsPage.jsx";
import CategoriesPage from "../../features/categories/CategoriesPage.jsx";
import MediaPage from "../../features/media/MediaPage.jsx";
const pages = {
  site: SitePage,
  products: ProductsPage,
  cats: CategoriesPage,
  media: MediaPage,
};
const tabs = [
  ["site", "Sitio web"],
  ["products", "Productos"],
  ["cats", "Categorías"],
  ["media", "Imágenes"],
];
export default function AdminLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("site");
  const { tenantId, setTenantId, tenants, data, message, save, upload, toast } =
    useAdminData(user);
  const ActivePage = pages[activeTab];
  const pageProps = {
    data,
    save,
    upload,
    toast,
    key: tenantId + activeTab,
  };
  return (
    <div className="shell">
      <aside>
        <div className="brand">{data?.site.name || "Panel"}</div>
        <nav>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={activeTab === key ? "on" : ""}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="foot">
          {user.role === "owner" && (
            <select
              value={tenantId || ""}
              onChange={(e) => setTenantId(e.target.value)}
              aria-label="Negocio"
            >
              {tenants.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          )}
          <a
            className="b ghost"
            href={import.meta.env.VITE_SITE_URL || "#"}
            target="_blank"
            rel="noreferrer"
          >
            Ver sitio
          </a>
          <small>{user.email}</small>
          <button className="b ghost" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main>
        {!data ? (
          <p className="mut">Cargando…</p>
        ) : (
          <ActivePage {...pageProps} />
        )}
      </main>

      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </div>
  );
}
