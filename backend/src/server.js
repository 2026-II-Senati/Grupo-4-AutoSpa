import express from 'express';
import { config } from './config/env.js';
import { verifyDatabaseConnection } from './db/connection.js';

const app = express();
const port = config.port;

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    message: 'Backend de AutoSpa disponible',
  });
});

try {
  const version = await verifyDatabaseConnection();
  console.log(`Conectado a MySQL ${version} (base "${config.db.name}").`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Backend de AutoSpa disponible en http://localhost:${port}`);
});
