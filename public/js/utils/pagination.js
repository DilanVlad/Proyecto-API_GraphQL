/**
 * pagination.js — Motor de paginación reutilizable para todas las tablas.
 *
 * Uso:
 *   const paginator = createPaginator({
 *       items,           // array completo de datos
 *       pageSize: 8,     // filas por página
 *       tbodyId,         // ID del <tbody> a renderizar
 *       renderRow,       // función (item) => HTMLTableRowElement
 *       emptyHtml,       // html cuando no hay filas
 *       pagerContainerId // ID del div donde se inyecta la paginación
 *   });
 */

export function createPaginator({ items, pageSize = 8, tbodyId, renderRow, emptyHtml = '', pagerContainerId }) {
    let currentPage = 1;
    let currentSize = pageSize;
    const totalPages = () => Math.max(1, Math.ceil(items.length / currentSize));

    function renderPage() {
        const tbody = document.getElementById(tbodyId);
        const pagerDiv = document.getElementById(pagerContainerId);
        if (!tbody) return;

        tbody.innerHTML = '';

        if (!items || items.length === 0) {
            tbody.innerHTML = emptyHtml;
            if (pagerDiv) pagerDiv.innerHTML = '';
            return;
        }

        const start = (currentPage - 1) * currentSize;
        const pageItems = items.slice(start, start + currentSize);

        pageItems.forEach(item => {
            const row = renderRow(item);
            tbody.appendChild(row);
        });

        renderPager(pagerDiv);
    }

    function renderPager(pagerDiv) {
        if (!pagerDiv) return;
        const total = totalPages();

        if (total <= 1 && items.length <= currentSize && currentSize === 8) {
            // Si solo hay una página y pocos items, igual mostramos el footer limpio
            // pero si prefieres ocultarlo, descomenta esto:
            // pagerDiv.innerHTML = '';
            // return;
        }

        let pagerHtml = `
            <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
                <!-- Izquierda: Total -->
                <div class="text-xs font-semibold text-slate-500 w-1/3">
                    Total Registros: <span class="text-slate-800">${items.length}</span>
                </div>

                <!-- Centro: Paginador Flat -->
                <div class="flex items-center space-x-1 justify-center w-1/3">
                    <button id="pager-prev" class="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" ${currentPage === 1 ? 'disabled' : ''}>
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    </button>
        `;

        // Botones numéricos sin bordes, activo con fondo claro
        const range = getPageRange(currentPage, total);
        range.forEach(p => {
            if (p === '...') {
                pagerHtml += `<span class="h-7 px-1.5 flex items-center text-xs text-slate-400 font-medium">…</span>`;
            } else {
                const isActive = p === currentPage;
                pagerHtml += `<button class="pager-page h-7 min-w-[28px] px-2 flex items-center justify-center rounded text-xs font-bold transition-all ${
                    isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }" data-page="${p}">${p}</button>`;
            }
        });

        pagerHtml += `
                    <button id="pager-next" class="h-7 w-7 flex items-center justify-center text-slate-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" ${currentPage === total ? 'disabled' : ''}>
                        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                    </button>
                </div>

                <!-- Derecha: Selector de tamaño -->
                <div class="flex items-center justify-end space-x-2 text-xs font-semibold text-slate-500 w-1/3">
                    <span>Mostrar por página:</span>
                    <select id="pager-size" class="appearance-none bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer pr-3 relative">
                        <option value="5" ${currentSize === 5 ? 'selected' : ''}>5</option>
                        <option value="8" ${currentSize === 8 ? 'selected' : ''}>8</option>
                        <option value="15" ${currentSize === 15 ? 'selected' : ''}>15</option>
                        <option value="30" ${currentSize === 30 ? 'selected' : ''}>30</option>
                        <option value="50" ${currentSize === 50 ? 'selected' : ''}>50</option>
                    </select>
                    <svg class="h-3 w-3 text-slate-500 -ml-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /></svg>
                </div>
            </div>
        `;

        pagerDiv.innerHTML = pagerHtml;

        // Eventos
        const prevBtn = pagerDiv.querySelector('#pager-prev');
        const nextBtn = pagerDiv.querySelector('#pager-next');
        const sizeSelect = pagerDiv.querySelector('#pager-size');

        if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderPage(); } });
        if (nextBtn) nextBtn.addEventListener('click', () => { if (currentPage < total) { currentPage++; renderPage(); } });
        
        if (sizeSelect) sizeSelect.addEventListener('change', (e) => {
            currentSize = parseInt(e.target.value, 10);
            currentPage = 1; // Volver a la página 1 al cambiar el tamaño
            renderPage();
        });

        pagerDiv.querySelectorAll('.pager-page').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.dataset.page, 10);
                renderPage();
            });
        });
    }

    // Genera un rango de páginas con puntos suspensivos
    function getPageRange(current, total) {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const range = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
        const sorted = Array.from(range).sort((a, b) => a - b);
        const result = [];
        sorted.forEach((p, i) => {
            if (i > 0 && p - sorted[i - 1] > 1) result.push('...');
            result.push(p);
        });
        return result;
    }

    // Render inicial
    renderPage();

    return { goToPage: (p) => { currentPage = p; renderPage(); } };
}
