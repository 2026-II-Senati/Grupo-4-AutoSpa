import express from 'express';
import ordersRouter from './routes/orders.routes.js';

const app = express();
const port = 3001;

app.use('/api/orders', (req, res, next) => {
  if (req.method === 'POST') {
    const contentType = req.get('Content-Type');
    const mediaType = contentType
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

  console.error('Error inesperado al procesar la solicitud:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'No se pudo completar la operación. Inténtalo nuevamente.',
      details: [],
    },
  });
});

app.listen(port, () => {
  console.log(
    `Backend de AutoSpa disponible en http://localhost:${port}`,
  );
});