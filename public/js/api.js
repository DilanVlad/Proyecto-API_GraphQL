// --- CONFIG ---
const API_URL = 'http://localhost:4000/graphql';

// --- GRAPHQL REQUEST CLIENT ---
export async function graphqlQuery(query, variables = {}) {
    try {
        const sessionData = localStorage.getItem('alquiler_session');
        const token = sessionData ? JSON.parse(sessionData).token : null;

        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                query,
                variables
            })
        });


        const result = await response.json();
        if (result.errors) {
            console.error('Errores de GraphQL:', result.errors);
            throw new Error(result.errors[0].message || 'Error en la petición de GraphQL');
        }
        return result.data;
    } catch (error) {
        console.error('Error de red/servidor al conectar con GraphQL:', error);
        throw error;
    }
}
