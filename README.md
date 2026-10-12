# Progetti Coding

Sito web: https://alexsiroli.github.io/progetti-coding/

Pagina statica (HTML, CSS e JavaScript senza build) con i progetti Snap! delle classi.

- `index.html`, `style.css`, `app.js`: la pagina. I colori, i font e i tempi sono in `:root` di `style.css`.
- `data/<classe>.json`: i progetti di ogni classe (`student` e `projects: [{ name, url }]`).
  Per una classe nuova aggiungi il file e una riga in `CLASSES` in cima ad `app.js`.
- Link diretti: `#<classe>` apre una classe, `#<classe>/<nome-del-gruppo>` apre un progetto.
- `fonts/`: Bungee e Atkinson Hyperlegible Next, licenza SIL OFL (file `OFL-*.txt`).
- `DESIGN.md`: il sistema visivo.

## In locale

```sh
python -m http.server 4108   # poi apri http://localhost:4108
```

## Test

Lo smoke test Playwright avvia da solo il server sulla porta 4108.

```sh
npm install
npx playwright test
```
