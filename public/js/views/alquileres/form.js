import { graphqlQuery } from '../../api.js';

let formContainer = null;
let currentDetails = [];
let personasList = [];
let departmentsList = [];
let closeFormCallback = null;

// --- HELPERS ---
function parseDate(dateStr) {
    if (!dateStr) return null;
    if (/^\d+$/.test(dateStr)) {
        return new Date(parseInt(dateStr, 10));
    }
    return new Date(dateStr);
}

function formatDate(dateStr) {
    const date = parseDate(dateStr);
    if (!date || isNaN(date.getTime())) return dateStr || '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// --- RENDER FORM ---
export async function showForm(container, onCloseCallback) {
    formContainer = container;
    closeFormCallback = onCloseCallback;
    currentDetails = [];

    formContainer.innerHTML = `
        <h4 class="mb-4 text-secondary">Registrar Transacción de Alquiler</h4>
        <div id="form-error" class="alert alert-danger d-none" role="alert"></div>

        <form id="alquiler-form" class="row g-4">
            <!-- SECCIÓN MAESTRO: CLIENTE Y TRANSACCIÓN -->
            <div class="col-12">
                <div class="card border-0 bg-light p-3">
                    <h6 class="text-secondary fw-bold mb-3 border-bottom pb-2">Información del Cliente</h6>
                    <div class="row g-3">
                        <div class="col-md-6">
                            <label for="cedula_per" class="form-label">Cliente (Persona)</label>
                            <select class="form-select" id="cedula_per" required>
                                <option value="" disabled selected>Seleccione un cliente...</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label for="fecha_alq" class="form-label">Fecha del Alquiler</label>
                            <input type="date" class="form-control" id="fecha_alq" required>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN AGREGACIÓN: AGREGAR DEPARTAMENTO AL DETALLE -->
            <div class="col-12">
                <div class="card border-0 bg-light p-3">
                    <h6 class="text-secondary fw-bold mb-3 border-bottom pb-2">Agregar Departamentos al Detalle</h6>
                    <div class="row g-3 align-items-end">
                        <div class="col-md-4">
                            <label for="codigo_dpto" class="form-label">Departamento</label>
                            <select class="form-select" id="codigo_dpto">
                                <option value="" disabled selected>Seleccione departamento...</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="fecha_inicio_det" class="form-label">Fecha de Inicio</label>
                            <input type="date" class="form-control" id="fecha_inicio_det">
                        </div>
                        <div class="col-md-3">
                            <label for="fecha_fin_det" class="form-label">Fecha de Fin</label>
                            <input type="date" class="form-control" id="fecha_fin_det">
                        </div>
                        <div class="col-md-2">
                            <button type="button" class="btn btn-primary w-100" id="btn-agregar-detalle">Agregar</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN DETALLE: LISTA DE DEPARTAMENTOS AGREGADOS -->
            <div class="col-12">
                <h6 class="text-secondary fw-bold mb-3">Detalle de Departamentos Reservados</h6>
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th>Código</th>
                                <th>Precio/Día</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th class="text-end">Subtotal</th>
                                <th class="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="temp-details-table-body">
                            <tr>
                                <td colspan="6" class="text-center text-muted py-3">No se han agregado departamentos a esta transacción.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TOTALIZADOR Y ACCIONES FINALES -->
            <div class="col-12 d-flex justify-content-between align-items-center mt-4">
                <div>
                    <h5 class="m-0 text-secondary">Total Acumulado: <strong class="text-success fs-4" id="total-acumulado">$0.00</strong></h5>
                </div>
                <div>
                    <button type="submit" class="btn btn-success me-2">Guardar Alquiler</button>
                    <button type="button" class="btn btn-secondary" id="btn-cancelar">Cancelar</button>
                </div>
            </div>
        </form>
    `;

    document.getElementById('btn-cancelar').addEventListener('click', closeFormCallback);
    document.getElementById('btn-agregar-detalle').addEventListener('click', agregarDetalleATabla);

    // Set default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    document.getElementById('fecha_alq').value = `${yyyy}-${mm}-${dd}`;

    await cargarSelects();

    const form = document.getElementById('alquiler-form');
    form.addEventListener('submit', guardarAlquilerTransaccional);
}

// --- CHARGE SELECT DROPDOWNS ---
async function cargarSelects() {
    try {
        const query = `
            query {
                Personas {
                    cedula_per
                    nombres_per
                    apellidos_per
                }
                Departamentos {
                    codigo_dpto
                    precio_dpto
                    estado_dpto
                    descripcion_dpto
                }
            }
        `;
        const data = await graphqlQuery(query);
        personasList = data.Personas;
        departmentsList = data.Departamentos;

        const selectPer = document.getElementById('cedula_per');
        selectPer.innerHTML = '<option value="" disabled selected>Seleccione un cliente...</option>';
        personasList.forEach(p => {
            selectPer.innerHTML += `<option value="${p.cedula_per}">${p.nombres_per} ${p.apellidos_per} (${p.cedula_per})</option>`;
        });

        const selectDpto = document.getElementById('codigo_dpto');
        selectDpto.innerHTML = '<option value="" disabled selected>Seleccione departamento...</option>';
        departmentsList.forEach(d => {
            if (d.estado_dpto.toLowerCase() === 'disponible') {
                selectDpto.innerHTML += `<option value="${d.codigo_dpto}" data-precio="${d.precio_dpto}">${d.codigo_dpto} - $${d.precio_dpto}/día (${d.descripcion_dpto})</option>`;
            }
        });

    } catch (err) {
        showError('Error al precargar catálogos: ' + err.message);
    }
}

// --- ADD DETAIL TO TRANSIENT GRID ---
function agregarDetalleATabla() {
    const selectDpto = document.getElementById('codigo_dpto');
    const dptoCod = selectDpto.value;
    const startStr = document.getElementById('fecha_inicio_det').value;
    const endStr = document.getElementById('fecha_fin_det').value;

    if (!dptoCod || !startStr || !endStr) {
        alert('Por favor complete el departamento, la fecha de inicio y la fecha de fin.');
        return;
    }

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (end < start) {
        alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
    }

    // Check duplicate
    if (currentDetails.some(d => d.codigo_dpto === dptoCod)) {
        alert('Este departamento ya está agregado en este alquiler.');
        return;
    }

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const opt = selectDpto.options[selectDpto.selectedIndex];
    const precio = parseFloat(opt.getAttribute('data-precio'));
    const subtotal = diffDays * precio;

    currentDetails.push({
        codigo_dpto: dptoCod,
        precio_det: precio,
        fecha_inicio_det: startStr,
        fecha_fin_det: endStr,
        subtotal
    });

    renderTempTable();

    // Clear fields
    selectDpto.selectedIndex = 0;
    document.getElementById('fecha_inicio_det').value = '';
    document.getElementById('fecha_fin_det').value = '';
}

// --- RENDER TRANSIENT GRID TABLE ---
function renderTempTable() {
    const tbody = document.getElementById('temp-details-table-body');
    const totalAcumLabel = document.getElementById('total-acumulado');
    if (!tbody) return;

    if (currentDetails.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-3">No se han agregado departamentos a esta transacción.</td></tr>';
        totalAcumLabel.textContent = '$0.00';
        return;
    }

    let total = 0;
    tbody.innerHTML = '';

    currentDetails.forEach((d, idx) => {
        total += d.subtotal;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${d.codigo_dpto}</strong></td>
            <td>$${d.precio_det.toFixed(2)}</td>
            <td>${formatDate(d.fecha_inicio_det)}</td>
            <td>${formatDate(d.fecha_fin_det)}</td>
            <td class="text-end fw-bold">$${d.subtotal.toFixed(2)}</td>
            <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-item" data-idx="${idx}">Eliminar</button>
            </td>
        `;

        tr.querySelector('.btn-eliminar-item').addEventListener('click', () => {
            currentDetails.splice(idx, 1);
            renderTempTable();
        });

        tbody.appendChild(tr);
    });

    totalAcumLabel.textContent = `$${total.toFixed(2)}`;
}

// --- MUTATION SUBMIT ACTION ---
async function guardarAlquilerTransaccional(e) {
    e.preventDefault();

    if (currentDetails.length === 0) {
        alert('Debe agregar al menos un departamento al detalle antes de guardar el alquiler.');
        return;
    }

    const variables = {
        alquiler: {
            cedula_per: document.getElementById('cedula_per').value,
            fecha_alq: document.getElementById('fecha_alq').value,
            detalles: currentDetails.map(d => ({
                codigo_dpto: d.codigo_dpto,
                precio_det: d.precio_det,
                fecha_inicio_det: d.fecha_inicio_det,
                fecha_fin_det: d.fecha_fin_det
            }))
        }
    };

    const query = `
        mutation CreateAlquiler($alquiler: inputAlquiler!) {
            createAlquiler(alquiler: $alquiler) {
                cod_alq
            }
        }
    `;

    try {
        await graphqlQuery(query, variables);
        closeFormCallback();
    } catch (err) {
        showError('Error al guardar alquiler: ' + err.message);
    }
}

// --- ERROR HELPER ---
function showError(msg) {
    const errDiv = document.getElementById('form-error');
    if (errDiv) {
        errDiv.textContent = msg;
        errDiv.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
