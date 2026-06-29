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

// ============================================================
// ===== SOBRE + MÚSICA (CORREGIDO PARA MÓVILES) =====
// ============================================================

const sobreContainer = document.getElementById('sobreContainer');
const sobreWrapper = document.querySelector('.sobre-wrapper');
const audio = document.getElementById('musicaFondo');
const btnMusica = document.getElementById('btnMusica');
const iconoMusica = document.getElementById('iconoMusica');

let musicaIniciada = false;
let sobreAbierto = false;

// Función para iniciar la música (sin retraso)
function iniciarMusica() {
    if (musicaIniciada) return;
    
    audio.volume = 0.8;
    audio.play().then(() => {
        musicaIniciada = true;
        btnMusica.classList.add('sonando');
        iconoMusica.textContent = '🔊';
        btnMusica.classList.add('visible');
        console.log('🎵 Música iniciada correctamente');
    }).catch(error => {
        console.log('Error al reproducir:', error);
        // Si falla, mostramos el botón para que el usuario pueda iniciar manualmente
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

// ===== ABRIR EL SOBRE (CORREGIDO PARA MÓVILES) =====
function abrirSobre(e) {
    // Prevenir comportamiento por defecto
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    if (sobreAbierto) return;
    sobreAbierto = true;
    
    // 1. INICIAR LA MÚSICA INMEDIATAMENTE (sin ningún retraso)
    // Este es el cambio clave para que funcione en móviles
    if (!musicaIniciada) {
        audio.volume = 0.8;
        audio.play().then(() => {
            musicaIniciada = true;
            btnMusica.classList.add('sonando');
            iconoMusica.textContent = '🔊';
            btnMusica.classList.add('visible');
            console.log('🎵 Música iniciada desde el sobre');
        }).catch(error => {
            console.log('Error al iniciar música en móvil:', error);
            iconoMusica.textContent = '▶️';
            btnMusica.classList.add('visible');
        });
    }
    
    // 2. ANIMACIÓN del sobre (se ejecuta al mismo tiempo que la música)
    sobreWrapper.classList.add('abierto');
    
    // 3. Mostrar el botón de pausa inmediatamente
    btnMusica.classList.add('visible');
    
    // 4. Desvanecer el contenedor del sobre (con un pequeño retraso para ver la animación)
    setTimeout(() => {
        sobreContainer.classList.add('abierto');
    }, 800);
    
    // 5. Desbloquear el scroll después de que el sobre se haya desvanecido
    setTimeout(() => {
        document.body.style.overflow = 'auto';
    }, 900);
}

// ===== EVENTOS (Con soporte para móviles y PC) =====

// Para clic en PC
sobreWrapper.addEventListener('click', abrirSobre);

// Para toque en móviles (evita el doble disparo)
sobreWrapper.addEventListener('touchstart', function(e) {
    // Prevenir el comportamiento por defecto para que no interfiera
    e.preventDefault();
    abrirSobre(e);
}, { passive: false });

// Para teclado (accesibilidad)
document.addEventListener('keydown', function(e) {
    if ((e.key === 'Enter' || e.key === ' ') && !sobreAbierto) {
        e.preventDefault();
        abrirSobre(e);
    }
});

// Clic en el botón de música
btnMusica.addEventListener('click', toggleMusica);

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