const transacciones = {
    filtroActivo: {
        tipo: 'Todos',
        categoria: 'Todas',
        cuenta: 'Todas'
    },
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">🔍 Filtros</h3>
                <div class="filtros-grid">
                    <div class="filtro-grupo">
                        <label class="filtro-label">Tipo</label>
                        <select class="filtro-select" onchange="transacciones.setFiltro('tipo', this.value)">
                            <option value="Todos">Todos</option>
                            <option value="Depósito">Depósito</option>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Gasto">Gasto</option>
                            <option value="Obligatoria">Obligatoria</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>
                    <div class="filtro-grupo">
                        <label class="filtro-label">Categoría</label>
                        <select class="filtro-select" onchange="transacciones.setFiltro('categoria', this.value)">
                            <option value="Todas">Todas</option>
                            ${app.categorias.ingresos.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                            ${app.categorias.egresos.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>
                    <div class="filtro-grupo">
                        <label class="filtro-label">Cuenta</label>
                        <select class="filtro-select" onchange="transacciones.setFiltro('cuenta', this.value)">
                            <option value="Todas">Todas</option>
                            ${app.cuentas.filter(c => !c.archivado).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <button class="btn-filtro-limpiar" onclick="transacciones.limpiarFiltros()">Limpiar Filtros</button>
            </div>
            
            <div class="card">
                <h3 class="card-titulo">📋 Historial de Transacciones</h3>
                <div class="transacciones-lista">
        `;
        
        const filtradas = app.transacciones.filter(t => {
            const cumpleTipo = this.filtroActivo.tipo === 'Todos' || t.tipo === this.filtroActivo.tipo;
            const cumpleCategoria = this.filtroActivo.categoria === 'Todas' || t.categoria === this.filtroActivo.categoria;
            const cumpleCuenta = this.filtroActivo.cuenta === 'Todas' || t.cuenta === this.filtroActivo.cuenta;
            return cumpleTipo && cumpleCategoria && cumpleCuenta;
        }).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        if (filtradas.length === 0) {
            html += '<p style="color: #8b9693; text-align: center; padding: 2rem;">No hay transacciones</p>';
        } else {
            filtradas.forEach(t => {
                const claseColor = t.tipo === 'Gasto' ? 'monto-gasto' : t.tipo === 'Obligatoria' ? 'monto-obligatoria' : t.tipo === 'Transferencia' ? 'monto-transferencia' : 'monto-deposito';
                const signo = (t.tipo === 'Gasto' || t.tipo === 'Obligatoria') ? '−' : '+';
                
                html += `
                    <div class="transaccion-item">
                        <div class="transaccion-info">
                            <div class="transaccion-tipo">${t.desc}</div>
                            <div class="transaccion-fecha">${t.fecha} • ${t.categoria} • ${t.cuenta}</div>
                        </div>
                        <div class="transaccion-monto ${claseColor}">${signo}$${t.monto.toLocaleString('es-MX')}</div>
                    </div>
                `;
            });
        }
        
        html += `</div></div>`;
        
        document.getElementById('transacciones-container').innerHTML = html;
    },
    
    setFiltro(campo, valor) {
        this.filtroActivo[campo] = valor;
        this.renderizar();
    },
    
    limpiarFiltros() {
        this.filtroActivo = { tipo: 'Todos', categoria: 'Todas', cuenta: 'Todas' };
        this.renderizar();
    }
};