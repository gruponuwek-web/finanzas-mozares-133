const presupuesto = {
    mesActual: new Date().toISOString().slice(0, 7),
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">📋 Presupuestos por mes</h3>
                <div class="form-grupo">
                    <label class="form-label">Seleccionar mes</label>
                    <select class="form-select" id="mes-selector" onchange="presupuesto.cambiarMes()">
                        <option value="2026-01">Enero 2026</option>
                        <option value="2026-02">Febrero 2026</option>
                        <option value="2026-03">Marzo 2026</option>
                        <option value="2026-04">Abril 2026</option>
                        <option value="2026-05">Mayo 2026</option>
                        <option value="2026-06">Junio 2026</option>
                        <option value="2026-07">Julio 2026</option>
                        <option value="2026-08">Agosto 2026</option>
                        <option value="2026-09">Septiembre 2026</option>
                        <option value="2026-10">Octubre 2026</option>
                        <option value="2026-11">Noviembre 2026</option>
                        <option value="2026-12">Diciembre 2026</option>
                    </select>
                </div>
            </div>
        `;
        
        const presupuetosMes = app.presupuestos.filter(p => p.mes === this.mesActual);
        const comparativa = gssync.compararPresupuestoVsRealizado(this.mesActual);
        
        html += '<div class="card"><h3 class="card-titulo">💰 Presupuestos clasificados</h3>';
        
        if (presupuetosMes.length === 0) {
            html += '<p style="color: #8b9693; text-align: center; padding: 2rem;">Sin presupuestos para este mes</p>';
        } else {
            html += '<table class="tabla"><thead><tr><th>Categoría</th><th>Presupuestado</th><th>Realizado</th><th>Diferencia</th><th>%</th><th>Acción</th></tr></thead><tbody>';
            
            presupuetosMes.forEach(p => {
                const comp = comparativa[p.categoria] || { presupuestado: p.monto, realizado: 0, diferencia: p.monto, porcentaje: 0 };
                const estado = comp.realizado > comp.presupuestado ? '🔴 Excedido' : '🟢 En rango';
                
                html += `
                    <tr>
                        <td style="font-weight: 700;">${p.categoria}</td>
                        <td style="font-family: 'Courier Prime'; color: #6ba59a;">$${comp.presupuestado.toLocaleString('es-MX')}</td>
                        <td style="font-family: 'Courier Prime'; color: #e88a7e;">$${comp.realizado.toLocaleString('es-MX')}</td>
                        <td style="font-family: 'Courier Prime'; color: ${comp.diferencia >= 0 ? '#6ba59a' : '#e88a7e'};">$${comp.diferencia.toLocaleString('es-MX')}</td>
                        <td>${comp.porcentaje}%</td>
                        <td>${estado}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
        }
        
        html += '</div>';
        
        html += `
            <div class="card">
                <h3 class="card-titulo">➕ Agregar presupuesto</h3>
                <div class="form-row">
                    <div class="form-grupo">
                        <label class="form-label">Categoría</label>
                        <select class="form-select" id="new-pres-cat">
                            <option value="">Selecciona categoría</option>
                        </select>
                    </div>
                    <div class="form-grupo">
                        <label class="form-label">Monto</label>
                        <input type="number" class="form-input" id="new-pres-monto" placeholder="0.00">
                    </div>
                </div>
                <div class="form-grupo">
                    <label class="form-label">Mes</label>
                    <select class="form-select" id="new-pres-mes">
                        <option value="2026-01">Enero 2026</option>
                        <option value="2026-02">Febrero 2026</option>
                        <option value="2026-03">Marzo 2026</option>
                        <option value="2026-04">Abril 2026</option>
                        <option value="2026-05">Mayo 2026</option>
                        <option value="2026-06">Junio 2026</option>
                        <option value="2026-07">Julio 2026</option>
                        <option value="2026-08">Agosto 2026</option>
                        <option value="2026-09">Septiembre 2026</option>
                        <option value="2026-10">Octubre 2026</option>
                        <option value="2026-11">Noviembre 2026</option>
                        <option value="2026-12">Diciembre 2026</option>
                    </select>
                </div>
                <button class="btn-primary" onclick="presupuesto.agregar()">Crear presupuesto</button>
            </div>
        `;
        
        document.getElementById('presupuesto-container').innerHTML = html;
        document.getElementById('mes-selector').value = this.mesActual;
        
        this.cargarCategorias();
    },
    
    cargarCategorias() {
        const catSelect = document.getElementById('new-pres-cat');
        catSelect.innerHTML = '<option value="">Selecciona categoría</option>';
        app.categorias.egresos.forEach(cat => {
            catSelect.innerHTML += `<option value="${cat.nombre}">${cat.nombre}</option>`;
        });
    },
    
    cambiarMes() {
        this.mesActual = document.getElementById('mes-selector').value;
        this.renderizar();
    },
    
    agregar() {
        const categoria = document.getElementById('new-pres-cat').value;
        const monto = parseFloat(document.getElementById('new-pres-monto').value);
        const mes = document.getElementById('new-pres-mes').value;
        
        if (!categoria || !monto || !mes) {
            alert('Completa todos los campos');
            return;
        }
        
        app.presupuestos.push({
            id: Date.now(),
            mes,
            categoria,
            monto,
            estado: 'Activo'
        });
        
        gssync.guardarPresupuesto({ mes, categoria, monto, estado: 'Activo' });
        
        document.getElementById('new-pres-cat').value = '';
        document.getElementById('new-pres-monto').value = '';
        
        this.renderizar();
    },
    
    eliminar(id) {
        if (confirm('¿Eliminar este presupuesto?')) {
            app.presupuestos = app.presupuestos.filter(p => p.id !== id);
            this.renderizar();
        }
    }
};