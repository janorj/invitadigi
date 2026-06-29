// ===== CONFIGURACIÓN =====
const FECHA_BODA = new Date('Dec 5, 2026 14:30:00').getTime();
const FECHA_LIMITE_RSVP = new Date('Nov 1, 2026 23:59:59').getTime();

// ===== CONTADOR =====
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

// ===== MODAL RSVP =====
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
    const items = document.querySelectorAll('.schedule-item, .info-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
});
// ===== REPRODUCTOR DE MÚSICA (AUTOPLAY + CONTROL) =====
const audio = document.getElementById('musicaFondo');
const btnMusica = document.getElementById('btnMusica');
const iconoMusica = document.getElementById('iconoMusica');

let musicaIniciada = false;
let usuarioInteractuo = false;

// Función para iniciar la música
function iniciarMusica() {
    if (musicaIniciada) return;
    
    // Quitar el mute y subir volumen
    audio.muted = false;
    audio.volume = 0.8;
    
    audio.play().then(() => {
        musicaIniciada = true;
        usuarioInteractuo = true;
        btnMusica.classList.add('sonando');
        iconoMusica.textContent = '🔊';
        console.log('🎵 Música iniciada');
    }).catch(error => {
        console.log('Autoplay bloqueado, esperando interacción:', error);
        // Mostramos el icono de "play" para que el usuario sepa que debe tocar
        iconoMusica.textContent = '▶️';
    });
}

// Función para pausar/reanudar
function toggleMusica() {
    if (!musicaIniciada) {
        // Si no ha empezado, intentamos iniciarla
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

// ===== ESTRATEGIA DE AUTOPLAY =====

// 1. Intentar reproducir al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar el audio
    audio.load();
    
    // Pequeño retraso para que el navegador procese todo
    setTimeout(() => {
        iniciarMusica();
    }, 500);
});

// 2. Si el autoplay falla, esperar al primer toque en cualquier parte
document.addEventListener('click', function primerClick() {
    if (!usuarioInteractuo) {
        iniciarMusica();
        // Remover el listener después de la primera interacción
        document.removeEventListener('click', primerClick);
    }
}, { once: true });

// También capturar touch (para móviles)
document.addEventListener('touchstart', function primerToque() {
    if (!usuarioInteractuo) {
        iniciarMusica();
        document.removeEventListener('touchstart', primerToque);
    }
}, { once: true });

// 3. Evento del botón de música
btnMusica.addEventListener('click', function(e) {
    e.stopPropagation(); // Evitar que el click del botón dispare el autoplay
    toggleMusica();
});

// ===== GUARDAR ESTADO (Opcional) =====
// Guardar si la música estaba sonando al salir de la página
window.addEventListener('beforeunload', function() {
    if (!audio.paused) {
        audio.pause();
    }
});