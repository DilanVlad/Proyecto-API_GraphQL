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

function generateCardHtml(a) {
    let subtableRows = a.detalles ? a.detalles.map(d => {
        const dateIni = parseDate(d.fecha_inicio_det);
        const dateFin = parseDate(d.fecha_fin_det);
        const diffTime = Math.abs(dateFin - dateIni);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const subtotal = diffDays * d.precio_det;
        return `
            <tr>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6;">${d.codigo_dpto}</td>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6;">$${d.precio_det.toFixed(2)}</td>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6;">${formatDate(d.fecha_inicio_det)}</td>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6;">${formatDate(d.fecha_fin_det)}</td>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6; text-align: center;">${diffDays}</td>
                <td style="padding: 6px 12px; border: 1px solid #dee2e6; text-align: right; font-weight: bold;">$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="6" style="padding: 8px; text-align: center;">Sin detalles</td></tr>';

    return `
        <div style="border: 1px solid #dee2e6; border-radius: 4px; margin-bottom: 20px; background-color: #fff; box-sizing: border-box; overflow: hidden; page-break-inside: avoid;">
            <div style="background-color: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #dee2e6; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <div style="color: #0d6efd; font-size: 0.9rem;">
                    Código Alquiler: ${a.cod_alq} <span style="font-weight: normal; color: #6c757d; font-size: 0.8rem; margin-left: 5px;">(${formatDate(a.fecha_alq)})</span>
                </div>
                <div style="color: #198754; font-size: 0.95rem;">$${a.total_alq.toFixed(2)}</div>
            </div>
            <div style="padding: 10px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
                    <thead>
                        <tr style="background-color: #e9ecef; border-bottom: 1px solid #dee2e6; font-weight: bold;">
                            <th style="padding: 6px 12px;">Dpto</th>
                            <th style="padding: 6px 12px;">Precio/Día</th>
                            <th style="padding: 6px 12px;">Inicio</th>
                            <th style="padding: 6px 12px;">Fin</th>
                            <th style="padding: 6px 12px; text-align: center;">Días</th>
                            <th style="padding: 6px 12px; text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${subtableRows}
                    </tbody>
                </table>
            </div>
            <div style="background-color: #fff; padding: 6px 15px; border-top: 1px dashed #dee2e6; text-align: right;">
                <small style="color: #6c757d; font-size: 0.75rem;">Registrado por: ${a.usuario ? a.usuario.username_usr : 'N/A'}</small>
            </div>
        </div>
    `;
}

/**
 * Genera e imprime el reporte general completo.
 */
export function printGeneralPDF(totalIngresos, totalAlquileres, totalDptos, totalClientes, clientsList, allRentals) {
    const genTemplate = document.getElementById('general-print-template');
    if (!genTemplate) return;

    let generalTableRows = clientsList.map(c => `
        <tr>
            <td style="padding: 8px 12px; border: 1px solid #dee2e6;"><strong>${c.persona.cedula_per}</strong></td>
            <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${c.persona.nombres_per} ${c.persona.apellidos_per}</td>
            <td style="padding: 8px 12px; border: 1px solid #dee2e6; text-align: center;">${c.alquileres.length}</td>
            <td style="padding: 8px 12px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; color: #198754;">$${c.totalSpent.toFixed(2)}</td>
        </tr>
    `).join('');

    // Group rentals by client
    let detailSectionHtml = clientsList.map(c => {
        let cardsHtml = c.alquileres.map(a => generateCardHtml(a)).join('');
        return `
            <div style="margin-top: 25px; page-break-inside: avoid;">
                <h5 style="color: #495057; border-bottom: 2px solid #6c757d; padding-bottom: 5px; margin-bottom: 15px;">
                    Cliente: <strong>${c.persona.nombres_per} ${c.persona.apellidos_per}</strong> (${c.persona.cedula_per})
                </h5>
                ${cardsHtml}
            </div>
        `;
    }).join('');

    genTemplate.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; background-color: #fff;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #212529; text-transform: uppercase;">Reporte General Consolidado de Alquileres</h3>
                <small style="color: #6c757d;">Fecha de Generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</small>
            </div>
            
            <!-- KPI CARDS -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 25px; text-align: center; gap: 10px;">
                <div style="flex: 1; padding: 10px; border: 1px solid #dee2e6; background-color: #f8f9fa; border-radius: 4px;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">Ingresos Totales</span>
                    <strong style="font-size: 1.25rem; color: #198754;">$${totalIngresos.toFixed(2)}</strong>
                </div>
                <div style="flex: 1; padding: 10px; border: 1px solid #dee2e6; background-color: #f8f9fa; border-radius: 4px;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">Alquileres Totales</span>
                    <strong style="font-size: 1.25rem; color: #0d6efd;">${totalAlquileres}</strong>
                </div>
                <div style="flex: 1; padding: 10px; border: 1px solid #dee2e6; background-color: #f8f9fa; border-radius: 4px;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">Dptos. Reservados</span>
                    <strong style="font-size: 1.25rem; color: #ffc107;">${totalDptos}</strong>
                </div>
                <div style="flex: 1; padding: 10px; border: 1px solid #dee2e6; background-color: #f8f9fa; border-radius: 4px;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">Clientes Activos</span>
                    <strong style="font-size: 1.25rem; color: #0dcaf0;">${totalClientes}</strong>
                </div>
            </div>
            
            <h4 style="border-bottom: 1.5px solid #dee2e6; padding-bottom: 5px; color: #212529; font-size: 1.1rem; margin-bottom: 10px;">Resumen de Facturación por Cliente</h4>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 0.85rem; border: 1px solid #dee2e6;">
                <thead>
                    <tr style="background-color: #e9ecef; text-align: left; font-weight: bold; border-bottom: 1px solid #dee2e6;">
                        <th style="padding: 8px 12px; border: 1px solid #dee2e6;">Cédula</th>
                        <th style="padding: 8px 12px; border: 1px solid #dee2e6;">Nombres y Apellidos</th>
                        <th style="padding: 8px 12px; border: 1px solid #dee2e6; text-align: center;">Cant. Alquileres</th>
                        <th style="padding: 8px 12px; border: 1px solid #dee2e6; text-align: right;">Total Facturado</th>
                    </tr>
                </thead>
                <tbody>
                    ${generalTableRows}
                </tbody>
            </table>

            <h4 style="border-bottom: 1.5px solid #dee2e6; padding-bottom: 5px; color: #212529; font-size: 1.1rem; margin-bottom: 10px; margin-top: 20px;">Historial General de Transacciones por Cliente</h4>
            ${detailSectionHtml}
        </div>
    `;

    document.body.classList.add('print-general-mode');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('print-general-mode');
    }, 500);
}

/**
 * Genera e imprime la ficha individual del cliente con formato de factura / estado de cuenta.
 */
export function printIndividualPDF(client) {
    const indTemplate = document.getElementById('individual-print-template');
    if (!indTemplate) return;

    const cardsHtml = client.alquileres.map(a => generateCardHtml(a)).join('');

    indTemplate.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; background-color: #fff;">
            <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #212529; text-transform: uppercase; letter-spacing: 1px;">ESTADO DE CUENTA E HISTORIAL</h3>
                <h5 style="margin: 5px 0 0 0; color: #6c757d; font-weight: normal;">Ficha Histórica del Cliente</h5>
                <small style="color: #6c757d; display: block; margin-top: 5px;">Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</small>
            </div>

            <!-- CLIENT BOX -->
            <div style="display: flex; justify-content: space-between; border: 1px solid #dee2e6; border-radius: 4px; padding: 15px; background-color: #f8f9fa; margin-bottom: 25px; font-size: 0.85rem; gap: 20px; box-sizing: border-box;">
                <div style="flex: 1;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">DATOS DEL CLIENTE</span>
                    <strong style="font-size: 1.05rem; display: block; margin-bottom: 5px; color: #212529;">${client.persona.nombres_per} ${client.persona.apellidos_per}</strong>
                    <span style="color: #495057;">C.I. / RUC: <strong>${client.persona.cedula_per}</strong></span><br>
                    ${client.persona.telefono_per ? `<span style="color: #495057;">Teléfono: ${client.persona.telefono_per}</span><br>` : ''}
                    ${client.persona.direccion_per ? `<span style="color: #495057;">Dirección: ${client.persona.direccion_per}</span>` : ''}
                </div>
                <div style="flex: 1; border-left: 2px solid #dee2e6; padding-left: 20px;">
                    <span style="font-size: 0.7rem; text-transform: uppercase; color: #6c757d; display: block; font-weight: bold; margin-bottom: 5px;">RESUMEN DE FACTURACIÓN</span>
                    <span style="color: #495057; display: block; margin-bottom: 3px;">Cant. Alquileres: <strong>${client.alquileres.length}</strong></span>
                    <span style="font-size: 0.95rem; color: #495057; display: block;">Monto Total Facturado: <strong style="color: #198754;">$${client.totalSpent.toFixed(2)}</strong></span>
                </div>
            </div>

            <!-- DETAILED CARDS -->
            <h4 style="border-bottom: 1.5px solid #dee2e6; padding-bottom: 5px; color: #212529; font-size: 1.1rem; margin-bottom: 15px;">Alquileres Registrados</h4>
            ${cardsHtml}
        </div>
    `;

    document.body.classList.add('print-individual-mode');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('print-individual-mode');
    }, 500);
}
