import { formatDate } from '../utils/dateUtils.js';

export function alquilerListLayoutTemplate(canCreate) {
    return `
        <!-- Page Title & Header Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Gestión de Alquileres</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Controla y registra los contratos de alquileres de departamentos.</p>
            </div>
            ${canCreate ? `
                <button class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center space-x-1.5 shrink-0" id="btn-nuevo-alquiler">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Registrar Alquiler</span>
                </button>
            ` : ''}
        </div>

        <div id="alquileres-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Master List Sidebar -->
            <div class="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div class="mb-4">
                    <div class="relative">
                        <input type="text" class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="rental-search" placeholder="Buscar por cliente o código...">
                        <span class="absolute left-3.5 top-3.5 text-slate-400">
                            <svg class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </span>
                    </div>
                </div>
                
                <div class="h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar" id="rentals-master-list">
                    <!-- Alquileres listados aquí (botones dinámicos) -->
                </div>
            </div>

            <!-- Detail Pane -->
            <div class="lg:col-span-7" id="rental-detail-pane">
                <!-- Cargado dinámicamente -->
            </div>
        </div>
    `;
}

export function alquilerFormTemplate() {
    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
            <div class="mb-6">
                <h4 class="text-lg font-bold text-slate-800">Registrar Transacción de Alquiler</h4>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Ingresa los datos del cliente y los departamentos que se reservarán.</p>
            </div>
            
            <div id="form-error" class="hidden p-3.5 mb-5 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600" role="alert"></div>

            <form id="alquiler-form" class="space-y-6">
                <!-- Cliente & Fecha -->
                <div class="p-5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-4">
                    <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/50 pb-2">Información del Cliente</h6>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label for="cedula_per" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cliente (Persona)</label>
                            <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-white appearance-none" id="cedula_per" required>
                                <option value="" disabled selected>Seleccione un cliente...</option>
                            </select>
                        </div>
                        <div>
                            <label for="fecha_alq" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fecha del Alquiler</label>
                            <input type="date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-white" id="fecha_alq" required>
                        </div>
                    </div>
                </div>

                <!-- Agregar Departamento al Detalle -->
                <div class="p-5 bg-slate-50/70 border border-slate-100 rounded-xl space-y-4">
                    <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/50 pb-2">Agregar Departamentos al Detalle</h6>
                    <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        <div class="sm:col-span-4">
                            <label for="codigo_dpto" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Departamento</label>
                            <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-white appearance-none" id="codigo_dpto">
                                <option value="" disabled selected>Seleccione departamento...</option>
                            </select>
                        </div>
                        <div class="sm:col-span-3">
                            <label for="fecha_inicio_det" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fecha de Inicio</label>
                            <input type="date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-white" id="fecha_inicio_det">
                        </div>
                        <div class="sm:col-span-3">
                            <label for="fecha_fin_det" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fecha de Fin</label>
                            <input type="date" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-white" id="fecha_fin_det">
                        </div>
                        <div class="sm:col-span-2">
                            <button type="button" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/10 active:scale-[0.99] transition-all flex items-center justify-center h-[42px] gap-1.5" id="btn-agregar-detalle">
                                <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                                <span>Agregar</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Detalle Temporal Table -->
                <div class="space-y-3">
                    <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Detalle de Departamentos Reservados</h6>
                    <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-100">
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio/Día</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha Inicio</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha Fin</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="temp-details-table-body" class="divide-y divide-slate-100 text-xs text-slate-600">
                                    <tr>
                                        <td colspan="6" class="px-5 py-6 text-center text-slate-400 font-medium bg-white">No se han agregado departamentos a esta transacción.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Form Bottom Actions -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-5 border-t border-slate-100 gap-4">
                    <div>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Acumulado</span>
                        <strong class="text-2xl font-bold text-emerald-600 block mt-0.5" id="total-acumulado">$0.00</strong>
                    </div>
                    <div class="flex items-center space-x-3 w-full sm:w-auto justify-end">
                        <button type="button" class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all active:scale-[0.99]" id="btn-cancelar">Cancelar</button>
                        <button type="submit" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-all active:scale-[0.99]">Guardar Alquiler</button>
                    </div>
                </div>
            </form>
        </div>
    `;
}

export function alquilerPlaceholderTemplate() {
    return `
        <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50">
            <div class="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
            </div>
            <h5 class="text-sm font-bold text-slate-800">Detalle del Alquiler</h5>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">Selecciona un registro de la lista de la izquierda para ver su información detallada, o haz clic en "Registrar Alquiler" para crear una transacción.</p>
        </div>
    `;
}

export function alquilerDetailTemplate(rental, canDelete) {
    let detRows = '';
    if (rental.detalles && rental.detalles.length > 0) {
        detRows = rental.detalles.map(d => `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="px-5 py-3 font-bold text-slate-800">${d.codigo_dpto}</td>
                <td class="px-5 py-3 font-medium text-slate-600">${d.departamento ? d.departamento.descripcion_dpto : 'Sin descripción'}</td>
                <td class="px-5 py-3 font-medium text-slate-500">${formatDate(d.fecha_inicio_det)}</td>
                <td class="px-5 py-3 font-medium text-slate-500">${formatDate(d.fecha_fin_det)}</td>
                <td class="px-5 py-3 font-bold text-slate-800 text-right">$${d.precio_det.toFixed(2)}</td>
            </tr>
        `).join('');
    } else {
        detRows = '<tr><td colspan="5" class="px-5 py-6 text-center text-slate-400 font-medium bg-white">Sin departamentos en este alquiler.</td></tr>';
    }

    const isActive = (rental.estado_alq || '').toLowerCase() === 'activo';

    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <!-- Header -->
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                    <h6 class="text-sm font-bold text-slate-800">Detalle: ${rental.cod_alq}</h6>
                    <span class="text-[10px] text-slate-400 font-semibold tracking-wider block mt-0.5">ID REGISTRO</span>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-700 border-slate-100'}">
                    ${rental.estado_alq}
                </span>
            </div>
            
            <!-- Body -->
            <div class="p-6 flex-1 overflow-y-auto space-y-6">
                <!-- Info cards grid -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Cliente</span>
                        <strong class="text-slate-800 font-bold block">${rental.persona ? `${rental.persona.nombres_per} ${rental.persona.apellidos_per}` : 'N/A'}</strong>
                        <span class="text-xs text-slate-500 font-semibold block mt-0.5">C.I. ${rental.cedula_per}</span>
                    </div>
                    <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Información de Registro</span>
                        <span class="text-xs text-slate-700 block font-semibold"><strong>Fecha:</strong> ${formatDate(rental.fecha_alq)}</span>
                        <span class="text-xs text-slate-500 block font-semibold mt-0.5"><strong>Emisor:</strong> ${rental.usuario ? rental.usuario.username_usr : 'N/A'}</span>
                    </div>
                </div>

                <!-- Subtable items -->
                <div class="space-y-2">
                    <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Departamentos Incluidos</h6>
                    <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-slate-50 border-b border-slate-100">
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Descripción</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inicio</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fin</th>
                                        <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Precio/Día</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 text-xs text-slate-600">
                                    ${detRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Total section -->
                <div class="text-right pt-4 border-t border-slate-100">
                    <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de la Transacción</span>
                    <strong class="text-2xl font-bold text-emerald-600 block mt-0.5">$${rental.total_alq.toFixed(2)}</strong>
                </div>
            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-3 shrink-0">
                <button class="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-xs font-bold transition-all active:scale-[0.99]" id="btn-close-detail">Cerrar</button>
            </div>
        </div>
    `;
}
