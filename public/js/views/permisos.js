import { graphqlQuery } from '../api.js';
import { renderMenu } from '../menu.js';

let viewContainer = null;
let rolesList = [];
let funcionesList = [];
let selectedRolId = null;

// --- VIEW INITIALIZATION ---
export async function renderPermisos(container) {
    viewContainer = container;
    await loadPermisosView();
}

// --- LIST VIEW ---
async function loadPermisosView() {
    viewContainer.innerHTML = `
        <div class="mb-4">
            <h4 class="text-secondary">Gestión de Roles y Funciones</h4>
        </div>
        
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="card shadow-sm border-0 bg-white p-3">
                    <label for="select-rol" class="form-label font-weight-bold">Seleccionar Rol</label>
                    <select class="form-select" id="select-rol">
                        <option value="" disabled selected>Cargando roles...</option>
                    </select>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card shadow-sm border-0 bg-white p-4">
                    <h5 class="card-title text-secondary border-bottom pb-2 mb-3">Funciones Disponibles</h5>
                    <div id="permisos-alert" class="alert alert-danger d-none" role="alert"></div>
                    <div id="funciones-checkbox-list">
                        <p class="text-muted text-center py-3">Selecciona un rol a la izquierda para empezar.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    try {
        const query = `
            query {
                Roles {
                    id_rol
                    nombre_rol
                    funciones {
                        id_fnc
                    }
                }
                Funciones {
                    id_fnc
                    nombre_fnc
                    ruta_fnc
                }
            }
        `;

        const data = await graphqlQuery(query);
        rolesList = data.Roles;
        funcionesList = data.Funciones;

        const select = document.getElementById('select-rol');
        select.innerHTML = '<option value="" disabled selected>Seleccione un rol...</option>';

        rolesList.forEach(r => {
            const opt = document.createElement('option');
            opt.value = r.id_rol;
            opt.textContent = r.nombre_rol;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            selectedRolId = parseInt(e.target.value);
            renderFuncionesCheckboxes();
        });

    } catch (err) {
        const alert = document.getElementById('permisos-alert');
        alert.textContent = 'Error al cargar datos: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- CHECKBOX GENERATOR & EVENT BINDINGS ---
function renderFuncionesCheckboxes() {
    const container = document.getElementById('funciones-checkbox-list');
    container.innerHTML = '';

    const activeRol = rolesList.find(r => r.id_rol === selectedRolId);
    if (!activeRol) return;

    const activeFuncIds = new Set(activeRol.funciones ? activeRol.funciones.map(f => f.id_fnc) : []);

    if (funcionesList.length === 0) {
        container.innerHTML = '<p class="text-center text-muted py-3">No existen funciones creadas en el sistema.</p>';
        return;
    }

    funcionesList.forEach(f => {
        const hasPermission = activeFuncIds.has(f.id_fnc);

        const div = document.createElement('div');
        div.className = 'form-check py-2 border-bottom';
        div.innerHTML = `
            <input class="form-check-input chk-permiso" type="checkbox" value="${f.id_fnc}" id="chk-fnc-${f.id_fnc}" ${hasPermission ? 'checked' : ''}>
            <label class="form-check-label d-flex justify-content-between" for="chk-fnc-${f.id_fnc}">
                <span><strong>${f.nombre_fnc}</strong></span>
                <span class="text-muted small">Ruta: <code>${f.ruta_fnc}</code></span>
            </label>
        `;

        div.querySelector('.chk-permiso').addEventListener('change', async (e) => {
            const idFnc = parseInt(e.target.value);
            const isChecked = e.target.checked;

            try {
                if (isChecked) {
                    const mutation = `
                        mutation Asociar($id_rol: Int!, $id_fnc: Int!) {
                            asociarFuncionARol(id_rol: $id_rol, id_fnc: $id_fnc)
                        }
                    `;
                    await graphqlQuery(mutation, { id_rol: selectedRolId, id_fnc: idFnc });
                    if (!activeRol.funciones) activeRol.funciones = [];
                    activeRol.funciones.push({ id_fnc: idFnc });
                } else {
                    const mutation = `
                        mutation Desasociar($id_rol: Int!, $id_fnc: Int!) {
                            desasociarFuncionDeRol(id_rol: $id_rol, id_fnc: $id_fnc)
                        }
                    `;
                    await graphqlQuery(mutation, { id_rol: selectedRolId, id_fnc: idFnc });
                    activeRol.funciones = activeRol.funciones.filter(fn => fn.id_fnc !== idFnc);
                }

                // Sincronizar sesión y menú lateral
                const session = JSON.parse(localStorage.getItem('alquiler_session'));
                if (session && session.funciones) {
                    const dataUser = await graphqlQuery(`
                        query {
                            Usuarios {
                                id_usr
                                rol {
                                    id_rol
                                    funciones {
                                        id_fnc
                                        nombre_fnc
                                        ruta_fnc
                                    }
                                }
                            }
                        }
                    `);

                    const currentUserData = dataUser.Usuarios.find(u => u.id_usr === session.id_usr);
                    if (currentUserData && currentUserData.rol) {
                        session.funciones = currentUserData.rol.funciones || [];
                        localStorage.setItem('alquiler_session', JSON.stringify(session));
                        renderMenu(session.funciones);
                    }
                }
            } catch (err) {
                e.target.checked = !isChecked;
                alert('No se pudo modificar la función: ' + err.message);
            }
        });

        container.appendChild(div);
    });
}
