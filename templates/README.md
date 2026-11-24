# CNVista input templates

One empty file for every input group, with the header CNVista expects. Fill them with the output of your own
caller and pipeline, or use them to check how your files should look.

All files are plain text and may be gzip-compressed (`.gz`). Coordinates must be on the genome build chosen in
CNVista (GRCh38 or GRCh37); chromosome names may be written with or without `chr`. Column names are matched
without regard to case, spaces or punctuation (`Start Position`, `start_pos` and `START` are all read as start).

| File | Group | Required columns | Optional columns |
|---|---|---|---|
| `calls_CALLERNAME.tsv` | Call set | `chromosome`, `start`, `end`, and `type` (DEL/DUP, deletion/duplication, loss/gain) or `cn` (copy number) | `sample`, `genes` (comma-separated), `n_targets`, `quality`, `filter` (PASS), `bf`, `reads_ratio`, `log2`, `acmg`, `cohort_z` |
| `calls_CALLERNAME.vcf` | Call set (VCF) | one record per CNV: `ALT` `<DEL>`/`<DUP>`, or `INFO` `SVTYPE` and `END`, or `FORMAT` `CN` | `FILTER`, several sample columns |
| `proband.log2.bedgraph` (and `mother`, `father`, `sibling`, `control1` …) | Coverage track | one row per target, no header: chromosome, start, end, log2 ratio (a z-score works too; choose it in the file row) | – |
| `variants_trio.vcf` | Variants (BAF) | biallelic SNVs; `FORMAT` `GT` and `AD` (ref,alt) for each sample | `DP`; `RO`/`AO` or `AF` instead of `AD` |
| `cohort.seg` | Cohort | `ID`, `chrom`, `loc.start`, `loc.end`, `num.mark`, `seg.mean` (log2), one row per segment and sample | – |
| `genes.bed` | Gene annotation | no header: chromosome, start, end, gene symbol | – |
| `clingen_HI_genes.bed` | ClinGen dosage | no header: chromosome, start, end, gene symbol, haploinsufficiency score (0–3, 30, 40) | – |

Notes

- **Caller name.** CNVista names a call set after the caller found in the file header or file name; otherwise
  after the file name. Replace `CALLERNAME` in the file name (for example `calls_MyCaller.tsv`) or edit the name
  in CNVista. Files with the same caller name are merged into one call set.
- **Several samples in one call file** need a `sample` column; the sample to show is chosen in CNVista.
- **Roles of coverage tracks** come from the file name: `proband`, `mother`, `father`, `sibling`, `control1`,
  `control2` … (Turkish `hasta`, `anne`, `baba`, `kardes`, `kontrol` also work).
- **Sample names in the BAF VCF**: a name containing `proband`, `mother` or `father` (or matching the sample of
  the call file) is assigned automatically; otherwise choose the role in CNVista.
- The `track` line at the top of the BED and bedGraph templates is optional and ignored; delete it if your tools
  do not accept it. An empty template is flagged in CNVista as a file with no calls; that is expected.
