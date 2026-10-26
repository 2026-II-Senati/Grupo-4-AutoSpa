import express from 'express';
import ordersRouter from './routes/orders.routes.js';
import servicesRouter from './routes/services.routes.js';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use('/api/services', servicesRouter);
app.use('/api/orders', ordersRouter);

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    message: 'Backend de AutoSpa disponible',
  });
});

app.use((error, _request, response, _next) => {
  console.error('Error al consultar datos de AutoSpa.');
  response.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'No fue posible procesar la solicitud',
  });
});

app.listen(port, () => {
  console.log(`Backend de AutoSpa disponible en http://localhost:${port}`);
});
