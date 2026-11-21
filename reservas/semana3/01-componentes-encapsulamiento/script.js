/**
 * Lab Semana 3 - 01: Componentes y Delegación BEM (.btn-simular por tarjeta)
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    // Inicializar eventos delegados compartidos de la tarjeta BEM
    window.TarjetaCancha.initEventos(function (seleccion) {
        console.log('[Turno seleccionado]', seleccion);
    });
});
