import { getDepartamentos, createDepartamentoMutation, updateDepartamentoMutation, deleteDepartamentoMutation } from '../services/departamentoService.js';
import { departamentoListLayoutTemplate, departamentoFormTemplate } from '../views/departamentoView.js';
import { hasPermission } from '../app.js';
import { createPaginator } from '../utils/pagination.js';

const PAGE_SIZE = 8;
let viewContainer = null;

export async function renderDepartamentos(container) {
    viewContainer = container;
    await loadListView();
}

async function loadListView() {
    const showNewBtn = hasPermission('crear', 'departamento') || hasPermission('crear', 'dpto');
    viewContainer.innerHTML = departamentoListLayoutTemplate(showNewBtn);

    if (showNewBtn) {
        document.getElementById('btn-nuevo-dpto').addEventListener('click', () => showForm(null));
    }

    try {
        const dptosList = await getDepartamentos();

        // Populate KPIs
        const total = (dptosList || []).length;
        const ocupados = (dptosList || []).filter(d => (d.estado_dpto || '').toLowerCase() === 'ocupado').length;
        const disponibles = (dptosList || []).filter(d => (d.estado_dpto || '').toLowerCase() === 'disponible').length;
        const mantenimiento = (dptosList || []).filter(d => (d.estado_dpto || '').toLowerCase() === 'mantenimiento').length;
        const pctOcupados = total > 0 ? Math.round((ocupados / total) * 100) : 0;

        const kpiMap = {
            'kpi-dptos-total': total,
            'kpi-dptos-ocupados': ocupados,
            'kpi-dptos-ocupados-pct': `${pctOcupados}%`,
            'kpi-dptos-disponibles': disponibles,
            'kpi-dptos-mantenimiento': mantenimiento
        };
        Object.entries(kpiMap).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });

        if (!dptosList || dptosList.length === 0) {
            const tbody = document.getElementById('dptos-table-body');
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron departamentos registrados.</td></tr>`;
            return;
        }

        const canEdit = hasPermission('editar', 'departamento') || hasPermission('actualizar', 'departamento');
        const canDelete = hasPermission('eliminar', 'departamento');

        const emptyHtml = `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron departamentos registrados.</td></tr>`;

        createPaginator({
            items: dptosList,
            pageSize: PAGE_SIZE,
            tbodyId: 'dptos-table-body',
            pagerContainerId: 'dptos-pager',
            emptyHtml,
            renderRow: (d) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50/50 transition-colors';

                let actionsHtml = '';
                if (canEdit) actionsHtml += `<button class="px-2.5 py-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-all mr-2 btn-editar" data-id="${d.codigo_dpto}">Editar</button>`;
                if (canDelete) actionsHtml += `<button class="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-all btn-eliminar" data-id="${d.codigo_dpto}">Eliminar</button>`;
                if (!canEdit && !canDelete) actionsHtml = '<span class="text-slate-400 text-xs">Sin permisos</span>';

                let badgeClass = 'bg-slate-50 text-slate-700 border-slate-200';
                const estadoNorm = (d.estado_dpto || '').toLowerCase();
                if (estadoNorm === 'disponible') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else if (estadoNorm === 'ocupado') badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
                else if (estadoNorm === 'mantenimiento') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';

                tr.innerHTML = `
                    <td class="px-6 py-4 font-bold text-slate-800">${d.codigo_dpto}</td>
                    <td class="px-6 py-4 font-medium text-slate-600">${d.descripcion_dpto}</td>
                    <td class="px-6 py-4 font-bold text-slate-800">$${d.precio_dpto.toFixed(2)}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}">
                            ${d.estado_dpto}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">${actionsHtml}</td>
                `;

                if (canEdit) tr.querySelector('.btn-editar').addEventListener('click', () => showForm(d));
                if (canDelete) tr.querySelector('.btn-eliminar').addEventListener('click', () => handleDelete(d.codigo_dpto));
                return tr;
            }
        });

    } catch (err) {
        const alertEl = document.getElementById('dptos-alert');
        if (alertEl) { alertEl.textContent = 'Error al cargar departamentos: ' + err.message; alertEl.classList.remove('hidden'); }
    }
}

function showForm(dpto = null) {
    viewContainer.innerHTML = departamentoFormTemplate(dpto);
    document.getElementById('btn-cancelar').addEventListener('click', () => loadListView());

    document.getElementById('dpto-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('form-error');
        if (errDiv) errDiv.classList.add('hidden');

        const departamentoData = {
            codigo_dpto: document.getElementById('codigo_dpto').value.trim(),
            descripcion_dpto: document.getElementById('descripcion_dpto').value.trim(),
            precio_dpto: parseFloat(document.getElementById('precio_dpto').value),
            estado_dpto: document.getElementById('estado_dpto').value
        };

        if (departamentoData.precio_dpto < 0) {
            if (errDiv) { errDiv.textContent = 'El precio no puede ser negativo.'; errDiv.classList.remove('hidden'); }
            return;
        }

        try {
            if (dpto) { await updateDepartamentoMutation(departamentoData); } else { await createDepartamentoMutation(departamentoData); }
            loadListView();
        } catch (err) {
            if (errDiv) { errDiv.textContent = 'Error al guardar el departamento: ' + err.message; errDiv.classList.remove('hidden'); }
        }
    });
}

async function handleDelete(codigo_dpto) {
    if (confirm(`¿Estás seguro de que deseas eliminar el departamento con Código ${codigo_dpto}?`)) {
        try {
            await deleteDepartamentoMutation(codigo_dpto);
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar el departamento seleccionado: ' + err.message);
        }
    }
}
