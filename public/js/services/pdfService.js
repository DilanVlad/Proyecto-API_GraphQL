import { parseDate, formatDate } from '../utils/dateUtils.js';


function generateCardHtml(a) {
    let subtableRows = a.detalles ? a.detalles.map(d => {
        const dateIni = parseDate(d.fecha_inicio_det);
        const dateFin = parseDate(d.fecha_fin_det);
        const diffTime = Math.abs(dateFin - dateIni);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        const subtotal = diffDays * d.precio_det;
        return `
            <tr>
                <td style="padding: 4px 8px; border: 1px solid #000;">${d.codigo_dpto}</td>
                <td style="padding: 4px 8px; border: 1px solid #000;">$${d.precio_det.toFixed(2)}</td>
                <td style="padding: 4px 8px; border: 1px solid #000;">${formatDate(d.fecha_inicio_det)}</td>
                <td style="padding: 4px 8px; border: 1px solid #000;">${formatDate(d.fecha_fin_det)}</td>
                <td style="padding: 4px 8px; border: 1px solid #000; text-align: center;">${diffDays}</td>
                <td style="padding: 4px 8px; border: 1px solid #000; text-align: right;">$${subtotal.toFixed(2)}</td>
            </tr>
        `;
    }).join('') : '<tr><td colspan="6" style="padding: 4px 8px; border: 1px solid #000; text-align: center;">Sin detalles</td></tr>';

    return `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <div style="padding: 4px 0; display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                <div>
                    Código Alquiler: ${a.cod_alq} <span style="font-weight: normal; margin-left: 5px;">(${formatDate(a.fecha_alq)})</span>
                </div>
                <div>Total: $${a.total_alq.toFixed(2)}</div>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 10pt; text-align: left; margin-bottom: 4px;">
                <thead>
                    <tr>
                        <th style="padding: 4px 8px; border: 1px solid #000;">Dpto</th>
                        <th style="padding: 4px 8px; border: 1px solid #000;">Precio/Día</th>
                        <th style="padding: 4px 8px; border: 1px solid #000;">Inicio</th>
                        <th style="padding: 4px 8px; border: 1px solid #000;">Fin</th>
                        <th style="padding: 4px 8px; border: 1px solid #000; text-align: center;">Días</th>
                        <th style="padding: 4px 8px; border: 1px solid #000; text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${subtableRows}
                </tbody>
            </table>
            <div style="text-align: right;">
                <span style="font-size: 9pt;">Registrado por: ${a.usuario ? a.usuario.username_usr : 'N/A'}</span>
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
            <td style="padding: 6px 8px; border: 1px solid #000;">${c.persona.cedula_per}</td>
            <td style="padding: 6px 8px; border: 1px solid #000;">${c.persona.nombres_per} ${c.persona.apellidos_per}</td>
            <td style="padding: 6px 8px; border: 1px solid #000; text-align: center;">${c.alquileres.length}</td>
            <td style="padding: 6px 8px; border: 1px solid #000; text-align: right;">$${c.totalSpent.toFixed(2)}</td>
        </tr>
    `).join('');

    // Group rentals by client
    let detailSectionHtml = clientsList.map(c => {
        let cardsHtml = c.alquileres.map(a => generateCardHtml(a)).join('');
        return `
            <div style="margin-top: 20px; page-break-inside: avoid;">
                <div style="border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 10px;">
                    <strong>Cliente:</strong> ${c.persona.nombres_per} ${c.persona.apellidos_per} (${c.persona.cedula_per})
                </div>
                ${cardsHtml}
            </div>
        `;
    }).join('');

    genTemplate.innerHTML = `
        <div style="font-family: Arial, sans-serif; font-size: 11pt; padding: 15px; color: #000; background-color: #fff;">
            <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 14pt;">REPORTE GENERAL CONSOLIDADO DE ALQUILERES</h3>
                <div style="margin-top: 5px;">Fecha de Generación: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            </div>
            
            <!-- KPI CARDS AS SIMPLE TEXT -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #000; padding: 10px;">
                <div><strong>Ingresos Totales:</strong> $${totalIngresos.toFixed(2)}</div>
                <div><strong>Alquileres Totales:</strong> ${totalAlquileres}</div>
                <div><strong>Dptos. Reservados:</strong> ${totalDptos}</div>
                <div><strong>Clientes Activos:</strong> ${totalClientes}</div>
            </div>
            
            <div style="font-weight: bold; margin-bottom: 8px;">Resumen de Facturación por Cliente</div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 10pt;">
                <thead>
                    <tr>
                        <th style="padding: 6px 8px; border: 1px solid #000; text-align: left;">Cédula</th>
                        <th style="padding: 6px 8px; border: 1px solid #000; text-align: left;">Nombres y Apellidos</th>
                        <th style="padding: 6px 8px; border: 1px solid #000; text-align: center;">Cant. Alquileres</th>
                        <th style="padding: 6px 8px; border: 1px solid #000; text-align: right;">Total Facturado</th>
                    </tr>
                </thead>
                <tbody>
                    ${generalTableRows}
                </tbody>
            </table>

            <div style="font-weight: bold; margin-bottom: 10px;">Historial General de Transacciones por Cliente</div>
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
        <div style="font-family: Arial, sans-serif; font-size: 11pt; padding: 15px; color: #000; background-color: #fff;">
            <div style="text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 20px;">
                <h3 style="margin: 0; font-size: 14pt;">ESTADO DE CUENTA E HISTORIAL</h3>
                <h5 style="margin: 5px 0 0 0; font-weight: normal;">Ficha Histórica del Cliente</h5>
                <div style="margin-top: 5px;">Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
            </div>

            <!-- CLIENT BOX -->
            <div style="display: flex; justify-content: space-between; border: 1px solid #000; padding: 10px; margin-bottom: 20px;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; margin-bottom: 5px; text-decoration: underline;">DATOS DEL CLIENTE</div>
                    <div><strong>${client.persona.nombres_per} ${client.persona.apellidos_per}</strong></div>
                    <div>C.I. / RUC: <strong>${client.persona.cedula_per}</strong></div>
                    ${client.persona.telefono_per ? `<div>Teléfono: ${client.persona.telefono_per}</div>` : ''}
                    ${client.persona.direccion_per ? `<div>Dirección: ${client.persona.direccion_per}</div>` : ''}
                </div>
                <div style="flex: 1; border-left: 1px solid #000; padding-left: 15px;">
                    <div style="font-weight: bold; margin-bottom: 5px; text-decoration: underline;">RESUMEN DE FACTURACIÓN</div>
                    <div>Cant. Alquileres: <strong>${client.alquileres.length}</strong></div>
                    <div style="font-size: 12pt; margin-top: 5px;">Monto Total Facturado: <strong>$${client.totalSpent.toFixed(2)}</strong></div>
                </div>
            </div>

            <!-- DETAILED CARDS -->
            <div style="font-weight: bold; margin-bottom: 10px;">Alquileres Registrados</div>
            ${cardsHtml}
        </div>
    `;

    document.body.classList.add('print-individual-mode');
    window.print();
    setTimeout(() => {
        document.body.classList.remove('print-individual-mode');
    }, 500);
}
