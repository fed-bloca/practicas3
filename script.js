// Conectar al servidor de la VM
const socket = io('http://192.168.100.84:3000');

const cpuBar = document.getElementById('cpu-bar');
const cpuText = document.getElementById('cpu-text');
const memBar = document.getElementById('mem-bar');
const memText = document.getElementById('mem-text');
const tempText = document.getElementById('temp-text');
const status = document.getElementById('status');

socket.on('connect', () => {
    status.textContent = '\u2705 Conectado al servidor';
    status.style.color = '#4CAF50';
});

socket.on('disconnect', () => {
    status.textContent = '\u274c Desconectado del servidor';
    status.style.color = '#f44336';
});

// Recibir datos en tiempo real del servidor
socket.on('datos-sistema', (data) => {
    // Actualizar CPU
    cpuBar.style.width = data.cpu + '%';
    cpuText.textContent = data.cpu + '%';
    
    // Actualizar Memoria
    memBar.style.width = data.memoria + '%';
    memText.textContent = data.memoria + '%';
    
    // Actualizar Temperatura
    tempText.textContent = data.temperatura + '�C';
});