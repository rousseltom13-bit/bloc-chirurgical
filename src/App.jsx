import { useState } from "react";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, VerticalAlign, UnderlineType,
  Header, Footer, ImageRun
} from "docx";

const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAHQAAABHCAIAAABZFvRzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAh1QAAIdUBBJy0nQAABOZJREFUeF7tWn9k1VEUX3+NpMg0MkViZBqZRlIkRqaRKRIj00iKxEiKRCRG0sg0MkX6fySNTCOzkWnMFEkjs5FpZLY+z/m++84798f3/bp7a51n5vvu99zP95zP/dxz7r3ft2Vtba1GP5EYALn6icRATSRchc2kBGUhHgNKbjxuVbkRubXIRdnkj6OvppaKW7zGkpn5bywFAnWhu6J7oDEmAxGxZVrgwQu+nLz7RsImVwThG0UbMGL0kaEd5HL1hZXr5Evo1ylnW+BGtpHjXVf4gsh1emRPas4jn/siA4i0YI+QEPW68lHRh7nJ9SXQ8JwNaDbAl0hEPPNWNNIqgFWf3EBC+Ncl7CXXzGXfiNuR2+nVqNJnHK57m5lcX9nxaU2XYrJ+VCEV/TeP1O1vxKFWcpXciAxEhFblKrkRGYgI7VBu7dZt+MMz6T9dmEb7q2kxXURH4z5v5zimnSPwhwp/hA/mrugi2k0s/ILHZcMKxwQzoq89SkpuoiRbRmHeuaS8+yz7hiqXS55PO1VuLqdpWsjL5ppzZX3TgqY5N7fy0dVCki74IqyQhRGvOZpzNefqJiJ/J+Vcq+kmIm/baW8EnHs85/5CNxHJJl7s3bWgaUHLphl7X8inkh7c5NKxni3o2UJuDadHjsm5sF1M7JM9+6hXz3Nz5+t6WE4a0sNyPSzPf+2kr3mSJGu/H/Md2gbSseZczbnydEFzruZczbk8mer2V5diyftA3/vzQt59+F6gKblKbvaHVYXoSN+hJa8DzLG/vRYWt3Sdq+vcAta5gQytt4piQH/8XBRdxRkrucXxVZS1klsUXcUZl0vu2MdxlPIdu+ror/fmLXr+3MJ8x5lOtDQeaOp78pg71XWxG+179+2/c/eeaTcImYuddbXbk592BXDQHSCwP3f+wuKvpfBzffg+/4tj0WNdLrn9TwcQmw3eeuQo2pf/rCz+Xmo71d7/bIBsrl2/AdLRDtaaD7UMPh+y+4L9vkfJePhw7j942Hy4Ze7nPKA6znZ2XeomHJ+9GF2D7/N/Q5CLqBCncAUxQ874T+0jH0YRM11DlWMT43QNZluPJe0GYeT9aOPBpkSGfhxoFrBkhvH7+u07LgLPdeKj0el/RZgFSLnKhfqOnziJuV+/p6Hn6pXl1RWAIlSQi5jJS0w9cJpp/5HfPjGO2SoiAd0vX72mRh8OkgDwYQbx1u9ugNKh34A9fwTHR7vT/41CbtvpdpramOaY/oiTPIPTxDWIgA1tsaZnZvlmTHyFweSnKZDFYwvg9FzO4qc91wDa+D7/K8JvucrlTmSKQ7YQQaTgGkxBKchrRJlULhSdr1zUQwwJx3Tj0MzIFrHMzMjiOO0NoI3v87/65CLHmeUBvEG6NLqb/DxFKQIfkAui6RosQD50PfhiCClF6HT4zVve4sPBKPKcnvpcM584fsD/6pML+pBqaUWFtACRGq5RwajQTX+ZRfEZfpdQhtUCZqJztQC0TBlcSMoghefDgcDNagQjBNiwPe7a+AH/q08uPIAMERvqFVjuvZ0scjOczsyCa7Sj1vH1FmildS60xte56ELly+idwvPirK6AX4AAipJv2N6H7/N/Q5BbESc2K0glC9pm5ajkuJTckqlL76jkpnNUsoWSWzJ16R2V3HSOSrZQckumLr2jkpvOUckWfwHWqjVoddZlMAAAAABJRU5ErkJggg==";

const SECS = {
  coralie: { nom: "Coralie Wallaert", email: "coralie.wallaert@chu-lille.fr", ini: "CW" },
  alexandre: { nom: "Alexandre Delmeire", email: "alexandre1.delmeire@chu-lille.fr", ini: "AD" },
};
const DOCS = {
  PTH: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
  PTG: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
  LCA: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
};

function b64ToArr(b64){const bin=atob(b64);const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return arr;}
function nb(){return{style:BorderStyle.NONE,size:0,color:"FFFFFF"};}
function anb(){return{top:nb(),bottom:nb(),left:nb(),right:nb(),insideHorizontal:nb(),insideVertical:nb()};}
function tx(t,o={}){return new TextRun({text:t,font:"Arial",size:o.size??20,bold:o.bold??false,italics:o.italics??false,underline:o.underline?{type:UnderlineType.SINGLE}:undefined,color:o.color??"000000"});}
function pp(r,o={}){return new Paragraph({alignment:o.align??AlignmentType.LEFT,spacing:{after:o.after??0,before:o.before??0},children:Array.isArray(r)?r:[r]});}
function pj(t,o={}){return new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:o.after??60,before:o.before??0},children:[tx(t,o)]});}
function ep(a=80){return pp(tx(""),{after:a});}

function mkHeader(){const logo=b64ToArr(LOGO_B64);return new Header({children:[new Table({width:{size:9204,type:WidthType.DXA},columnWidths:[4602,4602],borders:anb(),rows:[new TableRow({children:[new TableCell({borders:anb(),width:{size:4602,type:WidthType.DXA},children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:0},children:[new ImageRun({data:logo,transformation:{width:80,height:49},type:"png"})]})]}),new TableCell({borders:anb(),width:{size:4602,type:WidthType.DXA},children:[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:10},children:[tx("N° FINESS",{size:14,color:"444444"})]}),new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:0},children:[tx("590796975",{size:16,bold:true})]})]})]})]})]});}
function mkFooter(){return new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:200},border:{top:{style:BorderStyle.SINGLE,size:4,color:"CCCCCC"}},children:[tx("Rue du Professeur Emile Laine – 59037 Lille Cedex     www.chru-lille.fr",{size:16})]})]});}

function svcLeft(before=0){const I=120;return[pp([tx("Pr C. CHANTELOT",{size:18,bold:true,italics:true})],{after:0,before}),pp([tx("Chef de Service",{size:18,italics:true})],{after:I}),pp([tx("Praticien Hospitalier",{size:18,bold:true})],{after:0}),pp([tx("Dr Marion HALBAUT",{size:18})],{after:I}),pp([tx("Chefs de clinique",{size:18,bold:true})],{after:0}),pp([tx("Dr Noémie ALLIO",{size:18})],{after:0}),pp([tx("Dr Allison FITOUSSI",{size:18})],{after:0}),pp([tx("Dr Tom ROUSSEL",{size:18})],{after:I}),pp([tx("Cadres de Santé",{size:18,bold:true})],{after:0}),pp([tx("Mme WALLART (5ème SUD)",{size:18})],{after:0}),pp([tx("☎ 03 20 44 66 02",{size:18})],{after:I}),pp([tx("Secrétariat hospitalisation",{size:18,bold:true})],{after:0}),pp([tx("☎ 03 20 44 68 21",{size:18})],{after:0}),pp([tx("✉ 03 20 44 68 99",{size:18})],{after:I}),pp([tx("Assistante Sociale",{size:18,bold:true})],{after:0}),pp([tx("Mlle Valérie DINOIRD",{size:18})],{after:0}),pp([tx("☎ 03 20 44 62 16",{size:18})],{after:0})];}
function refBlk(nom,prenom,ddn,de,ds){const l=[pp([tx("HOPITAL ROGER SALENGRO",{size:18,bold:true})],{after:0}),pp([tx("Pôle de l'Appareil locomoteur",{size:18})],{after:0}),pp([tx("Orthopédie et Traumatologie",{size:18})],{after:40}),pp([tx("Réf. : CW /",{size:18})],{after:0}),pp([tx(`${nom} ${prenom}`,{size:18})],{after:0}),pp([tx(`Né(e) le ${ddn}`,{size:18})],{after:0})];if(de)l.push(pp([tx(ds?`Hospitalisation du ${de} au ${ds}`:`Hospitalisation du : ${de} au`,{size:18})],{after:0}));return l;}
function patR(nom,prenom){return[ep(80),pp([tx(`${nom} ${prenom}`,{size:20,bold:true})],{after:40}),ep(40),ep(40),ep(40)];}
function topTbl(nom,prenom,ddn,de,ds){return new Table({width:{size:9204,type:WidthType.DXA},columnWidths:[4500,4704],borders:anb(),rows:[new TableRow({children:[new TableCell({borders:anb(),width:{size:4500,type:WidthType.DXA},margins:{top:0,bottom:0,left:0,right:200},children:refBlk(nom,prenom,ddn,de,ds)}),new TableCell({borders:anb(),width:{size:4704,type:WidthType.DXA},margins:{top:0,bottom:0,left:200,right:0},children:patR(nom,prenom)})]})]})}
function twoCol(right,slB=0){return new Table({width:{size:9204,type:WidthType.DXA},columnWidths:[2800,6404],borders:anb(),rows:[new TableRow({children:[new TableCell({borders:anb(),width:{size:2800,type:WidthType.DXA},verticalAlign:VerticalAlign.TOP,margins:{top:0,bottom:0,left:0,right:200},children:svcLeft(slB)}),new TableCell({borders:anb(),width:{size:6404,type:WidthType.DXA},verticalAlign:VerticalAlign.TOP,margins:{top:0,bottom:0,left:200,right:0},children:right})]})]})}

const SP={sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:851,right:720,bottom:567,left:720,header:426,footer:342}}}}]};

async function mkOrdo(nom,prenom,ddn,dateOp,lines,titre="ORDONNANCE"){
  const h=mkHeader(),f=mkFooter();
  const top=new Table({width:{size:9204,type:WidthType.DXA},columnWidths:[4600,4604],borders:anb(),rows:[new TableRow({children:[new TableCell({borders:anb(),width:{size:4600,type:WidthType.DXA},margins:{top:0,bottom:0,left:0,right:200},children:[pp([tx("HOPITAL ROGER SALENGRO",{size:18})],{after:20}),pp([tx("Pôle des Neurosciences et de l'Appareil Locomoteur",{size:16})],{after:20}),pp([tx("ORTHOPEDIE - TRAUMATOLOGIE",{size:18,bold:true})],{after:80}),pp([tx("Service de Traumatologie",{size:20,bold:true})],{after:0})]}),new TableCell({borders:anb(),width:{size:4604,type:WidthType.DXA},margins:{top:0,bottom:0,left:200,right:0},children:[new Table({width:{size:4500,type:WidthType.DXA},columnWidths:[4500],rows:[new TableRow({children:[new TableCell({borders:{top:{style:BorderStyle.SINGLE,size:4,color:"AAAAAA"},bottom:{style:BorderStyle.SINGLE,size:4,color:"AAAAAA"},left:{style:BorderStyle.SINGLE,size:4,color:"AAAAAA"},right:{style:BorderStyle.SINGLE,size:4,color:"AAAAAA"}},width:{size:4500,type:WidthType.DXA},margins:{top:120,bottom:120,left:120,right:120},children:[pp([tx(`${nom} ${prenom}${ddn?` - né(e) le ${ddn}`:""}`,{size:18})],{after:200}),ep(80)]})]})]})]})]})]}});
  const titleP=new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:400,after:400},children:[tx(titre,{size:36,bold:true})]});
  const dateP=new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:200},children:[tx(`Lille, le ${dateOp}`,{size:20})]});
  const I=120;
  const lP=[ep(200),pp([tx("□ Pr Christophe CHANTELOT",{size:20,bold:true})],{after:0}),pp([tx("Chef de Service",{size:18})],{after:0}),pp([tx("10003798971",{size:18})],{after:I}),pp([tx("□ Dr Marion HALBAUT",{size:20,bold:true})],{after:0}),pp([tx("Praticien Hospitalier",{size:18})],{after:0}),pp([tx("10102005708",{size:18})],{after:I}),pp([tx("□ Dr Allison FITOUSSI",{size:20,bold:true})],{after:0}),pp([tx("Cheffe de Clinique",{size:18})],{after:0}),pp([tx("10101538402",{size:18})],{after:I}),pp([tx("□ Dr Noémie ALLIO",{size:20,bold:true})],{after:0}),pp([tx("Docteur Junior",{size:18})],{after:0}),pp([tx("10102200101",{size:18})],{after:I}),pp([tx("□ Dr Tom ROUSSEL",{size:20,bold:true})],{after:0}),pp([tx("Docteur Junior",{size:18})],{after:0}),pp([tx("10102203147",{size:18})],{after:0})];
  const cP=lines.map(l=>{if(l==="")return ep(80);if(l.startsWith("##"))return pp([tx(l.replace("##","").trim(),{size:20,bold:true,underline:true})],{after:60});if(l.startsWith("**"))return pp([tx(l.replace(/\*\*/g,"").trim(),{size:20,bold:true})],{after:60});return pj(l,{after:60});});
  const rP=[dateP,...cP,ep(200)];
  const mT=new Table({width:{size:9204,type:WidthType.DXA},columnWidths:[3200,6004],borders:anb(),rows:[new TableRow({children:[new TableCell({borders:anb(),width:{size:3200,type:WidthType.DXA},verticalAlign:VerticalAlign.TOP,margins:{top:0,bottom:0,left:0,right:200},children:lP}),new TableCell({borders:anb(),width:{size:6004,type:WidthType.DXA},verticalAlign:VerticalAlign.TOP,margins:{top:0,bottom:0,left:200,right:0},children:rP})]})]}});
  return new Document({sections:[{...SP.sections[0],headers:{default:h},footers:{default:f},children:[top,titleP,mT]}]});
}

async function mkCRO(d){
  const h=mkHeader(),f=mkFooter();
  const r=[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:200,before:160},children:[tx(`Lille, le ${d.dateOp}`,{size:20})]}),new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:160},children:[tx("COMPTE-RENDU OPERATOIRE",{size:22,bold:true})]}),pj(`Date opératoire : ${d.dateOp}`),pj("Opérateur : Docteur Tom ROUSSEL"),pj(`Aides opératoires : ${d.aides}`),ep(80),new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:80},children:[tx("Indication : ",{size:20,bold:true}),tx(d.indication,{size:20,bold:true})]}),pj(`CCAM : ${d.ccam}`,{italics:true,after:80}),...(d.implants?[new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:80},children:[tx("Rappel des implants : ",{size:20,bold:true}),tx(d.implants,{size:20})]})]:[]),ep(40),...d.tempsOp.map(l=>{if(l==="")return ep(80);if(l.startsWith("##"))return new Paragraph({spacing:{after:60},children:[tx(l.replace("##","").trim(),{size:20,bold:true,underline:true})]});return pj(l,{after:60});}),ep(160),pp([tx("Dr Tom ROUSSEL",{size:20,bold:true})],{after:0}),pj("Docteur Junior — Service de Traumatologie-Orthopédie")];
  return new Document({sections:[{...SP.sections[0],headers:{default:h},footers:{default:f},children:[topTbl(d.nom,d.prenom,d.ddn,d.de,d.ds||""),ep(120),twoCol(r)]}]});
}

async function mkCRH(d){
  const h=mkHeader(),f=mkFooter();
  const bP=d.paras.map(item=>{if(item.type==="consigne")return new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:60},indent:{left:360},children:[tx(`- ${item.texte}`,{size:20})]});if(item.type==="mixed")return new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:item.after??120},children:item.runs});return new Paragraph({alignment:AlignmentType.JUSTIFIED,spacing:{after:item.after??120},children:[tx(item.texte,{bold:item.bold??false,italics:item.italics??false})]});});
  const r=[new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:160,before:160},children:[tx(`Lille, le ${d.dateLettre}`,{size:20})]}),pj("Cher confrère,",{after:160}),...bP,ep(120),new Paragraph({alignment:AlignmentType.LEFT,spacing:{after:0},children:[tx("Professeur C. CHANTELOT",{size:20,bold:true}),tx("          Le Docteur ROUSSEL TOM",{size:20,bold:true})]})];
  const mP=new Paragraph({alignment:AlignmentType.LEFT,spacing:{after:0,before:200},border:{top:{style:BorderStyle.SINGLE,size:4,color:"CCCCCC"}},children:[tx(`Lettre adressée à : ${d.mt||"[MÉDECIN TRAITANT]"}`,{size:16,color:"444444"})]});
  return new Document({sections:[{...SP.sections[0],headers:{default:h},footers:{default:f},children:[topTbl(d.nom,d.prenom,d.ddn,d.de,d.ds),ep(120),twoCol(r,480),ep(200),mP]}]});
}

async function genDocs(inter,f,docs){
  const res={};
  const{nom,prenom,ddn,age,dateOp,civ,cote,aides,mt}=f;

  if(inter==="PTH"){
    const{ind,atcd,cotT,cotM,tigT,tigM,tigeType,col,tete,tetem,rape,infiltr}=f;
    const cotOpp=cote==="droit"?"gauche":"droit";
    const imp=`Cotyle ${cotM} taille ${cotT} / Tige ${tigM} ${tigeType} taille ${tigT} / Tête ${tete} DM ${tetem} col ${col}`;
    if(docs.includes("CRO"))res["CRO"]=await mkCRO({nom,prenom,ddn,dateOp,de:dateOp,ds:"",aides,indication:`Arthroplastie totale de hanche ${cote} dans le cadre d'une ${ind}.`,ccam:"NEKA020",implants:imp,tempsOp:[`Installation en décubitus latéral ${cotOpp}.`,"Badigeon et champage stérile.","Antibioprophylaxie pré-opératoire selon le protocole du CLIN.","Check-list.","","Voie d'abord postéro-latérale.","Hémostases sous cutanées.","Ouverture du fascia lata.","Discision des fibres du grand fessier.","Pneumatisation de la bourse rétro-trochantérienne.","Ouverture des pelvi-trochantériens et de la capsule en L inversé au ras du grand trochanter.","Faufilage au Vicryl 2.","Luxation de la hanche.","Ostéotomie du col fémoral à la scie oscillante selon la planification pré-opératoire.","Ablation de la tête fémorale sans difficulté.","","##Temps cotyloïdien :","Exposition du cotyle.","Ablation du labrum.","Ablation du reliquat du ligament rond de la tête fémorale.","Repérage du ligament transverse.",`Fraisages de tailles croissantes jusqu'à la taille ${cotT} pour mise en place d'un cotyle définitif taille ${cotT} DM ${cotM} sans ciment légèrement plus antéversé que le transverse.`,"La tenue primaire est excellente.","","##Temps fémoral :","Exposition du fût fémoral jambe au zénith.","Ablation du reliquat de col à l'emporte-pièce.","Tunnelisation à la dague.","Évidement du grand trochanter à la curette.",`On passe les râpes de tailles successives jusqu'à la râpe taille ${rape}.`,`Essais sur râpe en place col ${col}.`,"La stabilité est excellente et les longueurs sont restaurées.",`Décision de mise en place d'une tige ${tigM} ${tigeType} sans ciment taille ${tigT}.`,"Nouveaux essais sur la tige définitive strictement comparables.",`Mise en place d'une tête ${tete} DM ${tetem} col ${col}.`,"Réduction de la hanche.","Nettoyage abondant.",...(infiltr==="Oui"?["Infiltration péri-articulaire selon protocole."]:[]
),"Réinsertion des pelvi-trochantériens et de la capsule par des points trans-glutéaux au Lucas.","Fermeture plan par plan.","Agrafes à la peau.","Pansement Aquacel Duoderm."]});
    if(docs.includes("CRH"))res["CRH"]=await mkCRH({nom,prenom,ddn,de:dateOp,ds:"[DATE SORTIE]",dateLettre:dateOp,mt,paras:[{type:"mixed",after:120,runs:[tx("Votre patient(e) "),tx(`${civ} ${nom} ${prenom}`,{bold:true}),tx(`, ${age} ans, a été hospitalisé(e) dans notre service du ${dateOp} au [DATE SORTIE] pour la réalisation de son arthroplastie totale de hanche ${cote} sur ${ind}.`)]}, ...(atcd?[{texte:atcd,after:120}]:[]),{texte:`L'intervention s'est parfaitement déroulée au bloc opératoire le ${dateOp} sous anesthésie [TYPE]. Les radiographies de contrôle post-opératoire sont satisfaisantes.`,after:120},{texte:"Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.",after:120},{texte:"La sortie du patient est autorisée ce [DATE SORTIE] sous couvert des consignes suivantes :",after:60},{type:"consigne",texte:"Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM"},{type:"consigne",texte:"Ablation des agrafes à J15 post-opératoire"},{type:"consigne",texte:"Kinésithérapie selon le protocole remis au patient"},{type:"consigne",texte:`Appui complet autorisé d'emblée avec 2 cannes anglaises, précautions anti-luxation pendant 6 semaines`},{type:"consigne",texte:"Antalgiques selon ordonnance"},{type:"consigne",texte:"Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours"},{texte:`Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du bassin de face et de hanche ${cote} de face et profil.`,after:200},{texte:"Bien cordialement.",after:300}]});
    if(docs.includes("Ordonnance pharma"))res["Ordonnance pharma"]=await mkOrdo(nom,prenom,ddn,dateOp,["**Matériel de soins :","AQUACEL Extra — 1 boîte","DUODERM Extra Thin — 1 boîte","Compresses stériles 10x10 — 1 boîte","BISEPTINE — 1 flacon","Sérum physiologique — 30 dosettes","","**Analgésie :","","PARACÉTAMOL 1g — 1 cp/6h — QSP 30 jours","","IBUPROFÈNE 400mg — 1 cp matin/midi/soir — QSP 10 jours","OMÉPRAZOLE 20mg — 1 gél. matin — QSP 10 jours","","ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours (hors >70 ans, CI : glaucome/HBP/cardiopathie/IRC)","","**Anticoagulation :","","INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours"]);
    if(docs.includes("Ordonnance IDE"))res["Ordonnance IDE"]=await mkOrdo(nom,prenom,ddn,dateOp,["Soins de pansements à domicile toutes les 4 jours jusqu'à cicatrisation complète.","","Ablation des agrafes à J15 post-opératoire.","","INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours.","","NFS plaquettes 1x/semaine pendant 35 jours."],`Ordonnance IDE — PTH ${cote}`);
    if(docs.includes("Ordonnance kiné"))res["Ordonnance kiné"]=await mkOrdo(nom,prenom,ddn,dateOp,[`**KINÉSITHÉRAPIE post-PTH ${cote} — Appui complet d'emblée — URGENT`,"","##Phase 1 — J0 à J15 :","Cryothérapie, exercices isométriques, flexion < 70°","ÉVITER : flexion > 90° + adduction + rotation interne combinées","Marche 2 cannes, escaliers","","##Phase 2 — J15 à 6 semaines :","Renforcement moyen fessier (priorité), vélo sans résistance S3-S4","","##Phase 3 — 6 semaines à 3 mois :","Arrêt précautions anti-luxation à 6 semaines","Reprise sportive légère à 3 mois"]);
    if(docs.includes("Ordonnance matériel"))res["Ordonnance matériel"]=await mkOrdo(nom,prenom,ddn,dateOp,["2 Cannes anglaises réglables — 1 paire","","Réhausseur de toilettes — 1","",`Bas de contention classe II — Jambe ${cote} — QSP 3 mois`]);
  }

  if(inter==="PTG"){
    const{ind,atcd,def,deg,femT,platT,insT,rotT,flex}=f;
    const ccam=parseInt(deg)>10?"NFKA008":"NFKA007";
    const imp=`Fémur ACS taille ${femT} / Plateau ACS taille ${platT} / Insert ${insT} mm / Bouton rotulien taille ${rotT}`;
    if(docs.includes("CRO"))res["CRO"]=await mkCRO({nom,prenom,ddn,dateOp,de:dateOp,ds:"",aides,indication:`Arthroplastie totale de genou ${cote} dans le cadre d'une ${ind} avec déformation en ${def} de ${deg}°.`,ccam,implants:imp,tempsOp:["Installation en décubitus dorsal.","Badigeon et champage stérile.","Antibioprophylaxie pré-opératoire selon le protocole du CLIN.","Check-list.","","Voie d'abord médiale para-patellaire.","Arthrotomie médiale para-patellaire.","Éversion de la rotule.","Résection des ostéophytes périphériques.","Résection du corps adipeux de Hoffa.","Résection du pivot central.","","##Coupe tibiale première :","Guide tibial extra-médullaire.","Résection tibiale proximale selon planification.","Contrôle de l'espace par l'hémi-espaceur.","","##Temps fémoral :","Guide fémoral intra-médullaire.","Résections distale, antérieure, postérieure et chanfreins.",`Trial fémoral taille ${femT}.`,"Ouverture espace flexion au Mehary, ablation ostéophytes postérieurs et ménisques.","","##Temps tibial :",`Trial plateau ${platT}, empreinte au ciseau, essai PE ${insT} mm.`,"","Resurfaçage patellaire. No thumb test positif.","","##Bilan ligamentaire :","Balance satisfaisante en flexion et en extension.",`Flexion à ${flex}°, extension complète.`,"",`Cimentation : plateau ${platT}/insert ${insT}, fémur ${femT}, rotule ${rotT}.`,"Vicryl 2 + Stratafix capsulo-synovial, Vicryl 0 sous-cutané.","Agrafes. Pansement Aquacel Duoderm."]});
    if(docs.includes("CRH"))res["CRH"]=await mkCRH({nom,prenom,ddn,de:dateOp,ds:"[DATE SORTIE]",dateLettre:dateOp,mt,paras:[{type:"mixed",after:120,runs:[tx("Votre patient(e) "),tx(`${civ} ${nom} ${prenom}`,{bold:true}),tx(`, ${age} ans, a été hospitalisé(e) dans notre service du ${dateOp} au [DATE SORTIE] pour la réalisation de son arthroplastie totale de genou ${cote} sur ${ind} avec déformation en ${def} de ${deg}°.`)]}, ...(atcd?[{texte:atcd,after:120}]:[]),{texte:`L'intervention s'est parfaitement déroulée au bloc opératoire le ${dateOp} sous anesthésie [TYPE]. Les radiographies de contrôle post-opératoire sont satisfaisantes.`,after:120},{texte:"Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.",after:120},{texte:"Les suites ont été simples par ailleurs, la sortie du patient est donc autorisée ce jour sous couvert des consignes suivantes :",after:60},{type:"consigne",texte:"Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM"},{type:"consigne",texte:"Ablation des agrafes à J15 post-opératoire"},{type:"consigne",texte:"Kinésithérapie intensive selon le protocole remis au patient"},{type:"consigne",texte:"Appui complet autorisé d'emblée avec 2 cannes anglaises"},{type:"consigne",texte:"Antalgiques selon ordonnance"},{type:"consigne",texte:"Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours"},{texte:`Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du genou ${cote} de face et profil en charge et pangonogramme.`,after:200},{texte:"Bien cordialement.",after:300}]});
    if(docs.includes("Ordonnance pharma"))res["Ordonnance pharma"]=await mkOrdo(nom,prenom,ddn,dateOp,["**Matériel de soins :","AQUACEL Extra — 1 boîte","DUODERM Extra Thin — 1 boîte","Compresses stériles — 1 boîte","BISEPTINE — 1 flacon","Sérum physiologique — 30 dosettes","","**Analgésie :","","PARACÉTAMOL 1g — 1 cp/6h — QSP 30 jours","","IBUPROFÈNE 400mg — 1 cp matin/midi/soir — QSP 10 jours","OMÉPRAZOLE 20mg — 1 gél. matin — QSP 10 jours","","ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours (hors >70 ans)","","**Anticoagulation :","","INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours"]);
    if(docs.includes("Ordonnance IDE"))res["Ordonnance IDE"]=await mkOrdo(nom,prenom,ddn,dateOp,["Soins de pansements à domicile toutes les 4 jours jusqu'à cicatrisation.","","Ablation des agrafes à J15 post-opératoire.","","INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours.","","NFS plaquettes 1x/semaine pendant 35 jours."],`Ordonnance IDE — PTG ${cote}`);
    if(docs.includes("Ordonnance kiné"))res["Ordonnance kiné"]=await mkOrdo(nom,prenom,ddn,dateOp,[`**KINÉSITHÉRAPIE post-PTG ${cote} — Appui complet d'emblée — URGENT`,"","⚠ PRIORITÉ : extension 0° — NE PAS LAISSER S'INSTALLER UN FLESSUM","","##Phase 1 — J0 à J15 :","Extension → 0° dès J3-J5, flexion → 80° à J15","⚠ Si flexion < 90° à 6 semaines : me contacter","","##Phase 2 — J15 à 6 semaines :","Vélo dès flexion > 90°, renforcement quadriceps","","##Phase 3 — 6 semaines à 3 mois :","Objectif flexion > 120°, reprise légère à 3 mois"]);
    if(docs.includes("Ordonnance matériel"))res["Ordonnance matériel"]=await mkOrdo(nom,prenom,ddn,dateOp,["2 Cannes anglaises réglables — 1 paire","","Attelle de cryothérapie (type Cryo Cuff genou) — 1","",`Bas de contention classe II — Jambe ${cote} — QSP 3 mois`]);
  }

  if(inter==="LCA"){
    const{ressaut,atcd,dT,dF,vT,vF,cbRM,cbRL,cbSM,cbSL,cbRamp,cart}=f;
    const men=[];
    if(cbRM)men.push("régularisation méniscale médiale");
    if(cbRL)men.push("régularisation méniscale latérale");
    if(cbSM)men.push("suture méniscale médiale");
    if(cbSL)men.push("suture méniscale latérale");
    if(cbRamp)men.push("ramp lésion");
    const hasSut=cbSM||cbSL;
    if(docs.includes("CRO"))res["CRO"]=await mkCRO({nom,prenom,ddn,dateOp,de:"",ds:"",aides,indication:`Reconstruction du ligament croisé antérieur du genou ${cote} par technique DT3+2. Ressaut rotatoire ${ressaut} en pré-opératoire.`,ccam:"NFMC003",tempsOp:["Installation en décubitus dorsal, genou fléchi à 90°.","Badigeon et champage stérile.","Antibioprophylaxie pré-opératoire selon le protocole du CLIN.","Check-list.","","##Prélèvement du greffon :","Incision verticale en regard de la patte d'oie.","Prélèvement du demi-tendineux et du droit interne au stripper atraumatique.","Ischio-jambiers laissés pédiculés, compresse Vancomycine, remise en gaine.","","Garrot pneumatique 300 mmHg.","","##Temps arthroscopique :","Voie antéro-latérale puis antéro-médiale à l'aiguille.","Exploration systématique :",`- Fémoro-patellaire : ${cart||"RAS"}`,"- Compartiments médial et latéral : RAS","- LCA rompu / LCP intact.",...(men.length?[`Gestes associés : ${men.join(", ")}.`]:[]),"","##Temps tibial :","Guide 55°, mèche 9 mm, shaver.","","##Temps fémoral :","Contre-abord épicondyle latéral, outside-in 55°, mèche 9 mm.","","##Préparation du greffon :",`Calibrage ${dT} mm tibia / ${dF} mm fémur, tigerstick, XBRAID DT3+2.`,"","Cyclage du genou.",`Fixation fémur : vis ${vF}. Fixation tibia : vis ${vT} à 30° flexion.`,"","##Retour externe :","Passage sous fascia lata, tunnel 6 mm, endobouton RT en extension rotation neutre.","","Lachman négatif. Tiroir négatif.","Vicryl 2-0 sous-cutané, Vicryl 3-0 rapide cutané. Pansement sec."]});
    if(docs.includes("CRH"))res["CRH"]=await mkCRH({nom,prenom,ddn,de:"",ds:"",dateLettre:dateOp,mt,paras:[{type:"mixed",after:120,runs:[tx("Votre patient(e) "),tx(`${civ} ${nom} ${prenom}`,{bold:true}),tx(`, ${age} ans, a été pris(e) en charge en ambulatoire le ${dateOp} pour la reconstruction du ligament croisé antérieur du genou ${cote} par technique DT3+2.`)]},...(atcd?[{texte:atcd,after:120}]:[]),{texte:`L'intervention s'est parfaitement déroulée sous anesthésie [TYPE].`,after:60},...(men.length?[{texte:`Un geste associé a été réalisé : ${men.join(", ")}.`,after:120}]:[]),{texte:"Les suites ont été simples, la sortie du patient est donc autorisée le jour même sous couvert des consignes suivantes :",after:60},{type:"consigne",texte:`Appui complet autorisé d'emblée avec 2 cannes anglaises${hasSut?" (appui protégé 1 mois en raison de la suture méniscale)":""}`},{type:"consigne",texte:"Soins de pansements toutes les 48h par IDE à domicile"},{type:"consigne",texte:"Ablation des agrafes à J15 post-opératoire"},{type:"consigne",texte:"Kinésithérapie en urgence selon le protocole DT3+2 remis au patient"},{type:"consigne",texte:"Antalgiques selon ordonnance"},{type:"consigne",texte:"Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour pendant 21 jours avec contrôle plaquettaire hebdomadaire"},{texte:"Pour ma part, je le reverrai en consultation de contrôle dans 4 semaines.",after:200},{texte:"Bien cordialement.",after:300}]});
    if(docs.includes("Ordonnance pharma"))res["Ordonnance pharma"]=await mkOrdo(nom,prenom,ddn,dateOp,["**Matériel IDE :","BISEPTINE, sérum physiologique, compresses, COSMOPORE","","**Analgésie :","","PARACÉTAMOL 1g — 4x/j — QSP 30 jours","","APRANAX 550mg — matin + après-midi — QSP 5 jours","OMÉPRAZOLE 20mg — 1 gél. matin — QSP 5 jours","","ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours","","**Anticoagulation :","","INNOHEP 4500 UI/j — 1 injection SC pendant 21 jours"]);
    if(docs.includes("Ordonnance IDE"))res["Ordonnance IDE"]=await mkOrdo(nom,prenom,ddn,dateOp,["Soins de pansements toutes les 48h jusqu'à cicatrisation.","","Ablation des agrafes à J15. (Surjet : retirer uniquement la boucle à l'extrémité)","","INNOHEP 4500 UI/j — 1 injection SC pendant 21 jours.","","NFS plaquettes 1x/semaine pendant 21 jours."],`Ordonnance IDE — LCA ${cote}`);
    if(docs.includes("Ordonnance kiné"))res["Ordonnance kiné"]=await mkOrdo(nom,prenom,ddn,dateOp,[`**Kinésithérapie post-LCA ${cote} — DT3+2 — URGENT`,"","##S1 → S3 :",`Verrouillage extension, flexion 60°, chaîne fermée${hasSut?", 2 cannes 1 mois":""}`,"","##S3 → M2 :","Flexion 120°, vélo sans résistance","","##M2 → M4 :","Proprioception, course terrain plat — Test isocinétique M4","","##M4 → M6 :","Réathlétisation — CI pivot/contact","","##M6 → M9 :","Reprise entraînement dès M7 — Pas de compétition","","##M9 → M12 :","Reprise compétition"]);
    if(docs.includes("Ordonnance matériel"))res["Ordonnance matériel"]=await mkOrdo(nom,prenom,ddn,dateOp,["2 Cannes anglaises réglables — 1 paire","","Attelle de cryothérapie (type Cryo Cuff genou) — 1"]);
  }

  return res;
}

// ─── DESIGN ───────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
body { background: #F7F4EF; color: #2A2118; font-family: 'DM Sans', sans-serif; margin: 0; min-height: 100vh; -webkit-font-smoothing: antialiased; }
.app { max-width: 660px; margin: 0 auto; padding: 2rem 1rem 5rem; }
.card { background: #FFFFFF; border: 1px solid #E6DDD3; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(42,33,24,0.06), 0 4px 16px rgba(42,33,24,0.05); }
.st { font-size: 10px; font-weight: 500; color: #AFA49A; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 12px; font-weight: 500; color: #7A6E65; margin-bottom: 5px; }
.field input, .field select, .field textarea { width: 100%; font-size: 14px; font-family: 'DM Sans', sans-serif; background: #FAF8F5; border: 1px solid #E6DDD3; border-radius: 9px; padding: 9px 12px; color: #2A2118; outline: none; transition: all 0.15s; }
.field input:focus, .field textarea:focus, .field select:focus { border-color: #C4A882; background: #fff; box-shadow: 0 0 0 3px rgba(196,168,130,0.12); }
.field textarea { min-height: 70px; resize: vertical; }
.r2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.r3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.tg { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.tb { padding: 7px 16px; border: 1px solid #E6DDD3; border-radius: 20px; background: #FAF8F5; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; transition: all 0.12s; }
.tb:hover { border-color: #C4A882; color: #5C4A35; }
.tb.on { background: #F5ECE0; border-color: #C4A882; color: #8B6035; font-weight: 500; }
.doc-chip { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; background: #FAF8F5; transition: all 0.12s; }
.doc-chip.on { background: #EDF5F0; border-color: #82B99A; color: #3A6B4C; font-weight: 500; }
.sec-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid #E6DDD3; border-radius: 12px; cursor: pointer; background: #FAF8F5; margin-bottom: 8px; transition: all 0.12s; }
.sec-card:hover { border-color: #C4A882; background: #fff; }
.sec-card.on { background: #F5ECE0; border-color: #C4A882; }
.av { width: 38px; height: 38px; border-radius: 50%; background: #E6DDD3; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #7A6E65; flex-shrink: 0; }
.sec-card.on .av { background: #C4A882; color: white; }
.btn { padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border: 1px solid #E6DDD3; background: #fff; color: #2A2118; transition: all 0.12s; }
.btn:hover { background: #F7F4EF; }
.btn-p { background: #7C5C38; border-color: #7C5C38; color: white; }
.btn-p:hover { background: #6A4D2E; border-color: #6A4D2E; }
.btn-s { background: #3A6B4C; border-color: #3A6B4C; color: white; }
.btn-s:hover { background: #2F5A3E; }
.btn-sm { padding: 7px 16px; font-size: 13px; }
.back-btn { background: none; border: none; font-size: 13px; color: #7A6E65; cursor: pointer; padding: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; transition: color 0.12s; }
.back-btn:hover { color: #2A2118; }
.int-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 12px; margin-bottom: 2rem; }
.int-card { background: #fff; border: 1px solid #E6DDD3; border-radius: 16px; padding: 1.25rem 1rem 1rem; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 3px rgba(42,33,24,0.06), 0 4px 16px rgba(42,33,24,0.04); }
.int-card:hover { border-color: #C4A882; box-shadow: 0 4px 20px rgba(42,33,24,0.12); transform: translateY(-2px); }
.int-card.off { opacity: 0.4; cursor: not-allowed; }
.int-card.off:hover { transform: none; box-shadow: 0 1px 3px rgba(42,33,24,0.06); border-color: #E6DDD3; }
.int-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 500; color: #2A2118; line-height: 1.2; }
.int-sub { font-size: 11px; color: #AFA49A; margin-top: 4px; line-height: 1.4; }
.doc-tab { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; background: #FAF8F5; color: #7A6E65; transition: all 0.12s; }
.doc-tab.on { background: #fff; border-color: #C4A882; color: #7C5C38; font-weight: 500; }
.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #E6DDD3; border-top-color: #8B6035; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
@keyframes spin { to { transform: rotate(360deg); } }
.cb-row { display: flex; flex-direction: column; gap: 8px; }
.cbi { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #2A2118; cursor: pointer; padding: 4px 0; user-select: none; }
.cbi input[type=checkbox] { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 2px solid #C4A882; border-radius: 5px; background: #FAF8F5; cursor: pointer; flex-shrink: 0; transition: all 0.12s; position: relative; display: inline-flex; align-items: center; justify-content: center; }
.cbi input[type=checkbox]:checked { background: #8B6035; border-color: #8B6035; }
.cbi input[type=checkbox]:checked::after { content: ''; display: block; width: 5px; height: 9px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(45deg) translate(-1px, -1px); }
.alert-i { background: #F5ECE0; color: #7C5C38; border: 1px solid #D4B896; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-top: 12px; }
.page-title { font-family: 'Lora', serif; font-size: 30px; font-weight: 400; color: #2A2118; margin: 0 0 4px; }
.page-sub { font-size: 13px; color: #AFA49A; margin: 0 0 1.75rem; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 1.5rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; background: #F5ECE0; color: #8B6035; }
.count-hint { font-size: 12px; color: #AFA49A; margin-top: 4px; }
`;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [inter, setInter] = useState("");
  const [form, setForm] = useState({});
  const [selDocs, setSelDocs] = useState(new Set());
  const [selSecs, setSelSecs] = useState(new Set());
  const [gDocs, setGDocs] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mailMsg, setMailMsg] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const sf = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const sfv = (k, v) => setForm(f => ({...f, [k]: v}));
  const sfb = (k) => (e) => setForm(f => ({...f, [k]: e.target.checked}));
  const fmtD = (s) => { if (!s) return "[DATE]"; const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; };

  function goInter(id) {
    setInter(id);
    setForm({ date: today, civilite: "Monsieur", cote: "droit", tigeType: "Standard", tetem: "inox", infiltr: "Non", deformation: "varus", ressaut: "absent" });
    setSelDocs(new Set(DOCS[id]));
    setSelSecs(new Set());
    setMailMsg(null);
    setScreen("form");
  }
  function togDoc(d) { setSelDocs(s => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n; }); }
  function togSec(id) { setSelSecs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function handleGen() {
    setGenerating(true); setMailMsg(null); setScreen("docs");
    const f = {
      nom: (form.nom||"").toUpperCase()||"[NOM]", prenom: form.prenom||"[PRÉNOM]",
      ddn: fmtD(form.ddn), age: form.age||"[ÂGE]", dateOp: fmtD(form.date),
      civ: form.civilite||"Monsieur", cote: form.cote||"droit",
      aides: form.aides||"[AIDES]", mt: form.mt||"[MÉDECIN TRAITANT]",
      ind: form.indication||"[INDICATION]", atcd: form.atcd||"",
      cotT: form.cotT||"[X]", cotM: form.cotM||"Ecofit", tigT: form.tigT||"[X]", tigM: form.tigM||"Ecofit",
      tigeType: form.tigeType||"Standard", col: form.col||"court", tete: form.tete||"28",
      tetem: form.tetem||"inox", rape: form.rape||"[X]", infiltr: form.infiltr||"Non",
      def: form.deformation||"varus", deg: form.degres||"0",
      femT: form.femT||"[X]", platT: form.platT||"[X]", insT: form.insT||"[X]",
      rotT: form.rotT||"[X]", flex: form.flex||"[X]",
      ressaut: form.ressaut||"absent", dT: form.dT||"[X]", dF: form.dF||"[X]",
      vT: form.vT||"[X]", vF: form.vF||"[X]",
      cbRM: !!form.cbRM, cbRL: !!form.cbRL, cbSM: !!form.cbSM, cbSL: !!form.cbSL, cbRamp: !!form.cbRamp,
      cart: form.cart||"",
    };
    try {
      const docs = await genDocs(inter, f, [...selDocs]);
      const res = {};
      for (const [name, doc] of Object.entries(docs)) {
        res[name] = await Packer.toBuffer(doc);
      }
      setGDocs(res);
      setActiveTab(Object.keys(res)[0]||"");
    } catch(e) { console.error("Generation error:", e); alert("Erreur génération: " + e.message); }
    setGenerating(false);
  }

  function dlDoc(name) {
    const buf = gDocs[name]; if (!buf) return;
    const blob = new Blob([buf], {type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = `${inter}_${(form.nom||"PATIENT").toUpperCase()}_${name.replace(/ /g,"_")}_${fmtD(form.date)}.docx`;
    a.click(); URL.revokeObjectURL(url);
  }
  function dlAll() { Object.keys(gDocs).forEach((n,i) => setTimeout(()=>dlDoc(n), i*250)); }

  const LABELS = {PTH:"Prothèse totale de hanche",PTG:"Prothèse totale de genou",LCA:"Reconstruction LCA DT3+2"};

  function SpecFields() {
    if (inter === "PTH") return <>
      <div className="field"><label>Indication</label><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: coxarthrose primitive"/></div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r3">
        <div className="field"><label>Taille cotyle</label><input type="number" value={form.cotT||""} onChange={sf("cotT")} placeholder="52"/></div>
        <div className="field"><label>Modèle cotyle</label><input value={form.cotM||""} onChange={sf("cotM")} placeholder="Ecofit"/></div>
        <div className="field"><label>Taille râpe</label><input type="number" value={form.rape||""} onChange={sf("rape")} placeholder="7"/></div>
      </div>
      <div className="r3">
        <div className="field"><label>Taille tige</label><input type="number" value={form.tigT||""} onChange={sf("tigT")} placeholder="7"/></div>
        <div className="field"><label>Modèle tige</label><input value={form.tigM||""} onChange={sf("tigM")} placeholder="Ecofit"/></div>
        <div className="field"><label>Type tige</label><div className="tg">{["Standard","Latéralisée"].map(v=><button key={v} className={`tb${form.tigeType===v?" on":""}`} onClick={()=>sfv("tigeType",v)}>{v}</button>)}</div></div>
      </div>
      <div className="r3">
        <div className="field"><label>Col</label><input value={form.col||""} onChange={sf("col")} placeholder="court"/></div>
        <div className="field"><label>Tête (mm)</label><input type="number" value={form.tete||""} onChange={sf("tete")} placeholder="28"/></div>
        <div className="field"><label>Matière tête</label><div className="tg">{["inox","céramique"].map(v=><button key={v} className={`tb${form.tetem===v?" on":""}`} onClick={()=>sfv("tetem",v)}>{v}</button>)}</div></div>
      </div>
      <div className="field"><label>Infiltration péri-articulaire</label><div className="tg">{["Oui","Non"].map(v=><button key={v} className={`tb${form.infiltr===v?" on":""}`} onClick={()=>sfv("infiltr",v)}>{v}</button>)}</div></div>
    </>;
    if (inter === "PTG") return <>
      <div className="field"><label>Indication</label><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: gonarthrose tricompartimentaire"/></div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r2">
        <div className="field"><label>Déformation</label><div className="tg">{["varus","valgus"].map(v=><button key={v} className={`tb${form.deformation===v?" on":""}`} onClick={()=>sfv("deformation",v)}>{v}</button>)}</div></div>
        <div className="field"><label>Degrés</label><input type="number" value={form.degres||""} onChange={sf("degres")} placeholder="8"/></div>
      </div>
      <div className="r3">
        <div className="field"><label>Fémur ACS</label><input value={form.femT||""} onChange={sf("femT")} placeholder="4"/></div>
        <div className="field"><label>Plateau ACS</label><input value={form.platT||""} onChange={sf("platT")} placeholder="3"/></div>
        <div className="field"><label>Insert (mm)</label><input type="number" value={form.insT||""} onChange={sf("insT")} placeholder="10"/></div>
      </div>
      <div className="r2">
        <div className="field"><label>Bouton rotulien</label><input value={form.rotT||""} onChange={sf("rotT")} placeholder="29"/></div>
        <div className="field"><label>Flexion obtenue (°)</label><input type="number" value={form.flex||""} onChange={sf("flex")} placeholder="120"/></div>
      </div>
    </>;
    if (inter === "LCA") return <>
      <div className="field"><label>Ressaut rotatoire pré-op</label><div className="tg">{["absent","présent"].map(v=><button key={v} className={`tb${form.ressaut===v?" on":""}`} onClick={()=>sfv("ressaut",v)}>{v}</button>)}</div></div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r2">
        <div className="field"><label>Diamètre tibial (mm)</label><input type="number" value={form.dT||""} onChange={sf("dT")} placeholder="8"/></div>
        <div className="field"><label>Diamètre fémoral (mm)</label><input type="number" value={form.dF||""} onChange={sf("dF")} placeholder="8"/></div>
      </div>
      <div className="r2">
        <div className="field"><label>Vis tibiale</label><input value={form.vT||""} onChange={sf("vT")} placeholder="9x25"/></div>
        <div className="field"><label>Vis fémorale</label><input value={form.vF||""} onChange={sf("vF")} placeholder="9x25"/></div>
      </div>
      <div className="field"><label>Gestes associés</label>
        <div className="cb-row">
          {[["cbRM","Régularisation méniscale médiale"],["cbRL","Régularisation méniscale latérale"],["cbSM","Suture méniscale médiale"],["cbSL","Suture méniscale latérale"],["cbRamp","Ramp lésion"]].map(([k,l])=>(
            <label key={k} className="cbi"><input type="checkbox" checked={!!form[k]} onChange={sfb(k)}/>{l}</label>
          ))}
        </div>
      </div>
      <div className="field"><label>Lésions cartilagineuses (optionnel)</label>
        <textarea value={form.cart||""} onChange={sf("cart")} placeholder="ex: lésion grade III compartiment médial fémoral"/>
      </div>
    </>;
    return null;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {screen === "home" && (
          <>
            <p className="page-title">Bloc chirurgical</p>
            <p className="page-sub">Dr Tom ROUSSEL — Traumatologie-Orthopédie, Hôpital Roger Salengro</p>
            <div className="int-grid">
              {[["PTH","Prothèse totale de hanche",true],["PTG","Prothèse totale de genou",true],["LCA","Reconstruction DT3+2",true],["TTA + MPFL","Bientôt disponible",false],["Ménisque","Bientôt disponible",false]].map(([id,sub,avail])=>(
                <div key={id} className={`int-card${avail?"":" off"}`} onClick={()=>avail&&goInter(id)}>
                  <div className="int-title">{id}</div>
                  <div className="int-sub">{sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === "form" && (
          <>
            <button className="back-btn" onClick={()=>setScreen("home")}>← Retour</button>
            <p className="page-title">{inter}</p>
            <p className="page-sub">{LABELS[inter]}</p>

            <div className="card">
              <div className="st">Patient</div>
              <div className="r2">
                <div className="field"><label>Nom</label><input value={form.nom||""} onChange={sf("nom")} placeholder="NOM"/></div>
                <div className="field"><label>Prénom</label><input value={form.prenom||""} onChange={sf("prenom")} placeholder="Prénom"/></div>
              </div>
              <div className="r3">
                <div className="field"><label>Date de naissance</label><input type="date" value={form.ddn||""} onChange={sf("ddn")}/></div>
                <div className="field"><label>Âge</label><input type="number" value={form.age||""} onChange={sf("age")} placeholder="54"/></div>
                <div className="field"><label>Date intervention</label><input type="date" value={form.date||today} onChange={sf("date")}/></div>
              </div>
              <div className="r2">
                <div className="field"><label>Civilité</label><div className="tg">{["Monsieur","Madame"].map(v=><button key={v} className={`tb${form.civilite===v?" on":""}`} onClick={()=>sfv("civilite",v)}>{v}</button>)}</div></div>
                <div className="field"><label>Côté</label><div className="tg">{["droit","gauche"].map(v=><button key={v} className={`tb${form.cote===v?" on":""}`} onClick={()=>sfv("cote",v)}>{v}</button>)}</div></div>
              </div>
              <div className="field"><label>Aides opératoires</label><input value={form.aides||""} onChange={sf("aides")} placeholder="ex: Florian PETELLE – Claire ZIEGLER interne"/></div>
              <div className="field"><label>Médecin traitant</label><input value={form.mt||""} onChange={sf("mt")} placeholder="Dr Nom Prénom"/></div>
            </div>

            <div className="card">
              <div className="st">Détails intervention</div>
              <SpecFields/>
            </div>

            <div className="card">
              <div className="st">Documents à générer</div>
              <div className="chip-row">{(DOCS[inter]||[]).map(d=><button key={d} className={`doc-chip${selDocs.has(d)?" on":""}`} onClick={()=>togDoc(d)}>{d}</button>)}</div>
              <p className="count-hint">{selDocs.size} document(s) sélectionné(s)</p>
            </div>

            <div className="card">
              <div className="st">Secrétaires destinataires</div>
              {Object.entries(SECS).map(([id,sec])=>(
                <div key={id} className={`sec-card${selSecs.has(id)?" on":""}`} onClick={()=>togSec(id)}>
                  <div className="av">{sec.ini}</div>
                  <div><div style={{fontSize:14,fontWeight:500}}>{sec.nom}</div><div style={{fontSize:12,color:"#7A6E65"}}>{sec.email}</div></div>
                </div>
              ))}
              <div className="sec-card" style={{opacity:.4,cursor:"not-allowed"}}>
                <div className="av">?</div>
                <div><div style={{fontSize:14,fontWeight:500}}>Secrétariat ambulatoire</div><div style={{fontSize:12,color:"#7A6E65"}}>Email à renseigner</div></div>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-p" onClick={handleGen} disabled={selDocs.size===0}>Générer {selDocs.size} document{selDocs.size>1?"s":""}</button>
              <button className="btn" onClick={()=>setScreen("home")}>Annuler</button>
            </div>
          </>
        )}

        {screen === "docs" && (
          <>
            <button className="back-btn" onClick={()=>setScreen("form")}>← Modifier</button>
            <p className="page-title">{(form.nom||"").toUpperCase()} {form.prenom||""}</p>
            <p className="page-sub"><span className="tag">{inter}</span>&nbsp; {fmtD(form.date)}</p>

            {generating ? (
              <div className="card" style={{textAlign:"center",padding:"3rem"}}>
                <span className="spinner"/>
                <span style={{fontSize:14,color:"#7A6E65"}}>Génération des fichiers Word...</span>
              </div>
            ) : (
              <>
                <div className="card">
                  <div className="st">Documents générés</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                    {Object.keys(gDocs).map(name=>(
                      <button key={name} className={`doc-tab${activeTab===name?" on":""}`} onClick={()=>setActiveTab(name)}>{name}</button>
                    ))}
                  </div>
                  {activeTab && <button className="btn btn-s btn-sm" onClick={()=>dlDoc(activeTab)}>↓ Télécharger "{activeTab}"</button>}
                </div>

                <div className="card">
                  <div className="st">Envoi aux secrétaires</div>
                  <p style={{fontSize:13,color:"#7A6E65",marginBottom:14}}>
                    {selSecs.size>0 ? `Destinataires : ${[...selSecs].map(id=>SECS[id].nom).join(", ")}` : "Aucune secrétaire sélectionnée"}
                  </p>
                  <div className="actions" style={{marginTop:0}}>
                    <button className="btn btn-p" onClick={dlAll}>↓ Tout télécharger</button>
                    {selSecs.size>0&&<button className="btn btn-s" onClick={()=>{dlAll();const emails=[...selSecs].map(id=>SECS[id].email).join(", ");const noms=[...selSecs].map(id=>SECS[id].nom).join(" et ");setMailMsg(`Documents téléchargés. Envoyez à ${noms} — ${emails}`);}}>Préparer l'envoi</button>}
                    <button className="btn" onClick={()=>setScreen("home")}>Nouveau dossier</button>
                  </div>
                  {mailMsg && <div className="alert-i">{mailMsg}</div>}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
