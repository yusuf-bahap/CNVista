# Changelog

## 0.3.2 — 2026-11-17

- **SVG export**: the downloaded region view used the page's colour variables, so lines and labels were missing
  or black in Inkscape, Illustrator, PowerPoint and journal systems (and dark-mode colours were exported). The file
  now carries fixed light-theme colours, a white background and its size in pixels.
- "Research use only" label next to the title and a disclaimer in the footer: not a medical device, not intended for
  diagnostic use, findings must be confirmed independently.
- The note under the genome view now describes the colour coding by number of callers.

## 0.3.1 — 2026-11-17

Bug fixes found with an edge-case test suite:

- **bgzip files** (`.vcf.gz`, `.bed.gz` written by bgzip, bcftools, DRAGEN): only the first block was read and the
  file failed with "Failed to fetch". Each BGZF block is now decompressed on its own; plain gzip files joined with
  `cat` are also read.
- **HTML in file contents**: a chromosome name containing markup could run script in the page. Chromosome names are
  now cleaned and all table cells are escaped.
- **Roles and value types from folder names**: a proband track inside a folder named `controls` or `conifer_results`
  was placed as a control or read as z-scores. The file name now decides; the folder is used only when the name
  carries no role.
- **BED6 gene files** (with a score column of 0) were taken for ClinGen dosage files; `.bg.gz` coverage tracks and
  `.seg.gz` / DRAGEN `Segment_Mean` SEG files were not recognised.
- **Caller combination filter** stayed active after a caller was renamed or files were cleared, so the table showed
  0 events.
- **Caller names containing "+"** broke the caller combinations; "+" is now replaced by "&", and an empty name by
  "Caller".
- **The region view jumped back to the first event** after any change of a file's role, value type, caller name or
  filter; it now stays on the current region.
- **Gene filter** matched substrings (ATM also matched ATMIN); it now matches the exact symbol when one exists,
  otherwise symbols starting with the text.
- A locus with a single position (`chr2:110150000`) now opens ±25 kb; a zero-width window is widened.
- Typing a gene symbol opens the event in that gene (most callers first) instead of the bare gene region.
- BAF panels keep values of 0 and 1 inside the frame.
- BAF: sample roles are assigned after the whole batch is read (a call file dropped together with the VCF is taken
  into account); an unknown depth is shown as n/a.

## 0.3.0 — 2026-11-16

- B-allele frequency: a new file group, Variants (BAF), takes small-variant VCFs (single-sample or joint trio,
  `.vcf` or `.vcf.gz`). The region view shows one BAF panel per sample (proband, parents, sibling, controls),
  with reference lines at 0.5 and 0.33/0.67; the event details count heterozygous SNVs inside the event.
- `templates/`: an empty template with the expected header for every input file.
- VCFs are told apart by content: SNV/indel VCFs go to Variants (BAF), CNV VCFs stay call sets.

## 0.2.3 — 2026-11-16

- Call files from unknown callers: column names are matched without regard to case, spaces or punctuation
  ("Start Position", "start_pos", "START"), with more aliases for chromosome, start, end, type and copy number.
  Comma- and semicolon-separated files and quoted fields are read.
- Type values: DEL/DUP words, loss/gain, +/−, or a copy number in the type column; otherwise CN or log2.
- Each call file shows how many calls were read and how many rows were skipped; a file with 0 calls, or with
  coordinates but no type column, is flagged with the columns that were found.
- Unknown callers are named after the file with any trailing sample or run ID removed (rename in the file row).
- Genome view: events are coloured by the number of supporting callers (1 white, 2 green, 3 or more red),
  taller for more callers and drawn on top, with a legend giving the count per level.

## 0.2.2 — 2026-11-15

- New visual design: cool grey-blue background, petrol section headers, square cards; the drop area is unchanged.
- File groups have their own light tints (call sets blue, coverage tracks green, cohort amber, genes violet,
  ClinGen rose).
- The event table follows the caller combinations, above the region view; the genome view is last.
- The subtitle under the title was removed.

## 0.2.1 — 2026-11-15

- Drag and drop: single files are always read from the browser's plain file list; the folder API is used
  only when a folder is dropped, with a fallback. Fixes drops that did nothing in some browsers.
- Status line: files and calls read, calls hidden by filters, missing inputs and read errors.
- The opening event also considers the callers' ACMG class (pathogenic and likely pathogenic first).

## 0.2.0 — 2026-11-15

- Any number of call sets, named by the user; readers for VCF (including GATK gCNV multi-allelic
  genotypes), headed TSV (about 40 column aliases), CNVkit `.cns`, XHMM/CANOES `.xcnv` and
  headerless BED.
- Files are sorted into five groups (call sets, coverage tracks, cohort, gene annotation, ClinGen
  dosage); whole folders can be dropped; files can be dropped onto a group.
- Coverage tracks for proband, mother, father, sibling and controls, assigned from the file name.
- Parental evidence: events labelled maternal, paternal, both or not seen in parents.
- Venn diagram for 2–3 call sets, UpSet-style combination bars for any number.
- GRCh37 support; cohort sample IDs hidden by default; proband row highlighted in the heat map.
- An event is cohort-specific only when every caller that reports the flag agrees.

## 0.1.0 — 2026-11-06

- First English version: ExomeDepth, CoNIFER and DRAGEN comparison, Venn diagram, genome view,
  event table and region view with patient, control and cohort tracks.
