# CNVista manual · version 0.3.2

CNVista compares CNV calls from any number of callers and shows the coverage evidence behind each
event, in one HTML file that runs entirely in the browser. The [README](../README.md) is the short
introduction.

> [!WARNING]
> **For research use only.** A review tool for trained users, not a medical device. Confirm every finding with an orthogonal
> method (MLPA, qPCR, microarray) before reporting.

[Loading files](#loading-files) · [Call sets](#call-sets) · [Coverage tracks](#coverage-tracks) · [Variants (BAF)](#variants-baf) ·
[Cohort, genes and ClinGen](#cohort-genes-and-clingen) · [How events are built](#how-events-are-built) ·
[Views](#views) · [Parental evidence](#parental-evidence) · [Privacy](#privacy) ·
[Troubleshooting](#troubleshooting)

## Loading files

Drop files or a whole folder on the dashed area, or click it to choose files (**choose a folder** for a
folder). Folders are read recursively. Alignment and index files (`.bam`, `.cram`, `.bai`, `.crai`),
hidden files and files larger than 400 MB are ignored. Gzip-compressed text (`.gz`) is decompressed
in the browser.

Each file is placed in one of six groups. Drop a file onto a group to force it there, or use the
group menu on the file's row. **Clear** removes all files. **Build** switches the ideogram between
GRCh38 and GRCh37.

A file is grouped by these rules, in this order:

| Rule | Group |
|---|---|
| VCF (`#CHROM` header or `.vcf` name) whose records are mostly SNVs/indels | Variants (BAF) |
| Any other VCF (`<DEL>`/`<DUP>`/`<CNV>` alleles, `SVTYPE` or `CN`) | Call set |
| Name ends with `.seg`, or the header starts with `ID<tab>chrom` | Cohort |
| Name contains `clusters`, `kumeler`, `ts_genes` or `clingen_ts` | Not used |
| Name contains `bedgraph` or ends with `.bg`, or a `track type=bedGraph` line | Coverage track |
| Name ends with `.cnr`, or a `log2_copy_ratio` column | Coverage track |
| A `median_svdzrpkm`, `reads_ratio`, `bf`, `copy_number` or `acmg` column | Call set |
| Name ends with `.cns` or `.xcnv`, or `interval` and `cnv` columns | Call set |
| A chromosome column with a `type`, `svtype`, `cnv`, `cnv_type`, `call`, `state`, `cn` or `event` column | Call set |
| Name contains `hi_genes`, `clingen`, `_hi` or `dosage`, or a 5th column of 0–3/30/40 | ClinGen dosage |
| Headerless BED with DEL/DUP in columns 4–8 | Call set |
| Name contains `gene`, `refseq`, `gencode` or `ensembl` | Gene annotation |

## Call sets

**Caller name.** Taken from the file header (`##source=DRAGEN`, GATK gCNV command lines), from
characteristic columns (`median_svdzrpkm` → CoNIFER, `reads_ratio` → ExomeDepth, `Q_SOME` → XHMM) or
from the file name (dragen, exomedepth, conifer, gcnv/gatk, cnvkit, xhmm, canoes, clamms, canvas,
manta). Otherwise the file name is used. Edit the name in the box on the file's row; files with the
same name form one call set. Known callers keep a fixed colour.

**Sample.** If a file holds several samples (a `sample`, `sample_id`, `sampleid` or `sample_name`
column, or several VCF sample columns), a menu selects the one to show. A sample whose ID contains
patient, proband, hasta or index is selected first.

**Columns.** Names are matched without regard to case.

| Field | Accepted column names |
|---|---|
| Chromosome | chromosome, chrom, chr, contig, chr_name, seqnames |
| Start / end | start, begin, start.p, start_pos, chromstart, pos / end, stop, end.p, end_pos, chromend |
| Interval (instead of chrom/start/end) | interval, region, locus, coordinates (`chr1:100-200`) |
| Type | type, svtype, cnv, cnv_type, call, state, event, sv_type, variant_type (DEL/LOSS/deletion, DUP/GAIN/AMP/duplication) |
| Copy number | copy_number, cn, mlcn, copynumber |
| Evidence | bf, reads_ratio / ratio, log2 / log2_copy_ratio / mean_log2, median_svdzrpkm, q_some / qs / quality / qual / score |
| Targets | n_targets, num.mark, num_targ, num_targets, probes, nexons, n_exons |
| Cohort | cohort_z / kohort_z, cohort_specific / kohort_ozgun (yes/true/1/evet) |
| Other | genes / gene / gene_symbol, acmg / acmg_class / classification, filter, sample |

Without a type column, the type comes from copy number (below or above 2 on autosomes) or, for
CNVkit segments without CN, from log2 (≤ −0.25 deletion, > 0.2 duplication). Neutral segments are
skipped. In VCF files the type comes from the genotype's ALT allele (so `<DEL>,<DUP>` multi-allelic
records work), from a single ALT, from SVTYPE or from FORMAT CN; reference genotypes are skipped.

**PASS calls only** (on by default) hides calls whose FILTER is not PASS or `.`.

## Coverage tracks

One value per target: bedGraph (`chrom start end value`), CNVkit `.cnr` (the `log2` column) or GATK
denoised copy ratios (`LOG2_COPY_RATIO`).

**Role** comes from the file name: mother/maternal/anne/mom, father/paternal/baba/dad,
sibling/brother/sister/kardes, control/kontrol/ctrl (with a number: `control2`); anything else is the
proband. **Value type** is z-score when the name or header mentions conifer, zrpkm, svd or zscore,
otherwise log2 ratio. Both can be changed on the file's row.

Panels are drawn grouped by value type (all log2 panels, then all z-score panels), each as proband,
mother, father, sibling and controls. Plots show the role, never the file name.

## Variants (BAF)

A small-variant VCF (`.vcf` or `.vcf.gz`, single-sample or a joint trio VCF) adds B-allele frequency
panels to the region view, as in reconCNV. Only biallelic SNVs with a read depth of at least 10 are used.
The B-allele frequency is read from FORMAT `AD` (alt / total), or from `RO`/`AO` (freebayes), or from
FORMAT `AF`/`VAF`; a sites-only VCF uses INFO `AF` and `DP`.

Each sample in the file has a menu: Proband, Mother, Father, Sibling, Control or Not shown. A sample is
assigned from its name (mother, father, anne, baba …) or because it matches the sample of a call file;
in a multi-sample VCF the first sample is otherwise the proband and the others are not shown until a
role is chosen.

How to read the panel: with two copies, heterozygous SNVs sit around 0.5. With three copies they move to
about 0.33 and 0.67 (dashed lines). In a deletion only one allele is left, so heterozygous SNVs disappear
and BAF is 0 or 1 only (loss of heterozygosity). The event details list, for each BAF sample, how many
SNVs in the event are heterozygous (BAF 0.1–0.9). With **targets equally spaced**, only variants within
150 bp of a target are drawn; switch to genomic coordinates to see off-target variants.

## Cohort, genes and ClinGen

**Cohort SEG**: one row per sample segment (`ID chrom loc.start loc.end num.mark seg.mean`); with
per-target segments the heat map aligns with the coverage tracks. Sample IDs are shown as
*Sample n* unless **show cohort sample IDs** is ticked. The proband row (the sample selected in the
call sets, or an ID containing patient/proband/hasta/index) is labelled *Proband* and outlined.

**Gene BED** (`chrom start end gene`): gene track, gene names of each event and search by symbol.
MIR, LOC, LINC and SNOR loci are hidden.

**ClinGen dosage BED** (`chrom start end gene score`): genes with haploinsufficiency score 3 are
highlighted in the gene track and listed for each event.

## How events are built

Calls are grouped by chromosome and type, sorted by start and merged by single-linkage overlap: a call
joins the current event when it starts at or before the event's end. Each event records the call sets
that support it, its genes, its first available copy number, cohort z-score and ACMG class. An event
is cohort-specific only when every caller that reports this flag agrees.

On opening, CNVista shows the best-supported event: most callers first, then the callers' ACMG class
(pathogenic, likely pathogenic, uncertain, benign), then a haploinsufficient gene, then cohort-specific or
not-seen-in-parents events, then the highest Bayes factor.

A status line under the file groups says how many files and calls were read, how many calls are hidden
by the PASS filter or the sample selection, and what is missing (for example coverage tracks for the
region view). Read errors are shown there instead of failing silently.

## Views

- **Summary tiles**: calls per call set, events, events with ≥ 2 callers and with all callers, events
  not seen in parents.
- **Caller combinations**: a Venn diagram for 2–3 call sets and one bar per combination for any number.
  Click a bar to filter the genome view and the table.
- **Genome view**: every event on the ideogram; taller marks are supported by ≥ 2 callers.
- **Event table**: click a column header to sort, a row to open it. Filters: combination, type,
  ≥ 2 callers, cohort-specific, PASS only, parental status, gene.
- **Region view**: call bars, coverage panels, cohort heat map and gene track. Reference lines at
  log2 −1 (one copy) and +0.58 (three copies) or z ±1.5. The x-axis shows targets equally spaced
  (default) or genomic coordinates; the flank is 50–400 % of the event. Type `chr2:110000000-110300000`
  or a gene symbol and press **Go**. **Download SVG** saves the view as a vector figure.
- **Presentation font** and **Light / dark** are for case conferences.

## Parental evidence

When mother and/or father tracks are loaded, CNVista averages each parent's values over the event
(log2 if available, otherwise z-score) and calls the event present in that parent when the mean is
below −0.4 for deletions or above 0.3 for duplications (z-score: −1.5 / +1.5). The event is labelled
*maternal*, *paternal*, *both*, *not seen in parents* (both parents tested) or *not seen in tested
parent*. The label is a coverage-based screen: batch effects shared by a family, low coverage and
thresholds near the parent's mean can mislabel events. Confirm inheritance independently.

## Privacy

The page makes no network requests and loads no external code or fonts. Files are read with the File
API and kept in memory; closing the tab discards them. CNVista works from a local disk without a
connection.

## Troubleshooting

| Problem | Cause and fix |
|---|---|
| Dragging files does nothing | Click the drop area to choose files, or use **choose a folder**; check the status line for a message |
| A file lands in the wrong group | Use the group menu on its row, or drop it onto the right group |
| A call set shows 0 calls | Check the type/CN column and the sample selector; FILTER values other than PASS are hidden while **PASS calls only** is on |
| The region view is empty | No coverage track overlaps the region; check that tracks and calls use the same chromosome naming and build |
| Every track is labelled Proband | Rename the files (`mother.log2.bedgraph`) or set the role on each row |
| Loading a large SEG file is slow | 150-MB files take several seconds; keep only the samples or regions you need |
| `.gz` files are not read | Old browsers lack DecompressionStream; decompress the file first |
