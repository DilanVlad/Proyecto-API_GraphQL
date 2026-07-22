import { navigate } from './app.js';

// --- MENU ICONS MAPPING ---
const ICONS = {
    persona: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0 1 8.625 21c-2.3 0-4.463-.687-6.25-1.87v-.113a4.125 4.125 0 0 1 7.533-2.493c.501.91.786 1.957.786 3.07v.003m-2.91-17.135a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.778-7.778Z" /></svg>`,
    departamento: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12v18H3V3Z" /></svg>`,
    alquiler: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-.999.43-1.563A6 6 0 1 1 21.75 8.25Z" /></svg>`,
    usuario: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>`,
    permiso: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg>`,
    reporte: `<svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v16.5c0 .621.504 1.125 1.125 1.125H21m-18-3a9 9 0 0 1 18 0v-16.5M7.5 12h9m-9 3h9M7.5 9h9" /></svg>`
};

function getIcon(viewName) {
    const key = Object.keys(ICONS).find(k => viewName.toLowerCase().includes(k));
    return ICONS[key || 'reporte']; 
}

// --- MENU GENERATOR ---
export function renderMenu(funciones) {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;
    menuContainer.innerHTML = ''; 

    if (!Array.isArray(funciones)) return;

    funciones.forEach(f => {
        if (!f) return;
        const li = document.createElement('li');

        const a = document.createElement('a');
        a.className = 'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group hover:bg-slate-800 hover:text-white text-slate-400 nav-link';
        a.href = '#';
        
        const route = f.ruta_fnc || '';
        const viewName = route.replace('/', '').trim();
        a.setAttribute('data-view', viewName.toLowerCase().trim());
        
        const iconSvg = getIcon(viewName);
        const nombre = f.nombre_fnc || viewName || 'Módulo';
        const formattedNombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

        a.innerHTML = `
            ${iconSvg}
            <span>${formattedNombre}</span>
        `;

        // --- EVENT BINDING ---
        a.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(viewName, formattedNombre);
        });

        li.appendChild(a);
        menuContainer.appendChild(li);
    });
}
