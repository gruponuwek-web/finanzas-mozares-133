const app = {
    usuarioActual: null,
    frases: [
        '💚 Juntos construimos nuestro futuro',
        '💰 Dinero es herramienta, no preocupación',
        '📊 Transparencia crea confianza',
        '🎯 Cada peso cuenta en nuestros sueños',
        '✨ Lo importante es el plan, no la prisa',
        '🌱 Sembramos hoy, cosechamos mañana',
        '❤️ Decisiones juntas, victorias juntas',
        '🏠 Nuestro hogar merece lo mejor',
    ],
    
    cuentas: [
        { id: 1, nombre: 'Débito Él', tipo: 'Débito', saldo: 15000, oculto: false },
        { id: 2, nombre: 'Débito Ella', tipo: 'Débito', saldo: 12000, oculto: false },
        { id: 3, nombre: 'Ahorros Familia', tipo: 'Ahorros', saldo: 50000, oculto: false },
    ],
    
    transacciones: [
        { id: 1, tipo: 'Gasto', categoria: 'Alimentación', monto: 500, desc: 'Supermercado', fecha: '2026-06-08' },
        { id: 2, tipo: 'Depósito', categoria: 'Ingreso', monto: 2000, desc: 'Pago trabajo', fecha: '2026-06-07' },
        { id: 3, tipo: 'Obligatoria', categoria: 'Servicios', monto: 800, desc: 'Servicios', fecha: '2026-06-06' },
    ],
    
    presupuestos: [
        { id: 1, mes: '2026-06', categoria: 'Alimentación', monto: 1500, estado: 'Activo' },
        { id: 2, mes: '2026-06', categoria: 'Transporte', monto: 500, estado: 'Activo' },
        { id: 3, mes: '2026-06', categoria: 'Servicios', monto: 1000, estado: 'Activo' },
    ],
    
    init() {
        this.actualizarReloj();
        setInterval(() => this.actualizarReloj(), 1000);
    },
    
    actualizarReloj() {
        const ahora = new Date();
        document.getElementById('reloj').textContent = ahora.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
        document.getElementById('frase').textContent = `"${this.frases[ahora.getDate() % this.frases.length]}"`;
    },
    
    iniciarSesion(user) {
        this.usuarioActual = user;
        document.getElementById('portada').classList.add('hidden');
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('usuario-nombre').textContent = user === 'el' ? '💙 Él' : '🧡 Ella';
        dashboard.renderizar();
    },
    
    cerrarSesion() {
        document.getElementById('portada').classList.remove('hidden');
        document.getElementById('navbar').classList.add('hidden');
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
    },
    
    mostrarSeccion(seccion) {
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('.navbar-btn').forEach(e => e.classList.remove('active'));
        document.getElementById(seccion).classList.remove('hidden');
        event.target.classList.add('active');
        
        if (seccion === 'dashboard') dashboard.renderizar();
        if (seccion === 'presupuesto') presupuesto.renderizar();
        if (seccion === 'cuentas') cuentas.renderizar();
        if (seccion === 'transacciones') transacciones.renderizar();
    }
};

app.init();