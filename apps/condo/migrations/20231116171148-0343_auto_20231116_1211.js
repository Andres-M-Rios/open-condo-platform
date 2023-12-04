// auto generated by kmigrator
// KMIGRATOR:0343_auto_20231116_1211:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDMuMSBvbiAyMDIzLTExLTE2IDEyOjExCgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMzQyX2F1dG9fMjAyMzExMTRfMDcyMCcpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5SZW1vdmVDb25zdHJhaW50KAogICAgICAgICAgICBtb2RlbF9uYW1lPSdtZXRlcnJlc291cmNlb3duZXInLAogICAgICAgICAgICBuYW1lPSdtZXRlclJlc291cmNlT3duZXJfdW5pcXVlX29yZ2FuaXphdGlvbl9yZXNvdXJjZV9hZGRyZXNzS2V5JywKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkQ29uc3RyYWludCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nbWV0ZXJyZXNvdXJjZW93bmVyJywKICAgICAgICAgICAgY29uc3RyYWludD1tb2RlbHMuVW5pcXVlQ29uc3RyYWludChjb25kaXRpb249bW9kZWxzLlEoZGVsZXRlZEF0X19pc251bGw9VHJ1ZSksIGZpZWxkcz0oJ3Jlc291cmNlJywgJ2FkZHJlc3NLZXknKSwgbmFtZT0nbWV0ZXJSZXNvdXJjZU93bmVyX3VuaXF1ZV9yZXNvdXJjZV9hZGRyZXNzS2V5JyksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- [CUSTOM] Set Statement Timeout to some large amount - 25 min (25 * 60 => 1500 sec)
--
SET statement_timeout = '1500s';

-- [CUSTOM] clean all old records of the MeterResourceOwner for resolving uniqueness conflicts

DELETE FROM "MeterResourceOwner" WHERE "deletedAt" IS NULL;

--
-- Remove constraint meterResourceOwner_unique_organization_resource_addressKey from model meterresourceowner
--
DROP INDEX IF EXISTS "meterResourceOwner_unique_organization_resource_addressKey";
--
-- Create constraint meterResourceOwner_unique_resource_addressKey on model meterresourceowner
--
CREATE UNIQUE INDEX "meterResourceOwner_unique_resource_addressKey" ON "MeterResourceOwner" ("resource", "addressKey") WHERE "deletedAt" IS NULL;

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
--
-- [CUSTOM] Set Statement Timeout to some large amount - 25 min (25 * 60 => 1500 sec)
--
SET statement_timeout = '1500s';

-- [CUSTOM] clean all old records of the MeterResourceOwner for resolving uniqueness conflicts

DELETE FROM "MeterResourceOwner" WHERE "deletedAt" IS NULL;

--
-- Create constraint meterResourceOwner_unique_resource_addressKey on model meterresourceowner
--
DROP INDEX IF EXISTS "meterResourceOwner_unique_resource_addressKey";
--
-- Remove constraint meterResourceOwner_unique_organization_resource_addressKey from model meterresourceowner
--
CREATE UNIQUE INDEX "meterResourceOwner_unique_organization_resource_addressKey" ON "MeterResourceOwner" ("organization", "resource", "addressKey") WHERE "deletedAt" IS NULL;

--
-- [CUSTOM] Revert Statement Timeout to default amount - 10 secs
--
SET statement_timeout = '10s';

COMMIT;
    `)
}