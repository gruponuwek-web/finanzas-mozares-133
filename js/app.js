const app = {
    usuario: null,
    
    categorias: {
        ingresos: [
            { id: 1, nombre: 'Salario', predefinida: true },
            { id: 2, nombre: 'Bonificación', predefinida: true },
            { id: 3, nombre: 'Trabajo independiente', predefinida: true },
            { id: 4, nombre: 'Otros ingresos', predefinida: true }
        ],
        egresos: [
            { id: 1, nombre: 'Alimentación', predefinida: true },
            { id: 2, nombre: 'Transporte', predefinida: true },
            { id: 3, nombre: 'Servicios', predefinida: true },
            { id: 4, nombre: 'Entretenimiento', predefinida: true },
            { id: 5, nombre: 'Salud', predefinida: true },
            { id: 6, nombre: 'Educación', predefinida: true },
            { id: 7, nombre: 'Otros gastos', predefinida: true }
        ]
    },
    
    cuentas: [
        { id: 1, nombre: 'Débito Él', tipo: 'Débito', saldo: 15000, oculto: false, archivado: false },
        { id: 2, nombre: 'Débito Ella', tipo: 'Débito', saldo: 12000, oculto: false, archivado: false },
        { id: 3, nombre: 'Ahorros Familia', tipo: 'Ahorros', saldo: 50000, oculto: false, archivado: false }
    ],
    
    transacciones: [
        { id: 1, tipo: 'Depósito', categoria: 'Salario', monto: 5000, desc: 'Pago de trabajo', fecha: '2026-06-15', cuenta: 'Débito Él' },
        { id: 2, tipo: 'Gasto', categoria: 'Alimentación', monto: 250, desc: 'Supermercado', fecha: '2026-06-18', cuenta: 'Débito Ella' },
        { id: 3, tipo: 'Obligatoria', categoria: 'Servicios', monto: 800, desc: 'Luz', fecha: '2026-06-19', cuenta: 'Ahorros Familia' }
    ],
    
    presupuestos: [
        { id: 1, categoria: 'Entretenimiento', concepto: 'Netflix', cuentaAsignada: 'Ahorros Familia', asignadoA: 'familiar', meses: { '2026-06': 349, '2026-07': 349, '2026-08': 349, '2026-09': 0, '2026-10': 0, '2026-11': 0, '2026-12': 0, '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0 } },
        { id: 2, categoria: 'Servicios', concepto: 'Luz', cuentaAsignada: 'Débito Él', asignadoA: 'él', meses: { '2026-06': 1200, '2026-07': 1300, '2026-08': 1200, '2026-09': 0, '2026-10': 0, '2026-11': 0, '2026-12': 0, '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0 } },
        { id: 3, categoria: 'Transporte', concepto: 'Gasolina', cuentaAsignada: 'Débito Él', asignadoA: 'él', meses: { '2026-06': 500, '2026-07': 500, '2026-08': 500, '2026-09': 0, '2026-10': 0, '2026-11': 0, '2026-12': 0, '2026-01': 0, '2026-02': 0, '2026-03': 0, '2026-04': 0, '2026-05': 0 } }
    ],
    
    iniciarSesion(usuario) {
        this.usuario = usuario;
        document.getElementById('portada').classList.add('hidden');
        document.getElementById('navbar').classList.remove('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('usuario-nombre').textContent = usuario === 'el' ? 'Él' : 'Ella';
        dashboard.renderizar();
    },
    
    cerrarSesion() {
        this.usuario = null;
        document.getElementById('portada').classList.remove('hidden');
        document.getElementById('navbar').classList.add('hidden');
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
    },
    
    mostrarSeccion(seccion) {
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('.navbar-btn').forEach(e => e.classList.remove('active'));
        document.getElementById(seccion).classList.remove('hidden');
        event.target.classList.add('active');
        
        // RENDERIZAR SEGÚN SECCIÓN
        if (seccion === 'dashboard') dashboard.renderizar();
        if (seccion === 'presupuesto') presupuesto.renderizar();
        if (seccion === 'configuracion-pres') configurarPresupuesto.renderizar();
        if (seccion === 'cuentas') cuentas.renderizar();
        if (seccion === 'transacciones') transacciones.renderizar();
        if (seccion === 'configuracion') categorias.renderizar();
    },
    
    // CATEGORÍAS
    agregarCategoria(tipo, nombre) {
        if (this.categorias[tipo].some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
            return false;
        }
        this.categorias[tipo].push({
            id: Date.now(),
            nombre: nombre,
            predefinida: false
        });
        return true;
    },
    
    editarCategoria(tipo, id, nuevoNombre) {
        const cat = this.categorias[tipo].find(c => c.id === id);
        if (cat) {
            cat.nombre = nuevoNombre;
            return true;
        }
        return false;
    },
    
    eliminarCategoria(tipo, id) {
        this.categorias[tipo] = this.categorias[tipo].filter(c => c.id !== id);
    },
    
    // CUENTAS
    agregarCuenta(nombre, tipo, saldo) {
        this.cuentas.push({
            id: Date.now(),
            nombre: nombre,
            tipo: tipo,
            saldo: saldo,
            oculto: false,
            archivado: false
        });
    },
    
    editarCuenta(id, nuevoNombre) {
        const cuenta = this.cuentas.find(c => c.id === id);
        if (cuenta) {
            cuenta.nombre = nuevoNombre;
        }
    },
    
    archivarCuenta(id) {
        const cuenta = this.cuentas.find(c => c.id === id);
        if (cuenta) {
            cuenta.archivado = true;
        }
    },
    
    restaurarCuenta(id) {
        const cuenta = this.cuentas.find(c => c.id === id);
        if (cuenta) {
            cuenta.archivado = false;
        }
    },
    
    toggleOcultarSaldo(id) {
        const cuenta = this.cuentas.find(c => c.id === id);
        if (cuenta) {
            cuenta.oculto = !cuenta.oculto;
        }
    },
    
    // TRANSACCIONES
    agregarTransaccion(tipo, categoria, monto, desc, fecha, cuenta) {
        this.transacciones.push({
            id: Date.now(),
            tipo: tipo,
            categoria: categoria,
            monto: monto,
            desc: desc,
            fecha: fecha,
            cuenta: cuenta
        });
        
        // Actualizar saldo de cuenta
        const cta = this.cuentas.find(c => c.nombre === cuenta);
        if (cta) {
            if (tipo === 'Depósito' || tipo === 'Ingreso') {
                cta.saldo += monto;
            } else if (tipo === 'Gasto' || tipo === 'Egreso' || tipo === 'Obligatoria') {
                cta.saldo -= monto;
            }
        }
    },
    
    // PRESUPUESTOS
    agregarPresupuesto(categorias) {
        const mesesVacios = {};
        for (let i = 1; i <= 12; i++) {
            mesesVacios[`2026-${String(i).padStart(2, '0')}`] = 0;
        }
        
        categorias.forEach(cat => {
            this.presupuestos.push({
                id: Date.now() + Math.random(),
                categoria: cat.nombre,
                concepto: cat.nombre,
                cuentaAsignada: '',
                asignadoA: 'familiar',
                meses: { ...mesesVacios }
            });
        });
    },
    
    actualizarPresupuesto(id, cuenta, asignado, meses) {
        const pres = this.presupuestos.find(p => p.id === id);
        if (pres) {
            pres.cuentaAsignada = cuenta;
            pres.asignadoA = asignado;
            pres.meses = meses;
        }
    }
};

// Inicializar reloj y portada
setInterval(() => {
    const ahora = new Date();
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');
    const segundos = String(ahora.getSeconds()).padStart(2, '0');
    document.getElementById('reloj').textContent = `${horas}:${minutos}:${segundos}`;
}, 1000);

const opciones = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
const ahora = new Date();
document.getElementById('fecha').textContent = ahora.toLocaleDateString('es-MX', opciones);

const frases = [
    'La vida es como un presupuesto... siempre hay sorpresas 💚',
    'Dos mentes, un corazón, un presupuesto 💙🧡',
    'El dinero no lo es todo, pero organizarlo juntos... ¡sí! 💰',
    'Amor + Organización = Finanzas Mozares 💚',
    'Planificar juntos es soñar juntos 🌟'
];
const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
document.getElementById('frase').textContent = fraseAleatoria;