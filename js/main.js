// ===== CONFIGURACIÓN =====
const FECHA_BODA = new Date('Dec 5, 2026 14:30:00').getTime();
const FECHA_LIMITE_RSVP = new Date('Nov 1, 2026 23:59:59').getTime();

// ============================================================
// ===== SOBRE + MÚSICA + MARIPOSAS MEJORADO =====
// ============================================================

const sobreContainer = document.getElementById('sobreContainer');
const sobreWrapper = document.getElementById('sobreWrapper');
const audio = document.getElementById('musicaFondo');
const btnMusica = document.getElementById('btnMusica');
const iconoMusica = document.getElementById('iconoMusica');
const menuNavegacion = document.getElementById('menuNavegacion');
const mariposaCentral = document.getElementById('mariposaCentral');

let musicaIniciada = false;
let sobreAbierto = false;

// ===== CREAR MARIPOSAS VOLANDO DESDE EL SOBRE =====
function crearMariposasVolando() {
    const contenedor = document.body;
    const centroX = window.innerWidth / 2;
    const centroY = window.innerHeight / 2;
    
    const mariposasConfig = [
        { x: centroX - 40, y: centroY - 30, destinoX: '10%', destinoY: '15%', retraso: 0, duracion: 3.5 },
        { x: centroX + 40, y: centroY - 20, destinoX: '85%', destinoY: '10%', retraso: 200, duracion: 4.0 },
        { x: centroX - 60, y: centroY + 10, destinoX: '5%', destinoY: '40%', retraso: 400, duracion: 3.0 },
        { x: centroX + 60, y: centroY + 20, destinoX: '90%', destinoY: '35%', retraso: 600, duracion: 4.5 },
        { x: centroX - 20, y: centroY - 50, destinoX: '15%', destinoY: '65%', retraso: 300, duracion: 3.8 },
        { x: centroX + 20, y: centroY - 40, destinoX: '80%', destinoY: '60%', retraso: 500, duracion: 4.2 },
        { x: centroX - 80, y: centroY + 30, destinoX: '20%', destinoY: '85%', retraso: 700, duracion: 3.2 },
        { x: centroX + 80, y: centroY + 40, destinoX: '75%', destinoY: '80%', retraso: 800, duracion: 4.8 },
        { x: centroX, y: centroY - 60, destinoX: '50%', destinoY: '5%', retraso: 150, duracion: 3.6 },
        { x: centroX, y: centroY + 50, destinoX: '50%', destinoY: '92%', retraso: 450, duracion: 3.9 }
    ];
    
    mariposasConfig.forEach((config, index) => {
        const mariposa = document.createElement('div');
        mariposa.className = `mariposa-voladora ruta-${(index % 4) + 1}`;
        mariposa.textContent = '🦋';
        mariposa.style.left = config.x + 'px';
        mariposa.style.top = config.y + 'px';
        mariposa.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
        mariposa.style.opacity = '0';
        mariposa.style.transform = 'scale(0.3) rotate(0deg)';
        mariposa.style.position = 'fixed';
        mariposa.style.pointerEvents = 'none';
        mariposa.style.zIndex = '15';
        
        contenedor.appendChild(mariposa);
        
        setTimeout(() => {
            mariposa.style.transition = `all ${config.duracion}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
            mariposa.style.opacity = '0.3';
            mariposa.style.left = config.destinoX;
            mariposa.style.top = config.destinoY;
            mariposa.style.transform = `rotate(${Math.random() * 720}deg) scale(1)`;
            
            setTimeout(() => {
                mariposa.style.animation = `floatButterfly ${12 + Math.random() * 8}s infinite ease-in-out`;
                mariposa.style.animationDelay = (Math.random() * 5) + 's';
                mariposa.style.opacity = '0.15';
            }, config.duracion * 1000 + 500);
            
        }, config.retraso);
    });
    
    crearEstelaMariposas(centroX, centroY);
}

function crearEstelaMariposas(x, y) {
    const estela = document.createElement('div');
    estela.style.position = 'fixed';
    estela.style.left = (x - 100) + 'px';
    estela.style.top = (y - 100) + 'px';
    estela.style.width = '200px';
    estela.style.height = '200px';
    estela.style.pointerEvents = 'none';
    estela.style.zIndex = '12';
    estela.style.background = 'radial-gradient(circle, rgba(82, 183, 136, 0.08) 0%, transparent 70%)';
    estela.style.borderRadius = '50%';
    estela.style.animation = 'expandirEstela 2s ease-out forwards';
    document.body.appendChild(estela);
    
    setTimeout(() => {
        estela.remove();
    }, 2500);
}

// Añadir keyframe para la estela
const styleEstela = document.createElement('style');
styleEstela.textContent = `
    @keyframes expandirEstela {
        0% {
            transform: scale(0.5);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleEstela);

// ===== ABRIR EL SOBRE =====
function abrirSobre(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (sobreAbierto) return;
    sobreAbierto = true;
    
    // 1. INICIAR LA MÚSICA
    if (!musicaIniciada) {
        audio.volume = 0.7;
        audio.play().then(() => {
            musicaIniciada = true;
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
            btnMusica.classList.add('visible');
            console.log('🎵 Música iniciada');
        }).catch(error => {
            console.log('Error al iniciar música:', error);
            iconoMusica.textContent = '▶️';
            btnMusica.classList.add('visible');
        });
    }
    
    // 2. ABRIR EL SOBRE
    sobreWrapper.classList.add('abierto');
    btnMusica.classList.add('visible');
    
    // 3. CREAR MARIPOSAS VOLANDO
    crearMariposasVolando();
    
    // 4. EFECTO DE BRILLO en el sello
    const sello = document.querySelector('.sobre-sello');
    if (sello) {
        sello.style.animation = 'pulseSello 0.5s ease-in-out 3';
        setTimeout(() => {
            sello.style.animation = 'pulseSello 2s ease-in-out infinite';
        }, 1500);
    }
    
    // 5. DESAPARECER EL SOBRE
    setTimeout(() => {
        sobreContainer.classList.add('abierto');
    }, 900);
    
    // 6. MOSTRAR CONTENIDO
    setTimeout(() => {
        menuNavegacion.style.display = 'flex';
        document.body.style.overflow = 'auto';
        mariposaCentral.classList.add('visible');
        activarAnimacionesScroll();
        
        setTimeout(() => {
            crearMariposasAdicionales();
        }, 2000);
        
    }, 1100);
}

function crearMariposasAdicionales() {
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            const mariposa = document.createElement('div');
            mariposa.className = 'butterfly';
            mariposa.textContent = '🦋';
            mariposa.style.position = 'fixed';
            mariposa.style.zIndex = '10';
            mariposa.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
            mariposa.style.pointerEvents = 'none';
            mariposa.style.opacity = '0.08';
            mariposa.style.left = (10 + Math.random() * 80) + '%';
            mariposa.style.top = (10 + Math.random() * 80) + '%';
            mariposa.style.animation = `floatButterfly ${15 + Math.random() * 15}s infinite ease-in-out`;
            mariposa.style.animationDelay = (Math.random() * 10) + 's';
            document.body.appendChild(mariposa);
        }, i * 800);
    }
}

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
// ===== CONTADOR =====
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
// ===== MODAL RSVP =====
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