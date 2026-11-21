/**
 * Lab Semana 3 - 03: Core Web Vitals, Sanitización con DOMPurify 3.1.6 y Service Worker
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    // 1. Registro del Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('../../sw.js')
                .then(reg => console.log('SW registrado en Lab 03:', reg.scope))
                .catch(err => console.warn('Error SW Lab 03:', err));
        });
    }

    // 2. Sanitización con DOMPurify 3.1.6
    const $form = $('#formComentarioEnriquecido');
    const $muro = $('#muroComentarios');

    function agregarComentarioSanitizado(autor, rawHtml) {
        // Sanitizar estrictamente con DOMPurify antes de insertar
        const cleanHtml = DOMPurify.sanitize(rawHtml, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'p'],
            ALLOWED_ATTR: ['style']
        });

        const $card = $('<div>').addClass('comment-card');
        const $authorDiv = $('<div>').addClass('comment-author').text(autor);
        const $bodyDiv = $('<div>').addClass('comment-body').html(cleanHtml);

        $card.append($authorDiv).append($bodyDiv);
        $muro.prepend($card);
    }

    $form.on('submit', function (e) {
        e.preventDefault();

        const autor = $('#inputUsuario').val().trim() || 'Cliente Anónimo';
        const rawContent = $('#inputHtmlEnriquecido').val().trim();

        if (!rawContent) return;

        agregarComentarioSanitizado(autor, rawContent);
        $('#inputHtmlEnriquecido').val('');
    });

    // Cargar comentario inicial de demostración con payload malicioso neutralizado
    agregarComentarioSanitizado(
        'Capitán Los Leones FC',
        '¡La iluminación LED nocturna de la cancha es espectacular! <script>alert("Payload neutralizado por DOMPurify")</script> <strong>¡Excelente servicio!</strong>'
    );
});
