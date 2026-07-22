import { getUsuarios, createUsuarioMutation, updateUsuarioMutation, deleteUsuarioMutation } from '../services/usuarioService.js';
import { getRolesYFunciones as fetchRoles } from '../services/permisoService.js';
import { usuarioListLayoutTemplate, usuarioFormTemplate } from '../views/usuarioView.js';
import { hasPermission } from '../app.js';
import { createPaginator } from '../utils/pagination.js';

const PAGE_SIZE = 8;
let viewContainer = null;
let rolesList = [];

export async function renderUsuarios(container) {
    viewContainer = container;
    await loadListView();
}

async function loadListView() {
    viewContainer.innerHTML = usuarioListLayoutTemplate();

    try {
        const rolesData = await fetchRoles();
        rolesList = rolesData.roles;

        // KPI: Roles disponibles
        const kpiRoles = document.getElementById('kpi-roles');
        if (kpiRoles) kpiRoles.textContent = rolesList.length;

        const usuariosList = await getUsuarios();

        if (!usuariosList || usuariosList.length === 0) {
            const tbody = document.getElementById('usr-table-body');
            if (tbody) tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron usuarios registrados.</td></tr>`;
            ['kpi-total-usuarios', 'kpi-usuarios-activos', 'kpi-usuarios-inactivos'].forEach(id => {
                const el = document.getElementById(id); if (el) el.textContent = '0';
            });
            return;
        }

        // --- Calcular KPIs ---
        const activos = usuariosList.filter(u => u.estado_usr === true || u.estado_usr === 'true').length;
        const inactivos = usuariosList.length - activos;

        const kpiMap = { 'kpi-total-usuarios': usuariosList.length, 'kpi-usuarios-activos': activos, 'kpi-usuarios-inactivos': inactivos };
        Object.entries(kpiMap).forEach(([id, val]) => { const el = document.getElementById(id); if (el) el.textContent = val; });

        const canEdit = hasPermission('editar', 'usuario') || hasPermission('actualizar', 'usuario');
        const canDelete = hasPermission('eliminar', 'usuario');

        const emptyHtml = `<tr><td colspan="5" class="px-6 py-16 text-center text-slate-400 font-medium">No se encontraron usuarios registrados.</td></tr>`;

        createPaginator({
            items: usuariosList,
            pageSize: PAGE_SIZE,
            tbodyId: 'usr-table-body',
            pagerContainerId: 'usr-pager',
            emptyHtml,
            renderRow: (u) => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-50/50 transition-colors';

                let actionsHtml = '';
                if (canEdit) actionsHtml += `<button class="px-2.5 py-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 rounded-lg text-xs font-semibold transition-all mr-2 btn-editar" data-id="${u.id_usr}">Editar</button>`;
                if (canDelete) actionsHtml += `<button class="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-all btn-eliminar" data-id="${u.id_usr}">Eliminar</button>`;
                if (!canEdit && !canDelete) actionsHtml = '<span class="text-slate-400 text-xs">Sin permisos</span>';

                const rolNombre = u.rol ? u.rol.nombre_rol : 'Sin Rol';

                tr.innerHTML = `
                    <td class="px-6 py-4 font-bold text-slate-800">${u.id_usr}</td>
                    <td class="px-6 py-4 font-medium text-slate-600">${u.username_usr}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${u.estado_usr ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}">
                            ${u.estado_usr ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-indigo-50 text-indigo-700 border-indigo-200">
                            ${rolNombre}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">${actionsHtml}</td>
                `;

                if (canEdit) tr.querySelector('.btn-editar').addEventListener('click', () => showForm(u));
                if (canDelete) tr.querySelector('.btn-eliminar').addEventListener('click', () => handleDelete(u.id_usr));
                return tr;
            }
        });

    } catch (err) {
        const alertEl = document.getElementById('usr-alert');
        if (alertEl) { alertEl.textContent = 'Error al cargar usuarios: ' + err.message; alertEl.classList.remove('hidden'); }
    }
}

function showForm(usuario = null) {
    const rolOptionsHtml = rolesList.map(r =>
        `<option value="${r.id_rol}" ${usuario && usuario.rol && usuario.rol.id_rol === r.id_rol ? 'selected' : ''}>${r.nombre_rol}</option>`
    ).join('');

    viewContainer.innerHTML = usuarioFormTemplate(usuario || { id_usr: '', username_usr: '', estado_usr: true, rol: null }, rolOptionsHtml);
    document.getElementById('btn-cancelar').addEventListener('click', () => loadListView());

    document.getElementById('usr-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('form-error');
        if (errDiv) errDiv.classList.add('hidden');

        const usuarioData = {
            id_usr: parseInt(document.getElementById('id_usr').value, 10),
            username_usr: document.getElementById('username_usr').value.trim(),
            id_rol: parseInt(document.getElementById('id_rol').value, 10),
            estado_usr: document.getElementById('estado_usr').value === 'true'
        };

        const passwordEl = document.getElementById('password_usr');
        if (passwordEl && passwordEl.value.trim()) {
            usuarioData.password_usr = passwordEl.value.trim();
        }

        try {
            await updateUsuarioMutation(usuarioData);
            loadListView();
        } catch (err) {
            if (errDiv) { errDiv.textContent = 'Error al guardar el usuario: ' + err.message; errDiv.classList.remove('hidden'); }
        }
    });
}

async function handleDelete(id_usr) {
    if (confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id_usr}?`)) {
        try {
            await deleteUsuarioMutation(id_usr);
            loadListView();
        } catch (err) {
            alert('No se pudo eliminar el usuario seleccionado: ' + err.message);
        }
    }
}
