import { getReporteAlquileres } from '../services/reporteService.js';
import { printGeneralPDF, printIndividualPDF } from '../services/pdfService.js';
import { reporteLayoutTemplate, reportePlaceholderTemplate, reporteClientDetailTemplate } from '../views/reporteView.js';

let clientsList = [];
let selectedClientCed = null;

export async function renderReporte(container) {
    selectedClientCed = null;
    clientsList = [];
    container.innerHTML = reporteLayoutTemplate();

    try {
        const alquileresData = await getReporteAlquileres();

        if (!alquileresData || alquileresData.length === 0) {
            const listDiv = document.getElementById('reporte-clients-list');
            if (listDiv) listDiv.innerHTML = '<div class="p-6 text-center text-slate-400 text-xs font-medium">No se registran alquileres para el reporte.</div>';
            showPlaceholder();
            return;
        }


        let totalIngresos = 0;
        let totalDptosReservados = 0;
        const clientsMap = {};

        alquileresData.forEach(a => {
            totalIngresos += a.total_alq;
            if (a.detalles) {
                totalDptosReservados += a.detalles.length;
            }

            const clientCed = a.persona ? a.persona.cedula_per : a.cedula_per;
            if (!clientsMap[clientCed]) {
                clientsMap[clientCed] = {
                    persona: a.persona || { cedula_per: clientCed, nombres_per: 'N/A', apellidos_per: '' },
                    alquileres: [],
                    totalSpent: 0
                };
            }
            clientsMap[clientCed].alquileres.push(a);
            clientsMap[clientCed].totalSpent += a.total_alq;
        });

        clientsList = Object.values(clientsMap);

        document.getElementById('kpi-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
        document.getElementById('kpi-transacciones').textContent = alquileresData.length;
        document.getElementById('kpi-departamentos').textContent = totalDptosReservados;
        document.getElementById('kpi-clientes').textContent = clientsList.length;

        document.getElementById('btn-print-pdf').onclick = () => {
            printGeneralPDF(
                totalIngresos,
                alquileresData.length,
                totalDptosReservados,
                clientsList.length,
                clientsList,
                alquileresData
            );
        };

        renderClientsList();
        showPlaceholder();

    } catch (err) {
        const alert = document.getElementById('reporte-alert');
        if (alert) {
            alert.textContent = 'Error al generar el reporte: ' + err.message;
            alert.classList.remove('hidden');
        }
    }

}

function renderClientsList() {
    const container = document.getElementById('reporte-clients-list');
    if (!container) return;

    container.innerHTML = '';
    clientsList.forEach(c => {
        const isSelected = c.persona.cedula_per === selectedClientCed;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `w-full text-left px-5 py-4 flex items-center justify-between transition-all border-l-2 ${
            isSelected
                ? 'bg-indigo-50 border-l-indigo-600'
                : 'hover:bg-slate-50 border-l-transparent'
        }`;

        btn.innerHTML = `
            <div>
                <div class="text-sm font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-700'}">${c.persona.nombres_per} ${c.persona.apellidos_per}</div>
                <div class="text-[10px] font-semibold ${isSelected ? 'text-indigo-500' : 'text-slate-400'} mt-0.5">C.I. ${c.persona.cedula_per} &bull; ${c.alquileres.length} alquiler(es)</div>
            </div>
            <span class="text-xs font-bold ${isSelected ? 'text-emerald-700 bg-emerald-50' : 'text-emerald-600 bg-emerald-50'} border border-emerald-100 px-2 py-0.5 rounded-lg shrink-0 ml-3">$${c.totalSpent.toFixed(2)}</span>
        `;

        btn.addEventListener('click', () => {
            selectedClientCed = c.persona.cedula_per;
            renderClientsList();
            showClientDetail(c);
        });

        container.appendChild(btn);
    });
}


function showPlaceholder() {
    const pane = document.getElementById('reporte-detail-pane');
    if (pane) {
        pane.innerHTML = reportePlaceholderTemplate();
    }
}

function showClientDetail(client) {
    const pane = document.getElementById('reporte-detail-pane');
    if (!pane) return;

    pane.innerHTML = reporteClientDetailTemplate(client);

    document.getElementById('btn-print-client-pdf').onclick = () => {
        printIndividualPDF(client);
    };
}
