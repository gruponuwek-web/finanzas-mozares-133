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
    
    categorias: {
        ingresos: [
            { id: 1, nombre: 'Salario' },
            { id: 2, nombre: 'Bonificación' },
            { id: 3, nombre: 'Trabajo independiente' },
            { id: 4, nombre: 'Otros ingresos' }
        ],
        egresos: [
            { id: 1, nombre: 'Alimentación' },
            { id: 2, nombre: 'Transporte' },
            { id: 3, nombre: 'Servicios' },
            { id: 4, nombre: 'Entretenimiento' },
            { id: 5, nombre: 'Salud' },
            { id: 6, nombre: 'Educación' },
            { id: 7, nombre: 'Otros gastos' }
        ]
    },
    
    cuentas: [
        { id: 1, nombre: 'Débito Él', tipo: 'Débito', saldo: 15000, oculto: false, archivado: false },
        { id: 2, nombre: 'Débito Ella', tipo: 'Débito', saldo: 12000, oculto: false, archivado: false },
        { id: 3, nombre: 'Ahorros Familia', tipo: 'Ahorros', saldo: 50000, oculto: false, archivado: false },
    ],
    
    transacciones: [
        { id: 1, tipo: 'Gasto', categoria: 'Alimentación', monto: 500, desc: 'Supermercado', fecha: '2026-06-08', cuenta: 'Débito Él' },
        { id: 2, tipo: 'Depósito', categoria: 'Salario', monto: 2000, desc: 'Pago trabajo', fecha: '2026-06-07', cuenta: 'Débito Ella' },
        { id: 3, tipo: 'Obligatoria', categoria: 'Servicios', monto: 800, desc: 'Luz y agua', fecha: '2026-06-06', cuenta: 'Débito Él' },
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
        if (seccion === 'configuracion') configuracion.renderizar();
    },
    
    agregarCategoria(tipo, nombre) {
        const maxId = Math.max(...app.categorias[tipo].map(c => c.id), 0);
        app.categorias[tipo].push({ id: maxId + 1, nombre });
    },
    
    editarCategoria(tipo, id, nombre) {
        const cat = app.categorias[tipo].find(c => c.id === id);
        if (cat) cat.nombre = nombre;
    },
    
    eliminarCategoria(tipo, id) {
        app.categorias[tipo] = app.categorias[tipo].filter(c => c.id !== id);
    },
    
    editarCuenta(id, nombre) {
        const cuenta = app.cuentas.find(c => c.id === id);
        if (cuenta) cuenta.nombre = nombre;
    },
    
    archivarCuenta(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        if (cuenta) cuenta.archivado = !cuenta.archivado;
    }
};

app.init();