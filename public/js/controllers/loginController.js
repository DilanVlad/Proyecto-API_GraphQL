import { loginMutation, createUsuarioMutation } from '../services/usuarioService.js';
import { loginFormTemplate, registerFormTemplate } from '../views/loginView.js';
import { checkSession } from '../app.js';
import { getRolesYFunciones as fetchRoles } from '../services/permisoService.js';

let loginCardContainer = null;

export function renderLogin() {
    loginCardContainer = document.getElementById('login-view-wrapper');
    if (!loginCardContainer) return;
    showLoginForm();
}

function showLoginForm() {
    loginCardContainer.innerHTML = loginFormTemplate();

    document.getElementById('link-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const errorDiv = document.getElementById('login-error');

        if (errorDiv) {
            errorDiv.classList.add('hidden');
            errorDiv.textContent = '';
        }

        try {
            const result = await loginMutation(username, password);
            if (result && result.token) {
                const sessionData = {
                    token: result.token,
                    id_usr: result.usuario.id_usr,
                    username_usr: result.usuario.username_usr,
                    rolName: result.usuario.rol ? result.usuario.rol.nombre_rol : 'Sin Rol',
                    funciones: result.usuario.rol ? result.usuario.rol.funciones || [] : []
                };
                localStorage.setItem('alquiler_session', JSON.stringify(sessionData));
                checkSession();
            } else {
                throw new Error('No se pudo obtener el token de sesión.');
            }
        } catch (err) {
            if (errorDiv) {
                errorDiv.textContent = err.message || 'Credenciales inválidas.';
                errorDiv.classList.remove('hidden');
            }
        }
    });
}

async function showRegisterForm() {
    try {
        const { roles } = await fetchRoles();
        let rolOptions = roles.map(r => `<option value="${r.id_rol}">${r.nombre_rol}</option>`).join('');

        loginCardContainer.innerHTML = registerFormTemplate(rolOptions);

        document.getElementById('link-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            showLoginForm();
        });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value.trim();
            const id_rol = parseInt(document.getElementById('reg-rol').value, 10);

            const errDiv = document.getElementById('register-error');
            const succDiv = document.getElementById('register-success');

            if (errDiv) errDiv.classList.add('hidden');
            if (succDiv) succDiv.classList.add('hidden');

            try {
                const newUsuario = {
                    username_usr: username,
                    password_usr: password,
                    estado_usr: true,
                    id_rol: id_rol
                };
                await createUsuarioMutation(newUsuario);
                if (succDiv) succDiv.classList.remove('hidden');
                setTimeout(() => {
                    showLoginForm();
                }, 1500);
            } catch (err) {
                if (errDiv) {
                    errDiv.textContent = err.message || 'Error al registrar usuario.';
                    errDiv.classList.remove('hidden');
                }
            }
        });
    } catch (err) {
        alert('Error al cargar opciones de registro: ' + err.message);
    }
}
