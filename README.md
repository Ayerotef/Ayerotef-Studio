# Ayerotef Studio — AYEPOLIS catalog (GitHub Pages)

Public **catalog metadata + posters** for Unity AyeMenu / AYEPOLIS.
No IPTV API keys, no HLS stream URLs. Playback stays on the VPS (`vps-fe73acff.vps.ovh.ca`).

Pages base: `https://ayerotef.github.io/Ayerotef-Studio/`

## Unity AyeMediaConfig — paste these URLs

| Field | URL |
|-------|-----|
| `githubManifestUrl` | `https://ayerotef.github.io/Ayerotef-Studio/AYEPOLIS/manifest.json` |
| `githubConfigurationUrl` | `https://ayerotef.github.io/Ayerotef-Studio/configuration.json` |
| `githubVersionUrl` | `https://ayerotef.github.io/Ayerotef-Studio/version.json` |
| `githubMoviesCategoriesUrl` | `https://ayerotef.github.io/Ayerotef-Studio/categories/movies.json` |
| `githubSeriesCategoriesUrl` | `https://ayerotef.github.io/Ayerotef-Studio/categories/series.json` |
| Poster base (Image Loading) | `https://ayerotef.github.io/Ayerotef-Studio/posters/` |

Raw copies (same strings):

```
https://ayerotef.github.io/Ayerotef-Studio/AYEPOLIS/manifest.json
https://ayerotef.github.io/Ayerotef-Studio/configuration.json
https://ayerotef.github.io/Ayerotef-Studio/version.json
https://ayerotef.github.io/Ayerotef-Studio/categories/movies.json
https://ayerotef.github.io/Ayerotef-Studio/categories/series.json
https://ayerotef.github.io/Ayerotef-Studio/posters/
```

## Layout

```
AYEPOLIS/manifest.json   # CatalogDownloader / vpsCatalogManifest fallback
configuration.json       # githubConfigurationUrl
version.json             # githubVersionUrl
categories/movies.json   # Movie categories (type movies)
categories/series.json   # Series categories (type series)
posters/{posterKey}.jpg  # Allowlist-friendly *.github.io posters
index.html               # Human landing + Unity URL copy helpers
catalog/catalog.json     # Deprecated pointer (legacy parallel arrays removed)
```

## Schema notes (Architecture)

- Nested catalog items live in `AYEPOLIS/manifest.json` (`items[]`), not parallel arrays.
- Item fields: `id`, `type` (`movie`|`series`), `title`, `originalTitle`, `categoryId`, `categoryIds`, `posterKey`, `posterIndex`, `streamIndex`, `description`, `year`, `languages[]`, `seasons[]` (series → episodes).
- `posterKey` resolves to `/posters/{posterKey}` under the Pages host.
- `chunkCount` / `chunk_count` = `0`, `chunks` = `[]`, `streaming` = `false`, `vpsRequiredForPlayback` = `true`.
- Category type tokens accepted by Unity: `movies|movie|vod|0` / `series|serie|1` / `any|all`.
- Empty MovieDetail enrichment (`director`, `cast`, `description`, `duration`) until a metadata pass — genre/year migrated from legacy titles/categories.
- Episode `streamId` is an id placeholder only (same as episode `id`); never an HLS URL.

## GitHub Pages

1. Settings → Pages → **Deploy from a branch**
2. Branch: `main` / folder: `/ (root)`
3. `.nojekyll` is present so paths like `AYEPOLIS/` publish as-is

## Posters

Convention unchanged: `{safePlayId}.jpg` under `/posters/`
(e.g. `AyeSmarterPro_Movies_FR_Oceans_8_2018.jpg`).
