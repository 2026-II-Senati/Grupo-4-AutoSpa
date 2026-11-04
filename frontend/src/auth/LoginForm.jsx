import { useState } from 'react';
import { login } from './authApi.js';

function AutoSpaMark() {
  return <span className="brand-mark" aria-hidden="true">A</span>;
}

export function LoginForm({ onLogin }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(event.currentTarget);
    try {
      const user = await login({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      await onLogin(user);
    } catch (error) {
      setErrorMessage(error.status === 401
        ? 'Correo o contraseña incorrectos.'
        : error instanceof Error ? error.message : 'No se pudo iniciar sesión. Inténtalo nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-screen">
      <section className="auth-card" aria-labelledby="login-title">
        <a className="brand auth-brand" href="#inicio" aria-label="AutoSpa, inicio">
          <AutoSpaMark />
          <span>Auto<span className="brand-accent">Spa</span></span>
        </a>
        <div className="auth-heading">
          <div className="eyebrow"><span className="eyebrow-line" /> BIENVENIDO</div>
          <h1 id="login-title">Iniciar sesión</h1>
          <p>Ingresa tus credenciales para continuar.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Correo electrónico
            <input name="email" type="email" autoComplete="email" required disabled={submitting} />
          </label>
          <label>
            Contraseña
            <input name="password" type="password" autoComplete="current-password" required disabled={submitting} />
          </label>
          {errorMessage && <p className="form-feedback error" role="alert">{errorMessage}</p>}
          <button className="submit-order" type="submit" disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
}
