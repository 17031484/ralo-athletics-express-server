import express from 'express';
import cors from 'cors';
const { Pool } = require('pg');

export const app = express();

const pool = new Pool({
  host: 'containers-us-west-1.railway.app',
  port: 5775,
  database: 'railway',
  user: 'postgres',
  password: '8RoIxmHAuq6gW7wafLCJ',
});

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'HELLO FROM SERVER!' });
});

app.get('/getAllUsers', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM tu_tabla');
    res.json(result.rows);
    client.release();
  } catch (error) {
    console.error('Error al consultar la base de datos', error);
    res.status(500).send('Error del servidor');
  }
});

// Version the api
app.use('/api/v1', api);
