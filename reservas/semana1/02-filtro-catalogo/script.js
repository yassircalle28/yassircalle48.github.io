/**
 * Lab 02 - Filtro de 3 Capas y Pestañas con jQuery
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const courtsData = {
        sintetica: {
            title: "Cancha Sintética Maracaná",
            desc: "Pasto sintético monofilamento de 50mm con iluminación LED. Ideal para Fútbol 7 u 8.",
            img: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
            horarios: {
                tarde: ["16:00", "17:00", "18:00"],
                noche: ["19:00", "20:00", "21:00", "22:00"]
            }
        },
        wally: {
            title: "Wally Court A (Piso Flotante)",
            desc: "Piso de madera flotante reglamentario con muros acolchados de alta resistencia.",
            img: "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80",
            horarios: {
                tarde: ["17:00", "18:00"],
                noche: ["19:00", "20:00", "21:00"]
            }
        },
        voleibol: {
            title: "Coliseo Voleibol / Futsal",
            desc: "Piso de poliuretano oficial multideportivo para partidos de vóley sala o futsal rápido.",
            img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
            horarios: {
                tarde: ["16:00", "18:00"],
                noche: ["19:00", "21:00", "22:00"]
            }
        }
    };

    function renderView(typeKey, horarioFiltro) {
        const court = courtsData[typeKey] || courtsData.sintetica;

        // Actualizar datos
        $('#court-title').text(court.title);
        $('#court-desc').text(court.desc);
        $('#court-img').attr('src', court.img).attr('alt', court.title);

        // Generar botones de horario según capa 3
        let list = [];
        if (horarioFiltro === 'tarde') {
            list = court.horarios.tarde;
        } else if (horarioFiltro === 'noche') {
            list = court.horarios.noche;
        } else {
            list = [...court.horarios.tarde, ...court.horarios.noche];
        }

        const $grid = $('#horarios-catalogo');
        $grid.empty();
        list.forEach(function (h) {
            const $btn = $('<button>')
                .attr('type', 'button')
                .addClass('horario horario--disponible')
                .attr('aria-label', `${h} disponible`)
                .html(`<span class="horario__hora">${h}</span><span class="horario__indicador">Libre</span>`);
            $grid.append($btn);
        });
    }

    // Pestañas dinámicas
    $('.tab-btn').on('click', function () {
        $('.tab-btn').removeClass('active').attr('aria-selected', 'false');
        $(this).addClass('active').attr('aria-selected', 'true');

        const courtKey = $(this).data('court');
        $('#filtro-tipo').val(courtKey);
        renderView(courtKey, $('#filtro-horario').val());
    });

    // Filtro Capa 1: Tipo
    $('#filtro-tipo').on('change', function () {
        const val = $(this).val();
        const courtKey = val === 'todos' ? 'sintetica' : val;
        $('.tab-btn').removeClass('active').attr('aria-selected', 'false');
        $(`.tab-btn[data-court="${courtKey}"]`).addClass('active').attr('aria-selected', 'true');
        renderView(courtKey, $('#filtro-horario').val());
    });

    // Filtro Capa 2: Día (Simula recarga de turnos disponibles)
    $('#filtro-dia').on('change', function () {
        const activeCourt = $('.tab-btn.active').data('court');
        renderView(activeCourt, $('#filtro-horario').val());
    });

    // Filtro Capa 3: Horario
    $('#filtro-horario').on('change', function () {
        const activeCourt = $('.tab-btn.active').data('court');
        renderView(activeCourt, $(this).val());
    });

    // Inicialización
    renderView('sintetica', 'todos');
});
