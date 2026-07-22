export function usuarioListLayoutTemplate() {
    return `
        <!-- Page Title -->
        <div class="mb-6">
            <h3 class="text-xl font-bold text-slate-800">Catálogo de Usuarios</h3>
            <p class="text-xs text-slate-400 font-medium mt-0.5">Administra los usuarios autorizados, sus roles y estados en el sistema.</p>
        </div>

        <div id="usr-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>

        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Usuarios</span>
                    <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-total-usuarios">–</strong>
                </div>
                <div class="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 shrink-0">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                </div>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Activos</span>
                    <strong class="text-2xl font-bold text-emerald-600 mt-1 block leading-none" id="kpi-usuarios-activos">–</strong>
                </div>
                <div class="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400 shrink-0">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inactivos</span>
                    <strong class="text-2xl font-bold text-rose-500 mt-1 block leading-none" id="kpi-usuarios-inactivos">–</strong>
                </div>
                <div class="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400 shrink-0">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </div>
            </div>
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roles Disponibles</span>
                    <strong class="text-2xl font-bold text-violet-600 mt-1 block leading-none" id="kpi-roles">–</strong>
                </div>
                <div class="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-400 shrink-0">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>
                </div>
            </div>
        </div>

        <!-- Table Grid Container -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[340px]">
            <div class="overflow-y-auto custom-scrollbar flex-1">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 z-10">
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre de Usuario</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol Asignado</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="usr-table-body" class="divide-y divide-slate-100 text-sm text-slate-600">
                        <!-- Filas cargadas dinámicamente -->
                    </tbody>
                </table>
            </div>
            <!-- Paginador -->
            <div id="usr-pager" class="shrink-0"></div>
        </div>
    `;
}

export function usuarioFormTemplate(usuario, rolOptionsHtml) {
    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
            <div class="mb-6">
                <h4 class="text-lg font-bold text-slate-800">Editar Usuario</h4>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Modifica el rol, usuario o estado de acceso al sistema.</p>
            </div>
            
            <form id="usr-form" class="space-y-5">
                <input type="hidden" id="id_usr" value="${usuario.id_usr}">
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label for="username_usr" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario</label>
                        <input type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="username_usr" required value="${usuario.username_usr}">
                    </div>
                    <div>
                        <label for="id_rol" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Rol del Usuario</label>
                        <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50 appearance-none" id="id_rol" required>
                            ${rolOptionsHtml}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label for="estado_usr" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estado de Cuenta</label>
                    <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50 appearance-none" id="estado_usr" required>
                        <option value="true" ${usuario.estado_usr === true ? 'selected' : ''}>Activo</option>
                        <option value="false" ${usuario.estado_usr === false ? 'selected' : ''}>Inactivo</option>
                    </select>
                </div>
                
                <div id="form-error" class="hidden p-3.5 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600" role="alert"></div>
                
                <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                    <button type="button" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all active:scale-[0.99]" id="btn-cancelar">Cancelar</button>
                    <button type="submit" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-all active:scale-[0.99]">Guardar</button>
                </div>
            </form>
        </div>
    `;
}
