/**
 * Lab 05 - Bitácora Día 1 (Eventos delegados e inserción segura con DOM nodes / textContent)
 * CERO innerHTML
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const liveContainer = document.getElementById('liveContainer');
    const logOutput = document.getElementById('logOutput');
    const chatInput = document.getElementById('chatInput');
    const likeOverlay = document.getElementById('likeOverlay');
    const btnLimpiar = document.getElementById('btn-limpiar-log');

    function formatearHora() {
        const ahora = new Date();
        return ahora.toTimeString().split(' ')[0] + '.' + String(ahora.getMilliseconds()).padStart(3, '0');
    }

    /**
     * Inserta un registro en la bitácora usando estricta creación de nodos DOM (Anti-XSS, Cero innerHTML)
     */
    function agregarLog(tipo, mensaje) {
        const li = document.createElement('li');
        li.className = 'log-item log-item--' + tipo;

        const spanMeta = document.createElement('span');
        spanMeta.className = 'log-meta';
        spanMeta.textContent = `[${formatearHora()}] EVENTO: ${tipo.toUpperCase()}`;

        const spanMsg = document.createElement('span');
        spanMsg.className = 'log-mensaje';
        spanMsg.textContent = mensaje;

        li.appendChild(spanMeta);
        li.appendChild(spanMsg);

        // Prepend para ver los más recientes arriba
        logOutput.insertBefore(li, logOutput.firstChild);
    }

    // 1. Delegación de eventos en #liveContainer
    // Click: añadir oferta flash al carrito
    liveContainer.addEventListener('click', function (e) {
        const dealBtn = e.target.closest('.deal-btn');
        if (dealBtn) {
            e.stopPropagation();
            const dealCard = dealBtn.closest('.deal-card');
            const dealName = dealCard.getAttribute('data-deal-name') || 'Oferta Flash';
            const dealPrice = dealCard.getAttribute('data-deal-price') || '0';

            dealBtn.textContent = '¡Añadido! ✓';
            setTimeout(() => {
                dealBtn.textContent = 'Añadir Oferta';
            }, 1200);

            agregarLog('click', `Oferta añadida: "${dealName}" por ${dealPrice} BOB.`);
        }
    });

    // Dblclick: like animado al Live
    liveContainer.addEventListener('dblclick', function (e) {
        likeOverlay.classList.remove('animating');
        void likeOverlay.offsetWidth; // Reflow para reiniciar animación
        likeOverlay.classList.add('animating');

        setTimeout(() => {
            likeOverlay.classList.remove('animating');
        }, 600);

        agregarLog('dblclick', 'Like ❤️ enviado a la transmisión en vivo por doble clic.');
    });

    // 2. Evento keyup en #chatInput
    chatInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            const texto = chatInput.value.trim();
            if (texto.length > 0) {
                agregarLog('keyup', `Mensaje en chat: "${texto}"`);
                chatInput.value = '';
            }
        }
    });

    // Limpiar bitácora
    btnLimpiar.addEventListener('click', function () {
        while (logOutput.firstChild) {
            logOutput.removeChild(logOutput.firstChild);
        }
    });

    // Log inicial
    agregarLog('click', 'Sesión iniciada. Escuchando eventos delegados en #liveContainer y chat.');
});
