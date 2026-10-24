import express from 'express';

const app = express();
const port = 3001;

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    message: 'Backend de AutoSpa disponible',
  });
});

app.listen(port, () => {
  console.log(`Backend de AutoSpa disponible en http://localhost:${port}`);
});
