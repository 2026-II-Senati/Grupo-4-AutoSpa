import { useState } from 'react';
import { createOrder, getApiErrorMessage } from './ordersApi.js';

const initialValues = {
  customerName: '',
  customerPhone: '',
  plate: '',
  serviceId: '',
  vehicleBrand: '',
  vehicleModel: '',
  vehicleType: '',
  vehicleSize: '',
  dirtLevel: '',
  extraVacuum: false,
  extraWaxing: false,
  engineCleaning: false,
  discountAmount: '0.00',
};

const money = (amount) =>
  Number(amount || 0).toLocaleString('es-PE', {
    style: 'currency',
    currency: 'PEN',
  });

const vehicleTypes = [
  { value: 'automovil', label: 'Automóvil' },
  { value: 'suv', label: 'SUV' },
  { value: 'camioneta', label: 'Camioneta' },
  { value: 'furgoneta', label: 'Furgoneta' },
  { value: 'motocicleta', label: 'Motocicleta' },
];

const vehicleSizes = [
  { value: 'pequeno', label: 'Pequeño' },
  { value: 'mediano', label: 'Mediano' },
  { value: 'grande', label: 'Grande' },
];

const dirtLevels = [
  { value: 'bajo', label: 'Bajo' },
  { value: 'medio', label: 'Medio' },
  { value: 'alto', label: 'Alto' },
];

export function OrderForm({
  services,
  loadingServices,
  servicesError,
  onCreated,
}) {
  const [values, setValues] = useState(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const selectedService = services.find(
    (service) => String(service.id) === values.serviceId,
  );

  const unavailable =
    !loadingServices && !servicesError && services.length === 0;

  const servicePrice = Number(selectedService?.price || 0);
  const discount = Number(values.discountAmount || 0);
  const validDiscount =
    Number.isFinite(discount) &&
    discount >= 0 &&
    /^\d+(\.\d{1,2})?$/.test(values.discountAmount || '0');

  const previewFinalPrice =
    validDiscount && discount <= servicePrice
      ? Math.round((servicePrice - discount) * 100) / 100
      : null;

  function update(event) {
    const { name, value, type, checked } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setFeedback(null);
  }

  async function submit(event) {
    event.preventDefault();

    if (submitting || unavailable) return;

    setFeedback(null);

    if (
      !values.customerName.trim() ||
      !values.plate.trim() ||
      !values.serviceId ||
      !values.vehicleType ||
      !values.vehicleSize ||
      !values.dirtLevel
    ) {
      setFeedback({
        type: 'error',
        message: 'Completa todos los campos obligatorios.',
      });
      return;
    }

    if (values.customerName.trim().length > 100) {
      setFeedback({
        type: 'error',
        message: 'El nombre del cliente admite hasta 100 caracteres.',
      });
      return;
    }

    if (!/^[a-z0-9]{3}-?[0-9]{3}$/i.test(values.plate.trim())) {
      setFeedback({
        type: 'error',
        message: 'Ingresa una placa válida de seis caracteres.',
      });
      return;
    }

    const phone = values.customerPhone.trim();

    if (phone && !/^\+?[0-9]{7,15}$/.test(phone)) {
      setFeedback({
        type: 'error',
        message: 'Ingresa un teléfono de 7 a 15 dígitos.',
      });
      return;
    }

    if (
      !validDiscount ||
      discount > servicePrice
    ) {
      setFeedback({
        type: 'error',
        message:
          'El descuento debe ser válido y no puede superar el precio del servicio.',
      });
      return;
    }

    setSubmitting(true);

    try {
      await createOrder({
        customerName: values.customerName.trim(),
        customerPhone: phone || null,
        plate: values.plate.trim().toUpperCase().replace('-', ''),
        serviceId: Number(values.serviceId),

        vehicleBrand: values.vehicleBrand.trim() || null,
        vehicleModel: values.vehicleModel.trim() || null,
        vehicleType: values.vehicleType,
        vehicleSize: values.vehicleSize,
        dirtLevel: values.dirtLevel,

        extraVacuum: values.extraVacuum,
        extraWaxing: values.extraWaxing,
        engineCleaning: values.engineCleaning,

        discountAmount: discount,
      });

      setValues(initialValues);

      setFeedback({
        type: 'success',
        message: 'Orden registrada correctamente.',
      });

      await onCreated();
    } catch (error) {
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="order-card" aria-labelledby="new-order-title">
      <div className="card-heading">
        <div>
          <span className="section-kicker">NUEVA ATENCIÓN</span>
          <h2 id="new-order-title">Registrar orden</h2>
        </div>
        <span className="required-note">* Obligatorio</span>
      </div>

      {loadingServices && (
        <p className="inline-info" role="status">
          Cargando servicios...
        </p>
      )}

      {servicesError && (
        <p className="inline-error" role="alert">
          {servicesError}
        </p>
      )}

      {unavailable && (
        <p className="inline-info" role="status">
          No hay servicios disponibles. No es posible registrar una orden.
        </p>
      )}

      <form className="order-form" onSubmit={submit}>
        <h3 className="form-section-title">Datos del cliente</h3>

        <label>
          Nombre del cliente <span>*</span>
          <input
            name="customerName"
            value={values.customerName}
            onChange={update}
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Nombre y apellido"
          />
        </label>

        <label>
          Teléfono <small>(opcional)</small>
          <input
            name="customerPhone"
            value={values.customerPhone}
            onChange={update}
            type="tel"
            maxLength={16}
            autoComplete="tel"
            placeholder="Ej. +51987654321"
          />
        </label>

        <label>
          Placa del vehículo <span>*</span>
          <input
            name="plate"
            value={values.plate}
            onChange={update}
            required
            minLength={6}
            maxLength={7}
            autoCapitalize="characters"
            placeholder="Ej. ABC-123"
          />
        </label>

        <div className="form-divider" />

        <h3 className="form-section-title">Características del vehículo</h3>

        <label>
          Marca <small>(opcional)</small>
          <input
            name="vehicleBrand"
            value={values.vehicleBrand}
            onChange={update}
            maxLength={80}
            placeholder="Ej. Toyota"
          />
        </label>

        <label>
          Modelo <small>(opcional)</small>
          <input
            name="vehicleModel"
            value={values.vehicleModel}
            onChange={update}
            maxLength={80}
            placeholder="Ej. Corolla"
          />
        </label>

        <label>
          Tipo de vehículo <span>*</span>
          <select
            name="vehicleType"
            value={values.vehicleType}
            onChange={update}
            required
          >
            <option value="">Selecciona el tipo</option>
            {vehicleTypes.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tamaño del vehículo <span>*</span>
          <select
            name="vehicleSize"
            value={values.vehicleSize}
            onChange={update}
            required
          >
            <option value="">Selecciona el tamaño</option>
            {vehicleSizes.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nivel de suciedad <span>*</span>
          <select
            name="dirtLevel"
            value={values.dirtLevel}
            onChange={update}
            required
          >
            <option value="">Selecciona el nivel</option>
            {dirtLevels.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <div className="form-divider" />

        <h3 className="form-section-title">Servicio y adicionales</h3>

        <label>
          Servicio principal <span>*</span>
          <select
            name="serviceId"
            value={values.serviceId}
            onChange={update}
            required
            disabled={loadingServices || unavailable || servicesError}
          >
            <option value="">Selecciona un servicio</option>
            {services.map((service) => (
              <option value={service.id} key={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <div className="extra-options">
          <label className="checkbox-option">
            <input
              type="checkbox"
              name="extraVacuum"
              checked={values.extraVacuum}
              onChange={update}
            />
            <span>Aspirado adicional</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              name="extraWaxing"
              checked={values.extraWaxing}
              onChange={update}
            />
            <span>Encerado adicional</span>
          </label>

          <label className="checkbox-option">
            <input
              type="checkbox"
              name="engineCleaning"
              checked={values.engineCleaning}
              onChange={update}
            />
            <span>Limpieza de motor</span>
          </label>

          <p className="field-help">
            Los adicionales se registran para el análisis, pero por ahora no
            incrementan el precio.
          </p>
        </div>

        <div className="form-divider" />

        <h3 className="form-section-title">Precio y descuento</h3>

        <label>
          Descuento autorizado (S/)
          <input
            name="discountAmount"
            type="number"
            min="0"
            max={selectedService ? servicePrice : undefined}
            step="0.01"
            inputMode="decimal"
            value={values.discountAmount}
            onChange={update}
            disabled={!selectedService}
          />
        </label>

        <div className="price-summary" aria-live="polite">
          <div>
            <span>Precio del servicio</span>
            <strong>
              {selectedService ? money(servicePrice) : '—'}
            </strong>
          </div>

          <div>
            <span>Descuento</span>
            <strong>{money(validDiscount ? discount : 0)}</strong>
          </div>

          <div className="price-total">
            <span>Precio final estimado</span>
            <strong>
              {previewFinalPrice !== null
                ? money(previewFinalPrice)
                : 'Verifica el descuento'}
            </strong>
          </div>
        </div>

        <p className="field-help">
          El precio definitivo será calculado y validado por el servidor.
        </p>

        {feedback && (
          <p
            className={`form-feedback ${feedback.type}`}
            role={feedback.type === 'error' ? 'alert' : 'status'}
          >
            {feedback.message}
          </p>
        )}

        <button
          className="submit-order"
          type="submit"
          disabled={
            submitting ||
            loadingServices ||
            Boolean(servicesError) ||
            unavailable
          }
        >
          {submitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Registrando...
            </>
          ) : (
            'Registrar orden'
          )}
        </button>
      </form>
    </section>
  );
}