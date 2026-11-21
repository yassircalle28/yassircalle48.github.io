/**
 * Lab Semana 2 - 01: Acordeón con slideToggle('fast'/'slow') y Reto Pro (+0.5 ptos)
 * CERO .html() para iconos/textos
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $container = $('#themeContainer');
    const $mainIcon = $('#mainSportIcon');
    const $mainTitle = $('#mainSportTitle');
    const $mainSubtitle = $('#mainSportSubtitle');

    const sportThemes = {
        futbol: {
            bgClass: 'bg-futbol',
            icon: '⚽',
            title: 'Fútbol & Futsal Pro',
            sub: 'Césped sintético FIFA Quality con iluminación LED nocturna'
        },
        wally: {
            bgClass: 'bg-wally',
            icon: '🏐',
            title: 'Wallyball Deportivo',
            sub: 'Canchas cerradas con piso flotante de madera curada y climatización'
        },
        voley: {
            bgClass: 'bg-voley',
            icon: '🥅',
            title: 'Voleibol & Multideportivo',
            sub: 'Superficie de poliuretano de alto impacto con red reglamentaria'
        }
    };

    // ==========================================================
    // RETO PRO (+0.5): Cambio de degradado e ícono con .text()
    // ==========================================================
    $('.btn-deporte').on('click', function () {
        const sport = $(this).data('sport');
        const theme = sportThemes[sport];

        if (!theme) return;

        // Actualizar botones activos
        $('.btn-deporte').removeClass('active');
        $(this).addClass('active');

        // Cambiar clases de degradado temático en el contenedor
        $container
            .removeClass('bg-futbol bg-wally bg-voley')
            .addClass(theme.bgClass);

        // Actualizar ícono y textos con .text() (ESTRICTAMENTE NO .html())
        $mainIcon.text(theme.icon);
        $mainTitle.text(theme.title);
        $mainSubtitle.text(theme.sub);
    });

    // ==========================================================
    // ACORDEÓN: slideToggle('fast') para reglas/políticas/FAQ
    // y slideToggle('slow') para disponibilidad por horas
    // ==========================================================
    $('.accordion-btn').on('click', function () {
        const $btn = $(this);
        const $panel = $btn.next('.accordion-panel');
        const isHoras = $btn.hasClass('accordion-btn--horas');
        const isExpanded = $btn.attr('aria-expanded') === 'true';

        // Alternar aria-expanded
        $btn.attr('aria-expanded', String(!isExpanded));

        if (isHoras) {
            // Horas se despliega con 'slow' según requerimiento
            $panel.stop(true, true).slideToggle('slow');
        } else {
            // Reglas, políticas y FAQ se despliegan con 'fast'
            $panel.stop(true, true).slideToggle('fast');
        }
    });
});
