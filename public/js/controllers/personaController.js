import { getPersonas, createPersonaMutation, updatePersonaMutation, deletePersonaMutation } from '../services/personaService.js';
import { personaListLayoutTemplate, personaFormTemplate } from '../views/personaView.js';
import { hasPermission } from '../app.js';
import { createPaginator } from '../utils/pagination.js';

const PAGE_SIZE = 8;
let viewContainer = null;

export async function renderPersonas(container) {
    viewContainer = container;
    await loadListView();
}

async function loadListView() {
    const showNewBtn = hasPermission('crear', 'persona');
    viewContainer.innerHTML = personaListLayoutTemplate(showNewBtn);

    if (showNewBtn) {
        document.getElementById('btn-nueva-persona').addEventListener('click', () => showForm(null));
    }

    try {
        const personasList = await getPersonas();

        // --- Calcular KPIs ---
        const total = (personasList || []).length;
        const conTel = (personasList || []).filter(p => p.telefono_per && p.telefono_per.trim()).length;
        const conDir = (personasList || []).filter(p => p.direccion_per && p.direccion_per.trim()).length;
        const sinDatos = (personasList || []).filter(p =>
            (!p.telefono_per || !p.telefono_per.trim()) && (!p.direccion_per || !p.direccion_per.trim())
        ).length;

        const kpiEl = document.getElementById('kpi-total-personas');
        if (kpiEl) kpiEl.textContent = total;

        if (!personasList || personasList.length === 0) {
            const tbody = document.getElementById('personas-table-body');
            if (tbody) tbody.innerHTML = `<tr><td colspan="6" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron personas registradas.</td></tr>`;
            return;
        }

        const canEdit = hasPermission('editar', 'persona') || hasPermission('actualizar', 'persona');
        const canDelete = hasPermission('eliminar', 'persona');

        const renderWithFilter = (query = '') => {
            const q = query.toLowerCase().trim();
            const filtered = q
                ? personasList.filter(p =>
                    (p.cedula_per || '').toLowerCase().includes(q) ||
                    (p.nombres_per || '').toLowerCase().includes(q) ||
                    (p.apellidos_per || '').toLowerCase().includes(q) ||
                    (p.telefono_per || '').toLowerCase().includes(q)
                )
                : personasList;

            const emptyHtml = `<tr><td colspan="6" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron resultados para &ldquo;${q}&rdquo;.</td></tr>`;

            createPaginator({
                items: filtered,
                pageSize: PAGE_SIZE,
                tbodyId: 'personas-table-body',
                pagerContainerId: 'personas-pager',
                emptyHtml,
                renderRow: (p) => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-50/50 transition-colors';

                    let actionsHtml = '';
                    if (canEdit) actionsHtml += `<button class="px-2.5 py-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-all mr-2 btn-editar" data-id="${p.cedula_per}">Editar</button>`;
                    if (canDelete) actionsHtml += `<button class="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-all btn-eliminar" data-id="${p.cedula_per}">Eliminar</button>`;
                    if (!canEdit && !canDelete) actionsHtml = '<span class="text-slate-400 text-xs">Sin permisos</span>';

                    tr.innerHTML = `
                        <td class="px-6 py-4 font-bold text-slate-800">${p.cedula_per}</td>
                        <td class="px-6 py-4 font-medium text-slate-600">${p.nombres_per}</td>
                        <td class="px-6 py-4 font-medium text-slate-600">${p.apellidos_per}</td>
                        <td class="px-6 py-4 font-medium text-slate-600">${p.telefono_per || '—'}</td>
                        <td class="px-6 py-4 font-medium text-slate-600">${p.direccion_per || '—'}</td>
                        <td class="px-6 py-4 text-right">${actionsHtml}</td>
                    `;

                    if (canEdit) tr.querySelector('.btn-editar').addEventListener('click', () => showForm(p));
                    if (canDelete) tr.querySelector('.btn-eliminar').addEventListener('click', () => handleDelete(p.cedula_per));
                    return tr;
                }
            });
        };

        renderWithFilter();

        // Conectar buscador
        const searchInput = document.getElementById('personas-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => renderWithFilter(e.target.value));
        }

    } catch (err) {
        const alertEl = document.getElementById('personas-alert');
        if (alertEl) { alertEl.textContent = 'Error al cargar personas: ' + err.message; alertEl.classList.remove('hidden'); }
    }
}

function showForm(persona = null) {
    viewContainer.innerHTML = personaFormTemplate(persona);
    document.getElementById('btn-cancelar').addEventListener('click', () => loadListView());

    document.getElementById('persona-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('form-error');
        if (errDiv) errDiv.classList.add('hidden');

        const personaData = {
            cedula_per: document.getElementById('cedula_per').value.trim(),
            nombres_per: document.getElementById('nombres_per').value.trim(),
            apellidos_per: document.getElementById('apellidos_per').value.trim(),
            telefono_per: document.getElementById('telefono_per').value.trim(),
            direccion_per: document.getElementById('direccion_per').value.trim()
        };

        try {
            if (persona) { await updatePersonaMutation(personaData); } else { await createPersonaMutation(personaData); }
            loadListView();
        } catch (err) {
            if (errDiv) { errDiv.textContent = 'Error al guardar la persona: ' + err.message; errDiv.classList.remove('hidden'); }
        }
    });
}

async function handleDelete(cedula_per) {
    if (confirm(`¿Estás seguro de que deseas eliminar a la persona con Cédula ${cedula_per}?`)) {
        try {
            await deletePersonaMutation(cedula_per);
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar la persona seleccionada: ' + err.message);
        }
    }
}
