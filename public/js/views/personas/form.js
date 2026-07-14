import { graphqlQuery } from '../../api.js';

// --- FORM VIEW (CREATE/EDIT) ---
export function showForm(viewContainer, loadListView, persona = null) {
    const isEdit = persona !== null;
    viewContainer.innerHTML = `
        <h4 class="mb-4 text-secondary">${isEdit ? 'Editar Persona' : 'Registrar Nueva Persona'}</h4>
        <form id="persona-form" class="row g-3">
            <div class="col-md-6">
                <label for="cedula_per" class="form-label">Cédula</label>
                <input type="text" class="form-control" id="cedula_per" required maxlength="13" 
                       value="${isEdit ? persona.cedula_per : ''}" ${isEdit ? 'readonly' : ''}>
            </div>
            <div class="col-md-6">
                <label for="nombres_per" class="form-label">Nombres</label>
                <input type="text" class="form-control" id="nombres_per" required value="${isEdit ? persona.nombres_per : ''}">
            </div>
            <div class="col-md-6">
                <label for="apellidos_per" class="form-label">Apellidos</label>
                <input type="text" class="form-control" id="apellidos_per" required value="${isEdit ? persona.apellidos_per : ''}">
            </div>
            <div class="col-md-6">
                <label for="telefono_per" class="form-label">Teléfono</label>
                <input type="text" class="form-control" id="telefono_per" required maxlength="10" value="${isEdit ? persona.telefono_per : ''}">
            </div>
            <div class="col-12">
                <label for="direccion_per" class="form-label">Dirección</label>
                <input type="text" class="form-control" id="direccion_per" required value="${isEdit ? persona.direccion_per : ''}">
            </div>
            <div class="col-12" id="form-error" class="alert alert-danger d-none"></div>
            <div class="col-12 mt-4">
                <button type="submit" class="btn btn-success me-2">Guardar</button>
                <button type="button" class="btn btn-secondary" id="btn-cancelar">Cancelar</button>
            </div>
        </form>
    `;

    document.getElementById('btn-cancelar').addEventListener('click', loadListView);

    const form = document.getElementById('persona-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const variables = {
            persona: {
                cedula_per: document.getElementById('cedula_per').value.trim(),
                nombres_per: document.getElementById('nombres_per').value.trim(),
                apellidos_per: document.getElementById('apellidos_per').value.trim(),
                telefono_per: document.getElementById('telefono_per').value.trim(),
                direccion_per: document.getElementById('direccion_per').value.trim()
            }
        };

        let query = '';
        if (isEdit) {
            query = `
                mutation UpdatePersona($persona: inputPersonaUpdate!) {
                    updatePersona(persona: $persona) {
                        cedula_per
                    }
                }
            `;
        } else {
            query = `
                mutation CreatePersona($persona: inputPersona!) {
                    createPersona(persona: $persona) {
                        cedula_per
                    }
                }
            `;
        }

        try {
            await graphqlQuery(query, variables);
            loadListView();
        } catch (err) {
            const errDiv = document.getElementById('form-error');
            errDiv.textContent = 'Error al guardar la persona: ' + err.message;
            errDiv.classList.remove('d-none');
        }
    });
}
