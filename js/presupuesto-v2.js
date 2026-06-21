const configurarPresupuesto = {
    seleccionados: [],
    expandidos: {},
    pasoActual: 1,
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">⚙️ Configurar Presupuesto 2026</h3>
                <p style="color: #8b9693; margin-bottom: 1.5rem;">Selecciona las categorías y subcategorías que deseas presupuestar</p>
            </div>
            
            <div class="config-grid">
                <div class="config-categorias">
                    <div class="card">
                        <h4 style="margin-bottom: 1rem; font-weight: 700;">Categorías</h4>
                        <div class="arbol-categorias">
        `;
        
        // CATEGORÍAS PREDEFINIDAS
        html += `<div style="margin-bottom: 2rem;">`;
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
        html += `</div>`;
        
        // MIS CATEGORÍAS PERSONALIZADAS
        const personalizadas = app.categorias.egresos.filter(c => !c.predefinida);
        if (personalizadas.length > 0 || true) { // Siempre mostrar la sección
            html += `
                <div style="border-top: 2px solid rgba(107, 165, 154, 0.2); padding-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h5 style="font-weight: 700;">👤 Mis Categorías</h5>
                        <button class="btn-sm" style="background: #6ba59a; color: white;" onclick="configurarPresupuesto.abrirNuevaCategoria()">➕ Agregar</button>
                    </div>
                    
                    ${personalizadas.length === 0 ? `
                        <p style="color: #8b9693; font-size: 0.9rem; margin: 1rem 0;">Aún no tienes categorías personalizadas. ¡Crea una!</p>
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
                        <h4 style="margin-bottom: 1rem; font-weight: 700;">Seleccionados (${this.seleccionados.length})</h4>
                        <div class="lista-seleccionados">
        `;
        
        if (this.seleccionados.length === 0) {
            html += '<p style="color: #8b9693; text-align: center; padding: 2rem;">Selecciona categorías</p>';
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
                        <button class="btn-primary" style="margin-top: 1.5rem;" 
                            ${this.seleccionados.length === 0 ? 'disabled' : ''} 
                            onclick="configurarPresupuesto.abrirWizard()">
                            Siguiente →
                        </button>
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
            // Evitar duplicados
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
            
            // Actualizar en transacciones si existen
            app.transacciones.forEach(t => {
                if (t.categoria === nombreActual) {
                    t.categoria = nuevoNombre;
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
    },
    
    abrirWizard() {
        this.pasoActual = 1;
        this.renderizarWizard();
    },
    
    renderizarWizard() {
        let html = `
            <div class="modal-overlay" id="modal-wizard">
                <div class="modal-container modal-grande">
                    <div class="modal-header">
                        <h2>Paso ${this.pasoActual} de 3: ${this.pasoActual === 1 ? 'Verificar Selección' : this.pasoActual === 2 ? 'Etiquetas' : 'Configuración Final'}</h2>
                        <button class="modal-close" onclick="document.getElementById('modal-wizard').remove()">✕</button>
                    </div>
                    <div class="modal-tab" style="padding: 1.5rem 0;">
        `;
        
        if (this.pasoActual === 1) {
            html += this.renderizarPaso1();
        } else if (this.pasoActual === 2) {
            html += this.renderizarPaso2();
        } else {
            html += this.renderizarPaso3();
        }
        
        html += `
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                        ${this.pasoActual > 1 ? `<button class="btn-secondary" onclick="configurarPresupuesto.pasoActual--; configurarPresupuesto.renderizarWizard();">← Atrás</button>` : ''}
                        <button class="btn-primary" onclick="${this.pasoActual === 3 ? 'configurarPresupuesto.guardarPresupuestos()' : 'configurarPresupuesto.pasoActual++; configurarPresupuesto.renderizarWizard();'}">
                            ${this.pasoActual === 3 ? 'Guardar Presupuesto' : 'Siguiente →'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.innerHTML = document.body.innerHTML.replace(/(<div class="modal-overlay" id="modal-wizard">[\s\S]*?<\/div><\/div>)?$/, '') + html;
    },
    
    renderizarPaso1() {
        return `
            <h4 style="margin-bottom: 1rem; font-weight: 700;">Verifica tu selección</h4>
            <div style="max-height: 300px; overflow-y: auto;">
                ${this.seleccionados.map((sel, idx) => `
                    <div style="padding: 0.8rem; background: rgba(107, 165, 154, 0.05); border-radius: 0.6rem; margin-bottom: 0.5rem;">
                        <strong>${sel.categoria}</strong> → ${sel.subcategoria}
                        <div style="font-size: 0.8rem;">
                            <input type="text" placeholder="Nombre personalizado (opcional)" 
                                class="paso1-nombre" data-idx="${idx}"
                                style="width: 100%; padding: 0.4rem; margin-top: 0.4rem; border: 1px solid #ccc; border-radius: 0.4rem;">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderizarPaso2() {
        return `
            <h4 style="margin-bottom: 1rem; font-weight: 700;">Selecciona etiquetas para cada concepto</h4>
            <div style="max-height: 350px; overflow-y: auto;">
                ${this.seleccionados.map((sel, idx) => `
                    <div style="padding: 1rem; background: rgba(107, 165, 154, 0.05); border-radius: 0.6rem; margin-bottom: 1rem;">
                        <strong>${sel.categoria} → ${sel.subcategoria}</strong>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.5rem; margin-top: 0.8rem;">
                            ${catalogoPresupuesto.etiquetas.map(et => `
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="checkbox" class="paso2-etiqueta" data-idx="${idx}" data-etiqueta="${et.nombre}">
                                    <span style="font-size: 0.85rem;">${et.nombre}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },
    
    renderizarPaso3() {
        return `
            <h4 style="margin-bottom: 1rem; font-weight: 700;">Asignar Cuenta y Montos</h4>
            <div class="form-grupo">
                <label class="form-label">Cuenta donde se registrarán estos gastos:</label>
                <select class="form-select" id="paso3-cuenta">
                    <option value="">Selecciona cuenta</option>
                    ${app.cuentas.filter(c => !c.archivado).map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('')}
                </select>
            </div>
            <div class="form-grupo">
                <label class="form-label">Asignado a:</label>
                <div style="display: flex; gap: 1rem;">
                    <label><input type="radio" name="paso3-asignado" value="él" checked> 💙 Él</label>
                    <label><input type="radio" name="paso3-asignado" value="ella"> 🧡 Ella</label>
                    <label><input type="radio" name="paso3-asignado" value="familiar"> 💚 Familiar</label>
                </div>
            </div>
            <p style="color: #8b9693; margin-top: 1rem; font-size: 0.9rem;">Los montos por mes se configurarán en la siguiente pantalla de presupuestos</p>
        `;
    },
    
    guardarPresupuestos() {
        const cuenta = document.getElementById('paso3-cuenta').value;
        const asignado = document.querySelector('input[name="paso3-asignado"]:checked').value;
        
        if (!cuenta) {
            alert('Selecciona una cuenta');
            return;
        }
        
        // Crear presupuestos
        const mesesVacios = {};
        for (let i = 1; i <= 12; i++) {
            mesesVacios[`2026-${String(i).padStart(2, '0')}`] = 0;
        }
        
        this.seleccionados.forEach(sel => {
            const nombre = document.querySelector(`.paso1-nombre[data-idx="${this.seleccionados.indexOf(sel)}"]`)?.value || sel.subcategoria;
            
            app.presupuestos.push({
                id: Date.now() + Math.random(),
                categoria: sel.categoria,
                concepto: nombre,
                cuentaAsignada: cuenta,
                asignadoA: asignado,
                meses: { ...mesesVacios }
            });
        });
        
        document.getElementById('modal-wizard').remove();
        this.seleccionados = [];
        this.expandidos = {};
        this.renderizar();
        presupuesto.renderizar();
        alert('✅ Presupuestos creados exitosamente');
    }
};