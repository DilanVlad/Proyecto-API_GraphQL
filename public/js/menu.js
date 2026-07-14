import { navigate } from './app.js';

// --- MENU GENERATOR ---
export function renderMenu(funciones) {
    const menuContainer = document.getElementById('menu-items');
    menuContainer.innerHTML = ''; 

    funciones.forEach(f => {
        const li = document.createElement('li');
        li.className = 'nav-item';

        const a = document.createElement('a');
        a.className = 'nav-link';
        a.href = '#';
        
        const viewName = f.ruta_fnc.replace('/', '').trim();
        a.setAttribute('data-view', viewName);
        a.textContent = f.nombre_fnc.charAt(0).toUpperCase() + f.nombre_fnc.slice(1);

        // --- EVENT BINDING ---
        a.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(viewName, f.nombre_fnc);
        });

        li.appendChild(a);
        menuContainer.appendChild(li);
    });
}
