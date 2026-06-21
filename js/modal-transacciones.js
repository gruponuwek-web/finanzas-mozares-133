const modalTransacciones = {
    pestanaActual: 'ingreso',
    calcDisplay: '0',
    operacion: null,
    numero1: null,
    
    abrirModal() {
        document.getElementById('modal-transacciones').classList.remove('hidden');
        this.cambiarPestana('ingreso');
        this.rellenarSelectos();
    },
    
    cerrarModal() {
        document.getElementById('modal-transacciones').classList.add('hidden');
    },
    
    cambiarPestana(pestana) {
        this.pestanaActual = pestana;
        document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.modal-tab').forEach(tab => tab.classList.add('hidden'));
        event.target.classList.add('active');
        document.getElementById(`tab-${pestana}`).classList.remove('hidden');
        this.limpiarCalculadora();
    },
    
    rellenarSelectos() {
        // Ingresos
        document.getElementById('cat-ingreso').innerHTML = app.categorias.ingresos
            .map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        
        // Egresos
        document.getElementById('cat-egreso').innerHTML = app.categorias.egresos
            .map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        
        // Cuentas
        const cuentasHTML = app.cuentas.filter(c => !c.archivado)
            .map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        
        document.getElementById('cuenta-ingreso').innerHTML = cuentasHTML;
        document.getElementById('cuenta-egreso').innerHTML = cuentasHTML;
        document.getElementById('de-cuenta').innerHTML = cuentasHTML;
        document.getElementById('a-cuenta').innerHTML = cuentasHTML;
        
        // Fechas
        document.getElementById('fecha-ingreso').valueAsDate = new Date();
        document.getElementById('fecha-egreso').valueAsDate = new Date();
        document.getElementById('fecha-transaccion').valueAsDate = new Date();
    },
    
    agregarNumero(num) {
        if (this.calcDisplay === '0') {
            this.calcDisplay = num;
        } else {
            this.calcDisplay += num;
        }
        this.actualizarDisplay();
    },
    
    setOperacion(op) {
        this.numero1 = parseFloat(this.calcDisplay);
        this.operacion = op;
        this.calcDisplay = '0';
        this.actualizarDisplay();
    },
    
    calcular() {
        if (this.numero1 === null || this.operacion === null) return;
        
        const numero2 = parseFloat(this.calcDisplay);
        let resultado = 0;
        
        if (this.operacion === '+') resultado = this.numero1 + numero2;
        if (this.operacion === '-') resultado = this.numero1 - numero2;
        if (this.operacion === '×') resultado = this.numero1 * numero2;
        if (this.operacion === '÷') resultado = this.numero1 / numero2;
        
        this.calcDisplay = resultado.toString();
        this.numero1 = null;
        this.operacion = null;
        this.actualizarDisplay();
    },
    
    limpiarCalculadora() {
        this.calcDisplay = '0';
        this.operacion = null;
        this.numero1 = null;
        this.actualizarDisplay();
    },
    
    actualizarDisplay() {
        document.getElementById(`calc-display-${this.pestanaActual}`).value = this.calcDisplay;
    },
    
    guardarIngreso() {
        const categoria = document.getElementById('cat-ingreso').value;
        const descripcion = document.getElementById('desc-ingreso').value.trim() || 'Ingreso';
        const monto = parseFloat(document.getElementById(`calc-display-ingreso`).value);
        const cuenta = document.getElementById('cuenta-ingreso').value;
        const fecha = document.getElementById('fecha-ingreso').value;
        
        if (!monto || monto === 0) {
            alert('Ingresa un monto');
            return;
        }
        
        app.agregarTransaccion('Ingreso', categoria, monto, descripcion, fecha, cuenta);
        this.cerrarModal();
        transacciones.renderizar();
        dashboard.renderizar();
        alert('✅ Ingreso registrado');
    },
    
    guardarEgreso() {
        const tipo = document.getElementById('tipo-egreso').value;
        const categoria = document.getElementById('cat-egreso').value;
        const descripcion = document.getElementById('desc-egreso').value.trim() || 'Gasto';
        const monto = parseFloat(document.getElementById(`calc-display-egreso`).value);
        const cuenta = document.getElementById('cuenta-egreso').value;
        const fecha = document.getElementById('fecha-egreso').value;
        
        if (!monto || monto === 0) {
            alert('Ingresa un monto');
            return;
        }
        
        app.agregarTransaccion(tipo, categoria, monto, descripcion, fecha, cuenta);
        this.cerrarModal();
        transacciones.renderizar();
        dashboard.renderizar();
        alert('✅ Egreso registrado');
    },
    
    guardarTransferencia() {
        const de = document.getElementById('de-cuenta').value;
        const a = document.getElementById('a-cuenta').value;
        const monto = parseFloat(document.getElementById(`calc-display-transaccion`).value);
        const fecha = document.getElementById('fecha-transaccion').value;
        
        if (!monto || monto === 0) {
            alert('Ingresa un monto');
            return;
        }
        
        if (de === a) {
            alert('Selecciona cuentas diferentes');
            return;
        }
        
        // Crear dos transacciones
        app.agregarTransaccion('Gasto', 'Transferencia', monto, `Transferencia a ${a}`, fecha, de);
        app.agregarTransaccion('Ingreso', 'Transferencia', monto, `Transferencia de ${de}`, fecha, a);
        
        this.cerrarModal();
        transacciones.renderizar();
        dashboard.renderizar();
        alert('✅ Transferencia realizada');
    }
};