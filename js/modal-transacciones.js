const modalTransacciones = {
    abierto: false,
    pestanaActual: 'ingreso',
    calculadora: { valor: 0, operacion: null, nuevoNumero: true },
    
    abrirModal() {
        this.cargarCategorias();
        document.getElementById('modal-transacciones').classList.remove('hidden');
        this.abierto = true;
    },
    
    cerrarModal() {
        document.getElementById('modal-transacciones').classList.add('hidden');
        this.abierto = false;
        this.limpiarFormularios();
    },
    
    cargarCategorias() {
        const catIngresoSelect = document.getElementById('cat-ingreso');
        const catEgresoSelect = document.getElementById('cat-egreso');
        const deCuentaSelect = document.getElementById('de-cuenta');
        const aCuentaSelect = document.getElementById('a-cuenta');
        
        // Categorías de ingresos
        catIngresoSelect.innerHTML = '<option value="">Selecciona categoría</option>';
        app.categorias.ingresos.forEach(cat => {
            catIngresoSelect.innerHTML += `<option value="${cat.nombre}">${cat.nombre}</option>`;
        });
        
        // Categorías de egresos
        catEgresoSelect.innerHTML = '<option value="">Selecciona categoría</option>';
        app.categorias.egresos.forEach(cat => {
            catEgresoSelect.innerHTML += `<option value="${cat.nombre}">${cat.nombre}</option>`;
        });
        
        // Cuentas
        deCuentaSelect.innerHTML = '<option value="">Selecciona cuenta origen</option>';
        aCuentaSelect.innerHTML = '<option value="">Selecciona cuenta destino</option>';
        app.cuentas.forEach(cuenta => {
            deCuentaSelect.innerHTML += `<option value="${cuenta.nombre}">${cuenta.nombre}</option>`;
            aCuentaSelect.innerHTML += `<option value="${cuenta.nombre}">${cuenta.nombre}</option>`;
        });
    },
    
    cambiarPestana(pestana) {
        this.pestanaActual = pestana;
        document.querySelectorAll('.modal-tab').forEach(t => t.classList.add('hidden'));
        document.getElementById(`tab-${pestana}`).classList.remove('hidden');
        
        document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        
        this.resetearCalculadora();
    },
    
    agregarNumero(num) {
        const input = document.getElementById(`calc-display-${this.pestanaActual}`);
        if (this.calculadora.nuevoNumero) {
            input.value = num;
            this.calculadora.nuevoNumero = false;
        } else {
            input.value += num;
        }
    },
    
    setOperacion(op) {
        const input = document.getElementById(`calc-display-${this.pestanaActual}`);
        this.calculadora.valor = parseFloat(input.value) || 0;
        this.calculadora.operacion = op;
        this.calculadora.nuevoNumero = true;
        input.value = '';
    },
    
    calcular() {
        const input = document.getElementById(`calc-display-${this.pestanaActual}`);
        const numeroActual = parseFloat(input.value) || 0;
        let resultado = this.calculadora.valor;
        
        if (this.calculadora.operacion === '+') resultado += numeroActual;
        if (this.calculadora.operacion === '-') resultado -= numeroActual;
        if (this.calculadora.operacion === '×') resultado *= numeroActual;
        if (this.calculadora.operacion === '÷') resultado = numeroActual !== 0 ? resultado / numeroActual : 0;
        
        input.value = resultado;
        this.calculadora.valor = 0;
        this.calculadora.operacion = null;
        this.calculadora.nuevoNumero = true;
        
        document.getElementById(`monto-${this.pestanaActual}`).value = resultado;
    },
    
    limpiarCalculadora() {
        document.getElementById(`calc-display-${this.pestanaActual}`).value = '';
        this.resetearCalculadora();
    },
    
    resetearCalculadora() {
        this.calculadora = { valor: 0, operacion: null, nuevoNumero: true };
        document.getElementById(`calc-display-${this.pestanaActual}`).value = '';
    },
    
    guardarIngreso() {
        const categoria = document.getElementById('cat-ingreso').value;
        const descripcion = document.getElementById('desc-ingreso').value;
        const monto = parseFloat(document.getElementById('monto-ingreso').value);
        const fecha = document.getElementById('fecha-ingreso').value;
        
        if (!categoria || !descripcion || !monto || !fecha) {
            alert('Completa todos los campos');
            return;
        }
        
        app.transacciones.unshift({
            id: Date.now(),
            tipo: 'Depósito',
            categoria: categoria,
            monto: monto,
            desc: descripcion,
            fecha: fecha
        });
        
        this.cerrarModal();
        dashboard.renderizar();
        alert('✅ Ingreso registrado');
    },
    
    guardarEgreso() {
        const categoria = document.getElementById('cat-egreso').value;
        const descripcion = document.getElementById('desc-egreso').value;
        const monto = parseFloat(document.getElementById('monto-egreso').value);
        const fecha = document.getElementById('fecha-egreso').value;
        const tipo = document.getElementById('tipo-egreso').value;
        
        if (!categoria || !descripcion || !monto || !fecha) {
            alert('Completa todos los campos');
            return;
        }
        
        app.transacciones.unshift({
            id: Date.now(),
            tipo: tipo,
            categoria: categoria,
            monto: monto,
            desc: descripcion,
            fecha: fecha
        });
        
        this.cerrarModal();
        dashboard.renderizar();
        alert('✅ Egreso registrado');
    },
    
    guardarTransferencia() {
        const deCuenta = document.getElementById('de-cuenta').value;
        const aCuenta = document.getElementById('a-cuenta').value;
        const monto = parseFloat(document.getElementById('monto-transaccion').value);
        const fecha = document.getElementById('fecha-transaccion').value;
        
        if (!deCuenta || !aCuenta || !monto || !fecha) {
            alert('Completa todos los campos');
            return;
        }
        
        if (deCuenta === aCuenta) {
            alert('Las cuentas deben ser diferentes');
            return;
        }
        
        app.transacciones.unshift({
            id: Date.now(),
            tipo: 'Transferencia',
            categoria: `${deCuenta} → ${aCuenta}`,
            monto: monto,
            desc: `Transferencia`,
            fecha: fecha
        });
        
        this.cerrarModal();
        dashboard.renderizar();
        alert('✅ Transferencia registrada');
    },
    
    limpiarFormularios() {
        document.getElementById('cat-ingreso').value = '';
        document.getElementById('desc-ingreso').value = '';
        document.getElementById('monto-ingreso').value = '';
        document.getElementById('fecha-ingreso').value = new Date().toISOString().split('T')[0];
        
        document.getElementById('cat-egreso').value = '';
        document.getElementById('desc-egreso').value = '';
        document.getElementById('monto-egreso').value = '';
        document.getElementById('fecha-egreso').value = new Date().toISOString().split('T')[0];
        
        document.getElementById('monto-transaccion').value = '';
        document.getElementById('fecha-transaccion').value = new Date().toISOString().split('T')[0];
    }
};

window.addEventListener('load', () => {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fecha-ingreso').value = hoy;
    document.getElementById('fecha-egreso').value = hoy;
    document.getElementById('fecha-transaccion').value = hoy;
});