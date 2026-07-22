import { graphqlQuery } from '../api.js';

export async function getAlquileres() {
    const query = `
        query {
            Alquileres {
                cod_alq
                fecha_alq
                total_alq
                estado_alq
                cedula_per
                persona {
                    nombres_per
                    apellidos_per
                }
                usuario {
                    username_usr
                }
                detalles {
                    codigo_dpto
                    precio_det
                    fecha_inicio_det
                    fecha_fin_det
                    departamento {
                        descripcion_dpto
                    }
                }
            }
        }
    `;
    const data = await graphqlQuery(query);
    return data.Alquileres;
}

export async function getFormCatalogos() {
    const query = `
        query {
            Personas {
                cedula_per
                nombres_per
                apellidos_per
            }
            Departamentos {
                codigo_dpto
                precio_dpto
                estado_dpto
                descripcion_dpto
            }
        }
    `;
    const data = await graphqlQuery(query);
    return {
        personas: data.Personas,
        departamentos: data.Departamentos
    };
}

export async function createAlquilerTransaccionalMutation(alquiler) {
    const mutation = `
        mutation CreateAlquilerTransaccional($alquiler: inputAlquilerTransaccional!) {
            createAlquilerTransaccional(alquiler: $alquiler) {
                cod_alq
                total_alq
            }
        }
    `;
    const data = await graphqlQuery(mutation, { alquiler });
    return data.createAlquilerTransaccional;
}

export async function deleteAlquilerMutation(cod_alq) {
    const mutation = `
        mutation DeleteAlquiler($cod_alq: String!) {
            deleteAlquiler(cod_alq: $cod_alq) {
                cod_alq
            }
        }
    `;
    const data = await graphqlQuery(mutation, { cod_alq });
    return data.deleteAlquiler;
}
