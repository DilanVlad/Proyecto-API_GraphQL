import { hasPermission } from '../../app.js';

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

// --- RENDER PLACEHOLDER ---
export function showPlaceholder(detailPaneId = 'rental-detail-pane') {
    const detailPane = document.getElementById(detailPaneId);
    if (!detailPane) return;
    
    detailPane.innerHTML = `
        <div class="empty-state shadow-sm h-100 d-flex flex-column align-items-center justify-content-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" class="bi bi-journal-text text-secondary mb-3" viewBox="0 0 16 16">
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3z"/>
            </svg>
            <h5 class="text-secondary fw-bold">Detalle del Alquiler</h5>
            <p class="text-muted px-4 small">Selecciona un alquiler de la lista de la izquierda para ver su información detallada, o haz clic en "Nuevo Alquiler" para registrar una transacción.</p>
        </div>
    `;
}

// --- RENDER DETAIL VIEW ---
export function showDetail(rental, deleteAlquilerCallback, resetSelectionCallback, detailPaneId = 'rental-detail-pane') {
    const detailPane = document.getElementById(detailPaneId);
    if (!detailPane) return;

    let detRows = '';
    if (rental.detalles && rental.detalles.length > 0) {
        detRows = rental.detalles.map(d => `
            <tr>
                <td><strong>${d.codigo_dpto}</strong></td>
                <td>${d.departamento ? d.departamento.descripcion_dpto : 'Sin descripción'}</td>
                <td>${formatDate(d.fecha_inicio_det)}</td>
                <td>${formatDate(d.fecha_fin_det)}</td>
                <td class="text-end fw-bold">$${d.precio_det.toFixed(2)}</td>
            </tr>
        `).join('');
    } else {
        detRows = '<tr><td colspan="5" class="text-center text-muted py-3">Sin departamentos en este alquiler.</td></tr>';
    }

    const canDelete = hasPermission('eliminar', 'alquiler');

    detailPane.innerHTML = `
        <div class="card shadow-sm border-0 h-100 detail-card">
            <div class="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
                <h6 class="m-0 fw-bold">Detalle de Transacción: ${rental.cod_alq}</h6>
                <span class="badge ${rental.estado_alq.toLowerCase() === 'activo' ? 'bg-success' : 'bg-secondary'}">${rental.estado_alq}</span>
            </div>
            <div class="card-body p-4">
                <div class="row g-3 mb-4">
                    <div class="col-sm-6 border-end">
                        <span class="text-muted d-block text-uppercase small" style="font-size: 0.75rem;">Cliente</span>
                        <strong class="text-secondary d-block fs-6 mb-1">${rental.persona ? `${rental.persona.nombres_per} ${rental.persona.apellidos_per}` : 'N/A'}</strong>
                        <span class="text-muted small">Cédula: ${rental.cedula_per}</span>
                    </div>
                    <div class="col-sm-6 ps-md-4">
                        <span class="text-muted d-block text-uppercase small" style="font-size: 0.75rem;">Información del Registro</span>
                        <span class="text-secondary d-block mb-1"><strong>Fecha:</strong> ${formatDate(rental.fecha_alq)}</span>
                        <span class="text-secondary d-block small"><strong>Emisor:</strong> ${rental.usuario ? rental.usuario.username_usr : 'N/A'}</span>
                    </div>
                </div>

                <h6 class="text-secondary fw-bold border-bottom pb-2 mb-3">Departamentos Incluidos</h6>
                <div class="table-responsive mb-4">
                    <table class="table table-bordered table-hover table-sm align-middle mb-0" style="font-size: 0.85rem;">
                        <thead class="table-light">
                            <tr>
                                <th>Código Dpto</th>
                                <th>Descripción</th>
                                <th>Fecha Inicio</th>
                                <th>Fecha Fin</th>
                                <th class="text-end">Precio Diario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${detRows}
                        </tbody>
                    </table>
                </div>

                <div class="text-end border-top pt-3">
                    <span class="text-muted text-uppercase small d-block" style="font-size: 0.75rem;">Total de la Transacción</span>
                    <h3 class="text-success fw-bold m-0">$${rental.total_alq.toFixed(2)}</h3>
                </div>
            </div>
            <div class="card-footer bg-white py-3 text-end border-top">
                <button class="btn btn-outline-secondary btn-sm me-2" id="btn-close-detail">Cerrar Detalle</button>
                ${canDelete ? `<button class="btn btn-danger btn-sm" id="btn-delete-rental">Eliminar Alquiler</button>` : ''}
            </div>
        </div>
    `;

    document.getElementById('btn-close-detail').addEventListener('click', resetSelectionCallback);
    if (canDelete) {
        document.getElementById('btn-delete-rental').addEventListener('click', () => deleteAlquilerCallback(rental.cod_alq));
    }
}
