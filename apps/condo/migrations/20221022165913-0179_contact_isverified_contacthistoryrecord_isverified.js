// auto generated by kmigrator
// KMIGRATOR:0179_contact_isverified_contacthistoryrecord_isverified:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMSBvbiAyMDIyLTEwLTIyIDExOjU5Cgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMTc4X29uYm9hcmRpbmdfb25ib2FyZGluZ191bmlxdWVfdXNlcl90eXBlJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdjb250YWN0JywKICAgICAgICAgICAgbmFtZT0naXNWZXJpZmllZCcsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5Cb29sZWFuRmllbGQoZGVmYXVsdD1GYWxzZSksCiAgICAgICAgICAgIHByZXNlcnZlX2RlZmF1bHQ9RmFsc2UsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdjb250YWN0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2lzVmVyaWZpZWQnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field isVerified to contact
--
ALTER TABLE "Contact" ADD COLUMN "isVerified" boolean DEFAULT false NOT NULL;
ALTER TABLE "Contact" ALTER COLUMN "isVerified" DROP DEFAULT;
--
-- Add field isVerified to contacthistoryrecord
--
ALTER TABLE "ContactHistoryRecord" ADD COLUMN "isVerified" boolean NULL;
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field isVerified to contacthistoryrecord
--
ALTER TABLE "ContactHistoryRecord" DROP COLUMN "isVerified" CASCADE;
--
-- Add field isVerified to contact
--
ALTER TABLE "Contact" DROP COLUMN "isVerified" CASCADE;
COMMIT;

    `)
}
