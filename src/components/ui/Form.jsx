export const Field = ({ label, hint, children }) => (
  <label className="f">
    <span>{label}</span>
    {children}
    {hint && <small>{hint}</small>}
  </label>
);
export const TextInput = ({ value, onChange, multiline, ...p }) =>
  multiline ? (
    <textarea
      rows="3"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...p}
    />
  ) : (
    <input
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      {...p}
    />
  );
export const Checkbox = ({ label, value, onChange }) => (
  <label className="chk">
    <input
      type="checkbox"
      checked={!!value}
      onChange={(e) => onChange(e.target.checked)}
    />
    {label}
  </label>
);
export const Section = ({ title, text, children }) => (
  <section className="sec">
    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
    <div className="fields">{children}</div>
  </section>
);
export const PageHeader = ({ title, text, right }) => (
  <div className="head">
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    {right}
  </div>
);
