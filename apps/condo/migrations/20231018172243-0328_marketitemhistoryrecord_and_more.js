// auto generated by kmigrator
// KMIGRATOR:0328_marketitemhistoryrecord_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMi4zIG9uIDIwMjMtMTAtMTggMTI6MjMKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKaW1wb3J0IGRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24KCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAzMjdfbWFya2V0Y2F0ZWdvcnloaXN0b3J5cmVjb3JkX21hcmtldGNhdGVnb3J5JyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSdtYXJrZXRpdGVtaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ25hbWUnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdtYXJrZXRDYXRlZ29yeScsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3NrdScsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2Rlc2NyaXB0aW9uJywgbW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnb3JnYW5pemF0aW9uJywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaWQnLCBtb2RlbHMuVVVJREZpZWxkKHByaW1hcnlfa2V5PVRydWUsIHNlcmlhbGl6ZT1GYWxzZSkpLAogICAgICAgICAgICAgICAgKCd2JywgbW9kZWxzLkludGVnZXJGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkZWxldGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnbmV3SWQnLCBtb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkdicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3NlbmRlcicsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfZGF0ZScsIG1vZGVscy5EYXRlVGltZUZpZWxkKCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2FjdGlvbicsIG1vZGVscy5DaGFyRmllbGQoY2hvaWNlcz1bKCdjJywgJ2MnKSwgKCd1JywgJ3UnKSwgKCdkJywgJ2QnKV0sIG1heF9sZW5ndGg9NTApKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9pZCcsIG1vZGVscy5VVUlERmllbGQoZGJfaW5kZXg9VHJ1ZSkpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdNYXJrZXRJdGVtSGlzdG9yeVJlY29yZCcsCiAgICAgICAgICAgIH0sCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdvcmdhbml6YXRpb25lbXBsb3llZXJvbGUnLAogICAgICAgICAgICBuYW1lPSdjYW5NYW5hZ2VNYXJrZXRJdGVtcycsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5Cb29sZWFuRmllbGQoZGVmYXVsdD1GYWxzZSksCiAgICAgICAgICAgIHByZXNlcnZlX2RlZmF1bHQ9RmFsc2UsCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdvcmdhbml6YXRpb25lbXBsb3llZXJvbGUnLAogICAgICAgICAgICBuYW1lPSdjYW5SZWFkTWFya2V0SXRlbXMnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuQm9vbGVhbkZpZWxkKGRlZmF1bHQ9RmFsc2UpLAogICAgICAgICAgICBwcmVzZXJ2ZV9kZWZhdWx0PUZhbHNlLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nb3JnYW5pemF0aW9uZW1wbG95ZWVyb2xlaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2Nhbk1hbmFnZU1hcmtldEl0ZW1zJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkJvb2xlYW5GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpLAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRGaWVsZCgKICAgICAgICAgICAgbW9kZWxfbmFtZT0nb3JnYW5pemF0aW9uZW1wbG95ZWVyb2xlaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIG5hbWU9J2NhblJlYWRNYXJrZXRJdGVtcycsCiAgICAgICAgICAgIGZpZWxkPW1vZGVscy5Cb29sZWFuRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQ3JlYXRlTW9kZWwoCiAgICAgICAgICAgIG5hbWU9J21hcmtldGl0ZW0nLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCduYW1lJywgbW9kZWxzLlRleHRGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2t1JywgbW9kZWxzLlRleHRGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnZGVzY3JpcHRpb24nLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdpZCcsIG1vZGVscy5VVUlERmllbGQocHJpbWFyeV9rZXk9VHJ1ZSwgc2VyaWFsaXplPUZhbHNlKSksCiAgICAgICAgICAgICAgICAoJ3YnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGRlZmF1bHQ9MSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2RlbGV0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCduZXdJZCcsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSdjcmVhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgICAgICgnbWFya2V0Q2F0ZWdvcnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J21hcmtldENhdGVnb3J5JywgbnVsbD1UcnVlLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5TRVRfTlVMTCwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLm1hcmtldGNhdGVnb3J5JykpLAogICAgICAgICAgICAgICAgKCdvcmdhbml6YXRpb24nLCBtb2RlbHMuRm9yZWlnbktleShkYl9jb2x1bW49J29yZ2FuaXphdGlvbicsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLkNBU0NBREUsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS5vcmdhbml6YXRpb24nKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRCeScsIG1vZGVscy5Gb3JlaWduS2V5KGJsYW5rPVRydWUsIGRiX2NvbHVtbj0ndXBkYXRlZEJ5JywgbnVsbD1UcnVlLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5TRVRfTlVMTCwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLnVzZXInKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ01hcmtldEl0ZW0nLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5BZGRDb25zdHJhaW50KAogICAgICAgICAgICBtb2RlbF9uYW1lPSdtYXJrZXRpdGVtJywKICAgICAgICAgICAgY29uc3RyYWludD1tb2RlbHMuVW5pcXVlQ29uc3RyYWludChjb25kaXRpb249bW9kZWxzLlEoKCdkZWxldGVkQXRfX2lzbnVsbCcsIFRydWUpKSwgZmllbGRzPSgnb3JnYW5pemF0aW9uJywgJ3NrdScpLCBuYW1lPSdNYXJrZXRJdGVtX3VuaXF1ZV9vcmdhbml6YXRpb25fc2t1JyksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model marketitemhistoryrecord
--
CREATE TABLE "MarketItemHistoryRecord" ("name" text NULL, "marketCategory" uuid NULL, "sku" text NULL, "description" text NULL, "organization" uuid NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "dv" integer NULL, "sender" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Add field canManageMarketItems to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" ADD COLUMN "canManageMarketItems" boolean DEFAULT false NOT NULL;
ALTER TABLE "OrganizationEmployeeRole" ALTER COLUMN "canManageMarketItems" DROP DEFAULT;
--
-- Add field canReadMarketItems to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" ADD COLUMN "canReadMarketItems" boolean DEFAULT false NOT NULL;
ALTER TABLE "OrganizationEmployeeRole" ALTER COLUMN "canReadMarketItems" DROP DEFAULT;
--
-- Add field canManageMarketItems to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" ADD COLUMN "canManageMarketItems" boolean NULL;
--
-- Add field canReadMarketItems to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" ADD COLUMN "canReadMarketItems" boolean NULL;
--
-- Create model marketitem
--
CREATE TABLE "MarketItem" ("name" text NOT NULL, "sku" text NOT NULL, "description" text NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "dv" integer NOT NULL, "sender" jsonb NOT NULL, "createdBy" uuid NULL, "marketCategory" uuid NULL, "organization" uuid NOT NULL, "updatedBy" uuid NULL);
--
-- Create constraint MarketItem_unique_organization_sku on model marketitem
--
CREATE UNIQUE INDEX "MarketItem_unique_organization_sku" ON "MarketItem" ("organization", "sku") WHERE "deletedAt" IS NULL;
CREATE INDEX "MarketItemHistoryRecord_history_id_cfc0aa70" ON "MarketItemHistoryRecord" ("history_id");
ALTER TABLE "MarketItem" ADD CONSTRAINT "MarketItem_createdBy_8f8ec790_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "MarketItem" ADD CONSTRAINT "MarketItem_marketCategory_28f67392_fk_MarketCategory_id" FOREIGN KEY ("marketCategory") REFERENCES "MarketCategory" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "MarketItem" ADD CONSTRAINT "MarketItem_organization_e12b1420_fk_Organization_id" FOREIGN KEY ("organization") REFERENCES "Organization" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "MarketItem" ADD CONSTRAINT "MarketItem_updatedBy_c2fe231d_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "MarketItem_createdAt_9d201bc0" ON "MarketItem" ("createdAt");
CREATE INDEX "MarketItem_updatedAt_334eaa59" ON "MarketItem" ("updatedAt");
CREATE INDEX "MarketItem_deletedAt_778bd67e" ON "MarketItem" ("deletedAt");
CREATE INDEX "MarketItem_createdBy_8f8ec790" ON "MarketItem" ("createdBy");
CREATE INDEX "MarketItem_marketCategory_28f67392" ON "MarketItem" ("marketCategory");
CREATE INDEX "MarketItem_organization_e12b1420" ON "MarketItem" ("organization");
CREATE INDEX "MarketItem_updatedBy_c2fe231d" ON "MarketItem" ("updatedBy");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create constraint MarketItem_unique_organization_sku on model marketitem
--
DROP INDEX IF EXISTS "MarketItem_unique_organization_sku";
--
-- Create model marketitem
--
DROP TABLE "MarketItem" CASCADE;
--
-- Add field canReadMarketItems to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" DROP COLUMN "canReadMarketItems" CASCADE;
--
-- Add field canManageMarketItems to organizationemployeerolehistoryrecord
--
ALTER TABLE "OrganizationEmployeeRoleHistoryRecord" DROP COLUMN "canManageMarketItems" CASCADE;
--
-- Add field canReadMarketItems to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" DROP COLUMN "canReadMarketItems" CASCADE;
--
-- Add field canManageMarketItems to organizationemployeerole
--
ALTER TABLE "OrganizationEmployeeRole" DROP COLUMN "canManageMarketItems" CASCADE;
--
-- Create model marketitemhistoryrecord
--
DROP TABLE "MarketItemHistoryRecord" CASCADE;
COMMIT;

    `)
}
