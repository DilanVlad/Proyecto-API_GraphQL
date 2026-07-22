import { graphqlQuery } from './api.js';
import { renderLogin } from './controllers/loginController.js';
import { renderPersonas } from './controllers/personaController.js';
import { renderDepartamentos } from './controllers/departamentoController.js';
import { renderAlquileres } from './controllers/alquilerController.js';
import { renderReporte } from './controllers/reporteController.js';
import { renderUsuarios } from './controllers/usuarioController.js';
import { renderPermisos } from './controllers/permisoController.js';
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
export async function checkSession() {
    try {
        const sessionData = localStorage.getItem('alquiler_session');
        if (sessionData) {
            try {
                currentUser = JSON.parse(sessionData);
            } catch (err) {
                currentUser = null;
            }

            if (currentUser && currentUser.id_usr) {
                try {
                    const query = `
                        query {
                            Usuarios(id_usr: ${currentUser.id_usr}) {
                                id_usr
                                username_usr
                                estado_usr
                                rol {
                                    id_rol
                                    nombre_rol
                                    funciones {
                                        id_fnc
                                        nombre_fnc
                                        ruta_fnc
                                    }
                                }
                            }
                        }
                    `;
                    const data = await graphqlQuery(query);
                    if (data && data.Usuarios && data.Usuarios.length > 0) {
                        const u = data.Usuarios[0];
                        currentUser.username_usr = u.username_usr;
                        currentUser.funciones = u.rol && u.rol.funciones ? u.rol.funciones : [];
                        currentUser.rolName = u.rol ? u.rol.nombre_rol : 'Sin Rol';
                        localStorage.setItem('alquiler_session', JSON.stringify(currentUser));
                    }
                } catch (e) {
                    console.error('Error al sincronizar sesión con servidor:', e);
                }
            }

            if (currentUser && (currentUser.token || currentUser.username_usr)) {
                showDashboard();
                return;
            }
        }
        showLogin();
    } catch (err) {
        console.error('Error general en checkSession:', err);
        showLogin();
    }
}

function showLogin() {
    if (appContainer) appContainer.classList.add('hidden');
    if (loginContainer) loginContainer.classList.remove('hidden');
    renderLogin();
}

function showDashboard() {
    if (loginContainer) loginContainer.classList.add('hidden');
    if (appContainer) appContainer.classList.remove('hidden');
    
    if (userDisplay) {
        const username = currentUser ? currentUser.username_usr || 'N/A' : 'N/A';
        userDisplay.textContent = username.toUpperCase();

        // Actualizar inicial del avatar
        const avatar = document.getElementById('user-avatar');
        if (avatar) avatar.textContent = username.charAt(0).toUpperCase();
    }
    
    const funciones = currentUser && currentUser.funciones ? currentUser.funciones : [];
    renderMenu(funciones);
    
    if (funciones.length > 0) {
        navigate(funciones[0].ruta_fnc || '', funciones[0].nombre_fnc || '');
    } else {
        if (appContent) {
            appContent.innerHTML = '<div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">No posees funciones habilitadas para tu rol actual.</div>';
        }
    }
}

// --- ROUTER & NAVIGATION ---
export function navigate(viewName = '', displayName = '') {
    const cleanView = viewName.replace('/', '').toLowerCase().trim();
    if (viewTitle) viewTitle.textContent = displayName;
    
    document.querySelectorAll('#menu-items .nav-link').forEach(link => {
        link.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/10');
        link.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        if (link.getAttribute('data-view') === cleanView) {
            link.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
            link.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/10');
        }
    });

    if (appContent) {
        appContent.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20">
                <div class="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xs text-slate-400 font-semibold mt-4">Cargando datos...</span>
            </div>
        `;
    }

    try {
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
            if (appContent) {
                appContent.innerHTML = `<div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">Vista "${viewName}" no encontrada.</div>`;
            }
        }
    } catch (err) {
        console.error('Error al renderizar la vista solicitada:', err);
        if (appContent) {
            appContent.innerHTML = `<div class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">Error al cargar la vista: ${err.message}</div>`;
        }
    }
}

// --- LOGOUT EVENT ---
if (btnLogout) {
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('alquiler_session');
        currentUser = null;
        showLogin();
    });
}

// --- INITIALIZATION ---
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkSession();
    });
} else {
    checkSession();
}

// --- PERMISSIONS HELPERS ---
export function hasPermission(action, entity) {
    const sessionData = localStorage.getItem('alquiler_session');
    if (!sessionData) return false;
    let session;
    try {
        session = JSON.parse(sessionData);
    } catch (e) {
        return false;
    }
    if (!session || !session.funciones) return false;
    
    const ent = (entity || '').toLowerCase();

    const hasBaseModule = session.funciones.some(f => {
        const route = (f.ruta_fnc || '').toLowerCase();
        return route.includes(ent);
    });
    if (!hasBaseModule) return false;

    const role = (session.rolName || '').toLowerCase();
    
    if (role.includes('admin')) {
        return true;
    }

    if (role.includes('operativo')) {
        if (action === 'eliminar') {
            return false;
        }
        return true;
    }

    return false;
}
