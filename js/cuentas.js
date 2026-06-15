const cuentas = {
    renderizar() {
        let html = '<div class="grid-2">';
        app.cuentas.forEach(c => {
            html += `
                <div class="cuenta-card">
                    <p class="cuenta-nombre">${c.nombre}</p>
                    <p style="font-size: 0.85rem; color: #8b9693; margin-bottom: 1rem;">${c.tipo}</p>
                    <p class="cuenta-saldo">${c.oculto ? '••••' : '$' + c.saldo.toLocaleString('es-MX')}</p>
                    <div class="cuenta-botones">
                        <button class="btn-sm btn-edit" onclick="cuentas.toggleOcultar(${c.id})">👁️ ${c.oculto ? 'Ver' : 'Ocultar'}</button>
                        <button class="btn-sm btn-delete" onclick="cuentas.eliminar(${c.id})">🗑️ Eliminar</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        html += `
            <div class="card">
                <h3 class="card-titulo">➕ Agregar cuenta</h3>
                <div class="form-row">
                    <div class="form-grupo">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-input" id="new-cuenta-nombre" placeholder="Ej: Débito">
                    </div>
                    <div class="form-grupo">
                        <label class="form-label">Tipo</label>
                        <select class="form-select" id="new-cuenta-tipo">
                            <option>Débito</option>
                            <option>Ahorros</option>
                            <option>Crédito</option>
                        </select>
                    </div>
                </div>
                <div class="form-grupo">
                    <label class="form-label">Saldo</label>
                    <input type="number" class="form-input" id="new-cuenta-saldo" placeholder="0.00">
                </div>
                <button class="btn-primary" onclick="cuentas.agregar()">Crear cuenta</button>
            </div>
        `;
        
        document.getElementById('cuentas-container').innerHTML = html;
    },
    
    agregar() {
        const nombre = document.getElementById('new-cuenta-nombre').value;
        const tipo = document.getElementById('new-cuenta-tipo').value;
        const saldo = parseFloat(document.getElementById('new-cuenta-saldo').value);
        
        if (!nombre || !saldo) { alert('Completa todos los campos'); return; }
        
        app.cuentas.push({ id: Date.now(), nombre, tipo, saldo, oculto: false });
        document.getElementById('new-cuenta-nombre').value = '';
        document.getElementById('new-cuenta-saldo').value = '';
        this.renderizar();
    },
    
    toggleOcultar(id) {
        const c = app.cuentas.find(x => x.id === id);
        if (c) c.oculto = !c.oculto;
        this.renderizar();
    },
    
    eliminar(id) {
        if (confirm('¿Eliminar esta cuenta?')) {
            app.cuentas = app.cuentas.filter(x => x.id !== id);
            this.renderizar();
        }
    }
};
