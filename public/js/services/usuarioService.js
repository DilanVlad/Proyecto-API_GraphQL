import { graphqlQuery } from '../api.js';

export async function loginMutation(username, password) {
    const mutation = `
        mutation Login($username: String!, $password: String!) {
            login(username_usr: $username, password_usr: $password) {
                token
                usuario {
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
        }
    `;
    const data = await graphqlQuery(mutation, { username, password });
    return data.login;
}

export async function getUsuarios() {
    const query = `
        query {
            Usuarios {
                id_usr
                username_usr
                estado_usr
                id_rol
                rol {
                    nombre_rol
                }
            }
        }
    `;
    const data = await graphqlQuery(query);
    return data.Usuarios;
}

export async function getUsuarioById(id_usr) {
    const query = `
        query {
            Usuarios(id_usr: ${id_usr}) {
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
    return data.Usuarios && data.Usuarios.length > 0 ? data.Usuarios[0] : null;
}

export async function createUsuarioMutation(usuario) {
    const mutation = `
        mutation CreateUsuario($usuario: inputUsuario!) {
            createUsuario(usuario: $usuario) {
                id_usr
                username_usr
            }
        }
    `;
    const data = await graphqlQuery(mutation, { usuario });
    return data.createUsuario;
}

export async function updateUsuarioMutation(usuario) {
    const mutation = `
        mutation UpdateUsuario($usuario: inputUsuarioUpdate!) {
            updateUsuario(usuario: $usuario) {
                id_usr
            }
        }
    `;
    const data = await graphqlQuery(mutation, { usuario });
    return data.updateUsuario;
}

export async function deleteUsuarioMutation(id_usr) {
    const mutation = `
        mutation DeleteUsuario($id_usr: Int!) {
            deleteUsuario(id_usr: $id_usr) {
                id_usr
            }
        }
    `;
    const data = await graphqlQuery(mutation, { id_usr });
    return data.deleteUsuario;
}
