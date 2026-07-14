import { graphqlQuery } from '../../api.js';
import { hasPermission } from '../../app.js';
import { showPlaceholder, showDetail } from './detail.js';
import { showForm } from './form.js';

let viewContainer = null;
let rentalsList = [];
let selectedRentalCod = null;

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

// --- RENDER MAIN LAYOUT ---
export async function renderAlquileres(container) {
    viewContainer = container;
    selectedRentalCod = null;
    rentalsList = [];

    const canCreate = hasPermission('crear', 'alquiler');

    viewContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4 class="m-0 text-secondary">Gestión de Alquileres (Maestro-Detalle)</h4>
            ${canCreate ? '<button class="btn btn-primary" id="btn-nuevo-alquiler">Nuevo Alquiler</button>' : ''}
        </div>

        <div id="alquileres-alert" class="alert alert-danger d-none" role="alert"></div>

        <!-- SPLIT GRID (DOUBLE COLUMN) -->
        <div class="row g-4">
            <!-- Left Column: Master Rental List with Search -->
            <div class="col-lg-5 col-md-6">
                <div class="card border-0 shadow-sm bg-white p-3">
                    <div class="mb-3">
                        <input type="text" class="form-control" id="rental-search" placeholder="Buscar por cliente o código...">
                    </div>
                    <div class="master-list-container">
                        <div class="list-group list-group-flush" id="rentals-master-list">
                            <!-- Alquileres listados aquí -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Detail Pane Card -->
            <div class="col-lg-7 col-md-6" id="rental-detail-pane">
                <!-- Cargado dinámicamente -->
            </div>
        </div>
    `;

    if (canCreate) {
        document.getElementById('btn-nuevo-alquiler').addEventListener('click', () => {
            showForm(viewContainer, () => renderAlquileres(viewContainer));
        });
    }

    document.getElementById('rental-search').addEventListener('input', (e) => {
        filterAndRenderMasterList(e.target.value.trim());
    });

    await loadAlquileresData();
}

// --- LOAD DATA ---
async function loadAlquileresData() {
    try {
        const query = `
            query {
                Alquileres {
                    cod_alq
                    fecha_alq
                    total_alq
                    estado_alq
                    cedula_per
                    persona {
                        nombres_per
                        apellidos_per
                    }
                    usuario {
                        username_usr
                    }
                    detalles {
                        codigo_dpto
                        precio_det
                        fecha_inicio_det
                        fecha_fin_det
                        departamento {
                            descripcion_dpto
                        }
                    }
                }
            }
        `;
        const data = await graphqlQuery(query);
        rentalsList = data.Alquileres;

        filterAndRenderMasterList('');
        showPlaceholder();

    } catch (err) {
        const alert = document.getElementById('alquileres-alert');
        alert.textContent = 'Error al cargar alquileres: ' + err.message;
        alert.classList.remove('d-none');
    }
}

// --- FILTER & RENDER MASTER LIST (LEFT COLUMN) ---
function filterAndRenderMasterList(searchVal = '') {
    const listGroup = document.getElementById('rentals-master-list');
    if (!listGroup) return;

    listGroup.innerHTML = '';
    const queryLower = searchVal.toLowerCase();

    const filtered = rentalsList.filter(r => {
        if (!queryLower) return true;
        const codeMatch = r.cod_alq.toLowerCase().includes(queryLower);
        const nameMatch = r.persona ? `${r.persona.nombres_per} ${r.persona.apellidos_per}`.toLowerCase().includes(queryLower) : false;
        return codeMatch || nameMatch;
    });

    if (filtered.length === 0) {
        listGroup.innerHTML = '<div class="text-center text-muted py-4 small">No se encontraron alquileres.</div>';
        return;
    }

    filtered.forEach(r => {
        const a = document.createElement('a');
        a.href = '#';
        a.className = `list-group-item list-group-item-action master-item border-0 mb-2 rounded-2 ${r.cod_alq === selectedRentalCod ? 'active' : ''}`;
        
        a.innerHTML = `
            <div class="d-flex w-100 justify-content-between align-items-center">
                <h6 class="mb-1 text-primary fw-bold">${r.cod_alq}</h6>
                <span class="fw-bold text-success">$${r.total_alq.toFixed(2)}</span>
            </div>
            <p class="mb-1 text-secondary small">
                <strong>Cliente:</strong> ${r.persona ? `${r.persona.nombres_per} ${r.persona.apellidos_per}` : 'N/A'}
            </p>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <small class="text-muted text-uppercase" style="font-size: 0.65rem;">${formatDate(r.fecha_alq)}</small>
                <span class="badge ${r.estado_alq.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'}" style="font-size: 0.65rem;">
                    ${r.estado_alq}
                </span>
            </div>
        `;

        a.addEventListener('click', (e) => {
            e.preventDefault();
            selectedRentalCod = r.cod_alq;
            // Refresh selection highlighting
            filterAndRenderMasterList(document.getElementById('rental-search').value.trim());
            
            showDetail(
                r,
                deleteAlquiler,
                () => {
                    selectedRentalCod = null;
                    filterAndRenderMasterList(document.getElementById('rental-search').value.trim());
                    showPlaceholder();
                }
            );
        });

        listGroup.appendChild(a);
    });
}

// --- DELETE ACTION ---
async function deleteAlquiler(cod_alq) {
    if (confirm(`¿Estás seguro de que deseas eliminar la transacción de alquiler ${cod_alq}?`)) {
        try {
            const query = `
                mutation DeleteAlquiler($cod_alq: String!) {
                    deleteAlquiler(cod_alq: $cod_alq) {
                        cod_alq
                    }
                }
            `;
            await graphqlQuery(query, { cod_alq });
            await renderAlquileres(viewContainer);
        } catch (err) {
            alert('No se pudo eliminar el alquiler seleccionado: ' + err.message);
        }
    }
}
