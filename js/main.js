// ===== CONFIGURACIÓN =====
const FECHA_BODA = new Date('Dec 5, 2026 14:30:00').getTime();
const FECHA_LIMITE_RSVP = new Date('Nov 1, 2026 23:59:59').getTime();

// ============================================================
// SOBRE + MARIPOSAS VOLANDO
// ============================================================

const sobreContainer = document.getElementById('sobreContainer');
const sobreWrapper = document.getElementById('sobreWrapper');
const audio = document.getElementById('musicaFondo');
const btnMusica = document.getElementById('btnMusica');
const iconoMusica = document.getElementById('iconoMusica');
const menuNavegacion = document.getElementById('menuNavegacion');
const mariposaCentral = document.getElementById('mariposaCentral');

let sobreAbierto = false;
let musicaIniciada = false;

// ===== CREAR MARIPOSAS VOLANDO =====
function crearMariposasVolando() {
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    
    const configs = [
        { ruta: 1, delay: 0, x: centroX - 60, y: centroY - 40, size: 2.0 },
        { ruta: 2, delay: 200, x: centroX + 60, y: centroY - 30, size: 1.8 },
        { ruta: 3, delay: 400, x: centroX - 80, y: centroY + 20, size: 2.2 },
        { ruta: 4, delay: 600, x: centroX + 80, y: centroY + 30, size: 1.6 },
        { ruta: 5, delay: 150, x: centroX - 40, y: centroY - 60, size: 1.9 },
        { ruta: 6, delay: 350, x: centroX + 40, y: centroY - 50, size: 2.1 },
        { ruta: 7, delay: 550, x: centroX - 100, y: centroY + 40, size: 1.7 },
        { ruta: 8, delay: 750, x: centroX + 100, y: centroY + 50, size: 2.3 },
        { ruta: 1, delay: 100, x: centroX - 20, y: centroY - 80, size: 1.5 },
        { ruta: 3, delay: 300, x: centroX + 20, y: centroY - 70, size: 2.4 },
        { ruta: 5, delay: 500, x: centroX - 120, y: centroY + 60, size: 1.4 },
        { ruta: 7, delay: 700, x: centroX + 120, y: centroY + 70, size: 2.5 },
    ];
    
    configs.forEach((config) => {
        const mariposa = document.createElement('div');
        mariposa.className = `mariposa-voladora ruta-${config.ruta}`;
        mariposa.textContent = '🦋';
        mariposa.style.position = 'fixed';
        mariposa.style.left = config.x + 'px';
        mariposa.style.top = config.y + 'px';
        mariposa.style.fontSize = config.size + 'rem';
        mariposa.style.zIndex = '15';
        mariposa.style.pointerEvents = 'none';
        mariposa.style.opacity = '0';
        
        document.body.appendChild(mariposa);
        
        setTimeout(() => {
            mariposa.style.opacity = '1';
        }, config.delay);
        
        setTimeout(() => {
            mariposa.remove();
        }, config.delay + 5000);
    });
}

// ===== ABRIR EL SOBRE =====
function abrirSobre(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (sobreAbierto) return;
    sobreAbierto = true;
    
    // 1. MÚSICA
    if (!musicaIniciada) {
        audio.volume = 0.7;
        audio.play().then(() => {
            musicaIniciada = true;
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
            btnMusica.classList.add('visible');
        }).catch(() => {
            iconoMusica.textContent = '▶️';
            btnMusica.classList.add('visible');
        });
    }
    
    // 2. ABRIR SOBRE
    sobreWrapper.classList.add('abierto');
    btnMusica.classList.add('visible');
    
    // 3. MARIPOSAS VOLANDO
    crearMariposasVolando();
    
    // 4. DESAPARECER SOBRE
    setTimeout(() => {
        sobreContainer.classList.add('abierto');
    }, 1000);
    
    // 5. MOSTRAR CONTENIDO
    setTimeout(() => {
        menuNavegacion.style.display = 'flex';
        document.body.style.overflow = 'auto';
        mariposaCentral.classList.add('visible');
        activarAnimacionesScroll();
    }, 1300);
}

// ===== ACTIVAR ANIMACIONES SCROLL =====
function activarAnimacionesScroll() {
    const items = document.querySelectorAll('.schedule-item, .info-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    items.forEach(item => observer.observe(item));
}

// ===== EVENTOS =====
sobreWrapper.addEventListener('click', abrirSobre);
sobreWrapper.addEventListener('touchstart', function(e) {
    e.preventDefault();
    abrirSobre(e);
}, { passive: false });

document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !sobreAbierto) {
        e.preventDefault();
        abrirSobre(e);
    }
});

btnMusica.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!musicaIniciada) {
        audio.volume = 0.7;
        audio.play().then(() => {
            musicaIniciada = true;
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
            btnMusica.classList.add('visible');
        }).catch(() => {
            iconoMusica.textContent = '▶️';
            btnMusica.classList.add('visible');
        });
        return;
    }
    if (audio.paused) {
        audio.play().then(() => {
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
        });
    } else {
        audio.pause();
        btnMusica.classList.remove('sonando');
        iconoMusica.textContent = '🔇';
    }
});

// ============================================================
// CONTADOR
// ============================================================

function actualizarContador() {
    const ahora = new Date().getTime();
    const distancia = FECHA_BODA - ahora;
    if (distancia < 0) {
        document.getElementById('dias').textContent = '00';
        document.getElementById('horas').textContent = '00';
        document.getElementById('minutos').textContent = '00';
        document.getElementById('segundos').textContent = '00';
        return;
    }
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);
    document.getElementById('dias').textContent = String(dias).padStart(2, '0');
    document.getElementById('horas').textContent = String(horas).padStart(2, '0');
    document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
    document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

setInterval(actualizarContador, 1000);
actualizarContador();

// ============================================================
// MODAL RSVP
// ============================================================

const modal = document.getElementById('rsvpModal');
const btnRSVP = document.getElementById('btnRSVP');
const closeModal = document.getElementById('closeModal');
const closeSuccess = document.getElementById('closeSuccess');
const form = document.getElementById('rsvpForm');
const successDiv = document.getElementById('rsvpSuccess');

function abrirModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    form.style.display = 'block';
    successDiv.style.display = 'none';
    form.reset();
}

btnRSVP.addEventListener('click', abrirModal);
closeModal.addEventListener('click', cerrarModal);
closeSuccess.addEventListener('click', cerrarModal);
modal.addEventListener('click', function(e) {
    if (e.target === modal) cerrarModal();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const invitados = document.getElementById('invitados').value || '0';
    const alergias = document.getElementById('alergias').value.trim();
    if (!nombre) {
        alert('Por favor, dinos tu nombre.');
        return;
    }
    const mensaje = `🌿 *Confirmación de asistencia* 🌿%0A%0A` +
        `👤 *Nombre:* ${nombre}%0A` +
        `📱 *Teléfono:* ${telefono || 'No especificado'}%0A` +
        `👥 *Acompañantes:* ${invitados}%0A` +
        `🍽️ *Alergias/Restricciones:* ${alergias || 'Ninguna'}%0A%0A` +
        `📅 *Evento:* Boda Alejandro & Paula - 5 de diciembre de 2026%0A` +
        `📍 *Lugar:* Camino Tromen 3.5, Hijuela 22, Temuco`;
    const url = `https://wa.me/34XXXXXXXXX?text=${mensaje}`;
    window.open(url, '_blank');
    form.style.display = 'none';
    successDiv.style.display = 'block';
    localStorage.setItem('rsvp_enviado', 'true');
});

function checkRsvpDeadline() {
    const ahora = new Date().getTime();
    if (ahora > FECHA_LIMITE_RSVP) {
        const btn = document.getElementById('btnRSVP');
        btn.innerHTML = '⏰ Plazo cerrado';
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';
        btn.disabled = true;
    }
}
checkRsvpDeadline();

document.addEventListener('DOMContentLoaded', function() {
    document.body.style.overflow = 'hidden';
});