# Vitrina Admin

Panel de administración con React y Vite.

## Desarrollo

```sh
npm install
npm run dev
npm run build
```

## Dónde modificar cada cosa

- `src/App.jsx`: punto de entrada; muestra el login o el panel según la sesión.
- `src/features/auth/`: pantalla de inicio de sesión.
- `src/features/site/`: configuración del sitio web.
- `src/features/categories/`: creación, orden y edición de categorías.
- `src/features/products/`: listado, filtros y editor de productos; estados disponibles en `constants.js`.
- `src/features/media/`: biblioteca de imágenes.
- `src/components/layout/`: navegación y estructura del panel.
- `src/components/ui/`: campos, secciones, encabezados y barra de guardado compartidos.
- `src/components/media/`: selector y campo de imagen reutilizables.
- `src/hooks/useSession.js`: sesión del usuario y acceso a sessionStorage.
- `src/hooks/useAdminData.js`: selección del negocio, carga, guardado, subidas y avisos.
- `src/services/api.js`: selecciona el adaptador según `VITE_DATA_SOURCE` (`mock` por defecto, `api` para backend).
- `src/services/api.mock.js` y `api.real.js`: implementaciones de datos con la misma interfaz.
- `src/utils/format.js`: formato de precios y generación de slugs.
- `src/styles.css`: estilos del panel.

Las pantallas reciben `data`, `save`, `upload` y `toast` según lo que necesitan. El layout cambia la clave de la pantalla al cambiar de negocio o pestaña, reiniciando el estado local de sus formularios.


### URL pública por negocio
El panel usa `website_url` por tenant para el botón Ver sitio; ya no usa `VITE_SITE_URL`. Solo abre URLs HTTP/HTTPS y desactiva el botón cuando no hay una URL válida.

Contrato requerido en la API (los cambios de base de datos y backend se realizan por separado):
- `POST /owner/tenants`: aceptar `website_url` opcional junto a `slug`, `name`, `email` y `password`, persistirla y devolverla en el tenant creado.
- `GET /owner/tenants`: incluir `website_url` en cada tenant.
- `GET /admin/tenant`: incluir `tenant: {id, website_url}` para que los usuarios de negocio también puedan abrir su sitio.

El formulario Crear negocio permite introducir esta URL. Hasta que la API implemente este contrato, no se guardará la URL y el botón permanecerá desactivado.
