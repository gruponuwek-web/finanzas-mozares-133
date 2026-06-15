const dashboard = {
    mesActual: new Date().toISOString().slice(0, 7),
    
    renderizar() {
        const mesNombre = new Date(this.mesActual + '-01').toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
        const total = app.cuentas.reduce((sum, c) => sum + c.saldo, 0);
        const transaccionesMes = app.transacciones.filter(t => t.fecha.startsWith(this.mesActual));
        const gasto = transaccionesMes.filter(t => ['Gasto', 'Obligatoria'].includes(t.tipo)).reduce((sum, t) => sum + t.monto, 0);
        const ingreso = transaccionesMes.filter(t => t.tipo === 'Depósito').reduce((sum, t) => sum + t.monto, 0);
        const balance = ingreso - gasto;
        
        const comparativa = gssync.compararPresupuestoVsRealizado(this.mesActual);
        const totalPresupuestado = Object.values(comparativa).reduce((sum, c) => sum + c.presupuestado, 0);
        const totalRealizado = Object.values(comparativa).reduce((sum, c) => sum + c.realizado, 0);
        
        let html = `
            <div class="grid-4">
                <div class="kpi-card">
                    <p class="kpi-label">💰 Saldo total</p>
                    <p class="kpi-valor">$${total.toLocaleString('es-MX')}</p>
                </div>
                <div class="kpi-card">
                    <p class="kpi-label">📊 Ingreso mes</p>
                    <p class="kpi-valor" style="color: #6ba59a;">+$${ingreso.toLocaleString('es-MX')}</p>
                </div>
                <div class="kpi-card">
                    <p class="kpi-label">📉 Gasto mes</p>
                    <p class="kpi-valor" style="color: #e88a7e;">-$${gasto.toLocaleString('es-MX')}</p>
                </div>
                <div class="kpi-card">
                    <p class="kpi-label">🎯 Balance neto</p>
                    <p class="kpi-valor" style="color: ${balance >= 0 ? '#6ba59a' : '#e88a7e'};">${balance >= 0 ? '+' : ''}$${balance.toLocaleString('es-MX')}</p>
                </div>
            </div>
        `;
        
        html += `
            <div class="card">
                <h3 class="card-titulo">📊 Presupuesto vs Realizado (${mesNombre})</h3>
                <div class="grid-2">
                    <div style="text-align: center; padding: 2rem; background: rgba(107, 165, 154, 0.1); border-radius: 1rem;">
                        <p style="color: #8b9693; margin-bottom: 0.5rem;">Presupuestado</p>
                        <p style="font-family: 'Courier Prime'; font-size: 2rem; font-weight: 700; color: #6ba59a;">$${totalPresupuestado.toLocaleString('es-MX')}</p>
                    </div>
                    <div style="text-align: center; padding: 2rem; background: rgba(232, 138, 126, 0.1); border-radius: 1rem;">
                        <p style="color: #8b9693; margin-bottom: 0.5rem;">Realizado</p>
                        <p style="font-family: 'Courier Prime'; font-size: 2rem; font-weight: 700; color: #e88a7e;">$${totalRealizado.toLocaleString('es-MX')}</p>
                    </div>
                </div>
                
                <h4 style="margin-top: 2rem; margin-bottom: 1rem; font-weight: 700;">Por categoría:</h4>
                <table class="tabla" style="font-size: 0.9rem;">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Presupuestado</th>
                            <th>Realizado</th>
                            <th>Disponible</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        Object.entries(comparativa).forEach(([categoria, datos]) => {
            const estado = datos.realizado > datos.presupuestado ? '🔴 EXCEDIDO' : datos.realizado >= datos.presupuestado * 0.8 ? '🟡 CRÍTICO' : '🟢 OK';
            html += `
                <tr>
                    <td style="font-weight: 600;">${categoria}</td>
                    <td style="font-family: 'Courier Prime'; color: #6ba59a;">$${datos.presupuestado.toLocaleString('es-MX')}</td>
                    <td style="font-family: 'Courier Prime'; color: #e88a7e;">$${datos.realizado.toLocaleString('es-MX')}</td>
                    <td style="font-family: 'Courier Prime'; color: ${datos.diferencia >= 0 ? '#6ba59a' : '#e88a7e'};">$${datos.diferencia.toLocaleString('es-MX')}</td>
                    <td>${estado}</td>
                </tr>
            `;
        });
        
        html += `</tbody></table></div>`;
        
        const diasTranscurridos = new Date().getDate();
        const diasTotales = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        const porcentajeMes = Math.min(100, (diasTranscurridos / diasTotales) * 100);
        
        html += `
            <div class="card">
                <h3 class="card-titulo">📅 Progreso mensual</h3>
                <p style="margin-bottom: 1rem; color: #8b9693;">${diasTranscurridos} de ${diasTotales} días transcurridos</p>
                <div class="progress-bar"><div class="progress-fill" style="width: ${porcentajeMes}%;"></div></div>
                <p style="text-align: center; margin-top: 1rem; color: #6ba59a; font-weight: 700;">${porcentajeMes.toFixed(0)}%</p>
            </div>
        `;
        
        html += '<div class="card"><h3 class="card-titulo">📋 Últimas transacciones</h3>';
        transaccionesMes.slice(0, 5).forEach(t => {
            const iconos = { Gasto: '📉', Obligatoria: '📌', Transferencia: '↔️', Depósito: '📈' };
            const clases = { Gasto: 'monto-gasto', Obligatoria: 'monto-obligatoria', Transferencia: 'monto-transferencia', Depósito: 'monto-deposito' };
            const signo = ['Depósito', 'Transferencia'].includes(t.tipo) ? '+' : '-';
            html += `
                <div class="transaccion-item">
                    <div class="transaccion-info">
                        <p class="transaccion-tipo">${iconos[t.tipo]} ${t.desc}</p>
                        <p class="transaccion-fecha">${t.fecha} • ${t.categoria}</p>
                    </div>
                    <p class="transaccion-monto ${clases[t.tipo]}">${signo}$${t.monto.toLocaleString('es-MX')}</p>
                </div>
            `;
        });
        html += '</div>';
        
        document.getElementById('dashboard-container').innerHTML = html;
    }
};
