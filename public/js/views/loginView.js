export function loginFormTemplate() {
    return `
        <div class="flex flex-col items-center mb-6">
            <div class="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/20 mb-3">
                R
            </div>
            <h3 class="text-xl font-bold text-slate-800">Iniciar Sesión</h3>
        </div>
        
        <form id="login-form" class="space-y-4">
            <div>
                <label for="username" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario</label>
                <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="username" required placeholder="Ingresa tu usuario">
            </div>
            <div>
                <label for="password" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                <input type="password" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="password" required placeholder="Ingresa tu contraseña">
            </div>
            
            <div id="login-error" class="hidden p-3.5 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600" role="alert"></div>
            
            <button type="submit" class="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all">Ingresar</button>
            
            <div class="text-center pt-2">
                <a href="#" id="link-to-register" class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">¿No tienes cuenta? Regístrate aquí</a>
            </div>
        </form>
    `;
}

export function registerFormTemplate(rolOptionsHtml) {
    return `
        <div class="flex flex-col items-center mb-6">
            <div class="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/20 mb-3">
                R
            </div>
            <h3 class="text-xl font-bold text-slate-800">Registrarse</h3>
        </div>
        
        <form id="register-form" class="space-y-4">
            <div>
                <label for="reg-username" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre de Usuario</label>
                <input type="text" oninput="this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]/g, '')" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="reg-username" required placeholder="Crea tu usuario">
            </div>
            <div>
                <label for="reg-password" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña</label>
                <input type="password" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50" id="reg-password" required placeholder="Crea tu contraseña">
            </div>
            <div>
                <label for="reg-rol" class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seleccionar Rol</label>
                <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 text-sm transition-all bg-slate-50/50 appearance-none" id="reg-rol" required>
                    <option value="" disabled selected>Selecciona tu rol...</option>
                    ${rolOptionsHtml}
                </select>
            </div>
            
            <div id="register-error" class="hidden p-3.5 text-xs font-semibold rounded-xl bg-rose-50 border border-rose-100 text-rose-600" role="alert"></div>
            <div id="register-success" class="hidden p-3.5 text-xs font-semibold rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600" role="alert">Usuario registrado exitosamente. Redirigiendo...</div>
            
            <button type="submit" class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.99] transition-all">Registrarse</button>
            
            <div class="text-center pt-2">
                <a href="#" id="link-to-login" class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">¿Ya tienes cuenta? Inicia sesión aquí</a>
            </div>
        </form>
    `;
}
