// auto generated by kmigrator
// KMIGRATOR:0004_auto_20200529_1929:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDMuMC42IG9uIDIwMjAtMDUtMjkgMTk6MjkKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMDAzX2F1dG9fMjAyMDA1MjlfMTkyNCcpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5SZW5hbWVGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ndGVzdCcsCiAgICAgICAgICAgIG9sZF9uYW1lPSdzdGF0dXMnLAogICAgICAgICAgICBuZXdfbmFtZT0nc3RhdHVzX3JlbmFtZWQnLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Rename field status on test to status_renamed
--
ALTER TABLE "Test" RENAME COLUMN "status" TO "status_renamed";
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Rename field status on test to status_renamed
--
ALTER TABLE "Test" RENAME COLUMN "status_renamed" TO "status";
COMMIT;

    `)
}
