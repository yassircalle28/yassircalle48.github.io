/**
 * Lab 03 - Menú Hamburguesa con slideToggle(300) y accesibilidad
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $btn = $('#btn-hamburger');
    const $nav = $('#nav-principal');
    const $debugExp = $('#debug-expanded');
    const $debugVis = $('#debug-visibilidad');

    $btn.on('click', function () {
        const isExpanded = $btn.attr('aria-expanded') === 'true';
        const nextState = !isExpanded;

        // slideToggle(300) exigido
        $nav.stop(true, true).slideToggle(300, function () {
            const isVisible = $nav.is(':visible');
            $debugVis.text(isVisible ? 'Visible (slideDown)' : 'Oculto (slideUp)');
        });

        // Actualizar atributos accesibles y debug
        $btn.attr('aria-expanded', String(nextState));
        $btn.attr('aria-label', nextState ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        $debugExp.text(String(nextState));
    });

    // Cerrar al pulsar un enlace
    $nav.find('a').on('click', function () {
        $nav.stop(true, true).slideUp(300);
        $btn.attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú de navegación');
        $debugExp.text('false');
        $debugVis.text('Oculto (slideUp)');
    });
});
