// auto generated by kmigrator
// KMIGRATOR:0090_alter_meterreadingsource_type:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMCBvbiAyMDIxLTEyLTE1IDIxOjEwCgpmcm9tIGRqYW5nby5kYiBpbXBvcnQgbWlncmF0aW9ucywgbW9kZWxzCgoKY2xhc3MgTWlncmF0aW9uKG1pZ3JhdGlvbnMuTWlncmF0aW9uKToKCiAgICBkZXBlbmRlbmNpZXMgPSBbCiAgICAgICAgKCdfZGphbmdvX3NjaGVtYScsICcwMDg5X2F1dG9fMjAyMTEyMTNfMTMwNicpLAogICAgXQoKICAgIG9wZXJhdGlvbnMgPSBbCiAgICAgICAgbWlncmF0aW9ucy5BbHRlckZpZWxkKAogICAgICAgICAgICBtb2RlbF9uYW1lPSdtZXRlcnJlYWRpbmdzb3VyY2UnLAogICAgICAgICAgICBuYW1lPSd0eXBlJywKICAgICAgICAgICAgZmllbGQ9bW9kZWxzLkNoYXJGaWVsZChjaG9pY2VzPVsoJ2NhbGwnLCAnY2FsbCcpLCAoJ21vYmlsZV9hcHAnLCAnbW9iaWxlX2FwcCcpLCAoJ2ltcG9ydF9jb25kbycsICdpbXBvcnRfY29uZG8nKV0sIG1heF9sZW5ndGg9NTApLAogICAgICAgICksCiAgICBdCg==

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field type on meterreadingsource
--
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Alter field type on meterreadingsource
--
COMMIT;

    `)
}
