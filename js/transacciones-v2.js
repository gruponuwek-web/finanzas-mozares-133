const transacciones = {
    renderizar() {
        const categorias = [...new Set(app.presupuestos.map(p => p.categoria))];
        
        let html = `
            <div class="card">
                <h3 class="card-titulo">➕ Registrar transacción</h3>
                <div class="form-row">
                    <div class="form-grupo">
                        <label class="form-label">Tipo</label>
                        <select class="form-select" id="new-trans-tipo" onchange="transacciones.actualizarCategorias()">
                            <option value="Gasto">Gasto</option>
                            <option value="Obligatoria">Obligatoria</option>
                            <option value="Transferencia">Transferencia</option>
                            <option value="Depósito">Depósito</option>
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label class="form-label">Categoría</label>
                        <select class="form-select" id="new-trans-cat">
                            ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
                            <option value="Otra">Otra</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-grupo">
                        <label class="form-label">Monto</label>
                        <input type="number" class="form-input" id="new-trans-monto" placeholder="0.00">
                    </div>
                    <div class="form-grupo">
                        <label class="form-label">Fecha</label>
                        <input type="date" class="form-input" id="new-trans-fecha">
                    </div>
                </div>
                <div class="form-grupo">
                    <label class="form-label">Descripción</label>
                    <input type="text" class="form-input" id="new-trans-desc" placeholder="Ej: Supermercado">
                </div>
                <button class="btn-primary" onclick="transacciones.agregar()">Registrar</button>
            </div>
        `;
        
        html += '<div class="card"><h3 class="card-titulo">📋 Historial de transacciones</h3>';
        
        app.transacciones.forEach(t => {
            const iconos = { Gasto: '📉', Obligatoria: '📌', Transferencia: '↔️', Depósito: '📈' };
            const clases = { Gasto: 'monto-gasto', Obligatoria: 'monto-obligatoria', Transferencia: 'monto-transferencia', Depósito: 'monto-deposito' };
            const signo = ['Depósito', 'Transferencia'].includes(t.tipo) ? '+' : '-';
            
            const mes = t.fecha.slice(0, 7);
            const presupuestoCategoria = app.presupuestos.find(p => p.mes === mes && p.categoria === t.categoria);
            const excedido = presupuestoCategoria && t.monto > presupuestoCategoria.monto;
            
            html += `
                <div class="transaccion-item" style="border-left: 4px solid ${excedido ? '#e88a7e' : '#6ba59a'};">
                    <div class="transaccion-info">
                        <p class="transaccion-tipo">${iconos[t.tipo]} ${t.desc} ${excedido ? '⚠️' : ''}</p>
                        <p class="transaccion-fecha">${t.fecha} • ${t.categoria}</p>
                    </div>
                    <div style="text-align: right;">
                        <p class="transaccion-monto ${clases[t.tipo]}">${signo}$${t.monto.toLocaleString('es-MX')}</p>
                        <button class="btn-sm btn-delete" onclick="transacciones.eliminar(${t.id})" style="width: auto; padding: 0.3rem 0.6rem; font-size: 0.75rem; margin-top: 0.3rem;">Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        document.getElementById('transacciones-container').innerHTML = html;
        document.getElementById('new-trans-fecha').valueAsDate = new Date();
    },
    
    actualizarCategorias() {
        this.renderizar();
    },
    
    agregar() {
        const tipo = document.getElementById('new-trans-tipo').value;
        const categoria = document.getElementById('new-trans-cat').value;
        const monto = parseFloat(document.getElementById('new-trans-monto').value);
        const fecha = document.getElementById('new-trans-fecha').value;
        const desc = document.getElementById('new-trans-desc').value;
        
        if (!tipo || !monto || !fecha || !desc) {
            alert('Completa todos los campos');
            return;
        }
        
        const mes = fecha.slice(0, 7);
        const presupuestoCategoria = app.presupuestos.find(p => p.mes === mes && p.categoria === categoria);
        
        if (presupuestoCategoria && monto > presupuestoCategoria.monto) {
            const confirm_ = confirm(`⚠️ ALERTA: Excedes el presupuesto de ${categoria}\nPresupuestado: $${presupuestoCategoria.monto.toLocaleString('es-MX')}\nMonto: $${monto.toLocaleString('es-MX')}\n\n¿Continuar de todas formas?`);
            if (!confirm_) return;
        }
        
        app.transacciones.unshift({
            id: Date.now(),
            tipo,
            categoria,
            monto,
            fecha,
            desc
        });
        
        gssync.guardarTransaccion({ tipo, categoria, monto, fecha, desc });
        
        document.getElementById('new-trans-monto').value = '';
        document.getElementById('new-trans-desc').value = '';
        
        this.renderizar();
        dashboard.renderizar();
    },
    
    eliminar(id) {
        if (confirm('¿Eliminar esta transacción?')) {
            app.transacciones = app.transacciones.filter(t => t.id !== id);
            this.renderizar();
            dashboard.renderizar();
        }
    }
};
