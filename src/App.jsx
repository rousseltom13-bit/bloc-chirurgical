import { useState, useCallback } from "react";
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, VerticalAlign, UnderlineType,
  Header, Footer, ImageRun
} from "docx";

// ─── IMAGES ───────────────────────────────────────────────────
const LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAAHQAAABHCAIAAABZFvRzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAh1QAAIdUBBJy0nQAABOZJREFUeF7tWn9k1VEUX3+NpMg0MkViZBqZRlIkRqaRKRIj00iKxEiKRCRG0sg0MkX6fySNTCOzkWnMFEkjs5FpZLY+z/m++84798f3/bp7a51n5vvu99zP95zP/dxz7r3ft2Vtba1GP5EYALn6icRATSRchc2kBGUhHgNKbjxuVbkRubXIRdnkj6OvppaKW7zGkpn5bywFAnWhu6J7oDEmAxGxZVrgwQu+nLz7RsImVwThG0UbMGL0kaEd5HL1hZXr5Evo1ylnW+BGtpHjXVf4gsh1emRPas4jn/siA4i0YI+QEPW68lHRh7nJ9SXQ8JwNaDbAl0hEPPNWNNIqgFWf3EBC+Ncl7CXXzGXfiNuR2+nVqNJnHK57m5lcX9nxaU2XYrJ+VCEV/TeP1O1vxKFWcpXciAxEhFblKrkRGYgI7VBu7dZt+MMz6T9dmEb7q2kxXURH4z5v5zimnSPwhwp/hA/mrugi2k0s/ILHZcMKxwQzoq89SkpuoiRbRmHeuaS8+yz7hiqXS55PO1VuLqdpWsjL5ppzZX3TgqY5N7fy0dVCki74IqyQhRGvOZpzNefqJiJ/J+Vcq+kmIm/baW8EnHs85/5CNxHJJl7s3bWgaUHLphl7X8inkh7c5NKxni3o2UJuDadHjsm5sF1M7JM9+6hXz3Nz5+t6WE4a0sNyPSzPf+2kr3mSJGu/H/Md2gbSseZczbnydEFzruZczbk8mer2V5diyftA3/vzQt59+F6gKblKbvaHVYXoSN+hJa8DzLG/vRYWt3Sdq+vcAta5gQytt4piQH/8XBRdxRkrucXxVZS1klsUXcUZl0vu2MdxlPIdu+ror/fmLXr+3MJ8x5lOtDQeaOp78pg71XWxG+179+2/c/eeaTcImYuddbXbk592BXDQHSCwP3f+wuKvpfBzffg+/4tj0WNdLrn9TwcQmw3eeuQo2pf/rCz+Xmo71d7/bIBsrl2/AdLRDtaaD7UMPh+y+4L9vkfJePhw7j942Hy4Ze7nPKA6znZ2XeomHJ+9GF2D7/N/Q5CLqBCncAUxQ874T+0jH0YRM11DlWMT43QNZluPJe0GYeT9aOPBpkSGfhxoFrBkhvH7+u07LgLPdeKj0el/RZgFSLnKhfqOnziJuV+/p6Hn6pXl1RWAIlSQi5jJS0w9cJpp/5HfPjGO2SoiAd0vX72mRh8OkgDwYQbx1u9ugNKh34A9fwTHR7vT/41CbtvpdpramOaY/oiTPIPTxDWIgA1tsaZnZvlmTHyFweSnKZDFYwvg9FzO4qc91wDa+D7/K8JvucrlTmSKQ7YQQaTgGkxBKchrRJlULhSdr1zUQwwJx3Tj0MzIFrHMzMjiOO0NoI3v87/65CLHmeUBvEG6NLqb/DxFKQIfkAui6RosQD50PfhiCClF6HT4zVve4sPBKPKcnvpcM584fsD/6pML+pBqaUWFtACRGq5RwajQTX+ZRfEZfpdQhtUCZqJztQC0TBlcSMoghefDgcDNagQjBNiwPe7a+AH/q08uPIAMERvqFVjuvZ0scjOczsyCa7Sj1vH1FmildS60xte56ELly+idwvPirK6AX4AAipJv2N6H7/N/Q5BbESc2K0glC9pm5ajkuJTckqlL76jkpnNUsoWSWzJ16R2V3HSOSrZQckumLr2jkpvOUckWfwHWqjVoddZlMAAAAABJRU5ErkJggg==";

// ─── CONSTANTS ────────────────────────────────────────────────
const SECRETAIRES = {
  coralie: { nom: "Coralie Wallaert", email: "coralie.wallaert@chu-lille.fr", initiales: "CW" },
  alexandre: { nom: "Alexandre Delmeire", email: "alexandre1.delmeire@chu-lille.fr", initiales: "AD" },
};

const INTERVENTIONS = [
  { id: "PTH", label: "PTH", sub: "Prothèse totale de hanche", available: true },
  { id: "PTG", label: "PTG", sub: "Prothèse totale de genou", available: true },
  { id: "LCA", label: "LCA", sub: "Reconstruction DT3+2", available: true },
  { id: "TTA", label: "TTA + MPFL", sub: "Bientôt disponible", available: false },
  { id: "MEN", label: "Ménisque", sub: "Bientôt disponible", available: false },
];

const DOCS_CONFIG = {
  PTH: ["CRO", "CRH", "Ordonnance pharma", "Ordonnance IDE", "Ordonnance kiné", "Ordonnance matériel"],
  PTG: ["CRO", "CRH", "Ordonnance pharma", "Ordonnance IDE", "Ordonnance kiné", "Ordonnance matériel"],
  LCA: ["CRO", "CRH", "Ordonnance pharma", "Ordonnance IDE", "Ordonnance kiné", "Ordonnance matériel"],
};

// ─── DOCX HELPERS ─────────────────────────────────────────────
function b64ToUint8(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function noBorder() { return { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; }
function allNoBorders() {
  return { top: noBorder(), bottom: noBorder(), left: noBorder(), right: noBorder(), insideHorizontal: noBorder(), insideVertical: noBorder() };
}
function tx(text, opts = {}) {
  return new TextRun({ text, font: "Arial", size: opts.size ?? 20, bold: opts.bold ?? false,
    italics: opts.italics ?? false,
    underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
    color: opts.color ?? "000000" });
}
function pp(runs, opts = {}) {
  return new Paragraph({ alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { after: opts.after ?? 0, before: opts.before ?? 0 },
    children: Array.isArray(runs) ? runs : [runs] });
}
function pj(text, opts = {}) {
  return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
    spacing: { after: opts.after ?? 60, before: opts.before ?? 0 },
    children: [tx(text, opts)] });
}
function ep(after = 80) { return pp(tx(""), { after }); }

async function buildHeader() {
  const logoData = b64ToUint8(LOGO_B64);
  return new Header({
    children: [
      new Table({ width: { size: 9204, type: WidthType.DXA }, columnWidths: [4602, 4602],
        borders: allNoBorders(),
        rows: [new TableRow({ children: [
          new TableCell({ borders: allNoBorders(), width: { size: 4602, type: WidthType.DXA },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
              children: [new ImageRun({ data: logoData, transformation: { width: 80, height: 49 }, type: "png" })] })] }),
          new TableCell({ borders: allNoBorders(), width: { size: 4602, type: WidthType.DXA },
            children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 10 }, children: [tx("N° FINESS", { size: 14, color: "444444" })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 },
                children: [tx("590796975", { size: 16, bold: true })] })
            ] }),
        ]})] })
    ]
  });
}

function buildFooter() {
  return new Footer({ children: [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } },
      children: [tx("Rue du Professeur Emile Laine – 59037 Lille Cedex     www.chru-lille.fr", { size: 16 })] }),
  ]});
}

function serviceLeftParas(before = 0) {
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

function refBlock(nom, prenom, ddn, dateEntree, dateSortie) {
  const l = [
    pp([tx("HOPITAL ROGER SALENGRO", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Pôle de l'Appareil locomoteur", { size: 18 })], { after: 0 }),
    pp([tx("Orthopédie et Traumatologie", { size: 18 })], { after: 40 }),
    pp([tx("Réf. : CW /", { size: 18 })], { after: 0 }),
    pp([tx(`${nom} ${prenom}`, { size: 18 })], { after: 0 }),
    pp([tx(`Né(e) le ${ddn}`, { size: 18 })], { after: 0 }),
  ];
  if (dateEntree) l.push(pp([tx(dateSortie ? `Hospitalisation du ${dateEntree} au ${dateSortie}` : `Hospitalisation du : ${dateEntree} au`, { size: 18 })], { after: 0 }));
  return l;
}

function patientRight(nom, prenom, adresse, cp, ville) {
  return [
    ep(80),
    pp([tx(`${nom} ${prenom}`, { size: 20, bold: true })], { after: 40 }),
    pp([tx(adresse, { size: 20 })], { after: 40 }),
    ep(40),
    pp([tx(`${cp} ${ville}`, { size: 20, bold: true })], { after: 0 }),
  ];
}

function topTable(nom, prenom, ddn, adresse, cp, ville, dateEntree, dateSortie) {
  return new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [4500, 4704],
    borders: allNoBorders(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: allNoBorders(), width: { size: 4500, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: refBlock(nom, prenom, ddn, dateEntree, dateSortie) }),
      new TableCell({ borders: allNoBorders(), width: { size: 4704, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: patientRight(nom, prenom, adresse, cp, ville) }),
    ]})]
  });
}

function mainTwoCol(leftParas, rightParas, leftBefore = 0) {
  const left = leftBefore > 0
    ? [pp([tx("Pr C. CHANTELOT", { size: 18, bold: true, italics: true })], { after: 0, before: leftBefore }),
       ...serviceLeftParas(0).slice(1)]
    : serviceLeftParas(0);
  return new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [2800, 6404],
    borders: allNoBorders(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: allNoBorders(), width: { size: 2800, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: left }),
      new TableCell({ borders: allNoBorders(), width: { size: 6404, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: rightParas }),
    ]})]
  });
}

const docProps = {
  sections: [{ properties: { page: {
    size: { width: 11906, height: 16838 },
    margin: { top: 851, right: 720, bottom: 567, left: 720, header: 426, footer: 342 }
  }}}]
};

// ─── ORDONNANCE BUILDER ───────────────────────────────────────
async function buildOrdo(nom, prenom, ddn, dateOp, contenu, titre = "ORDONNANCE") {
  const header = await buildHeader();
  const footer = buildFooter();

  const topT = new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [4600, 4604],
    borders: allNoBorders(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: allNoBorders(), width: { size: 4600, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: [
          pp([tx("HOPITAL ROGER SALENGRO", { size: 18 })], { after: 20 }),
          pp([tx("Pôle des Neurosciences et de l'Appareil Locomoteur", { size: 16 })], { after: 20 }),
          pp([tx("ORTHOPEDIE - TRAUMATOLOGIE", { size: 18, bold: true })], { after: 80 }),
          pp([tx("Service de Traumatologie", { size: 20, bold: true })], { after: 0 }),
        ]
      }),
      new TableCell({ borders: allNoBorders(), width: { size: 4604, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: [
          new Table({ width: { size: 4500, type: WidthType.DXA }, columnWidths: [4500],
            rows: [new TableRow({ children: [new TableCell({
              borders: { top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" }, right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" } },
              width: { size: 4500, type: WidthType.DXA },
              margins: { top: 120, bottom: 120, left: 120, right: 120 },
              children: [pp([tx(`${nom} ${prenom}${ddn ? ` - né(e) le ${ddn}` : ""}`, { size: 18 })], { after: 200 }), ep(80)]
            })] })]
          }),
          ep(40),
          pp([tx("Poids :", { size: 18, italics: true })], { after: 0 }),
        ]
      }),
    ]})]
  });

  const titlePara = new Paragraph({ alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 400 }, children: [tx(titre, { size: 36, bold: true })] });

  const datePara = new Paragraph({ alignment: AlignmentType.RIGHT,
    spacing: { after: 200 }, children: [tx(`Lille, le ${dateOp}`, { size: 20 })] });

  const I = 120;
  const leftParas = [
    ep(200),
    pp([tx("□ Pr Christophe CHANTELOT", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Chef de Service", { size: 18 })], { after: 0 }),
    pp([tx("Chirurgie orthopédique et traumatologique", { size: 18 })], { after: 0 }),
    pp([tx("10003798971", { size: 18 })], { after: I }),
    pp([tx("□ Dr Marion HALBAUT", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Praticien Hospitalier", { size: 18 })], { after: 0 }),
    pp([tx("Chirurgie orthopédique et traumatologique", { size: 18 })], { after: 0 }),
    pp([tx("10102005708", { size: 18 })], { after: I }),
    pp([tx("□ Dr Allison FITOUSSI", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Cheffe de Clinique", { size: 18 })], { after: 0 }),
    pp([tx("Chirurgie orthopédique et traumatologique", { size: 18 })], { after: 0 }),
    pp([tx("10101538402", { size: 18 })], { after: I }),
    pp([tx("□ Dr Noémie ALLIO", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Docteur Junior", { size: 18 })], { after: 0 }),
    pp([tx("Chirurgie orthopédique et traumatologique", { size: 18 })], { after: 0 }),
    pp([tx("10102200101", { size: 18 })], { after: I }),
    pp([tx("□ Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Docteur Junior", { size: 18 })], { after: 0 }),
    pp([tx("Chirurgie orthopédique et traumatologique", { size: 18 })], { after: 0 }),
    pp([tx("10102203147", { size: 18 })], { after: 0 }),
  ];

  const contentParas = contenu.map(line => {
    if (line === "") return ep(80);
    if (line.startsWith("##")) return pp([tx(line.replace("##","").trim(), { size: 20, bold: true, underline: true })], { after: 60 });
    if (line.startsWith("**")) return pp([tx(line.replace(/\*\*/g,"").trim(), { size: 20, bold: true })], { after: 60 });
    return pj(line, { after: 60 });
  });

  const rightParas = [datePara, ...contentParas, ep(200)];

  const mainT = new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [3200, 6004],
    borders: allNoBorders(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: allNoBorders(), width: { size: 3200, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: leftParas }),
      new TableCell({ borders: allNoBorders(), width: { size: 6004, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: rightParas }),
    ]})]
  });

  return new Document({ sections: [{ ...docProps.sections[0],
    headers: { default: header }, footers: { default: footer },
    children: [topT, titlePara, mainT] }] });
}

// ─── CRO BUILDER ──────────────────────────────────────────────
async function buildCRO(data) {
  const { nom, prenom, ddn, adresse = "[ADRESSE]", cp = "[CP]", ville = "[VILLE]",
    dateEntree, dateSortie = "", dateOp, aides, indication, ccam, implants = "", tempsOp = [] } = data;
  const header = await buildHeader();
  const footer = buildFooter();

  const rightContent = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200, before: 160 },
      children: [tx(`Lille, le ${dateOp}`, { size: 20 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [tx("COMPTE-RENDU OPERATOIRE", { size: 22, bold: true })] }),
    pj(`Date opératoire : ${dateOp}`),
    pj(`Opérateur : Docteur Tom ROUSSEL`),
    pj(`Aides opératoires : ${aides}`),
    ep(80),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [tx("Indication : ", { size: 20, bold: true }), tx(indication, { size: 20, bold: true })] }),
    pj(`CCAM : ${ccam}`, { italics: true, after: 80 }),
    ...(implants ? [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [tx("Rappel des implants : ", { size: 20, bold: true }), tx(implants, { size: 20 })] })] : []),
    ep(40),
    ...tempsOp.map(l => {
      if (l === "") return ep(80);
      if (l.startsWith("##")) return new Paragraph({ spacing: { after: 60 },
        children: [tx(l.replace("##","").trim(), { size: 20, bold: true, underline: true })] });
      return pj(l, { after: 60 });
    }),
    ep(160),
    pp([tx("Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }),
    pj("Docteur Junior — Service de Traumatologie-Orthopédie"),
  ];

  return new Document({ sections: [{ ...docProps.sections[0],
    headers: { default: header }, footers: { default: footer },
    children: [topTable(nom, prenom, ddn, adresse, cp, ville, dateEntree, dateSortie),
               ep(120), mainTwoCol([], rightContent)] }] });
}

// ─── CRH BUILDER ──────────────────────────────────────────────
async function buildCRH(data) {
  const { nom, prenom, ddn, adresse = "[ADRESSE]", cp = "[CP]", ville = "[VILLE]",
    dateEntree = "", dateSortie = "", dateLettre, medecinTraitant = "[MÉDECIN TRAITANT]",
    salutation = "Cher confrère,", paragraphes = [] } = data;
  const header = await buildHeader();
  const footer = buildFooter();

  const bodyParas = paragraphes.map(item => {
    if (item.type === "consigne") return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 60 }, indent: { left: 360 }, children: [tx(`- ${item.texte}`, { size: 20 })] });
    if (item.type === "mixed") return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      spacing: { after: item.after ?? 120 }, children: item.runs });
    return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      spacing: { after: item.after ?? 120 },
      children: [tx(item.texte, { bold: item.bold ?? false, italics: item.italics ?? false })] });
  });

  const rightParas = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 160, before: 160 },
      children: [tx(`Lille, le ${dateLettre}`, { size: 20 })] }),
    pj(salutation, { after: 160 }),
    ...bodyParas,
    ep(120),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0 },
      children: [tx("Professeur C. CHANTELOT", { size: 20, bold: true }),
                 tx("          Le Docteur ROUSSEL TOM", { size: 20, bold: true })] }),
  ];

  const medecinPara = new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0, before: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } },
    children: [tx(`Lettre adressée à : ${medecinTraitant}`, { size: 16, color: "444444" })] });

  return new Document({ sections: [{ ...docProps.sections[0],
    headers: { default: header }, footers: { default: footer },
    children: [topTable(nom, prenom, ddn, adresse, cp, ville, dateEntree, dateSortie),
               ep(120), mainTwoCol([], rightParas, 480), ep(200), medecinPara] }] });
}

// ─── DOCUMENT GENERATION ──────────────────────────────────────
async function generateAllDocs(intervention, formData, selectedDocs) {
  const { nom, prenom, ddn, age, dateOp, civ, cote, aides, mt, ...specific } = formData;
  const nomUp = nom.toUpperCase();
  const docs = {};

  if (intervention === "PTH") {
    const { ind, atcd, cotTaille, cotModele, tigTaille, tigModele, tigeType,
            col, tete, tetem, rape, infiltr } = specific;
    const cotOpp = cote === "droit" ? "gauche" : "droit";
    const implants = `Cotyle ${cotModele} taille ${cotTaille} / Tige ${tigModele} ${tigeType} taille ${tigTaille} / Tête ${tete} DM ${tetem} col ${col}`;

    if (selectedDocs.includes("CRO")) {
      docs["CRO"] = await buildCRO({
        nom: nomUp, prenom, ddn, dateEntree: dateOp, dateOp, aides,
        indication: `Arthroplastie totale de hanche ${cote} dans le cadre d'une ${ind}.`,
        ccam: "NEKA020", implants,
        tempsOp: [
          `Installation en décubitus latéral ${cotOpp}.`,
          "Badigeon et champage stérile.",
          "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.",
          "Check-list.", "",
          "Voie d'abord postéro-latérale.", "Hémostases sous cutanées.",
          "Ouverture du fascia lata.", "Discision des fibres du grand fessier.",
          "Pneumatisation de la bourse rétro-trochantérienne.",
          "Ouverture des pelvi-trochantériens et de la capsule en L inversé au ras du grand trochanter.",
          "Faufilage au Vicryl 2.", "Luxation de la hanche.",
          "Ostéotomie du col fémoral à la scie oscillante selon la planification pré-opératoire.",
          "Ablation de la tête fémorale sans difficulté.", "",
          "##Temps cotyloïdien :",
          "Exposition du cotyle.", "Ablation du labrum.",
          "Ablation du reliquat du ligament rond de la tête fémorale.",
          "Repérage du ligament transverse.",
          `Fraisages de tailles croissantes jusqu'à la taille ${cotTaille} pour mise en place d'un cotyle définitif taille ${cotTaille} DM ${cotModele} sans ciment légèrement plus antéversé que le transverse.`,
          "La tenue primaire est excellente.", "",
          "##Temps fémoral :",
          "Exposition du fût fémoral jambe au zénith.",
          "Ablation du reliquat de col à l'emporte-pièce.",
          "Tunnelisation à la dague.", "Évidement du grand trochanter à la curette.",
          `On passe les râpes de tailles successives jusqu'à la râpe taille ${rape}.`,
          `Essais sur râpe en place col ${col}.`,
          "La stabilité est excellente et les longueurs sont restaurées.",
          `Décision de mise en place d'une tige ${tigModele} ${tigeType} sans ciment taille ${tigTaille}.`,
          "Nouveaux essais sur la tige définitive strictement comparables.",
          `Mise en place d'une tête ${tete} DM ${tetem} col ${col}.`,
          "Réduction de la hanche.", "Nettoyage abondant.",
          ...(infiltr === "Oui" ? ["Infiltration péri-articulaire selon protocole."] : []),
          "Réinsertion des pelvi-trochantériens et de la capsule par des points trans-glutéaux au Lucas.",
          "Fermeture plan par plan.", "Agrafes à la peau.", "Pansement Aquacel Duoderm.",
        ]
      });
    }

    if (selectedDocs.includes("CRH")) {
      docs["CRH"] = await buildCRH({
        nom: nomUp, prenom, ddn, dateEntree: dateOp, dateSortie: "[DATE SORTIE]",
        dateLettre: dateOp, medecinTraitant: mt,
        paragraphes: [
          { type: "mixed", after: 120, runs: [
            tx("Votre patient(e) "), tx(`${civ} ${nomUp} ${prenom}`, { bold: true }),
            tx(`, ${age} ans, a été hospitalisé(e) dans notre service du ${dateOp} au [DATE SORTIE] pour la réalisation de son arthroplastie totale de hanche ${cote} sur ${ind}.`),
          ]},
          ...(atcd ? [{ texte: atcd, after: 120 }] : []),
          { texte: `L'intervention s'est parfaitement déroulée au bloc opératoire le ${dateOp} sous anesthésie [TYPE]. Les radiographies de contrôle post-opératoire sont satisfaisantes.`, after: 120 },
          { texte: "Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.", after: 120 },
          { texte: "La sortie du patient est autorisée ce [DATE SORTIE] sous couvert des consignes suivantes :", after: 60 },
          { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM" },
          { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
          { type: "consigne", texte: "Kinésithérapie selon le protocole remis au patient" },
          { type: "consigne", texte: `Appui complet autorisé d'emblée avec 2 cannes anglaises, précautions anti-luxation pendant 6 semaines` },
          { type: "consigne", texte: "Antalgiques selon ordonnance" },
          { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours" },
          { texte: `Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du bassin de face et de hanche ${cote} de face et profil.`, after: 200 },
          { texte: "Bien cordialement.", after: 300 },
        ]
      });
    }

    if (selectedDocs.includes("Ordonnance pharma")) {
      docs["Ordonnance pharma"] = await buildOrdo(nomUp, prenom, ddn, dateOp, [
        "**Matériel de soins :", "AQUACEL Extra — 1 boîte", "DUODERM Extra Thin — 1 boîte",
        "Compresses stériles 10 cm x 10 cm — 1 boîte de 100", "BISEPTINE — 1 flacon",
        "Sérum physiologique — 1 boîte de 30 dosettes", "Set à pansement stérile — 1 boîte", "",
        "**Analgésie systématique (horaires fixes, 7 premiers jours) :",
        "", "PARACÉTAMOL 1g — 1 cp toutes les 6h — QSP 30 jours",
        "", "IBUPROFÈNE 400mg — 1 cp matin, midi et soir au cours des repas — QSP 10 jours",
        "", "OMÉPRAZOLE 20mg — 1 gél. le matin — QSP 10 jours",
        "", "**Si douleurs insuffisamment contrôlées (hors sujet âgé > 70 ans) :",
        "", "ACUPAN 30mg (néfopam) — 1 cp matin, midi et soir — QSP 10 jours",
        "(Contre-indiqué si glaucome, HBP, pathologie cardiaque, insuffisance rénale)",
        "", "**Anticoagulation :",
        "", "INNOHEP 4500 UI/j — 1 injection sous-cutanée par jour pendant 35 jours",
      ]);
    }

    if (selectedDocs.includes("Ordonnance IDE")) {
      docs["Ordonnance IDE"] = await buildOrdo(nomUp, prenom, ddn, dateOp, [
        `Merci de bien vouloir réaliser des soins de pansements à domicile toutes les 4 jours, dimanches et jours fériés inclus, jusqu'à cicatrisation complète.`,
        "", "Les agrafes sont à retirer au 15e jour post-opératoire.",
        "", "Une injection sous-cutanée d'INNOHEP 4500 UI/jour doit être réalisée tous les jours, dimanches et jours fériés inclus, pendant 35 jours.",
        "", "Une numération plaquettaire 1 fois par semaine doit être réalisée, les résultats seront à envoyer au médecin traitant du patient, pendant 35 jours.",
      ], `Ordonnance IDE après Arthroplastie Totale de Hanche ${cote}`);
    }

    if (selectedDocs.includes("Ordonnance kiné")) {
      docs["Ordonnance kiné"] = await buildOrdo(nomUp, prenom, ddn, dateOp, [
        `**KINÉSITHÉRAPIE — post-PTH ${cote}`,
        "Voie postéro-latérale — Appui complet autorisé d'emblée — URGENT", "",
        "Je laisse le soin à mon confrère kinésithérapeute de décider du nombre et de la fréquence des séances. Rééducation au cabinet conseillée.", "",
        "##Phase 1 — J0 à J15 :", "Cryothérapie, drainage lymphatique si œdème",
        "Exercices isométriques quadriceps/fessiers", "Mobilisation active douce en flexion < 70°",
        "Éducation : ÉVITER flexion > 90° + adduction + rotation interne combinées",
        "Verticalisation, marche avec 2 cannes, escaliers", "",
        "##Phase 2 — J15 à 6 semaines :", "Renforcement moyen fessier (priorité)",
        "Renforcement quadriceps et ischio-jambiers", "Proprioception, correction schéma de marche",
        "Passage à 1 canne côté opposé", "Vélo sans résistance à partir de S3-S4", "",
        "##Phase 3 — 6 semaines à 3 mois :", "Arrêt précautions anti-luxation à 6 semaines",
        "Renforcement musculaire progressif en charge", "Endurance : marche, vélo, natation",
        "Reprise sportive légère à 3 mois",
      ]);
    }

    if (selectedDocs.includes("Ordonnance matériel")) {
      docs["Ordonnance matériel"] = await buildOrdo(nomUp, prenom, ddn, dateOp, [
        "**Matériel de rééducation et aide à la mobilité :",
        "", "2 Cannes anglaises réglables — 1 paire",
        "", `Réhausseur de toilettes (hauteur adaptée au patient) — 1`,
        "", `Bas de contention classe II (20-36 mmHg) — Jambe ${cote} — QSP 3 mois`,
      ]);
    }
  }

  // PTG et LCA suivent le même pattern — simplifié ici
  if (intervention === "PTG") {
    const { ind, atcd, deformation, degres, femTaille, platTaille, insTaille, rotTaille, flexion } = specific;
    const ccam = parseInt(degres) > 10 ? "NFKA008" : "NFKA007";

    if (selectedDocs.includes("CRO")) {
      docs["CRO"] = await buildCRO({
        nom: nomUp, prenom, ddn, dateEntree: dateOp, dateOp, aides,
        indication: `Arthroplastie totale de genou ${cote} dans le cadre d'une ${ind} avec déformation en ${deformation} de ${degres}°.`,
        ccam,
        implants: `Fémur ACS taille ${femTaille} / Plateau ACS taille ${platTaille} / Insert ${insTaille} mm / Bouton rotulien taille ${rotTaille}`,
        tempsOp: [
          "Installation en décubitus dorsal.", "Badigeon et champage stérile.",
          "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.", "Check-list.", "",
          "Voie d'abord médiale para-patellaire.", "Hémostases sous cutanées.",
          "Arthrotomie médiale para-patellaire.", "Éversion de la rotule.",
          "Résection des ostéophytes périphériques.", "Résection du corps adipeux de Hoffa.",
          "Résection du pivot central.", "",
          "##Coupe tibiale première :",
          "Mise en place du guide tibial extra-médullaire.",
          "Résection tibiale proximale selon la planification pré-opératoire.",
          "Contrôle de l'espace grâce à l'hémi-espaceur.", "",
          "##Temps fémoral :",
          "Mise en place du guide fémoral intra-médullaire.",
          "Résection fémorale distale selon la planification pré-opératoire.",
          "Résection fémorale antérieure, postérieure et chanfreins.",
          `Mise en place d'un fémur trial taille ${femTaille}.`, "",
          "Ouverture de l'espace en flexion à l'aide du Mehary en prenant soin de protéger la coupe tibiale avec la faux.",
          "Ablation des ostéophytes postérieurs à l'aide du ciseau courbe.",
          "Ablation des ménisques en prenant soin de respecter les différents éléments tendino-ligamentaires.", "",
          "##Temps tibial :",
          `Mise en place d'un plateau tibial d'essai taille ${platTaille}.`,
          "Réalisation de l'empreinte tibiale au ciseau/ailettes.",
          `Essai avec PE de ${insTaille} mm.`, "",
          "Resurfaçage patellaire grâce à l'ancillaire adapté.",
          "Course rotulienne satisfaisante. No thumb test positif.", "",
          "##Bilan ligamentaire :",
          "Balance ligamentaire satisfaisante en flexion et en extension.",
          `Axe mécanique corrigé. Flexion à ${flexion}° et extension complète.`, "",
          `Cimentation du plateau tibial ACS taille ${platTaille} avec insert ${insTaille} mm.`,
          `Cimentation du fémur ACS taille ${femTaille}.`,
          `Cimentation du bouton rotulien taille ${rotTaille}.`,
          "Nettoyage abondant au sérum physiologique.",
          "Fermeture du plan capsulo-synovial au Vicryl 2 + Stratafix.",
          "Fermeture du plan sous-cutané au Vicryl 0.",
          "Agrafes à la peau. Pansement Aquacel Duoderm.",
        ]
      });
    }

    if (selectedDocs.includes("CRH")) {
      docs["CRH"] = await buildCRH({
        nom: nomUp, prenom, ddn, dateEntree: dateOp, dateSortie: "[DATE SORTIE]",
        dateLettre: dateOp, medecinTraitant: mt,
        paragraphes: [
          { type: "mixed", after: 120, runs: [
            tx("Votre patient(e) "), tx(`${civ} ${nomUp} ${prenom}`, { bold: true }),
            tx(`, ${age} ans, a été hospitalisé(e) dans notre service du ${dateOp} au [DATE SORTIE] pour la réalisation de son arthroplastie totale de genou ${cote} sur ${ind} avec déformation en ${deformation} de ${degres}°.`),
          ]},
          ...(atcd ? [{ texte: atcd, after: 120 }] : []),
          { texte: `L'intervention s'est parfaitement déroulée au bloc opératoire le ${dateOp} sous anesthésie [TYPE]. Les radiographies de contrôle post-opératoire sont satisfaisantes.`, after: 120 },
          { texte: "Au cours de son hospitalisation, le patient a pu bénéficier de kinésithérapie et reprendre la marche sans difficulté.", after: 120 },
          { texte: "Les suites ont été simples par ailleurs, la sortie du patient est donc autorisée ce jour sous couvert des consignes suivantes :", after: 60 },
          { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE à domicile, protocole AQUACEL + DUODERM" },
          { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
          { type: "consigne", texte: "Kinésithérapie intensive selon le protocole remis au patient" },
          { type: "consigne", texte: "Appui complet autorisé d'emblée avec 2 cannes anglaises" },
          { type: "consigne", texte: "Antalgiques selon ordonnance" },
          { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant, pendant 35 jours" },
          { texte: `Pour ma part, je le reverrai en consultation de contrôle radio-clinique dans 6 semaines avec radiographies du genou ${cote} de face et profil en charge et pangonogramme.`, after: 200 },
          { texte: "Bien cordialement.", after: 300 },
        ]
      });
    }

    if (selectedDocs.includes("Ordonnance pharma")) docs["Ordonnance pharma"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["**Matériel de soins :", "AQUACEL Extra — 1 boîte", "DUODERM Extra Thin — 1 boîte", "Compresses stériles 10 cm x 10 cm — 1 boîte de 100", "BISEPTINE — 1 flacon", "Sérum physiologique — 1 boîte de 30 dosettes", "Set à pansement stérile — 1 boîte", "", "**Analgésie systématique (horaires fixes, 7 premiers jours) :", "", "PARACÉTAMOL 1g — 1 cp toutes les 6h — QSP 30 jours", "", "IBUPROFÈNE 400mg — 1 cp matin, midi et soir au cours des repas — QSP 10 jours", "", "OMÉPRAZOLE 20mg — 1 gél. le matin — QSP 10 jours", "", "**Si douleurs insuffisamment contrôlées (hors sujet âgé > 70 ans) :", "", "ACUPAN 30mg (néfopam) — 1 cp matin, midi et soir — QSP 10 jours", "(Contre-indiqué si glaucome, HBP, pathologie cardiaque, insuffisance rénale)", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection sous-cutanée par jour pendant 35 jours"]);
    if (selectedDocs.includes("Ordonnance IDE")) docs["Ordonnance IDE"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["Merci de bien vouloir réaliser des soins de pansements à domicile toutes les 4 jours, dimanches et jours fériés inclus, jusqu'à cicatrisation complète.", "", "Les agrafes sont à retirer au 15e jour post-opératoire.", "", "Une injection sous-cutanée d'INNOHEP 4500 UI/jour doit être réalisée tous les jours, dimanches et jours fériés inclus, pendant 35 jours.", "", "Une numération plaquettaire 1 fois par semaine doit être réalisée, les résultats seront à envoyer au médecin traitant du patient, pendant 35 jours."], `Ordonnance IDE après Arthroplastie Totale de Genou ${cote}`);
    if (selectedDocs.includes("Ordonnance kiné")) docs["Ordonnance kiné"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["**KINÉSITHÉRAPIE — post-PTG " + cote, "Appui complet autorisé d'emblée — URGENT", "", "Je laisse le soin à mon confrère kinésithérapeute de décider du nombre et de la fréquence des séances. Rééducation intensive recommandée.", "", "⚠ PRIORITÉ ABSOLUE : extension complète à 0° — NE PAS LAISSER S'INSTALLER UN FLESSUM", "(talon dans le vide, jamais de coussin sous le genou)", "", "##Phase 1 — J0 à J15 :", "Cryothérapie systématique après chaque séance", "Mobilisation en extension → objectif 0° dès J3-J5", "Mobilisation en flexion progressive → objectif 70° à J10, 80° à J15", "Renforcement isométrique quadriceps", "Marche avec 2 cannes, travail escaliers", "⚠ Si flexion < 90° à 6 semaines : me contacter", "", "##Phase 2 — J15 à 6 semaines :", "Flexion progressive → objectif 90° à S3, 110° à S6", "Vélo stationnaire dès flexion > 90°", "Renforcement quadriceps en chaîne fermée", "", "##Phase 3 — 6 semaines à 3 mois :", "Objectif flexion > 120°", "Renforcement musculaire progressif", "Endurance : marche, vélo, natation", "Reprise activité légère à 3 mois"]);
    if (selectedDocs.includes("Ordonnance matériel")) docs["Ordonnance matériel"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["**Matériel de rééducation et aide à la mobilité :", "", "2 Cannes anglaises réglables — 1 paire", "", "Attelle de cryothérapie (type Cryo Cuff genou ou équivalent) — 1", "(Application 3 fois par jour, 20 minutes, genou surélevé)", "", `Bas de contention classe II (20-36 mmHg) — Jambe ${cote} — QSP 3 mois`]);
  }

  if (intervention === "LCA") {
    const { ressaut, atcd, diamTibia, diamFemur, visTibia, visFemur,
            cbRM, cbRL, cbSM, cbSL, cbRamp, cartilage } = specific;
    const menisques = [];
    if (cbRM) menisques.push("régularisation méniscale médiale");
    if (cbRL) menisques.push("régularisation méniscale latérale");
    if (cbSM) menisques.push("suture méniscale médiale");
    if (cbSL) menisques.push("suture méniscale latérale");
    if (cbRamp) menisques.push("ramp lésion");
    const hasSuture = cbSM || cbSL;
    const menisqueLines = menisques.length ? [`Gestes associés : ${menisques.join(", ")}.`] : [];

    if (selectedDocs.includes("CRO")) {
      docs["CRO"] = await buildCRO({
        nom: nomUp, prenom, ddn, dateEntree: "", dateOp, aides,
        indication: `Reconstruction du ligament croisé antérieur du genou ${cote} par technique DT3+2. Ressaut rotatoire ${ressaut} en pré-opératoire.`,
        ccam: "NFMC003",
        tempsOp: [
          "Installation en décubitus dorsal, genou fléchi à 90°.", "Badigeon et champage stérile.",
          "Antibioprophylaxie pré-opératoire selon le protocole du CLIN.", "Check-list.", "",
          "##Prélèvement du greffon :",
          "Incision verticale en regard de la patte d'oie.",
          "Prélèvement du demi-tendineux et du droit interne au stripper atraumatique après ablation des vinculas.",
          "Les ischio-jambiers sont laissés pédiculés au tibia, enroulés dans une compresse imbibée de Vancomycine et réintroduits dans leur gaine pendant la durée du temps arthroscopique.", "",
          "Gonflage du garrot pneumatique à la racine du membre à 300 mmHg.", "",
          "##Temps arthroscopique :",
          "Voie d'abord optique antéro-latérale puis antéro-médiale à l'aiguille sous contrôle arthroscopique.",
          "Exploration systématique du genou :",
          `- Compartiment fémoro-patellaire : ${cartilage || "RAS"}`,
          "- Compartiment médial : RAS", "- Compartiment latéral : RAS",
          "- Échancrure : LCA rompu / LCP intact.",
          "Section du ligament suspenseur du Hoffa et ablation du reliquat de LCA en prenant soin de préserver son pied au niveau de son insertion tibiale.",
          ...menisqueLines, "",
          "##Temps tibial :",
          "Réalisation du tunnel tibial à l'aide du guide adapté orienté à 55°.",
          "Mise en place de la broche puis tunnelisation tibiale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.",
          "Nettoyage du tunnel au shaver.", "",
          "##Temps fémoral :",
          "Contre-abord centimétrique 1 cm proximal et postérieur à l'épicondyle latéral.",
          "Ouverture du fascia lata.",
          "Réalisation du tunnel fémoral outside-in à l'aide du guide adapté orienté à 55°.",
          "Mise en place de la broche puis tunnelisation fémorale initiale à la mèche de 9 mm après confirmation du positionnement sous arthroscopie.",
          "Nettoyage du tunnel au shaver.", "",
          "##Préparation du greffon :",
          "On détermine la longueur du greffon à l'aide du tigerstick passé dans les tunnels.",
          "Faufilage au XBRAID pour préparation du greffon selon technique DT3+2.",
          `Calibrage définitif à ${diamTibia} mm au tibia et ${diamFemur} mm au fémur.`, "",
          "On monte le greffon sous arthroscopie à l'aide de fils relais.",
          "Cyclage du genou.",
          `Fixation au fémur par vis d'interférence ${visFemur}.`,
          `Fixation tibiale par vis d'interférence ${visTibia} à 30° de flexion.`, "",
          "##Retour externe :",
          "Abord tibial postérieur au tubercule de Gerdy.",
          "Réalisation d'un passage reliant le tunnel fémoral et la partie postérieure du Gerdy en passant sous le fascia lata.",
          "Réalisation d'un tunnel de diamètre 6 mm orienté vers la patte d'oie.",
          "À l'aide de fils relais, passage du retour externe dans le tunnel et fixation au tibia par endobouton RT en extension et rotation neutre.", "",
          "Test de Lachman négatif. Tiroir antérieur négatif.",
          "Isométrie satisfaisante en fin d'intervention.", "",
          "Fermeture des plans sous-cutanés au Vicryl 2-0.",
          "Fermeture plan cutané au Vicryl 3-0 rapide. Pansement sec.",
        ]
      });
    }

    if (selectedDocs.includes("CRH")) {
      docs["CRH"] = await buildCRH({
        nom: nomUp, prenom, ddn, dateEntree: "", dateSortie: "",
        dateLettre: dateOp, medecinTraitant: mt,
        paragraphes: [
          { type: "mixed", after: 120, runs: [
            tx("Votre patient(e) "), tx(`${civ} ${nomUp} ${prenom}`, { bold: true }),
            tx(`, ${age} ans, a été pris(e) en charge en ambulatoire dans notre service le ${dateOp} pour la reconstruction du ligament croisé antérieur du genou ${cote} par technique DT3+2.`),
          ]},
          ...(atcd ? [{ texte: atcd, after: 120 }] : []),
          { texte: `L'intervention s'est parfaitement déroulée sous anesthésie [TYPE].`, after: 60 },
          ...(menisques.length ? [{ texte: `Un geste associé a été réalisé : ${menisques.join(", ")}.`, after: 120 }] : []),
          { texte: "Les suites ont été simples, la sortie du patient est donc autorisée le jour même sous couvert des consignes suivantes :", after: 60 },
          { type: "consigne", texte: `Appui complet autorisé d'emblée avec 2 cannes anglaises${hasSuture ? " (appui protégé 1 mois en raison de la suture méniscale)" : ""}` },
          { type: "consigne", texte: "Soins de pansements toutes les 48h par IDE à domicile" },
          { type: "consigne", texte: "Ablation des agrafes à J15 post-opératoire" },
          { type: "consigne", texte: "Kinésithérapie en urgence selon le protocole DT3+2 remis au patient" },
          { type: "consigne", texte: "Antalgiques selon ordonnance" },
          { type: "consigne", texte: "Anticoagulation préventive par INNOHEP 4500 UI 1 inj. SC par jour pendant 21 jours avec contrôle plaquettaire hebdomadaire dont les résultats sont à transmettre au médecin traitant" },
          { texte: "Pour ma part, je le reverrai en consultation de contrôle dans 4 semaines.", after: 200 },
          { texte: "Bien cordialement.", after: 300 },
        ]
      });
    }

    if (selectedDocs.includes("Ordonnance pharma")) docs["Ordonnance pharma"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["**Matériel IDE :", "BISEPTINE — 1 flacon", "Sérum physiologique — 1 boîte de 30 dosettes", "Compresses stériles 10 cm x 10 cm — 1 boîte de 100", "COSMOPORE (moyen) — 1 boîte", "", "**Analgésie systématique les 7 premiers jours, poursuivre si douleurs jusqu'à 1 mois :", "", "PARACÉTAMOL 1g — 4x/j — QSP 30 jours", "", "APRANAX 550mg — 1 cp matin + 1 cp après-midi — QSP 5 jours", "OMÉPRAZOLE 20mg — 1 gél. le matin — QSP 5 jours", "(Si indisponibilité APRANAX : BIPROFÉNID LP 100mg 1 cp matin + 1 cp après-midi)", "", "**Si douleurs insuffisamment contrôlées :", "", "ACUPAN 30mg (néfopam) — 1 cp matin, midi et soir — QSP 10 jours", "", "**Anticoagulation :", "", "INNOHEP 4500 UI/j — 1 injection sous-cutanée pendant 21 jours"]);
    if (selectedDocs.includes("Ordonnance IDE")) docs["Ordonnance IDE"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["Merci de bien vouloir réaliser des soins de pansements à domicile toutes les 48 heures, dimanches et jours fériés inclus, jusqu'à cicatrisation complète.", "", "Les fils ou agrafes sont à retirer au 15e jour post-opératoire. (En cas de surjet intradermique, ne retirer que la boucle à l'extrémité de la cicatrice)", "", "Une injection sous-cutanée d'INNOHEP 4500 UI/jour doit être réalisée tous les jours, dimanches et jours fériés inclus, pendant 21 jours.", "", "Une numération plaquettaire 1 fois par semaine doit être réalisée, les résultats seront à envoyer au médecin traitant du patient, pendant 21 jours."], `Ordonnance IDE après Reconstruction du LCA ${cote}`);
    if (selectedDocs.includes("Ordonnance kiné")) docs["Ordonnance kiné"] = await buildOrdo(nomUp, prenom, ddn, dateOp, [`**Kinésithérapie après reconstruction du LCA ${cote} selon la technique du DT3+2`, "URGENT", "", "Je laisse le soin à mon confrère kinésithérapeute de décider du nombre et de la fréquence des séances. Rééducation au cabinet conseillée.", "", `##Semaine 1 → Semaine 3 :`, "Verrouillage actif en extension + flexion 60°", "Travail en chaîne fermée — Recurvatum interdit", `Appui complet autorisé${hasSuture ? " (avec 2 cannes 1 mois si suture méniscale associée)" : ""}`, "Objectif à 1 mois : pas de flessum", "", "##Semaine 3 → 2e mois :", "Flexion 120° + pas de flessum 0°", "Travail en chaîne fermée — Vélo sans résistance", "", "##2e mois → 4e mois :", "Proprioception + renforcement musculaire", "Reprise progressive marche, vélo, natation, course terrain plat", "", "Test isocinétique au 4e mois", "", "##4e mois → 6e mois :", "Réathlétisation — renforcement en chaîne ouverte", "CI sport pivot/contact", "", "##6e mois → 9e mois :", "Reprise progressive entraînement sport/pivot dès M7", "Pas de compétition", "", "##9e mois → 12e mois :", "Reprise compétition (temps partiel puis complet vers 1 an)"]);
    if (selectedDocs.includes("Ordonnance matériel")) docs["Ordonnance matériel"] = await buildOrdo(nomUp, prenom, ddn, dateOp, ["**Matériel de rééducation :", "", "2 Cannes anglaises réglables — 1 paire", "", "Attelle de cryothérapie (type Cryo Cuff genou ou équivalent) — 1", "(Application 3 fois par jour, 20 minutes, genou surélevé)"]);
  }

  return docs;
}

// ─── MAIN APP COMPONENT ───────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home");
  const [intervention, setIntervention] = useState("");
  const [formData, setFormData] = useState({});
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [selectedSecs, setSelectedSecs] = useState(new Set());
  const [generatedDocs, setGeneratedDocs] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const setField = (key, val) => setFormData(f => ({ ...f, [key]: val }));
  const today = new Date().toISOString().split("T")[0];

  const fmtDate = (s) => {
    if (!s) return "[DATE]";
    const [y, m, d] = s.split("-");
    return `${d}/${m}/${y}`;
  };

  function goIntervention(id) {
    setIntervention(id);
    setFormData({ date: today, civilite: "Monsieur", cote: "droit" });
    setSelectedDocs(new Set(DOCS_CONFIG[id]));
    setSelectedSecs(new Set());
    setScreen("form");
  }

  function toggleDoc(doc) {
    setSelectedDocs(s => {
      const n = new Set(s);
      n.has(doc) ? n.delete(doc) : n.add(doc);
      return n;
    });
  }

  function toggleSec(id) {
    setSelectedSecs(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  async function handleGenerate() {
    setGenerating(true);
    setSendStatus(null);
    setScreen("docs");
    const fd = {
      nom: formData.nom?.toUpperCase() || "[NOM]",
      prenom: formData.prenom || "[PRÉNOM]",
      ddn: fmtDate(formData.ddn),
      age: formData.age || "[ÂGE]",
      dateOp: fmtDate(formData.date),
      civ: formData.civilite || "Monsieur",
      cote: formData.cote || "droit",
      aides: formData.aides || "[AIDES]",
      mt: formData.mt || "[MÉDECIN TRAITANT]",
      // PTH
      ind: formData.indication || "[INDICATION]",
      atcd: formData.atcd || "",
      cotTaille: formData.cotTaille || "[X]",
      cotModele: formData.cotModele || "Ecofit",
      tigTaille: formData.tigTaille || "[X]",
      tigModele: formData.tigModele || "Ecofit",
      tigeType: formData.tigeType || "Standard",
      col: formData.col || "court",
      tete: formData.tete || "28",
      tetem: formData.tetem || "inox",
      rape: formData.rape || "[X]",
      infiltr: formData.infiltr || "Non",
      // PTG
      deformation: formData.deformation || "varus",
      degres: formData.degres || "0",
      femTaille: formData.femTaille || "[X]",
      platTaille: formData.platTaille || "[X]",
      insTaille: formData.insTaille || "[X]",
      rotTaille: formData.rotTaille || "[X]",
      flexion: formData.flexion || "[X]",
      // LCA
      ressaut: formData.ressaut || "absent",
      diamTibia: formData.diamTibia || "[X]",
      diamFemur: formData.diamFemur || "[X]",
      visTibia: formData.visTibia || "[X]",
      visFemur: formData.visFemur || "[X]",
      cbRM: formData.cbRM || false,
      cbRL: formData.cbRL || false,
      cbSM: formData.cbSM || false,
      cbSL: formData.cbSL || false,
      cbRamp: formData.cbRamp || false,
      cartilage: formData.cartilage || "",
    };

    try {
      const docs = await generateAllDocs(intervention, fd, [...selectedDocs]);
      // Convert to base64 for download
      const docsB64 = {};
      for (const [name, doc] of Object.entries(docs)) {
        const buf = await Packer.toBuffer(doc);
        const b64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
        docsB64[name] = b64;
      }
      setGeneratedDocs(docsB64);
      setActiveTab(Object.keys(docsB64)[0] || "");
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  }

  function downloadDoc(name) {
    const b64 = generatedDocs[name];
    if (!b64) return;
    const bin = atob(b64);
    const buf = new ArrayBuffer(bin.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const nom = formData.nom?.toUpperCase() || "PATIENT";
    const dateOp = fmtDate(formData.date);
    a.download = `${intervention}_${nom}_${name.replace(/ /g, "_")}_${dateOp}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    Object.keys(generatedDocs).forEach((name, i) => {
      setTimeout(() => downloadDoc(name), i * 300);
    });
  }

  const nom = formData.nom?.toUpperCase() || "";
  const prenom = formData.prenom || "";
  const dateOp = fmtDate(formData.date);

  // ── STYLES ──
  const s = {
    app: { maxWidth: 700, margin: "0 auto", padding: "1rem", fontFamily: "var(--font-sans)" },
    card: { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem", marginBottom: "1rem" },
    sectionTitle: { fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 },
    field: { marginBottom: 12 },
    label: { display: "block", fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 4 },
    toggleGroup: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 },
    header: { marginBottom: "1.5rem" },
    h1: { fontSize: 18, fontWeight: 500, color: "var(--color-text-primary)" },
    sub: { fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 },
    backBtn: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-secondary)", cursor: "pointer", marginBottom: "1rem", border: "none", background: "none", padding: 0 },
    intGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: "1.5rem" },
    intCard: (avail) => ({ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", padding: "1rem", cursor: avail ? "pointer" : "not-allowed", opacity: avail ? 1 : 0.4 }),
    actions: { display: "flex", gap: 10, marginTop: "1.5rem", flexWrap: "wrap" },
    btn: { padding: "10px 18px", borderRadius: "var(--border-radius-md)", fontSize: 14, fontWeight: 500, cursor: "pointer", border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)" },
    btnPrimary: { background: "var(--color-background-info)", borderColor: "var(--color-border-info)", color: "var(--color-text-info)" },
    btnSuccess: { background: "var(--color-background-success)", borderColor: "var(--color-border-success)", color: "var(--color-text-success)" },
    btnSm: { padding: "6px 12px", fontSize: 13 },
    togBtn: (on) => ({ padding: "6px 14px", border: `0.5px solid ${on ? "var(--color-border-info)" : "var(--color-border-secondary)"}`, borderRadius: "var(--border-radius-md)", background: on ? "var(--color-background-info)" : "var(--color-background-primary)", fontSize: 13, cursor: "pointer", color: on ? "var(--color-text-info)" : "var(--color-text-primary)" }),
    docTab: (on) => ({ padding: "5px 12px", border: `0.5px solid ${on ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`, borderRadius: "var(--border-radius-md)", fontSize: 13, cursor: "pointer", background: on ? "var(--color-background-primary)" : "var(--color-background-secondary)", color: on ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: on ? 500 : 400 }),
    secCard: (on) => ({ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", border: on ? "2px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)", cursor: "pointer", background: on ? "var(--color-background-info)" : "var(--color-background-primary)" }),
    secAvatar: { width: 36, height: 36, borderRadius: "50%", background: "var(--color-background-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", flexShrink: 0 },
    cbItem: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-primary)", cursor: "pointer" },
    docCheckRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 },
    docCheck: (on) => ({ padding: "5px 12px", border: `0.5px solid ${on ? "var(--color-border-success)" : "var(--color-border-tertiary)"}`, borderRadius: "var(--border-radius-md)", fontSize: 13, cursor: "pointer", background: on ? "var(--color-background-success)" : "var(--color-background-secondary)", color: on ? "var(--color-text-success)" : "var(--color-text-secondary)" }),
  };

  const T = (k) => (v) => setField(k, v);

  // ── SPECIFIC FIELDS ──
  const SpecificFields = () => {
    if (intervention === "PTH") return (
      <div>
        <div style={s.field}><label style={s.label}>Indication</label><input value={formData.indication || ""} onChange={e => setField("indication", e.target.value)} placeholder="ex: coxarthrose primitive" /></div>
        <div style={s.field}><label style={s.label}>Antécédents pertinents (optionnel)</label><input value={formData.atcd || ""} onChange={e => setField("atcd", e.target.value)} placeholder="laisser vide si aucun" /></div>
        <div style={s.row3}>
          <div style={s.field}><label style={s.label}>Taille cotyle</label><input type="number" value={formData.cotTaille || ""} onChange={e => setField("cotTaille", e.target.value)} placeholder="ex: 52" /></div>
          <div style={s.field}><label style={s.label}>Modèle cotyle</label><input value={formData.cotModele || ""} onChange={e => setField("cotModele", e.target.value)} placeholder="ex: Ecofit" /></div>
          <div style={s.field}><label style={s.label}>Râpe taille</label><input type="number" value={formData.rape || ""} onChange={e => setField("rape", e.target.value)} placeholder="ex: 7" /></div>
        </div>
        <div style={s.row3}>
          <div style={s.field}><label style={s.label}>Taille tige</label><input type="number" value={formData.tigTaille || ""} onChange={e => setField("tigTaille", e.target.value)} placeholder="ex: 7" /></div>
          <div style={s.field}><label style={s.label}>Modèle tige</label><input value={formData.tigModele || ""} onChange={e => setField("tigModele", e.target.value)} placeholder="ex: Ecofit" /></div>
          <div style={s.field}><label style={s.label}>Type</label>
            <div style={s.toggleGroup}>
              {["Standard", "Latéralisée"].map(v => <button key={v} style={s.togBtn(formData.tigeType === v)} onClick={() => setField("tigeType", v)}>{v}</button>)}
            </div>
          </div>
        </div>
        <div style={s.row3}>
          <div style={s.field}><label style={s.label}>Col</label><input value={formData.col || ""} onChange={e => setField("col", e.target.value)} placeholder="ex: court" /></div>
          <div style={s.field}><label style={s.label}>Tête (mm)</label><input type="number" value={formData.tete || ""} onChange={e => setField("tete", e.target.value)} placeholder="ex: 28" /></div>
          <div style={s.field}><label style={s.label}>Matière</label>
            <div style={s.toggleGroup}>
              {["inox", "céramique"].map(v => <button key={v} style={s.togBtn(formData.tetem === v)} onClick={() => setField("tetem", v)}>{v}</button>)}
            </div>
          </div>
        </div>
        <div style={s.field}><label style={s.label}>Infiltration péri-articulaire</label>
          <div style={s.toggleGroup}>
            {["Oui", "Non"].map(v => <button key={v} style={s.togBtn(formData.infiltr === v)} onClick={() => setField("infiltr", v)}>{v}</button>)}
          </div>
        </div>
      </div>
    );

    if (intervention === "PTG") return (
      <div>
        <div style={s.field}><label style={s.label}>Indication</label><input value={formData.indication || ""} onChange={e => setField("indication", e.target.value)} placeholder="ex: gonarthrose tricompartimentaire" /></div>
        <div style={s.field}><label style={s.label}>Antécédents pertinents (optionnel)</label><input value={formData.atcd || ""} onChange={e => setField("atcd", e.target.value)} placeholder="laisser vide si aucun" /></div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Déformation</label>
            <div style={s.toggleGroup}>
              {["varus", "valgus"].map(v => <button key={v} style={s.togBtn(formData.deformation === v)} onClick={() => setField("deformation", v)}>{v}</button>)}
            </div>
          </div>
          <div style={s.field}><label style={s.label}>Degrés</label><input type="number" value={formData.degres || ""} onChange={e => setField("degres", e.target.value)} placeholder="ex: 8" /></div>
        </div>
        <div style={s.row3}>
          <div style={s.field}><label style={s.label}>Fémur ACS</label><input value={formData.femTaille || ""} onChange={e => setField("femTaille", e.target.value)} placeholder="ex: 4" /></div>
          <div style={s.field}><label style={s.label}>Plateau ACS</label><input value={formData.platTaille || ""} onChange={e => setField("platTaille", e.target.value)} placeholder="ex: 3" /></div>
          <div style={s.field}><label style={s.label}>Insert (mm)</label><input type="number" value={formData.insTaille || ""} onChange={e => setField("insTaille", e.target.value)} placeholder="ex: 10" /></div>
        </div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Bouton rotulien</label><input value={formData.rotTaille || ""} onChange={e => setField("rotTaille", e.target.value)} placeholder="ex: 29" /></div>
          <div style={s.field}><label style={s.label}>Flexion obtenue (°)</label><input type="number" value={formData.flexion || ""} onChange={e => setField("flexion", e.target.value)} placeholder="ex: 120" /></div>
        </div>
      </div>
    );

    if (intervention === "LCA") return (
      <div>
        <div style={s.field}><label style={s.label}>Ressaut rotatoire pré-op</label>
          <div style={s.toggleGroup}>
            {["présent", "absent"].map(v => <button key={v} style={s.togBtn(formData.ressaut === v)} onClick={() => setField("ressaut", v)}>{v}</button>)}
          </div>
        </div>
        <div style={s.field}><label style={s.label}>Antécédents pertinents (optionnel)</label><input value={formData.atcd || ""} onChange={e => setField("atcd", e.target.value)} placeholder="laisser vide si aucun" /></div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Diamètre tibial (mm)</label><input type="number" value={formData.diamTibia || ""} onChange={e => setField("diamTibia", e.target.value)} placeholder="ex: 8" /></div>
          <div style={s.field}><label style={s.label}>Diamètre fémoral (mm)</label><input type="number" value={formData.diamFemur || ""} onChange={e => setField("diamFemur", e.target.value)} placeholder="ex: 8" /></div>
        </div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Vis tibiale</label><input value={formData.visTibia || ""} onChange={e => setField("visTibia", e.target.value)} placeholder="ex: 9x25" /></div>
          <div style={s.field}><label style={s.label}>Vis fémorale</label><input value={formData.visFemur || ""} onChange={e => setField("visFemur", e.target.value)} placeholder="ex: 9x25" /></div>
        </div>
        <div style={s.field}>
          <label style={s.label}>Gestes associés</label>
          {[["cbRM","Régularisation méd."],["cbRL","Régularisation lat."],["cbSM","Suture méniscale méd."],["cbSL","Suture méniscale lat."],["cbRamp","Ramp lésion"]].map(([k, l]) => (
            <label key={k} style={{...s.cbItem, marginBottom: 6}}>
              <input type="checkbox" checked={formData[k] || false} onChange={e => setField(k, e.target.checked)} style={{ width: "auto" }} />
              {l}
            </label>
          ))}
        </div>
        <div style={s.field}><label style={s.label}>Lésions cartilagineuses (optionnel)</label><textarea value={formData.cartilage || ""} onChange={e => setField("cartilage", e.target.value)} placeholder="ex: lésion grade III compartiment médial fémoral" style={{ minHeight: 60, resize: "vertical", width: "100%", fontSize: 14 }} /></div>
      </div>
    );
    return null;
  };

  // ── SCREENS ──
  if (screen === "home") return (
    <div style={s.app}>
      <div style={s.header}><h1 style={s.h1}>Bloc chirurgical</h1><p style={s.sub}>Dr Tom ROUSSEL — Traumatologie-Orthopédie, Hôpital Roger Salengro</p></div>
      <div style={s.intGrid}>
        {INTERVENTIONS.map(i => (
          <div key={i.id} style={s.intCard(i.available)} onClick={() => i.available && goIntervention(i.id)}>
            <div style={{ fontSize: 15, fontWeight: 500, color: "var(--color-text-primary)" }}>{i.label}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 3 }}>{i.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "form") return (
    <div style={s.app}>
      <button style={s.backBtn} onClick={() => setScreen("home")}>← Retour</button>
      <div style={s.header}>
        <h1 style={s.h1}>{intervention} — {intervention === "PTH" ? "Prothèse totale de hanche" : intervention === "PTG" ? "Prothèse totale de genou" : "Reconstruction LCA DT3+2"}</h1>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>Patient</div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Nom</label><input value={formData.nom || ""} onChange={e => setField("nom", e.target.value)} placeholder="NOM" /></div>
          <div style={s.field}><label style={s.label}>Prénom</label><input value={formData.prenom || ""} onChange={e => setField("prenom", e.target.value)} placeholder="Prénom" /></div>
        </div>
        <div style={s.row3}>
          <div style={s.field}><label style={s.label}>Date de naissance</label><input type="date" value={formData.ddn || ""} onChange={e => setField("ddn", e.target.value)} /></div>
          <div style={s.field}><label style={s.label}>Âge</label><input type="number" value={formData.age || ""} onChange={e => setField("age", e.target.value)} placeholder="ex: 54" /></div>
          <div style={s.field}><label style={s.label}>Date intervention</label><input type="date" value={formData.date || today} onChange={e => setField("date", e.target.value)} /></div>
        </div>
        <div style={s.row2}>
          <div style={s.field}><label style={s.label}>Civilité</label>
            <div style={s.toggleGroup}>
              {["Monsieur","Madame"].map(v => <button key={v} style={s.togBtn(formData.civilite === v)} onClick={() => setField("civilite", v)}>{v}</button>)}
            </div>
          </div>
          <div style={s.field}><label style={s.label}>Côté</label>
            <div style={s.toggleGroup}>
              {["droit","gauche"].map(v => <button key={v} style={s.togBtn(formData.cote === v)} onClick={() => setField("cote", v)}>{v}</button>)}
            </div>
          </div>
        </div>
        <div style={s.field}><label style={s.label}>Aides opératoires</label><input value={formData.aides || ""} onChange={e => setField("aides", e.target.value)} placeholder="ex: Florian PETELLE – Claire ZIEGLER interne" /></div>
        <div style={s.field}><label style={s.label}>Médecin traitant</label><input value={formData.mt || ""} onChange={e => setField("mt", e.target.value)} placeholder="Dr Nom Prénom" /></div>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>Détails de l'intervention</div>
        <SpecificFields />
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>Documents à générer</div>
        <div style={s.docCheckRow}>
          {(DOCS_CONFIG[intervention] || []).map(doc => (
            <button key={doc} style={s.docCheck(selectedDocs.has(doc))} onClick={() => toggleDoc(doc)}>{doc}</button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{selectedDocs.size} document(s) sélectionné(s)</p>
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>Secrétaires destinataires</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Object.entries(SECRETAIRES).map(([id, sec]) => (
            <div key={id} style={s.secCard(selectedSecs.has(id))} onClick={() => toggleSec(id)}>
              <div style={s.secAvatar}>{sec.initiales}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: selectedSecs.has(id) ? "var(--color-text-info)" : "var(--color-text-primary)" }}>{sec.nom}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{sec.email}</div>
              </div>
            </div>
          ))}
          <div style={{ ...s.secCard(false), opacity: 0.4, cursor: "not-allowed" }}>
            <div style={s.secAvatar}>?</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>Secrétariat ambulatoire</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Email à renseigner</div>
            </div>
          </div>
        </div>
      </div>

      <div style={s.actions}>
        <button style={{ ...s.btn, ...s.btnPrimary }} onClick={handleGenerate} disabled={selectedDocs.size === 0}>
          Générer {selectedDocs.size} document(s)
        </button>
        <button style={s.btn} onClick={() => setScreen("home")}>Annuler</button>
      </div>
    </div>
  );

  if (screen === "docs") return (
    <div style={s.app}>
      <button style={s.backBtn} onClick={() => setScreen("form")}>← Modifier</button>
      <div style={s.header}>
        <h1 style={s.h1}>{intervention} — {nom} {prenom}</h1>
        <p style={s.sub}>{dateOp}</p>
      </div>

      {generating ? (
        <div style={{ ...s.card, textAlign: "center", padding: "2rem" }}>
          <div style={{ display: "inline-block", width: 20, height: 20, border: "2px solid var(--color-border-tertiary)", borderTopColor: "var(--color-text-secondary)", borderRadius: "50%", animation: "spin 0.7s linear infinite", verticalAlign: "middle", marginRight: 8 }} />
          <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Génération des documents Word...</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          <div style={s.card}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {Object.keys(generatedDocs).map(name => (
                <button key={name} style={s.docTab(activeTab === name)} onClick={() => setActiveTab(name)}>{name}</button>
              ))}
            </div>
            {activeTab && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button style={{ ...s.btn, ...s.btnSm, ...s.btnSuccess }} onClick={() => downloadDoc(activeTab)}>
                  ↓ Télécharger {activeTab}
                </button>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Fichier .docx prêt</span>
              </div>
            )}
          </div>

          <div style={s.card}>
            <div style={s.sectionTitle}>Envoi aux secrétaires</div>
            {selectedSecs.size > 0 ? (
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12 }}>
                Destinataires : {[...selectedSecs].map(id => SECRETAIRES[id].nom).join(", ")}
              </p>
            ) : (
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 12 }}>Aucune secrétaire sélectionnée</p>
            )}
            <div style={s.actions}>
              <button style={{ ...s.btn, ...s.btnPrimary }} onClick={downloadAll}>↓ Télécharger tous les documents</button>
              {selectedSecs.size > 0 && (
                <button style={{ ...s.btn, ...s.btnSuccess }} onClick={() => {
                  const emails = [...selectedSecs].map(id => SECRETAIRES[id].email).join(", ");
                  const noms = [...selectedSecs].map(id => SECRETAIRES[id].nom).join(" et ");
                  setSendStatus({ type: "info", msg: `Ouvrez votre client mail et attachez les fichiers téléchargés à l'adresse : ${emails}` });
                }}>Envoyer par mail</button>
              )}
              <button style={s.btn} onClick={() => setScreen("home")}>Nouveau dossier</button>
            </div>
            {sendStatus && (
              <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: "var(--border-radius-md)", fontSize: 13,
                background: "var(--color-background-info)", color: "var(--color-text-info)" }}>
                {sendStatus.msg}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return null;
}
