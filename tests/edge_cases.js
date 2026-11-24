const {chromium}=require('playwright');// Edge-case tests for CNVista. Run: node tests/edge_cases.js [path/to/cnvista.html]   (needs: npm i playwright)
const path=require('path');const B=__dirname+'/';
const HTML=path.resolve(process.argv[2]||path.join(__dirname,'..','cnvista.html'));
async function load(b,files){const p=await b.newPage({viewport:{width:1400,height:900}});const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('dialog',d=>{errs.push('DIALOG '+d.message());d.dismiss()});
 await p.goto('file://'+HTML);if(files.length){await p.setInputFiles('#inp',files.map(f=>B+f));await p.waitForTimeout(1200)}return [p,errs]}
const grp=p=>p.$$eval('.grp',es=>es.map(e=>e.dataset.cat+': '+[...e.querySelectorAll('.file')].map(f=>f.querySelector('.n').innerText+'['+(f.querySelector('input.cl')?.value||'')+'] '+[...f.querySelectorAll('.note')].map(n=>n.innerText).join(' ')).join(' | ')).filter(s=>!/: $/.test(s)).join('\n  '));
(async()=>{const b=await chromium.launch();let p,e;
 console.log('T1 CRLF');[p,e]=await load(b,['crlf/calls_ToolA.tsv','crlf/proband.log2.bedgraph']);console.log('  '+await grp(p));console.log('  events',await p.evaluate(()=>S&&S.K.map(k=>k.chrom+':'+k.start+'-'+k.end+' '+k.type).join('; ')),e);await p.close();
 console.log('T2 GRCh37 names');[p,e]=await load(b,['g37/calls_ToolB.tsv']);console.log('  '+await grp(p));console.log('  events',await p.evaluate(()=>S&&S.K.map(k=>k.chrom+':'+k.start+' '+k.type).join('; ')),e);await p.close();
 console.log('T3 XSS');[p,e]=await load(b,['xss/calls_markup.tsv']);await p.hover('#tbl tbody tr').catch(()=>{});await p.waitForTimeout(300);console.log('  injected:',await p.evaluate(()=>[window.__x,window.__y]),e);await p.close();
 console.log('T4 role/metric from folder path');[p,e]=await load(b,[]);console.log('  ',await p.evaluate(()=>{const r=classify('proband.log2.bedgraph','ctrl_folder/conifer_results/proband.log2.bedgraph','chr1\t1\t2\t-1\n');return r.cat+' rel='+r.rel+' metric='+r.metric}));await p.close();
 console.log('T5 BED6 genes, .bg.gz, DRAGEN seg.gz');[p,e]=await load(b,['crlf/calls_ToolA.tsv','misc/genes_refseq.bed','misc/mother.bg.gz','misc/run.seg.gz']);console.log('  '+await grp(p),e);await p.close();
 console.log('T6 BGZF VCF');[p,e]=await load(b,['crlf/calls_ToolA.tsv','misc/variants.vcf.gz']);console.log('  '+await grp(p),e);await p.close();
 console.log('T7 stale combo filter after rename');[p,e]=await load(b,['crlf/calls_ToolA.tsv','g37/calls_ToolB.tsv']);
   await p.click('.combo');await p.waitForTimeout(200);const before=await p.$eval('#cnt',x=>x.innerText);
   await p.fill('input.cl','Renamed');await p.dispatchEvent('input.cl','change');await p.waitForTimeout(400);console.log('  before',before,'after',await p.$eval('#cnt',x=>x.innerText),'filt=',await p.evaluate(()=>filt.combo),e);await p.close();
 console.log('T8 exact 1-bp locus & single position');[p,e]=await load(b,['crlf/calls_ToolA.tsv','crlf/proband.log2.bedgraph']);
   await p.evaluate(()=>{$("#loc").value="chr1:1000-1000";goto()});console.log('  svg NaN:',await p.evaluate(()=>/NaN/.test($("#plot").innerHTML)));
   await p.evaluate(()=>{$("#loc").value="chr1:1000";goto()});console.log('  single pos ->',await p.$eval('#dtitle',x=>x.innerText),e);await p.close();
 console.log('T9 caller name with +');[p,e]=await load(b,['crlf/calls_ToolA.tsv','g37/calls_ToolB.tsv']);await p.fill('input.cl','A+B');await p.dispatchEvent('input.cl','change');await p.waitForTimeout(300);
   console.log('  combos',await p.evaluate(()=>JSON.stringify(S.combos)),'callers of ev1',await p.evaluate(()=>S.K[0].callers.join('|')),e);await p.close();
 console.log('T10 view kept after a role change');[p,e]=await load(b,['crlf/calls_ToolA.tsv','crlf/proband.log2.bedgraph']);
   await p.evaluate(()=>{$("#loc").value="chr1:20000-30000";goto()});const t1=await p.$eval('#dtitle',x=>x.innerText);
   await p.selectOption('select[data-k=rel]','mother');await p.waitForTimeout(300);console.log('  before:',t1,' after:',await p.$eval('#dtitle',x=>x.innerText),e);await p.close();
 console.log('T11 gene filter substring');[p,e]=await load(b,['crlf/calls_ToolA.tsv','misc/genes_refseq.bed']);await p.fill('#fGene','GENE');await p.waitForTimeout(300);console.log('  "GENE" ->',await p.$eval('#cnt',x=>x.innerText),e);await p.close();
 console.log('T12 Clear then reload');[p,e]=await load(b,['crlf/calls_ToolA.tsv','g37/calls_ToolB.tsv']);await p.click('.combo');await p.click('#bReset');await p.setInputFiles('#inp',[B+'crlf/calls_ToolA.tsv']);await p.waitForTimeout(800);console.log('  after clear:',await p.$eval('#cnt',x=>x.innerText),'filt=',await p.evaluate(()=>filt.combo),e);await p.close();
 console.log('T13 BAF AF field with DP "."');[p,e]=await load(b,[]);console.log('  ',await p.evaluate(()=>{const r=parseBaf("##fileformat=VCFv4.2\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tS\nchr1\t100\t.\tA\tG\t50\tPASS\t.\tGT:AF:DP\t0/1:0.5:.\n");return r[0].n}));await p.close();
 await b.close()})();
