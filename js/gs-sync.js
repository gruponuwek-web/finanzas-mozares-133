const gssync = {
    spreadsheetId: null,
    apiKey: null,
    presupuestos: [],
    transacciones: [],
    cuentas: [],
    
    init(spreadsheetId, apiKey) {
        this.spreadsheetId = spreadsheetId;
        this.apiKey = apiKey;
        console.log('Google Sheets sync inicializado');
    },
    
    async obtenerPresupuestos() {
        if (!this.spreadsheetId) return app.presupuestos;
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Presupuestos?key=${this.apiKey}`);
            const data = await response.json();
            if (data.values && data.values.length > 1) {
                this.presupuestos = data.values.slice(1).map((row, idx) => ({
                    id: idx + 1, mes: row[0] || '', categoria: row[1] || '', monto: parseFloat(row[2]) || 0, estado: row[3] || 'Activo'
                }));
            }
            return this.presupuestos;
        } catch (error) {
            console.error('Error obteniendo presupuestos:', error);
            return app.presupuestos;
        }
    },
    
    async obtenerTransacciones() {
        if (!this.spreadsheetId) return app.transacciones;
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Transacciones?key=${this.apiKey}`);
            const data = await response.json();
            if (data.values && data.values.length > 1) {
                this.transacciones = data.values.slice(1).map((row, idx) => ({
                    id: idx + 1, fecha: row[0] || '', tipo: row[1] || '', categoria: row[2] || '', monto: parseFloat(row[3]) || 0, desc: row[4] || ''
                }));
            }
            return this.transacciones;
        } catch (error) {
            console.error('Error obteniendo transacciones:', error);
            return app.transacciones;
        }
    },
    
    async obtenerCuentas() {
        if (!this.spreadsheetId) return app.cuentas;
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Cuentas?key=${this.apiKey}`);
            const data = await response.json();
            if (data.values && data.values.length > 1) {
                this.cuentas = data.values.slice(1).map((row, idx) => ({
                    id: idx + 1, nombre: row[0] || '', tipo: row[1] || '', saldo: parseFloat(row[2]) || 0, oculto: row[3] === 'true'
                }));
            }
            return this.cuentas;
        } catch (error) {
            console.error('Error obteniendo cuentas:', error);
            return app.cuentas;
        }
    },
    
    async guardarPresupuesto(presupuesto) {
        app.presupuestos.push(presupuesto);
        return presupuesto;
    },
    
    async guardarTransaccion(transaccion) {
        app.transacciones.unshift(transaccion);
        return transaccion;
    },
    
    compararPresupuestoVsRealizado(mes) {
        const presupuetosMes = app.presupuestos.filter(p => p.mes === mes);
        const transaccionesMes = app.transacciones.filter(t => t.fecha.startsWith(mes));
        const comparativa = {};
        presupuetosMes.forEach(p => {
            const realizado = transaccionesMes.filter(t => t.categoria === p.categoria).reduce((sum, t) => sum + t.monto, 0);
            comparativa[p.categoria] = {
                presupuestado: p.monto, realizado: realizado, diferencia: p.monto - realizado, porcentaje: ((realizado / p.monto) * 100).toFixed(1)
            };
        });
        return comparativa;
    }
};

window.addEventListener('load', async () => {});