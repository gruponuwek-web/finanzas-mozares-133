const configuracion = {
    tipoActual: 'ingresos',
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">⚙️ Gestionar Categorías</h3>
                <div class="tabs-config">
                    <button class="tab-config-btn active" onclick="configuracion.cambiarTipo('ingresos')">💰 Ingresos</button>
                    <button class="tab-config-btn" onclick="configuracion.cambiarTipo('egresos')">📉 Egresos</button>
                </div>
            </div>
        `;
        
        html += `<div class="card">
            <h3 class="card-titulo">${this.tipoActual === 'ingresos' ? '💰 Categorías de Ingresos' : '📉 Categorías de Egresos'}</h3>
            <div class="categorias-list">`;
        
        app.categorias[this.tipoActual].forEach(cat => {
            html += `
                <div class="categoria-item">
                    <div class="categoria-info">
                        <p class="categoria-nombre">${cat.nombre}</p>
                    </div>
                    <div class="categoria-acciones">
                        <button class="btn-sm btn-edit" onclick="configuracion.abrirEditarCategoria(${cat.id})">✏️ Editar</button>
                        <button class="btn-sm btn-delete" onclick="configuracion.eliminarCategoria(${cat.id})">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        
        html += `
            <div class="card">
                <h3 class="card-titulo">➕ Agregar Categoría</h3>
                <div class="form-grupo">
                    <label class="form-label">Nombre de Categoría</label>
                    <input type="text" class="form-input" id="nueva-cat-nombre" placeholder="Ej: Cine, Gym, Ropa...">
                </div>
                <button class="btn-primary" onclick="configuracion.agregarCategoria()">Agregar</button>
            </div>
        `;
        
        document.getElementById('configuracion-container').innerHTML = html;
    },
    
    cambiarTipo(tipo) {
        this.tipoActual = tipo;
        document.querySelectorAll('.tab-config-btn').forEach(b => b.classList.remove('active'));
        event.target.classList.add('active');
        this.renderizar();
    },
    
    agregarCategoria() {
        const nombre = document.getElementById('nueva-cat-nombre').value;
        
        if (!nombre) {
            alert('Ingresa un nombre para la categoría');
            return;
        }
        
        app.agregarCategoria(this.tipoActual, nombre);
        document.getElementById('nueva-cat-nombre').value = '';
        this.renderizar();
        alert('✅ Categoría agregada');
    },
    
    abrirEditarCategoria(id) {
        const cat = app.categorias[this.tipoActual].find(c => c.id === id);
        const nuevoNombre = prompt(`Editar categoría:\n\nNombre actual: ${cat.nombre}`, cat.nombre);
        
        if (nuevoNombre && nuevoNombre.trim()) {
            app.editarCategoria(this.tipoActual, id, nuevoNombre);
            this.renderizar();
            alert('✅ Categoría actualizada');
        }
    },
    
    eliminarCategoria(id) {
        if (confirm('¿Eliminar esta categoría?')) {
            app.eliminarCategoria(this.tipoActual, id);
            this.renderizar();
            alert('✅ Categoría eliminada');
        }
    }
};
