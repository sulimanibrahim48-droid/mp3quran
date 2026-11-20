# Architecture
- Keep mushaf timing helpers separate from the reader UI; match timing reads by the exact audio folder so timestamps never apply to a different recording.
- Track the audio surah independently of the displayed page; automatic page turns must not restart playback on pages containing multiple surahs.