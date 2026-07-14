import { graphqlQuery } from '../../api.js';
import { hasPermission } from '../../app.js';
import { showForm } from './form.js';

let viewContainer = null;

// --- VIEW INITIALIZATION ---
export async function renderDepartamentos(container) {
    viewContainer = container;
    await loadListView();
}

// --- LIST VIEW ---
async function loadListView() {
    const showNewBtn = hasPermission('crear', 'departamento') || hasPermission('crear', 'dpto');
    viewContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="m-0 text-secondary">Catálogo de Departamentos</h4>
            ${showNewBtn ? '<button class="btn btn-primary" id="btn-nuevo-dpto">Nuevo Departamento</button>' : ''}
        </div>
        <div id="dptos-alert" class="alert alert-danger d-none" role="alert"></div>
        <div class="table-responsive">
            <table class="table table-striped table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Precio Diario</th>
                        <th>Estado</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody id="dptos-table-body">
                    <!-- Fila cargadas dinámicamente -->
                </tbody>
            </table>
        </div>
    `;

    if (showNewBtn) {
        document.getElementById('btn-nuevo-dpto').addEventListener('click', () => {
            showForm(viewContainer, loadListView);
        });
    }

    try {
        const query = `
            query {
                Departamentos {
                    codigo_dpto
                    descripcion_dpto
                    precio_dpto
                    estado_dpto
                }
            }
        `;
        const data = await graphqlQuery(query);
        const tbody = document.getElementById('dptos-table-body');
        tbody.innerHTML = '';

        if (data.Departamentos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No se encontraron departamentos registrados.</td></tr>';
            return;
        }

        const canEdit = hasPermission('editar', 'departamento') || hasPermission('actualizar', 'departamento');
        const canDelete = hasPermission('eliminar', 'departamento');

        data.Departamentos.forEach(d => {
            const tr = document.createElement('tr');
            
            let actionsHtml = '';
            if (canEdit) {
                actionsHtml += `<button class="btn btn-sm btn-outline-warning me-2 btn-editar" data-id="${d.codigo_dpto}">Editar</button>`;
            }
            if (canDelete) {
                actionsHtml += `<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${d.codigo_dpto}">Eliminar</button>`;
            }
            if (!canEdit && !canDelete) {
                actionsHtml = '<span class="text-muted small">Sin permisos</span>';
            }

            tr.innerHTML = `
                <td><strong>${d.codigo_dpto}</strong></td>
                <td>${d.descripcion_dpto}</td>
                <td>$${d.precio_dpto.toFixed(2)}</td>
                <td>
                    <span class="badge ${d.estado_dpto.toLowerCase() === 'disponible' ? 'bg-success' : 'bg-warning text-dark'}">
                        ${d.estado_dpto}
                    </span>
                </td>
                <td class="text-end">${actionsHtml}</td>
            `;

            if (canEdit) {
                tr.querySelector('.btn-editar').addEventListener('click', () => showForm(viewContainer, loadListView, d));
            }
            if (canDelete) {
                tr.querySelector('.btn-eliminar').addEventListener('click', () => deleteDepartamento(d.codigo_dpto));
            }

            tbody.appendChild(tr);
        });
    } catch (err) {
        const alert = document.getElementById('dptos-alert');
        alert.textContent = 'Error al cargar departamentos: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- DELETE ACTION ---
async function deleteDepartamento(codigo_dpto) {
    if (confirm(`¿Estás seguro de que deseas eliminar el departamento con Código ${codigo_dpto}?`)) {
        try {
            const query = `
                mutation DeleteDepartamento($codigo_dpto: String!) {
                    deleteDepartamento(codigo_dpto: $codigo_dpto) {
                        codigo_dpto
                    }
                }
            `;
            await graphqlQuery(query, { codigo_dpto });
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar el departamento seleccionado: ' + err.message);
        }
    }
}
