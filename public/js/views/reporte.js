import { graphqlQuery } from '../api.js';
import { printGeneralPDF, printIndividualPDF } from '../services/pdfService.js';

let clientsList = [];
let selectedClientCed = null;

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

// --- REPORT RENDER ---
export async function renderReporte(container) {
    selectedClientCed = null;
    clientsList = [];

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="m-0 text-secondary">Reporte Consolidado por Cliente</h4>
            <button class="btn btn-outline-danger btn-sm d-flex align-items-center gap-2" id="btn-print-pdf">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.22-.459.406-.116.157-.218.347-.223.579-.004.19.088.355.259.402.166.05.324-.047.4-.12.186-.19.366-.548.437-.944a3.095 3.095 0 0 0-.215-.323zm1.63-3.033c.12-.211.24-.444.302-.68.1-.38.1-.643.08-.758-.007-.05-.013-.105-.027-.142-.03-.096-.12-.139-.219-.123a.309.309 0 0 0-.17.072c-.127.1-.18.257-.18.515 0 .22.04.489.15.758.06.136.125.263.166.358zm1.002 1.629c.18-.19.3-.393.356-.583a17.279 17.279 0 0 1-.413-1.127 12.39 12.39 0 0 1-.302 1.285c.115.155.234.294.359.425zm1.564-.001c-.176 0-.377.06-.596.171.18.21.365.412.56.58.12.09.28.163.42.163a.302.302 0 0 0 .261-.115c.062-.075.09-.158.07-.244a.43.43 0 0 0-.17-.267c-.156-.11-.35-.292-.545-.292z"/>
                </svg>
                PDF General
            </button>
        </div>

        <!-- KPI METRIC CARDS -->
        <div class="row g-3 mb-4">
            <div class="col-3">
                <div class="card border-0 shadow-sm bg-white h-100 p-3">
                    <div class="text-muted small text-uppercase">Ingresos Totales</div>
                    <div class="fs-3 fw-bold text-success mt-1" id="kpi-ingresos">$0.00</div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 shadow-sm bg-white h-100 p-3">
                    <div class="text-muted small text-uppercase">Alquileres Totales</div>
                    <div class="fs-3 fw-bold text-primary mt-1" id="kpi-transacciones">0</div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 shadow-sm bg-white h-100 p-3">
                    <div class="text-muted small text-uppercase">Dptos. Reservados</div>
                    <div class="fs-3 fw-bold text-warning mt-1" id="kpi-departamentos">0</div>
                </div>
            </div>
            <div class="col-3">
                <div class="card border-0 shadow-sm bg-white h-100 p-3">
                    <div class="text-muted small text-uppercase">Clientes Activos</div>
                    <div class="fs-3 fw-bold text-info mt-1" id="kpi-clientes">0</div>
                </div>
            </div>
        </div>

        <div id="reporte-alert" class="alert alert-danger d-none" role="alert"></div>

        <!-- SPLIT VIEW LAYOUT -->
        <div class="row g-4">
            <!-- Left Column: Master list of clients -->
            <div class="col-lg-5 col-md-6">
                <div class="card border-0 shadow-sm bg-white p-3">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-dark">
                                <tr>
                                    <th>Cédula / Cliente</th>
                                    <th class="text-end">Monto Total</th>
                                </tr>
                            </thead>
                            <tbody id="reporte-clients-body">
                                <!-- Cargados dinámicamente -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-lg-7 col-md-6" id="reporte-detail-pane">
                <!-- Placeholder inicial -->
            </div>
        </div>
    `;

    try {
        const query = `
            query {
                Alquileres {
                    cod_alq
                    fecha_alq
                    total_alq
                    estado_alq
                    usuario {
                        username_usr
                    }
                    persona {
                        cedula_per
                        nombres_per
                        apellidos_per
                    }
                    detalles {
                        codigo_dpto
                        precio_det
                        fecha_inicio_det
                        fecha_fin_det
                    }
                }
            }
        `;
        const data = await graphqlQuery(query);

        if (data.Alquileres.length === 0) {
            document.getElementById('reporte-clients-body').innerHTML = '<tr><td colspan="2" class="text-center text-muted">No se registran alquileres para el reporte.</td></tr>';
            showPlaceholder();
            return;
        }

        // --- KPI CALCULATIONS ---
        let totalIngresos = 0;
        let totalDptosReservados = 0;
        const clientsMap = {};

        data.Alquileres.forEach(a => {
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

        // --- UPDATE KPI DISPLAY ---
        document.getElementById('kpi-ingresos').textContent = `$${totalIngresos.toFixed(2)}`;
        document.getElementById('kpi-transacciones').textContent = data.Alquileres.length;
        document.getElementById('kpi-departamentos').textContent = totalDptosReservados;
        document.getElementById('kpi-clientes').textContent = clientsList.length;

        // --- BIND GENERAL PDF PRINT FROM SERVICE ---
        document.getElementById('btn-print-pdf').onclick = () => {
            printGeneralPDF(
                totalIngresos,
                data.Alquileres.length,
                totalDptosReservados,
                clientsList.length,
                clientsList,
                data.Alquileres
            );
        };

        renderClientsList();
        showPlaceholder();

    } catch (err) {
        const alert = document.getElementById('reporte-alert');
        alert.textContent = 'Error al generar el reporte: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- RENDER CLIENTS LIST (LEFT COLUMN) ---
function renderClientsList() {
    const tbody = document.getElementById('reporte-clients-body');
    if (!tbody) return;

    tbody.innerHTML = '';
    clientsList.forEach(c => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        const isSelected = c.persona.cedula_per === selectedClientCed;
        if (isSelected) {
            tr.className = 'table-active fw-bold';
        }

        tr.innerHTML = `
            <td>
                <div class="fw-bold text-primary">${c.persona.nombres_per} ${c.persona.apellidos_per}</div>
                <small class="text-muted">C.I. ${c.persona.cedula_per} • ${c.alquileres.length} alquiler(es)</small>
            </td>
            <td class="text-end fw-bold text-success align-middle">$${c.totalSpent.toFixed(2)}</td>
        `;

        tr.addEventListener('click', () => {
            selectedClientCed = c.persona.cedula_per;
            renderClientsList();
            showClientDetail(c);
        });

        tbody.appendChild(tr);
    });
}

// --- RENDER DETAIL PANE PLACEHOLDER (RIGHT COLUMN) ---
function showPlaceholder() {
    const pane = document.getElementById('reporte-detail-pane');
    if (!pane) return;

    pane.innerHTML = `
        <div class="card border-0 shadow-sm bg-white h-100 d-flex flex-column align-items-center justify-content-center py-5 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-people text-secondary mb-3" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724C2.307 10.582 3.282 10 5 10c.059 0 .118.001.176.003L4.92 10ZM1.5 5.5a2 2 0 1 1 3.36 1.465.5.5 0 1 0-.696.719A3 3 0 1 0 3 3.069a.5.5 0 0 0 .5.5H4a.5.5 0 0 0 .5-.5c0-.18-.035-.357-.101-.523Z"/>
            </svg>
            <h5 class="text-secondary fw-bold">Reporte Consolidado del Cliente</h5>
            <p class="text-muted px-4 small mb-0">Selecciona un cliente de la lista de la izquierda para ver su historial completo de alquileres y el desglose de departamentos.</p>
        </div>
    `;
}

// --- RENDER SELECTED CLIENT DETAIL (RIGHT COLUMN) ---
function showClientDetail(client) {
    const pane = document.getElementById('reporte-detail-pane');
    if (!pane) return;

    const alquileresCardsHtml = client.alquileres.map(a => {
        let subtableRows = '<tr><td colspan="5" class="text-center text-muted">Sin detalles en este alquiler.</td></tr>';
        if (a.detalles && a.detalles.length > 0) {
            subtableRows = a.detalles.map(d => {
                const dateIni = parseDate(d.fecha_inicio_det);
                const dateFin = parseDate(d.fecha_fin_det);
                const diffTime = Math.abs(dateFin - dateIni);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                const subtotal = diffDays * d.precio_det;

                return `
                    <tr>
                        <td><strong>${d.codigo_dpto}</strong></td>
                        <td>$${d.precio_det.toFixed(2)}</td>
                        <td>${formatDate(d.fecha_inicio_det)}</td>
                        <td>${formatDate(d.fecha_fin_det)}</td>
                        <td class="fw-bold text-end">$${subtotal.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');
        }

        return `
            <div class="card border border-light shadow-sm mb-3 bg-white">
                <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center">
                    <div>
                        <span class="fw-bold text-primary">Cod. Alquiler: ${a.cod_alq}</span>
                        <span class="text-muted small ms-2">(${formatDate(a.fecha_alq)})</span>
                    </div>
                    <span class="badge bg-success font-monospace">$${a.total_alq.toFixed(2)}</span>
                </div>
                <div class="card-body p-0">
                    <table class="table table-sm table-striped table-hover m-0" style="font-size: 0.85rem;">
                        <thead>
                            <tr>
                                <th>Depto</th>
                                <th>Precio/Día</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th class="text-end">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subtableRows}
                        </tbody>
                    </table>
                </div>
                <div class="card-footer bg-white py-1 text-end">
                    <small class="text-muted small">Registrado por: ${a.usuario ? a.usuario.username_usr : 'N/A'}</small>
                </div>
            </div>
        `;
    }).join('');

    pane.innerHTML = `
        <div class="card border-0 shadow-sm bg-white h-100">
            <div class="card-header bg-dark text-white py-3">
                <h6 class="m-0 fw-bold">Historial Consolidad: ${client.persona.nombres_per} ${client.persona.apellidos_per}</h6>
            </div>
            
            <div class="card-body p-4" style="max-height: 60vh; overflow-y: auto;">
                <div class="row g-3 mb-4 border-bottom pb-3">
                    <div class="col-sm-6 border-end">
                        <span class="text-muted text-uppercase small d-block" style="font-size: 0.7rem;">Datos Cliente</span>
                        <span class="fw-bold d-block text-secondary">C.I. ${client.persona.cedula_per}</span>
                    </div>
                    <div class="col-sm-6 ps-md-4">
                        <span class="text-muted text-uppercase small d-block" style="font-size: 0.7rem;">Resumen Financiero</span>
                        <span class="text-secondary d-block"><strong>Alquileres:</strong> ${client.alquileres.length}</span>
                        <span class="text-success fw-bold d-block"><strong>Monto Total:</strong> $${client.totalSpent.toFixed(2)}</span>
                    </div>
                </div>

                <h6 class="text-secondary fw-bold mb-3">Transacciones Registradas</h6>
                ${alquileresCardsHtml}
            </div>
            
            <div class="card-footer bg-light py-3 text-end border-top">
                <button class="btn btn-outline-danger btn-sm me-2 d-inline-flex align-items-center gap-2" id="btn-print-individual">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                        <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                        <path d="M4.603 12.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.22-.459.406-.116.157-.218.347-.223.579-.004.19.088.355.259.402.166.05.324-.047.4-.12.186-.19.366-.548.437-.944a3.095 3.095 0 0 0-.215-.323zm1.63-3.033c.12-.211.24-.444.302-.68.1-.38.1-.643.08-.758-.007-.05-.013-.105-.027-.142-.03-.096-.12-.139-.219-.123a.309.309 0 0 0-.17.072c-.127.1-.18.257-.18.515 0 .22.04.489.15.758.06.136.125.263.166.358zm1.002 1.629c.18-.19.3-.393.356-.583a17.279 17.279 0 0 1-.413-1.127 12.39 12.39 0 0 1-.302 1.285c.115.155.234.294.359.425zm1.564-.001c-.176 0-.377.06-.596.171.18.21.365.412.56.58.12.09.28.163.42.163a.302.302 0 0 0 .261-.115c.062-.075.09-.158.07-.244a.43.43 0 0 0-.17-.267c-.156-.11-.35-.292-.545-.292z"/>
                    </svg>
                    PDF Ficha
                </button>
                <button class="btn btn-outline-secondary btn-sm" id="btn-cerrar-ficha">Cerrar Historial</button>
            </div>
        </div>
    `;

    document.getElementById('btn-print-individual').addEventListener('click', () => {
        printIndividualPDF(client);
    });

    document.getElementById('btn-cerrar-ficha').addEventListener('click', () => {
        selectedClientCed = null;
        renderClientsList();
        showPlaceholder();
    });
}
