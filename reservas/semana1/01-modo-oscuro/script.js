/**
 * Lab 01 - Modo Oscuro con jQuery y try/catch en localStorage
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const STORAGE_KEY = 'deporzone_theme_preference';
    const $body = $('body');
    const $toggleBtn = $('#btn-theme-toggle');
    const $status = $('#theme-status');
    const $debug = $('#storage-debug');

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || 'dark';
        } catch (err) {
            console.warn('Acceso a localStorage bloqueado o fallido:', err);
            return 'dark';
        }
    }

    function setSavedTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
            $debug.text(`Guardado: "${theme}"`);
        } catch (err) {
            console.warn('Error al guardar en localStorage:', err);
            $debug.text('No disponible (error de almacenamiento)');
        }
    }

    function applyTheme(theme) {
        const isLight = theme === 'light';
        $body.toggleClass('light-mode', isLight);
        $toggleBtn
            .attr('aria-pressed', isLight ? 'false' : 'true')
            .attr('aria-label', isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro')
            .text(isLight ? '☀️' : '🌙');
        $status.text(isLight ? 'Modo: Claro' : 'Modo: Oscuro');
        setSavedTheme(theme);
    }

    // Inicializar al cargar
    const initialTheme = getSavedTheme();
    applyTheme(initialTheme);

    // Evento click con jQuery
    $toggleBtn.on('click', function () {
        const currentIsLight = $body.hasClass('light-mode');
        const nextTheme = currentIsLight ? 'dark' : 'light';
        applyTheme(nextTheme);
    });
});
