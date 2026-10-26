import express from 'express';

const app = express();
const port = 3001;

app.use((req, res, next) => {
  if (req.method === 'POST') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CONTENT_TYPE',
          message: 'El Content-Type debe ser application/json'
        }
      });
    }
  }
  next();
});

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.status(200).json({
    message: 'Backend de AutoSpa disponible'
  });
});

app.use('/api/orders', ordersRouter);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',

        message: 'JSON mal formado o inválido.' 
      }
    });
  }
  
  next(err); 
});

app.listen(port, () => {
  console.log(`Backend de AutoSpa disponible en http://localhost:${port}`);
});