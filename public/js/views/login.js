import { graphqlQuery } from '../api.js';
import { checkSession } from '../app.js';

// --- CRYPTO UTILITY ---
async function hashSHA256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- VIEW RENDERER ---
export function renderLogin() {
    showLoginForm();
}

// --- LOGIN FORM ---
function showLoginForm() {
    const wrapper = document.getElementById('login-view-wrapper');
    wrapper.innerHTML = `
        <h3 class="card-title text-center mb-4">Iniciar Sesión</h3>
        <form id="login-form">
            <div class="mb-3">
                <label for="username" class="form-label">Usuario</label>
                <input type="text" class="form-control" id="username" required placeholder="Ingresa tu usuario">
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" required placeholder="Ingresa tu contraseña">
            </div>
            <div id="login-error" class="alert alert-danger d-none" role="alert"></div>
            <button type="submit" class="btn btn-primary w-100 mb-3">Ingresar</button>
            <div class="text-center">
                <a href="#" id="link-to-register" class="text-decoration-none">¿No tienes cuenta? Regístrate aquí</a>
            </div>
        </form>
    `;

    document.getElementById('link-to-register').addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.classList.add('d-none');
        
        const username = document.getElementById('username').value.trim();
        const passwordPlain = document.getElementById('password').value;

        try {
            const passwordHashed = await hashSHA256(passwordPlain);

            const query = `
                query {
                    Usuarios {
                        id_usr
                        username_usr
                        password_usr
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
            const user = data.Usuarios.find(u => u.username_usr === username && u.password_usr === passwordHashed);

            if (user) {
                if (!user.estado_usr) {
                    throw new Error('El usuario está inactivo.');
                }
                
                const funciones = user.rol && user.rol.funciones ? user.rol.funciones : [];
                
                const session = {
                    id_usr: user.id_usr,
                    username_usr: user.username_usr,
                    rolName: user.rol ? user.rol.nombre_rol : 'Sin Rol',
                    funciones: funciones
                };
                
                localStorage.setItem('alquiler_session', JSON.stringify(session));
                checkSession();
            } else {
                throw new Error('Credenciales incorrectas.');
            }
        } catch (err) {
            errorDiv.textContent = err.message || 'Error al conectar con la base de datos';
            errorDiv.classList.remove('d-none');
        }
    });
}

// --- REGISTER FORM ---
async function showRegisterForm() {
    const wrapper = document.getElementById('login-view-wrapper');
    wrapper.innerHTML = `<div class="text-center"><div class="spinner-border text-primary" role="status"></div></div>`;

    let rolesList = [];
    try {
        const dataRoles = await graphqlQuery(`
            query {
                Roles {
                    id_rol
                    nombre_rol
                }
            }
        `);
        rolesList = dataRoles.Roles;
    } catch (error) {
        rolesList = [];
    }

    const rolOptions = rolesList.map(r => 
        `<option value="${r.id_rol}">${r.nombre_rol}</option>`
    ).join('');

    wrapper.innerHTML = `
        <h3 class="card-title text-center mb-4">Registrarse</h3>
        <form id="register-form">
            <div class="mb-3">
                <label for="reg-username" class="form-label">Nombre de Usuario</label>
                <input type="text" class="form-control" id="reg-username" required placeholder="Crea tu usuario">
            </div>
            <div class="mb-3">
                <label for="reg-password" class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="reg-password" required placeholder="Crea tu contraseña">
            </div>
            <div class="mb-3">
                <label for="reg-rol" class="form-label">Seleccionar Rol</label>
                <select class="form-select" id="reg-rol" required>
                    <option value="" disabled selected>Selecciona tu rol...</option>
                    ${rolOptions}
                </select>
            </div>
            <div id="register-error" class="alert alert-danger d-none" role="alert"></div>
            <div id="register-success" class="alert alert-success d-none" role="alert">Usuario registrado exitosamente. redirigiendo...</div>
            <button type="submit" class="btn btn-success w-100 mb-3">Registrarse</button>
            <div class="text-center">
                <a href="#" id="link-to-login" class="text-decoration-none">¿Ya tienes cuenta? Inicia sesión aquí</a>
            </div>
        </form>
    `;

    document.getElementById('link-to-login').addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');
    const successDiv = document.getElementById('register-success');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.classList.add('d-none');
        successDiv.classList.add('d-none');

        const username = document.getElementById('reg-username').value.trim();
        const passwordPlain = document.getElementById('reg-password').value;
        const idRol = parseInt(document.getElementById('reg-rol').value);

        try {
            const passwordHashed = await hashSHA256(passwordPlain);

            const mutation = `
                mutation CreateUsuario($usuario: inputUsuario!) {
                    createUsuario(usuario: $usuario) {
                        id_usr
                        username_usr
                    }
                }
            `;

            const variables = {
                usuario: {
                    username_usr: username,
                    password_usr: passwordHashed,
                    estado_usr: true,
                    id_rol: idRol
                }
            };

            await graphqlQuery(mutation, variables);
            
            successDiv.classList.remove('d-none');
            setTimeout(() => {
                showLoginForm();
            }, 1500);

        } catch (err) {
            errorDiv.textContent = err.message || 'Error al registrar el usuario';
            errorDiv.classList.remove('d-none');
        }
    });
}
