# Exercise seed provenance

The offline catalog is derived from
[hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset)
at commit `7455efae41b330c265e7cd4b78dfa848e7ce5ebd`.

The repository's exercise names, categories, body parts, equipment, targets,
secondary muscles, and English instructions are MIT-licensed. The app compacts
those fields into 1,324 local records with `npm run update:exercise-seed`.

The upstream Gym Visual thumbnails and GIFs are deliberately excluded because
their media license does not transfer with the dataset. GitFit uses its own
movement-specific SVG figures and native-driver animations instead.

Existing users retain legacy exercises referenced by plans or workout history.
Matching records are upgraded in place, while new dataset records use stable
`dataset-<id>` local identifiers.
