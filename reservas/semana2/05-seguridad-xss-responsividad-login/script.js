/**
 * Lab Semana 2 - 05: Seguridad Anti-XSS (Patrón .text()), UI Móvil y Login Simulado
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    // ==========================================================
    // 1. LOGIN SIMULADO (Client-Side, Cero almacenamiento de claves)
    // ==========================================================
    const $formLogin = $('#formLoginSimulado');
    const $loginFeedback = $('#loginFeedback');

    $formLogin.on('submit', function (e) {
        e.preventDefault();

        const email = $('#loginEmail').val().trim();
        const pass = $('#loginPassword').val();

        if (!email || !pass) {
            $loginFeedback
                .removeClass('exito')
                .addClass('error')
                .text('⚠️ Por favor completa tu correo y contraseña.')
                .stop(true, true).fadeIn(200);
            return;
        }

        // Validación académica simulada
        if (email === 'admin@deporzone.bo' && pass === 'canchas2026') {
            $loginFeedback
                .removeClass('error')
                .addClass('exito')
                .text('✔ Sesión iniciada con éxito como Administrador de Canchas (Modo Simulación).')
                .stop(true, true).fadeIn(200);
        } else {
            $loginFeedback
                .removeClass('exito')
                .addClass('error')
                .text('❌ Credenciales inválidas. Usa admin@deporzone.bo / canchas2026.')
                .stop(true, true).fadeIn(200);
        }
    });

    // ==========================================================
    // 2. PRUEBA ANTI-XSS: Patrón <li> + <strong>.text(nombre) + <span>.text(sala)
    // ==========================================================
    const $formXSS = $('#formTestXSS');
    const $inputPayload = $('#inputPayload');
    const $selectSala = $('#selectSala');
    const $listaSegura = $('#listaReservasSeguras');

    // Botón para inyectar script malicioso de prueba
    $('#btnCargarPayload').on('click', function () {
        $inputPayload.val("<script>alert('Ataque XSS Ejecutado')</script>");
    });

    $formXSS.on('submit', function (e) {
        e.preventDefault();

        const payloadTexto = $inputPayload.val().trim();
        const salaTexto = $selectSala.val();

        if (!payloadTexto) return;

        // Patrón seguro exigido: <li> + <strong>.text() + <span>.text()
        // CERO .html() / innerHTML. Todo el texto se escapa naturalmente.
        const $li = $('<li>').addClass('item-seguro');
        const $strong = $('<strong>').text(payloadTexto);
        const $span = $('<span>').text(`Turno en: ${salaTexto}`);

        $li.append($strong).append($span);
        $listaSegura.prepend($li);

        $inputPayload.val('');
    });

    // Cargar dos registros de prueba iniciales de forma segura
    function agregarItemInicial(nombre, sala) {
        const $li = $('<li>').addClass('item-seguro');
        $li.append($('<strong>').text(nombre));
        $li.append($('<span>').text(`Turno en: ${sala}`));
        $listaSegura.append($li);
    }

    agregarItemInicial("Equipo Futsal Los Galácticos", "Cancha Sintética 1");
    agregarItemInicial("<img src=x onerror=alert('XSS')>", "Wally Court A (Payload Neutralizado)");

    // Botones del Dock de Acciones
    $('#dockBtnLogin').on('click', function () {
        $('html, body').animate({
            scrollTop: $('#seccionLogin').offset().top - 20
        }, 300);
    });

    $('#dockBtnXSS').on('click', function () {
        $('html, body').animate({
            scrollTop: $('#seccionXSS').offset().top - 20
        }, 300);
    });
});
