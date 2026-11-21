/**
 * Lab Semana 3 - 02: Mobile-First con Simulador de Vista (#btnSimularVista)
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $btnSim = $('#btnSimularVista');
    const $grid = $('#gridCanchasResponsive');

    // Botón para simular vista móvil (375px) en pantalla completa
    $btnSim.on('click', function () {
        const isSimulando = $grid.hasClass('sim-movil');

        if (isSimulando) {
            $grid.removeClass('sim-movil');
            $btnSim.attr('aria-pressed', 'false').text('📱 Simular Vista Móvil (375px)');
        } else {
            $grid.addClass('sim-movil');
            $btnSim.attr('aria-pressed', 'true').text('💻 Restaurar Vista Completa');
        }
    });

    // Inicializar eventos de tarjetas y horarios
    window.TarjetaCancha.initEventos();
});
