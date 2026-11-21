/**
 * Lab 06 - Bitácora Día 2 (Checkout Rápido, preventDefault, reset, textContent en #logDia2)
 * CERO innerHTML
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $variantSelect = $('#variantSelect');
    const $orderForm = $('#orderForm');
    const $displayPrecio = $('#displayPrecio');
    const logDia2 = document.getElementById('logDia2');

    function getTimestamp() {
        const d = new Date();
        return d.toLocaleTimeString('es-BO') + '.' + String(d.getMilliseconds()).padStart(3, '0');
    }

    /**
     * Registro seguro usando createElement y textContent
     */
    function appendLog(tipo, mensaje) {
        const li = document.createElement('li');
        li.className = 'log-entry log-entry--' + tipo;

        const spanTime = document.createElement('span');
        spanTime.className = 'log-timestamp';
        spanTime.textContent = `[${getTimestamp()}] REGISTRO: ${tipo.toUpperCase()}`;

        const spanText = document.createElement('span');
        spanText.className = 'log-text';
        spanText.textContent = mensaje;

        li.appendChild(spanTime);
        li.appendChild(spanText);

        logDia2.insertBefore(li, logDia2.firstChild);
    }

    // 1. Evento change en #variantSelect
    $variantSelect.on('change', function () {
        const $selectedOption = $(this).find('option:selected');
        const precio = $selectedOption.data('precio');
        const texto = $selectedOption.text();

        $displayPrecio.text(precio + ' BOB');
        appendLog('change', `Variante seleccionada cambiada a: "${texto}" (${precio} BOB)`);
    });

    // 2. Evento submit en #orderForm con preventDefault() y orderForm.reset()
    $orderForm.on('submit', function (e) {
        e.preventDefault();

        const cliente = $('#clienteNombre').val().trim();
        const telefono = $('#clienteTel').val().trim();
        const $selectedOption = $variantSelect.find('option:selected');
        const variante = $selectedOption.text();
        const precio = $selectedOption.data('precio');

        if (!cliente || !telefono) {
            appendLog('error', 'Intento de envío fallido: campos obligatorios vacíos.');
            return;
        }

        appendLog('order', `Reserva procesada con éxito para "${cliente}" (Tel: ${telefono}). Variante: "${variante}". Total: ${precio} BOB.`);

        // Reset requerido del formulario
        this.reset();

        // Restaurar precio por defecto en display
        const $defaultOption = $variantSelect.find('option:selected');
        $displayPrecio.text($defaultOption.data('precio') + ' BOB');
    });

    // Log inicial
    appendLog('init', 'Módulo de checkout rápido inicializado. Preparado para registrar cambios y órdenes.');
});
