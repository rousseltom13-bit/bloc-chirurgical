import { useState, useEffect, useCallback } from "react";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, VerticalAlign, UnderlineType,
  Header, Footer, ImageRun
} from "docx";

// ─── ASSETS BASE64 ────────────────────────────────────────────
const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAHQAAABHCAIAAABZFvRzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAh1QAAIdUBBJy0nQAABOZJREFUeF7tWn9k1VEUX3+NpMg0MkViZBqZRlIkRqaRKRIj00iKxEiKRCRG0sg0MkX6fySNTCOzkWnMFEkjs5FpZLY+z/m++84798f3/bp7a51n5vvu99zP95zP/dxz7r3ft2Vtba1GP5EYALn6icRATSRchc2kBGUhHgNKbjxuVbkRubXIRdnkj6OvppaKW7zGkpn5bywFAnWhu6J7oDEmAxGxZVrgwQu+nLz7RsImVwThG0UbMGL0kaEd5HL1hZXr5Evo1ylnW+BGtpHjXVf4gsh1emRPas4jn/siA4i0YI+QEPW68lHRh7nJ9SXQ8JwNaDbAl0hEPPNWNNIqgFWf3EBC+Ncl7CXXzGXfiNuR2+nVqNJnHK57m5lcX9nxaU2XYrJ+VCEV/TeP1O1vxKFWcpXciAxEhFblKrkRGYgI7VBu7dZt+MMz6T9dmEb7q2kxXURH4z5v5zimnSPwhwp/hA/mrugi2k0s/ILHZcMKxwQzoq89SkpuoiRbRmHeuaS8+yz7hiqXS55PO1VuLqdpWsjL5ppzZX3TgqY5N7fy0dVCki74IqyQhRGvOZpzNefqJiJ/J+Vcq+kmIm/baW8EnHs85/5CNxHJJl7s3bWgaUHLphl7X8inkh7c5NKxni3o2UJuDadHjsm5sF1M7JM9+6hXz3Nz5+t6WE4a0sNyPSzPf+2kr3mSJGu/H/Md2gbSseZczbnydEFzruZczbk8mer2V5diyftA3/vzQt59+F6gKblKbvaHVYXoSN+hJa8DzLG/vRYWt3Sdq+vcAta5gQytt4piQH/8XBRdxRkrucXxVZS1klsUXcUZl0vu2MdxlPIdu+ror/fmLXr+3MJ8x5lOtDQeaOp78pg71XWxG+179+2/c/eeaTcImYuddbXbk592BXDQHSCwP3f+wuKvpfBzffg+/4tj0WNdLrn9TwcQmw3eeuQo2pf/rCz+Xmo71d7/bIBsrl2/AdLRDtaaD7UMPh+y+4L9vkfJePhw7j942Hy4Ze7nPKA6znZ2XeomHJ+9GF2D7/N/Q5CLqBCncAUxQ874T+0jH0YRM11DlWMT43QNZluPJe0GYeT9aOPBpkSGfhxoFrBkhvH7+u07LgLPdeKj0el/RZgFSLnKhfqOnziJuV+/p6Hn6pXl1RWAIlSQi5jJS0w9cJpp/5HfPjGO2SoiAd0vX72mRh8OkgDwYQbx1u9ugNKh34A9fwTHR7vT/41CbtvpdpramOaY/oiTPIPTxDWIgA1tsaZnZvlmTHyFweSnKZDFYwvg9FzO4qc91wDa+D7/K8JvucrlTmSKQ7YQQaTgGkxBKchrRJlULhSdr1zUQwwJx3Tj0MzIFrHMzMjiOO0NoI3v87/65CLHmeUBvEG6NLqb/DxFKQIfkAui6RosQD50PfhiCClF6HT4zVve4sPBKPKcnvpcM584fsD/6pML+pBqaUWFtACRGq5RwajQTX+ZRfEZfpdQhtUCZqJztQC0TBlcSMoghefDgcDNagQjBNiwPe7a+AH/q08uPIAMERvqFVjuvZ0scjOczsyCa7Sj1vH1FmildS60xte56ELly+idwvPirK6AX4AAipJv2N6H7/N/Q5BbESc2K0glC9pm5ajkuJTckqlL76jkpnNUsoWSWzJ16R2V3HSOSrZQckumLr2jkpvOUckWfwHWqjVoddZlMAAAAABJRU5ErkJggg==";
const BARCODE_B64 = "iVBORw0KGgoAAAANSUhEUgAAAaMAAAGoCAYAAADrUoo3AAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nO3dsXLbyLfnceBfU0ytTZlYu/sA0jyB5WCrlpE1T2A6YTpydrORwxuZCi+ToZ5gqIjJVpl8ghFfYEdMlP7NlAluNXlgwzRJgUB3n0bj+6lSef73zlgUBPKH7j59Os2yLAGAVnnuXO38uJdJkpy9cAlmO//7Memuv3Lj2EEYAYjHc+esECzFP403Dn/Oufw5K/z5lHTXT9xd5RBGAJrne+iYEc65fLkMmzrmm1FU/tVdP3LH/YwwAhC+504ePPmfrxv8W1tJMJnR04Rw2iKMAIRnO/K5luAxf76K+LdkwmkbTNtwauU6FGEEIAzb0U9fAuiixb8VM603blswEUYA9Dx3rmXkE/vop6oHCaVxM19+eYQRAL8IoCrMVN5wM2KKtEKPMALg3nYK7oYAsuJ+E0yRFT4QRgDc2BYh9CWEmlz9FiqztnSbdNe7m3EbiTACYNe2u4EJofdcWS/mm+vd8Ok7wgiAHc+dfBTU5ko4Tfeb69/QCjzCCEB126m4GxkJMRWnbyXrSbdNe+GEEYDTfQ+hGwoSgrSQUVJj1pMIIwDlbUPoVkZChFD47qTIIfipO8IIwMsYCTXZQgocgi4FJ4wAHPfcuZHRECHUbB+T7noY6k9AGAHYbzsamgR8NANON99sPA5w2o4wAjxJe6Pd00Ufs+kg3Ln8584jZdpRWkogBTVtRxgBlqW90bl0nr4qeejbPD8+IJsOwti4+Nwxr/ufAF4J3FhJtV0wDVgJI8ACCaC+9F6rM5rYbFwMYsT03DHrRH+ovw64tCmUPUmEEVBC2huZRp9ne/7NvP/aO4vX0Ty1XmXTgd40yralz4SihVa4T7rrvvYPShgBOyR48iOuL5XWTUwgnauMkLZtff70/n2hSb2w4Rd+/cC3AMqn2UJoa/NKzq/x+8T63BnT4LSV3myOPjcjYqVAIozQamlv1Jc9NCH2Vbv29p22ZdxDgqjVLjQDiWk6tJKE0LABayJvs+nAbX+xbRDNKOOGWGymqT0H0r+4+kDQzp2+OIIP/NPSPsKdpwhjNBK2XQwliKFVeA/v9sw2lbMEUTY5T2QCCO0NoI3v87/65CLHmeUBvEG6NLqb/DxFKQIfkAui6RosQD50PfhiCClF6HT4zVve4sPBKPKcnvpcM584fsD/6pML+pBqaUWFtACRGq5RwajQTX+ZRfEZfpdQhtUCZqJztQC0TBlcSMoghefDgcDNagQjBNiwPe7a+AH/q08uPIAMERvqFVjuvZ0scjOczsyCa7Sj1vH1FmildS60xte56ELly+idwvPirK6AX4AAipJv2N6H7/N/Q5BbESc2K0glC9pm5ajkuJTckqlL76jkpnNUsoWSWzJ16R2V3HSOSrZQckumLr2jkpvOUckWfwHWqjVoddZlMAAAAABJRU5ErkJggg==";

const SECS = {
  coralie:   { nom: "Coralie Wallaert",  email: "coralie.wallaert@chu-lille.fr",   ini: "CW" },
  alexandre: { nom: "Alexandre Delmeire", email: "alexandre1.delmeire@chu-lille.fr", ini: "AD" },
};

const DOCS_PTH = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"];
const DOCS_PTG = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"];
const DOCS_LCA = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kiné","Ordonnance matériel"];
const DOCS_ARTH = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE"];
const DOCS_ADM  = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE"];
const DOCS_FRAC = ["CRO","CRH","Ordonnance pharma","Ordonnance IDE"];

// ─── DOCX HELPERS ─────────────────────────────────────────────
function b64ToArr(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
const nb  = () => ({ style: BorderStyle.NONE, size: 0, color: "FFFFFF" });
const anb = () => ({ top: nb(), bottom: nb(), left: nb(), right: nb(), insideHorizontal: nb(), insideVertical: nb() });
const tx  = (t, o = {}) => new TextRun({ text: t, font: "Arial", size: o.size ?? 20, bold: o.bold ?? false, italics: o.italics ?? false, underline: o.underline ? { type: UnderlineType.SINGLE } : undefined, color: o.color ?? "000000" });
const pp  = (r, o = {}) => new Paragraph({ alignment: o.align ?? AlignmentType.LEFT, spacing: { after: o.after ?? 0, before: o.before ?? 0 }, children: Array.isArray(r) ? r : [r] });
const pj  = (t, o = {}) => new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: o.after ?? 60, before: o.before ?? 0 }, children: [tx(t, o)] });
const ep  = (a = 80) => pp(tx(""), { after: a });
const parseLine = (l) => {
  if (l === "") return ep(80);
  if (l.startsWith("##")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true, underline: true })], { after: 60 });
  if (l.startsWith("**")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true })], { after: 60 });
  return pj(l, { after: 60 });
};

function mkHeader() {
  const logo    = b64ToArr(LOGO_B64);
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
  return new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [4500, 4704], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 4500, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: refBlk(nom, prenom, ddn, de, ds) }), new TableCell({ borders: anb(), width: { size: 4704, type: WidthType.DXA }, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: [ep(80), pp([tx(nom + " " + prenom, { size: 20, bold: true })], { after: 40 }), ep(40)] })] })] });
}

function twoCol(right, slB = 0) {
  return new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [2800, 6404], borders: anb(), rows: [new TableRow({ children: [new TableCell({ borders: anb(), width: { size: 2800, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 }, children: svcLeft(slB) }), new TableCell({ borders: anb(), width: { size: 6404, type: WidthType.DXA }, verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 }, children: right })] })] });
}

const SP = { sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 851, right: 720, bottom: 567, left: 720, header: 426, footer: 342 } } } }] };

// ─── BUILDERS DOCX ────────────────────────────────────────────
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
  const right = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200, before: 160 }, children: [tx("Lille, le " + d.dateOp, { size: 20 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [tx("COMPTE-RENDU OPERATOIRE", { size: 22, bold: true })] }),
    pj("Date opératoire : " + d.dateOp),
    pj("Opérateur : Docteur Tom ROUSSEL"),
    pj("Aides opératoires : " + d.aides),
    ep(80),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [tx("Indication : ", { size: 20, bold: true }), tx(d.indication, { size: 20, bold: true })] }),
    pj("CCAM : " + d.ccam, { italics: true, after: 80 }),
    ...(d.implants ? [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 }, children: [tx("Rappel des implants : ", { size: 20, bold: true }), tx(d.implants, { size: 20 })] })] : []),
    ep(40),
    ...d.tempsOp.map(parseLine),
    ep(160),
    pp([tx("Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }),
    pj("Docteur Junior — Service de Traumatologie-Orthopédie"),
  ];
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds || ""), ep(120), twoCol(right)] }] });
}

async function mkCRH(d) {
  const h = mkHeader(), f = mkFooter();
  const bP = d.paras.map(item => {
    if (item.type === "consigne") return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 }, indent: { left: 360 }, children: [tx("- " + item.texte, { size: 20 })] });
    if (item.type === "mixed") return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: item.after || 120 }, children: item.runs });
    return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: item.after || 120 }, children: [tx(item.texte, { bold: item.bold || false, italics: item.italics || false })] });
  });
  const right = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 160, before: 160 }, children: [tx("Lille, le " + d.dateLettre, { size: 20 })] }),
    pj("Cher confrère,", { after: 160 }),
    ...bP,
    ep(120),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0 }, children: [tx("Professeur C. CHANTELOT", { size: 20, bold: true }), tx("          Le Docteur ROUSSEL TOM", { size: 20, bold: true })] }),
  ];
  const medP = new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0, before: 200 }, border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } }, children: [tx("Lettre adressée à : " + (d.mt || "[MÉDECIN TRAITANT]"), { size: 16, color: "444444" })] });
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds), ep(120), twoCol(right, 480), ep(200), medP] }] });
}

// ─── CONTENT BUILDERS ─────────────────────────────────────────
function crh_pth_paras(civ, nom, prenom, age, dateOp, dateSortie, cote, ind, atcd, typeAnesthesie) {
  return [
    { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été hospitalisé(e) dans notre service du " + dateOp + " au " + dateSortie + " pour la réalisation de son arthroplastie totale de hanche " + cote + " sur " + ind + ".")] },
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
    { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été hospitalisé(e) dans notre service du " + dateOp + " au " + dateSortie + " pour la réalisation de son arthroplastie totale de genou " + cote + " sur " + ind + " avec déformation en " + def + " de " + deg + "°.")] },
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
    { texte: "L'intervention s'est parfaitement déroulée sous anesthésie " + (typeAnesthesie || "[TYPE]") + ".", after: 60 },
    ...(men.length ? [{ texte: "Un geste associé a été réalisé : " + men.join(", ") + ".", after: 120 }] : []),
    { texte: "Les suites ont été simples, la sortie du patient est donc autorisée le jour même sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Appui complet autorisé d'emblée avec 2 cannes anglaises" + (hasSut ? " (appui protégé 1 mois en raison de la suture méniscale)" : "") },
    { type: "consigne", texte: "Soins de pansements toutes les 48h par IDE à domicile" },
    { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
    { type: "consigne", texte: "Kinésithérapie en urgence selon le protocole DT3+2 remis au patient" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour pendant " + (hasSut ? "45" : "21") + " jours avec contrôle plaquettaire hebdomadaire" },
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
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: dateSortie || "[DATE SORTIE]", dateLettre: dateSortie || dateOp, mt, paras: crh_pth_paras(civ, nom, prenom, age, dateOp, dateSortie || "[DATE SORTIE]", cote, ind, atcd, typeAnesthesie) });
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
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: dateSortie || "[DATE SORTIE]", dateLettre: dateSortie || dateOp, mt, paras: crh_ptg_paras(civ, nom, prenom, age, dateOp, dateSortie || "[DATE SORTIE]", cote, ind, def, deg, atcd, typeAnesthesie) });
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
    if (docList.includes("CRO")) res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: "", ds: "", aides, indication: "Reconstruction du ligament croisé antérieur du genou " + cote + " par technique DT3+2. Ressaut rotatoire " + ressaut + " en pré-opératoire.", ccam: "NFMC003", tempsOp: ["Installation en décubitus dorsal, genou fléchi à 90°.", "Badigeon et champage stérile.", "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.", "Check-list.", "", "##Prélèvement du greffon :", "Incision verticale en regard de la patte d'oie.", "Prélèvement du demi-tendineux et du droit interne au stripper atraumatique après ablation des vinculas.", "Les ischio-jambiers sont laissés pédiculés au tibia, enroulés dans une compresse imbibée de Vancomycine et réintroduits dans leur gaine pendant la durée du temps arthroscopique.", "", "Gonflage du garrot pneumatique à la racine du membre à 300 mmHg.", "", "##Temps arthroscopique :", "Voie d'abord optique antéro-latérale puis antéro-médiale à l'aiguille sous contrôle arthroscopique.", "Exploration systématique du genou :", "- Compartiment fémoro-patellaire : " + (cart || "RAS"), "- Compartiment médial : RAS", "- Compartiment latéral : RAS", "- Échancrure : LCA rompu / LCP intact.", "Section du ligament suspenseur du Hoffa et ablation du reliquat de LCA en prenant soin de préserver son pied au niveau de son insertion tibiale.", ...(men.length ? ["Gestes associés : " + men.join(", ") + "."] : []), "", "##Temps tibial :", "Réalisation du tunnel tibial à l'aide du guide adapté orienté à 55°.", "Mise en place de la broche puis tunnelisation tibiale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.", "Nettoyage du tunnel au shaver.", "", "##Temps fémoral :", "Contre-abord centimétrique 1 cm proximal et postérieur à l'épicondyle latéral.", "Ouverture du fascia lata.", "Réalisation du tunnel fémoral outside-in à l'aide du guide adapté orienté à 55°.", "Mise en place de la broche puis tunnelisation fémorale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.", "Nettoyage du tunnel au shaver.", "", "##Préparation du greffon :", "On détermine la longueur du greffon à l'aide du tigerstick passé dans les tunnels.", "Faufilage au XBRAID pour préparation du greffon selon technique DT3+2.", "Calibrage définitif à " + dT + " mm au tibia et " + dF + " mm au fémur.", "", "On monte le greffon sous arthroscopie à l'aide de fils relais.", "Cyclage du genou.", "Fixation au fémur par vis d'interférence " + vF + ".", "Fixation tibiale par vis d'interférence " + vT + " à 30° de flexion.", "", "##Retour externe :", "Abord tibial postérieur au tubercule de Gerdy.", "Réalisation d'un passage reliant le tunnel fémoral et la partie postérieure du Gerdy en passant sous le fascia lata.", "Réalisation d'un tunnel de diamètre 6 mm orienté vers la patte d'oie.", "À l'aide de fils relais, passage du retour externe dans le tunnel et fixation au tibia par endobouton RT en extension et rotation neutre.", "", "Test de Lachman négatif.", "Tiroir antérieur négatif.", "Isométrie satisfaisante en fin d'intervention.", "", "Fermeture des plans sous-cutanés au Vicryl 2-0.", "Fermeture plan cutané au Vicryl 3-0 rapide.", "Pansement sec."] });
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: "", ds: dateSortie || "", dateLettre: dateSortie || dateOp, mt, paras: crh_lca_paras(civ, nom, prenom, age, dateOp, cote, atcd, men, hasSut, typeAnesthesie) });
    if (docList.includes("Ordonnance pharma")) res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Matériel IDE :", "BISEPTINE, sérum physiologique, compresses, COSMOPORE", "", "**Analgésie :", "", "PARACÉTAMOL 1g — 4x/j — QSP 30 jours", "", "APRANAX 550mg — matin + après-midi — QSP 5 jours", "OMÉPRAZOLE 20mg — 1 gél. matin — QSP 5 jours", "", "ACUPAN 30mg — 1 cp matin/midi/soir — QSP 10 jours", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection SC pendant " + (hasSut ? "45" : "21") + " jours"]);
    if (docList.includes("Ordonnance IDE")) res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, ["Soins de pansements toutes les 48h jusqu'à cicatrisation.", "", "Ablation des agrafes à J15. (Surjet : retirer uniquement la boucle à l'extrémité)", "", "INNOHEP 4500 UI/j — 1 injection SC pendant " + (hasSut ? "45" : "21") + " jours.", "", "NFS plaquettes 1x/semaine pendant " + (hasSut ? "45" : "21") + " jours."], "Ordonnance IDE — LCA " + cote);
    if (docList.includes("Ordonnance kiné")) res["Ordonnance kiné"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Kinésithérapie après reconstruction du LCA " + cote + " selon la technique du DT3+2", "URGENT", (hasSut ? "Appui avec 2 cannes anglaises pendant 1 mois (suture méniscale associée)" : "Appui complet autorisé"), "", "Je laisse le soin à mon confrère kinésithérapeute de décider du nombre et de la fréquence des séances. Rééducation au cabinet conseillée.", "", "##Semaine 1 → Semaine 3 :", "Verrouillage actif en extension + flexion 60°", "Travail en chaîne fermée — Recurvatum interdit", "Objectif à 1 mois : pas de flessum", "", "##Semaine 3 → 2e mois :", "Flexion 120° + pas de flessum 0°", "Indolence en fin de 2e mois", "Travail en chaîne fermée — Vélo sans résistance", "", "##2e mois → 4e mois :", "Genou stable et mobile", "Travail de proprioception + renforcement musculaire plus soutenu", "Reprise progressive marche, vélo, natation, course sur terrain plat", "", "Test isocinétique au 4e mois", "", "##4e mois → 6e mois :", "Réathlétisation — Renforcement musculaire en chaîne ouverte", "Reprise sport plus soutenu mais CI sport pivot/contact", "", "##6e mois → 9e mois :", "Reprise du sport", "Reprise progressive de l'entraînement sport/pivot dès M7", "Entraînement plus soutenu mais pas de compétition", "", "##9e mois → 12e mois :", "Reprise compétition (temps partiel puis complet vers 1 an)"]);
    if (docList.includes("Ordonnance matériel")) res["Ordonnance matériel"] = await mkOrdo(nom, prenom, ddn, dateOp, ["2 Cannes anglaises réglables — 1 paire", "", "Attelle de cryothérapie (type Cryo Cuff genou) — 1"]);
  }

  // Interventions à la volée — CRO texte libre + CRH standard
  if (inter === "ARTH" || inter === "ADM" || inter === "FRAC") {
    const { detailOp, indication } = f;
    const interLabel = inter === "ARTH" ? "Arthroscopie du genou" : inter === "ADM" ? "Ablation de matériel" : "Ostéosynthèse";
    const ccamMap = { ARTH: "NFMA009", ADM: "NFMA006", FRAC: "NFPA001" };
    if (docList.includes("CRO")) res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: dateOp, ds: "", aides, indication: indication || interLabel + " " + cote + ".", ccam: ccamMap[inter] || "—", tempsOp: (detailOp || "(Détail opératoire à compléter)").split("\n") });
    if (docList.includes("CRH")) res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: dateSortie || "[DATE SORTIE]", dateLettre: dateSortie || dateOp, mt, paras: [
      { type: "mixed", after: 120, runs: [tx("Votre patient(e) "), tx(civ + " " + nom + " " + prenom, { bold: true }), tx(", " + age + " ans, a été pris(e) en charge le " + dateOp + " pour : " + (indication || interLabel) + ".")] },
      { texte: "L'intervention s'est parfaitement déroulée sous anesthésie " + typeAnesthesie + ".", after: 120 },
      { texte: "Les suites ont été simples. Sortie autorisée ce " + (dateSortie || dateOp) + " sous couvert des consignes remises.", after: 200 },
      { texte: "Bien cordialement.", after: 300 },
    ]});
    if (docList.includes("Ordonnance pharma")) res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, ["**Analgésie :", "", "PARACÉTAMOL 1g — 1 cp/6h — QSP 30 jours", "", "IBUPROFÈNE 400mg — 1 cp matin/midi/soir — QSP 5 jours", "OMÉPRAZOLE 20mg — 1 gél. matin — QSP 5 jours"]);
    if (docList.includes("Ordonnance IDE")) res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, ["Soins de pansements selon prescription.", "", "Ablation des agrafes/fils à J15."]);
  }

  return res;
}

// ─── CSS ──────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
*,*::before,*::after{box-sizing:border-box;}
body{background:#F7F4EF;color:#2A2118;font-family:'DM Sans',sans-serif;margin:0;min-height:100vh;-webkit-font-smoothing:antialiased;}
[data-theme="dark"] body,[data-theme="dark"]{background:#1E1E1E;color:#E8E0D0;}
[data-theme="dark"] .card{background:#2A2A2A;border-color:#404040;}
[data-theme="dark"] .field input,[data-theme="dark"] .field textarea,[data-theme="dark"] .field select{background:#333;border-color:#505050;color:#E8E0D0;}
[data-theme="dark"] .tb{background:#2A2A2A;border-color:#505050;color:#A09888;}
[data-theme="dark"] .tb.on{background:#5C3D1E;border-color:#A0743A;color:#F5E6D0;}
[data-theme="dark"] .spec-tabs{background:#2A2A2A;}
[data-theme="dark"] .spec-tab{color:#A09888;}
[data-theme="dark"] .spec-tab.active{background:#1E1E1E;color:#E8E0D0;}
[data-theme="dark"] .tile{background:#2A2A2A;border-color:#404040;}
[data-theme="dark"] .tile:hover{background:#333;}
[data-theme="dark"] .hist-row{background:#2A2A2A;}
[data-theme="dark"] .page-title,[data-theme="dark"] .st{color:#E8E0D0;}
[data-theme="dark"] .page-sub{color:#6A6055;}

.app{max-width:660px;margin:0 auto;padding:0 0 5rem;}

/* TOPBAR */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;background:#F0EBE2;border-bottom:1px solid #E6DDD3;position:sticky;top:0;z-index:100;}
[data-theme="dark"] .topbar{background:#2A2A2A;border-color:#404040;}
.topbar-left{display:flex;align-items:center;gap:10px;}
.app-icon{width:34px;height:34px;border-radius:9px;background:#C17B2F;display:flex;align-items:center;justify-content:center;font-size:17px;}
.app-name{font-family:'Lora',serif;font-size:17px;font-weight:600;color:#2A2118;}
[data-theme="dark"] .app-name{color:#E8E0D0;}
.app-sub{font-size:11px;color:#AFA49A;}
.btn-theme{background:none;border:1px solid #E6DDD3;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;color:#7A6E65;}
[data-theme="dark"] .btn-theme{border-color:#505050;color:#A09888;}

/* CONTENT */
.content{padding:20px;}

/* SPEC TABS */
.spec-tabs{display:flex;gap:4px;padding:4px;background:#EDE8DF;border-radius:12px;margin-bottom:18px;}
.spec-tab{flex:1;padding:8px 6px;border-radius:8px;font-size:13px;font-weight:400;color:#7A6E65;cursor:pointer;text-align:center;border:none;background:transparent;font-family:'DM Sans',sans-serif;transition:all .15s;}
.spec-tab.active{background:#fff;color:#2A2118;font-weight:500;box-shadow:0 1px 3px rgba(42,33,24,.08);}

/* TILES */
.tile-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px;}
.tile{background:#fff;border:1px solid #E6DDD3;border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .15s;border-left:3px solid #E6DDD3;}
.tile:hover{border-color:#A0743A;transform:translateY(-1px);}
.tile.hanche{border-left-color:#8B5CF6;}
.tile.genou{border-left-color:#4A9EBF;}
.tile.trauma{border-left-color:#C17B2F;}
.tile-name{font-family:'Lora',serif;font-size:15px;font-weight:500;color:#2A2118;margin-bottom:2px;}
.tile-sub{font-size:11px;color:#AFA49A;}

/* SECTION LABEL */
.section-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.08em;color:#AFA49A;margin:16px 0 8px;padding-bottom:6px;border-bottom:1px solid #E6DDD3;}

/* HISTORIQUE */
.hist-list{display:flex;flex-direction:column;gap:2px;}
.hist-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#fff;border-radius:10px;border:1px solid #E6DDD3;}
.hist-name{font-size:13px;font-weight:500;color:#2A2118;}
.hist-meta{font-size:11px;color:#AFA49A;}
.btn-reopen{font-size:11px;padding:4px 10px;border-radius:6px;border:1px solid #E6DDD3;background:#FAF8F5;color:#7A6E65;cursor:pointer;transition:all .12s;}
.btn-reopen:hover{background:#C17B2F;color:#fff;border-color:#C17B2F;}

/* CARD */
.card{background:#fff;border:1px solid #E6DDD3;border-radius:16px;padding:1.1rem 1.25rem;margin-bottom:10px;box-shadow:0 1px 3px rgba(42,33,24,.05);}
.st{font-size:10px;font-weight:500;color:#AFA49A;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}

/* FIELDS — iOS anti-zoom: font-size >= 16px sur les inputs */
.field{margin-bottom:12px;}
.field label{display:block;font-size:12px;font-weight:500;color:#7A6E65;margin-bottom:4px;}
.field input,.field textarea,.field select{width:100%;font-size:16px;font-family:'DM Sans',sans-serif;background:#FAF8F5;border:1px solid #E6DDD3;border-radius:9px;padding:9px 12px;color:#2A2118;outline:none;transition:all .15s;-webkit-appearance:none;appearance:none;}
.field input:focus,.field textarea:focus,.field select:focus{border-color:#A0743A;background:#fff;box-shadow:0 0 0 3px rgba(160,116,58,.1);}
.field textarea{min-height:68px;resize:vertical;}
.r2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.r3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;}
.tg{display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;}
.tb{padding:8px 14px;border:1px solid #E6DDD3;border-radius:20px;background:#FAF8F5;font-size:14px;font-family:'DM Sans',sans-serif;cursor:pointer;color:#7A6E65;transition:all .12s;-webkit-tap-highlight-color:transparent;}
.tb:hover{border-color:#A0743A;color:#5C3D1E;}
.tb.on{background:#EEE0CC;border-color:#A0743A;color:#5C3D1E;font-weight:500;}

/* CHECKBOXES */
.cb-row{display:flex;flex-direction:column;gap:6px;}
.cbi{display:flex;align-items:center;gap:10px;font-size:14px;color:#2A2118;cursor:pointer;padding:5px 0;user-select:none;-webkit-tap-highlight-color:transparent;}
.cbi input[type=checkbox]{appearance:none;-webkit-appearance:none;width:20px;height:20px;border:2px solid #A0743A;border-radius:5px;background:#FAF8F5;cursor:pointer;flex-shrink:0;transition:all .12s;position:relative;}
.cbi input[type=checkbox]:checked{background:#5C3D1E;border-color:#5C3D1E;}
.cbi input[type=checkbox]:checked::after{content:'';position:absolute;left:4px;top:1px;width:6px;height:10px;border:2px solid white;border-top:none;border-left:none;transform:rotate(45deg);}

/* BOUTONS */
.btn{padding:11px 22px;border-radius:10px;font-size:15px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;border:1px solid #E6DDD3;background:#fff;color:#2A2118;transition:all .12s;-webkit-tap-highlight-color:transparent;}
.btn:hover{background:#F7F4EF;}
.btn-p{background:#5C3D1E;border-color:#5C3D1E;color:white;}
.btn-p:hover{background:#4A2F14;}
.btn-p:disabled{opacity:.5;cursor:not-allowed;}
.btn-s{background:#3A6B4C;border-color:#3A6B4C;color:white;}
.btn-s:hover{background:#2F5A3E;}
.btn-sm{padding:8px 16px;font-size:13px;}
.back-btn{background:none;border:none;font-size:13px;color:#7A6E65;cursor:pointer;padding:0;margin-bottom:1.25rem;display:flex;align-items:center;gap:6px;font-family:'DM Sans',sans-serif;}
.back-btn:hover{color:#2A2118;}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:1.25rem;}
.chip-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;}

/* DOC CHIPS */
.doc-chip{padding:7px 14px;border:1px solid #E6DDD3;border-radius:20px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;color:#7A6E65;background:#FAF8F5;transition:all .12s;-webkit-tap-highlight-color:transparent;}
.doc-chip.on{background:#EDF5F0;border-color:#82B99A;color:#3A6B4C;font-weight:500;}

/* SECRÉTAIRES */
.sec-card{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #E6DDD3;border-radius:12px;cursor:pointer;background:#FAF8F5;margin-bottom:8px;transition:all .12s;}
.sec-card:hover{border-color:#A0743A;background:#fff;}
.sec-card.on{background:#EEE0CC;border-color:#A0743A;}
.av{width:38px;height:38px;border-radius:50%;background:#E6DDD3;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;color:#7A6E65;flex-shrink:0;}
.sec-card.on .av{background:#A0743A;color:white;}

/* DOC TABS */
.doc-tab{padding:7px 14px;border:1px solid #E6DDD3;border-radius:20px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;background:#FAF8F5;color:#7A6E65;transition:all .12s;}
.doc-tab.on{background:#fff;border-color:#A0743A;color:#5C3D1E;font-weight:500;}

/* SPINNER */
.spinner{display:inline-block;width:18px;height:18px;border:2px solid #E6DDD3;border-top-color:#5C3D1E;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:8px;}
@keyframes spin{to{transform:rotate(360deg);}}

/* ALERT */
.alert-i{background:#EEE0CC;color:#5C3D1E;border:1px solid #C4965A;border-radius:10px;padding:12px 16px;font-size:13px;margin-top:12px;}
.alert-e{background:#FCEBEB;color:#A32D2D;border:1px solid #F09595;border-radius:10px;padding:12px 16px;font-size:13px;margin-top:12px;}

/* PAGE TITLES */
.page-title{font-family:'Lora',serif;font-size:28px;font-weight:400;color:#2A2118;margin:0 0 4px;}
.page-sub{font-size:13px;color:#AFA49A;margin:0 0 1.5rem;}
.tag{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500;background:#EEE0CC;color:#5C3D1E;}

/* MIC */
.mic-btn{width:34px;height:34px;border-radius:50%;border:1px solid #C4965A;background:#EEE0CC;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;transition:all .12s;}
.mic-btn:hover,.mic-btn.rec{background:#A0743A;}
.mic-btn.rec{animation:pulse 1s infinite;}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(160,116,58,.4);}50%{box-shadow:0 0 0 6px transparent;}}
.field-mic{display:flex;gap:8px;align-items:flex-start;}
.field-mic input,.field-mic textarea{flex:1;}

/* PREVIEW */
.preview-body{background:#FAF8F5;border:1px solid #E6DDD3;border-radius:12px;padding:16px;font-size:12.5px;line-height:1.75;color:#2A2118;white-space:pre-wrap;font-family:'DM Sans',sans-serif;max-height:60vh;overflow-y:auto;}
`;

// ─── STORAGE ──────────────────────────────────────────────────
const HIST_KEY = "orthodocs_history_v2";
function loadHist() { try { return JSON.parse(localStorage.getItem(HIST_KEY) || "[]"); } catch { return []; } }
function saveHist(e) { const h = [e, ...loadHist().filter(x => x.id !== e.id)].slice(0, 10); localStorage.setItem(HIST_KEY, JSON.stringify(h)); }

// ─── SPEECH ───────────────────────────────────────────────────
function useSpeech(onResult) {
  const [active, setActive] = useState(null);
  const start = useCallback((field) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Dictée vocale disponible sur Chrome uniquement."); return; }
    const r = new SR(); r.lang = "fr-FR"; r.continuous = false; r.interimResults = false;
    r.onresult = e => { onResult(field, e.results[0][0].transcript); setActive(null); };
    r.onerror = () => setActive(null); r.onend = () => setActive(null);
    setActive(field); r.start();
  }, [onResult]);
  return { active, start };
}

function MicBtn({ field, active, onStart }) {
  return <button type="button" className={"mic-btn" + (active === field ? " rec" : "")} onClick={() => onStart(field)} title="Dictée vocale">🎤</button>;
}

// ─── INTERVENTIONS CONFIG ──────────────────────────────────────
const INTERVENTIONS = {
  hanche: [
    { id: "PTH",  label: "PTH",  sub: "Prothèse totale de hanche",  color: "hanche", docs: DOCS_PTH },
  ],
  genou: [
    { id: "PTG",  label: "PTG",  sub: "Prothèse totale de genou",    color: "genou",  docs: DOCS_PTG },
    { id: "LCA",  label: "LCA",  sub: "Reconstruction DT3+2",        color: "genou",  docs: DOCS_LCA },
    { id: "ARTH", label: "Arthroscopie", sub: "Genou diagnostique/thérapeutique", color: "genou", docs: DOCS_ARTH },
  ],
  trauma: [
    { id: "FRAC", label: "Fracture",          sub: "Cheville / Poignet / ESF",   color: "trauma", docs: DOCS_FRAC },
    { id: "ADM",  label: "Ablation matériel", sub: "Vis / Clou / Plaque",         color: "trauma", docs: DOCS_ADM },
  ],
  autre: [],
};

// ─── SPEC FIELDS — HORS de App() pour éviter le bug focus ─────
function PTHFields({ form, sf, sfv, speech }) {
  return (
    <>
      <div className="field"><label>Indication</label>
        <div className="field-mic"><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: coxarthrose primitive"/><MicBtn field="indication" active={speech.active} onStart={speech.start}/></div>
      </div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r3">
        <div className="field"><label>Taille cotyle</label><input type="number" inputMode="numeric" value={form.cotT||""} onChange={sf("cotT")} placeholder="52"/></div>
        <div className="field"><label>Modèle cotyle</label><input value={form.cotM||""} onChange={sf("cotM")} placeholder="Ecofit"/></div>
        <div className="field"><label>Taille râpe</label><input type="number" inputMode="numeric" value={form.rape||""} onChange={sf("rape")} placeholder="7"/></div>
      </div>
      <div className="r3">
        <div className="field"><label>Taille tige</label><input type="number" inputMode="numeric" value={form.tigT||""} onChange={sf("tigT")} placeholder="7"/></div>
        <div className="field"><label>Modèle tige</label><input value={form.tigM||""} onChange={sf("tigM")} placeholder="Ecofit"/></div>
        <div className="field"><label>Type tige</label>
          <div className="tg">{["Standard","Latéralisée"].map(v=><button key={v} className={"tb"+(form.tigeType===v?" on":"")} onClick={()=>sfv("tigeType",v)}>{v}</button>)}</div>
        </div>
      </div>
      <div className="r3">
        <div className="field"><label>Col</label><input value={form.col||""} onChange={sf("col")} placeholder="court"/></div>
        <div className="field"><label>Tête (mm)</label><input type="number" inputMode="numeric" value={form.tete||""} onChange={sf("tete")} placeholder="28"/></div>
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

function PTGFields({ form, sf, sfv, speech }) {
  return (
    <>
      <div className="field"><label>Indication</label>
        <div className="field-mic"><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: gonarthrose tricompartimentaire"/><MicBtn field="indication" active={speech.active} onStart={speech.start}/></div>
      </div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r2">
        <div className="field"><label>Déformation</label>
          <div className="tg">{["varus","valgus"].map(v=><button key={v} className={"tb"+(form.deformation===v?" on":"")} onClick={()=>sfv("deformation",v)}>{v}</button>)}</div>
        </div>
        <div className="field"><label>Degrés</label><input type="number" inputMode="numeric" value={form.degres||""} onChange={sf("degres")} placeholder="8"/></div>
      </div>
      <div className="r3">
        <div className="field"><label>Fémur ACS</label><input value={form.femT||""} onChange={sf("femT")} placeholder="4"/></div>
        <div className="field"><label>Plateau ACS</label><input value={form.platT||""} onChange={sf("platT")} placeholder="3"/></div>
        <div className="field"><label>Insert (mm)</label><input type="number" inputMode="numeric" value={form.insT||""} onChange={sf("insT")} placeholder="10"/></div>
      </div>
      <div className="r2">
        <div className="field"><label>Bouton rotulien</label><input value={form.rotT||""} onChange={sf("rotT")} placeholder="29"/></div>
        <div className="field"><label>Flexion obtenue (°)</label><input type="number" inputMode="numeric" value={form.flex||""} onChange={sf("flex")} placeholder="120"/></div>
      </div>
    </>
  );
}

function LCAFields({ form, sf, sfv, sfb, speech }) {
  return (
    <>
      <div className="field"><label>Ressaut rotatoire pré-op</label>
        <div className="tg">{["absent","présent"].map(v=><button key={v} className={"tb"+(form.ressaut===v?" on":"")} onClick={()=>sfv("ressaut",v)}>{v}</button>)}</div>
      </div>
      <div className="field"><label>Antécédents pertinents (optionnel)</label><input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
      <div className="r2">
        <div className="field"><label>Diamètre tibial (mm)</label><input type="number" inputMode="numeric" value={form.dT||""} onChange={sf("dT")} placeholder="8"/></div>
        <div className="field"><label>Diamètre fémoral (mm)</label><input type="number" inputMode="numeric" value={form.dF||""} onChange={sf("dF")} placeholder="8"/></div>
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
        <div className="field-mic">
          <textarea value={form.cart||""} onChange={sf("cart")} placeholder="ex: lésion grade III compartiment médial fémoral"/>
          <MicBtn field="cart" active={speech.active} onStart={speech.start}/>
        </div>
      </div>
    </>
  );
}

function ArthFields({ form, sf, sfb, speech }) {
  return (
    <>
      <div className="field"><label>Indication / Diagnostic</label>
        <div className="field-mic"><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: lésion méniscale médiale"/><MicBtn field="indication" active={speech.active} onStart={speech.start}/></div>
      </div>
      <div className="field"><label>Gestes réalisés</label>
        <div className="cb-row">
          {[["cbRM","Régularisation méniscale médiale"],["cbRL","Régularisation méniscale latérale"],["cbSM","Suture méniscale"],["cbChondro","Chondroplastie"],["cbSyno","Synovectomie"],["cbCorps","Ablation corps étrangers"]].map(([k,l])=>(
            <label key={k} className="cbi"><input type="checkbox" checked={!!form[k]} onChange={sfb(k)}/>{l}</label>
          ))}
        </div>
      </div>
      <div className="field"><label>Détail opératoire</label>
        <div className="field-mic">
          <textarea value={form.detailOp||""} onChange={sf("detailOp")} placeholder="Description arthroscopique..." style={{minHeight:100}}/>
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start}/>
        </div>
      </div>
    </>
  );
}

function AdmFields({ form, sf, sfv, speech }) {
  return (
    <>
      <div className="field"><label>Indication / matériel</label>
        <div className="field-mic"><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: ablation plaque fibula droite"/><MicBtn field="indication" active={speech.active} onStart={speech.start}/></div>
      </div>
      <div className="field"><label>Voie d'abord</label>
        <div className="tg" style={{flexWrap:"wrap"}}>
          {["Reprise cicatrice","Médiale para-patellaire","Postéro-latérale hanche","Antérieure cheville","Postérieure cheville","Dorsale poignet","Autre"].map(v=>
            <button key={v} className={"tb"+(form.voieAbord===v?" on":"")} onClick={()=>sfv("voieAbord",v)} style={{fontSize:12}}>{v}</button>
          )}
        </div>
      </div>
      <div className="field"><label>Détail opératoire</label>
        <div className="field-mic">
          <textarea value={form.detailOp||""} onChange={sf("detailOp")} placeholder="Description opératoire..." style={{minHeight:100}}/>
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start}/>
        </div>
      </div>
    </>
  );
}

function FracFields({ form, sf, sfv, sfb, speech }) {
  return (
    <>
      <div className="field"><label>Indication / type fracture</label>
        <div className="field-mic"><input value={form.indication||""} onChange={sf("indication")} placeholder="ex: fracture bimalléolaire cheville droite"/><MicBtn field="indication" active={speech.active} onStart={speech.start}/></div>
      </div>
      <div className="r2">
        <div className="field"><label>Installation</label>
          <div className="tg">{["Décubitus dorsal","Décubitus latéral","Décubitus ventral","Table ortho"].map(v=><button key={v} className={"tb"+(form.installation===v?" on":"")} onClick={()=>sfv("installation",v)} style={{fontSize:12}}>{v}</button>)}</div>
        </div>
        <div className="field"><label>Fixation</label>
          <div className="tg">{["Plaque-vis","Enclouage","Vis seules","Broches","DHS","Clou gamma"].map(v=><button key={v} className={"tb"+(form.fixation===v?" on":"")} onClick={()=>sfv("fixation",v)} style={{fontSize:12}}>{v}</button>)}</div>
        </div>
      </div>
      <div className="field"><label>Checklist</label>
        <div className="cb-row">
          {[["cbAntibio","Antibioprophylaxie (Céfazoline 2g)"],["cbAmpli","Amplificateur de brillance"],["cbGarrot","Garrot pneumatique"],["cbChecklist","Check-list HAS validée"]].map(([k,l])=>(
            <label key={k} className="cbi"><input type="checkbox" checked={!!form[k]} onChange={sfb(k)}/>{l}</label>
          ))}
        </div>
      </div>
      <div className="field"><label>Description opératoire (texte libre)</label>
        <div className="field-mic">
          <textarea value={form.detailOp||""} onChange={sf("detailOp")} placeholder="Trait de fracture, réduction, fixation, contrôle scopique, fermeture..." style={{minHeight:120}}/>
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start}/>
        </div>
      </div>
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("od_theme") || "light");
  const [spec, setSpec]   = useState("hanche");
  const [screen, setScreen] = useState("home");
  const [inter, setInter]   = useState("");
  const [form, setForm]     = useState({});
  const [selDocs, setSelDocs] = useState(new Set());
  const [selSecs, setSelSecs] = useState(new Set());
  const [gDocs, setGDocs]   = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [generating, setGenerating] = useState(false);
  const [mailMsg, setMailMsg] = useState(null);
  const [errMsg, setErrMsg]   = useState(null);
  const [history, setHistory] = useState(loadHist);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("od_theme", theme);
  }, [theme]);

  const today = new Date().toISOString().split("T")[0];
  const sf  = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const sfv = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sfb = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.checked }));
  const fmtD = (s) => { if (!s) return "[DATE]"; const [y,m,d] = s.split("-"); return d+"/"+m+"/"+y; };

  const speech = useSpeech((field, text) => {
    setForm(f => ({ ...f, [field]: (f[field] ? f[field] + " " : "") + text }));
  });

  const LABELS = {
    PTH: "Prothèse totale de hanche", PTG: "Prothèse totale de genou",
    LCA: "Reconstruction LCA DT3+2", ARTH: "Arthroscopie du genou",
    ADM: "Ablation de matériel", FRAC: "Ostéosynthèse / Fracture",
  };

  function goInter(id) {
    setInter(id);
    const defaults = {
      date: today, civilite: "Monsieur", cote: "droit", tigeType: "Standard",
      tetem: "inox", infiltr: "Non", deformation: "varus", ressaut: "absent",
      typeAnesthesie: "rachianesthésie", dateSortie: "",
      installation: "Décubitus dorsal", fixation: "Plaque-vis",
      voieAbord: "Reprise cicatrice",
      cbAntibio: true, cbAmpli: true, cbChecklist: true,
    };
    setForm(defaults);
    const found = Object.values(INTERVENTIONS).flat().find(i => i.id === id);
    setSelDocs(new Set(found?.docs || []));
    setSelSecs(new Set());
    setMailMsg(null); setErrMsg(null); setPreviewDoc(null);
    setScreen("form");
  }

  function reopenHist(entry) {
    setInter(entry.inter);
    setForm(entry.form);
    const found = Object.values(INTERVENTIONS).flat().find(i => i.id === entry.inter);
    setSelDocs(new Set(entry.docs || found?.docs || []));
    setSelSecs(new Set());
    setMailMsg(null); setErrMsg(null); setPreviewDoc(null);
    setScreen("form");
  }

  const togDoc = (d) => setSelDocs(s => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n; });
  const togSec = (id) => setSelSecs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  // Prévisualisation texte simple
  function previewText(docName) {
    const f2 = {
      nom: (form.nom||"[NOM]").toUpperCase(), prenom: form.prenom||"[PRÉNOM]",
      ddn: fmtD(form.ddn), age: form.age||"[ÂGE]", dateOp: fmtD(form.date),
      civ: form.civilite||"Monsieur", cote: form.cote||"droit",
      aides: form.aides||"[AIDES]", mt: form.mt||"[MÉDECIN TRAITANT]",
      ind: form.indication||"[INDICATION]", atcd: form.atcd||"",
      typeAnesthesie: form.typeAnesthesie||"rachianesthésie",
      dateSortie: form.dateSortie ? fmtD(form.dateSortie) : "[DATE SORTIE]",
    };
    if (docName === "CRO") return `COMPTE-RENDU OPÉRATOIRE\n${LABELS[inter]||inter} — côté ${f2.cote}\n\nPatient : ${f2.civ} ${f2.nom} ${f2.prenom} — né(e) le ${f2.ddn} (${f2.age} ans)\nDate : ${f2.dateOp}\nOpérateur : Dr Tom ROUSSEL\nAides : ${f2.aides}\nIndication : ${f2.ind}\n\n[Contenu opératoire généré dans le fichier Word]`;
    if (docName === "CRH") return `COURRIER DE SORTIE\n\nLille, le ${f2.dateSortie}\nCher confrère,\n\nVotre patient(e) ${f2.civ} ${f2.nom} ${f2.prenom}, ${f2.age} ans, hospitalisé(e) du ${f2.dateOp} au ${f2.dateSortie}.\n\nIntervention : ${LABELS[inter]||inter} — côté ${f2.cote}\nAnesthésie : ${f2.typeAnesthesie}\n\n[Contenu détaillé généré dans le fichier Word]\n\nBien cordialement,\nPr C. CHANTELOT          Dr Tom ROUSSEL`;
    return `${docName}\n\n[Contenu généré dans le fichier Word]`;
  }

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
      typeAnesthesie: form.typeAnesthesie||"rachianesthésie",
      dateSortie: form.dateSortie ? fmtD(form.dateSortie) : "[DATE SORTIE]",
      indication: form.indication||"[INDICATION]",
      detailOp: form.detailOp||"",
      voieAbord: form.voieAbord||"",
    };
    // Sauvegarder dans l'historique
    const entry = { id: Date.now().toString(), inter, form, docs: [...selDocs], nom: f.nom, prenom: f.prenom, interLabel: LABELS[inter]||inter, date: form.date };
    saveHist(entry); setHistory(loadHist());
    try {
      const docs = await generateDocs(inter, f, [...selDocs]);
      const res = {};
      for (const [name, doc] of Object.entries(docs)) {
        res[name] = await Packer.toBlob(doc);
      }
      setGDocs(res);
      setActiveTab(Object.keys(res)[0] || "");
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
    a.download = inter + "_" + (form.nom||"PATIENT").toUpperCase() + "_" + name.replace(/ /g,"_") + "_" + fmtD(form.date) + ".docx";
    a.click(); URL.revokeObjectURL(url);
  }
  const dlAll = () => Object.keys(gDocs).forEach((n,i) => setTimeout(() => dlDoc(n), i * 250));

  function sendMail() {
    const to = [...selSecs].map(id => SECS[id].email).join(",");
    const subject = `Documents post-op — ${(form.nom||"").toUpperCase()} ${form.prenom||""} — ${LABELS[inter]||inter} — ${fmtD(form.date)}`;
    const body = `Bonjour,\n\nVeuillez trouver ci-joints les documents post-opératoires pour ${form.civ||""} ${(form.nom||"").toUpperCase()} ${form.prenom||""} (${LABELS[inter]||inter} du ${fmtD(form.date)}).\n\nDocuments à joindre :\n${Object.keys(gDocs).map(n => "• " + inter+"_"+(form.nom||"PATIENT").toUpperCase()+"_"+n.replace(/ /g,"_")+"_"+fmtD(form.date)+".docx").join("\n")}\n\nCordialement,\nDr Tom ROUSSEL`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const allInter = Object.values(INTERVENTIONS).flat();

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            {screen !== "home" && (
              <button className="back-btn" style={{margin:0,marginRight:8}} onClick={() => setScreen(screen === "docs" ? "form" : "home")}>←</button>
            )}
            <div className="app-icon">🦴</div>
            <div>
              <div className="app-name">OrthoDocs</div>
              <div className="app-sub">CHU Lille · Dr Roussel</div>
            </div>
          </div>
          <button className="btn-theme" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
            {theme === "light" ? "☾" : "☀"}
          </button>
        </div>

        <div className="content">

          {/* ── HOME ── */}
          {screen === "home" && (
            <>
              <div className="spec-tabs">
                {["hanche","genou","trauma","autre"].map(s => (
                  <button key={s} className={"spec-tab" + (spec === s ? " active" : "")} onClick={() => setSpec(s)}>
                    {s.charAt(0).toUpperCase()+s.slice(1)}
                  </button>
                ))}
              </div>

              {INTERVENTIONS[spec]?.length > 0 ? (
                <div className="tile-grid">
                  {INTERVENTIONS[spec].map(item => (
                    <div key={item.id} className={"tile " + item.color} onClick={() => goInter(item.id)}>
                      <div className="tile-name">{item.label}</div>
                      <div className="tile-sub">{item.sub}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{color:"#AFA49A",fontSize:13,textAlign:"center",padding:"40px 0"}}>Bientôt disponible</div>
              )}

              {history.length > 0 && (
                <>
                  <div className="section-label">Récents</div>
                  <div className="hist-list">
                    {history.map(h => (
                      <div key={h.id} className="hist-row">
                        <div>
                          <div className="hist-name">{h.nom} {h.prenom} — {h.interLabel}</div>
                          <div className="hist-meta">{h.date ? fmtD(h.date) : "—"}</div>
                        </div>
                        <button className="btn-reopen" onClick={() => reopenHist(h)}>Rouvrir</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── FORM ── */}
          {screen === "form" && (
            <>
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
                  <div className="field"><label>Âge</label><input type="number" inputMode="numeric" value={form.age||""} onChange={sf("age")} placeholder="54"/></div>
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
                <div className="field"><label>Aides opératoires</label>
                  <div className="field-mic"><input value={form.aides||""} onChange={sf("aides")} placeholder="ex: Florian PETELLE – Claire ZIEGLER"/><MicBtn field="aides" active={speech.active} onStart={speech.start}/></div>
                </div>
                <div className="field"><label>Médecin traitant</label><input value={form.mt||""} onChange={sf("mt")} placeholder="Dr Nom Prénom"/></div>
                <div className="r2">
                  <div className="field"><label>Type d'anesthésie</label>
                    <div className="tg">{["générale","loco-régionale","rachianesthésie"].map(v=><button key={v} className={"tb"+(form.typeAnesthesie===v?" on":"")} onClick={()=>sfv("typeAnesthesie",v)} style={{fontSize:12,padding:"7px 10px"}}>{v}</button>)}</div>
                  </div>
                  <div className="field"><label>Date de sortie</label><input type="date" value={form.dateSortie||""} onChange={sf("dateSortie")}/></div>
                </div>
              </div>

              <div className="card">
                <div className="st">Détails intervention</div>
                {inter === "PTH"  && <PTHFields  form={form} sf={sf} sfv={sfv} speech={speech}/>}
                {inter === "PTG"  && <PTGFields  form={form} sf={sf} sfv={sfv} speech={speech}/>}
                {inter === "LCA"  && <LCAFields  form={form} sf={sf} sfv={sfv} sfb={sfb} speech={speech}/>}
                {inter === "ARTH" && <ArthFields form={form} sf={sf} sfb={sfb} speech={speech}/>}
                {inter === "ADM"  && <AdmFields  form={form} sf={sf} sfv={sfv} speech={speech}/>}
                {inter === "FRAC" && <FracFields form={form} sf={sf} sfv={sfv} sfb={sfb} speech={speech}/>}
              </div>

              <div className="card">
                <div className="st">Documents à générer</div>
                <div className="chip-row">
                  {(allInter.find(i=>i.id===inter)?.docs||[]).map(d=>(
                    <button key={d} className={"doc-chip"+(selDocs.has(d)?" on":"")} onClick={()=>togDoc(d)}>{d}</button>
                  ))}
                </div>
                <p style={{fontSize:12,color:"#AFA49A",marginTop:4}}>{selDocs.size} document(s) sélectionné(s)</p>
              </div>

              {/* PRÉVISUALISATION */}
              {previewDoc && (
                <div className="card">
                  <div className="st" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>Prévisualisation — {previewDoc}</span>
                    <button style={{background:"none",border:"none",color:"#AFA49A",cursor:"pointer",fontSize:16}} onClick={()=>setPreviewDoc(null)}>✕</button>
                  </div>
                  <div className="preview-body">{previewText(previewDoc)}</div>
                </div>
              )}
              <div className="card">
                <div className="st">Prévisualiser un document</div>
                <div className="chip-row">
                  {[...selDocs].map(d=>(
                    <button key={d} className={"doc-chip"+(previewDoc===d?" on":"")} onClick={()=>setPreviewDoc(previewDoc===d?null:d)}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="card">
                <div className="st">Secrétaires destinataires</div>
                {Object.entries(SECS).map(([id,sec])=>(
                  <div key={id} className={"sec-card"+(selSecs.has(id)?" on":"")} onClick={()=>togSec(id)}>
                    <div className="av">{sec.ini}</div>
                    <div><div style={{fontSize:14,fontWeight:500}}>{sec.nom}</div><div style={{fontSize:12,color:"#7A6E65"}}>{sec.email}</div></div>
                  </div>
                ))}
              </div>

              <div className="actions">
                <button className="btn btn-p" onClick={handleGen} disabled={selDocs.size===0}>
                  Générer {selDocs.size} document{selDocs.size>1?"s":""}
                </button>
                <button className="btn" onClick={()=>setScreen("home")}>Annuler</button>
              </div>
            </>
          )}

          {/* ── DOCS ── */}
          {screen === "docs" && (
            <>
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
                        <button className="btn btn-s" onClick={() => { dlAll(); sendMail(); }}>✉ Envoyer</button>
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
      </div>
    </>
  );
}
