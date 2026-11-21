/**
 * Lab Semana 2 - 03: Asíncrono, Fetch JSON, Lazy Loading y Delegación Limpia
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $grid = $('#canchasGrid');
    const $errorBox = $('#fetchErrorBox');
    const $recordsCount = $('#totalRecordsCount');

    // Rutas relativas compartidas sin 404
    const CANCHAS_URL = '../../pwa/data/canchas.json';
    const HORARIOS_URL = '../../pwa/data/horarios.json';

    async function cargarDatos() {
        try {
            $errorBox.hide().empty();
            $grid.attr('aria-busy', 'true');

            // 1. Fetch simultáneo con validación response.ok
            const [respCanchas, respHorarios] = await Promise.all([
                fetch(CANCHAS_URL),
                fetch(HORARIOS_URL)
            ]);

            if (!respCanchas.ok) {
                throw new Error(`Error HTTP al cargar canchas: ${respCanchas.status} ${respCanchas.statusText}`);
            }
            if (!respHorarios.ok) {
                throw new Error(`Error HTTP al cargar horarios: ${respHorarios.status} ${respHorarios.statusText}`);
            }

            const canchas = await respCanchas.json();
            const horarios = await respHorarios.json();

            const totalRegistros = canchas.length + horarios.length;
            $recordsCount.text(`Total registros: ${totalRegistros} (${canchas.length} canchas, ${horarios.length} turnos)`);

            // 2. Renderizado aplicando CWV (Primera imagen eager, resto lazy)
            let htmlCards = '';
            canchas.forEach((cancha, index) => {
                const isFirst = index === 0;
                htmlCards += window.TarjetaCancha.render(cancha, horarios, !isFirst);
            });

            $grid.html(htmlCards).attr('aria-busy', 'false');

            // 3. Delegación limpia requerida: .off().on()
            $(document)
                .off('click', '.horario--disponible')
                .on('click', '.horario--disponible', function (e) {
                    e.preventDefault();
                    const $btn = $(this);
                    const hora = $btn.data('hora');
                    const canchaId = $btn.data('cancha-id');

                    // Alternar selección
                    $btn.closest('.card-cancha__horarios').find('.horario--seleccionado').removeClass('horario--seleccionado');
                    $btn.addClass('horario--seleccionado');

                    console.log(`[Turno Seleccionado] Cancha: ${canchaId}, Hora: ${hora}`);
                });

            // Inicializar simulación por tarjeta
            window.TarjetaCancha.initEventos();

        } catch (error) {
            console.error('Fallo en la carga asíncrona:', error);
            $grid.empty().attr('aria-busy', 'false');
            $errorBox
                .text(`⚠️ No fue posible cargar el catálogo: ${error.message}. Por favor verifica la conexión.`)
                .slideDown(250);
        }
    }

    cargarDatos();
});
