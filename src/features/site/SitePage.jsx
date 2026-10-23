import { useState } from "react";
import {
  Field,
  TextInput,
  Checkbox,
  Section,
  PageHeader,
} from "../../components/ui/Form.jsx";
import SaveBar from "../../components/ui/SaveBar.jsx";
import ImageField from "../../components/media/ImageField.jsx";
export default function SitePage({ data, save, upload, toast }) {
  const [site, setSite] = useState(data.site);
  const setField = (key, value) =>
    setSite((item) => ({
      ...item,
      [key]: value,
    }));
  const dirty = JSON.stringify(site) !== JSON.stringify(data.site);
  const setSocial = (key, value) =>
    setField("socials", {
      ...site.socials,
      [key]: value,
    });
  const setTrustItem = (index, key, value) =>
    setField(
      "trust",
      site.trust.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [key]: value,
            }
          : item,
      ),
    );
  const renderImageField = (key, label) => (
    <ImageField
      label={label}
      value={site[key]}
      onChange={(value) => setField(key, value)}
      media={data.media}
      onUpload={upload}
      toast={toast}
    />
  );
  return (
    <div>
      <PageHeader
        title="Sitio web"
        text="Todo lo que se ve en la web pública."
      />
      <Section title="Negocio" text="Nombre, eslogan y logo.">
        <Field label="Nombre del negocio">
          <TextInput
            value={site.name}
            onChange={(value) => setField("name", value)}
          />
        </Field>
        <Field label="Eslogan">
          <TextInput
            value={site.slogan}
            onChange={(value) => setField("slogan", value)}
          />
        </Field>
        <Field label="Descripción corta">
          <TextInput
            multiline
            value={site.description}
            onChange={(value) => setField("description", value)}
          />
        </Field>
        {renderImageField("logo", "Logo")}
      </Section>
      <Section title="Contacto" text="Cómo te escriben tus clientes.">
        <Field label="Teléfono visible">
          <TextInput
            value={site.phone}
            onChange={(value) => setField("phone", value)}
          />
        </Field>
        <Field
          label="WhatsApp"
          hint="Solo números con código de país. Ej: 18094458442"
        >
          <TextInput
            value={site.whatsapp}
            onChange={(value) => setField("whatsapp", value)}
            inputMode="numeric"
          />
        </Field>
        <Field label="Mensaje inicial de WhatsApp">
          <TextInput
            value={site.whatsappMsg}
            onChange={(value) => setField("whatsappMsg", value)}
          />
        </Field>
        <Field label="Correo">
          <TextInput
            value={site.email}
            onChange={(value) => setField("email", value)}
            type="email"
          />
        </Field>
        <Field label="Dirección">
          <TextInput
            multiline
            value={site.address}
            onChange={(value) => setField("address", value)}
          />
        </Field>
        <Field label="Horario" hint="Una línea por renglón.">
          <TextInput
            multiline
            value={site.hours}
            onChange={(value) => setField("hours", value)}
          />
        </Field>
      </Section>
      <Section
        title="Ubicación en el mapa"
        text="Lo que escribas aquí es lo que busca Google Maps."
      >
        <Field
          label="Búsqueda del mapa"
          hint="Nombre del negocio, calle o dirección completa."
        >
          <TextInput
            value={site.mapQuery}
            onChange={(value) => setField("mapQuery", value)}
          />
        </Field>
        {site.mapQuery && (
          <iframe
            className="map"
            title="Mapa"
            src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`}
          />
        )}
      </Section>
      <Section
        title="Redes sociales"
        text="Deja vacías las que no uses y no se mostrarán."
      >
        {Object.keys(site.socials).map((key) => (
          <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
            <TextInput
              value={site.socials[key]}
              onChange={(value) => setSocial(key, value)}
              placeholder="https://"
            />
          </Field>
        ))}
      </Section>
      <Section title="Portada y colores" text="La primera impresión de la web.">
        <div className="two">
          <Field label="Color principal">
            <input
              type="color"
              value={site.primary}
              onChange={(e) => setField("primary", e.target.value)}
            />
          </Field>
          <Field label="Color oscuro">
            <input
              type="color"
              value={site.dark}
              onChange={(e) => setField("dark", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Título de portada">
          <TextInput
            value={site.heroTitle}
            onChange={(value) => setField("heroTitle", value)}
          />
        </Field>
        <Field label="Subtítulo">
          <TextInput
            value={site.heroSubtitle}
            onChange={(value) => setField("heroSubtitle", value)}
          />
        </Field>
        {renderImageField("heroImage", "Imagen de portada")}
        <Field label="Título del banner">
          <TextInput
            value={site.bannerTitle}
            onChange={(value) => setField("bannerTitle", value)}
          />
        </Field>
        <Field label="Texto del banner">
          <TextInput
            value={site.bannerText}
            onChange={(value) => setField("bannerText", value)}
          />
        </Field>
      </Section>
      <Section
        title="Franja de confianza"
        text="Cuatro puntos que dan seguridad al cliente."
      >
        {site.trust.map((item, index) => (
          <div className="two trust" key={index}>
            <Field label="Ícono">
              <TextInput
                value={item.icon}
                onChange={(value) => setTrustItem(index, "icon", value)}
              />
            </Field>
            <Field label="Título">
              <TextInput
                value={item.title}
                onChange={(value) => setTrustItem(index, "title", value)}
              />
            </Field>
            <Field label="Texto">
              <TextInput
                value={item.text}
                onChange={(value) => setTrustItem(index, "text", value)}
              />
            </Field>
          </div>
        ))}
      </Section>
      <Section
        title="Secciones visibles"
        text="Activa o quita bloques de la web."
      >
        <Checkbox
          label="Reseñas"
          value={site.showReviews}
          onChange={(value) => setField("showReviews", value)}
        />
        <Checkbox
          label="Banner de cotización"
          value={site.showBanner}
          onChange={(value) => setField("showBanner", value)}
        />
        <Checkbox
          label="Cinta de anuncios"
          value={site.showTicker}
          onChange={(value) => setField("showTicker", value)}
        />
      </Section>
      <SaveBar
        dirty={dirty}
        onReset={() => setSite(data.site)}
        onSave={async () => {
          await save("site", site);
          toast("Cambios guardados");
        }}
      />
    </div>
  );
}
