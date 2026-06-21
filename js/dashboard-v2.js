const dashboard = {
    renderizar() {
        const saldoTotal = app.cuentas.reduce((sum, c) => !c.archivado ? sum + c.saldo : sum, 0);
        const gastosEsteMes = app.transacciones
            .filter(t => t.fecha.startsWith('2026-06') && (t.tipo === 'Gasto' || t.tipo === 'Obligatoria'))
            .reduce((sum, t) => sum + t.monto, 0);
        const ingresosEsteMes = app.transacciones
            .filter(t => t.fecha.startsWith('2026-06') && (t.tipo === 'Depósito' || t.tipo === 'Ingreso'))
            .reduce((sum, t) => sum + t.monto, 0);
        const presupuestoTotal = Object.values(app.presupuestos).reduce((sum, p) => sum + (p.meses['2026-06'] || 0), 0);
        
        let html = `
            <div class="grid-4">
                <div class="kpi-card">
                    <div class="kpi-label">💰 Saldo Total</div>
                    <div class="kpi-valor">$${saldoTotal.toLocaleString('es-MX')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">📉 Gastos Junio</div>
                    <div class="kpi-valor" style="color: #e88a7e;">-$${gastosEsteMes.toLocaleString('es-MX')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">💹 Ingresos Junio</div>
                    <div class="kpi-valor" style="color: #6ba59a;">+$${ingresosEsteMes.toLocaleString('es-MX')}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">📊 Presupuesto Junio</div>
                    <div class="kpi-valor" style="color: #4a90e2;">$${presupuestoTotal.toLocaleString('es-MX')}</div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="card-titulo">📝 Últimas Transacciones</h3>
                <div class="transacciones-lista">
        `;
        
        app.transacciones.slice().reverse().slice(0, 5).forEach(t => {
            const claseColor = t.tipo === 'Gasto' ? 'monto-gasto' : t.tipo === 'Obligatoria' ? 'monto-obligatoria' : t.tipo === 'Transferencia' ? 'monto-transferencia' : 'monto-deposito';
            const signo = (t.tipo === 'Gasto' || t.tipo === 'Obligatoria') ? '-' : '+';
            
            html += `
                <div class="transaccion-item">
                    <div class="transaccion-info">
                        <div class="transaccion-tipo">${t.desc}</div>
                        <div class="transaccion-fecha">${t.fecha} • ${t.categoria}</div>
                    </div>
                    <div class="transaccion-monto ${claseColor}">${signo}$${t.monto.toLocaleString('es-MX')}</div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        
        document.getElementById('dashboard-container').innerHTML = html;
    }
};