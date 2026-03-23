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
  PTH: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kine","Ordonnance materiel"],
  PTG: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kine","Ordonnance materiel"],
  LCA: ["CRO","CRH","Ordonnance pharma","Ordonnance IDE","Ordonnance kine","Ordonnance materiel"],
};

const DOCS_LABELS = {
  "Ordonnance kine": "Ordonnance kin\u00e9",
  "Ordonnance materiel": "Ordonnance mat\u00e9riel",
};
const dl = (k) => DOCS_LABELS[k] || k;

// ─── DOCX HELPERS ─────────────────────────────────────────────
function b64ToArr(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}
function nb() { return { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }; }
function anb() {
  return { top: nb(), bottom: nb(), left: nb(), right: nb(),
           insideHorizontal: nb(), insideVertical: nb() };
}
function tx(t, o = {}) {
  return new TextRun({
    text: t, font: "Arial", size: o.size ?? 20,
    bold: o.bold ?? false, italics: o.italics ?? false,
    underline: o.underline ? { type: UnderlineType.SINGLE } : undefined,
    color: o.color ?? "000000",
  });
}
function pp(r, o = {}) {
  return new Paragraph({
    alignment: o.align ?? AlignmentType.LEFT,
    spacing: { after: o.after ?? 0, before: o.before ?? 0 },
    children: Array.isArray(r) ? r : [r],
  });
}
function pj(t, o = {}) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: o.after ?? 60, before: o.before ?? 0 },
    children: [tx(t, o)],
  });
}
function ep(a = 80) { return pp(tx(""), { after: a }); }

function mkHeader() {
  const logo = b64ToArr(LOGO_B64);
  return new Header({
    children: [
      new Table({
        width: { size: 9204, type: WidthType.DXA },
        columnWidths: [4602, 4602],
        borders: anb(),
        rows: [new TableRow({ children: [
          new TableCell({
            borders: anb(), width: { size: 4602, type: WidthType.DXA },
            children: [new Paragraph({
              alignment: AlignmentType.CENTER, spacing: { after: 0 },
              children: [new ImageRun({ data: logo, transformation: { width: 80, height: 49 }, type: "png" })],
            })],
          }),
          new TableCell({
            borders: anb(), width: { size: 4602, type: WidthType.DXA },
            children: [
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 10 }, children: [tx("N\u00b0 FINESS", { size: 14, color: "444444" })] }),
              new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 0 }, children: [tx("590796975", { size: 16, bold: true })] }),
            ],
          }),
        ]})]
      })
    ]
  });
}

function mkFooter() {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER, spacing: { before: 200 },
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } },
      children: [tx("Rue du Professeur Emile Laine \u2013 59037 Lille Cedex     www.chru-lille.fr", { size: 16 })],
    })]
  });
}

function svcLeft(before = 0) {
  const I = 120;
  return [
    pp([tx("Pr C. CHANTELOT", { size: 18, bold: true, italics: true })], { after: 0, before }),
    pp([tx("Chef de Service", { size: 18, italics: true })], { after: I }),
    pp([tx("Praticien Hospitalier", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Dr Marion HALBAUT", { size: 18 })], { after: I }),
    pp([tx("Chefs de clinique", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Dr N\u00e9omie ALLIO", { size: 18 })], { after: 0 }),
    pp([tx("Dr Allison FITOUSSI", { size: 18 })], { after: 0 }),
    pp([tx("Dr Tom ROUSSEL", { size: 18 })], { after: I }),
    pp([tx("Cadres de Sant\u00e9", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Mme WALLART (5\u00e8me SUD)", { size: 18 })], { after: 0 }),
    pp([tx("\u260e 03 20 44 66 02", { size: 18 })], { after: I }),
    pp([tx("Secr\u00e9tariat hospitalisation", { size: 18, bold: true })], { after: 0 }),
    pp([tx("\u260e 03 20 44 68 21", { size: 18 })], { after: 0 }),
    pp([tx("\u2709 03 20 44 68 99", { size: 18 })], { after: I }),
    pp([tx("Assistante Sociale", { size: 18, bold: true })], { after: 0 }),
    pp([tx("Mlle Val\u00e9rie DINOIRD", { size: 18 })], { after: 0 }),
    pp([tx("\u260e 03 20 44 62 16", { size: 18 })], { after: 0 }),
  ];
}

function refBlk(nom, prenom, ddn, de, ds) {
  const l = [
    pp([tx("HOPITAL ROGER SALENGRO", { size: 18, bold: true })], { after: 0 }),
    pp([tx("P\u00f4le de l'Appareil locomoteur", { size: 18 })], { after: 0 }),
    pp([tx("Orthop\u00e9die et Traumatologie", { size: 18 })], { after: 40 }),
    pp([tx("R\u00e9f. : CW /", { size: 18 })], { after: 0 }),
    pp([tx(nom + " " + prenom, { size: 18 })], { after: 0 }),
    pp([tx("N\u00e9(e) le " + ddn, { size: 18 })], { after: 0 }),
  ];
  if (de) {
    const hospText = ds
      ? "Hospitalisation du " + de + " au " + ds
      : "Hospitalisation du : " + de + " au";
    l.push(pp([tx(hospText, { size: 18 })], { after: 0 }));
  }
  return l;
}

function patR(nom, prenom) {
  return [ep(80), pp([tx(nom + " " + prenom, { size: 20, bold: true })], { after: 40 }), ep(40), ep(40)];
}

function topTbl(nom, prenom, ddn, de, ds) {
  return new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [4500, 4704], borders: anb(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: anb(), width: { size: 4500, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: refBlk(nom, prenom, ddn, de, ds) }),
      new TableCell({ borders: anb(), width: { size: 4704, type: WidthType.DXA },
        margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: patR(nom, prenom) }),
    ]})]
  });
}

function twoCol(right, slB = 0) {
  return new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [2800, 6404], borders: anb(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: anb(), width: { size: 2800, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: svcLeft(slB) }),
      new TableCell({ borders: anb(), width: { size: 6404, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: right }),
    ]})]
  });
}

const SP = { sections: [{ properties: { page: {
  size: { width: 11906, height: 16838 },
  margin: { top: 851, right: 720, bottom: 567, left: 720, header: 426, footer: 342 }
}}}]};

function parseLine(l) {
  if (l === "") return ep(80);
  if (l.startsWith("##")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true, underline: true })], { after: 60 });
  if (l.startsWith("**")) return pp([tx(l.slice(2).trim(), { size: 20, bold: true })], { after: 60 });
  return pj(l, { after: 60 });
}

async function mkOrdo(nom, prenom, ddn, dateOp, lines, titre) {
  titre = titre || "ORDONNANCE";
  const h = mkHeader();
  const f = mkFooter();

  const patientCell = new TableCell({
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "AAAAAA" },
    },
    width: { size: 4500, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 120, right: 120 },
    children: [
      pp([tx(nom + " " + prenom + (ddn ? " - n\u00e9(e) le " + ddn : ""), { size: 18 })], { after: 200 }),
      ep(80),
    ],
  });

  const topRight = new TableCell({
    borders: anb(), width: { size: 4604, type: WidthType.DXA },
    margins: { top: 0, bottom: 0, left: 200, right: 0 },
    children: [
      new Table({ width: { size: 4500, type: WidthType.DXA }, columnWidths: [4500],
        rows: [new TableRow({ children: [patientCell] })] }),
      ep(40),
      pp([tx("Poids :", { size: 18, italics: true })], { after: 0 }),
    ],
  });

  const topLeft = new TableCell({
    borders: anb(), width: { size: 4600, type: WidthType.DXA },
    margins: { top: 0, bottom: 0, left: 0, right: 200 },
    children: [
      pp([tx("HOPITAL ROGER SALENGRO", { size: 18 })], { after: 20 }),
      pp([tx("P\u00f4le des Neurosciences et de l'Appareil Locomoteur", { size: 16 })], { after: 20 }),
      pp([tx("ORTHOPEDIE - TRAUMATOLOGIE", { size: 18, bold: true })], { after: 80 }),
      pp([tx("Service de Traumatologie", { size: 20, bold: true })], { after: 0 }),
    ],
  });

  const topT = new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [4600, 4604], borders: anb(),
    rows: [new TableRow({ children: [topLeft, topRight] })],
  });

  const titleP = new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { before: 400, after: 400 },
    children: [tx(titre, { size: 36, bold: true })],
  });

  const dateP = new Paragraph({
    alignment: AlignmentType.RIGHT, spacing: { after: 200 },
    children: [tx("Lille, le " + dateOp, { size: 20 })],
  });

  const I = 120;
  const leftP = [
    ep(200),
    pp([tx("\u25a1 Pr Christophe CHANTELOT", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Chef de Service", { size: 18 })], { after: 0 }),
    pp([tx("10003798971", { size: 18 })], { after: I }),
    pp([tx("\u25a1 Dr Marion HALBAUT", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Praticien Hospitalier", { size: 18 })], { after: 0 }),
    pp([tx("10102005708", { size: 18 })], { after: I }),
    pp([tx("\u25a1 Dr Allison FITOUSSI", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Cheffe de Clinique", { size: 18 })], { after: 0 }),
    pp([tx("10101538402", { size: 18 })], { after: I }),
    pp([tx("\u25a1 Dr N\u00e9omie ALLIO", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Docteur Junior", { size: 18 })], { after: 0 }),
    pp([tx("10102200101", { size: 18 })], { after: I }),
    pp([tx("\u25a1 Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }),
    pp([tx("Docteur Junior", { size: 18 })], { after: 0 }),
    pp([tx("10102203147", { size: 18 })], { after: 0 }),
  ];

  const rightP = [dateP, ...lines.map(parseLine), ep(200)];

  const mainT = new Table({
    width: { size: 9204, type: WidthType.DXA }, columnWidths: [3200, 6004], borders: anb(),
    rows: [new TableRow({ children: [
      new TableCell({ borders: anb(), width: { size: 3200, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 0, right: 200 },
        children: leftP }),
      new TableCell({ borders: anb(), width: { size: 6004, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP, margins: { top: 0, bottom: 0, left: 200, right: 0 },
        children: rightP }),
    ]})]
  });

  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f }, children: [topT, titleP, mainT] }] });
}

async function mkCRO(d) {
  const h = mkHeader();
  const f = mkFooter();
  const right = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 200, before: 160 },
      children: [tx("Lille, le " + d.dateOp, { size: 20 })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 },
      children: [tx("COMPTE-RENDU OPERATOIRE", { size: 22, bold: true })] }),
    pj("Date op\u00e9ratoire : " + d.dateOp),
    pj("Op\u00e9rateur : Docteur Tom ROUSSEL"),
    pj("Aides op\u00e9ratoires : " + d.aides),
    ep(80),
    new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [tx("Indication : ", { size: 20, bold: true }), tx(d.indication, { size: 20, bold: true })] }),
    pj("CCAM : " + d.ccam, { italics: true, after: 80 }),
    ...(d.implants ? [new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 80 },
      children: [tx("Rappel des implants : ", { size: 20, bold: true }), tx(d.implants, { size: 20 })] })] : []),
    ep(40),
    ...d.tempsOp.map(parseLine),
    ep(160),
    pp([tx("Dr Tom ROUSSEL", { size: 20, bold: true })], { after: 0 }),
    pj("Docteur Junior \u2014 Service de Traumatologie-Orthop\u00e9die"),
  ];
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f },
    children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds || ""), ep(120), twoCol(right)] }] });
}

async function mkCRH(d) {
  const h = mkHeader();
  const f = mkFooter();
  const bP = d.paras.map(item => {
    if (item.type === "consigne") {
      return new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 60 },
        indent: { left: 360 }, children: [tx("- " + item.texte, { size: 20 })] });
    }
    if (item.type === "mixed") {
      return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
        spacing: { after: item.after || 120 }, children: item.runs });
    }
    return new Paragraph({ alignment: AlignmentType.JUSTIFIED,
      spacing: { after: item.after || 120 },
      children: [tx(item.texte, { bold: item.bold || false, italics: item.italics || false })] });
  });
  const right = [
    new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { after: 160, before: 160 },
      children: [tx("Lille, le " + d.dateLettre, { size: 20 })] }),
    pj("Cher confr\u00e8re,", { after: 160 }),
    ...bP,
    ep(120),
    new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0 },
      children: [tx("Professeur C. CHANTELOT", { size: 20, bold: true }),
                 tx("          Le Docteur ROUSSEL TOM", { size: 20, bold: true })] }),
  ];
  const medP = new Paragraph({ alignment: AlignmentType.LEFT, spacing: { after: 0, before: 200 },
    border: { top: { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" } },
    children: [tx("Lettre adress\u00e9e \u00e0 : " + (d.mt || "[M\u00c9DECIN TRAITANT]"), { size: 16, color: "444444" })] });
  return new Document({ sections: [{ ...SP.sections[0], headers: { default: h }, footers: { default: f },
    children: [topTbl(d.nom, d.prenom, d.ddn, d.de, d.ds), ep(120), twoCol(right, 480), ep(200), medP] }] });
}

// ─── CONTENT BUILDERS ─────────────────────────────────────────
function pthCROTemps(cotT, cotM, rape, col, tigM, tigeType, tigT, tete, tetem, infiltr, cotOpp) {
  return [
    "Installation en d\u00e9cubitus lat\u00e9ral " + cotOpp + ".",
    "Badigeon et champage st\u00e9rile.",
    "Antibioprophylaxie pr\u00e9-op\u00e9ratoire selon le protocole du CLIN.",
    "Check-list.", "",
    "Voie d'abord post\u00e9ro-lat\u00e9rale.", "H\u00e9mostases sous cutan\u00e9es.",
    "Ouverture du fascia lata.", "Discision des fibres du grand fessier.",
    "Pneumatisation de la bourse r\u00e9tro-trochant\u00e9rienne.",
    "Ouverture des pelvi-trochant\u00e9riens et de la capsule en L invers\u00e9 au ras du grand trochanter.",
    "Faufilage au Vicryl 2.", "Luxation de la hanche.",
    "Ost\u00e9otomie du col f\u00e9moral \u00e0 la scie oscillante selon la planification pr\u00e9-op\u00e9ratoire.",
    "Ablation de la t\u00eate f\u00e9morale sans difficult\u00e9.", "",
    "##Temps cotyloidien :",
    "Exposition du cotyle.", "Ablation du labrum.",
    "Ablation du reliquat du ligament rond de la t\u00eate f\u00e9morale.",
    "Rep\u00e9rage du ligament transverse.",
    "Fraisages de tailles croissantes jusqu'\u00e0 la taille " + cotT + " pour mise en place d'un cotyle d\u00e9finitif taille " + cotT + " DM " + cotM + " sans ciment l\u00e9g\u00e8rement plus ant\u00e9vers\u00e9 que le transverse.",
    "La tenue primaire est excellente.", "",
    "##Temps femoral :",
    "Exposition du f\u00fbt f\u00e9moral jambe au z\u00e9nith.",
    "Ablation du reliquat de col \u00e0 l'emporte-pi\u00e8ce.",
    "Tunnelisation \u00e0 la dague.", "\u00c9videment du grand trochanter \u00e0 la curette.",
    "On passe les r\u00e2pes de tailles successives jusqu'\u00e0 la r\u00e2pe taille " + rape + ".",
    "Essais sur r\u00e2pe en place col " + col + ".",
    "La stabilit\u00e9 est excellente et les longueurs sont restaur\u00e9es.",
    "D\u00e9cision de mise en place d'une tige " + tigM + " " + tigeType + " sans ciment taille " + tigT + ".",
    "Nouveaux essais sur la tige d\u00e9finitive strictement comparables.",
    "Mise en place d'une t\u00eate " + tete + " DM " + tetem + " col " + col + ".",
    "R\u00e9duction de la hanche.", "Nettoyage abondant.",
    ...(infiltr === "Oui" ? ["Infiltration p\u00e9ri-articulaire selon protocole."] : []),
    "R\u00e9insertion des pelvi-trochant\u00e9riens et de la capsule par des points trans-glut\u00e9aux au Lucas.",
    "Fermeture plan par plan.", "Agrafes \u00e0 la peau.", "Pansement Aquacel Duoderm.",
  ];
}

function pthCRHParas(civ, nom, prenom, age, dateOp, cote, ind, atcd, mt) {
  return [
    { type: "mixed", after: 120, runs: [
      tx("Votre patient(e) "),
      tx(civ + " " + nom + " " + prenom, { bold: true }),
      tx(", " + age + " ans, a \u00e9t\u00e9 hospitalis\u00e9(e) dans notre service du " + dateOp + " au [DATE SORTIE] pour la r\u00e9alisation de son arthroplastie totale de hanche " + cote + " sur " + ind + "."),
    ]},
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement d\u00e9roul\u00e9e au bloc op\u00e9ratoire le " + dateOp + " sous anesth\u00e9sie [TYPE]. Les radiographies de contr\u00f4le post-op\u00e9ratoire sont satisfaisantes.", after: 120 },
    { texte: "Au cours de son hospitalisation, le patient a pu b\u00e9n\u00e9ficier de kin\u00e9sith\u00e9rapie et reprendre la marche sans difficult\u00e9.", after: 120 },
    { texte: "La sortie du patient est autoris\u00e9e ce [DATE SORTIE] sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE \u00e0 domicile, protocole AQUACEL + DUODERM" },
    { type: "consigne", texte: "Ablation des agrafes \u00e0 J15 post-op\u00e9ratoire" },
    { type: "consigne", texte: "Kin\u00e9sith\u00e9rapie selon le protocole remis au patient" },
    { type: "consigne", texte: "Appui complet autoris\u00e9 d'embl\u00e9e avec 2 cannes anglaises, pr\u00e9cautions anti-luxation pendant 6 semaines" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation pr\u00e9ventive par INNOHEP 4500 UI 1 inj. SC par jour avec contr\u00f4le plaquettaire hebdomadaire dont les r\u00e9sultats sont \u00e0 transmettre au m\u00e9decin traitant, pendant 35 jours" },
    { texte: "Pour ma part, je le reverrai en consultation de contr\u00f4le radio-clinique dans 6 semaines avec radiographies du bassin de face et de hanche " + cote + " de face et profil.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

function ptgCRHParas(civ, nom, prenom, age, dateOp, cote, ind, def, deg, atcd) {
  return [
    { type: "mixed", after: 120, runs: [
      tx("Votre patient(e) "),
      tx(civ + " " + nom + " " + prenom, { bold: true }),
      tx(", " + age + " ans, a \u00e9t\u00e9 hospitalis\u00e9(e) dans notre service du " + dateOp + " au [DATE SORTIE] pour la r\u00e9alisation de son arthroplastie totale de genou " + cote + " sur " + ind + " avec d\u00e9formation en " + def + " de " + deg + "\u00b0."),
    ]},
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement d\u00e9roul\u00e9e au bloc op\u00e9ratoire le " + dateOp + " sous anesth\u00e9sie [TYPE]. Les radiographies de contr\u00f4le post-op\u00e9ratoire sont satisfaisantes.", after: 120 },
    { texte: "Au cours de son hospitalisation, le patient a pu b\u00e9n\u00e9ficier de kin\u00e9sith\u00e9rapie et reprendre la marche sans difficult\u00e9.", after: 120 },
    { texte: "Les suites ont \u00e9t\u00e9 simples par ailleurs, la sortie du patient est donc autoris\u00e9e ce jour sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Soins de pansements tous les 4 jours par IDE \u00e0 domicile, protocole AQUACEL + DUODERM" },
    { type: "consigne", texte: "Ablation des agrafes \u00e0 J15 post-op\u00e9ratoire" },
    { type: "consigne", texte: "Kin\u00e9sith\u00e9rapie intensive selon le protocole remis au patient" },
    { type: "consigne", texte: "Appui complet autoris\u00e9 d'embl\u00e9e avec 2 cannes anglaises" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation pr\u00e9ventive par INNOHEP 4500 UI 1 inj. SC par jour avec contr\u00f4le plaquettaire hebdomadaire dont les r\u00e9sultats sont \u00e0 transmettre au m\u00e9decin traitant, pendant 35 jours" },
    { texte: "Pour ma part, je le reverrai en consultation de contr\u00f4le radio-clinique dans 6 semaines avec radiographies du genou " + cote + " de face et profil en charge et pangonogramme.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

function lcaCRHParas(civ, nom, prenom, age, dateOp, cote, atcd, men, hasSut) {
  return [
    { type: "mixed", after: 120, runs: [
      tx("Votre patient(e) "),
      tx(civ + " " + nom + " " + prenom, { bold: true }),
      tx(", " + age + " ans, a \u00e9t\u00e9 pris(e) en charge en ambulatoire le " + dateOp + " pour la reconstruction du ligament crois\u00e9 ant\u00e9rieur du genou " + cote + " par technique DT3+2."),
    ]},
    ...(atcd ? [{ texte: atcd, after: 120 }] : []),
    { texte: "L'intervention s'est parfaitement d\u00e9roul\u00e9e sous anesth\u00e9sie [TYPE].", after: 60 },
    ...(men.length ? [{ texte: "Un geste associ\u00e9 a \u00e9t\u00e9 r\u00e9alis\u00e9 : " + men.join(", ") + ".", after: 120 }] : []),
    { texte: "Les suites ont \u00e9t\u00e9 simples, la sortie du patient est donc autoris\u00e9e le jour m\u00eame sous couvert des consignes suivantes :", after: 60 },
    { type: "consigne", texte: "Appui complet autoris\u00e9 d'embl\u00e9e avec 2 cannes anglaises" + (hasSut ? " (appui prot\u00e9g\u00e9 1 mois en raison de la suture m\u00e9niscale)" : "") },
    { type: "consigne", texte: "Soins de pansements toutes les 48h par IDE \u00e0 domicile" },
    { type: "consigne", texte: "Ablation des agrafes \u00e0 J15 post-op\u00e9ratoire" },
    { type: "consigne", texte: "Kin\u00e9sith\u00e9rapie en urgence selon le protocole DT3+2 remis au patient" },
    { type: "consigne", texte: "Antalgiques selon ordonnance" },
    { type: "consigne", texte: "Anticoagulation pr\u00e9ventive par INNOHEP 4500 UI 1 inj. SC par jour pendant 21 jours avec contr\u00f4le plaquettaire hebdomadaire" },
    { texte: "Pour ma part, je le reverrai en consultation de contr\u00f4le dans 4 semaines.", after: 200 },
    { texte: "Bien cordialement.", after: 300 },
  ];
}

// ─── MAIN GENERATOR ──────────────────────────────────────────
async function generateDocs(inter, f, docList) {
  const res = {};
  const { nom, prenom, ddn, age, dateOp, civ, cote, aides, mt } = f;

  if (inter === "PTH") {
    const { ind, atcd, cotT, cotM, tigT, tigM, tigeType, col, tete, tetem, rape, infiltr } = f;
    const cotOpp = cote === "droit" ? "gauche" : "droit";
    const imp = "Cotyle " + cotM + " taille " + cotT + " / Tige " + tigM + " " + tigeType + " taille " + tigT + " / T\u00eate " + tete + " DM " + tetem + " col " + col;

    if (docList.includes("CRO")) {
      res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: dateOp, ds: "", aides,
        indication: "Arthroplastie totale de hanche " + cote + " dans le cadre d'une " + ind + ".",
        ccam: "NEKA020", implants: imp, tempsOp: pthCROTemps(cotT, cotM, rape, col, tigM, tigeType, tigT, tete, tetem, infiltr, cotOpp) });
    }
    if (docList.includes("CRH")) {
      res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: "[DATE SORTIE]", dateLettre: dateOp, mt,
        paras: pthCRHParas(civ, nom, prenom, age, dateOp, cote, ind, atcd, mt) });
    }
    if (docList.includes("Ordonnance pharma")) {
      res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**Mat\u00e9riel de soins :", "AQUACEL Extra \u2014 1 bo\u00eete", "DUODERM Extra Thin \u2014 1 bo\u00eete",
        "Compresses st\u00e9riles 10x10 \u2014 1 bo\u00eete", "BISEPTINE \u2014 1 flacon",
        "S\u00e9rum physiologique \u2014 30 dosettes", "",
        "**Analg\u00e9sie :", "",
        "PARAC\u00c9TAMOL 1g \u2014 1 cp/6h \u2014 QSP 30 jours", "",
        "IBUPROFENE 400mg \u2014 1 cp matin/midi/soir \u2014 QSP 10 jours",
        "OMEPRAZOLE 20mg \u2014 1 gel. matin \u2014 QSP 10 jours", "",
        "ACUPAN 30mg \u2014 1 cp matin/midi/soir \u2014 QSP 10 jours (hors >70 ans, CI : glaucome/HBP/cardiopathie/IRC)", "",
        "**Anticoagulation :", "",
        "INNOHEP 4500 UI/j \u2014 1 injection SC/jour pendant 35 jours",
      ]);
    }
    if (docList.includes("Ordonnance IDE")) {
      res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "Soins de pansements \u00e0 domicile toutes les 4 jours jusqu'\u00e0 cicatrisation compl\u00e8te.", "",
        "Ablation des agrafes \u00e0 J15 post-op\u00e9ratoire.", "",
        "INNOHEP 4500 UI/j \u2014 1 injection SC/jour pendant 35 jours.", "",
        "NFS plaquettes 1x/semaine pendant 35 jours.",
      ], "Ordonnance IDE \u2014 PTH " + cote);
    }
    if (docList.includes("Ordonnance kine")) {
      res["Ordonnance kine"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**KINESITHERAPIE post-PTH " + cote + " \u2014 Appui complet d'embl\u00e9e \u2014 URGENT", "",
        "##Phase 1 \u2014 J0 \u00e0 J15 :", "Cryoth\u00e9rapie, exercices isom\u00e9triques, flexion < 70\u00b0",
        "EVITER : flexion > 90\u00b0 + adduction + rotation interne combin\u00e9es", "Marche 2 cannes, escaliers", "",
        "##Phase 2 \u2014 J15 \u00e0 6 semaines :", "Renforcement moyen fessier (priorit\u00e9), v\u00e9lo sans r\u00e9sistance S3-S4", "",
        "##Phase 3 \u2014 6 semaines \u00e0 3 mois :", "Arr\u00eat pr\u00e9cautions anti-luxation \u00e0 6 semaines",
        "Reprise sportive l\u00e9g\u00e8re \u00e0 3 mois",
      ]);
    }
    if (docList.includes("Ordonnance materiel")) {
      res["Ordonnance materiel"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "2 Cannes anglaises r\u00e9glables \u2014 1 paire", "",
        "R\u00e9hausseur de toilettes \u2014 1", "",
        "Bas de contention classe II \u2014 Jambe " + cote + " \u2014 QSP 3 mois",
      ]);
    }
  }

  if (inter === "PTG") {
    const { ind, atcd, def, deg, femT, platT, insT, rotT, flex } = f;
    const ccam = parseInt(deg) > 10 ? "NFKA008" : "NFKA007";
    const imp = "F\u00e9mur ACS taille " + femT + " / Plateau ACS taille " + platT + " / Insert " + insT + " mm / Bouton rotulien taille " + rotT;

    if (docList.includes("CRO")) {
      res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: dateOp, ds: "", aides,
        indication: "Arthroplastie totale de genou " + cote + " dans le cadre d'une " + ind + " avec d\u00e9formation en " + def + " de " + deg + "\u00b0.",
        ccam, implants: imp,
        tempsOp: [
          "Installation en d\u00e9cubitus dorsal.", "Badigeon et champage st\u00e9rile.",
          "Antibioprophylaxie pr\u00e9-op\u00e9ratoire selon le protocole du CLIN.", "Check-list.", "",
          "Voie d'abord m\u00e9diale para-patellaire.", "Arthrotomie m\u00e9diale para-patellaire.",
          "\u00c9version de la rotule.", "R\u00e9section des ost\u00e9ophytes p\u00e9riph\u00e9riques.",
          "R\u00e9section du corps adipeux de Hoffa.", "R\u00e9section du pivot central.", "",
          "##Coupe tibiale premiere :",
          "Guide tibial extra-m\u00e9dullaire.", "R\u00e9section tibiale proximale selon planification.",
          "Contr\u00f4le de l'espace par l'h\u00e9mi-espaceur.", "",
          "##Temps femoral :",
          "Guide f\u00e9moral intra-m\u00e9dullaire.",
          "R\u00e9sections distale, ant\u00e9rieure, post\u00e9rieure et chanfreins.",
          "Trial f\u00e9moral taille " + femT + ".",
          "Ouverture espace flexion au Mehary, ablation ost\u00e9ophytes post\u00e9rieurs et m\u00e9nisques.", "",
          "##Temps tibial :",
          "Trial plateau " + platT + ", empreinte au ciseau, essai PE " + insT + " mm.",
          "Resurfac\u00e7age patellaire. No thumb test positif.", "",
          "##Bilan ligamentaire :",
          "Balance satisfaisante en flexion et en extension.",
          "Flexion \u00e0 " + flex + "\u00b0, extension compl\u00e8te.", "",
          "Cimentation plateau " + platT + "/insert " + insT + ", f\u00e9mur " + femT + ", rotule " + rotT + ".",
          "Vicryl 2 + Stratafix capsulo-synovial, Vicryl 0 sous-cutan\u00e9.",
          "Agrafes. Pansement Aquacel Duoderm.",
        ]
      });
    }
    if (docList.includes("CRH")) {
      res["CRH"] = await mkCRH({ nom, prenom, ddn, de: dateOp, ds: "[DATE SORTIE]", dateLettre: dateOp, mt,
        paras: ptgCRHParas(civ, nom, prenom, age, dateOp, cote, ind, def, deg, atcd) });
    }
    if (docList.includes("Ordonnance pharma")) {
      res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**Mat\u00e9riel de soins :", "AQUACEL Extra \u2014 1 bo\u00eete", "DUODERM Extra Thin \u2014 1 bo\u00eete",
        "Compresses st\u00e9riles \u2014 1 bo\u00eete", "BISEPTINE \u2014 1 flacon", "S\u00e9rum physiologique \u2014 30 dosettes", "",
        "**Analg\u00e9sie :", "",
        "PARAC\u00c9TAMOL 1g \u2014 1 cp/6h \u2014 QSP 30 jours", "",
        "IBUPROFENE 400mg \u2014 1 cp matin/midi/soir \u2014 QSP 10 jours",
        "OMEPRAZOLE 20mg \u2014 1 gel. matin \u2014 QSP 10 jours", "",
        "ACUPAN 30mg \u2014 1 cp matin/midi/soir \u2014 QSP 10 jours (hors >70 ans)", "",
        "**Anticoagulation :", "", "INNOHEP 4500 UI/j \u2014 1 injection SC/jour pendant 35 jours",
      ]);
    }
    if (docList.includes("Ordonnance IDE")) {
      res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "Soins de pansements \u00e0 domicile toutes les 4 jours jusqu'\u00e0 cicatrisation.", "",
        "Ablation des agrafes \u00e0 J15 post-op\u00e9ratoire.", "",
        "INNOHEP 4500 UI/j \u2014 1 injection SC/jour pendant 35 jours.", "",
        "NFS plaquettes 1x/semaine pendant 35 jours.",
      ], "Ordonnance IDE \u2014 PTG " + cote);
    }
    if (docList.includes("Ordonnance kine")) {
      res["Ordonnance kine"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**KINESITHERAPIE post-PTG " + cote + " \u2014 Appui complet d'embl\u00e9e \u2014 URGENT", "",
        "PRIORITE : extension 0\u00b0 \u2014 NE PAS LAISSER S'INSTALLER UN FLESSUM", "",
        "##Phase 1 \u2014 J0 \u00e0 J15 :", "Extension \u2192 0\u00b0 d\u00e8s J3-J5, flexion \u2192 80\u00b0 \u00e0 J15",
        "Si flexion < 90\u00b0 \u00e0 6 semaines : me contacter", "",
        "##Phase 2 \u2014 J15 \u00e0 6 semaines :", "V\u00e9lo d\u00e8s flexion > 90\u00b0, renforcement quadriceps", "",
        "##Phase 3 \u2014 6 semaines \u00e0 3 mois :", "Objectif flexion > 120\u00b0, reprise l\u00e9g\u00e8re \u00e0 3 mois",
      ]);
    }
    if (docList.includes("Ordonnance materiel")) {
      res["Ordonnance materiel"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "2 Cannes anglaises r\u00e9glables \u2014 1 paire", "",
        "Attelle de cryoth\u00e9rapie (type Cryo Cuff genou) \u2014 1", "",
        "Bas de contention classe II \u2014 Jambe " + cote + " \u2014 QSP 3 mois",
      ]);
    }
  }

  if (inter === "LCA") {
    const { ressaut, atcd, dT, dF, vT, vF, cbRM, cbRL, cbSM, cbSL, cbRamp, cart } = f;
    const men = [];
    if (cbRM) men.push("r\u00e9gularisation m\u00e9niscale m\u00e9diale");
    if (cbRL) men.push("r\u00e9gularisation m\u00e9niscale lat\u00e9rale");
    if (cbSM) men.push("suture m\u00e9niscale m\u00e9diale");
    if (cbSL) men.push("suture m\u00e9niscale lat\u00e9rale");
    if (cbRamp) men.push("ramp l\u00e9sion");
    const hasSut = cbSM || cbSL;

    if (docList.includes("CRO")) {
      res["CRO"] = await mkCRO({ nom, prenom, ddn, dateOp, de: "", ds: "", aides,
        indication: "Reconstruction du ligament crois\u00e9 ant\u00e9rieur du genou " + cote + " par technique DT3+2. Ressaut rotatoire " + ressaut + " en pr\u00e9-op\u00e9ratoire.",
        ccam: "NFMC003",
        tempsOp: [
          "Installation en d\u00e9cubitus dorsal, genou fl\u00e9chi \u00e0 90\u00b0.", "Badigeon et champage st\u00e9rile.",
          "Antibioprophylaxie pr\u00e9-op\u00e9ratoire selon le protocole du CLIN.", "Check-list.", "",
          "##Pr\u00e9l\u00e8vement du greffon :",
          "Incision verticale en regard de la patte d'oie.",
          "Pr\u00e9l\u00e8vement du demi-tendineux et du droit interne au stripper atraumatique.",
          "Ischio-jambiers laiss\u00e9s p\u00e9dicul\u00e9s, compresse Vancomycine, remise en gaine.", "",
          "Garrot pneumatique 300 mmHg.", "",
          "##Temps arthroscopique :",
          "Voie ant\u00e9ro-lat\u00e9rale puis ant\u00e9ro-m\u00e9diale \u00e0 l'aiguille.",
          "Exploration syst\u00e9matique :",
          "- F\u00e9moro-patellaire : " + (cart || "RAS"),
          "- Compartiments m\u00e9dial et lat\u00e9ral : RAS",
          "- LCA rompu / LCP intact.",
          ...(men.length ? ["Gestes associ\u00e9s : " + men.join(", ") + "."] : []), "",
          "##Temps tibial :", "Guide 55\u00b0, m\u00e8che 9 mm, shaver.", "",
          "##Temps f\u00e9moral :",
          "Contre-abord \u00e9picondyle lat\u00e9ral, outside-in 55\u00b0, m\u00e8che 9 mm.", "",
          "##Pr\u00e9paration du greffon :",
          "Calibrage " + dT + " mm tibia / " + dF + " mm f\u00e9mur, tigerstick, XBRAID DT3+2.", "",
          "Cyclage du genou.",
          "Fixation f\u00e9mur : vis " + vF + ". Fixation tibia : vis " + vT + " \u00e0 30\u00b0 flexion.", "",
          "##Retour externe :",
          "Passage sous fascia lata, tunnel 6 mm, endobouton RT en extension rotation neutre.", "",
          "Lachman n\u00e9gatif. Tiroir n\u00e9gatif.",
          "Vicryl 2-0 sous-cutan\u00e9, Vicryl 3-0 rapide cutan\u00e9. Pansement sec.",
        ]
      });
    }
    if (docList.includes("CRH")) {
      res["CRH"] = await mkCRH({ nom, prenom, ddn, de: "", ds: "", dateLettre: dateOp, mt,
        paras: lcaCRHParas(civ, nom, prenom, age, dateOp, cote, atcd, men, hasSut) });
    }
    if (docList.includes("Ordonnance pharma")) {
      res["Ordonnance pharma"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**Mat\u00e9riel IDE :", "BISEPTINE, s\u00e9rum physiologique, compresses, COSMOPORE", "",
        "**Analg\u00e9sie :", "",
        "PARAC\u00c9TAMOL 1g \u2014 4x/j \u2014 QSP 30 jours", "",
        "APRANAX 550mg \u2014 matin + apr\u00e8s-midi \u2014 QSP 5 jours",
        "OMEPRAZOLE 20mg \u2014 1 gel. matin \u2014 QSP 5 jours", "",
        "ACUPAN 30mg \u2014 1 cp matin/midi/soir \u2014 QSP 10 jours", "",
        "**Anticoagulation :", "", "INNOHEP 4500 UI/j \u2014 1 injection SC pendant 21 jours",
      ]);
    }
    if (docList.includes("Ordonnance IDE")) {
      res["Ordonnance IDE"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "Soins de pansements toutes les 48h jusqu'\u00e0 cicatrisation.", "",
        "Ablation des agrafes \u00e0 J15. (Surjet : retirer uniquement la boucle \u00e0 l'extr\u00e9mit\u00e9)", "",
        "INNOHEP 4500 UI/j \u2014 1 injection SC pendant 21 jours.", "",
        "NFS plaquettes 1x/semaine pendant 21 jours.",
      ], "Ordonnance IDE \u2014 LCA " + cote);
    }
    if (docList.includes("Ordonnance kine")) {
      res["Ordonnance kine"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "**Kin\u00e9sith\u00e9rapie post-LCA " + cote + " \u2014 DT3+2 \u2014 URGENT", "",
        "##S1 \u2192 S3 :", "Verrouillage extension, flexion 60\u00b0, cha\u00eene ferm\u00e9e" + (hasSut ? ", 2 cannes 1 mois" : ""), "",
        "##S3 \u2192 M2 :", "Flexion 120\u00b0, v\u00e9lo sans r\u00e9sistance", "",
        "##M2 \u2192 M4 :", "Proprioception, course terrain plat \u2014 Test isocin\u00e9tique M4", "",
        "##M4 \u2192 M6 :", "R\u00e9athl\u00e9tisation \u2014 CI pivot/contact", "",
        "##M6 \u2192 M9 :", "Reprise entra\u00eenement d\u00e8s M7 \u2014 Pas de comp\u00e9tition", "",
        "##M9 \u2192 M12 :", "Reprise comp\u00e9tition",
      ]);
    }
    if (docList.includes("Ordonnance materiel")) {
      res["Ordonnance materiel"] = await mkOrdo(nom, prenom, ddn, dateOp, [
        "2 Cannes anglaises r\u00e9glables \u2014 1 paire", "",
        "Attelle de cryoth\u00e9rapie (type Cryo Cuff genou) \u2014 1",
      ]);
    }
  }

  return res;
}

// ─── DESIGN ──────────────────────────────────────────────────
const CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');",
  "*, *::before, *::after { box-sizing: border-box; }",
  "body { background: #F7F4EF; color: #2A2118; font-family: 'DM Sans', sans-serif; margin: 0; min-height: 100vh; -webkit-font-smoothing: antialiased; }",
  ".app { max-width: 660px; margin: 0 auto; padding: 2rem 1rem 5rem; }",
  ".card { background: #FFFFFF; border: 1px solid #E6DDD3; border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1rem; box-shadow: 0 1px 3px rgba(42,33,24,0.06), 0 4px 16px rgba(42,33,24,0.05); }",
  ".st { font-size: 10px; font-weight: 500; color: #AFA49A; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; }",
  ".field { margin-bottom: 14px; }",
  ".field label { display: block; font-size: 12px; font-weight: 500; color: #7A6E65; margin-bottom: 5px; }",
  ".field input, .field select, .field textarea { width: 100%; font-size: 14px; font-family: 'DM Sans', sans-serif; background: #FAF8F5; border: 1px solid #E6DDD3; border-radius: 9px; padding: 9px 12px; color: #2A2118; outline: none; transition: all 0.15s; }",
  ".field input:focus, .field textarea:focus, .field select:focus { border-color: #C4A882; background: #fff; box-shadow: 0 0 0 3px rgba(196,168,130,0.12); }",
  ".field textarea { min-height: 70px; resize: vertical; }",
  ".r2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }",
  ".r3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }",
  ".tg { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }",
  ".tb { padding: 7px 16px; border: 1px solid #E6DDD3; border-radius: 20px; background: #FAF8F5; font-size: 13px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; transition: all 0.12s; }",
  ".tb:hover { border-color: #C4A882; color: #5C4A35; }",
  ".tb.on { background: #F5ECE0; border-color: #C4A882; color: #8B6035; font-weight: 500; }",
  ".doc-chip { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; color: #7A6E65; background: #FAF8F5; transition: all 0.12s; }",
  ".doc-chip.on { background: #EDF5F0; border-color: #82B99A; color: #3A6B4C; font-weight: 500; }",
  ".sec-card { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border: 1px solid #E6DDD3; border-radius: 12px; cursor: pointer; background: #FAF8F5; margin-bottom: 8px; transition: all 0.12s; }",
  ".sec-card:hover { border-color: #C4A882; background: #fff; }",
  ".sec-card.on { background: #F5ECE0; border-color: #C4A882; }",
  ".av { width: 38px; height: 38px; border-radius: 50%; background: #E6DDD3; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #7A6E65; flex-shrink: 0; }",
  ".sec-card.on .av { background: #C4A882; color: white; }",
  ".btn { padding: 10px 22px; border-radius: 10px; font-size: 14px; font-weight: 500; font-family: 'DM Sans', sans-serif; cursor: pointer; border: 1px solid #E6DDD3; background: #fff; color: #2A2118; transition: all 0.12s; }",
  ".btn:hover { background: #F7F4EF; }",
  ".btn-p { background: #7C5C38; border-color: #7C5C38; color: white; }",
  ".btn-p:hover { background: #6A4D2E; border-color: #6A4D2E; }",
  ".btn-s { background: #3A6B4C; border-color: #3A6B4C; color: white; }",
  ".btn-s:hover { background: #2F5A3E; }",
  ".btn-sm { padding: 7px 16px; font-size: 13px; }",
  ".back-btn { background: none; border: none; font-size: 13px; color: #7A6E65; cursor: pointer; padding: 0; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; transition: color 0.12s; }",
  ".back-btn:hover { color: #2A2118; }",
  ".int-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr)); gap: 12px; margin-bottom: 2rem; }",
  ".int-card { background: #fff; border: 1px solid #E6DDD3; border-radius: 16px; padding: 1.25rem 1rem 1rem; cursor: pointer; transition: all 0.18s; box-shadow: 0 1px 3px rgba(42,33,24,0.06), 0 4px 16px rgba(42,33,24,0.04); }",
  ".int-card:hover { border-color: #C4A882; box-shadow: 0 4px 20px rgba(42,33,24,0.12); transform: translateY(-2px); }",
  ".int-card.off { opacity: 0.4; cursor: not-allowed; }",
  ".int-card.off:hover { transform: none; box-shadow: 0 1px 3px rgba(42,33,24,0.06); border-color: #E6DDD3; }",
  ".int-title { font-family: 'Lora', serif; font-size: 22px; font-weight: 500; color: #2A2118; line-height: 1.2; }",
  ".int-sub { font-size: 11px; color: #AFA49A; margin-top: 4px; line-height: 1.4; }",
  ".doc-tab { padding: 6px 14px; border: 1px solid #E6DDD3; border-radius: 20px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; background: #FAF8F5; color: #7A6E65; transition: all 0.12s; }",
  ".doc-tab.on { background: #fff; border-color: #C4A882; color: #7C5C38; font-weight: 500; }",
  ".spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid #E6DDD3; border-top-color: #8B6035; border-radius: 50%; animation: spin 0.7s linear infinite; vertical-align: middle; margin-right: 8px; }",
  "@keyframes spin { to { transform: rotate(360deg); } }",
  ".cb-row { display: flex; flex-direction: column; gap: 8px; }",
  ".cbi { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #2A2118; cursor: pointer; padding: 4px 0; user-select: none; }",
  ".cbi input[type=checkbox] { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 2px solid #C4A882; border-radius: 5px; background: #FAF8F5; cursor: pointer; flex-shrink: 0; transition: all 0.12s; position: relative; display: inline-flex; align-items: center; justify-content: center; }",
  ".cbi input[type=checkbox]:checked { background: #8B6035; border-color: #8B6035; }",
  ".cbi input[type=checkbox]:checked::after { content: ''; display: block; width: 5px; height: 9px; border: 2px solid white; border-top: none; border-left: none; transform: rotate(45deg) translate(-1px, -1px); }",
  ".alert-i { background: #F5ECE0; color: #7C5C38; border: 1px solid #D4B896; border-radius: 10px; padding: 12px 16px; font-size: 13px; margin-top: 12px; }",
  ".page-title { font-family: 'Lora', serif; font-size: 30px; font-weight: 400; color: #2A2118; margin: 0 0 4px; }",
  ".page-sub { font-size: 13px; color: #AFA49A; margin: 0 0 1.75rem; }",
  ".actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 1.5rem; }",
  ".chip-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }",
  ".count-hint { font-size: 12px; color: #AFA49A; margin-top: 4px; }",
  ".tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; background: #F5ECE0; color: #8B6035; }",
].join("\n");

// ─── REACT APP ───────────────────────────────────────────────
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
  const fmtD = (s) => {
    if (!s) return "[DATE]";
    const [y, m, d] = s.split("-");
    return d + "/" + m + "/" + y;
  };

  function goInter(id) {
    setInter(id);
    setForm({ date: today, civilite: "Monsieur", cote: "droit", tigeType: "Standard",
              tetem: "inox", infiltr: "Non", deformation: "varus", ressaut: "absent" });
    setSelDocs(new Set(DOCS[id]));
    setSelSecs(new Set());
    setMailMsg(null); setErrMsg(null);
    setScreen("form");
  }

  function togDoc(d) {
    setSelDocs(s => { const n = new Set(s); n.has(d) ? n.delete(d) : n.add(d); return n; });
  }
  function togSec(id) {
    setSelSecs(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function handleGen() {
    setGenerating(true); setMailMsg(null); setErrMsg(null); setScreen("docs");
    const f = {
      nom: (form.nom || "").toUpperCase() || "[NOM]",
      prenom: form.prenom || "[PRENOM]",
      ddn: fmtD(form.ddn),
      age: form.age || "[AGE]",
      dateOp: fmtD(form.date),
      civ: form.civilite || "Monsieur",
      cote: form.cote || "droit",
      aides: form.aides || "[AIDES]",
      mt: form.mt || "[MEDECIN TRAITANT]",
      ind: form.indication || "[INDICATION]",
      atcd: form.atcd || "",
      cotT: form.cotT || "[X]", cotM: form.cotM || "Ecofit",
      tigT: form.tigT || "[X]", tigM: form.tigM || "Ecofit",
      tigeType: form.tigeType || "Standard",
      col: form.col || "court", tete: form.tete || "28",
      tetem: form.tetem || "inox", rape: form.rape || "[X]",
      infiltr: form.infiltr || "Non",
      def: form.deformation || "varus", deg: form.degres || "0",
      femT: form.femT || "[X]", platT: form.platT || "[X]",
      insT: form.insT || "[X]", rotT: form.rotT || "[X]", flex: form.flex || "[X]",
      ressaut: form.ressaut || "absent",
      dT: form.dT || "[X]", dF: form.dF || "[X]",
      vT: form.vT || "[X]", vF: form.vF || "[X]",
      cbRM: !!form.cbRM, cbRL: !!form.cbRL, cbSM: !!form.cbSM, cbSL: !!form.cbSL, cbRamp: !!form.cbRamp,
      cart: form.cart || "",
    };
    try {
      const docs = await generateDocs(inter, f, [...selDocs]);
      const res = {};
      for (const [name, doc] of Object.entries(docs)) {
        res[name] = await Packer.toBuffer(doc);
      }
      setGDocs(res);
      setActiveTab(Object.keys(res)[0] || "");
    } catch(e) {
      console.error("Generation error:", e);
      setErrMsg("Erreur: " + e.message);
    }
    setGenerating(false);
  }

  function dlDoc(name) {
    const buf = gDocs[name]; if (!buf) return;
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    const nomPat = (form.nom || "PATIENT").toUpperCase();
    a.download = inter + "_" + nomPat + "_" + name.replace(/ /g, "_") + "_" + fmtD(form.date) + ".docx";
    a.click(); URL.revokeObjectURL(url);
  }
  function dlAll() {
    Object.keys(gDocs).forEach((n, i) => setTimeout(() => dlDoc(n), i * 250));
  }

  const LABELS = {
    PTH: "Proth\u00e8se totale de hanche",
    PTG: "Proth\u00e8se totale de genou",
    LCA: "Reconstruction LCA DT3+2",
  };

  function SpecFields() {
    if (inter === "PTH") return (
      <>
        <div className="field"><label>Indication</label>
          <input value={form.indication||""} onChange={sf("indication")} placeholder="ex: coxarthrose primitive"/></div>
        <div className="field"><label>Ant\u00e9c\u00e9dents pertinents (optionnel)</label>
          <input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
        <div className="r3">
          <div className="field"><label>Taille cotyle</label>
            <input type="number" value={form.cotT||""} onChange={sf("cotT")} placeholder="52"/></div>
          <div className="field"><label>Mod\u00e8le cotyle</label>
            <input value={form.cotM||""} onChange={sf("cotM")} placeholder="Ecofit"/></div>
          <div className="field"><label>Taille r\u00e2pe</label>
            <input type="number" value={form.rape||""} onChange={sf("rape")} placeholder="7"/></div>
        </div>
        <div className="r3">
          <div className="field"><label>Taille tige</label>
            <input type="number" value={form.tigT||""} onChange={sf("tigT")} placeholder="7"/></div>
          <div className="field"><label>Mod\u00e8le tige</label>
            <input value={form.tigM||""} onChange={sf("tigM")} placeholder="Ecofit"/></div>
          <div className="field"><label>Type tige</label>
            <div className="tg">
              {["Standard","Lat\u00e9ralis\u00e9e"].map(v =>
                <button key={v} className={"tb" + (form.tigeType===v?" on":"")}
                  onClick={() => sfv("tigeType", v)}>{v}</button>)}
            </div>
          </div>
        </div>
        <div className="r3">
          <div className="field"><label>Col</label>
            <input value={form.col||""} onChange={sf("col")} placeholder="court"/></div>
          <div className="field"><label>T\u00eate (mm)</label>
            <input type="number" value={form.tete||""} onChange={sf("tete")} placeholder="28"/></div>
          <div className="field"><label>Mati\u00e8re t\u00eate</label>
            <div className="tg">
              {["inox","c\u00e9ramique"].map(v =>
                <button key={v} className={"tb" + (form.tetem===v?" on":"")}
                  onClick={() => sfv("tetem", v)}>{v}</button>)}
            </div>
          </div>
        </div>
        <div className="field"><label>Infiltration p\u00e9ri-articulaire</label>
          <div className="tg">
            {["Oui","Non"].map(v =>
              <button key={v} className={"tb" + (form.infiltr===v?" on":"")}
                onClick={() => sfv("infiltr", v)}>{v}</button>)}
          </div>
        </div>
      </>
    );
    if (inter === "PTG") return (
      <>
        <div className="field"><label>Indication</label>
          <input value={form.indication||""} onChange={sf("indication")} placeholder="ex: gonarthrose tricompartimentaire"/></div>
        <div className="field"><label>Ant\u00e9c\u00e9dents pertinents (optionnel)</label>
          <input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
        <div className="r2">
          <div className="field"><label>D\u00e9formation</label>
            <div className="tg">
              {["varus","valgus"].map(v =>
                <button key={v} className={"tb" + (form.deformation===v?" on":"")}
                  onClick={() => sfv("deformation", v)}>{v}</button>)}
            </div>
          </div>
          <div className="field"><label>Degr\u00e9s</label>
            <input type="number" value={form.degres||""} onChange={sf("degres")} placeholder="8"/></div>
        </div>
        <div className="r3">
          <div className="field"><label>F\u00e9mur ACS</label>
            <input value={form.femT||""} onChange={sf("femT")} placeholder="4"/></div>
          <div className="field"><label>Plateau ACS</label>
            <input value={form.platT||""} onChange={sf("platT")} placeholder="3"/></div>
          <div className="field"><label>Insert (mm)</label>
            <input type="number" value={form.insT||""} onChange={sf("insT")} placeholder="10"/></div>
        </div>
        <div className="r2">
          <div className="field"><label>Bouton rotulien</label>
            <input value={form.rotT||""} onChange={sf("rotT")} placeholder="29"/></div>
          <div className="field"><label>Flexion obtenue (\u00b0)</label>
            <input type="number" value={form.flex||""} onChange={sf("flex")} placeholder="120"/></div>
        </div>
      </>
    );
    if (inter === "LCA") return (
      <>
        <div className="field"><label>Ressaut rotatoire pr\u00e9-op</label>
          <div className="tg">
            {["absent","pr\u00e9sent"].map(v =>
              <button key={v} className={"tb" + (form.ressaut===v?" on":"")}
                onClick={() => sfv("ressaut", v)}>{v}</button>)}
          </div>
        </div>
        <div className="field"><label>Ant\u00e9c\u00e9dents pertinents (optionnel)</label>
          <input value={form.atcd||""} onChange={sf("atcd")} placeholder="laisser vide si aucun"/></div>
        <div className="r2">
          <div className="field"><label>Diam\u00e8tre tibial (mm)</label>
            <input type="number" value={form.dT||""} onChange={sf("dT")} placeholder="8"/></div>
          <div className="field"><label>Diam\u00e8tre f\u00e9moral (mm)</label>
            <input type="number" value={form.dF||""} onChange={sf("dF")} placeholder="8"/></div>
        </div>
        <div className="r2">
          <div className="field"><label>Vis tibiale</label>
            <input value={form.vT||""} onChange={sf("vT")} placeholder="9x25"/></div>
          <div className="field"><label>Vis f\u00e9morale</label>
            <input value={form.vF||""} onChange={sf("vF")} placeholder="9x25"/></div>
        </div>
        <div className="field"><label>Gestes associ\u00e9s</label>
          <div className="cb-row">
            {[
              ["cbRM","R\u00e9gularisation m\u00e9niscale m\u00e9diale"],
              ["cbRL","R\u00e9gularisation m\u00e9niscale lat\u00e9rale"],
              ["cbSM","Suture m\u00e9niscale m\u00e9diale"],
              ["cbSL","Suture m\u00e9niscale lat\u00e9rale"],
              ["cbRamp","Ramp l\u00e9sion"],
            ].map(([k, l]) => (
              <label key={k} className="cbi">
                <input type="checkbox" checked={!!form[k]} onChange={sfb(k)}/>
                {l}
              </label>
            ))}
          </div>
        </div>
        <div className="field"><label>L\u00e9sions cartilagineuses (optionnel)</label>
          <textarea value={form.cart||""} onChange={sf("cart")}
            placeholder="ex: l\u00e9sion grade III compartiment m\u00e9dial f\u00e9moral"/>
        </div>
      </>
    );
    return null;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">

        {screen === "home" && (
          <>
            <p className="page-title">Bloc chirurgical</p>
            <p className="page-sub">Dr Tom ROUSSEL \u2014 Traumatologie-Orthop\u00e9die, H\u00f4pital Roger Salengro</p>
            <div className="int-grid">
              {[
                ["PTH", "Proth\u00e8se totale de hanche", true],
                ["PTG", "Proth\u00e8se totale de genou", true],
                ["LCA", "Reconstruction DT3+2", true],
                ["TTA + MPFL", "Bient\u00f4t disponible", false],
                ["M\u00e9nisque", "Bient\u00f4t disponible", false],
              ].map(([id, sub, avail]) => (
                <div key={id} className={"int-card" + (avail ? "" : " off")}
                  onClick={() => avail && goInter(id)}>
                  <div className="int-title">{id}</div>
                  <div className="int-sub">{sub}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {screen === "form" && (
          <>
            <button className="back-btn" onClick={() => setScreen("home")}>\u2190 Retour</button>
            <p className="page-title">{inter}</p>
            <p className="page-sub">{LABELS[inter]}</p>

            <div className="card">
              <div className="st">Patient</div>
              <div className="r2">
                <div className="field"><label>Nom</label>
                  <input value={form.nom||""} onChange={sf("nom")} placeholder="NOM"/></div>
                <div className="field"><label>Pr\u00e9nom</label>
                  <input value={form.prenom||""} onChange={sf("prenom")} placeholder="Pr\u00e9nom"/></div>
              </div>
              <div className="r3">
                <div className="field"><label>Date de naissance</label>
                  <input type="date" value={form.ddn||""} onChange={sf("ddn")}/></div>
                <div className="field"><label>\u00c2ge</label>
                  <input type="number" value={form.age||""} onChange={sf("age")} placeholder="54"/></div>
                <div className="field"><label>Date intervention</label>
                  <input type="date" value={form.date||today} onChange={sf("date")}/></div>
              </div>
              <div className="r2">
                <div className="field"><label>Civilit\u00e9</label>
                  <div className="tg">
                    {["Monsieur","Madame"].map(v =>
                      <button key={v} className={"tb" + (form.civilite===v?" on":"")}
                        onClick={() => sfv("civilite", v)}>{v}</button>)}
                  </div>
                </div>
                <div className="field"><label>C\u00f4t\u00e9</label>
                  <div className="tg">
                    {["droit","gauche"].map(v =>
                      <button key={v} className={"tb" + (form.cote===v?" on":"")}
                        onClick={() => sfv("cote", v)}>{v}</button>)}
                  </div>
                </div>
              </div>
              <div className="field"><label>Aides op\u00e9ratoires</label>
                <input value={form.aides||""} onChange={sf("aides")}
                  placeholder="ex: Florian PETELLE \u2013 Claire ZIEGLER interne"/></div>
              <div className="field"><label>M\u00e9decin traitant</label>
                <input value={form.mt||""} onChange={sf("mt")} placeholder="Dr Nom Pr\u00e9nom"/></div>
            </div>

            <div className="card">
              <div className="st">D\u00e9tails intervention</div>
              <SpecFields/>
            </div>

            <div className="card">
              <div className="st">Documents \u00e0 g\u00e9n\u00e9rer</div>
              <div className="chip-row">
                {(DOCS[inter]||[]).map(d =>
                  <button key={d} className={"doc-chip" + (selDocs.has(d)?" on":"")}
                    onClick={() => togDoc(d)}>{dl(d)}</button>)}
              </div>
              <p className="count-hint">{selDocs.size} document(s) s\u00e9lectionn\u00e9(s)</p>
            </div>

            <div className="card">
              <div className="st">Secr\u00e9taires destinataires</div>
              {Object.entries(SECS).map(([id, sec]) => (
                <div key={id} className={"sec-card" + (selSecs.has(id)?" on":"")}
                  onClick={() => togSec(id)}>
                  <div className="av">{sec.ini}</div>
                  <div>
                    <div style={{fontSize:14,fontWeight:500}}>{sec.nom}</div>
                    <div style={{fontSize:12,color:"#7A6E65"}}>{sec.email}</div>
                  </div>
                </div>
              ))}
              <div className="sec-card" style={{opacity:.4,cursor:"not-allowed"}}>
                <div className="av">?</div>
                <div>
                  <div style={{fontSize:14,fontWeight:500}}>Secr\u00e9tariat ambulatoire</div>
                  <div style={{fontSize:12,color:"#7A6E65"}}>Email \u00e0 renseigner</div>
                </div>
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-p" onClick={handleGen} disabled={selDocs.size===0}>
                G\u00e9n\u00e9rer {selDocs.size} document{selDocs.size>1?"s":""}
              </button>
              <button className="btn" onClick={() => setScreen("home")}>Annuler</button>
            </div>
          </>
        )}

        {screen === "docs" && (
          <>
            <button className="back-btn" onClick={() => setScreen("form")}>\u2190 Modifier</button>
            <p className="page-title">
              {(form.nom||"").toUpperCase()} {form.prenom||""}
            </p>
            <p className="page-sub">
              <span className="tag">{inter}</span>
              {"\u00a0\u00a0"}{fmtD(form.date)}
            </p>

            {generating && (
              <div className="card" style={{textAlign:"center",padding:"3rem"}}>
                <span className="spinner"/>
                <span style={{fontSize:14,color:"#7A6E65"}}>G\u00e9n\u00e9ration des fichiers Word...</span>
              </div>
            )}

            {errMsg && (
              <div className="card">
                <p style={{color:"#C0392B",fontSize:14}}>{errMsg}</p>
                <button className="btn btn-p" style={{marginTop:12}} onClick={() => setScreen("form")}>
                  \u2190 Retour au formulaire
                </button>
              </div>
            )}

            {!generating && !errMsg && Object.keys(gDocs).length > 0 && (
              <>
                <div className="card">
                  <div className="st">Documents g\u00e9n\u00e9r\u00e9s</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                    {Object.keys(gDocs).map(name => (
                      <button key={name} className={"doc-tab" + (activeTab===name?" on":"")}
                        onClick={() => setActiveTab(name)}>{dl(name)}</button>
                    ))}
                  </div>
                  {activeTab && (
                    <button className="btn btn-s btn-sm" onClick={() => dlDoc(activeTab)}>
                      \u2193 T\u00e9l\u00e9charger "{dl(activeTab)}"
                    </button>
                  )}
                </div>

                <div className="card">
                  <div className="st">Envoi aux secr\u00e9taires</div>
                  <p style={{fontSize:13,color:"#7A6E65",marginBottom:14}}>
                    {selSecs.size > 0
                      ? "Destinataires : " + [...selSecs].map(id => SECS[id].nom).join(", ")
                      : "Aucune secr\u00e9taire s\u00e9lectionn\u00e9e"}
                  </p>
                  <div className="actions" style={{marginTop:0}}>
                    <button className="btn btn-p" onClick={dlAll}>
                      \u2193 Tout t\u00e9l\u00e9charger
                    </button>
                    {selSecs.size > 0 && (
                      <button className="btn btn-s" onClick={() => {
                        dlAll();
                        const emails = [...selSecs].map(id => SECS[id].email).join(", ");
                        const noms = [...selSecs].map(id => SECS[id].nom).join(" et ");
                        setMailMsg("Documents t\u00e9l\u00e9charg\u00e9s. Envoyez \u00e0 " + noms + " \u2014 " + emails);
                      }}>Pr\u00e9parer l'envoi</button>
                    )}
                    <button className="btn" onClick={() => setScreen("home")}>
                      Nouveau dossier
                    </button>
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
