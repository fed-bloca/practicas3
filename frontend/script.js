// Conectar al servidor de la VM - USAR TU IP
const socket = io('http://192.168.100.84:3000');

const cpuBar = document.getElementById('cpu-bar');
const cpuText = document.getElementById('cpu-text');
const memBar = document.getElementById('mem-bar');
const memText = document.getElementById('mem-text');
const tempText = document.getElementById('temp-text');
const status = document.getElementById('status');

// Eventos de conexión
socket.on('connect', () => {
    console.log('✅ Conectado al servidor WebSocket');
    status.textContent = '✅ Servidor ENCENDIDO';
    status.style.color = '#4CAF50';
});

socket.on('disconnect', () => {
    console.log('❌ Desconectado del servidor');
    status.textContent = '❌ Servidor APAGADO';
    status.style.color = '#f44336';
});

socket.on('connect_error', (error) => {
    console.log('❌ Error de conexión:', error);
    status.textContent = '❌ Error de conexión';
    status.style.color = '#ff9800';
});

// Recibir datos en tiempo real
socket.on('datos-sistema', (data) => {
    console.log('Datos recibidos:', data);
    
    // Actualizar CPU
    const cpuPercent = data.cpu || 0;
    cpuBar.style.width = cpuPercent + '%';
    cpuText.textContent = cpuPercent.toFixed(2) + '%';
    
    // Actualizar Memoria
    const memPercent = data.memoria || 0;
    memBar.style.width = memPercent + '%';
    memText.textContent = memPercent + '%';
    
    // Actualizar Temperatura
    const temp = data.temperatura || 'N/A';
    tempText.textContent = temp + '°C';
});