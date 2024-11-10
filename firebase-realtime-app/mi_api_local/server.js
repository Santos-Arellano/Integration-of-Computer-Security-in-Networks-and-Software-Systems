const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001; // Puedes cambiar el puerto si es necesario

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia esto si tu usuario es diferente
  password: 'tu_contraseña_aqui', // Cambia esto a tu contraseña
  database: 'mi_base_de_datos' // Nombre de tu base de datos
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para guardar datos
app.post('/usuarios', (req, res) => {
  const { matricula, nombre, semestre } = req.body;
  const query = 'INSERT INTO usuarios (matricula, nombre, semestre) VALUES (?, ?, ?)';
  
  db.query(query, [matricula, nombre, semestre], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, matricula, nombre, semestre });
  });
});

// Ruta para obtener datos
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios ORDER BY timestamp DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor API escuchando en http://localhost:${port}`);
});