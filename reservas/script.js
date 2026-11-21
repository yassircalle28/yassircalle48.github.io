/**
 * SCRIPT PRINCIPAL INTEGRADO - De porZone (Reserva de Canchas)
 * Diseño Web II - SIS-0141 | UPDS Sede La Paz | Ing. Miguel Angel Cruz Ramos
 * Arquitectura: SPA Minimalista con Navegación por Botones (Sin Scrolling Forzado)
 */

$(document).ready(function () {
    'use strict';

    // ==========================================================
    // 0. GESTOR DE VISTAS SPA SIN SCROLLING (DISEÑO MINIMALISTA)
    // ==========================================================
    const viewMapping = {
        'inicio': '#vista-inicio',
        'galeria': '#vista-inicio',
        'deportes': '#vista-inicio',
        'catalogo': '#vista-catalogo',
        'reservar': '#vista-reservar',
        'cola-reservas': '#vista-cola-reservas',
        'formulario': '#vista-formulario',
        'modulos': '#vista-modulos',
        'simulaciones': '#vista-simulaciones'
    };

    function mostrarSeccion(viewName) {
        if (!viewName) viewName = 'inicio';
        const cleanName = viewName.replace('#', '');
        const targetSelector = viewMapping[cleanName] || '#vista-inicio';

        // 1. Ocultar todas las vistas y desplegar instantáneamente la solicitada
        $('.app-seccion').removeClass('active').hide();
        $(targetSelector).addClass('active').stop(true, true).fadeIn(180);

        // 2. Sincronizar estado visual de los botones de navegación
        $('.tab-view-btn').removeClass('active');
        $(`.tab-view-btn[data-view="${cleanName}"]`).addClass('active');

        $('.topbar nav a').removeClass('active');
        $(`.topbar nav a[data-view="${cleanName}"]`).addClass('active');

        $('.dock-btn').removeClass('active');
        $(`.dock-btn[data-view="${cleanName}"]`).addClass('active');

        // 3. Mantener la pantalla fija en el tope sin deslizamiento
        window.scrollTo(0, 0);

        // 4. Actualizar hash en la barra de direcciones sin provocar scroll
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', '#' + cleanName);
        }

        // Cerrar menú hamburguesa si estaba abierto en móvil
        if ($(window).width() <= 850 && $('#main-menu').is(':visible')) {
            $('#main-menu').slideUp(180);
            $('#menu-toggle').attr('aria-expanded', 'false').attr('aria-label', 'Abrir menú');
        }
    }

    // Evento de clic en cualquier disparador de vista
    $(document).on('click', '.nav-view-trigger, .tab-view-btn', function (e) {
        e.preventDefault();
        const view = $(this).data('view') || $(this).attr('href')?.replace('#', '');
        if (view) {
            mostrarSeccion(view);
        }
    });

    // Detectar hash inicial al cargar la página
    const initialHash = window.location.hash ? window.location.hash.replace('#', '') : 'inicio';
    mostrarSeccion(initialHash);

    // ==========================================================
    // 1. SERVICE WORKER & PWA OFFLINE-FIRST (Sección C)
    // ==========================================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js')
                .then(function (reg) {
                    console.log('[PWA] Service Worker registrado con éxito en:', reg.scope);
                })
                .catch(function (err) {
                    console.warn('[PWA] Fallo al registrar el Service Worker:', err);
                });
        });
    }

    // Indicador de red #estadoRed con jQuery
    const $estadoRed = $('#estadoRed');

    function actualizarRed(online) {
        if (online) {
            $estadoRed
                .removeClass('offline')
                .addClass('online')
                .text('🟢 En Línea - Sistema conectado al servidor');
            sincronizarColaOffline();
        } else {
            $estadoRed
                .removeClass('online')
                .addClass('offline')
                .text('🟠 Modo Offline Activo - Trabajando con almacenamiento local');
        }
    }

    window.addEventListener('online', () => actualizarRed(true));
    window.addEventListener('offline', () => actualizarRed(false));
    actualizarRed(navigator.onLine);

    // Botón "Instalar App" con beforeinstallprompt
    let deferredPrompt = null;
    const $btnInstalar = $('#btnInstalarApp');

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        $btnInstalar.fadeIn(300);
    });

    $btnInstalar.on('click', async function () {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        console.log('[PWA] Decisión de instalación:', choice.outcome);
        deferredPrompt = null;
        $btnInstalar.fadeOut(200);
    });

    // ==========================================================
    // 2. CONFIGURACIÓN DE DEPORTES & MARCA (Temas)
    // ==========================================================
    const themes = {
        futbol: {
            mode: "MODO FÚTBOL",
            icon: "⚽",
            title: "La pasión se juega",
            sub: "En cada minuto.",
            word: "a jugar.",
            tag: "PASIÓN AZULGRANA",
            watermark: "FCB",
            description: "Reúne a tu equipo, elige tu horario y vive el fútbol como se debe. Tu espacio deportivo está a un clic."
        },
        wally: {
            mode: "MODO WALLY",
            icon: "🏐",
            title: "Salta por la victoria",
            sub: "Cada punto cuenta.",
            word: "a saltar.",
            tag: "POTENCIA Y PRECISIÓN",
            watermark: "WALLY",
            description: "Activa tu energía, arma tu equipo y disfruta de cada punto en una cancha lista para el desafío."
        },
        futsal: {
            mode: "MODO FUTSAL",
            icon: "🥅",
            title: "Ritmo de cancha",
            sub: "No dejes de atacar.",
            word: "a competir.",
            tag: "JUEGO SIN PAUSA",
            watermark: "FUTSAL",
            description: "Partidos intensos, pases rápidos y goles inolvidables. Reserva tu espacio y que ruede el balón."
        }
    };

    function changeTheme(name) {
        const t = themes[name];
        if (!t) return;

        $("body")
            .removeClass("theme-futbol theme-wally theme-futsal")
            .addClass("theme-" + name);

        $(".sport-card").removeClass("active");
        $('.sport-card[data-sport="' + name + '"]').addClass("active");

        $(".hero-photo").stop(true, true).fadeTo(160, 0.35, function () {
            $("#hero-mode").text(t.mode);
            $("#hero-icon, #float-icon").text(t.icon);
            $("#float-title").text(t.title);
            $("#float-sub").text(t.sub);
            $("#hero-word").text(t.word);
            $("#hero-tag").text(t.tag);
            $("#watermark").text(t.watermark);
            $("#hero-description").text(t.description);
            $(this).fadeTo(260, 1);
        });
    }

    $(".sport-card").on("click", function () {
        changeTheme($(this).data("sport"));
    });

    // ==========================================================
    // 3. MENÚ HAMBURGUESA ACCESIBLE
    // ==========================================================
    $("#menu-toggle").on("click", function () {
        const menu = $("#main-menu");
        menu.stop(true, true).slideToggle(200, function () {
            const isVisible = menu.is(':visible');
            $("#menu-toggle")
                .attr("aria-expanded", String(isVisible))
                .attr("aria-label", isVisible ? "Cerrar menú" : "Abrir menú");
        });
    });

    // ==========================================================
    // 4. MODO OSCURO / CLARO CON try/catch EN LOCALSTORAGE
    // ==========================================================
    function applyThemeMode(theme) {
        $("body").toggleClass("light-mode", theme === "light");
        $("#theme-toggle")
            .attr("aria-pressed", theme === "light" ? "false" : "true")
            .text(theme === "light" ? "🌙" : "☀️");

        try {
            localStorage.setItem("deporzone-theme", theme);
        } catch (err) {
            console.warn("No se pudo guardar la preferencia de tema:", err);
        }
    }

    let savedTheme = "dark";
    try {
        savedTheme = localStorage.getItem("deporzone-theme") || "dark";
    } catch (err) {
        savedTheme = "dark";
    }
    applyThemeMode(savedTheme);

    $("#theme-toggle").on("click", function () {
        const newTheme = $("body").hasClass("light-mode") ? "dark" : "light";
        applyThemeMode(newTheme);
    });

    // ==========================================================
    // 5. FILTRO DE CATÁLOGO DE CANCHAS
    // ==========================================================
    $(".filter-btn").on("click", function () {
        const filter = $(this).data("filter");
        $(".filter-btn").removeClass("active");
        $(this).addClass("active");

        let visible = 0;
        $(".card-cancha").each(function () {
            const deporte = $(this).data("deporte");
            if (filter === "all" || deporte === filter) {
                $(this).stop(true, true).fadeIn(300);
                visible++;
            } else {
                $(this).stop(true, true).fadeOut(200);
            }
        });

        $("#filter-result").text(
            filter === "all"
                ? "Mostrando todas las canchas disponibles."
                : `Mostrando ${visible} cancha(s) de la categoría seleccionada.`
        );
    });

    // ==========================================================
    // 6. CARRUSEL AUTOMÁTICO
    // ==========================================================
    let currentSlide = 0;
    const slides = $(".carousel-slide");
    const dots = $(".dot");
    const totalSlides = slides.length;
    let carouselTimer;

    function showSlide(index) {
        currentSlide = (index + totalSlides) % totalSlides;
        slides.removeClass("active");
        dots.removeClass("active");
        slides.eq(currentSlide).addClass("active");
        dots.eq(currentSlide).addClass("active");
    }

    $("#next-slide").on("click", function () {
        showSlide(currentSlide + 1);
        restartCarousel();
    });

    $("#prev-slide").on("click", function () {
        showSlide(currentSlide - 1);
        restartCarousel();
    });

    $(".dot").on("click", function () {
        showSlide(Number($(this).data("slide")));
        restartCarousel();
    });

    function startCarousel() {
        carouselTimer = setInterval(function () {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    function restartCarousel() {
        clearInterval(carouselTimer);
        startCarousel();
    }

    $(".carousel").on("mouseenter", () => clearInterval(carouselTimer));
    $(".carousel").on("mouseleave", restartCarousel);
    startCarousel();

    // ==========================================================
    // 7. SELECTOR DE HORARIOS BEM & DELEGACIÓN (Sección F y H)
    // ==========================================================
    let turnoSeleccionado = {
        canchaId: "cancha-1",
        canchaNombre: "Cancha Sintética Maracaná",
        hora: "18:00",
        tarifa: 40,
        garantia: 20
    };

    // Delegación limpia con .off().on() para selección de horarios
    $(document)
        .off("click", ".horario--disponible")
        .on("click", ".horario--disponible", function (e) {
            e.preventDefault();
            const $btn = $(this);

            // Desmarcar selecciones anteriores en la grilla
            $(".horario--seleccionado").removeClass("horario--seleccionado");

            // Marcar botón actual
            $btn.addClass("horario--seleccionado");

            // Extraer metadatos
            const canchaId = $btn.data("cancha-id");
            const canchaNombre = $btn.data("cancha-nombre") || "Cancha Sintética Maracaná";
            const hora = $btn.data("hora") || "18:00";
            const tarifa = parseInt($btn.data("tarifa"), 10) || 40;

            turnoSeleccionado.canchaId = canchaId;
            turnoSeleccionado.canchaNombre = canchaNombre;
            turnoSeleccionado.hora = hora;
            turnoSeleccionado.tarifa = tarifa;

            // Sincronizar select de la calculadora
            if ($(`#sport-select option[value="${canchaId}"]`).length) {
                $("#sport-select").val(canchaId);
            }

            actualizarCalculadora();
        });

    // Botón "Reservar Cancha →" desde la tarjeta BEM
    $(document)
        .off("click", ".card-cancha__btn-reservar")
        .on("click", ".card-cancha__btn-reservar", function (e) {
            e.preventDefault();
            const $card = $(this).closest(".card-cancha");
            const canchaId = $card.attr("id");
            const canchaNombre = $card.find(".card-cancha__titulo").text();

            turnoSeleccionado.canchaId = canchaId;
            turnoSeleccionado.canchaNombre = canchaNombre;

            // Abrir directamente modal de confirmación
            abrirModalConfirmacion();
        });

    // Delegación para botón de simulación por tarjeta (.btn-simular)
    $(document)
        .off("click", ".btn-simular")
        .on("click", ".btn-simular", function (e) {
            e.preventDefault();
            const $card = $(this).closest(".card-cancha");
            const isOcupada = $card.hasClass("card-cancha--ocupada");

            if (isOcupada) {
                $card.removeClass("card-cancha--ocupada").addClass("card-cancha--activa");
                $card.find(".card-cancha__estado")
                    .removeClass("card-cancha__estado--ocupado")
                    .addClass("card-cancha__estado--disponible")
                    .text("● Disponible");
                $card.find(".card-cancha__btn-reservar").prop("disabled", false).text("Reservar Cancha →");
            } else {
                $card.removeClass("card-cancha--activa").addClass("card-cancha--ocupada");
                $card.find(".card-cancha__estado")
                    .removeClass("card-cancha__estado--disponible")
                    .addClass("card-cancha__estado--ocupado")
                    .text("● Mantenimiento / Ocupado");
                $card.find(".card-cancha__btn-reservar").prop("disabled", true).text("No Disponible");
            }
        });

    // ==========================================================
    // 8. CALCULADORA DE TARIFAS & TARJETA RESUMEN (Sección F y G)
    // ==========================================================
    function actualizarCalculadora() {
        let hours = parseInt($("#hours").val(), 10);
        if (isNaN(hours) || hours < 1) hours = 1;
        hours = Math.min(12, hours);
        $("#hours").val(hours);

        const $canchaOpt = $("#sport-select option:selected");
        const precioHora = parseInt($canchaOpt.data("precio"), 10) || turnoSeleccionado.tarifa || 40;
        const garantia = parseInt($canchaOpt.data("garantia"), 10) || 20;
        const nombreCancha = $canchaOpt.data("nombre") || turnoSeleccionado.canchaNombre;

        turnoSeleccionado.garantia = garantia;
        turnoSeleccionado.canchaNombre = nombreCancha;

        // Contador y costo de extras opcionales
        let costoExtras = 0;
        let countExtras = 0;
        const extrasNombres = [];

        $(".root-extra:checked").each(function () {
            costoExtras += parseInt($(this).data("price"), 10) || 0;
            extrasNombres.push($(this).data("name"));
            countExtras++;
        });

        $("#rootExtrasCounter").text(countExtras);
        $("#rootExtrasCost").text(costoExtras);

        const subtotalCancha = hours * precioHora;
        const granTotal = subtotalCancha + costoExtras;

        // Actualizar visualizador de la calculadora
        $("#calcCanchaSeleccionada").text(`● ${nombreCancha} (${precioHora} BOB)`);
        $("#lblTarifaUnit").text(`${precioHora} BOB / hr`);
        $("#lblGarantiaRequerida").text(`${garantia} BOB`);

        // Indicador obligatorio "Total: X BOB"
        $("#total").text(`Total: ${granTotal} BOB`);

        // Actualizar Tarjeta Resumen
        $("#resumenCanchaTitulo").text(nombreCancha);
        $("#resumenHoraSeleccionada").text(`${turnoSeleccionado.hora} (${hours} ${hours === 1 ? 'Hora' : 'Horas'})`);
        $("#resumenGarantiaMonto").text(`${garantia} BOB`);
        $("#resumenExtrasListado").text(extrasNombres.length > 0 ? extrasNombres.join(", ") : "Ninguno");

        // Resaltar total numérico con .animate()
        $("#resumenTotalDisplay")
            .text(`${granTotal} BOB`)
            .stop(true, true)
            .animate({ opacity: 0.5 }, 120, function () {
                $(this).animate({ opacity: 1 }, 180);
            });
    }

    $("#hours").on("input change", actualizarCalculadora);

    $("#minus").on("click", function () {
        const h = parseInt($("#hours").val(), 10) || 1;
        $("#hours").val(Math.max(1, h - 1));
        actualizarCalculadora();
    });

    $("#plus").on("click", function () {
        const h = parseInt($("#hours").val(), 10) || 1;
        $("#hours").val(Math.min(12, h + 1));
        actualizarCalculadora();
    });

    $("#sport-select").on("change", function () {
        const canchaId = $(this).val();
        turnoSeleccionado.canchaId = canchaId;
        actualizarCalculadora();
    });

    $(".root-extra").on("change", actualizarCalculadora);

    // ==========================================================
    // 9. MODAL DE CONFIRMACIÓN CON TEMPORIZADOR FLASH (Sección G)
    // ==========================================================
    let countdownTimer = null;
    let secondsLeft = 30;
    const $modal = $("#modal");
    const $countdown = $("#countdown");
    const $toast = $("#toastNotification");
    const $toastMessage = $("#toastMessage");

    function showToast(mensaje, isError = false) {
        $toastMessage.text(mensaje);
        $toast
            .css("background", isError ? "#7f1d1d" : "#064e3b")
            .css("border-color", isError ? "#ef4444" : "#10b981")
            .css("color", isError ? "#fca5a5" : "#6ee7b7")
            .stop(true, true)
            .slideDown(300)
            .delay(3000)
            .fadeOut(400);
    }

    function closeModal() {
        clearInterval(countdownTimer);
        countdownTimer = null;
        $modal.stop(true, true).fadeOut(200).attr("aria-hidden", "true");
    }

    function abrirModalConfirmacion() {
        actualizarCalculadora();
        clearInterval(countdownTimer); // Limpiar timer previo para evitar duplicados

        const horas = $("#hours").val();
        const granTotal = $("#resumenTotalDisplay").text();
        const garantia = $("#resumenGarantiaMonto").text();

        $("#modalCanchaNombre").text(turnoSeleccionado.canchaNombre);
        $("#modalMontoDetalle").text(`${granTotal} (${horas} ${horas == 1 ? 'Hora' : 'Horas'})`);
        $("#modalGarantiaDetalle").text(garantia);

        secondsLeft = 30;
        $countdown.text("00:30s");
        $("#modal-message").text("");

        $modal.css("display", "flex").hide().attr("aria-hidden", "false").fadeIn(220);

        // Temporizador de 30 segundos
        countdownTimer = setInterval(function () {
            secondsLeft--;
            const formatted = `00:${String(secondsLeft).padStart(2, '0')}s`;
            $countdown.text(formatted);

            if (secondsLeft <= 0) {
                // Al expirar: cerrar con .fadeOut() y mostrar toast "Tarifa Flash Expirada"
                closeModal();
                showToast("Tarifa Flash Expirada. Vuelve a calcular para solicitar tu turno.", true);
            }
        }, 1000);
    }

    $("#confirm").on("click", abrirModalConfirmacion);
    $("#close, #cancel").on("click", closeModal);

    $modal.on("click", function (e) {
        if (e.target === this) closeModal();
    });

    // Procesar Pago / Confirmar Reserva
    $("#accept").on("click", function () {
        clearInterval(countdownTimer);

        // 1. Bloquear el horario en la grilla para que no pueda volver a seleccionarse
        window.TarjetaCancha.bloquearHorario(turnoSeleccionado.canchaId, turnoSeleccionado.hora);

        // 2. Registrar en la tabla y cola offline
        const titular = $("#nombre").val().trim() || "Cliente De porZone";
        const horas = $("#hours").val();
        const total = $("#resumenTotalDisplay").text();
        const isOnline = navigator.onLine;
        const estadoInicial = isOnline ? "Verificado" : "Guardado localmente - Pendiente de envío";

        const nuevaReserva = {
            cancha: turnoSeleccionado.canchaNombre,
            turno: `${turnoSeleccionado.hora} (${horas} hr)`,
            titular: titular,
            importe: total,
            estado: estadoInicial
        };

        agregarReservaATabla(nuevaReserva);
        guardarReservaEnCola(nuevaReserva);

        closeModal();

        // 3. Mostrar Toast Alert flotante arriba a la derecha (3s)
        showToast("✔ ¡Reserva confirmada con éxito! Tu turno ha sido bloqueado.");
    });

    // ==========================================================
    // 10. GESTIÓN DE RESERVAS & COLA LOCAL (Sección C)
    // ==========================================================
    function agregarReservaATabla(item) {
        const isVerificado = item.estado === "Verificado";
        const badgeClass = isVerificado ? "badge-estado--verificado" : "badge-estado--pendiente";

        const $tr = $("<tr>");
        // Patrón seguro con text() para evitar XSS
        const $tdCancha = $("<td>").html(`<strong></strong>`).find("strong").text(item.cancha).end();
        const $tdTurno = $("<td>").text(item.turno);
        const $tdTitular = $("<td>").text(item.titular);
        const $tdImporte = $("<td>").text(item.importe);
        const $tdEstado = $("<td>").html(`<span class="badge-estado ${badgeClass}"></span>`).find("span").text(item.estado).end();

        $tr.append($tdCancha, $tdTurno, $tdTitular, $tdImporte, $tdEstado);
        $("#tablaReservasBody").prepend($tr);
    }

    function guardarReservaEnCola(item) {
        try {
            const cola = JSON.parse(localStorage.getItem("deporzone_root_reservas")) || [];
            cola.unshift(item);
            localStorage.setItem("deporzone_root_reservas", JSON.stringify(cola));
        } catch (e) {
            console.warn("Fallo al persistir en cola local:", e);
        }
    }

    function sincronizarColaOffline() {
        try {
            const cola = JSON.parse(localStorage.getItem("deporzone_root_reservas")) || [];
            let huboCambios = false;

            cola.forEach(item => {
                if (item.estado === "Guardado localmente - Pendiente de envío") {
                    item.estado = "Verificado";
                    huboCambios = true;
                }
            });

            if (huboCambios) {
                localStorage.setItem("deporzone_root_reservas", JSON.stringify(cola));
                // Actualizar badges en la tabla
                $(".badge-estado--pendiente")
                    .removeClass("badge-estado--pendiente")
                    .addClass("badge-estado--verificado")
                    .text("Verificado");
            }
        } catch (e) {
            console.warn("Error al sincronizar cola offline:", e);
        }
    }

    // Cargar reservas previas
    try {
        const colaGuardada = JSON.parse(localStorage.getItem("deporzone_root_reservas")) || [];
        colaGuardada.forEach(item => agregarReservaATabla(item));
    } catch (e) {}

    // ==========================================================
    // 11. FORMULARIO DIRECTO CON VALIDACIÓN Y ANTI-XSS (Sección I)
    // ==========================================================
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    $("#fecha").attr("min", localDate);

    $("#reservation-form").on("submit", function (e) {
        e.preventDefault();

        const nombre = $("#nombre").val().trim();
        const telefono = $("#telefono").val().trim();
        const correo = $("#correo").val().trim();
        const fecha = $("#fecha").val();
        const hora = $("#hora").val();
        const deporte = $("#form-sport").val();

        if (nombre.length < 3) {
            $("#form-message").css("color", "#ef4444").text("El nombre debe tener al menos 3 caracteres.").stop(true, true).fadeIn(200);
            return;
        }

        if (fecha < localDate) {
            $("#form-message").css("color", "#ef4444").text("No puedes seleccionar una fecha pasada.").stop(true, true).fadeIn(200);
            return;
        }

        // Inserción segura con .text() neutralizando scripts como <script>alert('XSS')</script>
        $("#form-message")
            .css("color", "#10b981")
            .text(`✔ ¡Solicitud recibida para ${nombre}! Deporte: ${deporte}, Fecha: ${fecha} a las ${hora}.`)
            .stop(true, true)
            .fadeIn(300);

        // Bloquear y registrar en la tabla
        agregarReservaATabla({
            cancha: deporte + " General",
            turno: `${hora} (${fecha})`,
            titular: nombre,
            importe: "40 BOB",
            estado: navigator.onLine ? "Verificado" : "Guardado localmente - Pendiente de envío"
        });

        this.reset();
        $("#fecha").attr("min", localDate);
    });

    // ==========================================================
    // 12. BOTONES DE SIMULACIÓN (SECCIÓN J - IDS EXACTOS)
    // ==========================================================

    // 1. #btnSimularContraste: Alterna body.alto-contraste
    $("#btnSimularContraste").on("click", function () {
        $("body").toggleClass("alto-contraste");
        const isActive = $("body").hasClass("alto-contraste");
        $(this).text(isActive ? "Normalizar Contraste (#btnSimularContraste)" : "🌓 Simular Alto Contraste (#btnSimularContraste)");
    });

    // 2. #btnSimularVista: Alterna .sim-movil en el catálogo
    $("#btnSimularVista").on("click", function () {
        $("#catalogoGrid").toggleClass("sim-movil");
        const isActive = $("#catalogoGrid").hasClass("sim-movil");
        $(this).text(isActive ? "💻 Restaurar Vista Completa" : "📱 Simular Vista Móvil (#btnSimularVista)");
    });

    // 3. #btnAuditarA11Y + #reporteA11Y
    $("#btnAuditarA11Y").on("click", function () {
        const issues = [];

        // Verificar encabezados
        if ($("h1").length !== 1) {
            issues.push(`⚠️ Se encontraron ${$("h1").length} etiquetas <h1> (debe existir exactamente una).`);
        } else {
            issues.push(`✔ Jerarquía <h1> correcta (único título principal).`);
        }

        // Verificar alt en imágenes
        let imgsWithoutAlt = 0;
        $("img").each(function () {
            if (!$(this).attr("alt") || $(this).attr("alt").trim() === "") imgsWithoutAlt++;
        });
        if (imgsWithoutAlt > 0) {
            issues.push(`⚠️ Hay ${imgsWithoutAlt} imágenes sin atributo alt.`);
        } else {
            issues.push(`✔ Todas las imágenes cuentan con atributo alt descriptivo.`);
        }

        // Verificar labels de inputs
        let inputsWithoutLabel = 0;
        $("input:not([type=hidden])").each(function () {
            const id = $(this).attr("id");
            if (!id || $(`label[for="${id}"]`).length === 0) {
                if ($(this).closest("label").length === 0) inputsWithoutLabel++;
            }
        });
        if (inputsWithoutLabel > 0) {
            issues.push(`⚠️ Hay ${inputsWithoutLabel} inputs sin etiqueta <label for>.`);
        } else {
            issues.push(`✔ Todos los campos de formulario cuentan con <label> asociado.`);
        }

        // Verificar aria-labels en botones con sólo icono
        let buttonsWithoutText = 0;
        $("button").each(function () {
            const text = $(this).text().trim();
            const ariaLabel = $(this).attr("aria-label");
            if (!text && !ariaLabel) buttonsWithoutText++;
        });
        if (buttonsWithoutText > 0) {
            issues.push(`⚠️ ${buttonsWithoutText} botones carecen de texto o aria-label.`);
        } else {
            issues.push(`✔ Botones de icono debidamente identificados con aria-label.`);
        }

        // Salida formateada con textContent / DOM seguro
        const $reporte = $("#reporteA11Y");
        $reporte.empty();
        const $ul = $("<ul>").css({ "padding-left": "20px", "margin": "0" });
        issues.forEach(msg => {
            $ul.append($("<li>").text(msg));
        });
        $reporte.append($ul);
    });

    // 4. #btnSmokeTest + #salidaAudit
    $("#btnSmokeTest").on("click", async function () {
        const checks = [];

        // Check 1: Verificación de estructura DOM
        const hasCatalog = $("#catalogoGrid").length > 0;
        const hasCalc = $("#hours").length > 0;
        const hasModal = $("#modal").length > 0;
        const hasToast = $("#toastNotification").length > 0;
        checks.push({
            test: "Estructura UI (Catálogo, Calculadora, Modal, Toast)",
            pass: hasCatalog && hasCalc && hasModal && hasToast
        });

        // Check 2: Soporte Service Worker y PWA
        const swSupported = "serviceWorker" in navigator;
        checks.push({
            test: "Soporte de Service Worker PWA (navigator.serviceWorker)",
            pass: swSupported
        });

        // Check 3: LocalStorage y persistencia de cola offline
        let storageOk = false;
        try {
            localStorage.setItem("smoke_test", "1");
            storageOk = localStorage.getItem("smoke_test") === "1";
            localStorage.removeItem("smoke_test");
        } catch {
            storageOk = false;
        }
        checks.push({
            test: "Persistencia Offline (LocalStorage y try/catch)",
            pass: storageOk
        });

        // Check 4: Verificación de carga de JSON de datos compartidos
        let jsonOk = false;
        try {
            const r = await fetch("pwa/data/canchas.json");
            jsonOk = r.ok;
        } catch {
            jsonOk = false;
        }
        checks.push({
            test: "Disponibilidad de Datos PWA (pwa/data/canchas.json)",
            pass: jsonOk
        });

        // Renderizar salida en #salidaAudit de forma segura
        const $salida = $("#salidaAudit");
        $salida.empty();
        const $list = $("<ul>").css({ "padding-left": "20px", "margin": "0" });

        let allPassed = true;
        checks.forEach(c => {
            if (!c.pass) allPassed = false;
            const $item = $("<li>").text(`${c.pass ? '✅ [PASS]' : '❌ [FAIL]'} ${c.test}`);
            $list.append($item);
        });

        const $summary = $("<div>").css({ "margin-top": "10px", "font-weight": "bold" })
            .text(allPassed ? "🎉 TODOS LOS TESTS DEL SMOKE TEST PASARON EXITOSAMENTE." : "⚠️ ALGUNAS PRUEBAS FALLARON.");

        $salida.append($list).append($summary);
    });

    // Inicializar calculadora inicial
    actualizarCalculadora();
});
