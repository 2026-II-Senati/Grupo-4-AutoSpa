import express from 'express';

import { config } from './config/env.js';
import { verifyDatabaseConnection } from './db/connection.js';
import ordersRouter from './routes/orders.routes.js';
import servicesRouter from './routes/services.routes.js';
import { isTemporaryDatabaseError } from './services/orders.service.js';

const app = express();
const port = config.port;

app.use('/api/orders', (req, res, next) => {
  if (req.method === 'POST') {
    const mediaType = req
      .get('Content-Type')
      ?.split(';')[0]
      .trim()
      .toLowerCase();

    if (mediaType !== 'application/json') {
      return res.status(415).json({
        error: {
          code: 'UNSUPPORTED_MEDIA_TYPE',
          message: 'Usa Content-Type: application/json.',
          details: [],
        },
      });
    }
  }

  next();
});

app.use(express.json({ strict: false }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    message: 'Backend de AutoSpa disponible',
  });
});

app.use('/api/orders', ordersRouter);
app.use('/api/services', servicesRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'El cuerpo de la solicitud no contiene JSON válido.',
        details: [],
      },
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'El cuerpo de la solicitud es demasiado grande.',
        details: [],
      },
    });
  }

  if (
    (err.httpStatus === 422 && err.apiCode === 'SERVICE_UNAVAILABLE') ||
    (err.httpStatus === 409 && err.apiCode === 'ACTIVE_ORDER_EXISTS')
  ) {
    return res.status(err.httpStatus).json({
      error: {
        code: err.apiCode,
        message: err.message,
        details: err.details,
      },
    });
  }

  if (isTemporaryDatabaseError(err)) {
    return res.status(503).json({
      error: {
        code: 'TEMPORARILY_UNAVAILABLE',
        message:
          'El servicio no está disponible temporalmente. Inténtalo nuevamente.',
        details: [],
      },
    });
  }

  // Registrar solo el tipo de error, sin SQL ni datos del cliente.
  console.error('Error inesperado:', err.name);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'No se pudo completar la operación. Inténtalo nuevamente.',
      details: [],
    },
  });
});

try {
  const version = await verifyDatabaseConnection();

  console.log(
    `Conectado a MySQL ${version} (base "${config.db.name}").`,
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

app.listen(port, () => {
  console.log(
    `Backend de AutoSpa disponible en http://localhost:${port}`,
  );
});