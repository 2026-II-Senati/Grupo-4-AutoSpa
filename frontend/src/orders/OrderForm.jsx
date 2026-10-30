import { useState } from 'react';
import { createOrder, getApiErrorMessage } from './ordersApi.js';

const initialValues = { customerName: '', customerPhone: '', plate: '', serviceId: '' };
const money = (amount) => Number(amount || 0).toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });

export function OrderForm({ services, loadingServices, servicesError, onCreated }) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const selectedService = services.find((service) => String(service.id) === values.serviceId);
  const unavailable = !loadingServices && !servicesError && services.length === 0;

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFeedback(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting || unavailable) return;
    setFeedback(null);
    if (!values.customerName.trim() || !values.plate.trim() || !values.serviceId) {
      setFeedback({ type: 'error', message: 'Completa todos los campos obligatorios.' });
      return;
    }
    if (values.customerName.trim().length > 100) {
      setFeedback({ type: 'error', message: 'El nombre del cliente admite hasta 100 caracteres.' });
      return;
    }
    if (!/^[a-z0-9]{3}-?[0-9]{3}$/i.test(values.plate.trim())) {
      setFeedback({ type: 'error', message: 'Ingresa una placa válida de seis caracteres.' });
      return;
    }
    const phone = values.customerPhone.trim();
    if (phone && !/^\+?[0-9]{7,15}$/.test(phone)) {
      setFeedback({ type: 'error', message: 'Ingresa un teléfono de 7 a 15 dígitos, con + inicial opcional.' });
      return;
    }
    setSubmitting(true);
    try {
      await createOrder({
        customerName: values.customerName.trim(),
        customerPhone: phone || null,
        plate: values.plate.trim().toUpperCase().replace('-', ''),
        serviceId: Number(values.serviceId),
      });
      setValues(initialValues);
      setFeedback({ type: 'success', message: 'Orden registrada correctamente.' });
      await onCreated();
    } catch (error) {
      setFeedback({ type: 'error', message: getApiErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="order-card" aria-labelledby="new-order-title">
      <div className="card-heading">
        <div><span className="section-kicker">NUEVA ATENCIÓN</span><h2 id="new-order-title">Registrar orden</h2></div>
        <span className="required-note">* Campos obligatorios</span>
      </div>
      {loadingServices && <p className="inline-info" role="status">Cargando servicios…</p>}
      {servicesError && <p className="inline-error" role="alert">{servicesError}</p>}
      {unavailable && <p className="inline-info" role="status">No hay servicios disponibles. No es posible registrar una orden.</p>}
      <form className="order-form" onSubmit={submit}>
        <label>Nombre del cliente <span>*</span><input name="customerName" value={values.customerName} onChange={update} required maxLength={100} autoComplete="name" placeholder="Nombre y apellido" /></label>
        <label>Teléfono <small>(opcional)</small><input name="customerPhone" value={values.customerPhone} onChange={update} type="tel" maxLength={16} autoComplete="tel" placeholder="Ej. +51987654321" /></label>
        <label>Placa del vehículo <span>*</span><input name="plate" value={values.plate} onChange={update} required minLength={6} maxLength={7} autoCapitalize="characters" placeholder="Ej. ABC-123" /></label>
        <label>Servicio <span>*</span><select name="serviceId" value={values.serviceId} onChange={update} required disabled={loadingServices || unavailable || servicesError}>
          <option value="">Selecciona un servicio</option>
          {services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}
        </select></label>
        <div className="selected-price" aria-live="polite"><span>Precio del servicio</span><strong>{selectedService ? money(selectedService.price) : '—'}</strong></div>
        {feedback && <p className={`form-feedback ${feedback.type}`} role={feedback.type === 'error' ? 'alert' : 'status'}>{feedback.message}</p>}
        <button className="submit-order" type="submit" disabled={submitting || loadingServices || Boolean(servicesError) || unavailable}>
          {submitting ? <><span className="spinner" aria-hidden="true" /> Registrando…</> : 'Registrar orden'}
        </button>
      </form>
    </section>
  );
}
