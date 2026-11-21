/**
 * Lab Semana 2 - 04: Arquitectura PWA, Estado de Red y Cola Offline-First
 * Diseño Web II - SIS-0141
 */
$(document).ready(function () {
    const $estadoRed = $('#estadoRed');
    const $btnInstalar = $('#btnInstalarApp');
    const $form = $('#formOfflineReserva');
    const $tbody = $('#tablaColaBody');

    const STORAGE_QUEUE_KEY = 'deporzone_offline_queue';
    let deferredPrompt = null;
    let simulandoDesconexion = false;

    // 1. Registro del Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('../../sw.js')
                .then(reg => console.log('SW registrado en Lab 04:', reg.scope))
                .catch(err => console.warn('Fallo SW Lab 04:', err));
        });
    }

    // 2. Control de Instalabilidad (beforeinstallprompt)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        $btnInstalar.fadeIn(300);
    });

    $btnInstalar.on('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Resultado de instalación:', outcome);
        deferredPrompt = null;
        $btnInstalar.fadeOut(200);
    });

    // 3. Manejo de Estado de Red con jQuery (#estadoRed)
    function actualizarEstadoRed(online) {
        if (online && !simulandoDesconexion) {
            $estadoRed
                .removeClass('offline')
                .addClass('online')
                .text('🟢 En Línea - Sistema conectado al servidor');

            // Sincronizar cola offline a "Verificado"
            sincronizarColaOnline();
        } else {
            $estadoRed
                .removeClass('online')
                .addClass('offline')
                .text('🟠 Modo Offline Activo - Trabajando con almacenamiento local');
        }
    }

    window.addEventListener('online', () => actualizarEstadoRed(true));
    window.addEventListener('offline', () => actualizarEstadoRed(false));
    actualizarEstadoRed(navigator.onLine);

    // Botón de simulación de corte de conexión para pruebas en vivo
    $('#btnSimularDesconexion').on('click', function () {
        simulandoDesconexion = !simulandoDesconexion;
        $(this).text(simulandoDesconexion ? 'Restablecer Conexión' : 'Simular Desconexión');
        actualizarEstadoRed(!simulandoDesconexion);
    });

    // 4. Gestión de Cola Local Offline-First
    function getCola() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_QUEUE_KEY)) || [];
        } catch {
            return [];
        }
    }

    function saveCola(cola) {
        try {
            localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(cola));
        } catch (e) {
            console.error('Error al guardar cola offline:', e);
        }
    }

    function renderTablaCola() {
        const cola = getCola();
        $tbody.empty();

        if (cola.length === 0) {
            $tbody.html('<tr><td colspan="3" style="text-align:center;color:#64748b;">No hay reservas en la cola local.</td></tr>');
            return;
        }

        cola.forEach(item => {
            const isPendiente = item.estado === 'Guardado localmente - Pendiente de envío';
            const badgeClass = isPendiente ? 'badge-estado--pendiente' : 'badge-estado--verificado';

            const $tr = $('<tr>');
            $tr.append($('<td>').html(`<strong>${item.cancha}</strong><br><small style="color:#94a3b8;">${item.hora}</small>`));
            $tr.append($('<td>').text(item.cliente));
            $tr.append($('<td>').html(`<span class="badge-estado ${badgeClass}">${item.estado}</span>`));

            $tbody.append($tr);
        });
    }

    function sincronizarColaOnline() {
        const cola = getCola();
        let huboCambios = false;

        cola.forEach(item => {
            if (item.estado === 'Guardado localmente - Pendiente de envío') {
                item.estado = 'Verificado';
                huboCambios = true;
            }
        });

        if (huboCambios) {
            saveCola(cola);
            renderTablaCola();
        }
    }

    // 5. Envío de Formulario Offline
    $form.on('submit', function (e) {
        e.preventDefault();

        const cliente = $('#offCliente').val().trim();
        const cancha = $('#offCancha').val();
        const hora = $('#offHora').val();

        if (!cliente) return;

        const isOnline = navigator.onLine && !simulandoDesconexion;
        const estadoInicial = isOnline ? 'Verificado' : 'Guardado localmente - Pendiente de envío';

        const nuevaReserva = {
            id: 'res-' + Date.now(),
            cliente,
            cancha,
            hora,
            estado: estadoInicial,
            creadoEn: new Date().toISOString()
        };

        const cola = getCola();
        cola.unshift(nuevaReserva);
        saveCola(cola);

        this.reset();
        renderTablaCola();
    });

    // Renderizar datos guardados previamente
    renderTablaCola();
});
