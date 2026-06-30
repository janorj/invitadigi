// ===== CONFIGURACIÓN =====
const FECHA_BODA = new Date('Dec 5, 2026 14:30:00').getTime();
const FECHA_LIMITE_RSVP = new Date('Nov 1, 2026 23:59:59').getTime();

// ============================================================
// ===== SOBRE + MÚSICA + MARIPOSAS =====
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

// Función para iniciar la música
function iniciarMusica() {
    if (musicaIniciada) return;
    
    audio.volume = 0.7;
    audio.play().then(() => {
        musicaIniciada = true;
        btnMusica.classList.add('sonando');
        iconoMusica.textContent = '🔊';
        btnMusica.classList.add('visible');
        console.log('🎵 Música iniciada correctamente');
    }).catch(error => {
        console.log('Error al reproducir:', error);
        iconoMusica.textContent = '▶️';
        btnMusica.classList.add('visible');
    });
}

// Función para pausar/reanudar
function toggleMusica(e) {
    if (e) e.stopPropagation();
    
    if (!musicaIniciada) {
        iniciarMusica();
        return;
    }
    
    if (audio.paused) {
        audio.play().then(() => {
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
        }).catch(() => {
            iconoMusica.textContent = '🔇';
        });
    } else {
        audio.pause();
        btnMusica.classList.remove('sonando');
        iconoMusica.textContent = '🔇';
    }
}

// ===== CREAR MARIPOSAS VOLANDO =====
function crearMariposasVolando() {
    const mariposas = document.querySelectorAll('.butterfly');
    const contenedor = document.body;
    
    // Crear mariposas adicionales que vuelan desde el sobre
    for (let i = 0; i < 8; i++) {
        const mariposa = document.createElement('div');
        mariposa.className = 'butterfly voladora';
        mariposa.textContent = '🦋';
        mariposa.style.position = 'fixed';
        mariposa.style.zIndex = '10';
        mariposa.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
        mariposa.style.pointerEvents = 'none';
        mariposa.style.opacity = '0';
        
        // Posición inicial desde el centro
        const x = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
        const y = window.innerHeight / 2 + (Math.random() - 0.5) * 80;
        mariposa.style.left = x + 'px';
        mariposa.style.top = y + 'px';
        
        contenedor.appendChild(mariposa);
        
        // Animar hacia una posición aleatoria
        const targetX = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
        const targetY = Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1;
        const duration = 2000 + Math.random() * 2000;
        const delay = i * 200;
        
        mariposa.animate([
            { opacity: 0, transform: 'scale(0.5) rotate(0deg)' },
            { opacity: 0.8, transform: `scale(1) rotate(${Math.random() * 360}deg)` },
            { opacity: 0.3, transform: `scale(0.8) rotate(${Math.random() * 720}deg)` }
        ], {
            duration: duration,
            delay: delay,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
        
        // Mover a la posición final
        setTimeout(() => {
            mariposa.style.transition = `all ${2 + Math.random() * 3}s ease-in-out`;
            mariposa.style.left = targetX + 'px';
            mariposa.style.top = targetY + 'px';
            mariposa.style.opacity = '0.15';
            
            // Hacer que flote después de llegar
            setTimeout(() => {
                mariposa.style.animation = `floatButterfly ${15 + Math.random() * 10}s infinite ease-in-out`;
                mariposa.style.animationDelay = (Math.random() * 5) + 's';
            }, 3000);
        }, duration + delay);
    }
}

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
            console.log('🎵 Música iniciada desde el sobre');
        }).catch(error => {
            console.log('Error al iniciar música:', error);
            iconoMusica.textContent = '▶️';
            btnMusica.classList.add('visible');
        });
    }
    
    // 2. ANIMACIÓN del sobre
    sobreWrapper.classList.add('abierto');
    btnMusica.classList.add('visible');
    
    // 3. Desvanecer el sobre
    setTimeout(() => {
        sobreContainer.classList.add('abierto');
    }, 800);
    
    // 4. Mostrar el menú y elementos
    setTimeout(() => {
        menuNavegacion.style.display = 'flex';
        document.body.style.overflow = 'auto';
        
        // Mostrar mariposa central con animación
        mariposaCentral.classList.add('visible');
        
        // Crear mariposas volando
        crearMariposasVolando();
        
        // Activar animaciones de scroll
        activarAnimacionesScroll();
    }, 900);
}

// ===== ACTIVAR ANIMACIONES DE SCROLL =====
function activarAnimacionesScroll() {
    const items = document.querySelectorAll('.schedule-item, .info-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    items.forEach(item => {
        observer.observe(item);
    });
}

// ===== EVENTOS =====
// Clic en el sobre
sobreWrapper.addEventListener('click', abrirSobre);

// Touch para móviles
sobreWrapper.addEventListener('touchstart', function(e) {
    e.preventDefault();
    abrirSobre(e);
}, { passive: false });

// Teclado
document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !sobreAbierto) {
        e.preventDefault();
        abrirSobre(e);
    }
});

// Botón de música
btnMusica.addEventListener('click', toggleMusica);

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

// ===== ENVÍO DEL FORMULARIO =====
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

    // ⚠️ ¡CAMBIAR! Pon tu número real con código de país (sin +):
    const url = `https://wa.me/34XXXXXXXXX?text=${mensaje}`;

    // Abrir WhatsApp
    window.open(url, '_blank');

    form.style.display = 'none';
    successDiv.style.display = 'block';

    localStorage.setItem('rsvp_enviado', 'true');
});

// ===== COMPROBACIÓN DE FECHA LÍMITE =====
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

// ===== EFECTO DE APARICIÓN AL HACER SCROLL =====
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar el scroll hasta que se abra el sobre
    document.body.style.overflow = 'hidden';
});