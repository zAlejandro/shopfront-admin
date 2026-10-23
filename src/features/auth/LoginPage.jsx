import { useState } from "react";
import { api } from "../../services/api.js";
import { Field, TextInput } from "../../components/ui/Form.jsx";
export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      onLogin(await api.login(email, password));
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Panel de administración</h1>
        <p className="mut">Entra para editar tu web.</p>
        <Field label="Correo">
          <TextInput
            value={email}
            onChange={setEmail}
            type="email"
            autoComplete="username"
          />
        </Field>
        <Field label="Contraseña">
          <TextInput
            value={password}
            onChange={setPassword}
            type="password"
            autoComplete="current-password"
          />
        </Field>

        {error && (
          <p className="err" role="alert">
            {error}
          </p>
        )}
        <button className="b big">Entrar</button>
        <div className="demo">
          <b>Cuentas de prueba</b>
          <p>
            admin@mrphone.test (negocio Mr. Phone)
            <br />
            admin@otro.test (otro negocio)
            <br />
            owner@plataforma.test (ve todos los negocios)
            <br />
            Contraseña: demo1234
          </p>
        </div>
      </form>
    </div>
  );
}
