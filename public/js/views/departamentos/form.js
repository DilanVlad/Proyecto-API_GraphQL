import { graphqlQuery } from '../../api.js';

// --- FORM VIEW (CREATE/EDIT) ---
export function showForm(viewContainer, loadListView, dpto = null) {
    const isEdit = dpto !== null;
    viewContainer.innerHTML = `
        <h4 class="mb-4 text-secondary">${isEdit ? 'Editar Departamento' : 'Registrar Nuevo Departamento'}</h4>
        <form id="dpto-form" class="row g-3">
            <div class="col-md-6">
                <label for="codigo_dpto" class="form-label">Código del Departamento</label>
                <input type="text" class="form-control" id="codigo_dpto" required maxlength="10" 
                       value="${isEdit ? dpto.codigo_dpto : ''}" ${isEdit ? 'readonly' : ''}>
            </div>
            <div class="col-md-6">
                <label for="precio_dpto" class="form-label">Precio Diario</label>
                <input type="number" step="0.01" class="form-control" id="precio_dpto" required value="${isEdit ? dpto.precio_dpto : ''}">
            </div>
            <div class="col-md-6">
                <label for="estado_dpto" class="form-label">Estado</label>
                <select class="form-select" id="estado_dpto" required>
                    <option value="Disponible" ${isEdit && dpto.estado_dpto === 'Disponible' ? 'selected' : ''}>Disponible</option>
                    <option value="Ocupado" ${isEdit && dpto.estado_dpto === 'Ocupado' ? 'selected' : ''}>Ocupado</option>
                    <option value="Mantenimiento" ${isEdit && dpto.estado_dpto === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                </select>
            </div>
            <div class="col-md-12">
                <label for="descripcion_dpto" class="form-label">Descripción</label>
                <textarea class="form-control" id="descripcion_dpto" rows="3" required>${isEdit ? dpto.descripcion_dpto : ''}</textarea>
            </div>
            <div class="col-12" id="form-error" class="alert alert-danger d-none"></div>
            <div class="col-12 mt-4">
                <button type="submit" class="btn btn-success me-2">Guardar</button>
                <button type="button" class="btn btn-secondary" id="btn-cancelar">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('btn-cancelar').addEventListener('click', loadListView);

    const form = document.getElementById('dpto-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const variables = {
            departamento: {
                codigo_dpto: document.getElementById('codigo_dpto').value.trim(),
                descripcion_dpto: document.getElementById('descripcion_dpto').value.trim(),
                precio_dpto: parseFloat(document.getElementById('precio_dpto').value),
                estado_dpto: document.getElementById('estado_dpto').value
            }
        };

        let query = '';
        if (isEdit) {
            query = `
                mutation UpdateDepartamento($departamento: inputDepartamentoUpdate!) {
                    updateDepartamento(departamento: $departamento) {
                        codigo_dpto
                    }
                }
            `;
        } else {
            query = `
                mutation CreateDepartamento($departamento: inputDepartamento!) {
                    createDepartamento(departamento: $departamento) {
                        codigo_dpto
                    }
                }
            `;
        }

        try {
            await graphqlQuery(query, variables);
            loadListView();
        } catch (err) {
            const errDiv = document.getElementById('form-error');
            errDiv.textContent = 'Error al guardar el departamento: ' + err.message;
            errDiv.classList.remove('d-none');
        }
    });
}
