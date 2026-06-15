const transacciones = {
    filtros: {
        tipo: 'Todos',
        categoria: 'Todas',
        cuenta: 'Todas',
        fechaInicio: null,
        fechaFin: null
    },
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">🔍 Filtros recomendados</h3>
                <div class="filtros-grid">
                    <div class="filtro-grupo">
                        <label class="filtro-label">Tipo</label>
                        <select class="filtro-select" onchange="transacciones.filtros.tipo = this.value; transacciones.renderizar();">
                            <option value="Todos" selected>Todos</option>
                            <option value="Gasto">Gasto</option>
                            <option value="Obligatoria">Obligatoria</option>
                            <option value="Depósito">Depósito</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>
                    <div class="filtro-grupo">
                        <label class="filtro-label">Categoría</label>
                        <select class="filtro-select" onchange="transacciones.filtros.categoria = this.value; transacciones.renderizar();">
                            <option value="Todas" selected>Todas</option>
                            ${app.categorias.ingresos.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                            ${app.categorias.egresos.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filtro-grupo">
                        <label class="filtro-label">Cuenta</label>
                        <select class="filtro-select" onchange="transacciones.filtros.cuenta = this.value; transacciones.renderizar();">
                            <option value="Todas" selected>Todas</option>
                            ${app.cuentas.filter(c => !c.archivado).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filtro-grupo">
                        <label class="filtro-label">Limpiar filtros</label>
                        <button class="btn-filtro-limpiar" onclick="transacciones.limpiarFiltros()">🔄 Limpiar</button>
                    </div>
                </div>
            </div>
        `;
        
        const transaccionesFiltradas = this.aplicarFiltros();
        
        html += `<div class="card">
            <h3 class="card-titulo">📝 Historial de Transacciones (${transaccionesFiltradas.length})</h3>`;
        
        if (transaccionesFiltradas.length === 0) {
            html += '<p style="color: #8b9693; text-align: center; padding: 2rem;">Sin transacciones</p>';
        } else {
            html += '<div class="transacciones-lista">';
            transaccionesFiltradas.forEach(t => {
                const icono = t.tipo === 'Gasto' ? '📉' : t.tipo === 'Obligatoria' ? '📋' : t.tipo === 'Depósito' ? '💰' : '↔️';
                const clase = t.tipo === 'Gasto' ? 'monto-gasto' : t.tipo === 'Obligatoria' ? 'monto-obligatoria' : t.tipo === 'Depósito' ? 'monto-deposito' : 'monto-transferencia';
                
                html += `
                    <div class="transaccion-item">
                        <div class="transaccion-info">
                            <p class="transaccion-tipo">${icono} ${t.tipo} - ${t.categoria}</p>
                            <p class="transaccion-fecha">${t.fecha} | ${t.desc}</p>
                            <p style="font-size: 0.85rem; color: #8b9693; margin-top: 0.3rem;">💳 ${t.cuenta || 'Sin cuenta'}</p>
                        </div>
                        <div class="transaccion-monto ${clase}">$${t.monto.toLocaleString('es-MX')}</div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        html += '</div>';
        document.getElementById('transacciones-container').innerHTML = html;
    },
    
    aplicarFiltros() {
        let resultado = app.transacciones;
        
        if (this.filtros.tipo !== 'Todos') {
            resultado = resultado.filter(t => t.tipo === this.filtros.tipo);
        }
        
        if (this.filtros.categoria !== 'Todas') {
            resultado = resultado.filter(t => t.categoria === this.filtros.categoria);
        }
        
        if (this.filtros.cuenta !== 'Todas') {
            resultado = resultado.filter(t => t.cuenta === this.filtros.cuenta);
        }
        
        return resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    },
    
    limpiarFiltros() {
        this.filtros = {
            tipo: 'Todos',
            categoria: 'Todas',
            cuenta: 'Todas',
            fechaInicio: null,
            fechaFin: null
        };
        this.renderizar();
    }
};