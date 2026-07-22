import { graphqlQuery } from '../api.js';

export async function getRolesYFunciones() {
    const query = `
        query {
            Roles {
                id_rol
                nombre_rol
                funciones {
                    id_fnc
                    nombre_fnc
                    ruta_fnc
                }
            }
            Funciones {
                id_fnc
                nombre_fnc
                ruta_fnc
            }
        }
    `;
    const data = await graphqlQuery(query);
    return {
        roles: data.Roles,
        funciones: data.Funciones
    };
}

export async function createRolMutation(nombre_rol) {
    const mutation = `
        mutation CreateRol($rol: inputRol!) {
            createRol(rol: $rol) {
                id_rol
                nombre_rol
            }
        }
    `;
    const data = await graphqlQuery(mutation, { rol: { nombre_rol } });
    return data.createRol;
}

export async function updateRolMutation(id_rol, nombre_rol) {
    const mutation = `
        mutation UpdateRol($rol: inputRolUpdate!) {
            updateRol(rol: $rol) {
                id_rol
                nombre_rol
            }
        }
    `;
    const data = await graphqlQuery(mutation, { rol: { id_rol, nombre_rol } });
    return data.updateRol;
}

export async function createFuncionMutation(nombre_fnc, ruta_fnc) {
    const mutation = `
        mutation CreateFuncion($funcion: inputFuncion!) {
            createFuncion(funcion: $funcion) {
                id_fnc
                nombre_fnc
                ruta_fnc
            }
        }
    `;
    const data = await graphqlQuery(mutation, { funcion: { nombre_fnc, ruta_fnc } });
    return data.createFuncion;
}

export async function updateFuncionMutation(id_fnc, nombre_fnc, ruta_fnc) {
    const mutation = `
        mutation UpdateFuncion($funcion: inputFuncionUpdate!) {
            updateFuncion(funcion: $funcion) {
                id_fnc
                nombre_fnc
                ruta_fnc
            }
        }
    `;
    const data = await graphqlQuery(mutation, { funcion: { id_fnc, nombre_fnc, ruta_fnc } });
    return data.updateFuncion;
}

export async function asociarFuncionARolMutation(id_rol, id_fnc) {
    const mutation = `
        mutation Asociar($id_rol: Int!, $id_fnc: Int!) {
            asociarFuncionARol(id_rol: $id_rol, id_fnc: $id_fnc)
        }
    `;
    const data = await graphqlQuery(mutation, { id_rol, id_fnc });
    return data.asociarFuncionARol;
}

export async function desasociarFuncionDeRolMutation(id_rol, id_fnc) {
    const mutation = `
        mutation Desasociar($id_rol: Int!, $id_fnc: Int!) {
            desasociarFuncionDeRol(id_rol: $id_rol, id_fnc: $id_fnc)
        }
    `;
    const data = await graphqlQuery(mutation, { id_rol, id_fnc });
    return data.desasociarFuncionDeRol;
}
