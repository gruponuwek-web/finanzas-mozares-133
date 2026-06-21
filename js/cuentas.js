const cuentas = {
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">Agregar Nueva Cuenta</h3>
                <div class="form-grupo">
                    <label class="form-label">Nombre de la Cuenta</label>
                    <input type="text" class="form-input" id="nombre-cuenta" placeholder="Ej: Débito Personal">
                </div>
                <div class="form-grupo">
                    <label class="form-label">Tipo de Cuenta</label>
                    <select class="form-select" id="tipo-cuenta">
                        <option value="Débito">Débito</option>
                        <option value="Crédito">Crédito</option>
                        <option value="Ahorros">Ahorros</option>
                        <option value="Efectivo">Efectivo</option>
                    </select>
                </div>
                <div class="form-grupo">
                    <label class="form-label">Saldo Inicial</label>
                    <input type="number" class="form-input" id="saldo-cuenta" placeholder="0" value="0">
                </div>
                <button class="btn-primary" onclick="cuentas.agregarCuenta()">Agregar Cuenta</button>
            </div>
            
            <div class="card">
                <h3 class="card-titulo">Mis Cuentas</h3>
                <div class="grid-2">
        `;
        
        const cuentasActivas = app.cuentas.filter(c => !c.archivado);
        if (cuentasActivas.length === 0) {
            html += '<p style="color: #8b9693;">No tienes cuentas activas</p>';
        } else {
            cuentasActivas.forEach(c => {
                html += `
                    <div class="cuenta-card">
                        <div class="cuenta-nombre">${c.nombre}</div>
                        <div class="cuenta-tipo">${c.tipo}</div>
                        <div class="cuenta-saldo">${c.oculto ? '••••' : '$' + c.saldo.toLocaleString('es-MX')}</div>
                        <div class="cuenta-botones">
                            <button class="btn-sm btn-edit" onclick="cuentas.editarCuenta(${c.id})">✏️ Editar</button>
                            <button class="btn-sm btn-hide" onclick="cuentas.toggleOcultar(${c.id})">${c.oculto ? '👁️' : '👁️‍🗨️'}</button>
                            <button class="btn-sm btn-archive" onclick="cuentas.archivarCuenta(${c.id})">📁 Archivar</button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `</div></div>`;
        
        const cuentasArchivadas = app.cuentas.filter(c => c.archivado);
        if (cuentasArchivadas.length > 0) {
            html += `
                <div class="card">
                    <h3 class="card-titulo">Cuentas Archivadas</h3>
                    <div class="grid-2">
            `;
            
            cuentasArchivadas.forEach(c => {
                html += `
                    <div class="cuenta-card" style="opacity: 0.6;">
                        <div class="cuenta-nombre">${c.nombre}</div>
                        <div class="cuenta-tipo">${c.tipo}</div>
                        <div class="cuenta-saldo">$${c.saldo.toLocaleString('es-MX')}</div>
                        <div class="cuenta-botones">
                            <button class="btn-sm btn-restore" onclick="cuentas.restaurarCuenta(${c.id})">♻️ Restaurar</button>
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        document.getElementById('cuentas-container').innerHTML = html;
    },
    
    agregarCuenta() {
        const nombre = document.getElementById('nombre-cuenta').value.trim();
        const tipo = document.getElementById('tipo-cuenta').value;
        const saldo = parseFloat(document.getElementById('saldo-cuenta').value) || 0;
        
        if (!nombre) {
            alert('Escribe el nombre de la cuenta');
            return;
        }
        
        app.agregarCuenta(nombre, tipo, saldo);
        document.getElementById('nombre-cuenta').value = '';
        document.getElementById('saldo-cuenta').value = '0';
        this.renderizar();
    },
    
    editarCuenta(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        const nuevoNombre = prompt('Nuevo nombre de la cuenta:', cuenta.nombre);
        
        if (nuevoNombre && nuevoNombre.trim()) {
            app.editarCuenta(id, nuevoNombre.trim());
            this.renderizar();
        }
    },
    
    archivarCuenta(id) {
        app.archivarCuenta(id);
        this.renderizar();
    },
    
    restaurarCuenta(id) {
        app.restaurarCuenta(id);
        this.renderizar();
    },
    
    toggleOcultar(id) {
        app.toggleOcultarSaldo(id);
        this.renderizar();
    }
};