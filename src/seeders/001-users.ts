import { QueryInterface } from 'sequelize';

export async function up({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkInsert('Users', [
        {
            name: 'admin',
            email: 'admin@mail.com'
        },
        {
            name: 'diego',
            email: 'diego@mail.com'
        },
        {
            name: 'kevin',
            email: 'kevin@mail.com'
        },
    ]);

}

export async function down({
    context
}: {
    context: QueryInterface
}) {

    await context.bulkDelete('Users', {});

}