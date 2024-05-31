// auto generated by kmigrator
// KMIGRATOR:0396_remove_banktransaction_bank_transaction_unique_organization_importremotesystem_importid_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMC41IG9uIDIwMjQtMDUtMzAgMTU6MDUKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAzOTVfb3JnYW5pemF0aW9uZW1wbG95ZWVyb2xlX2RlbGV0ZWRhdF9hbmRfbW9yZScpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5SZW1vdmVDb25zdHJhaW50KAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiYW5rdHJhbnNhY3Rpb24nLAogICAgICAgICAgICBuYW1lPSdCYW5rX3RyYW5zYWN0aW9uX3VuaXF1ZV9vcmdhbml6YXRpb25faW1wb3J0UmVtb3RlU3lzdGVtX2ltcG9ydElkJywKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkQ29uc3RyYWludCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nYmFua3RyYW5zYWN0aW9uJywKICAgICAgICAgICAgY29uc3RyYWludD1tb2RlbHMuVW5pcXVlQ29uc3RyYWludChjb25kaXRpb249bW9kZWxzLlEoKCdkZWxldGVkQXRfX2lzbnVsbCcsIFRydWUpKSwgZmllbGRzPSgnb3JnYW5pemF0aW9uJywgJ2FjY291bnQnLCAnaW1wb3J0UmVtb3RlU3lzdGVtJywgJ2ltcG9ydElkJyksIG5hbWU9J0JhbmtfdHJhbnNhY3Rpb25fdW5pcXVlX29yZ2FuaXphdGlvbl9hY2NvdW50X2ltcG9ydFJlbW90ZVN5c3RlbV9pbXBvcnRJZCcpLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;

--
-- [CUSTOM] Set Statement Timeout to some large amount - 25 min (25 * 60 => 1500 sec)
--
SET statement_timeout = '1500s';

--
-- Create constraint Bank_transaction_unique_organization_account_importRemoteSystem_importId on model banktransaction
--
CREATE UNIQUE INDEX IF NOT EXISTS "Bank_transaction_unique_organization_account_importRemoteSystem_importId" ON "BankTransaction" ("organization", "account", "importRemoteSystem", "importId") WHERE "deletedAt" IS NULL;
--
-- Remove constraint Bank_transaction_unique_organization_importRemoteSystem_importId from model banktransaction
--
DROP INDEX IF EXISTS "Bank_transaction_unique_organization_importRemoteSystem_importId";

--
-- [CUSTOM] Revert Statement Timeout to default amount - 10 secs
--
SET statement_timeout = '10s';

COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
-- [CUSTOM]:  We commented out the reverse migration because when running it, an error may occur when creating a prev key
--
-- Create constraint Bank_transaction_unique_organization_account_importRemoteSystem_importId on model banktransaction
--
-- DROP INDEX IF EXISTS "Bank_transaction_unique_organization_account_importRemoteSystem_importId";
--
-- Remove constraint Bank_transaction_unique_organization_importRemoteSystem_importId from model banktransaction
--
-- CREATE UNIQUE INDEX "Bank_transaction_unique_organization_importRemoteSystem_importId" ON "BankTransaction" ("organization", "importRemoteSystem", "importId") WHERE "deletedAt" IS NULL;
COMMIT;

    `)
}
