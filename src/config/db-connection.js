import pgPromise from 'pg-promise';
const pgp = pgPromise({});
const connectionString = {
    host: 'localhost',
    port: 5432,
    database: 'AlquileresDb',
    user: 'postgres',
    password: 'acdv0117'
}
const db = pgp(connectionString);

export { db };
export default db;