export function personaListLayoutTemplate(showNewBtn) {
    return `
        <!-- Page Title & Header Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Catálogo de Personas (Clientes)</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Administra y registra los datos de contacto y facturación de los clientes.</p>
            </div>
            ${showNewBtn ? `
                <button class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center space-x-1.5 shrink-0" id="btn-nueva-persona">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Nueva Persona</span>
                </button>
            ` : ''}
        </div>

        <div id="personas-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>

        <!-- KPI + Buscador en fila -->
        <div class="flex flex-col sm:flex-row gap-4 mb-4">
            <!-- Card: Total Clientes -->
            <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between w-full sm:w-64 shrink-0">
                <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Clientes</span>
                    <strong class="text-2xl font-bold text-slate-800 mt-0.5 block leading-none" id="kpi-total-personas">–</strong>
                </div>
                <div class="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-400 shrink-0">
                    <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>
                </div>
            </div>
            <!-- Buscador -->
            <div class="flex-1 relative">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                <input type="text" id="personas-search"
                    class="w-full h-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="Buscar por cédula, nombre, apellido o teléfono...">
            </div>
        </div>

        <!-- Table Grid Container -->
        <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1 min-h-[320px]">
            <div class="overflow-y-auto custom-scrollbar flex-1">
                <table class="w-full text-left border-collapse">
                    <thead class="sticky top-0 z-10">
                        <tr class="bg-slate-50 border-b border-slate-200">
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cédula</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombres</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Apellidos</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Teléfono</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dirección</th>
                            <th class="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="personas-table-body" class="divide-y divide-slate-100 text-sm text-slate-600">
                        <!-- Filas cargadas dinámicamente -->
                    </tbody>
                </table>
            </div>
            <!-- Paginador -->
            <div id="personas-pager" class="shrink-0"></div>
        </div>
    `;
}

export function personaFormTemplate(persona = null) {
    const isEdit = persona !== null;
    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto">
            <div class="mb-6">
                <h4 class="text-lg font-bold text-slate-800">${isEdit ? 'Editar Persona' : 'Registrar Nueva Persona'}</h4>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Ingresa la información básica y de contacto.</p>
            </div>
            
            <form id="persona-form" class="space-y-5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label for="cedula_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cédula / RUC</label>
                        <input type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="cedula_per" required minlength="10" maxlength="13" 
                               value="${isEdit ? persona.cedula_per : ''}" ${isEdit ? 'readonly class="bg-slate-100 text-slate-500 cursor-not-allowed"' : ''}>
                    </div>
                    <div>
                        <label for="telefono_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Teléfono</label>
                        <input type="text" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="telefono_per" required minlength="10" maxlength="10" value="${isEdit ? persona.telefono_per : ''}">
                    </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label for="nombres_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombres</label>
                        <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="nombres_per" required value="${isEdit ? persona.nombres_per : ''}">
                    </div>
                    <div>
                        <label for="apellidos_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Apellidos</label>
                        <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="apellidos_per" required value="${isEdit ? persona.apellidos_per : ''}">
                    </div>
                </div>
                
                <div>
                    <label for="direccion_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dirección</label>
                    <input type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="direccion_per" required value="${isEdit ? persona.direccion_per : ''}">
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
