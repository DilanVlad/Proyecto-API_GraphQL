import { graphqlQuery } from '../../api.js';
import { hasPermission } from '../../app.js';
import { showForm } from './form.js';

let viewContainer = null;

// --- VIEW INITIALIZATION ---
export async function renderPersonas(container) {
    viewContainer = container;
    await loadListView();
}

// --- LIST VIEW ---
async function loadListView() {
    const showNewBtn = hasPermission('crear', 'persona');
    viewContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="m-0 text-secondary">Catálogo de Personas</h4>
            ${showNewBtn ? '<button class="btn btn-primary" id="btn-nueva-persona">Nueva Persona</button>' : ''}
        </div>
        <div id="personas-alert" class="alert alert-danger d-none" role="alert"></div>
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Cédula</th>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Teléfono</th>
                        <th>Dirección</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="personas-table-body">
                    <!-- Fila cargadas dinámicamente -->
                </tbody>
            </table>
        </div>
    `;

    if (showNewBtn) {
        document.getElementById('btn-nueva-persona').addEventListener('click', () => {
            showForm(viewContainer, loadListView);
        });
    }

    try {
        const query = `
            query {
                Personas {
                    cedula_per
                    nombres_per
                    apellidos_per
                    telefono_per
                    direccion_per
                }
            }
        `;
        const data = await graphqlQuery(query);
        const tbody = document.getElementById('personas-table-body');
        tbody.innerHTML = '';

        if (data.Personas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No se encontraron personas registradas.</td></tr>';
            return;
        }

        const canEdit = hasPermission('editar', 'persona') || hasPermission('actualizar', 'persona');
        const canDelete = hasPermission('eliminar', 'persona');

        data.Personas.forEach(p => {
            const tr = document.createElement('tr');
            
            let actionsHtml = '';
            if (canEdit) {
                actionsHtml += `<button class="btn btn-sm btn-outline-warning me-2 btn-editar" data-id="${p.cedula_per}">Editar</button>`;
            }
            if (canDelete) {
                actionsHtml += `<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${p.cedula_per}">Eliminar</button>`;
            }
            if (!canEdit && !canDelete) {
                actionsHtml = '<span class="text-muted small">Sin permisos</span>';
            }

            tr.innerHTML = `
                <td><strong>${p.cedula_per}</strong></td>
                <td>${p.nombres_per}</td>
                <td>${p.apellidos_per}</td>
                <td>${p.telefono_per}</td>
                <td>${p.direccion_per}</td>
                <td class="text-end">${actionsHtml}</td>
            `;

            if (canEdit) {
                tr.querySelector('.btn-editar').addEventListener('click', () => showForm(viewContainer, loadListView, p));
            }
            if (canDelete) {
                tr.querySelector('.btn-eliminar').addEventListener('click', () => deletePersona(p.cedula_per));
            }

            tbody.appendChild(tr);
        });
    } catch (err) {
        const alert = document.getElementById('personas-alert');
        alert.textContent = 'Error al cargar personas: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- DELETE ACTION ---
async function deletePersona(cedula_per) {
    if (confirm(`¿Estás seguro de que deseas eliminar a la persona con Cédula ${cedula_per}?`)) {
        try {
            const query = `
                mutation DeletePersona($cedula_per: String!) {
                    deletePersona(cedula_per: $cedula_per) {
                        cedula_per
                    }
                }
            `;
            await graphqlQuery(query, { cedula_per });
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar a la persona seleccionada: ' + err.message);
        }
    }
}
