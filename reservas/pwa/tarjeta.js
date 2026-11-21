/**
 * COMPONENTE REUTILIZABLE BEM: Tarjeta de Cancha & Horarios
 * Diseño Web II - SIS-0141 | Ing. Miguel Angel Cruz Ramos
 */

(function (window, $) {
    'use strict';

    const TarjetaCancha = {
        /**
         * Renderiza una tarjeta de cancha BEM
         * @param {Object} cancha Datos de la cancha
         * @param {Array} horarios Lista de horarios
         * @param {boolean} lazy Si debe usar loading="lazy" (CLS / CWV)
         * @returns {string} HTML string del componente
         */
        render(cancha, horarios, lazy = true) {
            const courtHorarios = (horarios || []).filter(h => h.canchaId === cancha.id);
            const lazyAttr = lazy ? 'loading="lazy"' : 'loading="eager" fetchpriority="high"';

            let horariosHtml = '';
            if (courtHorarios.length > 0) {
                horariosHtml = courtHorarios.map(h => {
                    const isOcupado = h.estado === 'ocupado';
                    const estadoClass = isOcupado ? 'horario--ocupado' : 'horario--disponible';
                    const disabledAttr = isOcupado ? 'disabled aria-disabled="true"' : '';
                    const ariaLabel = isOcupado ? `${h.hora} ocupado` : `${h.hora} disponible`;
                    const indicadorTexto = isOcupado ? 'Ocupado' : 'Libre';

                    return `
                        <button type="button" 
                                class="horario ${estadoClass}" 
                                data-cancha-id="${cancha.id}"
                                data-hora="${h.hora}"
                                data-tarifa="${h.tarifa}"
                                aria-label="${ariaLabel}"
                                ${disabledAttr}>
                            <span class="horario__hora">${h.hora}</span>
                            <span class="horario__indicador">${indicadorTexto}</span>
                        </button>
                    `;
                }).join('');
            } else {
                horariosHtml = '<p class="text-muted" style="font-size:12px;color:#94a3b8;">Horarios a consultar en boletería.</p>';
            }

            return `
                <article class="card-cancha card-cancha--activa" id="${cancha.id}" data-deporte="${cancha.deporte}">
                    <div class="card-cancha__header">
                        <img src="${cancha.imagen}" 
                             alt="Cancha deportiva ${cancha.nombre}" 
                             class="card-cancha__imagen" 
                             width="700" 
                             height="394" 
                             ${lazyAttr}>
                        <span class="card-cancha__badge">${cancha.deporteNombre}</span>
                        <span class="card-cancha__estado card-cancha__estado--disponible">● ${cancha.estado}</span>
                    </div>
                    <div class="card-cancha__cuerpo">
                        <h3 class="card-cancha__titulo">${cancha.nombre}</h3>
                        <p class="card-cancha__descripcion">${cancha.tipo} · ${cancha.ubicacion}</p>
                        
                        <div class="card-cancha__specs">
                            <span>Capacidad: <strong>${cancha.capacidad}</strong></span>
                            <span class="card-cancha__precio">${cancha.precioHora} BOB / hr</span>
                        </div>

                        <span class="card-cancha__horarios-label">Seleccionar Turno:</span>
                        <div class="card-cancha__horarios">
                            ${horariosHtml}
                        </div>

                        <div class="card-cancha__acciones">
                            <button type="button" class="card-cancha__btn-reservar" data-cancha-id="${cancha.id}">
                                Reservar Cancha →
                            </button>
                            <button type="button" class="btn-simular" aria-label="Simular cambio de estado de la cancha" title="Simular disponibilidad">
                                ⚙ Simular
                            </button>
                        </div>
                    </div>
                </article>
            `;
        },

        /**
         * Inicializa la delegación de eventos para horarios y simulación
         * @param {Function} onSelectHorario Callback opcional al seleccionar un horario
         */
        initEventos(onSelectHorario) {
            // Delegación segura para selección de horario
            $(document)
                .off('click', '.horario--disponible')
                .on('click', '.horario--disponible', function (e) {
                    e.preventDefault();
                    const $btn = $(this);
                    const $contenedor = $btn.closest('.card-cancha__horarios');

                    // Desmarcar selección previa en este contenedor
                    $contenedor.find('.horario--seleccionado').removeClass('horario--seleccionado');

                    // Marcar actual
                    $btn.addClass('horario--seleccionado');

                    const canchaId = $btn.data('cancha-id');
                    const hora = $btn.data('hora');
                    const tarifa = $btn.data('tarifa');

                    if (typeof onSelectHorario === 'function') {
                        onSelectHorario({ canchaId, hora, tarifa, element: $btn });
                    }
                });

            // Delegación de simulación por tarjeta (.btn-simular)
            $(document)
                .off('click', '.btn-simular')
                .on('click', '.btn-simular', function (e) {
                    e.preventDefault();
                    const $card = $(this).closest('.card-cancha');
                    const isOcupada = $card.hasClass('card-cancha--ocupada');

                    if (isOcupada) {
                        $card.removeClass('card-cancha--ocupada').addClass('card-cancha--activa');
                        $card.find('.card-cancha__estado')
                            .removeClass('card-cancha__estado--ocupado')
                            .addClass('card-cancha__estado--disponible')
                            .text('● Disponible');
                        $card.find('.card-cancha__btn-reservar').prop('disabled', false).text('Reservar Cancha →');
                    } else {
                        $card.removeClass('card-cancha--activa').addClass('card-cancha--ocupada');
                        $card.find('.card-cancha__estado')
                            .removeClass('card-cancha__estado--disponible')
                            .addClass('card-cancha__estado--ocupado')
                            .text('● Mantenimiento / Ocupado');
                        $card.find('.card-cancha__btn-reservar').prop('disabled', true).text('No Disponible');
                    }
                });
        },

        /**
         * Bloquea un horario confirmado pasando de disponible a ocupado
         */
        bloquearHorario(canchaId, hora) {
            const $btn = $(`.horario[data-cancha-id="${canchaId}"][data-hora="${hora}"]`);
            if ($btn.length) {
                $btn.removeClass('horario--disponible horario--seleccionado')
                    .addClass('horario--ocupado')
                    .prop('disabled', true)
                    .attr('aria-label', `${hora} ocupado`)
                    .find('.horario__indicador').text('Ocupado');
            }
        }
    };

    window.TarjetaCancha = TarjetaCancha;
})(window, window.jQuery || $);
