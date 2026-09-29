---
name: Progetti Coding
description: Luna park a blocchi Snap! su carta a quadretti
colors:
  paper: "#F4EAD5"
  paper-2: "#FBF6EA"
  ink: "#1E2350"
  ink-2: "#4A4F72"
  snap-control: "#E6A822"
  snap-motion: "#4A6CD4"
  snap-looks: "#8753DE"
  snap-operators: "#62C213"
  snap-variables: "#F3761D"
  snap-pen: "#00A178"
  flag: "#2BA84A"
  flag-deep: "#1D7A34"
  glow: "#FFE46B"
  slot: "#FFFDF8"
  dark-paper: "#221D18"
  dark-paper-2: "#2E2821"
  dark-ink: "#F3ECDD"
  dark-ink-2: "#C8BCA8"
typography:
  sign:
    fontFamily: "Bungee, Arial Black, sans-serif"
    fontSize: "clamp(2.75rem, 1rem + 5.4vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  pavilion-code:
    fontFamily: "Bungee, Arial Black, sans-serif"
    fontSize: "clamp(3.5rem, 2.4rem + 2.6vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 0.8
  heading:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
  block-label:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 800
    lineHeight: 1.2
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  block: "8px"
  card: "16px"
  slot: "999px"
spacing:
  unit: "8px"
  gutter: "16px"
  square: "24px"
  section: "64px"
components:
  project-block:
    backgroundColor: "{colors.snap-motion}"
    textColor: "{colors.slot}"
    rounded: "{rounded.block}"
    padding: "21px 14px"
  slot:
    backgroundColor: "{colors.slot}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slot}"
    padding: "2px 12px"
  button:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slot}"
    height: "48px"
  search-slot:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.slot}"
    height: "52px"
---

# Design System: Progetti Coding

## Overview

La bacheca di fine corso e' un luna park costruito con i blocchi di Snap!. Ogni classe e'
un padiglione con la tenda a strisce; ogni progetto e' un blocco comando che si incastra
nel successivo, cosi' la griglia si legge come colonne di script. Il fondo e' carta calda
con i quadretti blu del quaderno di scuola. Il colore arriva in campi pieni (padiglioni e
blocchi), mai come puntini sparsi. Il pubblico sono bambini e famiglie: tutto e' grande,
leggibile e usabile da tastiera; il gioco sta nei materiali, non nel disordine.

## Colors

### Primary
Le categorie di Snap!, ciascuna con il suo colore di testo per il contrasto AA:
controllo `#E6A822` (testo inchiostro), movimento `#4A6CD4` (testo bianco), aspetto
`#8753DE` (testo bianco; e' il `#8F56E3` di Snap! scurito quanto basta per il bianco),
operatori `#62C213`, variabili `#F3761D`, penna `#00A178` (testo inchiostro). Suono,
sensori e liste non si usano: con nessuno dei due testi arrivano a 4,5:1.

### Neutral
Carta `#F4EAD5`, foglio `#FBF6EA`, quadretti `rgb(74 108 212 / .13)` ogni 24 px,
inchiostro blu penna `#1E2350`, inchiostro secondario `#4A4F72`, linee
`rgb(30 35 80 / .16)`. Gli slot bianchi dentro i blocchi sono `#FFFDF8` in entrambi i temi.

### Accenti di stato
Bandiera verde `#2BA84A` / `#1D7A34`; anello "in esecuzione" giallo `#FFE46B`.

### Tema scuro
Segue `prefers-color-scheme` (non richiesto dal brief, aggiunto perche' la pagina e'
pubblica e spesso aperta di sera dai genitori): cartoncino scuro caldo `#221D18`, foglio
`#2E2821`, inchiostro `#F3ECDD`, secondario `#C8BCA8`, quadretti blu
`rgb(130 160 240 / .10)`. I blocchi e le tende non cambiano colore.

### Named Rules
- **Un campo, un colore.** Ogni padiglione e ogni blocco e' pieno di un solo colore di
  categoria; il testo sopra e' `--on` della categoria, mai grigio.
- **Colori in fila.** Nella pagina classe i blocchi prendono i sei colori in ordine,
  partendo da quello della classe: su tre colonne ogni colonna alterna due colori.

## Typography

Bungee (insegne a blocchi, OFL) solo per il titolo, i codici classe e le iniziali.
Atkinson Hyperlegible Next (variabile 200-800, OFL) per tutto il resto: distingue I, l e 1
e regge bene i nomi dei bambini. Font self-host in `fonts/`, `font-display: swap`,
precaricati.

### Hierarchy
- Titolo home: Bungee `clamp(2.75rem, ... , 5.5rem)`, "CODING" in blu movimento.
- Codice classe: Bungee fino a 5.25rem nel padiglione, 6rem nell'intestazione classe.
  La lettera della sezione ("A", "O") sta in un tassello bianco (`.pav-sec`, Atkinson 800):
  in Bungee "2O" si leggerebbe "20".
- Titoli di sezione: Atkinson 800, 1.5rem (1.25rem su telefono).
- Nomi nei blocchi: Atkinson 800, 1.1875rem; titolo del progetto 500, 0.9375rem.
- Testo: Atkinson 400, 1.0625rem / 1.5; sottotitolo home 1.25rem in `ink-2`.

## Layout

Contenitore `min(100% - 32px, 1240px)`. Unita' 8 px, quadretto 24 px.
- **Home:** titolo a sinistra, script "come funziona" a destra; sotto, padiglioni 3x2
  (2 colonne sotto 1080 px; sotto 560 px una colonna di padiglioni bassi, perche' a due
  colonne ogni padiglione superava i 260 px).
- **Classe:** colonna di 272 px (selettore classi in colonna, ricerca e blocco cappello;
  appiccicosa se lo schermo e' alto almeno 760 px) e griglia `auto-fill minmax(264px, 1fr)` senza spazio verticale: i blocchi
  si sovrappongono di 7 px cosi' la linguetta entra nell'incavo. Sotto 760 px una sola
  colonna; il selettore diventa una riga scorrevole.
- **Dialog:** largo `min(760px, 100vw - 32px, (100dvh - 190px) * 1.14)`, palco 480:420.

## Elevation & Depth

Ombre morbide tinte d'inchiostro, sempre con scostamento e sfocatura:
padiglioni `drop-shadow(0 10px 14px rgb(30 35 80 / .16))` (in hover 0 16px 18px / .22),
griglia dei blocchi `drop-shadow(0 8px 10px ... / .14)`, dialog
`0 30px 60px -20px rgb(0 0 0 / .5)`. La tenda proietta un'ombra interna sul padiglione
(`inset 0 14px 10px -10px rgb(0 0 0 / .18)`). Niente ombre piene senza sfocatura, niente aloni.

## Shapes

- Blocchi: raggio 8 px, incavo in alto a 20 px dal bordo (32 x 7 px), linguetta sotto
  della stessa misura; forma fatta con `clip-path` su `::before` e `::after`.
- Blocco cappello: cupola ellittica 120 x 44 px disegnata come sfondo dell'elemento.
- Padiglioni e dialog: 16 px (12 px su telefono).
- Slot, pulsanti, ricerca, iniziali: pillola piena.

## Components

### Blocco progetto (firma)
Link `a.block.proj`: iniziali in uno slot tondo, nome del gruppo, titolo del progetto solo
se diverso da "Progetto Snap!", pillola "Avvia" con la bandiera. Hover (solo puntatore fine) sale di 3 px; press
`scale(.98)`. Durante il trascinamento: bordo interno bianco (`drop-target`), poi anello
giallo e pillola verde (`running`).

### Padiglione
Link `a.stall.pav`: tenda a strisce colore scuro/bianco con smerlo (maschera radiale da
24 px), corpo pieno con codice classe, scuola, slot "N progetti", edizione, anno.

### Blocco cappello
"quando si clicca [bandiera]" nella colonna strumenti. Si trascina su un blocco progetto
per avviarlo; un clic senza trascinare lo fa oscillare come suggerimento. E' decorativo
per le tecnologie assistive (`aria-hidden`): ogni blocco resta un link normale.

### Slot e pulsanti
Slot bianchi a pillola come gli input di Snap!. Pulsanti `.back`/`.btn` alti 48 px, foglio
con bordo interno `line`, bordo inchiostro in hover, `scale(.97)` alla pressione.

### Selettore classi
Chip alti 48 px con la linguetta colorata della categoria (come i pulsanti delle
categorie di Snap!); la classe attuale e' piena del suo colore.

### Dialog progetto
`<dialog>` modale: testata nel colore del blocco, palco bianco con l'iframe Snap!
creato solo all'apertura e rimosso alla chiusura, "Apri su Snap!" e "Copia il link".

## Motion

- Ingresso a scatto: `translateY(-14px)` e opacita', 320 ms `cubic-bezier(.23,1,.32,1)`,
  sfasamento 40 ms, massimo 10 elementi. Lo script della home si monta una volta sola
  (110 ms tra un blocco e l'altro).
- Transizione di vista: il padiglione diventa l'intestazione della classe
  (`view-transition-name: pav-<id>`), 320 ms ease-out.
- Dialog: 220 ms ease-out da `scale(.96)`; chiusura immediata.
- Gesto: il cappello segue il puntatore ruotato di -3 gradi, si aggancia sopra il blocco
  (220 ms), il blocco si accende, il progetto si apre dopo 460 ms. Vicino ai bordi la
  pagina scorre da sola.
- Movimento ridotto: nessuno spostamento; restano dissolvenze da 220 ms e il gesto apre
  subito il progetto.

## Do's and Don'ts

### Do:
- Mettere il colore in campi pieni con il testo della sua categoria.
- Allineare misure e spazi al quadretto (multipli di 8, quadretto 24).
- Tenere un solo iframe Snap! alla volta, caricato su richiesta.
- Dare a ogni progetto un link condivisibile `#classe/gruppo`.

### Don't:
- Non usare suono, sensori o liste di Snap! come fondo di testo: non arrivano ad AA.
- Non spargere puntini colorati o decorazioni sul fondo: il quadretto basta.
- Non animare la ricerca o le azioni ripetute; niente rimbalzi.
- Non inventare anteprime che sembrino schermate dei progetti.
