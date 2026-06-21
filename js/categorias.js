const categorias = {
    pestanaActual: 'ingresos',
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">⚙️ Gestionar Categorías</h3>
                <div class="tabs-config">
                    <button class="tab-config-btn ${this.pestanaActual === 'ingresos' ? 'active' : ''}" onclick="categorias.cambiarPestana('ingresos')">💰 Ingresos</button>
                    <button class="tab-config-btn ${this.pestanaActual === 'egresos' ? 'active' : ''}" onclick="categorias.cambiarPestana('egresos')">📉 Egresos</button>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <label class="form-label">Agregar Nueva Categoría</label>
                    <div style="display: flex; gap: 1rem;">
                        <input type="text" class="form-input" id="nueva-categoria" placeholder="Ej: Cine, Gym..." style="flex: 1;">
                        <button class="btn-primary" style="min-width: 150px;" onclick="categorias.agregarCategoria()">Agregar</button>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h3 class="card-titulo">${this.pestanaActual === 'ingresos' ? '💰 Categorías de Ingresos' : '📉 Categorías de Egresos'}</h3>
                <div class="categorias-list">
        `;
        
        const cats = app.categorias[this.pestanaActual];
        cats.forEach(cat => {
            html += `
                <div class="categoria-item">
                    <div class="categoria-info">
                        <div class="categoria-nombre">${cat.nombre}</div>
                        <div style="font-size: 0.8rem; color: #8b9693;">${cat.predefinida ? 'Predefinida' : 'Personalizada'}</div>
                    </div>
                    <div class="categoria-acciones">
                        ${!cat.predefinida ? `
                            <button class="btn-sm btn-edit" onclick="categorias.editarCategoria('${cat.nombre}')">✏️</button>
                            <button class="btn-sm btn-delete" onclick="categorias.eliminarCategoria('${cat.nombre}')">🗑️</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        
        document.getElementById('configuracion-container').innerHTML = html;
    },
    
    cambiarPestana(pestana) {
        this.pestanaActual = pestana;
        this.renderizar();
    },
    
    agregarCategoria() {
        const nombre = document.getElementById('nueva-categoria').value.trim();
        
        if (!nombre) {
            alert('Escribe el nombre de la categoría');
            return;
        }
        
        if (app.agregarCategoria(this.pestanaActual, nombre)) {
            document.getElementById('nueva-categoria').value = '';
            this.renderizar();
        } else {
            alert('Esta categoría ya existe');
        }
    },
    
    editarCategoria(nombre) {
        const nuevoNombre = prompt('Nuevo nombre:', nombre);
        
        if (nuevoNombre && nuevoNombre.trim()) {
            const cat = app.categorias[this.pestanaActual].find(c => c.nombre === nombre);
            if (cat) {
                cat.nombre = nuevoNombre.trim();
                this.renderizar();
            }
        }
    },
    
    eliminarCategoria(nombre) {
        if (confirm(`¿Eliminar la categoría "${nombre}"?`)) {
            app.categorias[this.pestanaActual] = app.categorias[this.pestanaActual].filter(c => c.nombre !== nombre);
            this.renderizar();
        }
    }
};