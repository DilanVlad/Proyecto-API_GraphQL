import { getAlquileres, getFormCatalogos, createAlquilerTransaccionalMutation, deleteAlquilerMutation } from '../services/alquilerService.js';
import { alquilerListLayoutTemplate, alquilerFormTemplate, alquilerPlaceholderTemplate, alquilerDetailTemplate } from '../views/alquilerView.js';
import { hasPermission } from '../app.js';
import { formatDate } from '../utils/dateUtils.js';

let viewContainer = null;
let rentalsList = [];
let selectedRentalCod = null;
let currentDetails = [];
let personasList = [];
let departmentsList = [];

export async function renderAlquileres(container) {
    viewContainer = container;
    selectedRentalCod = null;
    rentalsList = [];
    await loadMasterDetailView();
}

async function loadMasterDetailView() {
    const canCreate = hasPermission('crear', 'alquiler') || hasPermission('crear', 'alq');
    viewContainer.innerHTML = alquilerListLayoutTemplate(canCreate);

    if (canCreate) {
        document.getElementById('btn-nuevo-alquiler').addEventListener('click', () => showForm());
    }

    document.getElementById('rental-search').addEventListener('input', (e) => {
        filterRentals(e.target.value);
    });

    await refreshRentalsData();
    renderPlaceholder();
}

async function refreshRentalsData() {
    try {
        rentalsList = await getAlquileres();
        renderMasterList(rentalsList);
    } catch (err) {
        const alert = document.getElementById('alquileres-alert');
        if (alert) {
            alert.textContent = 'Error al cargar alquileres: ' + err.message;
            alert.classList.remove('hidden');
        }
    }
}

function renderMasterList(items) {
    const container = document.getElementById('rentals-master-list');
    if (!container) return;

    container.innerHTML = '';
    if (items.length === 0) {
        container.innerHTML = '<div class="p-5 text-center text-slate-400 font-medium bg-white border border-slate-100 rounded-xl">No se encontraron registros de alquiler.</div>';
        return;
    }

    items.forEach(r => {
        const isSelected = r.cod_alq === selectedRentalCod;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `w-full text-left p-4 rounded-xl transition-all border ${
            isSelected 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-900 shadow-sm' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
        } mb-3 flex flex-col space-y-2`;
        
        btn.innerHTML = `
            <div class="flex justify-between items-center w-full">
                <span class="text-xs font-bold ${isSelected ? 'text-indigo-800' : 'text-slate-800'}">${r.cod_alq}</span>
                <span class="text-[10px] ${isSelected ? 'text-indigo-500 font-bold' : 'text-slate-400 font-semibold'}">${formatDate(r.fecha_alq)}</span>
            </div>
            <div class="flex justify-between items-end w-full">
                <div class="text-xs leading-tight">
                    <span class="text-[9px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Cliente</span>
                    <span class="font-medium truncate max-w-[180px] block">${r.persona ? `${r.persona.nombres_per} ${r.persona.apellidos_per}` : r.cedula_per}</span>
                </div>
                <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">$${r.total_alq.toFixed(2)}</span>
            </div>
        `;

        btn.addEventListener('click', () => {
            selectedRentalCod = r.cod_alq;
            renderMasterList(rentalsList);
            showDetail(r);
        });

        container.appendChild(btn);
    });
}

function filterRentals(term) {
    const cleanTerm = term.toLowerCase().trim();
    if (!cleanTerm) {
        renderMasterList(rentalsList);
        return;
    }

    const filtered = rentalsList.filter(r => {
        const cod = (r.cod_alq || '').toLowerCase();
        const clientName = r.persona ? `${r.persona.nombres_per || ''} ${r.persona.apellidos_per || ''}`.toLowerCase() : '';
        const clientCed = (r.cedula_per || '').toLowerCase();
        return cod.includes(cleanTerm) || clientName.includes(cleanTerm) || clientCed.includes(cleanTerm);
    });

    renderMasterList(filtered);
}

function renderPlaceholder() {
    const pane = document.getElementById('rental-detail-pane');
    if (pane) {
        pane.innerHTML = alquilerPlaceholderTemplate();
    }
}

function showDetail(rental) {
    const pane = document.getElementById('rental-detail-pane');
    if (!pane) return;

    const canDelete = hasPermission('eliminar', 'alquiler') || hasPermission('eliminar', 'alq');
    pane.innerHTML = alquilerDetailTemplate(rental, canDelete);

    document.getElementById('btn-close-detail').addEventListener('click', () => {
        selectedRentalCod = null;
        renderMasterList(rentalsList);
        renderPlaceholder();
    });


}

async function showForm() {
    currentDetails = [];
    viewContainer.innerHTML = alquilerFormTemplate();

    document.getElementById('fecha_alq').valueAsDate = new Date();
    
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('fecha_alq').min = todayStr;
    
    const fechaInicioDet = document.getElementById('fecha_inicio_det');
    const fechaFinDet = document.getElementById('fecha_fin_det');
    
    fechaInicioDet.min = todayStr;
    fechaFinDet.min = todayStr;

    fechaInicioDet.addEventListener('change', (e) => {
        const selectedStart = e.target.value || todayStr;
        fechaFinDet.min = selectedStart;
        if (fechaFinDet.value && fechaFinDet.value < selectedStart) {
            fechaFinDet.value = '';
        }
    });

    try {
        const catalogos = await getFormCatalogos();
        personasList = catalogos.personas;
        departmentsList = catalogos.departamentos;

        const selectPersonas = document.getElementById('cedula_per');
        personasList.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.cedula_per;
            opt.textContent = `${p.nombres_per} ${p.apellidos_per} (${p.cedula_per})`;
            selectPersonas.appendChild(opt);
        });

        const selectDptos = document.getElementById('codigo_dpto');
        departmentsList.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.codigo_dpto;
            opt.dataset.precio = d.precio_dpto;
            opt.dataset.estado = d.estado_dpto;

            if (d.estado_dpto.toLowerCase() === 'disponible') {
                opt.textContent = `${d.codigo_dpto} - ${d.descripcion_dpto} ($${d.precio_dpto}/día)`;
            } else {
                opt.textContent = `${d.codigo_dpto} - ${d.descripcion_dpto} ($${d.precio_dpto}/día) [${d.estado_dpto}]`;
                opt.disabled = true;
            }
            selectDptos.appendChild(opt);
        });

    } catch (err) {
        const errDiv = document.getElementById('form-error');
        if (errDiv) {
            errDiv.textContent = 'Error al cargar opciones del formulario: ' + err.message;
            errDiv.classList.remove('hidden');
        }
    }

    document.getElementById('btn-cancelar').addEventListener('click', () => loadMasterDetailView());
    document.getElementById('btn-agregar-detalle').addEventListener('click', handleAddDetailItem);

    document.getElementById('alquiler-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errDiv = document.getElementById('form-error');
        if (errDiv) errDiv.classList.add('hidden');

        const cedula_per = document.getElementById('cedula_per').value;
        const fecha_alq = document.getElementById('fecha_alq').value;

        if (!cedula_per) {
            if (errDiv) {
                errDiv.textContent = 'Debe seleccionar un cliente.';
                errDiv.classList.remove('hidden');
            }
            return;
        }

        if (currentDetails.length === 0) {
            if (errDiv) {
                errDiv.textContent = 'Debe agregar al menos un departamento al detalle.';
                errDiv.classList.remove('hidden');
            }
            return;
        }

        try {
            const payload = {
                cedula_per: cedula_per,
                fecha_alq: fecha_alq,
                detalles: currentDetails.map(d => ({
                    codigo_dpto: d.codigo_dpto,
                    precio_det: d.precio_det,
                    fecha_inicio_det: d.fecha_inicio_det,
                    fecha_fin_det: d.fecha_fin_det
                }))
            };

            await createAlquilerTransaccionalMutation(payload);
            loadMasterDetailView();
        } catch (err) {
            if (errDiv) {
                errDiv.textContent = 'Error al procesar la transacción de alquiler: ' + err.message;
                errDiv.classList.remove('hidden');
            }
        }
    });
}

function handleAddDetailItem() {
    const errDiv = document.getElementById('form-error');
    if (errDiv) errDiv.classList.add('hidden');

    const selectDpto = document.getElementById('codigo_dpto');
    const fechaInicioInput = document.getElementById('fecha_inicio_det');
    const fechaFinInput = document.getElementById('fecha_fin_det');

    const codigo_dpto = selectDpto.value;
    const fecha_inicio_det = fechaInicioInput.value;
    const fecha_fin_det = fechaFinInput.value;

    if (!codigo_dpto) {
        if (errDiv) {
            errDiv.textContent = 'Seleccione un departamento.';
            errDiv.classList.remove('hidden');
        }
        return;
    }
    if (!fecha_inicio_det || !fecha_fin_det) {
        if (errDiv) {
            errDiv.textContent = 'Seleccione las fechas de inicio y fin.';
            errDiv.classList.remove('hidden');
        }
        return;
    }

    const start = new Date(fecha_inicio_det);
    const end = new Date(fecha_fin_det);
    if (end < start) {
        if (errDiv) {
            errDiv.textContent = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
            errDiv.classList.remove('hidden');
        }
        return;
    }

    if (currentDetails.some(item => item.codigo_dpto === codigo_dpto)) {
        if (errDiv) {
            errDiv.textContent = `El departamento ${codigo_dpto} ya se encuentra agregado en el detalle.`;
            errDiv.classList.remove('hidden');
        }
        return;
    }

    const selectedOption = selectDpto.options[selectDpto.selectedIndex];
    const precio_det = parseFloat(selectedOption.dataset.precio || 0);

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const subtotal = diffDays * precio_det;

    currentDetails.push({
        codigo_dpto,
        precio_det,
        fecha_inicio_det,
        fecha_fin_det,
        days: diffDays,
        subtotal
    });

    renderTempDetailsTable();

    selectDpto.value = '';
    fechaInicioInput.value = '';
    fechaFinInput.value = '';
}

function renderTempDetailsTable() {
    const tbody = document.getElementById('temp-details-table-body');
    const totalDisplay = document.getElementById('total-acumulado');

    if (!tbody) return;
    tbody.innerHTML = '';

    if (currentDetails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="px-5 py-6 text-center text-slate-400 font-medium bg-white">No se han agregado departamentos a esta transacción.</td></tr>';
        if (totalDisplay) totalDisplay.textContent = '$0.00';
        return;
    }

    let grandTotal = 0;
    currentDetails.forEach((item, index) => {
        grandTotal += item.subtotal;
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50/50 transition-colors';
        tr.innerHTML = `
            <td class="px-5 py-3 font-bold text-slate-800">${item.codigo_dpto}</td>
            <td class="px-5 py-3 font-bold text-slate-800">$${item.precio_det.toFixed(2)}</td>
            <td class="px-5 py-3 font-medium text-slate-500">${formatDate(item.fecha_inicio_det)}</td>
            <td class="px-5 py-3 font-medium text-slate-500">${formatDate(item.fecha_fin_det)} (${item.days} días)</td>
            <td class="px-5 py-3 text-right font-bold text-emerald-600">$${item.subtotal.toFixed(2)}</td>
            <td class="px-5 py-3 text-right">
                <button type="button" class="px-2.5 py-1.5 border border-rose-250 hover:bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold transition-all btn-remove-item" data-index="${index}">Quitar</button>
            </td>
        `;

        tr.querySelector('.btn-remove-item').addEventListener('click', () => {
            currentDetails.splice(index, 1);
            renderTempDetailsTable();
        });

        tbody.appendChild(tr);
    });

    if (totalDisplay) totalDisplay.textContent = `$${grandTotal.toFixed(2)}`;
}
