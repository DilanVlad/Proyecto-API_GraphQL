import { formatDate } from '../utils/dateUtils.js';

export function reporteLayoutTemplate() {
    return `
        <!-- Page Title & Header Actions -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
                <h3 class="text-xl font-bold text-slate-800">Reporte Consolidado</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Estadísticas de facturación acumulada e historial general por cliente.</p>
            </div>
            <button class="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/10 hover:shadow-rose-600/20 active:scale-[0.99] transition-all flex items-center space-x-1.5 shrink-0" id="btn-print-pdf">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.821V21m0 0-3-3m3 3 3-3M1.2 12v3.375c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V12M18.375 6.75h-15a2.25 2.25 0 0 0-2.25 2.25v7.5A2.25 2.25 0 0 0 3.375 18.75h15a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 18.375 6.75Z" />
                </svg>
                <span>Exportar PDF General</span>
            </button>
        </div>

        <!-- KPI SUMMARY CARDS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ingresos Totales</span>
                <strong class="text-2xl font-bold text-emerald-600 mt-1 block leading-none" id="kpi-ingresos">$0.00</strong>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Alquileres Totales</span>
                <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-transacciones">0</strong>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dptos. Reservados</span>
                <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-departamentos">0</strong>
            </div>
            <div class="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clientes Activos</span>
                <strong class="text-2xl font-bold text-slate-800 mt-1 block leading-none" id="kpi-clientes">0</strong>
            </div>
        </div>

        <div id="reporte-alert" class="hidden p-4 mb-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold" role="alert"></div>

        <!-- Master-Detail Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left: Clients list -->
            <div class="lg:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <!-- Header -->
                <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/60">
                    <h6 class="text-xs font-bold text-slate-600 uppercase tracking-wider">Clientes</h6>
                </div>
                <!-- Client Rows -->
                <div id="reporte-clients-list" class="divide-y divide-slate-50 overflow-y-auto max-h-[calc(100vh-400px)] custom-scrollbar">
                    <!-- Dynamic rows -->
                </div>
            </div>

            <!-- Right: Detail Pane -->
            <div class="lg:col-span-8" id="reporte-detail-pane">
                <!-- Placeholder or client detail loaded dynamically -->
            </div>
        </div>
    `;
}

export function reportePlaceholderTemplate() {
    return `
        <div class="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px] bg-slate-50/50">
            <div class="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner mb-4">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm-1.2 4.875h-1.35c-1.036 0-1.875.84-1.875 1.875v.375c0 .621.504 1.125 1.125 1.125h3.75c.621 0 1.125-.504 1.125-1.125v-.375c0-1.036-.84-1.875-1.875-1.875Z" /></svg>
            </div>
            <h5 class="text-sm font-bold text-slate-800">Historial del Cliente</h5>
            <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">Selecciona un cliente de la lista de la izquierda para ver su histórico completo de transacciones y exportar su estado de cuenta individual en PDF.</p>
        </div>
    `;
}

export function reporteClientDetailTemplate(client) {
    let rentalsRows = '';
    client.alquileres.forEach(a => {
        let dptoSummary = '';
        if (a.detalles && a.detalles.length > 0) {
            dptoSummary = a.detalles.map(d => `
                <div class="mb-0.5 last:mb-0">
                    <span class="font-bold text-slate-700">${d.codigo_dpto}</span>
                    <span class="text-slate-400"> · ${formatDate(d.fecha_inicio_det)} → ${formatDate(d.fecha_fin_det)}</span>
                </div>
            `).join('');
        } else {
            dptoSummary = '<span class="text-slate-400">Sin detalles</span>';
        }

        rentalsRows += `
            <tr class="hover:bg-slate-50/50 transition-colors">
                <td class="px-5 py-3 font-bold text-slate-800">${a.cod_alq}</td>
                <td class="px-5 py-3 font-medium text-slate-500">${formatDate(a.fecha_alq)}</td>
                <td class="px-5 py-3 text-xs text-slate-600">${dptoSummary}</td>
                <td class="px-5 py-3 font-bold text-emerald-600 text-right">$${a.total_alq.toFixed(2)}</td>
            </tr>
        `;
    });

    return `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
                <div>
                    <h6 class="text-sm font-bold text-slate-800">Histórico de Alquileres</h6>
                    <span class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-0.5">${client.persona.nombres_per} ${client.persona.apellidos_per}</span>
                </div>
                <button class="px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5" id="btn-print-client-pdf">
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.821V21m0 0-3-3m3 3 3-3M1.2 12v3.375c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V12M18.375 6.75h-15a2.25 2.25 0 0 0-2.25 2.25v7.5A2.25 2.25 0 0 0 3.375 18.75h15a2.25 2.25 0 0 0 2.25-2.25v-7.5A2.25 2.25 0 0 0 18.375 6.75Z" />
                    </svg>
                    <span>Imprimir Reporte</span>
                </button>
            </div>

            <!-- Info Cards -->
            <div class="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-100">
                <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl">
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Identificación (C.I.)</span>
                    <strong class="text-slate-800 font-bold text-sm block">${client.persona.cedula_per}</strong>
                </div>
                <div class="p-4 bg-slate-50/70 border border-slate-100 rounded-xl text-right">
                    <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gasto Total Acumulado</span>
                    <strong class="text-emerald-600 font-bold text-lg block leading-none">$${client.totalSpent.toFixed(2)}</strong>
                </div>
            </div>

            <!-- Transactions Table -->
            <div class="p-5 space-y-3">
                <h6 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Historial de Transacciones (${client.alquileres.length})</h6>
                <div class="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <div class="overflow-x-auto custom-scrollbar">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-slate-50 border-b border-slate-100">
                                    <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Código</th>
                                    <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                                    <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departamentos</th>
                                    <th class="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Monto</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-xs text-slate-600">
                                ${rentalsRows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
