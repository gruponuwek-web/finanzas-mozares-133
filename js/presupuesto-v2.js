const presupuesto = {
    pestanaActual: 'conceptos',
    mesInicio: 5,
    meses: ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'],
    
    renderizar() {
        const mesesVisibles = this.obtenerMesesVisibles();
        const mesLabels = mesesVisibles.map(m => this.formatearMes(m));
        
        let html = `
            <div class="card">
                <div class="presupuesto-header">
                    <div class="presupuesto-tabs">
                        <button class="presupuesto-tab-btn ${this.pestanaActual === 'conceptos' ? 'active' : ''}" onclick="presupuesto.cambiarPestana('conceptos')">📊 Conceptos</button>
                        <button class="presupuesto-tab-btn ${this.pestanaActual === 'resumen' ? 'active' : ''}" onclick="presupuesto.cambiarPestana('resumen')">👥 Resumen por Persona</button>
                    </div>
                    <div class="navegacion-meses-compacta">
                        <button class="btn-mes-pequeño" onclick="presupuesto.mesAnterior()">◀</button>
                        <span class="rango-meses-pequeño">${mesLabels[0]} - ${mesLabels[2]}</span>
                        <button class="btn-mes-pequeño" onclick="presupuesto.mesSiguiente()">▶</button>
                    </div>
                </div>
            </div>
        `;
        
        if (this.pestanaActual === 'conceptos') {
            html += this.renderizarConceptos(mesesVisibles, mesLabels);
        } else {
            html += this.renderizarResumen(mesesVisibles, mesLabels);
        }
        
        document.getElementById('presupuesto-container').innerHTML = html;
    },
    
    cambiarPestana(pestana) {
        this.pestanaActual = pestana;
        this.renderizar();
    },
    
    renderizarConceptos(mesesVisibles, mesLabels) {
        let html = `<div class="card"><table class="tabla-presupuestos"><thead><tr><th>Categoría</th><th>Concepto</th><th>${mesLabels[0]}</th><th>${mesLabels[1]}</th><th>${mesLabels[2]}</th><th>Cuenta</th><th>Acción</th></tr></thead><tbody>`;
        
        app.presupuestos.forEach(p => {
            const val1 = p.meses[mesesVisibles[0]] || 0;
            const val2 = p.meses[mesesVisibles[1]] || 0;
            const val3 = p.meses[mesesVisibles[2]] || 0;
            
            html += `<tr><td>${p.categoria}</td><td style="font-weight:700;">${p.concepto}</td><td style="font-family:'Courier Prime';color:#6ba59a;">$${val1.toLocaleString('es-MX')}</td><td style="font-family:'Courier Prime';color:#6ba59a;">$${val2.toLocaleString('es-MX')}</td><td style="font-family:'Courier Prime';color:#6ba59a;">$${val3.toLocaleString('es-MX')}</td><td style="font-size:0.85rem;">${p.cuentaAsignada || '-'}</td><td><button class="btn-sm btn-edit" onclick="presupuesto.abrirEditarPresupuesto(${p.id})">✏️</button></td></tr>`;
        });
        
        html += `</tbody></table></div><div class="card"><button class="btn-primary" onclick="presupuesto.abrirAgregarPresupuesto()">➕ Agregar Presupuesto</button></div>`;
        
        return html;
    },
    
    renderizarResumen(mesesVisibles, mesLabels) {
        const resumen = this.calcularResumenPorPersona(mesesVisibles);
        
        let html = `<div class="card"><h3 class="card-titulo">👥 Resumen de Presupuestos (${mesLabels[0]} - ${mesLabels[2]})</h3><div class="resumen-grid">
            <div class="resumen-card resumen-el"><h4>💙 Presupuesto Él</h4><div class="resumen-items">`;
        
        resumen.él.items.forEach(item => {
            html += `<div class="resumen-item"><span>${item.concepto}</span><span style="font-family:'Courier Prime';font-weight:700;">$${item.monto.toLocaleString('es-MX')}</span></div>`;
        });
        
        html += `</div><div class="resumen-total"><strong>Subtotal:</strong><span style="font-family:'Courier Prime';font-weight:700;color:#4a90e2;">$${resumen.él.total.toLocaleString('es-MX')}</span></div></div>
            <div class="resumen-card resumen-ella"><h4>🧡 Presupuesto Ella</h4><div class="resumen-items">`;
        
        resumen.ella.items.forEach(item => {
            html += `<div class="resumen-item"><span>${item.concepto}</span><span style="font-family:'Courier Prime';font-weight:700;">$${item.monto.toLocaleString('es-MX')}</span></div>`;
        });
        
        html += `</div><div class="resumen-total"><strong>Subtotal:</strong><span style="font-family:'Courier Prime';font-weight:700;color:#f6a192;">$${resumen.ella.total.toLocaleString('es-MX')}</span></div></div>
            <div class="resumen-card resumen-familiar"><h4>💚 Presupuesto Familiar</h4><div class="resumen-items">`;
        
        resumen.familiar.items.forEach(item => {
            html += `<div class="resumen-item"><span>${item.concepto}</span><span style="font-family:'Courier Prime';font-weight:700;">$${item.monto.toLocaleString('es-MX')}</span></div>`;
        });
        
        html += `</div><div class="resumen-total"><strong>Subtotal:</strong><span style="font-family:'Courier Prime';font-weight:700;color:#6ba59a;">$${resumen.familiar.total.toLocaleString('es-MX')}</span></div></div>
        </div><div class="resumen-total-general"><strong>TOTAL PRESUPUESTADO:</strong><span style="font-family:'Courier Prime';font-size:1.5rem;font-weight:900;color:#2d3e3b;">$${(resumen.él.total + resumen.ella.total + resumen.familiar.total).toLocaleString('es-MX')}</span></div></div>`;
        
        return html;
    },
    
    calcularResumenPorPersona(mesesVisibles) {
        const montos = mesesVisibles.map(m => app.presupuestos.reduce((sum, p) => sum + (p.meses[m] || 0), 0));
        
        return {
            él: {
                items: app.presupuestos.filter(p => p.asignadoA === 'él').map(p => ({concepto: p.concepto, monto: Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3)})),
                total: app.presupuestos.filter(p => p.asignadoA === 'él').reduce((sum, p) => {const promedio = Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3); return sum + promedio;}, 0)
            },
            ella: {
                items: app.presupuestos.filter(p => p.asignadoA === 'ella').map(p => ({concepto: p.concepto, monto: Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3)})),
                total: app.presupuestos.filter(p => p.asignadoA === 'ella').reduce((sum, p) => {const promedio = Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3); return sum + promedio;}, 0)
            },
            familiar: {
                items: app.presupuestos.filter(p => p.asignadoA === 'familiar').map(p => ({concepto: p.concepto, monto: Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3)})),
                total: app.presupuestos.filter(p => p.asignadoA === 'familiar').reduce((sum, p) => {const promedio = Math.round(mesesVisibles.map(m => p.meses[m] || 0).reduce((a, b) => a + b) / 3); return sum + promedio;}, 0)
            }
        };
    },
    
    obtenerMesesVisibles() {
        return [this.meses[this.mesInicio], this.meses[(this.mesInicio + 1) % 12], this.meses[(this.mesInicio + 2) % 12]];
    },
    
    formatearMes(mes) {
        const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const num = parseInt(mes.split('-')[1]) - 1;
        return mesesNombres[num];
    },
    
    mesAnterior() {
        this.mesInicio = (this.mesInicio - 1 + 12) % 12;
        this.renderizar();
    },
    
    mesSiguiente() {
        this.mesInicio = (this.mesInicio + 1) % 12;
        this.renderizar();
    },
    
    abrirAgregarPresupuesto() {
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('.navbar-btn').forEach(e => e.classList.remove('active'));
        document.getElementById('configuracion-pres').classList.remove('hidden');
        document.querySelectorAll('.navbar-btn').forEach(btn => {
            if (btn.textContent.includes('Presupuesto')) btn.classList.add('active');
        });
        configurarPresupuesto.renderizar();
    },
    
    abrirEditarPresupuesto(id) {
        const p = app.presupuestos.find(x => x.id === id);
        let html = `<div class="modal-overlay" id="modal-editar-pres"><div class="modal-container"><div class="modal-header"><h2>✏️ Editar: ${p.concepto}</h2><button class="modal-close" onclick="document.getElementById('modal-editar-pres').remove()">✕</button></div><div class="modal-tab" style="padding:1.5rem 0;"><div class="form-grupo"><label class="form-label">Cuenta Asignada</label><select class="form-select" id="edit-cuenta"><option value="">Selecciona cuenta</option>`;
        
        app.cuentas.filter(c => !c.archivado).forEach(c => {
            html += `<option value="${c.nombre}" ${p.cuentaAsignada === c.nombre ? 'selected' : ''}>${c.nombre}</option>`;
        });
        
        html += `</select></div><div class="form-grupo"><label class="form-label">Asignado a:</label><div style="display:flex;gap:1rem;"><label><input type="radio" name="asignado" value="él" ${p.asignadoA === 'él' ? 'checked' : ''}> 💙 Él</label><label><input type="radio" name="asignado" value="ella" ${p.asignadoA === 'ella' ? 'checked' : ''}> 🧡 Ella</label><label><input type="radio" name="asignado" value="familiar" ${p.asignadoA === 'familiar' ? 'checked' : ''}> 💚 Familiar</label></div></div><h4 style="margin-top:2rem;margin-bottom:1rem;font-weight:700;">Meses del Año:</h4><div class="meses-grid">`;
        
        const mesesNombres = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        mesesNombres.forEach((mes, i) => {
            const mesKey = `2026-${String(i + 1).padStart(2, '0')}`;
            const valor = p.meses[mesKey] || 0;
            html += `<div class="mes-input-grupo"><label>${mes}</label><input type="number" class="mes-input" data-mes="${mesKey}" value="${valor}"></div>`;
        });
        
        html += `</div><button class="btn-primary" style="margin-top:2rem;" onclick="presupuesto.guardarEdicion(${id})">Guardar Cambios</button></div></div></div>`;
        
        document.body.insertAdjacentHTML('beforeend', html);
    },
    
    guardarEdicion(id) {
        const cuenta = document.getElementById('edit-cuenta').value;
        const asignado = document.querySelector('input[name="asignado"]:checked').value;
        const meses = {};
        
        document.querySelectorAll('.mes-input').forEach(input => {
            meses[input.dataset.mes] = parseFloat(input.value) || 0;
        });
        
        app.actualizarPresupuesto(id, cuenta, asignado, meses);
        document.getElementById('modal-editar-pres').remove();
        presupuesto.renderizar();
        alert('✅ Presupuesto actualizado');
    }
};