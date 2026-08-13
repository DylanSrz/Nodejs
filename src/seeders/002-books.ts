import { QueryInterface } from 'sequelize';

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert('Books', [
        {
            name: 'cien años de soledad',
            author: 'gabriel garcia marquez'
        },
        {
            name: 'el tunel',
            author: 'ernesto sabato'
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete('Books', {});

}