const presupuesto = {
    pestanaActual: 'conceptos',
    mesInicio: 5, // 0=enero, 5=junio
    
    renderizar() {
        let html = `
            <div class="card">
                <div class="presupuesto-tabs">
                    <button class="presupuesto-tab-btn ${this.pestanaActual === 'conceptos' ? 'active' : ''}" onclick="presupuesto.cambiarPestana('conceptos')">📊 Conceptos</button>
                    <button class="presupuesto-tab-btn ${this.pestanaActual === 'resumen' ? 'active' : ''}" onclick="presupuesto.cambiarPestana('resumen')">👥 Resumen por Persona</button>
                </div>
            </div>
        `;
        
        if (this.pestanaActual === 'conceptos') {
            html += this.renderizarConceptos();
        } else {
            html += this.renderizarResumen();
        }
        
        document.getElementById('presupuesto-container').innerHTML = html;
    },
    
    cambiarPestana(pestana) {
        this.pestanaActual = pestana;
        this.renderizar();
    },
    
    renderizarConceptos() {
        const meses = this.obtenerMesesVisibles();
        const mesLabels = meses.map(m => this.formatearMes(m));
        
        let html = `
            <div class="card">
                <h3 class="card-titulo">📋 Conceptos Presupuestados</h3>
                <div class="navegacion-meses">
                    <button class="btn-mes" onclick="presupuesto.mesAnterior()">◀ Anterior</button>
                    <span class="rango-meses">${mesLabels[0]} - ${mesLabels[2]}</span>
                    <button class="btn-mes" onclick="presupuesto.mesSiguiente()">Siguiente ▶</button>
                </div>
            </div>
        `;
        
        html += `
            <div class="card">
                <table class="tabla-presupuestos">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Concepto</th>
                            <th>${mesLabels[0]}</th>
                            <th>${mesLabels[1]}</th>
                            <th>${mesLabels[2]}</th>
                            <th>Cuenta</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        app.presupuestos.forEach(p => {
            const val1 = p.meses[meses[0]] || 0;
            const val2 = p.meses[meses[1]] || 0;
            const val3 = p.meses[meses[2]] || 0;
            
            html += `
                <tr>
                    <td>${p.categoria}</td>
                    <td style="font-weight: 700;">${p.concepto}</td>
                    <td style="font-family: 'Courier Prime'; color: #6ba59a;">$${val1.toLocaleString('es-MX')}</td>
                    <td style="font-family: 'Courier Prime'; color: #6ba59a;">$${val2.toLocaleString('es-MX')}</td>
                    <td style="font-family: 'Courier Prime'; color: #6ba59a;">$${val3.toLocaleString('es-MX')}</td>
                    <td style="font-size: 0.85rem;">${p.cuentaAsignada || '-'}</td>
                    <td><button class="btn-sm btn-edit" onclick="presupuesto.abrirEditarPresupuesto(${p.id})">✏️</button></td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
            <div class="card">
                <button class="btn-primary" onclick="presupuesto.abrirAgregarPresupuesto()">➕ Agregar Presupuesto</button>
            </div>
        `;
        
        return html;
    },
    
    renderizarResumen() {
        const mesInicio = this.meses[this.mesInicio];
        const mesFin = this.meses[(this.mesInicio + 2) % 12];
        
        const resumen = this.calcularResumenPorPersona();
        
        let html = `
            <div class="card">
                <h3 class="card-titulo">👥 Resumen de Presupuestos (${this.formatearMes(this.meses[this.mesInicio])} - ${this.formatearMes(this.meses[(this.mesInicio + 2) % 12])})</h3>
                
                <div class="resumen-grid">
                    <div class="resumen-card resumen-el">
                        <h4>💙 Presupuesto Él</h4>
                        <div class="resumen-items">
        `;
        
        resumen.él.items.forEach(item => {
            html += `<div class="resumen-item">
                <span>${item.concepto}</span>
                <span style="font-family: 'Courier Prime'; font-weight: 700;">$${item.monto.toLocaleString('es-MX')}</span>
            </div>`;
        });
        
        html += `
                        </div>
                        <div class="resumen-total">
                            <strong>Subtotal Él:</strong>
                            <span style="font-family: 'Courier Prime'; font-size: 1.3rem; color: #4a90e2;">$${resumen.él.total.toLocaleString('es-MX')}</span>
                        </div>
                    </div>
                    
                    <div class="resumen-card resumen-ella">
                        <h4>🧡 Presupuesto Ella</h4>
                        <div class="resumen-items">
        `;
        
        resumen.ella.items.forEach(item => {
            html += `<div class="resumen-item">
                <span>${item.concepto}</span>
                <span style="font-family: 'Courier Prime'; font-weight: 700;">$${item.monto.toLocaleString('es-MX')}</span>
            </div>`;
        });
        
        html += `
                        </div>
                        <div class="resumen-total">
                            <strong>Subtotal Ella:</strong>
                            <span style="font-family: 'Courier Prime'; font-size: 1.3rem; color: #f6a192;">$${resumen.ella.total.toLocaleString('es-MX')}</span>
                        </div>
                    </div>
                    
                    <div class="resumen-card resumen-familiar">
                        <h4>💚 Presupuesto Familiar</h4>
                        <div class="resumen-items">
        `;
        
        resumen.familiar.items.forEach(item => {
            html += `<div class="resumen-item">
                <span>${item.concepto}</span>
                <span style="font-family: 'Courier Prime'; font-weight: 700;">$${item.monto.toLocaleString('es-MX')}</span>
            </div>`;
        });
        
        html += `
                        </div>
                        <div class="resumen-total">
                            <strong>Subtotal Familiar:</strong>
                            <span style="font-family: 'Courier Prime'; font-size: 1.3rem; color: #6ba59a;">$${resumen.familiar.total.toLocaleString('es-MX')}</span>
                        </div>
                    </div>
                </div>
                
                <div class="resumen-total-general">
                    <strong>TOTAL PRESUPUESTADO:</strong>
                    <span style="font-family: 'Courier Prime'; font-size: 1.5rem; font-weight: 900; color: #2d3e3b;">$${(resumen.él.total + resumen.ella.total + resumen.familiar.total).toLocaleString('es-MX')}</span>
                </div>
            </div>
        `;
        
        return html;
    },
    
    calcularResumenPorPersona() {
        const meses = this.obtenerMesesVisibles();
        const promedio = meses.map(m => app.presupuestos.reduce((sum, p) => sum + (p.meses[m] || 0), 0));
        const montoPromedio = Math.round(promedio.reduce((a, b) => a + b) / 3);
        
        return {
            él: {
                items: app.presupuestos.filter(p => p.asignadoA === 'él').map(p => ({
                    concepto: p.concepto,
                    monto: montoPromedio
                })),
                total: app.presupuestos.filter(p => p.asignadoA === 'él').length * montoPromedio
            },
            ella: {
                items: app.presupuestos.filter(p => p.asignadoA === 'ella').map(p => ({
                    concepto: p.concepto,
                    monto: montoPromedio
                })),
                total: app.presupuestos.filter(p => p.asignadoA === 'ella').length * montoPromedio
            },
            familiar: {
                items: app.presupuestos.filter(p => p.asignadoA === 'familiar').map(p => ({
                    concepto: p.concepto,
                    monto: montoPromedio
                })),
                total: app.presupuestos.filter(p => p.asignadoA === 'familiar').length * montoPromedio
            }
        };
    },
    
    obtenerMesesVisibles() {
        const meses = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'];
        return [meses[this.mesInicio], meses[(this.mesInicio + 1) % 12], meses[(this.mesInicio + 2) % 12]];
    },
    
    formatearMes(mes) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const num = parseInt(mes.split('-')[1]) - 1;
        return meses[num];
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
        alert('Modal para agregar presupuesto (pendiente de implementar)');
    },
    
    abrirEditarPresupuesto(id) {
        const p = app.presupuestos.find(x => x.id === id);
        alert(`Editar: ${p.concepto} (pendiente de implementar)`);
    }
};