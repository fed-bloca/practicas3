const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const systemInformation = require('systeminformation');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'Servidor de monitoreo funcionando!' });
});

// Ruta para obtener datos del sistema (API REST)
app.get('/api/sistema', async (req, res) => {
  try {
    const cpu = await systemInformation.cpu();
    const mem = await systemInformation.mem();
    const osInfo = await systemInformation.osInfo();
    
    res.json({
      cpu: cpu,
      memoria: mem,
      sistema: osInfo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket para tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  // Enviar datos cada 2 segundos
  const interval = setInterval(async () => {
    try {
      const cpu = await systemInformation.currentLoad();
      const mem = await systemInformation.mem();
      const temp = await systemInformation.cpuTemperature();
      
      socket.emit('datos-sistema', {
        cpu: cpu.currentload,
        memoria: Math.round((mem.used / mem.total) * 100),
        temperatura: temp.main
      });
    } catch (error) {
      console.log('Error:', error);
    }
  }, 2000);
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
    clearInterval(interval);
  });
});

// INICIALIZAR SERVIDOR - VERSIÓN CORREGIDA
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Servidor de monitoreo INICIADO');
  console.log(`🖥️  Desde la VM: http://localhost:${PORT}`);
  console.log(`🌐 Desde tu PC: http://192.168.100.84:${PORT}`);
  console.log(`📊 API disponible: http://192.168.100.84:${PORT}/api/sistema`);
});