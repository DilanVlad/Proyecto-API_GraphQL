import { graphqlQuery } from '../api.js';

export async function getReporteAlquileres() {
    const query = `
        query {
            Alquileres {
                cod_alq
                fecha_alq
                total_alq
                estado_alq
                usuario {
                    username_usr
                }
                persona {
                    cedula_per
                    nombres_per
                    apellidos_per
                }
                detalles {
                    codigo_dpto
                    precio_det
                    fecha_inicio_det
                    fecha_fin_det
                }
            }
        }
    `;
    const data = await graphqlQuery(query);
    return data.Alquileres;
}
