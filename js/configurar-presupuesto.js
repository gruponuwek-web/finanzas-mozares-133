const configurarPresupuesto = {
    seleccionados: [],
    expandidos: {},
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">⚙️ Configurar Presupuesto 2026</h3>
                <p style="color: #8b9693; margin-bottom: 1.5rem;">Selecciona las categorías y subcategorías que deseas presupuestar</p>
            </div>
            
            <div class="config-grid">
                <div class="config-categorias">
                    <div class="card">
                        <h4 style="margin-bottom: 1rem; font-weight: 700;">📋 Categorías Disponibles</h4>
                        <div class="arbol-categorias">
        `;
        
        // CATEGORÍAS PREDEFINIDAS
        catalogoPresupuesto.categorias.forEach(cat => {
            const expandido = this.expandidos[`cat-${cat.id}`];
            html += `
                <div class="categoria-item">
                    <div class="categoria-header">
                        <button class="btn-expandir" onclick="configurarPresupuesto.toggleExpandir('cat-${cat.id}')">
                            ${expandido ? '▼' : '▶'} ${cat.icono} <strong>${cat.nombre}</strong>
                        </button>
                    </div>
                    ${expandido ? `
                        <div class="subcategorias-lista">
                            ${cat.subcategorias.map(sub => `
                                <label class="checkbox-subcategoria">
                                    <input type="checkbox" 
                                        data-cat="${cat.nombre}" 
                                        data-sub="${sub.nombre}"
                                        onchange="configurarPresupuesto.toggleSeleccion(this)">
                                    <span>${sub.nombre}</span>
                                </label>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        });
        
        // MIS CATEGORÍAS PERSONALIZADAS
        const personalizadas = app.categorias.egresos.filter(c => !c.predefinida);
        if (personalizadas.length > 0 || true) {
            html += `
                <div style="border-top: 2px solid rgba(107, 165, 154, 0.2); padding-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h5 style="font-weight: 700;">👤 Mis Categorías</h5>
                        <button class="btn-sm" style="background: #6ba59a; color: white;" onclick="configurarPresupuesto.abrirNuevaCategoria()">➕ Agregar</button>
                    </div>
                    
                    ${personalizadas.length === 0 ? `
                        <p style="color: #8b9693; font-size: 0.9rem; margin: 1rem 0;">Aún no tienes categorías personalizadas.</p>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${personalizadas.map(cat => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: rgba(107, 165, 154, 0.08); border-radius: 0.6rem;">
                                    <label class="checkbox-subcategoria" style="margin: 0;">
                                        <input type="checkbox" 
                                            data-cat="${cat.nombre}" 
                                            data-sub="${cat.nombre}"
                                            onchange="configurarPresupuesto.toggleSeleccion(this)">
                                        <span>${cat.nombre}</span>
                                    </label>
                                    <div style="display: flex; gap: 0.4rem;">
                                        <button class="btn-sm btn-edit" onclick="configurarPresupuesto.editarCategoria('${cat.nombre}')">✏️</button>
                                        <button class="btn-sm btn-delete" onclick="configurarPresupuesto.eliminarCategoria('${cat.nombre}')">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
        }
        
        html += `
                        </div>
                    </div>
                </div>
                
                <div class="config-seleccionados">
                    <div class="card">
                        <h4 style="margin-bottom: 1rem; font-weight: 700;">✓ Seleccionados (${this.seleccionados.length})</h4>
                        <div class="lista-seleccionados">
        `;
        
        if (this.seleccionados.length === 0) {
            html += '<p style="color: #8b9693; text-align: center; padding: 2rem;">Selecciona categorías para comenzar</p>';
        } else {
            this.seleccionados.forEach((sel, idx) => {
                html += `
                    <div class="seleccionado-item">
                        <div>
                            <strong>${sel.categoria}</strong>
                            <div style="font-size: 0.85rem; color: #8b9693;">${sel.subcategoria}</div>
                        </div>
                        <button class="btn-sm btn-delete" onclick="configurarPresupuesto.quitarSeleccion(${idx})">✕</button>
                    </div>
                `;
            });
        }
        
        html += `
                        </div>
                        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                            <button class="btn-primary" style="flex: 1;" 
                                ${this.seleccionados.length === 0 ? 'disabled' : ''} 
                                onclick="configurarPresupuesto.agregarPresupuestos()">
                                ➕ Agregar
                            </button>
                            <button class="btn-secondary" style="flex: 1; background: #8b9693;" 
                                onclick="configurarPresupuesto.limpiarSeleccion()">
                                Limpiar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('configuracion-container').innerHTML = html;
    },
    
    toggleExpandir(catId) {
        this.expandidos[catId] = !this.expandidos[catId];
        this.renderizar();
    },
    
    toggleSeleccion(checkbox) {
        const categoria = checkbox.dataset.cat;
        const subcategoria = checkbox.dataset.sub;
        
        if (checkbox.checked) {
            // Evitar duplicados en la selección
            if (!this.seleccionados.some(s => s.categoria === categoria && s.subcategoria === subcategoria)) {
                this.seleccionados.push({ categoria, subcategoria });
            }
        } else {
            this.seleccionados = this.seleccionados.filter(
                s => !(s.categoria === categoria && s.subcategoria === subcategoria)
            );
        }
        
        this.renderizar();
    },
    
    quitarSeleccion(idx) {
        this.seleccionados.splice(idx, 1);
        this.renderizar();
    },
    
    limpiarSeleccion() {
        this.seleccionados = [];
        this.renderizar();
    },
    
    agregarPresupuestos() {
        if (this.seleccionados.length === 0) {
            alert('Selecciona al menos una categoría');
            return;
        }
        
        // Validar duplicados en presupuestos existentes
        const duplicados = this.seleccionados.filter(sel => 
            app.presupuestos.some(p => 
                p.categoria === sel.categoria && p.concepto === sel.subcategoria
            )
        );
        
        let seleccionarAgregar = this.seleccionados;
        
        if (duplicados.length > 0) {
            const mensajeDuplicados = duplicados.map(d => `  • ${d.categoria} > ${d.subcategoria}`).join('\n');
            const confirmacion = confirm(
                `⚠️ Los siguientes conceptos ya existen:\n\n${mensajeDuplicados}\n\n¿Agregar solo los nuevos?`
            );
            
            if (!confirmacion) return;
            
            // Filtrar solo los que no existen
            seleccionarAgregar = this.seleccionados.filter(sel =>
                !duplicados.some(d => d.categoria === sel.categoria && d.subcategoria === sel.subcategoria)
            );
        }
        
        // Crear presupuestos con montos en $0
        const mesesVacios = {};
        for (let i = 1; i <= 12; i++) {
            mesesVacios[`2026-${String(i).padStart(2, '0')}`] = 0;
        }
        
        seleccionarAgregar.forEach(sel => {
            app.presupuestos.push({
                id: Date.now() + Math.random(),
                categoria: sel.categoria,
                concepto: sel.subcategoria,
                cuentaAsignada: '',
                asignadoA: 'familiar',
                meses: { ...mesesVacios }
            });
        });
        
        // Volver a presupuestos
        this.seleccionados = [];
        this.expandidos = {};
        
        document.querySelectorAll('.content').forEach(e => e.classList.add('hidden'));
        document.querySelectorAll('.navbar-btn').forEach(e => e.classList.remove('active'));
        document.getElementById('presupuesto').classList.remove('hidden');
        document.querySelectorAll('.navbar-btn').forEach(btn => {
            if (btn.textContent.includes('Presupuesto')) btn.classList.add('active');
        });
        
        presupuesto.renderizar();
        alert(`✅ ${seleccionarAgregar.length} presupuesto(s) agregado(s)\n\nAhora edita cada uno para configurar cuenta, asignado a y montos`);
    },
    
    abrirNuevaCategoria() {
        let html = `
            <div class="modal-overlay" id="modal-nueva-cat">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>➕ Nueva Categoría Personalizada</h2>
                        <button class="modal-close" onclick="document.getElementById('modal-nueva-cat').remove()">✕</button>
                    </div>
                    <div class="modal-tab" style="padding: 1.5rem 0;">
                        <div class="form-grupo">
                            <label class="form-label">Nombre de la Categoría</label>
                            <input type="text" class="form-input" id="nombre-nueva-cat" placeholder="Ej: Cine, Gym, Viajes...">
                        </div>
                        <button class="btn-primary" onclick="configurarPresupuesto.guardarNuevaCategoria()">Crear Categoría</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => document.getElementById('nombre-nueva-cat').focus(), 100);
    },
    
    guardarNuevaCategoria() {
        const nombre = document.getElementById('nombre-nueva-cat').value.trim();
        
        if (!nombre) {
            alert('Escribe el nombre de la categoría');
            return;
        }
        
        if (app.categorias.egresos.some(c => c.nombre.toLowerCase() === nombre.toLowerCase())) {
            alert('Esta categoría ya existe');
            return;
        }
        
        app.categorias.egresos.push({
            id: Date.now(),
            nombre: nombre,
            predefinida: false
        });
        
        document.getElementById('modal-nueva-cat').remove();
        this.renderizar();
        alert('✅ Categoría creada');
    },
    
    editarCategoria(nombreActual) {
        const cat = app.categorias.egresos.find(c => c.nombre === nombreActual);
        
        let html = `
            <div class="modal-overlay" id="modal-editar-cat">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>✏️ Editar Categoría</h2>
                        <button class="modal-close" onclick="document.getElementById('modal-editar-cat').remove()">✕</button>
                    </div>
                    <div class="modal-tab" style="padding: 1.5rem 0;">
                        <div class="form-grupo">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-input" id="nombre-edit-cat" value="${nombreActual}">
                        </div>
                        <button class="btn-primary" onclick="configurarPresupuesto.guardarEdicionCategoria('${nombreActual}')">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', html);
        setTimeout(() => document.getElementById('nombre-edit-cat').focus(), 100);
    },
    
    guardarEdicionCategoria(nombreActual) {
        const nuevoNombre = document.getElementById('nombre-edit-cat').value.trim();
        
        if (!nuevoNombre) {
            alert('Escribe el nuevo nombre');
            return;
        }
        
        const cat = app.categorias.egresos.find(c => c.nombre === nombreActual);
        if (cat) {
            cat.nombre = nuevoNombre;
            
            // Actualizar en transacciones y presupuestos
            app.transacciones.forEach(t => {
                if (t.categoria === nombreActual) {
                    t.categoria = nuevoNombre;
                }
            });
            
            app.presupuestos.forEach(p => {
                if (p.categoria === nombreActual) {
                    p.categoria = nuevoNombre;
                }
            });
        }
        
        document.getElementById('modal-editar-cat').remove();
        this.renderizar();
        alert('✅ Categoría actualizada');
    },
    
    eliminarCategoria(nombre) {
        const confirmacion = confirm(`¿Eliminar la categoría "${nombre}"?\n\nLas transacciones existentes no serán afectadas.`);
        
        if (!confirmacion) return;
        
        app.categorias.egresos = app.categorias.egresos.filter(c => c.nombre !== nombre);
        this.renderizar();
        alert('✅ Categoría eliminada');
    }
};