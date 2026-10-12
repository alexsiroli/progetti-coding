# Product

<!-- impeccable:product-schema 1 -->

> Nota: scritto senza intervista. L'utente ha delegato le decisioni per il redesign
> di ottobre 2026; i fatti sotto sono dedotti da README, index.html, data/ e storia git.
> I punti marcati *(dedotto)* vanno confermati quando possibile.

## Platform

web

## Stack

Pagina statica senza build e senza dipendenze, pubblicata con GitHub Pages
(alexsiroli.github.io/progetti-coding). HTML, CSS e JavaScript vanilla; i dati sono
file JSON in `data/`, caricati con `fetch`.

## Users

- **Alunni** di scuola primaria e secondaria di primo grado che hanno fatto un corso di
  coding con Snap! con Alex Siroli ("Maestro Alex" / "Prof. Alex Siroli"). Arrivano da
  un link o da un QR mostrato in classe, spesso da un tablet o dal telefono di un
  genitore, per ritrovare e giocare il proprio progetto e quelli dei compagni.
- **Genitori e famiglie**, che aprono il link condiviso per vedere il lavoro del figlio,
  spesso da smartphone *(dedotto)*.
- **Insegnanti delle classi**, che mostrano i progetti alla LIM *(dedotto)*.

## Product Purpose

Una vetrina pubblica dei progetti Snap! realizzati dalle classi nell'anno scolastico
2025/2026. Ogni classe ha un elenco di gruppi di alunni, ciascuno con uno o piu' progetti
Snap! incorporati tramite l'URL `snap.berkeley.edu/embed`. Successo: un bambino trova il
suo progetto in pochi tocchi e lo avvia; un genitore riceve un link che apre direttamente
il lavoro del figlio.

## Positioning

Non e' una piattaforma: e' la bacheca di fine corso di un insegnante, con i lavori veri
dei bambini, organizzata per classe e per edizione del corso.

## Operating Context

- Classi presenti: 2A Anna Frank, 2A Ronta, 2O Plauto, 5 Saffi (tre edizioni: Natale,
  Primavera, Estate). Da 8 a 12 progetti per classe.
- Il docente aggiorna i JSON a mano via git (commit tipo "Aggiunti progetti classe ...").
- Gli embed Snap! sono pesanti: caricarne dodici insieme rallenta tablet e telefoni.

## Capabilities and Constraints

- Struttura dati: `data/<id-classe>.json` = lista di `{ student, projects: [{ name, url }] }`.
  Il campo `name` vale quasi sempre "Progetto Snap!"; l'informazione distintiva e' il
  nome del gruppo di alunni.
- Nessun backend, nessun login, nessuna raccolta dati.
- I nomi sono solo nomi di battesimo degli alunni, gia' pubblici sul sito attuale; non
  aggiungere cognomi, foto o altri dati personali.

## Brand Commitments

- Titolo "Progetti Coding", anno scolastico "2025/2026", firma "Prof. Alex Siroli".
- Lo strumento e' Snap! (Berkeley): il linguaggio visivo dei blocchi e' materiale del
  dominio, riconoscibile dai bambini.

## Evidence on Hand

- 65 progetti reali in `data/*.json` (6 classi).
- Nessuna miniatura dei progetti in locale; nessuna foto. Non inventare anteprime che
  sembrino schermate reali dei progetti.

## Product Principles

1. Il lavoro dei bambini e' il protagonista; l'interfaccia fa da cornice.
2. Trovare il proprio progetto deve essere possibile per un bambino di 7 anni.
3. Un link = un progetto: ogni lavoro si puo' condividere.
4. Leggera sui dispositivi deboli: un embed alla volta.

## Accessibility & Inclusion

Pubblico infantile e famiglie: testi grandi e leggibili, target di tocco ampi, uso
completo da tastiera (LIM, tablet con tastiera), contrasto WCAG AA, rispetto di
`prefers-reduced-motion`.
