// auto generated by kmigrator
// KMIGRATOR:0126_b2bapp_b2bappaccessrighthistoryrecord_and_more:IyBHZW5lcmF0ZWQgYnkgRGphbmdvIDQuMC4yIG9uIDIwMjItMDQtMjkgMTA6MjkKCmZyb20gZGphbmdvLmRiIGltcG9ydCBtaWdyYXRpb25zLCBtb2RlbHMKaW1wb3J0IGRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24KCgpjbGFzcyBNaWdyYXRpb24obWlncmF0aW9ucy5NaWdyYXRpb24pOgoKICAgIGRlcGVuZGVuY2llcyA9IFsKICAgICAgICAoJ19kamFuZ29fc2NoZW1hJywgJzAxMjVfYXV0b18yMDIyMDQyNV8xMTUyJyksCiAgICBdCgogICAgb3BlcmF0aW9ucyA9IFsKICAgICAgICBtaWdyYXRpb25zLkNyZWF0ZU1vZGVsKAogICAgICAgICAgICBuYW1lPSdiMmJhcHAnLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCdsb2dvJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnc2hvcnREZXNjcmlwdGlvbicsIG1vZGVscy5UZXh0RmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2RldmVsb3BlcicsIG1vZGVscy5UZXh0RmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ3BhcnRuZXJVcmwnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdpbnN0cnVjdGlvbicsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2Nvbm5lY3RlZE1lc3NhZ2UnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdhcHBVcmwnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdpc0hpZGRlbicsIG1vZGVscy5Cb29sZWFuRmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ25hbWUnLCBtb2RlbHMuVGV4dEZpZWxkKCkpLAogICAgICAgICAgICAgICAgKCdhYm91dCcsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2NhdGVnb3J5JywgbW9kZWxzLlRleHRGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2V0dXBCdXR0b25NZXNzYWdlJywgbW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY29udGV4dERlZmF1bHRTdGF0dXMnLCBtb2RlbHMuVGV4dEZpZWxkKCkpLAogICAgICAgICAgICAgICAgKCdpZCcsIG1vZGVscy5VVUlERmllbGQocHJpbWFyeV9rZXk9VHJ1ZSwgc2VyaWFsaXplPUZhbHNlKSksCiAgICAgICAgICAgICAgICAoJ3YnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGRlZmF1bHQ9MSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2RlbGV0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCduZXdJZCcsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSdjcmVhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEJ5JywgbW9kZWxzLkZvcmVpZ25LZXkoYmxhbms9VHJ1ZSwgZGJfY29sdW1uPSd1cGRhdGVkQnknLCBudWxsPVRydWUsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlNFVF9OVUxMLCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEudXNlcicpKSwKICAgICAgICAgICAgXSwKICAgICAgICAgICAgb3B0aW9ucz17CiAgICAgICAgICAgICAgICAnZGJfdGFibGUnOiAnQjJCQXBwJywKICAgICAgICAgICAgfSwKICAgICAgICApLAogICAgICAgIG1pZ3JhdGlvbnMuQ3JlYXRlTW9kZWwoCiAgICAgICAgICAgIG5hbWU9J2IyYmFwcGFjY2Vzc3JpZ2h0aGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ3VzZXInLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdhcHAnLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdpZCcsIG1vZGVscy5VVUlERmllbGQocHJpbWFyeV9rZXk9VHJ1ZSwgc2VyaWFsaXplPUZhbHNlKSksCiAgICAgICAgICAgICAgICAoJ3YnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRCeScsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRCeScsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2RlbGV0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCduZXdJZCcsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfZGF0ZScsIG1vZGVscy5EYXRlVGltZUZpZWxkKCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2FjdGlvbicsIG1vZGVscy5DaGFyRmllbGQoY2hvaWNlcz1bKCdjJywgJ2MnKSwgKCd1JywgJ3UnKSwgKCdkJywgJ2QnKV0sIG1heF9sZW5ndGg9NTApKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9pZCcsIG1vZGVscy5VVUlERmllbGQoZGJfaW5kZXg9VHJ1ZSkpLAogICAgICAgICAgICBdLAogICAgICAgICAgICBvcHRpb25zPXsKICAgICAgICAgICAgICAgICdkYl90YWJsZSc6ICdCMkJBcHBBY2Nlc3NSaWdodEhpc3RvcnlSZWNvcmQnLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYjJiYXBwY29udGV4dGhpc3RvcnlyZWNvcmQnLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCdhcHAnLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdvcmdhbml6YXRpb24nLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdzZXR0aW5ncycsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3N0YXRlJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnc3RhdHVzJywgbW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaWQnLCBtb2RlbHMuVVVJREZpZWxkKHByaW1hcnlfa2V5PVRydWUsIHNlcmlhbGl6ZT1GYWxzZSkpLAogICAgICAgICAgICAgICAgKCd2JywgbW9kZWxzLkludGVnZXJGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuVVVJREZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdkZWxldGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnbmV3SWQnLCBtb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2RhdGUnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9hY3Rpb24nLCBtb2RlbHMuQ2hhckZpZWxkKGNob2ljZXM9WygnYycsICdjJyksICgndScsICd1JyksICgnZCcsICdkJyldLCBtYXhfbGVuZ3RoPTUwKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfaWQnLCBtb2RlbHMuVVVJREZpZWxkKGRiX2luZGV4PVRydWUpKSwKICAgICAgICAgICAgXSwKICAgICAgICAgICAgb3B0aW9ucz17CiAgICAgICAgICAgICAgICAnZGJfdGFibGUnOiAnQjJCQXBwQ29udGV4dEhpc3RvcnlSZWNvcmQnLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYjJiYXBwaGlzdG9yeXJlY29yZCcsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ2xvZ28nLCBtb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdzaG9ydERlc2NyaXB0aW9uJywgbW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGV2ZWxvcGVyJywgbW9kZWxzLlRleHRGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgncGFydG5lclVybCcsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2luc3RydWN0aW9uJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY29ubmVjdGVkTWVzc2FnZScsIG1vZGVscy5KU09ORmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2FwcFVybCcsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2lzSGlkZGVuJywgbW9kZWxzLkJvb2xlYW5GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnbmFtZScsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2Fib3V0JywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY2F0ZWdvcnknLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdzZXR1cEJ1dHRvbk1lc3NhZ2UnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdjb250ZXh0RGVmYXVsdFN0YXR1cycsIG1vZGVscy5UZXh0RmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2lkJywgbW9kZWxzLlVVSURGaWVsZChwcmltYXJ5X2tleT1UcnVlLCBzZXJpYWxpemU9RmFsc2UpKSwKICAgICAgICAgICAgICAgICgndicsIG1vZGVscy5JbnRlZ2VyRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2NyZWF0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnY3JlYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEJ5JywgbW9kZWxzLlVVSURGaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnZGVsZXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ25ld0lkJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnaGlzdG9yeV9kYXRlJywgbW9kZWxzLkRhdGVUaW1lRmllbGQoKSksCiAgICAgICAgICAgICAgICAoJ2hpc3RvcnlfYWN0aW9uJywgbW9kZWxzLkNoYXJGaWVsZChjaG9pY2VzPVsoJ2MnLCAnYycpLCAoJ3UnLCAndScpLCAoJ2QnLCAnZCcpXSwgbWF4X2xlbmd0aD01MCkpLAogICAgICAgICAgICAgICAgKCdoaXN0b3J5X2lkJywgbW9kZWxzLlVVSURGaWVsZChkYl9pbmRleD1UcnVlKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ0IyQkFwcEhpc3RvcnlSZWNvcmQnLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYjJiYXBwY29udGV4dCcsCiAgICAgICAgICAgIGZpZWxkcz1bCiAgICAgICAgICAgICAgICAoJ3NldHRpbmdzJywgbW9kZWxzLkpTT05GaWVsZChibGFuaz1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgnc3RhdGUnLCBtb2RlbHMuSlNPTkZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdzdGF0dXMnLCBtb2RlbHMuVGV4dEZpZWxkKGJsYW5rPVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCdpZCcsIG1vZGVscy5VVUlERmllbGQocHJpbWFyeV9rZXk9VHJ1ZSwgc2VyaWFsaXplPUZhbHNlKSksCiAgICAgICAgICAgICAgICAoJ3YnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGRlZmF1bHQ9MSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2RlbGV0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCduZXdJZCcsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnYXBwJywgbW9kZWxzLkZvcmVpZ25LZXkoZGJfY29sdW1uPSdhcHAnLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5QUk9URUNULCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEuYjJiYXBwJykpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J2NyZWF0ZWRCeScsIG51bGw9VHJ1ZSwgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uU0VUX05VTEwsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICAgICAgKCdvcmdhbml6YXRpb24nLCBtb2RlbHMuRm9yZWlnbktleShkYl9jb2x1bW49J29yZ2FuaXphdGlvbicsIG9uX2RlbGV0ZT1kamFuZ28uZGIubW9kZWxzLmRlbGV0aW9uLlBST1RFQ1QsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS5vcmdhbml6YXRpb24nKSksCiAgICAgICAgICAgICAgICAoJ3VwZGF0ZWRCeScsIG1vZGVscy5Gb3JlaWduS2V5KGJsYW5rPVRydWUsIGRiX2NvbHVtbj0ndXBkYXRlZEJ5JywgbnVsbD1UcnVlLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5TRVRfTlVMTCwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLnVzZXInKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ0IyQkFwcENvbnRleHQnLAogICAgICAgICAgICB9LAogICAgICAgICksCiAgICAgICAgbWlncmF0aW9ucy5DcmVhdGVNb2RlbCgKICAgICAgICAgICAgbmFtZT0nYjJiYXBwYWNjZXNzcmlnaHQnLAogICAgICAgICAgICBmaWVsZHM9WwogICAgICAgICAgICAgICAgKCdpZCcsIG1vZGVscy5VVUlERmllbGQocHJpbWFyeV9rZXk9VHJ1ZSwgc2VyaWFsaXplPUZhbHNlKSksCiAgICAgICAgICAgICAgICAoJ3YnLCBtb2RlbHMuSW50ZWdlckZpZWxkKGRlZmF1bHQ9MSkpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQXQnLCBtb2RlbHMuRGF0ZVRpbWVGaWVsZChibGFuaz1UcnVlLCBkYl9pbmRleD1UcnVlLCBudWxsPVRydWUpKSwKICAgICAgICAgICAgICAgICgndXBkYXRlZEF0JywgbW9kZWxzLkRhdGVUaW1lRmllbGQoYmxhbms9VHJ1ZSwgZGJfaW5kZXg9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2RlbGV0ZWRBdCcsIG1vZGVscy5EYXRlVGltZUZpZWxkKGJsYW5rPVRydWUsIGRiX2luZGV4PVRydWUsIG51bGw9VHJ1ZSkpLAogICAgICAgICAgICAgICAgKCduZXdJZCcsIG1vZGVscy5VVUlERmllbGQoYmxhbms9VHJ1ZSwgbnVsbD1UcnVlKSksCiAgICAgICAgICAgICAgICAoJ2R2JywgbW9kZWxzLkludGVnZXJGaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnc2VuZGVyJywgbW9kZWxzLkpTT05GaWVsZCgpKSwKICAgICAgICAgICAgICAgICgnYXBwJywgbW9kZWxzLkZvcmVpZ25LZXkoZGJfY29sdW1uPSdhcHAnLCBvbl9kZWxldGU9ZGphbmdvLmRiLm1vZGVscy5kZWxldGlvbi5QUk9URUNULCByZWxhdGVkX25hbWU9JysnLCB0bz0nX2RqYW5nb19zY2hlbWEuYjJiYXBwJykpLAogICAgICAgICAgICAgICAgKCdjcmVhdGVkQnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J2NyZWF0ZWRCeScsIG51bGw9VHJ1ZSwgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uU0VUX05VTEwsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICAgICAgKCd1cGRhdGVkQnknLCBtb2RlbHMuRm9yZWlnbktleShibGFuaz1UcnVlLCBkYl9jb2x1bW49J3VwZGF0ZWRCeScsIG51bGw9VHJ1ZSwgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uU0VUX05VTEwsIHJlbGF0ZWRfbmFtZT0nKycsIHRvPSdfZGphbmdvX3NjaGVtYS51c2VyJykpLAogICAgICAgICAgICAgICAgKCd1c2VyJywgbW9kZWxzLkZvcmVpZ25LZXkoZGJfY29sdW1uPSd1c2VyJywgb25fZGVsZXRlPWRqYW5nby5kYi5tb2RlbHMuZGVsZXRpb24uUFJPVEVDVCwgcmVsYXRlZF9uYW1lPScrJywgdG89J19kamFuZ29fc2NoZW1hLnVzZXInKSksCiAgICAgICAgICAgIF0sCiAgICAgICAgICAgIG9wdGlvbnM9ewogICAgICAgICAgICAgICAgJ2RiX3RhYmxlJzogJ0IyQkFwcEFjY2Vzc1JpZ2h0JywKICAgICAgICAgICAgfSwKICAgICAgICApLAogICAgXQo=

exports.up = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model b2bapp
--
CREATE TABLE "B2BApp" ("logo" jsonb NULL, "shortDescription" text NOT NULL, "developer" text NOT NULL, "partnerUrl" text NULL, "instruction" text NULL, "connectedMessage" text NULL, "appUrl" text NULL, "isHidden" boolean NOT NULL, "name" text NOT NULL, "about" jsonb NULL, "category" text NOT NULL, "setupButtonMessage" text NULL, "contextDefaultStatus" text NOT NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "dv" integer NOT NULL, "sender" jsonb NOT NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL);
--
-- Create model b2bappaccessrighthistoryrecord
--
CREATE TABLE "B2BAppAccessRightHistoryRecord" ("user" uuid NULL, "app" uuid NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Create model b2bappcontexthistoryrecord
--
CREATE TABLE "B2BAppContextHistoryRecord" ("app" uuid NULL, "organization" uuid NULL, "settings" jsonb NULL, "state" jsonb NULL, "status" text NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Create model b2bapphistoryrecord
--
CREATE TABLE "B2BAppHistoryRecord" ("logo" jsonb NULL, "shortDescription" text NULL, "developer" text NULL, "partnerUrl" text NULL, "instruction" jsonb NULL, "connectedMessage" jsonb NULL, "appUrl" text NULL, "isHidden" boolean NULL, "name" text NULL, "about" jsonb NULL, "category" text NULL, "setupButtonMessage" text NULL, "contextDefaultStatus" text NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "deletedAt" timestamp with time zone NULL, "newId" jsonb NULL, "history_date" timestamp with time zone NOT NULL, "history_action" varchar(50) NOT NULL, "history_id" uuid NOT NULL);
--
-- Create model b2bappcontext
--
CREATE TABLE "B2BAppContext" ("settings" jsonb NULL, "state" jsonb NULL, "status" text NULL, "id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "dv" integer NOT NULL, "sender" jsonb NOT NULL, "app" uuid NOT NULL, "createdBy" uuid NULL, "organization" uuid NOT NULL, "updatedBy" uuid NULL);
--
-- Create model b2bappaccessright
--
CREATE TABLE "B2BAppAccessRight" ("id" uuid NOT NULL PRIMARY KEY, "v" integer NOT NULL, "createdAt" timestamp with time zone NULL, "updatedAt" timestamp with time zone NULL, "deletedAt" timestamp with time zone NULL, "newId" uuid NULL, "dv" integer NOT NULL, "sender" jsonb NOT NULL, "app" uuid NOT NULL, "createdBy" uuid NULL, "updatedBy" uuid NULL, "user" uuid NOT NULL);
ALTER TABLE "B2BApp" ADD CONSTRAINT "B2BApp_createdBy_01e4414e_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BApp" ADD CONSTRAINT "B2BApp_updatedBy_62aeb175_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "B2BApp_createdAt_b34d8040" ON "B2BApp" ("createdAt");
CREATE INDEX "B2BApp_updatedAt_20e3e28b" ON "B2BApp" ("updatedAt");
CREATE INDEX "B2BApp_deletedAt_4e5bc96b" ON "B2BApp" ("deletedAt");
CREATE INDEX "B2BApp_createdBy_01e4414e" ON "B2BApp" ("createdBy");
CREATE INDEX "B2BApp_updatedBy_62aeb175" ON "B2BApp" ("updatedBy");
CREATE INDEX "B2BAppAccessRightHistoryRecord_history_id_b5b2a19e" ON "B2BAppAccessRightHistoryRecord" ("history_id");
CREATE INDEX "B2BAppContextHistoryRecord_history_id_06aa81a4" ON "B2BAppContextHistoryRecord" ("history_id");
CREATE INDEX "B2BAppHistoryRecord_history_id_85c30f5b" ON "B2BAppHistoryRecord" ("history_id");
ALTER TABLE "B2BAppContext" ADD CONSTRAINT "B2BAppContext_app_a8807295_fk_B2BApp_id" FOREIGN KEY ("app") REFERENCES "B2BApp" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppContext" ADD CONSTRAINT "B2BAppContext_createdBy_e9e64528_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppContext" ADD CONSTRAINT "B2BAppContext_organization_29a88cbf_fk_Organization_id" FOREIGN KEY ("organization") REFERENCES "Organization" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppContext" ADD CONSTRAINT "B2BAppContext_updatedBy_d7742ded_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "B2BAppContext_createdAt_b966fea4" ON "B2BAppContext" ("createdAt");
CREATE INDEX "B2BAppContext_updatedAt_b41498a3" ON "B2BAppContext" ("updatedAt");
CREATE INDEX "B2BAppContext_deletedAt_9aa37926" ON "B2BAppContext" ("deletedAt");
CREATE INDEX "B2BAppContext_app_a8807295" ON "B2BAppContext" ("app");
CREATE INDEX "B2BAppContext_createdBy_e9e64528" ON "B2BAppContext" ("createdBy");
CREATE INDEX "B2BAppContext_organization_29a88cbf" ON "B2BAppContext" ("organization");
CREATE INDEX "B2BAppContext_updatedBy_d7742ded" ON "B2BAppContext" ("updatedBy");
ALTER TABLE "B2BAppAccessRight" ADD CONSTRAINT "B2BAppAccessRight_app_34c967dd_fk_B2BApp_id" FOREIGN KEY ("app") REFERENCES "B2BApp" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppAccessRight" ADD CONSTRAINT "B2BAppAccessRight_createdBy_4586e0be_fk_User_id" FOREIGN KEY ("createdBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppAccessRight" ADD CONSTRAINT "B2BAppAccessRight_updatedBy_c27a0c0b_fk_User_id" FOREIGN KEY ("updatedBy") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE "B2BAppAccessRight" ADD CONSTRAINT "B2BAppAccessRight_user_dd0186ec_fk_User_id" FOREIGN KEY ("user") REFERENCES "User" ("id") DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX "B2BAppAccessRight_createdAt_65502933" ON "B2BAppAccessRight" ("createdAt");
CREATE INDEX "B2BAppAccessRight_updatedAt_be7f68fc" ON "B2BAppAccessRight" ("updatedAt");
CREATE INDEX "B2BAppAccessRight_deletedAt_fa0aea4e" ON "B2BAppAccessRight" ("deletedAt");
CREATE INDEX "B2BAppAccessRight_app_34c967dd" ON "B2BAppAccessRight" ("app");
CREATE INDEX "B2BAppAccessRight_createdBy_4586e0be" ON "B2BAppAccessRight" ("createdBy");
CREATE INDEX "B2BAppAccessRight_updatedBy_c27a0c0b" ON "B2BAppAccessRight" ("updatedBy");
CREATE INDEX "B2BAppAccessRight_user_dd0186ec" ON "B2BAppAccessRight" ("user");
COMMIT;

    `)
}

exports.down = async (knex) => {
    await knex.raw(`
    BEGIN;
--
-- Create model b2bappaccessright
--
DROP TABLE "B2BAppAccessRight" CASCADE;
--
-- Create model b2bappcontext
--
DROP TABLE "B2BAppContext" CASCADE;
--
-- Create model b2bapphistoryrecord
--
DROP TABLE "B2BAppHistoryRecord" CASCADE;
--
-- Create model b2bappcontexthistoryrecord
--
DROP TABLE "B2BAppContextHistoryRecord" CASCADE;
--
-- Create model b2bappaccessrighthistoryrecord
--
DROP TABLE "B2BAppAccessRightHistoryRecord" CASCADE;
--
-- Create model b2bapp
--
DROP TABLE "B2BApp" CASCADE;
COMMIT;

    `)
}
