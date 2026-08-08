# Exercise seed provenance

The offline catalog is derived from
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
at commit `7455efae41b330c265e7cd4b78dfa848e7ce5ebd`.

The repository's exercise names, categories, body parts, equipment, targets,
secondary muscles, and English instructions are MIT-licensed. `npm run
update:exercise-seed` compacts those fields into local records.

The upstream Gym Visual thumbnails and GIFs remain excluded because their media
license does not transfer with the dataset. Instead, start/end movement photos
come from
[yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) at commit
`b0eed061e1c832b3ed815fbaa4b45b3cdc14df49`, which is released into the public
domain (Unlicense). The seed builder matches those photos to dataset exercises
by normalized name (exact, else the closest same-family variant). **Only the 543
exercises with a photo match are seeded** — image-less rows are dropped so every
catalog entry has artwork. Each seeded record carries a `media_frames` array of
CDN URLs, served from jsDelivr and cross-faded start↔end as a lightweight
animation.

Existing users keep custom exercises and any legacy exercise still referenced by
a plan or logged workout; on launch the seed step prunes image-less catalog
exercises that nothing references. Matching records are upgraded in place, while
new dataset records use stable `dataset-<id>` local identifiers.
