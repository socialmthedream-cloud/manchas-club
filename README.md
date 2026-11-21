# manchas.club · Manchas Stamp Passport

Static site, no build step, no server. Hosted on GitHub Pages with the custom domain in `CNAME`.

- `season.js` holds the season list. Episode codes follow S01EXX.
- To open a stamp when an episode goes public, set `released: true` for that episode.
- To add a magic word, store its fingerprint, never the word: `python3 -c "import hashlib;print(hashlib.sha256(b'manchas:WORD').hexdigest())"` (WORD in capitals).
- `?preview` on the URL opens every episode that has a word, for testing.
- Stamps are kept in the browser's localStorage under `manchas-passport-S01`. Nothing is collected (see `privacy.html`).

Magic words (keep this list private, it is not published by the site: it lives in the project files only): see `/mnt/project-files/site/magic-words.md`.
