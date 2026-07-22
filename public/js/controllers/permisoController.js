import {
    getRolesYFunciones,
    createRolMutation,
    updateRolMutation,
    createFuncionMutation,
    updateFuncionMutation,
    asociarFuncionARolMutation,
    desasociarFuncionDeRolMutation
} from '../services/permisoService.js';
import { getUsuarioById } from '../services/usuarioService.js';
import { permisoLayoutTemplate, rolFormTemplate, funcionFormTemplate } from '../views/permisoView.js';
import { renderMenu } from '../menu.js';

let viewContainer = null;
let rolesList = [];
let funcionesList = [];
let selectedRolId = null;

export async function renderPermisos(container) {
    viewContainer = container;
    viewContainer.innerHTML = permisoLayoutTemplate();

    document.getElementById('btn-guardar-permisos').addEventListener('click', handleGuardarPermisos);

    await refreshData();
}

async function refreshData() {
    try {
        const data = await getRolesYFunciones();
        rolesList = data.roles;
        funcionesList = data.funciones;

        // Auto-select first role if none selected
        if (!selectedRolId && rolesList.length > 0) {
            selectedRolId = rolesList[0].id_rol;
        }

        renderCatalogoRoles('');
        renderFuncionesList();

    } catch (err) {
        showError('Error al cargar la información de permisos: ' + err.message);
    }
}

function renderCatalogoRoles(filterTerm = '') {
    const container = document.getElementById('catalogo-roles-funciones');
    if (!container) return;

    container.innerHTML = '';

    if (rolesList.length === 0) {
        container.innerHTML = '<div class="p-5 text-xs text-center text-slate-400 font-medium">No hay roles registrados.</div>';
        return;
    }

    rolesList.forEach(r => {
        const isSelected = r.id_rol === selectedRolId;
        const fncCount = r.funciones ? r.funciones.length : 0;

        const item = document.createElement('button');
        item.type = 'button';

        // Apply classes without template literals inside className to avoid Tailwind purge issues
        item.className = 'w-full text-left px-5 py-4 flex items-center justify-between transition-all group border-l-2';
        if (isSelected) {
            item.classList.add('bg-indigo-50', 'border-indigo-600');
        } else {
            item.classList.add('hover:bg-slate-50', 'border-transparent');
        }

        const nameColor = isSelected ? 'text-indigo-700' : 'text-slate-700';
        const countColor = isSelected ? 'text-indigo-500' : 'text-slate-400';

        item.innerHTML = `
            <div>
                <span class="text-sm font-bold block ${nameColor}">${r.nombre_rol}</span>
                <span class="text-xs font-semibold ${countColor} mt-0.5 block">${fncCount} ${fncCount === 1 ? 'Función Asignada' : 'Funciones Asignadas'}</span>
            </div>
            <div class="flex items-center space-x-2">
                <button class="text-[10px] font-bold text-slate-400 hover:text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition-all btn-edit-rol opacity-0 group-hover:opacity-100" data-id="${r.id_rol}">Editar</button>
                <svg class="h-4 w-4 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </div>
        `;


        // Select role on click
        item.addEventListener('click', (e) => {
            if (e.target.closest('.btn-edit-rol')) return;
            selectedRolId = r.id_rol;
            renderCatalogoRoles(filterTerm);
            renderFuncionesList();
        });

        // Edit button
        const editBtn = item.querySelector('.btn-edit-rol');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showRolForm(r);
            });
        }

        container.appendChild(item);
    });
}

function renderFuncionesList() {
    const container = document.getElementById('funciones-checkboxes-container');
    const subtitle = document.getElementById('selected-rol-subtitle');
    if (!container) return;

    container.innerHTML = '';

    if (!selectedRolId) {
        if (subtitle) subtitle.textContent = 'Selecciona un rol de la lista para editar sus funciones.';
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-16 text-center">
                <div class="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" /></svg>
                </div>
                <p class="text-xs text-slate-400 font-medium">Selecciona un rol para ver sus funciones</p>
            </div>
        `;
        return;
    }

    const activeRol = rolesList.find(r => r.id_rol === selectedRolId);
    if (!activeRol) return;

    if (subtitle) subtitle.textContent = `Editando funciones para: ${activeRol.nombre_rol}`;

    const activeFuncIds = new Set(activeRol.funciones ? activeRol.funciones.map(f => f.id_fnc) : []);
    const isRolAdmin = (activeRol.nombre_rol || '').toLowerCase().includes('admin');

    if (funcionesList.length === 0) {
        container.innerHTML = '<div class="p-6 text-xs text-center text-slate-400 font-medium">No hay funciones registradas en el sistema.</div>';
        return;
    }

    funcionesList.forEach(f => {
        const isPermisosFunc = (f.ruta_fnc || '').toLowerCase().includes('permiso') || (f.nombre_fnc || '').toLowerCase().includes('permiso');
        const shouldLockForAdmin = isRolAdmin && isPermisosFunc;
        const isActive = activeFuncIds.has(f.id_fnc) || shouldLockForAdmin;

        const row = document.createElement('div');
        row.className = 'flex items-center justify-between px-4 py-4 rounded-xl hover:bg-slate-50/70 transition-colors group';

        // Build toggle HTML manually to avoid Tailwind class conflicts
        const trackColor = isActive ? 'bg-indigo-600' : 'bg-slate-200';
        const dotTranslate = isActive ? 'translate-x-5' : 'translate-x-0';
        const cursorClass = shouldLockForAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer';

        row.innerHTML = `
            <div class="flex items-center space-x-4">
                <!-- Module icon -->
                <div class="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                </div>
                <!-- Text -->
                <div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-bold text-slate-700">${f.nombre_fnc}</span>
                        ${shouldLockForAdmin ? '<span class="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Obligatorio</span>' : ''}
                    </div>
                    <span class="text-[10px] text-slate-400 font-semibold font-mono">Ruta: ${f.ruta_fnc}</span>
                </div>
            </div>
            <!-- Right Side: Edit + Toggle -->
            <div class="flex items-center space-x-3 shrink-0">
                <button class="text-[10px] font-bold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all btn-edit-fnc opacity-0 group-hover:opacity-100" data-id="${f.id_fnc}">Editar</button>
                <!-- Toggle Switch (built inline for correct initial state) -->
                <label class="inline-flex items-center ${cursorClass}">
                    <input type="checkbox" class="sr-only chk-permiso" value="${f.id_fnc}" id="toggle-fnc-${f.id_fnc}" ${isActive ? 'checked' : ''} ${shouldLockForAdmin ? 'disabled' : ''}>
                    <div class="relative w-11 h-6 rounded-full transition-colors duration-200 toggle-track ${trackColor}">
                        <div class="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform duration-200 toggle-dot ${dotTranslate}"></div>
                    </div>
                </label>
            </div>
        `;

        // Toggle click handler
        const checkbox = row.querySelector('.chk-permiso');
        const toggleTrack = row.querySelector('.toggle-track');
        const toggleDot = row.querySelector('.toggle-dot');

        if (!shouldLockForAdmin) {
            const label = row.querySelector('label');
            label.addEventListener('click', () => {
                checkbox.checked = !checkbox.checked;
                if (checkbox.checked) {
                    toggleTrack.classList.replace('bg-slate-200', 'bg-indigo-600');
                    toggleDot.classList.replace('translate-x-0', 'translate-x-5');
                } else {
                    toggleTrack.classList.replace('bg-indigo-600', 'bg-slate-200');
                    toggleDot.classList.replace('translate-x-5', 'translate-x-0');
                }
            });
        }

        // Edit function button
        const editBtn = row.querySelector('.btn-edit-fnc');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showFuncionForm(f);
            });
        }

        container.appendChild(row);
    });
}

async function handleGuardarPermisos() {
    clearAlerts();
    if (!selectedRolId) return;

    const activeRol = rolesList.find(r => r.id_rol === selectedRolId);
    const initialFuncIds = new Set(activeRol && activeRol.funciones ? activeRol.funciones.map(f => f.id_fnc) : []);

    const currentCheckedIds = new Set();
    document.querySelectorAll('.chk-permiso:checked').forEach(chk => {
        currentCheckedIds.add(parseInt(chk.value, 10));
    });

    const toAssociate = [];
    currentCheckedIds.forEach(id => {
        if (!initialFuncIds.has(id)) toAssociate.push(id);
    });

    const toDisassociate = [];
    initialFuncIds.forEach(id => {
        if (!currentCheckedIds.has(id)) {
            const funcObj = funcionesList.find(f => f.id_fnc === id);
            const isPermisosFunc = funcObj && ((funcObj.ruta_fnc || '').toLowerCase().includes('permiso') || (funcObj.nombre_fnc || '').toLowerCase().includes('permiso'));
            const isRolAdmin = activeRol && (activeRol.nombre_rol || '').toLowerCase().includes('admin');
            if (!(isRolAdmin && isPermisosFunc)) {
                toDisassociate.push(id);
            }
        }
    });

    const btnGuardar = document.getElementById('btn-guardar-permisos');
    if (btnGuardar) {
        btnGuardar.disabled = true;
        btnGuardar.textContent = 'Guardando...';
    }

    try {
        for (const idFnc of toAssociate) {
            await asociarFuncionARolMutation(selectedRolId, idFnc);
        }

        for (const idFnc of toDisassociate) {
            await desasociarFuncionDeRolMutation(selectedRolId, idFnc);
        }

        await refreshData();

        const session = JSON.parse(localStorage.getItem('alquiler_session'));
        if (session && session.id_usr) {
            const currentUserData = await getUsuarioById(session.id_usr);
            if (currentUserData && currentUserData.rol) {
                session.funciones = currentUserData.rol.funciones || [];
                localStorage.setItem('alquiler_session', JSON.stringify(session));
                renderMenu(session.funciones);
            }
        }

        showSuccess('Permisos actualizados y guardados exitosamente.');

    } catch (err) {
        showError('Error al guardar los permisos: ' + err.message);
    } finally {
        if (btnGuardar) {
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar Cambios';
        }
    }
}

function closeModal() {
    const wrapper = document.getElementById('modal-container-wrapper');
    if (wrapper) wrapper.innerHTML = '';
}

function showRolForm(rol = null) {
    clearAlerts();
    closeModal();
    const wrapper = document.getElementById('modal-container-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = rolFormTemplate(rol);

    document.getElementById('btn-cancelar-modal')?.addEventListener('click', closeModal);
    document.getElementById('btn-close-modal-x')?.addEventListener('click', closeModal);

    document.getElementById('rol-modal-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre_rol = document.getElementById('nombre_rol').value.trim();
        const errDiv = document.getElementById('modal-error');
        if (errDiv) errDiv.classList.add('hidden');

        try {
            if (rol) {
                await updateRolMutation(rol.id_rol, nombre_rol);
            } else {
                await createRolMutation(nombre_rol);
            }
            closeModal();
            await refreshData();
        } catch (err) {
            if (errDiv) {
                errDiv.textContent = 'Error al procesar rol: ' + err.message;
                errDiv.classList.remove('hidden');
            } else {
                showError('Error al procesar rol: ' + err.message);
            }
        }
    });
}

function showFuncionForm(funcion = null) {
    clearAlerts();
    closeModal();
    const wrapper = document.getElementById('modal-container-wrapper');
    if (!wrapper) return;

    wrapper.innerHTML = funcionFormTemplate(funcion);

    document.getElementById('btn-cancelar-modal')?.addEventListener('click', closeModal);
    document.getElementById('btn-close-modal-x')?.addEventListener('click', closeModal);

    document.getElementById('funcion-modal-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre_fnc = document.getElementById('nombre_fnc').value.trim();
        const ruta_fnc = document.getElementById('ruta_fnc').value.trim();
        const errDiv = document.getElementById('modal-error');
        if (errDiv) errDiv.classList.add('hidden');

        try {
            if (funcion) {
                await updateFuncionMutation(funcion.id_fnc, nombre_fnc, ruta_fnc);
            } else {
                await createFuncionMutation(nombre_fnc, ruta_fnc);
            }
            closeModal();
            await refreshData();
        } catch (err) {
            if (errDiv) {
                errDiv.textContent = 'Error al procesar función: ' + err.message;
                errDiv.classList.remove('hidden');
            } else {
                showError('Error al procesar función: ' + err.message);
            }
        }
    });
}

function showError(msg) {
    const alertErr = document.getElementById('permisos-alert');
    if (alertErr) {
        alertErr.textContent = msg;
        alertErr.classList.remove('hidden');
    }
}

function showSuccess(msg) {
    const alertSucc = document.getElementById('permisos-success');
    if (alertSucc) {
        alertSucc.textContent = msg;
        alertSucc.classList.remove('hidden');
        setTimeout(() => alertSucc.classList.add('hidden'), 3000);
    }
}

function clearAlerts() {
    const alertErr = document.getElementById('permisos-alert');
    const alertSucc = document.getElementById('permisos-success');
    if (alertErr) alertErr.classList.add('hidden');
    if (alertSucc) alertSucc.classList.add('hidden');
}
