import { db } from '../config/db-connection.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const SECRET_KEY = 'secret_key_alquileres_graphql_jwt';

function hashPassword(pass) {
    if (!pass) return pass;
    return crypto.createHash('sha256').update(pass).digest('hex');
}

const alquilerResolver = {

    Query: {
        // Usuarios
        async Usuarios(root, { id_usr }) {
            try {
                if (id_usr === undefined) {
                    return await db.any('SELECT * FROM usuarios;');
                } else {
                    return await db.any('SELECT * FROM usuarios WHERE id_usr = $1;', [id_usr]);
                }
            } catch (error) {
                return error;
            }
        },
        // Roles
        async Roles(root, { id_rol }) {
            try {
                if (id_rol === undefined) {
                    return await db.any('SELECT * FROM roles;');
                } else {
                    return await db.any('SELECT * FROM roles WHERE id_rol = $1;', [id_rol]);
                }
            } catch (error) {
                return error;
            }
        },
        // Funciones
        async Funciones(root, { id_fnc }) {
            try {
                if (id_fnc === undefined) {
                    return await db.any('SELECT * FROM funciones;');
                } else {
                    return await db.any('SELECT * FROM funciones WHERE id_fnc = $1;', [id_fnc]);
                }
            } catch (error) {
                return error;
            }
        },
        // Personas
        async Personas(root, { cedula_per }) {
            try {
                if (cedula_per === undefined) {
                    return await db.any('SELECT * FROM personas;');
                } else {
                    return await db.any('SELECT * FROM personas WHERE cedula_per = $1;', [cedula_per]);
                }
            } catch (error) {
                return error;
            }
        },
        // Alquileres
        async Alquileres(root, { cod_alq }) {
            try {
                if (cod_alq === undefined) {
                    return await db.any('SELECT * FROM alquileres;');
                } else {
                    return await db.any('SELECT * FROM alquileres WHERE cod_alq = $1;', [cod_alq]);
                }
            } catch (error) {
                return error;
            }
        },
        // Departamento
        async Departamentos(root, { codigo_dpto }) {
            try {
                if (codigo_dpto === undefined) {
                    return await db.any('SELECT * FROM departamento;');
                } else {
                    return await db.any('SELECT * FROM departamento WHERE codigo_dpto = $1;', [codigo_dpto]);
                }
            } catch (error) {
                return error;
            }
        }
    },

    Mutation: {
        // Usuarios
        async createUsuario(root, { usuario }) {
            try {
                if (usuario === undefined) return null;
                const pass = hashPassword(usuario.password_usr);
                return await db.one(
                    `INSERT INTO usuarios(username_usr, password_usr, estado_usr, id_rol)
                     VALUES($1, $2, $3, $4) RETURNING *;`,
                    [usuario.username_usr, pass, usuario.estado_usr, usuario.id_rol]
                );
            } catch (error) {
                return error;
            }
        },
        async updateUsuario(root, { usuario }) {
            try {
                if (usuario === undefined) return null;
                if (usuario.password_usr !== undefined && usuario.password_usr !== null && usuario.password_usr !== '') {
                    const pass = hashPassword(usuario.password_usr);
                    return await db.one(
                        `UPDATE usuarios
                         SET username_usr = $2, password_usr = $3, estado_usr = $4, id_rol = $5
                         WHERE id_usr = $1 RETURNING *;`,
                        [usuario.id_usr, usuario.username_usr, pass, usuario.estado_usr, usuario.id_rol]
                    );
                } else {
                    return await db.one(
                        `UPDATE usuarios
                         SET username_usr = $2, estado_usr = $3, id_rol = $4
                         WHERE id_usr = $1 RETURNING *;`,
                        [usuario.id_usr, usuario.username_usr, usuario.estado_usr, usuario.id_rol]
                    );
                }
            } catch (error) {
                return error;
            }
        },
        async deleteUsuario(root, { id_usr }) {
            try {
                return await db.one('DELETE FROM usuarios WHERE id_usr = $1 RETURNING *;', [id_usr]);
            } catch (error) {
                return error;
            }
        },

        // Roles
        async createRol(root, { rol }) {
            try {
                if (rol === undefined) return null;
                return await db.one(
                    'INSERT INTO roles(nombre_rol) VALUES($1) RETURNING *;',
                    [rol.nombre_rol]
                );
            } catch (error) {
                return error;
            }
        },
        async updateRol(root, { rol }) {
            try {
                if (rol === undefined) return null;
                return await db.one(
                    'UPDATE roles SET nombre_rol = $2 WHERE id_rol = $1 RETURNING *;',
                    [rol.id_rol, rol.nombre_rol]
                );
            } catch (error) {
                return error;
            }
        },
        async deleteRol(root, { id_rol }) {
            try {
                return await db.one('DELETE FROM roles WHERE id_rol = $1 RETURNING *;', [id_rol]);
            } catch (error) {
                return error;
            }
        },

        // Funciones
        async createFuncion(root, { funcion }) {
            try {
                if (funcion === undefined) return null;
                return await db.one(
                    'INSERT INTO funciones(nombre_fnc, ruta_fnc) VALUES($1, $2) RETURNING *;',
                    [funcion.nombre_fnc, funcion.ruta_fnc]
                );
            } catch (error) {
                return error;
            }
        },
        async updateFuncion(root, { funcion }) {
            try {
                if (funcion === undefined) return null;
                return await db.one(
                    'UPDATE funciones SET nombre_fnc = $2, ruta_fnc = $3 WHERE id_fnc = $1 RETURNING *;',
                    [funcion.id_fnc, funcion.nombre_fnc, funcion.ruta_fnc]
                );
            } catch (error) {
                return error;
            }
        },
        async deleteFuncion(root, { id_fnc }) {
            try {
                return await db.one('DELETE FROM funciones WHERE id_fnc = $1 RETURNING *;', [id_fnc]);
            } catch (error) {
                return error;
            }
        },

        // Personas
        async createPersona(root, { persona }) {
            try {
                if (persona === undefined) return null;
                return await db.one(
                    `INSERT INTO personas(cedula_per, nombres_per, apellidos_per, telefono_per, direccion_per)
                     VALUES($1, $2, $3, $4, $5) RETURNING *;`,
                    [persona.cedula_per, persona.nombres_per, persona.apellidos_per, persona.telefono_per, persona.direccion_per]
                );
            } catch (error) {
                return error;
            }
        },
        async updatePersona(root, { persona }) {
            try {
                if (persona === undefined) return null;
                return await db.one(
                    `UPDATE personas
                     SET nombres_per = $2, apellidos_per = $3, telefono_per = $4, direccion_per = $5
                     WHERE cedula_per = $1 RETURNING *;`,
                    [persona.cedula_per, persona.nombres_per, persona.apellidos_per, persona.telefono_per, persona.direccion_per]
                );
            } catch (error) {
                return error;
            }
        },
        async deletePersona(root, { cedula_per }) {
            try {
                return await db.one('DELETE FROM personas WHERE cedula_per = $1 RETURNING *;', [cedula_per]);
            } catch (error) {
                return error;
            }
        },

        // Autenticación JWT
        async login(root, { username_usr, password_usr }) {
            try {
                const passHash = hashPassword(password_usr);
                const user = await db.oneOrNone(
                    'SELECT * FROM usuarios WHERE username_usr = $1 AND (password_usr = $2 OR password_usr = $3);',
                    [username_usr, password_usr, passHash]
                );
                if (!user) {
                    throw new Error('Credenciales incorrectas.');
                }
                if (!user.estado_usr) {
                    throw new Error('El usuario está inactivo.');
                }
                const token = jwt.sign(
                    { id_usr: user.id_usr, username_usr: user.username_usr, id_rol: user.id_rol },
                    SECRET_KEY,
                    { expiresIn: '8h' }
                );
                return {
                    token,
                    usuario: user
                };
            } catch (error) {
                throw new Error(error.message || 'Error en autenticación.');
            }
        },


        // Alquileres Transaccional
        async createAlquilerTransaccional(root, { alquiler }, context) {
            try {
                let userId = context?.user?.id_usr;
                if (!userId) {
                    const admin = await db.oneOrNone('SELECT id_usr FROM usuarios WHERE estado_usr = true LIMIT 1;');
                    userId = admin ? admin.id_usr : 1;
                }

                return await db.tx(async t => {
                    const countResult = await t.one('SELECT COUNT(*) FROM alquileres;');
                    const num = parseInt(countResult.count, 10) + 1;
                    const cod_alq = `ALQ-${Date.now().toString().slice(-4)}${num}`;

                    let total = 0;
                    const detailRows = [];

                    for (const item of alquiler.detalles) {
                        const start = new Date(item.fecha_inicio_det);
                        const end = new Date(item.fecha_fin_det);
                        const diffTime = Math.abs(end - start);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                        const subtotal = diffDays * item.precio_det;
                        total += subtotal;

                        detailRows.push({
                            codigo_dpto: item.codigo_dpto,
                            precio_det: item.precio_det,
                            fecha_inicio_det: item.fecha_inicio_det,
                            fecha_fin_det: item.fecha_fin_det
                        });
                    }

                    const newAlquiler = await t.one(
                        `INSERT INTO alquileres(cod_alq, fecha_alq, total_alq, estado_alq, id_usr, cedula_per)
                         VALUES($1, $2, $3, $4, $5, $6) RETURNING *;`,
                        [cod_alq, alquiler.fecha_alq, total, 'Activo', userId, alquiler.cedula_per]
                    );

                    for (const item of detailRows) {
                        await t.none(
                            `INSERT INTO detalle_alquiler(precio_det, fecha_inicio_det, fecha_fin_det, cod_alq, codigo_dpto)
                             VALUES($1, $2, $3, $4, $5);`,
                            [item.precio_det, item.fecha_inicio_det, item.fecha_fin_det, cod_alq, item.codigo_dpto]
                        );

                        await t.none(
                            `UPDATE departamento SET estado_dpto = 'Ocupado' WHERE codigo_dpto = $1;`,
                            [item.codigo_dpto]
                        );
                    }

                    return newAlquiler;
                });
            } catch (error) {
                throw new Error(error.message || 'Error al guardar la transacción de alquiler.');
            }
        },

        async deleteAlquiler(root, { cod_alq }) {
            try {
                return await db.one('DELETE FROM alquileres WHERE cod_alq = $1 RETURNING *;', [cod_alq]);
            } catch (error) {
                return error;
            }
        },

        // Departamento
        async createDepartamento(root, { departamento }) {
            try {
                if (departamento === undefined) return null;
                return await db.one(
                    `INSERT INTO departamento(codigo_dpto, descripcion_dpto, precio_dpto, estado_dpto)
                     VALUES($1, $2, $3, $4) RETURNING *;`,
                    [departamento.codigo_dpto, departamento.descripcion_dpto, departamento.precio_dpto, departamento.estado_dpto]
                );
            } catch (error) {
                return error;
            }
        },
        async updateDepartamento(root, { departamento }) {
            try {
                if (departamento === undefined) return null;
                return await db.one(
                    `UPDATE departamento
                     SET descripcion_dpto = $2, precio_dpto = $3, estado_dpto = $4
                     WHERE codigo_dpto = $1 RETURNING *;`,
                    [departamento.codigo_dpto, departamento.descripcion_dpto, departamento.precio_dpto, departamento.estado_dpto]
                );
            } catch (error) {
                return error;
            }
        },
        async deleteDepartamento(root, { codigo_dpto }) {
            try {
                return await db.one('DELETE FROM departamento WHERE codigo_dpto = $1 RETURNING *;', [codigo_dpto]);
            } catch (error) {
                return error;
            }
        },

        // Roles_Funciones
        async asociarFuncionARol(root, { id_rol, id_fnc }) {
            try {
                await db.none('INSERT INTO roles_funciones(id_rol, id_fnc) VALUES($1, $2) ON CONFLICT DO NOTHING;', [id_rol, id_fnc]);
                return true;
            } catch (error) {
                return false;
            }
        },

        async desasociarFuncionDeRol(root, { id_rol, id_fnc }) {
            try {
                await db.none('DELETE FROM roles_funciones WHERE id_rol = $1 AND id_fnc = $2;', [id_rol, id_fnc]);
                return true;
            } catch (error) {
                return false;
            }
        }
    },

    // --- Field Resolvers ---

    Usuario: {
        async rol(usuario) {
            try {
                if (!usuario.id_rol) return null;
                return await db.oneOrNone('SELECT * FROM roles WHERE id_rol = $1;', [usuario.id_rol]);
            } catch (error) {
                return null;
            }
        }
    },

    Rol: {
        async funciones(rol) {
            try {
                return await db.any(
                    `SELECT f.* FROM funciones f
                     JOIN roles_funciones rf ON f.id_fnc = rf.id_fnc
                     WHERE rf.id_rol = $1;`,
                    [rol.id_rol]
                );
            } catch (error) {
                return [];
            }
        }
    },

    Alquiler: {
        async usuario(alquiler) {
            try {
                return await db.oneOrNone('SELECT * FROM usuarios WHERE id_usr = $1;', [alquiler.id_usr]);
            } catch (error) {
                return null;
            }
        },
        async persona(alquiler) {
            try {
                return await db.oneOrNone('SELECT * FROM personas WHERE cedula_per = $1;', [alquiler.cedula_per]);
            } catch (error) {
                return null;
            }
        },
        async detalles(alquiler) {
            try {
                return await db.any('SELECT * FROM detalle_alquiler WHERE cod_alq = $1;', [alquiler.cod_alq]);
            } catch (error) {
                return [];
            }
        }
    },

    DetalleAlquiler: {
        async alquiler(detalle) {
            try {
                return await db.oneOrNone('SELECT * FROM alquileres WHERE cod_alq = $1;', [detalle.cod_alq]);
            } catch (error) {
                return null;
            }
        },
        async departamento(detalle) {
            try {
                return await db.oneOrNone('SELECT * FROM departamento WHERE codigo_dpto = $1;', [detalle.codigo_dpto]);
            } catch (error) {
                return null;
            }
        }
    }
};

export default alquilerResolver;
