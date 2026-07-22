import { graphqlQuery } from '../api.js';

export async function getDepartamentos() {
    const query = `
        query {
            Departamentos {
                codigo_dpto
                descripcion_dpto
                precio_dpto
                estado_dpto
            }
        }
    `;
    const data = await graphqlQuery(query);
    return data.Departamentos;
}

export async function createDepartamentoMutation(departamento) {
    const mutation = `
        mutation CreateDepartamento($departamento: inputDepartamento!) {
            createDepartamento(departamento: $departamento) {
                codigo_dpto
            }
        }
    `;
    const data = await graphqlQuery(mutation, { departamento });
    return data.createDepartamento;
}

export async function updateDepartamentoMutation(departamento) {
    const mutation = `
        mutation UpdateDepartamento($departamento: inputDepartamentoUpdate!) {
            updateDepartamento(departamento: $departamento) {
                codigo_dpto
            }
        }
    `;
    const data = await graphqlQuery(mutation, { departamento });
    return data.updateDepartamento;
}

export async function deleteDepartamentoMutation(codigo_dpto) {
    const mutation = `
        mutation DeleteDepartamento($codigo_dpto: String!) {
            deleteDepartamento(codigo_dpto: $codigo_dpto) {
                codigo_dpto
            }
        }
    `;
    const data = await graphqlQuery(mutation, { codigo_dpto });
    return data.deleteDepartamento;
}
