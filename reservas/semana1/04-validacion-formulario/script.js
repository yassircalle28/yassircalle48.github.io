/**
 * Lab 04 - Validación de Formulario en Tiempo Real con jQuery
 * fadeIn/fadeOut para errores y slideDown().delay(3000).slideUp() para éxito
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $form = $('#form-reserva-canchas');
    const $nombre = $('#txt-nombre');
    const $telefono = $('#txt-telefono');
    const $correo = $('#txt-correo');
    const $exito = $('#mensaje-exito');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^[0-9]{7,15}$/;

    function validarCampo($input, esValido, $error) {
        if (esValido) {
            $input.removeClass('invalido').addClass('valido');
            $error.stop(true, true).fadeOut(200);
            return true;
        } else {
            $input.removeClass('valido').addClass('invalido');
            $error.stop(true, true).fadeIn(200);
            return false;
        }
    }

    function checkNombre() {
        const val = $nombre.val().trim();
        return validarCampo($nombre, val.length >= 3, $('#err-nombre'));
    }

    function checkTelefono() {
        const val = $telefono.val().trim();
        return validarCampo($telefono, telRegex.test(val), $('#err-telefono'));
    }

    function checkCorreo() {
        const val = $correo.val().trim();
        return validarCampo($correo, emailRegex.test(val), $('#err-correo'));
    }

    // Validación en tiempo real (input / blur)
    $nombre.on('input blur', checkNombre);
    $telefono.on('input blur', checkTelefono);
    $correo.on('input blur', checkCorreo);

    // Evento submit
    $form.on('submit', function (e) {
        e.preventDefault();

        const vNom = checkNombre();
        const vTel = checkTelefono();
        const vCor = checkCorreo();

        if (vNom && vTel && vCor) {
            // Éxito con slideDown().delay(3000).slideUp() requerido
            $exito.stop(true, true).slideDown(300).delay(3000).slideUp(400);

            // Resetear estado del formulario
            $form[0].reset();
            $form.find('input').removeClass('valido invalido');
            $('.error-msg').hide();
        } else {
            // Foco al primer campo inválido
            $form.find('.invalido').first().focus();
        }
    });
});
