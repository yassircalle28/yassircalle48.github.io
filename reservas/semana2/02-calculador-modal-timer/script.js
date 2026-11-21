/**
 * Lab Semana 2 - 02: Calculador, Resumen con .animate(), Extras y Modal con Temporizador Flash
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $cancha = $('#canchaSelect');
    const $hrs = $('#hrs');
    const $totalDisplay = $('#totalDisplay');
    const $resCancha = $('#resCancha');
    const $resHoras = $('#resHoras');
    const $resGarantia = $('#resGarantia');
    const $resExtras = $('#resExtras');
    const $extrasCount = $('#extrasCount');

    const $modal = $('#modalConfirmacion');
    const $modalTimer = $('#modalTimer');
    const $toast = $('#toastNotification');
    const $toastMsg = $('#toastMessage');

    let countdownTimer = null;
    let secondsLeft = 30;

    /**
     * Muestra Toast flotante con slideDown -> 3s -> fadeOut
     */
    function showToast(mensaje, isError = false) {
        $toastMsg.text(mensaje);
        $toast
            .css('background', isError ? '#7f1d1d' : '#064e3b')
            .css('border-color', isError ? '#ef4444' : '#10b981')
            .css('color', isError ? '#fca5a5' : '#6ee7b7')
            .stop(true, true)
            .slideDown(300)
            .delay(3000)
            .fadeOut(400);
    }

    /**
     * Calcula total, garantía, extras y anima con .animate()
     */
    function recalcularTarifa() {
        let horas = parseInt($hrs.val(), 10);
        if (isNaN(horas) || horas < 1) horas = 1;
        $hrs.val(horas);

        const $opt = $cancha.find('option:selected');
        const tarifaHora = parseInt($opt.data('tarifa'), 10) || 40;
        const garantia = parseInt($opt.data('garantia'), 10) || 20;
        const nombreCancha = $opt.text().split('(')[0].trim();

        // Calcular costo de extras seleccionados y contador
        let costoExtras = 0;
        let countExtras = 0;
        $('.extra-check:checked').each(function () {
            costoExtras += parseInt($(this).data('cost'), 10) || 0;
            countExtras++;
        });

        const totalCancha = horas * tarifaHora;
        const granTotal = totalCancha + costoExtras;

        // Actualizar resumen
        $resCancha.text(nombreCancha);
        $resHoras.text(horas + (horas === 1 ? ' hora' : ' horas'));
        $resGarantia.text(garantia + ' BOB');
        $resExtras.text(costoExtras + ' BOB');
        $extrasCount.text(countExtras);

        // Actualizar indicador requerido "Total: X BOB"
        $totalDisplay.text(`Total: ${granTotal} BOB`);

        // Resaltar con .animate() sobre propiedades numéricas (fontSize y opacity)
        $totalDisplay.stop(true, true).animate({
            fontSize: '28px',
            opacity: 0.6
        }, 120, function () {
            $(this).animate({
                fontSize: '24px',
                opacity: 1
            }, 180);
        });
    }

    // Eventos del calculador reactivo
    $hrs.on('input change', recalcularTarifa);
    $cancha.on('change', recalcularTarifa);
    $('.extra-check').on('change', recalcularTarifa);

    // ==========================================================
    // MODAL DE CONFIRMACIÓN CON TEMPORIZADOR FLASH (Sección G)
    // ==========================================================
    function cerrarModal() {
        clearInterval(countdownTimer);
        countdownTimer = null;
        $modal.stop(true, true).fadeOut(200).attr('aria-hidden', 'true');
    }

    function abrirModal() {
        // Asegurar que no haya intervalo duplicado activo
        clearInterval(countdownTimer);

        const horas = $hrs.val();
        const $opt = $cancha.find('option:selected');
        const nombreCancha = $opt.text().split('(')[0].trim();
        const totalTexto = $totalDisplay.text().replace('Total: ', '');
        const garantiaTexto = $resGarantia.text();

        $('#modalServicio').text(nombreCancha);
        $('#modalMonto').text(`${totalTexto} (${horas} ${horas == 1 ? 'Hora' : 'Horas'})`);
        $('#modalGarantia').text(garantiaTexto);

        // Reiniciar cuenta regresiva a 30s
        secondsLeft = 30;
        $modalTimer.text('00:30s');

        // Desplegar modal
        $modal.css('display', 'flex').hide().attr('aria-hidden', 'false').fadeIn(250);

        // Temporizador de 30 segundos
        countdownTimer = setInterval(function () {
            secondsLeft--;
            const formatted = `00:${String(secondsLeft).padStart(2, '0')}s`;
            $modalTimer.text(formatted);

            if (secondsLeft <= 0) {
                // Al expirar: cerrar con .fadeOut() y mostrar toast "Tarifa Flash Expirada"
                cerrarModal();
                showToast('Tarifa Flash Expirada. Por favor calcula e inicia de nuevo.', true);
            }
        }, 1000);
    }

    // Botón principal "Alquilar Cancha"
    $('#btnAlquilarCancha').on('click', abrirModal);

    // Controles de cierre y cancelación
    $('#btnModalClose, #btnModalCancelar').on('click', cerrarModal);

    $modal.on('click', function (e) {
        if (e.target === this) {
            cerrarModal();
        }
    });

    // Procesar Pago / Confirmación
    $('#btnModalProcesarPago').on('click', function () {
        cerrarModal();
        showToast('✔ ¡Reserva confirmada con éxito! Esperamos tu llegada.');
    });

    // Inicializar
    recalcularTarifa();
});
