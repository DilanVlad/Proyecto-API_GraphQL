import { renderLogin } from './views/login.js';
import { renderPersonas } from './views/personas/index.js';
import { renderDepartamentos } from './views/departamentos/index.js';
import { renderAlquileres } from './views/alquileres/index.js';
import { renderReporte } from './views/reporte.js';
import { renderUsuarios } from './views/usuarios.js';
import { renderPermisos } from './views/permisos.js';
import { renderMenu } from './menu.js';

// --- STATE & DOM ---
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const appContent = document.getElementById('app-content');
const viewTitle = document.getElementById('view-title');
const userDisplay = document.getElementById('user-display');
const btnLogout = document.getElementById('btn-logout');

let currentUser = null;

// --- SESSION MANAGEMENT ---
export function checkSession() {
    const sessionData = localStorage.getItem('alquiler_session');
    if (sessionData) {
        currentUser = JSON.parse(sessionData);
        showDashboard();
    } else {
        showLogin();
    }
}

function showLogin() {
    appContainer.classList.add('d-none');
    loginContainer.classList.remove('d-none');
    renderLogin();
}

function showDashboard() {
    loginContainer.classList.add('d-none');
    appContainer.classList.remove('d-none');
    userDisplay.textContent = `Usuario: ${currentUser.username_usr}`;
    
    renderMenu(currentUser.funciones || []);
    
    if (currentUser.funciones && currentUser.funciones.length > 0) {
        navigate(currentUser.funciones[0].ruta_fnc, currentUser.funciones[0].nombre_fnc);
    } else {
        appContent.innerHTML = '<div class="alert alert-warning">No posees funciones habilitadas para tu rol actual.</div>';
    }
}

// --- ROUTER & NAVIGATION ---
export function navigate(viewName, displayName) {
    const cleanView = viewName.replace('/', '').toLowerCase().trim();
    viewTitle.textContent = displayName;
    
    document.querySelectorAll('#menu-items .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-view') === cleanView) {
            link.classList.add('active');
        }
    });

    appContent.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;

    if (cleanView.includes('persona')) {
        renderPersonas(appContent);
    } else if (cleanView.includes('departamento') || cleanView.includes('dpto')) {
        renderDepartamentos(appContent);
    } else if (cleanView.includes('alquiler') || cleanView.includes('alq')) {
        renderAlquileres(appContent);
    } else if (cleanView.includes('reporte')) {
        renderReporte(appContent);
    } else if (cleanView.includes('usuario') || cleanView.includes('usr')) {
        renderUsuarios(appContent);
    } else if (cleanView.includes('permiso') || cleanView.includes('rol') || cleanView.includes('funcion') || cleanView.includes('fnc')) {
        renderPermisos(appContent);
    } else {
        appContent.innerHTML = `<div class="alert alert-danger">Vista "${viewName}" no encontrada.</div>`;
    }
}

// --- LOGOUT EVENT ---
btnLogout.addEventListener('click', () => {
    localStorage.removeItem('alquiler_session');
    currentUser = null;
    showLogin();
});

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});

// --- PERMISSIONS HELPERS ---
export function hasPermission(action, entity) {
    const sessionData = localStorage.getItem('alquiler_session');
    if (!sessionData) return false;
    const session = JSON.parse(sessionData);
    if (!session.funciones) return false;
    
    const ent = entity.toLowerCase();

    // Comprobar si el rol posee el módulo base asignado en BD
    const hasBaseModule = session.funciones.some(f => {
        const route = f.ruta_fnc.toLowerCase();
        return route.includes(ent);
    });
    if (!hasBaseModule) return false;

    // Si tiene el módulo base, las acciones CRUD se dividen según el rol:
    const role = session.rolName.toLowerCase();
    
    if (role.includes('admin')) {
        return true;
    }

    if (role.includes('operativo')) {
        // Rol Operativo puede leer y escribir (crear/editar) pero no eliminar
        if (action === 'eliminar') {
            return false;
        }
        return true;
    }

    return false;
}
