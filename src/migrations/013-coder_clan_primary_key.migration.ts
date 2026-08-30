import type { QueryInterface } from "sequelize";


// ======================================================
// CLAVE PRIMARIA DE coder_clan
// ======================================================
//
// La migración 012 creó la tabla puente sin clave primaria,
// así que nada impedía insertar dos veces al mismo coder en
// el mismo clan.
//
// El modelo Coder_clan sí declara esa pareja como identidad,
// pero un índice declarado en el modelo no llega a la base
// de datos: solo lo aplicaría db.sync(), que este proyecto
// no usa.
//
// Esta migración añade la restricción donde de verdad
// importa: en PostgreSQL.
//
//   PRIMARY KEY (clan_id, coder_id)
//
// Va en un archivo nuevo, y no editando la 012, porque esa
// migración ya está aplicada: umzug no la volvería a
// ejecutar en una base existente.
//
export async function up({ context }: { context: QueryInterface }) {

    await context.addConstraint("coder_clan", {
        fields: ["clan_id", "coder_id"],
        type: "primary key",
        name: "pk_coder_clan",
    });
}


export async function down({ context }: { context: QueryInterface }) {

    await context.removeConstraint("coder_clan", "pk_coder_clan");
}
