// auto generated by kmigrator
// KMIGRATOR:0189_property_addresskey_property_addresssource_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMC4xIG9uIDIwMjItMTEtMTggMTE6MzEKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAxODhfYXV0b18yMDIyMTExN18xMjIxJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdwcm9wZXJ0eScsCiAgICAgICAgICAgIG5hbWU9J2FkZHJlc3NLZXknLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdwcm9wZXJ0eScsCiAgICAgICAgICAgIG5hbWU9J2FkZHJlc3NTb3VyY2UnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdwcm9wZXJ0eWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdhZGRyZXNzS2V5JywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0ncHJvcGVydHloaXN0b3J5cmVjb3JkJywKICAgICAgICAgICAgbmFtZT0nYWRkcmVzc1NvdXJjZScsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J3Jlc2lkZW50JywKICAgICAgICAgICAgbmFtZT0nYWRkcmVzc0tleScsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J3Jlc2lkZW50JywKICAgICAgICAgICAgbmFtZT0nYWRkcmVzc1NvdXJjZScsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J3Jlc2lkZW50aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2FkZHJlc3NLZXknLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdyZXNpZGVudGhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSdhZGRyZXNzU291cmNlJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field addressKey to property
--
ALTER TABLE "Property" ADD COLUMN "addressKey" text NULL;
--
-- Add field addressSource to property
--
ALTER TABLE "Property" ADD COLUMN "addressSource" text NULL;
--
-- Add field addressKey to propertyhistoryrecord
--
ALTER TABLE "PropertyHistoryRecord" ADD COLUMN "addressKey" text NULL;
--
-- Add field addressSource to propertyhistoryrecord
--
ALTER TABLE "PropertyHistoryRecord" ADD COLUMN "addressSource" text NULL;
--
-- Add field addressKey to resident
--
ALTER TABLE "Resident" ADD COLUMN "addressKey" text NULL;
--
-- Add field addressSource to resident
--
ALTER TABLE "Resident" ADD COLUMN "addressSource" text NULL;
--
-- Add field addressKey to residenthistoryrecord
--
ALTER TABLE "ResidentHistoryRecord" ADD COLUMN "addressKey" text NULL;
--
-- Add field addressSource to residenthistoryrecord
--
ALTER TABLE "ResidentHistoryRecord" ADD COLUMN "addressSource" text NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field addressSource to residenthistoryrecord
--
ALTER TABLE "ResidentHistoryRecord" DROP COLUMN "addressSource" CASCADE;
--
-- Add field addressKey to residenthistoryrecord
--
ALTER TABLE "ResidentHistoryRecord" DROP COLUMN "addressKey" CASCADE;
--
-- Add field addressSource to resident
--
ALTER TABLE "Resident" DROP COLUMN "addressSource" CASCADE;
--
-- Add field addressKey to resident
--
ALTER TABLE "Resident" DROP COLUMN "addressKey" CASCADE;
--
-- Add field addressSource to propertyhistoryrecord
--
ALTER TABLE "PropertyHistoryRecord" DROP COLUMN "addressSource" CASCADE;
--
-- Add field addressKey to propertyhistoryrecord
--
ALTER TABLE "PropertyHistoryRecord" DROP COLUMN "addressKey" CASCADE;
--
-- Add field addressSource to property
--
ALTER TABLE "Property" DROP COLUMN "addressSource" CASCADE;
--
-- Add field addressKey to property
--
ALTER TABLE "Property" DROP COLUMN "addressKey" CASCADE;
COMMIT;

    `)
}