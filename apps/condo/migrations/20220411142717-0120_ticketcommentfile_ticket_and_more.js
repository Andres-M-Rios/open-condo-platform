// auto generated by kmigrator
// KMIGRATOR:0120_ticketcommentfile_ticket_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMCBvbiAyMDIyLTA0LTExIDA5OjI3Cgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCmltcG9ydCBkamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMTE5X3JlbW92ZV90aWNrZXRjb21tZW50X21ldGFfYW5kX21vcmUnKSwKICAgIF0KCiAgICBvcGVyYXRpb25zID0gWwogICAgICAgIG1pZ3JhdGlvbnMuQWRkRmllbGQoCiAgICAgICAgICAgIG1vZGVsX25hbWU9J3RpY2tldGNvbW1lbnRmaWxlJywKICAgICAgICAgICAgbmFtZT0ndGlja2V0JywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSd0aWNrZXQnLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudGlja2V0JyksCiAgICAgICAgKSwKICAgICAgICBtaWdyYXRpb25zLkFkZEZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSd0aWNrZXRjb21tZW50ZmlsZWhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBuYW1lPSd0aWNrZXQnLAogICAgICAgICAgICBmaWVsZD1tb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSksCiAgICAgICAgKSwKICAgIF0K

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field ticket to ticketcommentfile
--
ALTER TABLE "TicketCommentFile" ADD COLUMN "ticket" uuid NULL CONSTRAINT "TicketCommentFile_ticket_cb16229f_fk_Ticket_id" REFERENCES "Ticket"("id") DEFERRABLE INITIALLY DEFERRED; SET CONSTRAINTS "TicketCommentFile_ticket_cb16229f_fk_Ticket_id" IMMEDIATE;
--
-- Add field ticket to ticketcommentfilehistoryrecord
--
ALTER TABLE "TicketCommentFileHistoryRecord" ADD COLUMN "ticket" uuid NULL;
CREATE INDEX "TicketCommentFile_ticket_cb16229f" ON "TicketCommentFile" ("ticket");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Add field ticket to ticketcommentfilehistoryrecord
--
ALTER TABLE "TicketCommentFileHistoryRecord" DROP COLUMN "ticket" CASCADE;
--
-- Add field ticket to ticketcommentfile
--
ALTER TABLE "TicketCommentFile" DROP COLUMN "ticket" CASCADE;
COMMIT;

    `)
}
