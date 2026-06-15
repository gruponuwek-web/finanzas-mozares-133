const cuentas = {
    mostrarArchivadas: false,
    
    renderizar() {
        let html = `
            <div class="card">
                <h3 class="card-titulo">💳 Gestionar Cuentas</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                    <button class="btn-toggle" onclick="cuentas.mostrarArchivadas = !cuentas.mostrarArchivadas; cuentas.renderizar();">
                        ${cuentas.mostrarArchivadas ? '👁️ Ocultar archivadas' : '📁 Mostrar archivadas'}
                    </button>
                </div>
            </div>
        `;
        
        const activas = app.cuentas.filter(c => !c.archivado);
        const archivadas = app.cuentas.filter(c => c.archivado);
        
        if (activas.length > 0) {
            html += '<div class="grid-2">';
            activas.forEach(cuenta => {
                html += `
                    <div class="cuenta-card">
                        <div class="cuenta-nombre">${cuenta.nombre}</div>
                        <div class="cuenta-tipo" style="font-size: 0.85rem; color: #8b9693; margin-bottom: 0.5rem;">${cuenta.tipo}</div>
                        <div class="cuenta-saldo">${cuenta.oculto ? '••••' : '$' + cuenta.saldo.toLocaleString('es-MX')}</div>
                        <div class="cuenta-botones">
                            <button class="btn-sm btn-edit" onclick="cuentas.abrirEditarCuenta(${cuenta.id})">✏️ Editar</button>
                            <button class="btn-sm btn-hide" onclick="cuentas.toggleOcultar(${cuenta.id});">${cuenta.oculto ? '👁️' : '👁️‍🗨️'}</button>
                            <button class="btn-sm btn-archive" onclick="cuentas.archivarCuenta(${cuenta.id})">📁 Archivar</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        if (cuentas.mostrarArchivadas && archivadas.length > 0) {
            html += `
                <div class="card" style="opacity: 0.6; background: rgba(107, 165, 154, 0.05);">
                    <h3 class="card-titulo">📁 Cuentas Archivadas (${archivadas.length})</h3>
                    <div class="grid-2">
            `;
            archivadas.forEach(cuenta => {
                html += `
                    <div class="cuenta-card" style="opacity: 0.7; border: 2px dashed #8b9693;">
                        <div class="cuenta-nombre" style="color: #8b9693;">🔒 ${cuenta.nombre}</div>
                        <div class="cuenta-tipo" style="font-size: 0.85rem; color: #8b9693; margin-bottom: 0.5rem;">${cuenta.tipo}</div>
                        <div class="cuenta-saldo" style="color: #8b9693;">$${cuenta.saldo.toLocaleString('es-MX')}</div>
                        <div class="cuenta-botones">
                            <button class="btn-sm btn-restore" onclick="cuentas.desarchivarCuenta(${cuenta.id})">♻️ Restaurar</button>
                        </div>
                    </div>
                `;
            });
            html += '</div></div>';
        }
        
        document.getElementById('cuentas-container').innerHTML = html;
    },
    
    abrirEditarCuenta(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        const nuevoNombre = prompt(`Editar nombre de cuenta:\n\nNombre actual: ${cuenta.nombre}`, cuenta.nombre);
        
        if (nuevoNombre && nuevoNombre.trim()) {
            app.editarCuenta(id, nuevoNombre);
            this.renderizar();
            alert('✅ Cuenta actualizada');
        }
    },
    
    toggleOcultar(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        if (cuenta) {
            cuenta.oculto = !cuenta.oculto;
            this.renderizar();
        }
    },
    
    archivarCuenta(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        if (confirm(`¿Archivar cuenta "${cuenta.nombre}"?\n\nSus transacciones se mantendrán en el historial.`)) {
            app.archivarCuenta(id);
            this.renderizar();
            alert('✅ Cuenta archivada');
        }
    },
    
    desarchivarCuenta(id) {
        const cuenta = app.cuentas.find(c => c.id === id);
        if (confirm(`¿Restaurar cuenta "${cuenta.nombre}"?`)) {
            app.archivarCuenta(id);
            this.renderizar();
            alert('✅ Cuenta restaurada');
        }
    }
};