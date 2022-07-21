exports.up = async (knex) => {
    await knex.raw(`
        BEGIN;
        INSERT INTO "ContactRole" (name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", dv, sender, "createdBy", organization, "updatedBy") VALUES ('contact.role.resident.name', 'f9e88ba8-669e-417c-9511-9e33003c9e65', 1, '2022-07-21 05:02:57.022000 +00:00', '2022-07-21 05:02:57.022000 +00:00', null, null, 1, '{"dv": 1, "fingerprint": "migration-151"}', null, null, null);
        COMMIT;
    `)
    await knex.raw(`
        BEGIN;
        INSERT INTO "ContactRole" (name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", dv, sender, "createdBy", organization, "updatedBy") VALUES ('contact.role.guest.name', 'b4df6b6c-510b-4aaf-a5a8-caf0dc0769ce', 1, '2022-07-21 05:03:13.375000 +00:00', '2022-07-21 05:03:13.375000 +00:00', null, null, 1, '{"dv": 1, "fingerprint": "migration-151"}', null, null, null);
        COMMIT;
    `)
    await knex.raw(`
        BEGIN;
        INSERT INTO "ContactRole" (name, id, v, "createdAt", "updatedAt", "deletedAt", "newId", dv, sender, "createdBy", organization, "updatedBy") VALUES ('contact.role.owner.name', '405b0304-d204-4613-8af1-a97e832250d5', 1, '2022-07-21 04:33:32.909000 +00:00', '2022-07-21 04:33:32.909000 +00:00', null, null, 1, '{"dv": 1, "fingerprint": "migration-151"}', null, null, null);
        COMMIT;
    `)
}

exports.down = async (knex) => {
    await knex.raw(`
        BEGIN;
        DELETE FROM "ContactRole" where id = 'f9e88ba8-669e-417c-9511-9e33003c9e65';
        COMMIT;
    `)
    await knex.raw(`
        BEGIN;
        DELETE FROM "ContactRole" where id = 'b4df6b6c-510b-4aaf-a5a8-caf0dc0769ce';
        COMMIT;
    `)
    await knex.raw(`
        BEGIN;
        DELETE FROM "ContactRole" where id = '405b0304-d204-4613-8af1-a97e832250d5';
        COMMIT;
    `)
}
