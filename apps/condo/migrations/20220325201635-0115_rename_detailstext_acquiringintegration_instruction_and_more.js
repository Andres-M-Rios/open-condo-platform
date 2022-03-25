// auto generated by kmigrator
// KMIGRATOR:0115_rename_detailstext_acquiringintegration_instruction_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMC4yIG9uIDIwMjItMDMtMjUgMTU6MTcKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAxMTRfZGVzY3JpcHRpb25ibG9ja2hpc3RvcnlyZWNvcmRfYW5kX21vcmUnKSwKICAgIF0KCiAgICBvcGVyYXRpb25zID0gWwogICAgICAgIG1pZ3JhdGlvbnMuUmVuYW1lRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2FjcXVpcmluZ2ludGVncmF0aW9uJywKICAgICAgICAgICAgb2xkX25hbWU9J2RldGFpbHNUZXh0JywKICAgICAgICAgICAgbmV3X25hbWU9J2luc3RydWN0aW9uJywKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuUmVuYW1lRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2FjcXVpcmluZ2ludGVncmF0aW9uaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG9sZF9uYW1lPSdkZXRhaWxzVGV4dCcsCiAgICAgICAgICAgIG5ld19uYW1lPSdpbnN0cnVjdGlvbicsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLlJlbmFtZUZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdiaWxsaW5naW50ZWdyYXRpb24nLAogICAgICAgICAgICBvbGRfbmFtZT0nZGV0YWlsc1RleHQnLAogICAgICAgICAgICBuZXdfbmFtZT0naW5zdHJ1Y3Rpb24nLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5SZW5hbWVGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nYmlsbGluZ2ludGVncmF0aW9uaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG9sZF9uYW1lPSdkZXRhaWxzVGV4dCcsCiAgICAgICAgICAgIG5ld19uYW1lPSdpbnN0cnVjdGlvbicsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdhY3F1aXJpbmdpbnRlZ3JhdGlvbicsCiAgICAgICAgICAgIG5hbWU9J2FwcFVybCcsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2FjcXVpcmluZ2ludGVncmF0aW9uaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2FwcFVybCcsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2JpbGxpbmdpbnRlZ3JhdGlvbicsCiAgICAgICAgICAgIG5hbWU9J2FwcFVybCcsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J2JpbGxpbmdpbnRlZ3JhdGlvbmhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdhcHBVcmwnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Rename field detailsText on acquiringintegration to instruction
--
ALTER TABLE "AcquiringIntegration" RENAME COLUMN "detailsText" TO "instruction";
--
-- Rename field detailsText on acquiringintegrationhistoryrecord to instruction
--
ALTER TABLE "AcquiringIntegrationHistoryRecord" RENAME COLUMN "detailsText" TO "instruction";
--
-- Rename field detailsText on billingintegration to instruction
--
ALTER TABLE "BillingIntegration" RENAME COLUMN "detailsText" TO "instruction";
--
-- Rename field detailsText on billingintegrationhistoryrecord to instruction
--
ALTER TABLE "BillingIntegrationHistoryRecord" RENAME COLUMN "detailsText" TO "instruction";
--
-- Add field appUrl to acquiringintegration
--
ALTER TABLE "AcquiringIntegration" ADD COLUMN "appUrl" text NULL;
--
-- Add field appUrl to acquiringintegrationhistoryrecord
--
ALTER TABLE "AcquiringIntegrationHistoryRecord" ADD COLUMN "appUrl" text NULL;
--
-- Add field appUrl to billingintegration
--
ALTER TABLE "BillingIntegration" ADD COLUMN "appUrl" text NULL;
--
-- Add field appUrl to billingintegrationhistoryrecord
--
ALTER TABLE "BillingIntegrationHistoryRecord" ADD COLUMN "appUrl" text NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field appUrl to billingintegrationhistoryrecord
--
ALTER TABLE "BillingIntegrationHistoryRecord" DROP COLUMN "appUrl" CASCADE;
--
-- Add field appUrl to billingintegration
--
ALTER TABLE "BillingIntegration" DROP COLUMN "appUrl" CASCADE;
--
-- Add field appUrl to acquiringintegrationhistoryrecord
--
ALTER TABLE "AcquiringIntegrationHistoryRecord" DROP COLUMN "appUrl" CASCADE;
--
-- Add field appUrl to acquiringintegration
--
ALTER TABLE "AcquiringIntegration" DROP COLUMN "appUrl" CASCADE;
--
-- Rename field detailsText on billingintegrationhistoryrecord to instruction
--
ALTER TABLE "BillingIntegrationHistoryRecord" RENAME COLUMN "instruction" TO "detailsText";
--
-- Rename field detailsText on billingintegration to instruction
--
ALTER TABLE "BillingIntegration" RENAME COLUMN "instruction" TO "detailsText";
--
-- Rename field detailsText on acquiringintegrationhistoryrecord to instruction
--
ALTER TABLE "AcquiringIntegrationHistoryRecord" RENAME COLUMN "instruction" TO "detailsText";
--
-- Rename field detailsText on acquiringintegration to instruction
--
ALTER TABLE "AcquiringIntegration" RENAME COLUMN "instruction" TO "detailsText";
COMMIT;

    `)
}
