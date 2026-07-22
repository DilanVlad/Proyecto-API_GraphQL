export function departamentoListLayoutTemplate(showNewBtn) {
    return `
        <!-- Page Title & Header Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Catálogo de Departamentos</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Administra y monitorea el estado de todas las unidades residenciales.</p>
            </div>
            ${showNewBtn ? `
                <button class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center space-x-1.5 shrink-0" id="btn-nuevo-dpto">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Agregar Unidad</span>
                </button>
            ` : ''}
        </div>

        <div id="dptos-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>

        <!-- KPI SUMMARY CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <!-- Card 1: Total Units -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div class="relative z-10">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Departamentos</span>
                    <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-dptos-total">0</strong>
                </div>
                <div class="text-slate-100 absolute -right-2 -bottom-2 shrink-0 select-none pointer-events-none">
                    <svg class="h-20 w-20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2zM9 5H7v2h2V5zm0 4H7v2h2V9zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-12h-2v2h2V5zm0 4h-2v2h2V9zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm4-12h-2v2h2V5zm0 4h-2v2h2V9zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>
                </div>
            </div>
            <!-- Card 2: Occupied -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div class="relative z-10">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unidades Ocupadas</span>
                    <div class="flex items-baseline space-x-2 mt-1">
                        <strong class="text-2xl font-bold text-slate-800 leading-none" id="kpi-dptos-ocupados">0</strong>
                        <span class="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded" id="kpi-dptos-ocupados-pct">0%</span>
                    </div>
                </div>
                <div class="text-blue-100/60 absolute -right-2 -bottom-2 shrink-0 select-none pointer-events-none">
                    <svg class="h-20 w-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
            </div>
            <!-- Card 3: Available -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div class="relative z-10">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unidades Disponibles</span>
                    <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-dptos-disponibles">0</strong>
                </div>
                <div class="text-emerald-100/60 absolute -right-2 -bottom-2 shrink-0 select-none pointer-events-none">
                    <svg class="h-20 w-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
                </div>
            </div>
            <!-- Card 4: Maintenance -->
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div class="relative z-10">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">En Mantenimiento</span>
                    <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-dptos-mantenimiento">0</strong>
                </div>
                <div class="text-rose-100/60 absolute -right-2 -bottom-2 shrink-0 select-none pointer-events-none">
                    <svg class="h-20 w-20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z"/></svg>
                </div>
            </div>
        </div>

        <!-- Table Grid Container -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[340px]">
            <div class="overflow-y-auto custom-scrollbar flex-1">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 z-10">
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Descripción</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio Diario</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="dptos-table-body" class="divide-y divide-slate-100 text-sm text-slate-600">
                        <!-- Filas cargadas dinámicamente -->
                    </tbody>
                </table>
            </div>
            <!-- Paginador -->
            <div id="dptos-pager" class="shrink-0"></div>
        </div>
    `;
}

export function departamentoFormTemplate(dpto = null) {
    const isEdit = dpto !== null;
    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
            <div class="mb-6">
                <h4 class="text-lg font-bold text-slate-800">${isEdit ? 'Editar Departamento' : 'Registrar Nuevo Departamento'}</h4>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Ingresa los datos correspondientes para registrar la unidad.</p>
            </div>
            
            <form id="dpto-form" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label for="codigo_dpto" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Código del Departamento</label>
                        <input type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="codigo_dpto" required maxlength="10" 
                               value="${isEdit ? dpto.codigo_dpto : ''}" ${isEdit ? 'readonly class="bg-slate-100 text-slate-500 cursor-not-allowed"' : ''}>
                    </div>
                    <div>
                        <label for="precio_dpto" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Precio Diario</label>
                        <input type="number" step="0.01" min="0" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="precio_dpto" required value="${isEdit ? dpto.precio_dpto : ''}">
                    </div>
                </div>
                
                <div>
                    <label for="estado_dpto" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Estado</label>
                    <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50 appearance-none" id="estado_dpto" required>
                        <option value="Disponible" ${isEdit && dpto.estado_dpto === 'Disponible' ? 'selected' : ''}>Disponible</option>
                        <option value="Ocupado" ${isEdit && dpto.estado_dpto === 'Ocupado' ? 'selected' : ''}>Ocupado</option>
                        <option value="Mantenimiento" ${isEdit && dpto.estado_dpto === 'Mantenimiento' ? 'selected' : ''}>Mantenimiento</option>
                    </select>
                </div>
                
                <div>
                    <label for="descripcion_dpto" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Descripción</label>
                    <textarea class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="descripcion_dpto" rows="3" required placeholder="Ej. Suite 101 - The Avalon">${isEdit ? dpto.descripcion_dpto : ''}</textarea>
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
