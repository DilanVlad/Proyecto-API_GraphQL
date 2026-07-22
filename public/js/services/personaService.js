import { graphqlQuery } from '../api.js';

export async function getPersonas() {
    const query = `
        query {
            Personas {
                cedula_per
                nombres_per
                apellidos_per
                telefono_per
                direccion_per
            }
        }
    `;
    const data = await graphqlQuery(query);
    return data.Personas;
}

export async function createPersonaMutation(persona) {
    const mutation = `
        mutation CreatePersona($persona: inputPersona!) {
            createPersona(persona: $persona) {
                cedula_per
            }
        }
    `;
    const data = await graphqlQuery(mutation, { persona });
    return data.createPersona;
}

export async function updatePersonaMutation(persona) {
    const mutation = `
        mutation UpdatePersona($persona: inputPersonaUpdate!) {
            updatePersona(persona: $persona) {
                cedula_per
            }
        }
    `;
    const data = await graphqlQuery(mutation, { persona });
    return data.updatePersona;
}

export async function deletePersonaMutation(cedula_per) {
    const mutation = `
        mutation DeletePersona($cedula_per: String!) {
            deletePersona(cedula_per: $cedula_per) {
                cedula_per
            }
        }
    `;
    const data = await graphqlQuery(mutation, { cedula_per });
    return data.deletePersona;
}
