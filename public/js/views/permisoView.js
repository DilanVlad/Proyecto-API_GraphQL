export function permisoLayoutTemplate() {
    return `
        <!-- Page Title -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Gestionar Permisos</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Asigna las funciones del sistema para cada rol registrado.</p>
            </div>
            <button class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/10 active:scale-[0.99] transition-all flex items-center space-x-1.5 shrink-0" id="btn-nueva-funcion">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Nueva Función</span>
            </button>
        </div>

        <div id="permisos-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>
        <div id="permisos-success" class="hidden p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold" role="alert"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- ===== LEFT: Roles List Panel ===== -->
            <div class="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h5 class="text-sm font-bold text-slate-800">Roles</h5>
                    <button id="btn-nuevo-rol" class="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1 rounded-lg hover:bg-indigo-50">
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span>Nuevo Rol</span>
                    </button>
                </div>

                <!-- Roles List -->
                <div id="catalogo-roles-funciones" class="divide-y divide-slate-50 overflow-y-auto max-h-[calc(100vh-320px)]">
                    <!-- Roles rendered dynamically -->
                </div>
            </div>

            <!-- ===== RIGHT: Functions Panel ===== -->
            <div class="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h5 class="text-sm font-bold text-slate-800">Funciones / Módulos del Sistema</h5>
                    <p class="text-xs text-slate-400 font-medium mt-0.5" id="selected-rol-subtitle">Selecciona un rol de la lista para editar sus funciones.</p>
                </div>
                <!-- Functions List with Toggles -->
                <div id="funciones-checkboxes-container" class="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1">
                    <!-- Toggle items rendered dynamically -->
                </div>
                <!-- Save Button Footer -->
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
                    <button class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/10 active:scale-[0.99] transition-all" id="btn-guardar-permisos">Guardar Cambios</button>
                </div>
            </div>
        </div>

        <!-- Contenedor dinámico para modales -->
        <div id="modal-container-wrapper"></div>
    `;
}

export function rolFormTemplate(rol = null) {
    const isEdit = rol !== null;
    return `
        <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="permiso-modal-overlay">
            <div class="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden transform transition-all">
                <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 class="text-sm font-bold text-slate-800">${isEdit ? 'Editar Rol' : 'Registrar Nuevo Rol'}</h3>
                    <button type="button" class="text-slate-400 hover:text-slate-600 transition-colors" id="btn-close-modal-x">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6">
                    <form id="rol-modal-form" class="space-y-4">
                        <div>
                            <label for="nombre_rol" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre del Rol</label>
                            <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="nombre_rol" required value="${isEdit ? rol.nombre_rol : ''}" placeholder="Ej. Operativo">
                        </div>
                        <div id="modal-error" class="hidden p-3 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600 mt-2"></div>
                        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                            <button type="button" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all" id="btn-cancelar-modal">Cancelar</button>
                            <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-all">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function funcionFormTemplate(funcion = null) {
    const isEdit = funcion !== null;
    return `
        <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" id="permiso-modal-overlay">
            <div class="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden transform transition-all">
                <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 class="text-sm font-bold text-slate-800">${isEdit ? 'Editar Función / Módulo' : 'Registrar Nueva Función / Módulo'}</h3>
                    <button type="button" class="text-slate-400 hover:text-slate-600 transition-colors" id="btn-close-modal-x">
                        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div class="p-6">
                    <form id="funcion-modal-form" class="space-y-4">
                        <div>
                            <label for="nombre_fnc" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de la Función</label>
                            <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="nombre_fnc" required value="${isEdit ? funcion.nombre_fnc : ''}" placeholder="Ej. Personas">
                        </div>
                        <div>
                            <label for="ruta_fnc" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ruta de la Función</label>
                            <input type="text" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="ruta_fnc" required value="${isEdit ? funcion.ruta_fnc : ''}" placeholder="Ej. /personas">
                        </div>
                        <div id="modal-error" class="hidden p-3 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600 mt-2"></div>
                        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                            <button type="button" class="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all" id="btn-cancelar-modal">Cancelar</button>
                            <button type="submit" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-all">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
