import { useState } from "react";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, VerticalAlign, UnderlineType,
  Header, Footer, ImageRun
} from "docx";

const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAHQAAABHCAIAAABZFvRzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAh1QAAIdUBBJy0nQAABOZJREFUeF7tWn9k1VEUX3+NpMg0MkViZBqZRlIkRqaRKRIj00iKxEiKRCRG0sg0MkX6fySNTCOzkWnMFEkjs5FpZLY+z/m++84798f3/bp7a51n5vvu99zP95zP/dxz7r3ft2Vtba1GP5EYALn6icRATSRchc2kBGUhHgNKbjxuVbkRubXIRdnkj6OvppaKW7zGkpn5bywFAnWhu6J7oDEmAxGxZVrgwQu+nLz7RsImVwThG0UbMGL0kaEd5HL1hZXr5Evo1ylnW+BGtpHjXVf4gsh1emRPas4jn/siA4i0YI+QEPW68lHRh7nJ9SXQ8JwNaDbAl0hEPPNWNNIqgFWf3EBC+Ncl7CXXzGXfiNuR2+nVqNJnHK57m5lcX9nxaU2XYrJ+VCEV/TeP1O1vxKFWcpXciAxEhFblKrkRGYgI7VBu7dZt+MMz6T9dmEb7q2kxXURH4z5v5zimnSPwhwp/hA/mrugi2k0s/ILHZcMKxwQzoq89SkpuoiRbRmHeuaS8+yz7hiqXS55PO1VuLqdpWsjL5ppzZX3TgqY5N7fy0dVCki74IqyQhRGvOZpzNefqJiJ/J+Vcq+kmIm/baW8EnHs85/5CNxHJJl7s3bWgaUHLphl7X8inkh7c5NKxni3o2UJuDadHjsm5sF1M7JM9+6hXz3Nz5+t6WE4a0sNyPSzPf+2kr3mSJGu/H/Md2gbSseZczbnydEFzruZczbk8mer2V5diyftA3/vzQt59+F6gKblKbvaHVYXoSN+hJa8DzLG/vRYWt3Sdq+vcAta5gQytt4piQH/8XBRdxRkrucXxVZS1klsUXcUZl0vu2MdxlPIdu+ror/fmLXr+3MJ8x5lOtDQeaOp78pg71XWxG+179+2/c/eeaTcImYuddbXbk592BXDQHSCwP3f+wuKvpfBzffg+/4tj0WNdLrn9TwcQmw3eeuQo2pf/rCz+Xmo71d7/bIBsrl2/AdLRDtaaD7UMPh+y+4L9vkfJePhw7j942Hy4Ze7nPKA6znZ2XeomHJ+9GF2D7/N/Q5CLqBCncAUxQ874T+0jH0YRM11DlWMT43QNZluPJe0GYeT9aOPBpkSGfhxoFrBkhvH7+u07LgLPdeKj0el/RZgFSLnKhfqOnziJuV+/p6Hn6pXl1RWAIlSQi5jJS0w9cJpp/5HfPjGO2SoiAd0vX72mRh8OkgDwYQbx1u9ugNKh34A9fwTHR7vT/41CbtvpdpramOaY/oiTPIPTxDWIgA1tsaZnZvlmTHyFweSnKZDFYwvg9FzO4qc91wDa+D7/K8JvucrlTmSKQ7YQQaTgGkxBKchrRJlULhSdr1zUQwwJx3Tj0MzIFrHMzMjiOO0NoI3v87/65CLHmeUBvEG6NLqb/DxFKQIfkAui6RosQD50PfhiCClF6HT4zVve4sPBKPKcnvpcM584fsD/6pML+pBqaUWFtACRGq5RwajQTX+ZRfEZfpdQhtUCZqJztQC0TBlcSMoghefDgcDNagQjBNiwPe7a+AH/q08uPIAMERvqFVjuvZ0scjOczsyCa7Sj1vH1FmildS60xte56ELly+idwvPirK6AX4AAipJv2N6H7/N/Q5BbESc2K0glC9pm5ajkuJTckqlL76jkpnNUsoWSWzJ16R2V3HSOSrZQckumLr2jkpvOUckWfwHWqjVoddZlMAAAAABJRU5ErkJggg==";

const BARCODE_B64 = "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";
const SECS = {
  coralie: { nom: "Coralie Wallaert", email: "coralie.wallaert@chu-lille.fr", ini: "CW" },
  alexandre: { nom: "Alexandre Delmeire", email: "alexandre1.delmeire@chu-lille.fr", ini: "AD" },
};
const DOCS = {
  PTH: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
  PTG: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
  LCA: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"],
};

// ─── DOCX HELPERS ─────────────────────────────────────────────
function b64ToArr(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
const nb = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const anb = () => ({ top: nb(), bottom: nb(), left: nb(), right: nb(), insideHorizontal: nb(), insideVertical: nb() });
const tx = (t, o = {}) => new TextRun({ text: t, font: "Arial", size: o.size ?? 20, bold: o.bold ?? false, italics: o.italics ?? false, underline: o.underline ? { type: UnderlineType.SINGLE } : undefined, color: o.color ?? "000000" });
const pp = (r, o = {}) => new Paragraph({ alignment: o.align ?? AlignmentType.LEFT, spacing: { after: o.after ?? 0, before: o.before ?? 0 }, children: Array.isArray(r) ? r : [r] });
const pj = (t, o = {}) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: o.after ?? 60, before: o.before ?? 0 }, children: [tx(t, o)] });
const ep = (a = 80) => pp(tx(""), { after: a });
const parseLine = (l) => {
  if (l === "") return ep(80);
  if (l.startsWith("##")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true, underline: true })], { after: 60 });
  if (l.startsWith("**")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true })], { after: 60 });
  return pj(l, { after: 60 });
};

function mkHeader() {
  const logo = b64ToArr(LOGO_B64);
  const barcode = b64ToArr(BARCODE_B64);
  return new Header({ children: [new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [4602, 4602], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 4602, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new ImageRun({ data: logo, transformation: { width: 80, height: 49 }, type: "png" })] })] }), new TableCell({ borders: anb(), width: { size: 4602, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 4 }, children: [tx("N° FINESS", { size: 14, color: "444444" })] }), new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 }, children: [new ImageRun({ data: barcode, transformation: { width: 76, height: 77 }, type: "png" })] })] })] })] })] });
}
const mkFooter = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } }, children: [tx("Rue du Professeur Emile Laine – 59037 Lille Cedex     www.chru-lille.fr", { size: 16 })] })] });

function svcLeft(before = 0) {
  const I = 120;
  return [
    pp([tx("Pr C. CHANTELOT", { size: 18, bold: true, italics: true })], { after: 0, before }),
    pp([tx("Chef de Service", { size: 18, italics: true })], { after: I }),
    pp([tx("Praticien Hospitalier", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Dr Marion HALBAUT", { size: 18 })], { after: I }),
    pp([tx("Chefs de clinique", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Dr Noémie ALLIO", { size: 18 })], { after: 0 }),
    pp([tx("Dr Allison FITOUSSI", { size: 18 })], { after: 0 }),
    pp([tx("Dr Tom ROUSSEL", { size: 18 })], { after: I }),
    pp([tx("Cadres de Santé", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Mme WALLART (5ème SUD)", { size: 18 })], { after: 0 }),
    pp([tx("☎ 03 20 44 66 02", { size: 18 })], { after: I }),
    pp([tx("Secrétariat hospitalisation", { size: 18, bold: true })], { after: 0 }),
    pp([tx("☎ 03 20 44 68 21", { size: 18 })], { after: 0 }),
    pp([tx("✉ 03 20 44 68 99", { size: 18 })], { after: I }),
    pp([tx("Assistante Sociale", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Mlle Valérie DINOIRD", { size: 18 })], { after: 0 }),
    pp([tx("☎ 03 20 44 62 16", { size: 18 })], { after: 0 }),
  ];
}

function refBlk(nom, prenom, ddn, de, ds) {
  const l = [
    pp([tx("HOPITAL ROGER SALENGRO", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Pôle de l'Appareil locomoteur", { size: 18 })], { after: 0 }),
    pp([tx("Orthopédie et Traumatologie", { size: 18 })], { after: 40 }),
    pp([tx("Réf. : CW /", { size: 18 })], { after: 0 }),
    pp([tx(nom + " " + prenom, { size: 18 })], { after: 0 }),
    pp([tx("Né(e) le " + ddn, { size: 18 })], { after: 0 }),
  ];
  if (de) l.push(pp([tx(ds ? "Hospitalisation du " + de + " au " + ds : "Hospitalisation du : " + de + " au", { size: 18 })], { after: 0 }));
  return l;
}

function topTbl(nom, prenom, ddn, de, ds) {
  return new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [4500, 4704], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 4500, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: refBlk(nom, prenom, ddn, de, ds) }), new TableCell({ borders: anb(), width: { size: 4704, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: [ep(80), pp([tx(nom + " " + prenom, { size: 20, bold: true })], { after: 40 }), ep(40), ep(40)] })] })] });
}

function twoCol(right, slB = 0) {
  return new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [2800, 6404], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 2800, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: svcLeft(slB) }), new TableCell({ borders: anb(), width: { size: 6404, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: right })] })] });
}

const SP = { sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 851, right: 720, bottom: 567, left: 720, header: 426, footer: 342 } } } }] };

async function mkOrdo(nom, prenom, ddn, dateOp, lines, titre) {
  titre = titre || "ORDONNANCE";
  const h = mkHeader(), f = mkFooter();
  const patBox = new TableCell({ borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" } }, width: { size: 4500, type: WidthType.DXA }, margins: { top: 120, bottom: 120, left: 120, right: 120 }, children: [pp([tx(nom + " " + prenom + (ddn ? " - né(e) le " + ddn : ""), { size: 18 })], { after: 200 }), ep(80)] });
  const topT = new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [4600, 4604], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 4600, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: [pp([tx("HOPITAL ROGER SALENGRO", { size: 18 })], { after: 20 }), pp([tx("Pôle des Neurosciences et de l'Appareil Locomoteur", { size: 16 })], { after: 20 }), pp([tx("ORTHOPEDIE - TRAUMATOLOGIE", { size: 18, bold: true })], { after: 80 }), pp([tx("Service de Traumatologie", { size: 20, bold: true })], { after: 0 })] }), new TableCell({ borders: anb(), width: { size: 4604, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: [new Table({ width: { size: 4500, type: WidthType.DXA }, columnWidths: [4500], rows: [new TableRow({ children: [patBox] })] }), ep(40), pp([tx("Poids :", { size: 18, italics: true })], { after: 0 })] })] })] });
  const I = 120;
  const leftP = [ep(200), pp([tx("□ Pr Christophe CHANTELOT", { size: 20, bold: true })], { after: 0 }), pp([tx("Chef de Service", { size: 18 })], { after: 0 }), pp([tx("10003798971", { size: 18 })], { after: I }), pp([tx("□ Dr Marion HALBAUT", { size: 20, bold: true })], { after: 0 }), pp([tx("Praticien Hospitalier", { size: 18 })], { after: 0 }), pp([tx("10102005708", { size: 18 })], { after: I }), pp([tx("□ Dr Allison FITOUSSI", { size: 20, bold: true })], { after: 0 }), pp([tx("Cheffe de Clinique", { size: 18 })], { after: 0 }), pp([tx("10101538402", { size: 18 })], { after: I }), pp([tx("□ Dr Noémie ALLIO", { size: 20, bold: true })], { after: 0 }), pp([tx("Docteur Junior", { size: 18 })], { after: 0 }), pp([tx("10102200101", { size: 18 })], { after: I }), pp([tx("□ Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }), pp([tx("Docteur Junior", { size: 18 })], { after: 0 }), pp([tx("10102203147", { size: 18 })], { after: 0 })];
  const mainT = new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [3200, 6004], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 3200, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: leftP }), new TableCell({ borders: anb(), width: { size: 6004, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200 }, children: [tx("Lille, le " + dateOp, { size: 20 })] }), ...lines.map(parseLine), ep(200)] })] })] });
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topT, new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 }, children: [tx(titre, { size: 36, bold: true })] }), mainT] }] });
}

async function mkCRO(d) {
  const h = mkHeader(), f = mkFooter();
  const right = [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200, before: 160 }, children: [tx("Lille, le " + d.dateOp, { size: 20 })] }), new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [tx("COMPTE-RENDU OPERATOIRE", { size: 22, bold: true })] }), pj("Date opératoire : " + d.dateOp), pj("Opérateur : Docteur Tom ROUSSEL"), pj("Aides opératoires : " + d.aides), ep(80), new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [tx("Indication : ", { size: 20, bold: true }), tx(d.indication, { size: 20, bold: true })] }), pj("CCAM : " + d.ccam, { italics: true, after: 80 }), ...(d.implants ? [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [tx("Rappel des implants : ", { size: 20, bold: true }), tx(d.implants, { size: 20 })] })] : []), ep(40), ...d.tempsOp.map(parseLine), ep(160), pp([tx("Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }), pj("Docteur Junior — Service de Traumatologie-Orthopédie")];
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds || ""), ep(120), twoCol(right)] }] });
}

async function mkCRH(d) {
  const h = mkHeader(), f = mkFooter();
  const bP = d.paras.map(item => {
    if (item.type === "consigne") return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 }, indent: { left: 360 }, children: [tx("- " + item.texte, { size: 20 })] });
    if (item.type === "mixed") return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: item.after || 120 }, children: item.runs });
    return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: item.after || 120 }, children: [tx(item.texte, { bold: item.bold || false, italics: item.italics || false })] });
  });
  const right = [new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 160, before: 160 }, children: [tx("Lille, le " + d.dateLettre, { size: 20 })] }), pj("Cher confrère,", { after: 160 }), ...bP, ep(120), new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0 }, children: [tx("Professeur C. CHANTELOT", { size: 20, bold: true }), tx("          Le Docteur ROUSSEL TOM", { size: 20, bold: true })] })];
  const medP = new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0, before: 200 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } }, children: [tx("Lettre adressée à : " + (d.mt || "[MÉDECIN TRAITANT]"), { size: 16, color: "444444" })] });
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds), ep(120), twoCol(right, 480), ep(200), medP] }] });
}

// ─── CONTENT BUILDERS ─────────────────────────────────────────
function crh_pth_paras(civ, nom, prenom, age, dateOp, dateSortie, cote, ind, atcd, typeAnesthesie) {
  return [
    { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été hospitalisé(e) dans notre service du " + dateOp + " au [DATE SORTIE] pour la réalisation de son arthroplastie totale de hanche " + cote + " sur " + ind + ".")] },
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement déroulée au bloc opératoire le " + dateOp + " sous anesthésie " + typeAnesthesie + ". Les radiographies de contrôle post-opératoire sont satisfaisantes.", after: 120 },
    { texte: "Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.", after: 120 },
    { texte: "La sortie du patient est autorisée ce " + dateSortie + " sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM" },
    { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
    { type: "consigne", texte: "Kinésithérapie selon le protocole remis au patient" },
    { type: "consigne", texte: "Appui complet autorisé d'emblée avec 2 cannes anglaises, précautions anti-luxation pendant 6 semaines" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours" },
    { texte: "Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du bassin de face et de hanche " + cote + " de face et profil.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

function crh_ptg_paras(civ, nom, prenom, age, dateOp, dateSortie, cote, ind, def, deg, atcd, typeAnesthesie) {
  return [
    { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été hospitalisé(e) dans notre service du " + dateOp + " au [DATE SORTIE] pour la réalisation de son arthroplastie totale de genou " + cote + " sur " + ind + " avec déformation en " + def + " de " + deg + "°.")] },
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement déroulée au bloc opératoire le " + dateOp + " sous anesthésie " + typeAnesthesie + ". Les radiographies de contrôle post-opératoire sont satisfaisantes.", after: 120 },
    { texte: "Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.", after: 120 },
    { texte: "Les suites ont été simples par ailleurs, la sortie du patient est donc autorisée ce " + dateSortie + " sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM" },
    { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
    { type: "consigne", texte: "Kinésithérapie intensive selon le protocole remis au patient" },
    { type: "consigne", texte: "Appui complet autorisé d'emblée avec 2 cannes anglaises" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours" },
    { texte: "Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du genou " + cote + " de face et profil en charge et pangonogramme.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

function crh_lca_paras(civ, nom, prenom, age, dateOp, cote, atcd, men, hasSut, typeAnesthesie) {
  return [
    { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été pris(e) en charge en ambulatoire le " + dateOp + " pour la reconstruction du ligament croisé antérieur du genou " + cote + " par technique DT3+2.")] },
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement déroulée sous anesthésie " + (typeAnesthesie||"[TYPE]") + ".", after: 60 },
    ...(men.length ? [{ texte: "Un geste associé a été réalisé : " + men.join(", ") + ".", after: 120 }] : []),
    { texte: "Les suites ont été simples, la sortie du patient est donc autorisée le jour même sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Appui complet autorisé d'emblée avec 2 cannes anglaises" + (hasSut ? " (appui protégé 1 mois en raison de la suture méniscale)" : "") },
    { type: "consigne", texte: "Soins de pansements toutes les 48h par IDE à domicile" },
    { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
    { type: "consigne", texte: "Kinésithérapie en urgence selon le protocole DT3+2 remis au patient" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour pendant 21 jours avec contrôle plaquettaire hebdomadaire" },
    { texte: "Pour ma part, je le reverrai en consultation de contrôle dans 4 semaines.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

// ─── GENERATE ALL DOCS ────────────────────────────────────────
async function generateDocs(inter, f, docList) {
  const res = {};
  const { nom, prenom, ddn, age, dateOp, civ, cote, aides, mt, typeAnesthesie, dateSortie } = f;

  if (inter === "PTH") {
    const { ind, atcd, cotT, cotM, tigT, tigM, tigeType, col, tete, tetem, rape, infiltr } = f;
    const cotOpp = cote === "droit" ? "gauche" : "droit";
    const imp = "Cotyle " + cotM + " taille " + cotT + " / Tige " + tigM + " " + tigeType + " taille " + tigT + " / Tête " + tete + " DM " + tetem + " col " + col;
    if (docList.includes("CRO")) res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: dateOp, ds: "", aides, indication: "Arthroplastie totale de hanche " + cote + " dans le cadre d'une " + ind + ".", ccam: "NEKA020", implants: imp, tempsOp: ["Installation en décubitus latéral " + cotOpp + ".", "Badigeon et champage stérile.", "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.", "Check-list.", "", "Voie d'abord postéro-latérale.", "Hémostases sous cutanées.", "Ouverture du fascia lata.", "Discision des fibres du grand fessier.", "Pneumatisation de la bourse rétro-trochantérienne.", "Ouverture des pelvi-trochantériens et de la capsule en L inversé au ras du grand trochanter.", "Faufilage au Vicryl 2.", "Luxation de la hanche.", "Ostéotomie du col fémoral à la scie oscillante selon la planification pré-opératoire.", "Ablation de la tête fémorale sans difficulté.", "", "##Temps cotyloïdien :", "Exposition du cotyle.", "Ablation du labrum.", "Ablation du reliquat du ligament rond de la tête fémorale.", "Repérage du ligament transverse.", "Fraisages de tailles croissantes jusqu'à la taille " + cotT + " pour mise en place d'un cotyle définitif taille " + cotT + " DM " + cotM + " sans ciment légèrement plus antéversé que le transverse.", "La tenue primaire est excellente.", "", "##Temps fémoral :", "Exposition du fût fémoral jambe au zénith.", "Ablation du reliquat de col à l'emporte-pièce.", "Tunnelisation à la dague.", "Évidement du grand trochanter à la curette.", "On passe les râpes de tailles successives jusqu'à la râpe taille " + rape + ".", "Essais sur râpe en place col " + col + ".", "La stabilité est excellente et les longueurs sont restaurées.", "Décision de mise en place d'une tige " + tigM + " " + tigeType + " sans ciment taille " + tigT + ".", "Nouveaux essais sur la tige définitive strictement comparables.", "Mise en place d'une tête " + tete + " DM " + tetem + " col " + col + ".", "Réduction de la hanche.", "Nettoyage abondant.", ...(infiltr === "Oui" ? ["Infiltration péri-articulaire selon protocole."] : []), "Réinsertion des pelvi-trochantériens et de la capsule par des points trans-glutéaux au Lucas.", "Fermeture plan par plan.", "Agrafes à la peau.", "Pansement Aquacel Duoderm."] });
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: dateSortie||"[DATE SORTIE]", dateLettre: dateSortie||dateOp, mt, paras: crh_pth_paras(civ, nom, prenom, age, dateOp, dateSortie||"[DATE SORTIE]", cote, ind, atcd, typeAnesthesie) });
    if (docList.includes("Ordonnance pharma")) res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Matériel de soins :", "AQUACEL Extra — 1 boîte", "DUODERM Extra Thin — 1 boîte", "Compresses stériles 10x10 — 1 boîte", "BISEPTINE — 1 flacon", "Sérum physiologique — 30 dosettes", "", "**Analgésie :", "", "PARACÉTAMOL 1g — 1 cp/6h — QSP 30 jours", "", "IBUPROFÈNE 400mg — 1 cp matin/midi/soir — QSP 10 jours", "OMÉPRAZOLE 20mg — 1 gél. matin — QSP 10 jours", "", "ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours (hors >70 ans)", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours"]);
    if (docList.includes("Ordonnance IDE")) res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, ["Soins de pansements à domicile toutes les 4 jours jusqu'à cicatrisation complète.", "", "Ablation des agrafes à J15 post-opératoire.", "", "INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours.", "", "NFS plaquettes 1x/semaine pendant 35 jours."], "Ordonnance IDE — PTH " + cote);
    if (docList.includes("Ordonnance kiné")) res["Ordonnance kiné"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**KINÉSITHÉRAPIE post-PTH " + cote + " — Appui complet d'emblée — URGENT", "", "##Phase 1 — J0 à J15 :", "Cryothérapie, exercices isométriques, flexion < 70°", "ÉVITER : flexion > 90° + adduction + rotation interne combinées", "Marche 2 cannes, escaliers", "", "##Phase 2 — J15 à 6 semaines :", "Renforcement moyen fessier (priorité), vélo sans résistance S3-S4", "", "##Phase 3 — 6 semaines à 3 mois :", "Arrêt précautions anti-luxation à 6 semaines", "Reprise sportive légère à 3 mois"]);
    if (docList.includes("Ordonnance matériel")) res["Ordonnance matériel"] = await mkOrdo(nom, prenom, ddn, dateOp, ["2 Cannes anglaises réglables — 1 paire", "", "Réhausseur de toilettes — 1", "", "Bas de contention classe II — Jambe " + cote + " — QSP 3 mois"]);
  }

  if (inter === "PTG") {
    const { ind, atcd, def, deg, femT, platT, insT, rotT, flex } = f;
    const ccam = parseInt(deg) > 10 ? "NFKA008" : "NFKA007";
    const imp = "Fémur ACS taille " + femT + " / Plateau ACS taille " + platT + " / Insert " + insT + " mm / Bouton rotulien taille " + rotT;
    if (docList.includes("CRO")) res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: dateOp, ds: "", aides, indication: "Arthroplastie totale de genou " + cote + " dans le cadre d'une " + ind + " avec déformation en " + def + " de " + deg + "°.", ccam, implants: imp, tempsOp: ["Installation en décubitus dorsal.", "Badigeon et champage stérile.", "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.", "Check-list.", "", "Voie d'abord médiale para-patellaire.", "Arthrotomie médiale para-patellaire.", "Éversion de la rotule.", "Résection des ostéophytes périphériques.", "Résection du corps adipeux de Hoffa.", "Résection du pivot central.", "", "##Coupe tibiale première :", "Guide tibial extra-médullaire.", "Résection tibiale proximale selon planification.", "Contrôle de l'espace par l'hémi-espaceur.", "", "##Temps fémoral :", "Guide fémoral intra-médullaire.", "Résections distale, antérieure, postérieure et chanfreins.", "Trial fémoral taille " + femT + ".", "Ouverture espace flexion au Mehary, ablation ostéophytes postérieurs et ménisques.", "", "##Temps tibial :", "Trial plateau " + platT + ", empreinte au ciseau, essai PE " + insT + " mm.", "", "Resurfaçage patellaire. No thumb test positif.", "", "##Bilan ligamentaire :", "Balance satisfaisante en flexion et en extension.", "Flexion à " + flex + "°, extension complète.", "", "Cimentation plateau " + platT + "/insert " + insT + ", fémur " + femT + ", rotule " + rotT + ".", "Vicryl 2 + Stratafix capsulo-synovial, Vicryl 0 sous-cutané.", "Agrafes. Pansement Aquacel Duoderm."] });
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: dateSortie||"[DATE SORTIE]", dateLettre: dateSortie||dateOp, mt, paras: crh_ptg_paras(civ, nom, prenom, age, dateOp, dateSortie||"[DATE SORTIE]", cote, ind, def, deg, atcd, typeAnesthesie) });
    if (docList.includes("Ordonnance pharma")) res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Matériel de soins :", "AQUACEL Extra — 1 boîte", "DUODERM Extra Thin — 1 boîte", "Compresses stériles — 1 boîte", "BISEPTINE — 1 flacon", "Sérum physiologique — 30 dosettes", "", "**Analgésie :", "", "PARACÉTAMOL 1g — 1 cp/6h — QSP 30 jours", "", "IBUPROFÈNE 400mg — 1 cp matin/midi/soir — QSP 10 jours", "OMÉPRAZOLE 20mg — 1 gél. matin — QSP 10 jours", "", "ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours (hors >70 ans)", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours"]);
    if (docList.includes("Ordonnance IDE")) res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, ["Soins de pansements à domicile toutes les 4 jours jusqu'à cicatrisation.", "", "Ablation des agrafes à J15 post-opératoire.", "", "INNOHEP 4500 UI/j — 1 injection SC/jour pendant 35 jours.", "", "NFS plaquettes 1x/semaine pendant 35 jours."], "Ordonnance IDE — PTG " + cote);
    if (docList.includes("Ordonnance kiné")) res["Ordonnance kiné"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**KINÉSITHÉRAPIE post-PTG " + cote + " — Appui complet d'emblée — URGENT", "", "PRIORITÉ : extension 0° — NE PAS LAISSER S'INSTALLER UN FLESSUM", "", "##Phase 1 — J0 à J15 :", "Extension → 0° dès J3-J5, flexion → 80° à J15", "Si flexion < 90° à 6 semaines : me contacter", "", "##Phase 2 — J15 à 6 semaines :", "Vélo dès flexion > 90°, renforcement quadriceps", "", "##Phase 3 — 6 semaines à 3 mois :", "Objectif flexion > 120°, reprise légère à 3 mois"]);
    if (docList.includes("Ordonnance matériel")) res["Ordonnance matériel"] = await mkOrdo(nom, prenom, ddn, dateOp, ["2 Cannes anglaises réglables — 1 paire", "", "Attelle de cryothérapie (type Cryo Cuff genou) — 1", "", "Bas de contention classe II — Jambe " + cote + " — QSP 3 mois"]);
  }

  if (inter === "LCA") {
    const { ressaut, atcd, dT, dF, vT, vF, cbRM, cbRL, cbSM, cbSL, cbRamp, cart } = f;
    const men = [];
    if (cbRM) men.push("régularisation méniscale médiale");
    if (cbRL) men.push("régularisation méniscale latérale");
    if (cbSM) men.push("suture méniscale médiale");
    if (cbSL) men.push("suture méniscale latérale");
    if (cbRamp) men.push("ramp lésion");
    const hasSut = cbSM || cbSL;
    if (docList.includes("CRO")) res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: "", ds: "", aides, indication: "Reconstruction du ligament croisé antérieur du genou " + cote + " par technique DT3+2. Ressaut rotatoire " + ressaut + " en pré-opératoire.", ccam: "NFMC003", tempsOp: ["Installation en décubitus dorsal, genou fléchi à 90°.",
          "Badigeon et champage stérile.",
          "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.",
          "Check-list.", "",
          "##Prélèvement du greffon :",
          "Incision verticale en regard de la patte d'oie.",
          "Prélèvement du demi-tendineux et du droit interne au stripper atraumatique après ablation des vinculas.",
          "Les ischio-jambiers sont laissés pédiculés au tibia, enroulés dans une compresse imbibée de Vancomycine et réintroduits dans leur gaine pendant la durée du temps arthroscopique.",
          "",
          "Gonflage du garrot pneumatique à la racine du membre à 300 mmHg.",
          "",
          "##Temps arthroscopique :",
          "Voie d'abord optique antéro-latérale puis antéro-médiale à l'aiguille sous contrôle arthroscopique.",
          "Exploration systématique du genou :",
          "- Compartiment fémoro-patellaire : " + (cart || "RAS"),
          "- Compartiment médial : RAS",
          "- Compartiment latéral : RAS",
          "- Échancrure : LCA rompu / LCP intact.",
          "Section du ligament suspenseur du Hoffa et ablation du reliquat de LCA en prenant soin de préserver son pied au niveau de son insertion tibiale.",
          ...(men.length ? ["Gestes associés : " + men.join(", ") + "."] : []),
          "",
          "##Temps tibial :",
          "Réalisation du tunnel tibial à l'aide du guide adapté orienté à 55°.",
          "Mise en place de la broche puis tunnelisation tibiale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.",
          "Nettoyage du tunnel au shaver.",
          "",
          "##Temps fémoral :",
          "Contre-abord centimétrique 1 cm proximal et postérieur à l'épicondyle latéral.",
          "Ouverture du fascia lata.",
          "Réalisation du tunnel fémoral outside-in à l'aide du guide adapté orienté à 55°.",
          "Mise en place de la broche puis tunnelisation fémorale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.",
          "Nettoyage du tunnel au shaver.",
          "",
          "##Préparation du greffon :",
          "On détermine la longueur du greffon à l'aide du tigerstick passé dans les tunnels.",
          "Faufilage au XBRAID pour préparation du greffon selon technique DT3+2.",
          "Calibrage définitif à " + dT + " mm au tibia et " + dF + " mm au fémur.",
          "",
          "On monte le greffon sous arthroscopie à l'aide de fils relais.",
          "Cyclage du genou.",
          "Fixation au fémur par vis d'interférence " + vF + ".",
          "Fixation tibiale par vis d'interférence " + vT + " à 30° de flexion.",
          "",
          "##Retour externe :",
          "Abord tibial postérieur au tubercule de Gerdy.",
          "Réalisation d'un passage reliant le tunnel fémoral et la partie postérieure du Gerdy en passant sous le fascia lata.",
          "Réalisation d'un tunnel de diamètre 6 mm orienté vers la patte d'oie.",
          "À l'aide de fils relais, passage du retour externe dans le tunnel et fixation au tibia par endobouton RT en extension et rotation neutre.",
          "",
          "Test de Lachman négatif.",
          "Tiroir antérieur négatif.",
          "Isométrie satisfaisante en fin d'intervention.",
          "",
          "Fermeture des plans sous-cutanés au Vicryl 2-0.",
          "Fermeture plan cutané au Vicryl 3-0 rapide.",
          "Pansement sec."] });
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: "", ds: dateSortie||"", dateLettre: dateSortie||dateOp, mt, paras: crh_lca_paras(civ, nom, prenom, age, dateOp, cote, atcd, men, hasSut, typeAnesthesie) });
    if (docList.includes("Ordonnance pharma")) res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Matériel IDE :", "BISEPTINE, sérum physiologique, compresses, COSMOPORE", "", "**Analgésie :", "", "PARACÉTAMOL 1g — 4x/j — QSP 30 jours", "", "APRANAX 550mg — matin + après-midi — QSP 5 jours", "OMÉPRAZOLE 20mg — 1 gél. matin — QSP 5 jours", "", "ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection SC pendant 21 jours"]);
    if (docList.includes("Ordonnance IDE")) res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, ["Soins de pansements toutes les 48h jusqu'à cicatrisation.", "", "Ablation des agrafes à J15. (Surjet : retirer uniquement la boucle à l'extrémité)", "", "INNOHEP 4500 UI/j — 1 injection SC pendant 21 jours.", "", "NFS plaquettes 1x/semaine pendant 21 jours."], "Ordonnance IDE — LCA " + cote);
    if (docList.includes("Ordonnance kiné")) res["Ordonnance kiné"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**Kinésithérapie après reconstruction du LCA " + cote + " selon la technique du DT3+2",
        "URGENT",
        (hasSut ? "Appui avec 2 cannes anglaises pendant 1 mois (suture méniscale associée)" : "Appui complet autorisé"),
        "",
        "Je laisse le soin à mon confrère kinésithérapeute de décider du nombre et de la fréquence des séances. Rééducation au cabinet conseillée.",
        "",
        "##Semaine 1 → Semaine 3 :",
        "Verrouillage actif en extension + flexion 60°",
        "Travail en chaîne fermée — Recurvatum interdit",
        "Objectif à 1 mois : pas de flessum",
        "",
        "##Semaine 3 → 2e mois :",
        "Flexion 120° + pas de flessum 0°",
        "Indolence en fin de 2e mois",
        "Travail en chaîne fermée — Vélo sans résistance",
        "",
        "##2e mois → 4e mois :",
        "Genou stable et mobile",
        "Travail de proprioception + renforcement musculaire plus soutenu",
        "Reprise progressive marche, vélo, natation, course sur terrain plat",
        "",
        "Test isocinétique au 4e mois",
        "",
        "##4e mois → 6e mois :",
        "Réathlétisation — Renforcement musculaire en chaîne ouverte",
        "Reprise sport plus soutenu mais CI sport pivot/contact",
        "",
        "##6e mois → 9e mois :",
        "Reprise du sport",
        "Reprise progressive de l'entraînement sport/pivot dès M7",
        "Entraînement plus soutenu mais pas de compétition",
        "",
        "##9e mois → 12e mois :",
        "Reprise compétition (temps partiel puis complet vers 1 an)",
      ]);
    if (docList.includes("Ordonnance matériel")) res["Ordonnance matériel"] = await mkOrdo(nom, prenom, ddn, dateOp, ["2 Cannes anglaises réglables — 1 paire", "", "Attelle de cryothérapie (type Cryo Cuff genou) — 1"]);
  }
  return res;
}

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
body { background: #F7F4EF; color: #2A2118; font-family: 'DM Sans', sans-serif; margin: 0; min-height: 100vh; -webkit-font-smoothing: antialiased; }
.app { max-width: 660px; margin: 0 auto; padding: 2rem 1rem 5rem; }
.card { background: #FFFFFF; border: 1px solid #E6DDD3; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(42,33,24,0.06), 0 4px 16px rgba(42,33,24,0.05); }
.st { font-size: 10px; font-weight: 500; color: #AFA49A; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }
.field { margin-bottom: 14px; }
.field label { display: block; font-size: 12px; font-weight: 500; color: #7A6E65; margin-bottom: 5px; }
.field input, .field textarea { width: 100%; font-size: 14px; font-family: 'DM Sans', sans-serif; background: #FAF8F5; border: 1px solid #E6DDD3; border-radius: 9px; padding: 9px 12px; color: #2A2118; outline: none; transition: all 0.15s; }
.field input:focus, .field textarea:focus { border-color: #A0743A; background: #fff; box-shadow: 0 0 0 3px rgba(160,116,58,0.1); }
.field textarea { min-height: 70px; resize: vertical; }
.r2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.r3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.tg { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
.tb { padding: 7px 16px; border: 1px solid #E6DDD3; border-radius: 20px; background: #FAF8F5; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; transition: all 0.12s; }
.tb:hover { border-color: #A0743A; color: #5C3D1E; }
.tb.on { background: #EEE0CC; border-color: #A0743A; color: #5C3D1E; font-weight: 500; }
.doc-chip { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; background: #FAF8F5; transition: all 0.12s; }
.doc-chip.on { background: #EDF5F0; border-color: #82B99A; color: #3A6B4C; font-weight: 500; }
.sec-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid #E6DDD3; border-radius: 12px; cursor: pointer; background: #FAF8F5; margin-bottom: 8px; transition: all 0.12s; }
.sec-card:hover { border-color: #A0743A; background: #fff; }
.sec-card.on { background: #EEE0CC; border-color: #A0743A; }
.av { width: 38px; height: 38px; border-radius: 50%; background: #E6DDD3; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #7A6E65; flex-shrink: 0; }
.sec-card.on .av { background: #A0743A; color: white; }
.btn { padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border: 1px solid #E6DDD3; background: #fff; color: #2A2118; transition: all 0.12s; }
.btn:hover { background: #F7F4EF; }
.btn-p { background: #5C3D1E; border-color: #5C3D1E; color: white; }
.btn-p:hover { background: #4A2F14; border-color: #4A2F14; }
.btn-s { background: #3A6B4C; border-color: #3A6B4C; color: white; }
.btn-s:hover { background: #2F5A3E; }
.btn-sm { padding: 7px 16px; font-size: 13px; }
.back-btn { background: none; border: none; font-size: 13px; color: #7A6E65; cursor: pointer; padding: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; }
.back-btn:hover { color: #2A2118; }
.doc-tab { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; background: #FAF8F5; color: #7A6E65; transition: all 0.12s; }
.doc-tab.on { background: #fff; border-color: #A0743A; color: #5C3D1E; font-weight: 500; }
.spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #E6DDD3; border-top-color: #5C3D1E; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }
@keyframes spin { to { transform: rotate(360deg); } }
.cb-row { display: flex; flex-direction: column; gap: 8px; }
.cbi { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #2A2118; cursor: pointer; padding: 4px 0; user-select: none; }
.cbi input[type=checkbox] { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 2px solid #A0743A; border-radius: 5px; background: #FAF8F5; cursor: pointer; flex-shrink: 0; transition: all 0.12s; position: relative; }
.cbi input[type=checkbox]:checked { background: #5C3D1E; border-color: #5C3D1E; }
.cbi input[type=checkbox]:checked::after { content: ''; position: absolute; left: 3px; top: 0px; width: 5px; height: 9px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(45deg); }
.alert-i { background: #EEE0CC; color: #5C3D1E; border: 1px solid #C4965A; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-top: 12px; }
.alert-e { background: #FCEBEB; color: #A32D2D; border: 1px solid #F09595; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-top: 12px; }
.page-title { font-family: 'Lora', serif; font-size: 30px; font-weight: 400; color: #2A2118; margin: 0 0 4px; }
.page-sub { font-size: 13px; color: #AFA49A; margin: 0 0 1.75rem; }
.actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 1.5rem; }
.chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; background: #EEE0CC; color: #5C3D1E; }
`;

// ─── SPEC FIELDS — définis HORS du composant App pour éviter le bug focus ───
function PTHFields({ form, sf, sfv }) {
  return (
    <>
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
        <div className="field"><label>Type tige</label>
          <div className="tg">{["Standard","Latéralisée"].map(v=><button key={v} className={"tb"+(form.tigeType===v?" on":"")} onClick={()=>sfv("tigeType",v)}>{v}</button>)}</div>
        </div>
      </div>
      <div className="r3">
        <div className="field"><label>Col</label><input value={form.col||""} onChange={sf("col")} placeholder="court"/></div>
        <div className="field"><label>Tête (mm)</label><input type="number" value={form.tete||""} onChange={sf("tete")} placeholder="28"/></div>
        <div className="field"><label>Matière tête</label>
          <div className="tg">{["inox","céramique"].map(v=><button key={v} className={"tb"+(form.tetem===v?" on":"")} onClick={()=>sfv("tetem",v)}>{v}</button>)}</div>
        </div>
      </div>
      <div className="field"><label>Infiltration péri-articulaire</label>
        <div className="tg">{["Oui","Non"].map(v=><button key={v} className={"tb"+(form.infiltr===v?" on":"")} onClick={()=>sfv("infiltr",v)}>{v}</button>)}</div>
      </div>
    </>
  );
}

function PTGFields({ form, sf, sfv }) {
  return (
    <>
      <div className="field"><label>Indication</label><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: gonarthrose tricompartimentaire"/></div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r2">
        <div className="field"><label>Déformation</label>
          <div className="tg">{["varus","valgus"].map(v=><button key={v} className={"tb"+(form.deformation===v?" on":"")} onClick={()=>sfv("deformation",v)}>{v}</button>)}</div>
        </div>
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
    </>
  );
}

function LCAFields({ form, sf, sfv, sfb }) {
  return (
    <>
      <div className="field"><label>Ressaut rotatoire pré-op</label>
        <div className="tg">{["absent","présent"].map(v=><button key={v} className={"tb"+(form.ressaut===v?" on":"")} onClick={()=>sfv("ressaut",v)}>{v}</button>)}</div>
      </div>
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
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────
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
  const [errMsg, setErrMsg] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const sf = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const sfv = (k, v) => setForm(f => ({...f, [k]: v}));
  const sfb = (k) => (e) => setForm(f => ({...f, [k]: e.target.checked}));
  const fmtD = (s) => { if (!s) return "[DATE]"; const [y,m,d] = s.split("-"); return d+"/"+m+"/"+y; };

  function goInter(id) {
    setInter(id);
    setForm({ date: today, civilite: "Monsieur", cote: "droit", tigeType: "Standard", tetem: "inox", infiltr: "Non", deformation: "varus", ressaut: "absent", typeAnesthesie: "générale", dateSortie: "" });
    setSelDocs(new Set(DOCS[id]));
    setSelSecs(new Set());
    setMailMsg(null); setErrMsg(null);
    setScreen("form");
  }
  const togDoc = (d) => setSelDocs(s => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const togSec = (id) => setSelSecs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function handleGen() {
    setGenerating(true); setMailMsg(null); setErrMsg(null); setScreen("docs");
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
      cbRM:!!form.cbRM, cbRL:!!form.cbRL, cbSM:!!form.cbSM, cbSL:!!form.cbSL, cbRamp:!!form.cbRamp,
      cart: form.cart||"",
      typeAnesthesie: form.typeAnesthesie||"générale",
      dateSortie: form.dateSortie ? (()=>{const [y,m,d]=(form.dateSortie||"").split("-");return d+"/"+m+"/"+y;})() : "[DATE SORTIE]",
    };
    try {
      const docs = await generateDocs(inter, f, [...selDocs]);
      const res = {};
      for (const [name, doc] of Object.entries(docs)) {
        // Packer.toBlob() — API navigateur, pas Node.js
        const blob = await Packer.toBlob(doc);
        res[name] = blob;
      }
      setGDocs(res);
      setActiveTab(Object.keys(res)[0]||"");
    } catch(e) {
      console.error(e);
      setErrMsg("Erreur : " + e.message);
    }
    setGenerating(false);
  }

  function dlDoc(name) {
    const blob = gDocs[name]; if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.download = inter+"_"+(form.nom||"PATIENT").toUpperCase()+"_"+name.replace(/ /g,"_")+"_"+fmtD(form.date)+".docx";
    a.click(); URL.revokeObjectURL(url);
  }
  const dlAll = () => Object.keys(gDocs).forEach((n,i) => setTimeout(()=>dlDoc(n), i*250));

  const LABELS = { PTH: "Prothèse totale de hanche", PTG: "Prothèse totale de genou", LCA: "Reconstruction LCA DT3+2" };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {screen === "home" && (
          <>
            <div style={{textAlign:"center",marginBottom:"1.5rem"}}>
              <p className="page-title" style={{textAlign:"center"}}>Bloc chirurgical</p>
              <p className="page-sub" style={{textAlign:"center",margin:"0 0 1.5rem"}}>Dr Tom ROUSSEL — Traumatologie-Orthopédie, Hôpital Roger Salengro</p>
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:10}}>
              {[["PTH","Prothèse totale de hanche"],["PTG","Prothèse totale de genou"],["LCA","Reconstruction DT3+2"]].map(([id,sub])=>(
                <div key={id} onClick={()=>goInter(id)} style={{background:"#fff",border:"1px solid #E6DDD3",borderRadius:14,padding:"1.1rem 1rem",width:145,textAlign:"center",cursor:"pointer",boxShadow:"0 1px 3px rgba(42,33,24,0.06)",transition:"all 0.15s"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="#A0743A";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="#E6DDD3";e.currentTarget.style.transform="translateY(0)";}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:20,fontWeight:500,color:"#2A2118"}}>{id}</div>
                  <div style={{fontSize:11,color:"#AFA49A",marginTop:4,lineHeight:1.4}}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap"}}>
              {[["TTA + MPFL","Bientôt disponible"],["Ménisque","Bientôt disponible"]].map(([id,sub])=>(
                <div key={id} style={{background:"#fff",border:"1px solid #E6DDD3",borderRadius:14,padding:"1.1rem 1rem",width:145,textAlign:"center",opacity:.4}}>
                  <div style={{fontFamily:"'Lora',serif",fontSize:16,fontWeight:500,color:"#2A2118"}}>{id}</div>
                  <div style={{fontSize:11,color:"#AFA49A",marginTop:4}}>{sub}</div>
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
                <div className="field"><label>Civilité</label>
                  <div className="tg">{["Monsieur","Madame"].map(v=><button key={v} className={"tb"+(form.civilite===v?" on":"")} onClick={()=>sfv("civilite",v)}>{v}</button>)}</div>
                </div>
                <div className="field"><label>Côté</label>
                  <div className="tg">{["droit","gauche"].map(v=><button key={v} className={"tb"+(form.cote===v?" on":"")} onClick={()=>sfv("cote",v)}>{v}</button>)}</div>
                </div>
              </div>
              <div className="field"><label>Aides opératoires</label><input value={form.aides||""} onChange={sf("aides")} placeholder="ex: Florian PETELLE – Claire ZIEGLER interne"/></div>
              <div className="field"><label>Médecin traitant</label><input value={form.mt||""} onChange={sf("mt")} placeholder="Dr Nom Prénom"/></div>
              <div className="r2">
                <div className="field"><label>Type d'anesthésie</label>
                  <div className="tg">{["générale","loco-régionale","rachianesthésie"].map(v=><button key={v} className={"tb"+(form.typeAnesthesie===v?" on":"")} onClick={()=>sfv("typeAnesthesie",v)} style={{fontSize:12,padding:"6px 10px"}}>{v}</button>)}</div>
                </div>
                <div className="field"><label>Date de sortie (si connue)</label><input type="date" value={form.dateSortie||""} onChange={sf("dateSortie")}/></div>
              </div>
            </div>

            <div className="card">
              <div className="st">Détails intervention</div>
              {inter === "PTH" && <PTHFields form={form} sf={sf} sfv={sfv}/>}
              {inter === "PTG" && <PTGFields form={form} sf={sf} sfv={sfv}/>}
              {inter === "LCA" && <LCAFields form={form} sf={sf} sfv={sfv} sfb={sfb}/>}
            </div>

            <div className="card">
              <div className="st">Documents à générer</div>
              <div className="chip-row">
                {(DOCS[inter]||[]).map(d=><button key={d} className={"doc-chip"+(selDocs.has(d)?" on":"")} onClick={()=>togDoc(d)}>{d}</button>)}
              </div>
              <p style={{fontSize:12,color:"#AFA49A",marginTop:4}}>{selDocs.size} document(s) sélectionné(s)</p>
            </div>

            <div className="card">
              <div className="st">Secrétaires destinataires</div>
              {Object.entries(SECS).map(([id,sec])=>(
                <div key={id} className={"sec-card"+(selSecs.has(id)?" on":"")} onClick={()=>togSec(id)}>
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
            <p className="page-sub"><span className="tag">{inter}</span>&nbsp;&nbsp;{fmtD(form.date)}</p>

            {generating && (
              <div className="card" style={{textAlign:"center",padding:"3rem"}}>
                <span className="spinner"/>
                <span style={{fontSize:14,color:"#7A6E65"}}>Génération des fichiers Word...</span>
              </div>
            )}

            {errMsg && (
              <div className="card">
                <div className="alert-e">{errMsg}</div>
                <button className="btn btn-p" style={{marginTop:12}} onClick={()=>setScreen("form")}>← Retour au formulaire</button>
              </div>
            )}

            {!generating && !errMsg && Object.keys(gDocs).length > 0 && (
              <>
                <div className="card">
                  <div className="st">Documents générés</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                    {Object.keys(gDocs).map(name=>(
                      <button key={name} className={"doc-tab"+(activeTab===name?" on":"")} onClick={()=>setActiveTab(name)}>{name}</button>
                    ))}
                  </div>
                  {activeTab && <button className="btn btn-s btn-sm" onClick={()=>dlDoc(activeTab)}>↓ Télécharger "{activeTab}"</button>}
                </div>
                <div className="card">
                  <div className="st">Envoi aux secrétaires</div>
                  <p style={{fontSize:13,color:"#7A6E65",marginBottom:14}}>
                    {selSecs.size > 0 ? "Destinataires : "+[...selSecs].map(id=>SECS[id].nom).join(", ") : "Aucune secrétaire sélectionnée"}
                  </p>
                  <div className="actions" style={{marginTop:0}}>
                    <button className="btn btn-p" onClick={dlAll}>↓ Tout télécharger</button>
                    {selSecs.size > 0 && (
                      <button className="btn btn-s" onClick={()=>{ dlAll(); setMailMsg("Documents téléchargés. Envoyez à "+[...selSecs].map(id=>SECS[id].nom).join(" et ")+" — "+[...selSecs].map(id=>SECS[id].email).join(", ")); }}>Préparer l'envoi</button>
                    )}
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
