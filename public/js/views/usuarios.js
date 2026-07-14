import { graphqlQuery } from '../api.js';
import { hasPermission } from '../app.js';

let viewContainer = null;
let rolesList = [];

// --- VIEW INITIALIZATION ---
export async function renderUsuarios(container) {
    viewContainer = container;
    await loadListView();
}

// --- LIST VIEW ---
async function loadListView() {
    viewContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="m-0 text-secondary">Catálogo de Usuarios</h4>
        </div>
        <div id="usr-alert" class="alert alert-danger d-none" role="alert"></div>
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Usuario</th>
                        <th>Estado</th>
                        <th>Rol Asignado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="usr-table-body">
                    <!-- Filas cargadas dinámicamente -->
                </tbody>
            </table>
        </div>
    `;

    try {
        const query = `
            query {
                Usuarios {
                    id_usr
                    username_usr
                    estado_usr
                    id_rol
                    rol {
                        nombre_rol
                    }
                }
            }
        `;
        const data = await graphqlQuery(query);
        const tbody = document.getElementById('usr-table-body');
        tbody.innerHTML = '';

        if (data.Usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se encontraron usuarios registrados.</td></tr>';
            return;
        }

        const canEdit = hasPermission('editar', 'usuario') || hasPermission('actualizar', 'usuario');
        const canDelete = hasPermission('eliminar', 'usuario');

        data.Usuarios.forEach(u => {
            const tr = document.createElement('tr');
            
            let actionsHtml = '';
            if (canEdit) {
                actionsHtml += `<button class="btn btn-sm btn-outline-warning me-2 btn-editar" data-id="${u.id_usr}">Editar</button>`;
            }
            if (canDelete) {
                actionsHtml += `<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${u.id_usr}">Eliminar</button>`;
            }
            if (!canEdit && !canDelete) {
                actionsHtml = '<span class="text-muted small">Sin permisos</span>';
            }

            tr.innerHTML = `
                <td><strong>${u.id_usr}</strong></td>
                <td>${u.username_usr}</td>
                <td>
                    <span class="badge ${u.estado_usr ? 'bg-success' : 'bg-danger'}">
                        ${u.estado_usr ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>${u.rol ? u.rol.nombre_rol : '<span class="text-muted">Sin Rol</span>'}</td>
                <td class="text-end">${actionsHtml}</td>
            `;

            if (canEdit) {
                tr.querySelector('.btn-editar').addEventListener('click', () => showForm(u));
            }
            if (canDelete) {
                tr.querySelector('.btn-eliminar').addEventListener('click', () => deleteUsuario(u.id_usr));
            }

            tbody.appendChild(tr);
        });
    } catch (err) {
        const alert = document.getElementById('usr-alert');
        alert.textContent = 'Error al cargar usuarios: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- FORM VIEW (EDIT) ---
async function showForm(usuario) {
    try {
        const dataRoles = await graphqlQuery(`
            query {
                Roles {
                    id_rol
                    nombre_rol
                }
            }
        `);
        rolesList = dataRoles.Roles;
    } catch (e) {
        rolesList = [];
    }

    const rolOptions = rolesList.map(r => 
        `<option value="${r.id_rol}" ${usuario.id_rol === r.id_rol ? 'selected' : ''}>${r.nombre_rol}</option>`
    ).join('');

    viewContainer.innerHTML = `
        <h4 class="mb-4 text-secondary">Editar Usuario</h4>
        <form id="usr-form" class="row g-3">
            <input type="hidden" id="id_usr" value="${usuario.id_usr}">
            
            <div class="col-md-6">
                <label for="username_usr" class="form-label">Nombre de Usuario</label>
                <input type="text" class="form-control" id="username_usr" required value="${usuario.username_usr}">
            </div>

            <div class="col-md-6">
                <label for="id_rol" class="form-label">Rol del Usuario</label>
                <select class="form-select" id="id_rol" required>
                    ${rolOptions}
                </select>
            </div>

            <div class="col-md-6">
                <label for="estado_usr" class="form-label">Estado</label>
                <select class="form-select" id="estado_usr" required>
                    <option value="true" ${usuario.estado_usr === true ? 'selected' : ''}>Activo</option>
                    <option value="false" ${usuario.estado_usr === false ? 'selected' : ''}>Inactivo</option>
                </select>
            </div>

            <div class="col-12" id="form-error" class="alert alert-danger d-none"></div>
            <div class="col-12 mt-4">
                <button type="submit" class="btn btn-success me-2">Guardar</button>
                <button type="button" class="btn btn-secondary" id="btn-cancelar">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('btn-cancelar').addEventListener('click', loadListView);

    const form = document.getElementById('usr-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const variables = {
            usuario: {
                id_usr: parseInt(document.getElementById('id_usr').value),
                username_usr: document.getElementById('username_usr').value.trim(),
                estado_usr: document.getElementById('estado_usr').value === 'true',
                id_rol: parseInt(document.getElementById('id_rol').value)
            }
        };

        const query = `
            mutation UpdateUsuario($usuario: inputUsuarioUpdate!) {
                updateUsuario(usuario: $usuario) {
                    id_usr
                }
            }
        `;

        try {
            await graphqlQuery(query, variables);
            loadListView();
        } catch (err) {
            const errDiv = document.getElementById('form-error');
            errDiv.textContent = 'Error al guardar el usuario: ' + err.message;
            errDiv.classList.remove('d-none');
        }
    });
}

// --- DELETE ACTION ---
async function deleteUsuario(id_usr) {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario con ID ${id_usr}?`)) {
        try {
            const query = `
                mutation DeleteUsuario($id_usr: Int!) {
                    deleteUsuario(id_usr: $id_usr) {
                        id_usr
                    }
                }
            `;
            await graphqlQuery(query, { id_usr });
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar el usuario seleccionado: ' + err.message);
        }
    }
}
