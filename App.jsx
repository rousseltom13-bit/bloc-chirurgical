import { useState, useEffect, useCallback } from "react";
import { Packer } from "docx";

/* ─────────────────────────────────────────────
   PALETTE OrLog
   Clair  : fond #F5F0E8 · card #EDE8DF · text #1A1208 · accent #C17B2F
   Sombre : fond #1E1E1E · card #2A2A2A · text #E8E0D0 · accent #C17B2F
───────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:       #F5F0E8;
    --card:     #EDE8DF;
    --card2:    #E5DFD4;
    --border:   #D4CCC0;
    --text:     #1A1208;
    --text2:    #6B6055;
    --text3:    #9A9088;
    --accent:   #C17B2F;
    --accent-l: #C17B2F22;
    --accent-b: #C17B2F55;
    --genou:    #4A9EBF;
    --hanche:   #8B5CF6;
    --trauma:   #C17B2F;
    --autre:    #888780;
    --danger:   #E24B4A;
    --success:  #1D9E75;
    --radius:   12px;
    --radius-s: 8px;
  }
  [data-theme="dark"] {
    --bg:    #1E1E1E;
    --card:  #2A2A2A;
    --card2: #333333;
    --border:#404040;
    --text:  #E8E0D0;
    --text2: #A09888;
    --text3: #6A6055;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.5; transition: background .25s, color .25s; }
  h1,h2,h3 { font-family: 'Lora', serif; }

  /* Layout */
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: var(--card); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .app-icon { width: 36px; height: 36px; border-radius: 10px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .app-name { font-family: 'Lora', serif; font-size: 17px; font-weight: 600; color: var(--text); }
  .app-sub { font-size: 11px; color: var(--text2); }
  .topbar-right { display: flex; align-items: center; gap: 8px; }
  .btn-icon { width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--text2); transition: all .15s; }
  .btn-icon:hover { background: var(--card2); color: var(--text); }

  .content { flex: 1; padding: 20px; max-width: 800px; margin: 0 auto; width: 100%; }

  /* Tabs */
  .spec-tabs { display: flex; gap: 4px; padding: 4px; background: var(--card); border-radius: var(--radius); margin-bottom: 20px; }
  .spec-tab { flex: 1; padding: 8px 10px; border-radius: var(--radius-s); font-size: 13px; font-weight: 400; color: var(--text2); cursor: pointer; text-align: center; transition: all .15s; border: none; background: transparent; }
  .spec-tab.active { background: var(--bg); color: var(--text); font-weight: 500; box-shadow: 0 1px 3px rgba(0,0,0,.08); }

  /* Tiles */
  .tile-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
  .tile { background: var(--card); border-radius: var(--radius); padding: 16px; border: 1px solid var(--border); cursor: pointer; transition: all .15s; border-left: 3px solid var(--border); }
  .tile:hover { background: var(--card2); transform: translateY(-1px); }
  .tile.hanche { border-left-color: var(--hanche); }
  .tile.genou  { border-left-color: var(--genou); }
  .tile.trauma { border-left-color: var(--trauma); }
  .tile.autre  { border-left-color: var(--autre); }
  .tile-name { font-family: 'Lora', serif; font-size: 15px; font-weight: 500; color: var(--text); margin-bottom: 3px; }
  .tile-sub { font-size: 11px; color: var(--text2); }

  /* Section labels */
  .section-label { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: .08em; color: var(--text3); margin: 20px 0 8px; padding-bottom: 6px; border-bottom: 1px solid var(--border); }

  /* Historique */
  .hist-list { display: flex; flex-direction: column; gap: 1px; }
  .hist-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--card); border-radius: var(--radius-s); transition: background .12s; }
  .hist-row:hover { background: var(--card2); }
  .hist-info { display: flex; flex-direction: column; gap: 2px; }
  .hist-name { font-size: 13px; font-weight: 500; color: var(--text); }
  .hist-meta { font-size: 11px; color: var(--text2); }
  .btn-reopen { font-size: 11px; padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border); background: var(--bg); color: var(--text2); cursor: pointer; transition: all .12s; }
  .btn-reopen:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* Formulaire */
  .form-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border); }
  .back-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--card); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--text2); transition: all .12s; }
  .back-btn:hover { background: var(--card2); }
  .form-title { font-family: 'Lora', serif; font-size: 18px; font-weight: 600; color: var(--text); }

  .form-card { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); margin-bottom: 12px; overflow: hidden; }
  .form-card-header { padding: 10px 14px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: .07em; color: var(--text3); background: var(--card2); border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; align-items: center; user-select: none; }
  .form-card-body { padding: 14px; display: flex; flex-direction: column; gap: 10px; }

  .field-row { display: flex; gap: 10px; }
  .field-group { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .field-label { font-size: 11px; color: var(--text2); }
  .field-with-mic { display: flex; gap: 6px; align-items: center; }
  input, select, textarea {
    width: 100%; padding: 8px 10px; border-radius: var(--radius-s); border: 1px solid var(--border);
    background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px;
    transition: border-color .12s; outline: none;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); }
  textarea { resize: vertical; min-height: 60px; line-height: 1.5; }
  select { cursor: pointer; }

  .mic-btn { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--accent-b); background: var(--accent-l); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; transition: all .12s; }
  .mic-btn:hover { background: var(--accent); }
  .mic-btn.recording { background: var(--accent); animation: pulse 1s infinite; }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 var(--accent-b)} 50%{box-shadow:0 0 0 6px transparent} }

  /* Checkboxes */
  .cb-group { display: flex; flex-direction: column; gap: 6px; }
  .cb-row { display: flex; align-items: flex-start; gap: 8px; cursor: pointer; padding: 4px 0; }
  .cb-box { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid var(--border); background: var(--bg); flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; transition: all .12s; }
  .cb-box.checked { background: var(--accent); border-color: var(--accent); }
  .cb-check { color: #fff; font-size: 10px; font-weight: 700; }
  .cb-label { font-size: 13px; color: var(--text); line-height: 1.4; }
  .cb-cond { font-size: 10px; color: var(--accent); margin-left: 4px; }

  /* Blocs conditionnels indentés */
  .cond-block { margin-left: 24px; padding: 10px 12px; background: var(--accent-l); border-left: 2px solid var(--accent-b); border-radius: 0 var(--radius-s) var(--radius-s) 0; display: flex; flex-direction: column; gap: 8px; }

  /* Sélection docs */
  .docs-grid { display: flex; flex-wrap: wrap; gap: 6px; }
  .doc-chip { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 500; border: 1px solid var(--border); background: var(--bg); color: var(--text2); cursor: pointer; transition: all .12s; user-select: none; }
  .doc-chip.active { background: var(--accent); border-color: var(--accent); color: #fff; }

  /* Boutons principaux */
  .btn-row { display: flex; gap: 8px; margin-top: 16px; }
  .btn-outline { flex: 1; padding: 10px; border-radius: var(--radius-s); border: 1px solid var(--border); background: transparent; color: var(--text2); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .12s; }
  .btn-outline:hover { background: var(--card); }
  .btn-primary { flex: 2; padding: 10px; border-radius: var(--radius-s); border: none; background: var(--accent); color: #fff; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .12s; }
  .btn-primary:hover { background: #A86825; }
  .btn-primary:disabled { opacity: .5; cursor: not-allowed; }

  /* Prévisualisation */
  .preview-tabs { display: flex; gap: 4px; margin-bottom: 14px; flex-wrap: wrap; }
  .prev-tab { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid var(--border); background: var(--card); color: var(--text2); cursor: pointer; transition: all .12s; }
  .prev-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }
  .preview-doc { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); padding: 20px; font-size: 12.5px; line-height: 1.7; color: var(--text); min-height: 300px; }
  .preview-doc h2 { font-family: 'Lora', serif; font-size: 15px; margin-bottom: 8px; color: var(--accent); }
  .preview-doc h3 { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; margin: 12px 0 4px; color: var(--text2); }
  .preview-doc p { margin-bottom: 6px; }
  .preview-doc .injected { background: var(--accent-l); border-left: 2px solid var(--accent); padding: 2px 6px; border-radius: 0 4px 4px 0; display: inline-block; }
  .preview-doc .header-block { border-bottom: 1px solid var(--border); padding-bottom: 12px; margin-bottom: 14px; }
  .preview-doc .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11.5px; }

  /* Écran génération */
  .gen-list { display: flex; flex-direction: column; gap: 6px; margin: 14px 0; }
  .gen-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--card); border-radius: var(--radius-s); border: 1px solid var(--border); }
  .gen-name { font-size: 12px; font-weight: 500; color: var(--text); }
  .btn-dl { padding: 5px 12px; border-radius: 6px; font-size: 11px; font-weight: 500; border: 1px solid var(--accent-b); background: var(--accent-l); color: var(--accent); cursor: pointer; transition: all .12s; }
  .btn-dl:hover { background: var(--accent); color: #fff; }
  .btn-mail { flex: 1; padding: 10px; border-radius: var(--radius-s); border: 1px solid var(--accent-b); background: var(--accent-l); color: var(--accent); font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .12s; }
  .btn-mail:hover { background: var(--accent); color: #fff; }

  /* Civilité radio */
  .radio-group { display: flex; gap: 8px; }
  .radio-opt { display: flex; align-items: center; gap: 5px; cursor: pointer; }
  .radio-dot { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .12s; }
  .radio-dot.selected { border-color: var(--accent); background: var(--accent); }
  .radio-inner { width: 6px; height: 6px; border-radius: 50%; background: #fff; }
  .radio-label { font-size: 13px; color: var(--text); }

  /* Toast */
  .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--text); color: var(--bg); padding: 10px 20px; border-radius: 20px; font-size: 13px; font-weight: 500; z-index: 999; animation: fadeInUp .2s ease; }
  @keyframes fadeInUp { from{opacity:0;transform:translateX(-50%) translateY(8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

// ─── STORAGE ────────────────────────────────
const STORAGE_KEY = "orthodocs_history";
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function saveToHistory(entry) {
  const hist = loadHistory();
  const updated = [entry, ...hist.filter(h => h.id !== entry.id)].slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// ─── SPEECH ─────────────────────────────────
function useSpeech(onResult) {
  const [active, setActive] = useState(null);
  const start = useCallback((field) => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Dictée vocale non disponible sur ce navigateur (utilisez Chrome).");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = "fr-FR"; r.continuous = false; r.interimResults = false;
    r.onresult = e => { onResult(field, e.results[0][0].transcript); setActive(null); };
    r.onerror = () => setActive(null);
    r.onend = () => setActive(null);
    setActive(field);
    r.start();
  }, [onResult]);
  return { active, start };
}

// ─── MIC BUTTON ─────────────────────────────
function MicBtn({ field, active, onStart }) {
  return (
    <button className={`mic-btn${active === field ? " recording" : ""}`} onClick={() => onStart(field)} type="button" title="Dictée vocale">
      🎤
    </button>
  );
}

// ─── CHECKBOX ───────────────────────────────
function Cb({ checked, onChange, label, condLabel }) {
  return (
    <div className="cb-row" onClick={() => onChange(!checked)}>
      <div className={`cb-box${checked ? " checked" : ""}`}>
        {checked && <span className="cb-check">✓</span>}
      </div>
      <span className="cb-label">{label}{condLabel && <span className="cb-cond"> — {condLabel}</span>}</span>
    </div>
  );
}

// ─── RADIO ──────────────────────────────────
function RadioGroup({ value, onChange, options }) {
  return (
    <div className="radio-group">
      {options.map(o => (
        <div key={o} className="radio-opt" onClick={() => onChange(o)}>
          <div className={`radio-dot${value === o ? " selected" : ""}`}>
            {value === o && <div className="radio-inner" />}
          </div>
          <span className="radio-label">{o}</span>
        </div>
      ))}
    </div>
  );
}

// ─── COLLAPSIBLE CARD ───────────────────────
function FormCard({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="form-card">
      <div className="form-card-header" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span style={{ fontSize: 12, color: "var(--text3)" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div className="form-card-body">{children}</div>}
    </div>
  );
}

// ─── FIELD ──────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="field-group">
      {label && <div className="field-label">{label}</div>}
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
//  FORMULAIRES PAR INTERVENTION
// ═══════════════════════════════════════════

// Champs communs patient
function PatientFields({ f, set, speech }) {
  return (
    <FormCard title="Patient">
      <div className="field-row">
        <Field label="Civilité">
          <RadioGroup value={f.civ} onChange={v => set("civ", v)} options={["M.", "Mme"]} />
        </Field>
      </div>
      <div className="field-row">
        <Field label="Nom">
          <div className="field-with-mic">
            <input value={f.nom} onChange={e => set("nom", e.target.value)} placeholder="NOM" />
            <MicBtn field="nom" active={speech.active} onStart={speech.start} />
          </div>
        </Field>
        <Field label="Prénom">
          <input value={f.prenom} onChange={e => set("prenom", e.target.value)} placeholder="Prénom" />
        </Field>
      </div>
      <div className="field-row">
        <Field label="Date de naissance">
          <input type="date" value={f.ddn} onChange={e => set("ddn", e.target.value)} />
        </Field>
        <Field label="Âge">
          <input value={f.age} onChange={e => set("age", e.target.value)} placeholder="ans" />
        </Field>
      </div>
      <div className="field-row">
        <Field label="Date intervention">
          <input type="date" value={f.dateInter} onChange={e => set("dateInter", e.target.value)} />
        </Field>
        <Field label="Date de sortie">
          <input type="date" value={f.dateSortie} onChange={e => set("dateSortie", e.target.value)} />
        </Field>
      </div>
      <div className="field-row">
        <Field label="Côté">
          <RadioGroup value={f.cote} onChange={v => set("cote", v)} options={["Droit", "Gauche"]} />
        </Field>
        <Field label="Anesthésie">
          <select value={f.anesthesie} onChange={e => set("anesthesie", e.target.value)}>
            <option>Rachianesthésie</option>
            <option>Loco-régionale</option>
            <option>Générale</option>
          </select>
        </Field>
      </div>
      <Field label="Médecin traitant">
        <div className="field-with-mic">
          <input value={f.medTraitant} onChange={e => set("medTraitant", e.target.value)} placeholder="Dr..." />
          <MicBtn field="medTraitant" active={speech.active} onStart={speech.start} />
        </div>
      </Field>
      <div className="field-row">
        <Field label="Indication">
          <div className="field-with-mic">
            <input value={f.indication} onChange={e => set("indication", e.target.value)} placeholder="Indication opératoire" />
            <MicBtn field="indication" active={speech.active} onStart={speech.start} />
          </div>
        </Field>
      </div>
      <Field label="Antécédents">
        <div className="field-with-mic">
          <textarea value={f.atcd} onChange={e => set("atcd", e.target.value)} placeholder="Antécédents pertinents..." rows={2} />
          <MicBtn field="atcd" active={speech.active} onStart={speech.start} />
        </div>
      </Field>
      <Field label="Aides opératoires">
        <input value={f.aides} onChange={e => set("aides", e.target.value)} placeholder="Dr..." />
      </Field>
    </FormCard>
  );
}

// ─── PTH ────────────────────────────────────
function PTHFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Cotyle">
        <div className="field-row">
          <Field label="Modèle cotyle"><input value={f.cotyleModele} onChange={e => set("cotyleModele", e.target.value)} placeholder="Modèle" /></Field>
          <Field label="Taille"><input value={f.cotyleTaille} onChange={e => set("cotyleTaille", e.target.value)} placeholder="mm" /></Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.renfortMetal} onChange={v => set("renfortMetal", v)} label="Renfort métallique acétabulaire" condLabel="cage / augment" />
          <Cb checked={f.ablationMat} onChange={v => set("ablationMat", v)} label="Ablation matériel préexistant" condLabel="vis / cerclages" />
          <Cb checked={f.greffeCotyle} onChange={v => set("greffeCotyle", v)} label="Greffe osseuse cotyle" />
        </div>
      </FormCard>
      <FormCard title="Fémur">
        <div className="field-row">
          <Field label="Râpe / taille"><input value={f.rapeTaille} onChange={e => set("rapeTaille", e.target.value)} placeholder="N°..." /></Field>
          <Field label="Type tige">
            <select value={f.typesTige} onChange={e => set("typesTige", e.target.value)}>
              <option>Standard</option><option>Latéralisée</option><option>Modulaire</option><option>Reprise</option>
            </select>
          </Field>
        </div>
        <div className="field-row">
          <Field label="Modèle tige"><input value={f.tigeModele} onChange={e => set("tigeModele", e.target.value)} placeholder="Modèle" /></Field>
          <Field label="Taille tige"><input value={f.tigeTaille} onChange={e => set("tigeTaille", e.target.value)} placeholder="N°..." /></Field>
        </div>
        <div className="field-row">
          <Field label="Col"><input value={f.col} onChange={e => set("col", e.target.value)} placeholder="Standard / Varus..." /></Field>
          <Field label="Tête">
            <select value={f.teteMat} onChange={e => set("teteMat", e.target.value)}>
              <option>Céramique</option><option>Inox</option>
            </select>
          </Field>
          <Field label="Taille tête"><input value={f.teteTaille} onChange={e => set("teteTaille", e.target.value)} placeholder="mm" /></Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.cerclageProphy} onChange={v => set("cerclageProphy", v)} label="Cerclage prophylactique" />
        </div>
        <Field label="Infiltration péri-articulaire"><input value={f.infiltration} onChange={e => set("infiltration", e.target.value)} placeholder="Protocol..." /></Field>
      </FormCard>
      <FormCard title="Gestes associés">
        <div className="cb-group">
          <Cb checked={f.tenotomiePsoas} onChange={v => set("tenotomiePsoas", v)} label="Ténotomie psoas" />
          <Cb checked={f.bursectomie} onChange={v => set("bursectomie", v)} label="Bursectomie trochantérienne" />
        </div>
        <Field label="Remarque opératoire">
          <div className="field-with-mic">
            <textarea value={f.remarqueOp} onChange={e => set("remarqueOp", e.target.value)} placeholder="Particularités opératoires..." rows={2} />
            <MicBtn field="remarqueOp" active={speech.active} onStart={speech.start} />
          </div>
        </Field>
      </FormCard>
    </>
  );
}

// ─── PTH RÉVISION ───────────────────────────
function PTHRevisionFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Type de reprise">
        <Field label="Type de changement">
          <select value={f.typeReprise} onChange={e => set("typeReprise", e.target.value)}>
            <option>Bipolaire (cup + tige)</option>
            <option>Unipolaire — cup seul</option>
            <option>Unipolaire — tige seule</option>
          </select>
        </Field>
      </FormCard>
      <FormCard title="Cotyle — reprise">
        <div className="field-row">
          <Field label="Modèle cotyle"><input value={f.cotyleModele} onChange={e => set("cotyleModele", e.target.value)} /></Field>
          <Field label="Taille"><input value={f.cotyleTaille} onChange={e => set("cotyleTaille", e.target.value)} placeholder="mm" /></Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.renfortMetal} onChange={v => set("renfortMetal", v)} label="Renfort métallique acétabulaire" condLabel="cage / augment" />
          <Cb checked={f.ablationVisCotyle} onChange={v => set("ablationVisCotyle", v)} label="Ablation vis / cerclages cotyle" />
          <Cb checked={f.greffeCotyle} onChange={v => set("greffeCotyle", v)} label="Greffe osseuse cotyle" />
          <Cb checked={f.cotyleCimente} onChange={v => set("cotyleCimente", v)} label="Implant cotyloïdien cimenté" />
          {f.cotyleCimente && (
            <div className="cond-block">
              <Cb checked={f.ablationCimentCotyle} onChange={v => set("ablationCimentCotyle", v)} label="Ablation ciment cotyle" />
            </div>
          )}
        </div>
      </FormCard>
      <FormCard title="Fémur — reprise">
        <div className="field-row">
          <Field label="Type tige reprise">
            <select value={f.typesTige} onChange={e => set("typesTige", e.target.value)}>
              <option>Modulaire</option><option>Revêtement extensif</option><option>Cimentée</option><option>Autre</option>
            </select>
          </Field>
          <Field label="Taille tige"><input value={f.tigeTaille} onChange={e => set("tigeTaille", e.target.value)} placeholder="N°..." /></Field>
        </div>
        <div className="field-row">
          <Field label="Col"><input value={f.col} onChange={e => set("col", e.target.value)} /></Field>
          <Field label="Tête">
            <select value={f.teteMat} onChange={e => set("teteMat", e.target.value)}>
              <option>Céramique</option><option>Inox</option>
            </select>
          </Field>
          <Field label="Taille tête"><input value={f.teteTaille} onChange={e => set("teteTaille", e.target.value)} placeholder="mm" /></Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.tigeCimentee} onChange={v => set("tigeCimentee", v)} label="Tige préexistante cimentée" />
          {f.tigeCimentee && (
            <div className="cond-block">
              <Cb checked={f.ciseauxAO} onChange={v => set("ciseauxAO", v)} label="Ciseaux AO" />
              <Cb checked={f.ablationCiment} onChange={v => set("ablationCiment", v)} label="Ablation ciment fémoral" />
              <Cb checked={f.femoroclasie} onChange={v => set("femoroclasie", v)} label="Fémoroclasie" condLabel="→ cerclages auto" />
            </div>
          )}
          <Cb checked={f.femoratomie} onChange={v => {
            set("femoratomie", v);
            if (v) set("cerclagesFemoratomie", true);
          }} label="Fémorotomie ETO" condLabel="→ cerclages" />
          {(f.femoratomie || f.femoroclasie) && (
            <div className="cond-block">
              <Field label="Nb cerclages">
                <input value={f.nbCerclages} onChange={e => set("nbCerclages", e.target.value)} placeholder="ex: 3" />
              </Field>
            </div>
          )}
          <Cb checked={f.cerclageProphy} onChange={v => set("cerclageProphy", v)} label="Cerclage prophylactique" />
        </div>
      </FormCard>
      <FormCard title="Gestes associés">
        <div className="cb-group">
          <Cb checked={f.tenotomiePsoas} onChange={v => set("tenotomiePsoas", v)} label="Ténotomie psoas" />
          <Cb checked={f.bursectomie} onChange={v => set("bursectomie", v)} label="Bursectomie" />
        </div>
        <Field label="Remarque opératoire">
          <div className="field-with-mic">
            <textarea value={f.remarqueOp} onChange={e => set("remarqueOp", e.target.value)} placeholder="Particularités..." rows={2} />
            <MicBtn field="remarqueOp" active={speech.active} onStart={speech.start} />
          </div>
        </Field>
      </FormCard>
    </>
  );
}

// ─── PTG ────────────────────────────────────
function PTGFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Déformation & coupes">
        <div className="field-row">
          <Field label="Déformation">
            <select value={f.deformation} onChange={e => set("deformation", e.target.value)}>
              <option>Varus</option><option>Valgus</option>
            </select>
          </Field>
          <Field label="Degrés"><input value={f.degres} onChange={e => set("degres", e.target.value)} placeholder="°" /></Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.releaseMed} onChange={v => set("releaseMed", v)} label="Release ligamentaire médial (varus)" />
          <Cb checked={f.releaseLat} onChange={v => set("releaseLat", v)} label="Release ligamentaire latéral (valgus)" />
        </div>
        <div className="field-row">
          <Field label="Fémur ACS"><input value={f.femurACS} onChange={e => set("femurACS", e.target.value)} placeholder="N°..." /></Field>
          <Field label="Plateau ACS"><input value={f.plateauACS} onChange={e => set("plateauACS", e.target.value)} placeholder="N°..." /></Field>
        </div>
        <div className="field-row">
          <Field label="Insert">
            <select value={f.insert} onChange={e => set("insert", e.target.value)}>
              <option>CR — conservation LCP</option><option>PS — sacrifice LCP</option>
            </select>
          </Field>
          <Field label="Épaisseur insert"><input value={f.insertEp} onChange={e => set("insertEp", e.target.value)} placeholder="mm" /></Field>
        </div>
      </FormCard>
      <FormCard title="Rotule & implants">
        <div className="cb-group">
          <Cb checked={f.resurfacageRotule} onChange={v => set("resurfacageRotule", v)} label="Resurfaçage rotulien" condLabel="systématique" />
          {f.resurfacageRotule && (
            <div className="cond-block">
              <Field label="Bouton rotulien"><input value={f.boutonRotule} onChange={e => set("boutonRotule", e.target.value)} placeholder="Modèle / taille" /></Field>
            </div>
          )}
          <Cb checked={f.ablationMatPTG} onChange={v => set("ablationMatPTG", v)} label="Ablation matériel préexistant (agrafes, vis)" />
          <Cb checked={f.synovectomie} onChange={v => set("synovectomie", v)} label="Synovectomie" />
        </div>
        <Field label="Flexion obtenue"><input value={f.flexion} onChange={e => set("flexion", e.target.value)} placeholder="°" /></Field>
      </FormCard>
      <FormCard title="Remarque opératoire">
        <div className="field-with-mic">
          <textarea value={f.remarqueOp} onChange={e => set("remarqueOp", e.target.value)} placeholder="Particularités opératoires..." rows={2} />
          <MicBtn field="remarqueOp" active={speech.active} onStart={speech.start} />
        </div>
      </FormCard>
    </>
  );
}

// ─── LCA ────────────────────────────────────
function LCAFields({ f, set, speech }) {
  const dtAvailable = f.greffon === "DT3+2" || f.greffon === "DIDT";
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Greffon">
        <Field label="Type de greffon">
          <select value={f.greffon} onChange={e => set("greffon", e.target.value)}>
            <option>DT3+2</option><option>DIDT</option><option>Fascia lata</option><option>Allogreffe</option>
          </select>
        </Field>
        <div className="field-row">
          <Field label="Ø tibial"><input value={f.diamTibial} onChange={e => set("diamTibial", e.target.value)} placeholder="mm" /></Field>
          <Field label="Ø fémoral"><input value={f.diamFemoral} onChange={e => set("diamFemoral", e.target.value)} placeholder="mm" /></Field>
        </div>
        <div className="field-row">
          <Field label="Vis tibiale"><input value={f.visTibiale} onChange={e => set("visTibiale", e.target.value)} placeholder="Modèle / taille" /></Field>
          <Field label="Vis fémorale"><input value={f.visFemorale} onChange={e => set("visFemorale", e.target.value)} placeholder="Modèle / taille" /></Field>
        </div>
        <Field label="Ressaut rotatoire">
          <select value={f.ressaut} onChange={e => set("ressaut", e.target.value)}>
            <option>Positif</option><option>Négatif</option><option>Douteux</option>
          </select>
        </Field>
      </FormCard>
      <FormCard title="Ménisques">
        <div className="cb-group">
          <Cb checked={f.regMed} onChange={v => set("regMed", v)} label="Régularisation méniscale médiale" />
          <Cb checked={f.regLat} onChange={v => set("regLat", v)} label="Régularisation méniscale latérale" />
          <Cb checked={f.sutureMed} onChange={v => set("sutureMed", v)} label="Suture méniscale médiale" condLabel="→ INNOHEP 45j" />
          <Cb checked={f.sutureLat} onChange={v => set("sutureLat", v)} label="Suture méniscale latérale" condLabel="→ INNOHEP 45j" />
          <Cb checked={f.rampTrans} onChange={v => set("rampTrans", v)} label="Ramp lésion — suture transtibiale" />
          <Cb checked={f.rampAllInside} onChange={v => set("rampAllInside", v)} label="Ramp lésion — all-inside" />
        </div>
      </FormCard>
      <FormCard title="Cartilage & retour externe">
        <div className="cb-group">
          <Cb checked={f.chondroplastie} onChange={v => set("chondroplastie", v)} label="Chondroplastie" />
          <Cb checked={f.microfractures} onChange={v => set("microfractures", v)} label="Microfractures" />
          {f.microfractures && (
            <div className="cond-block">
              <Field label="Localisation microfractures">
                <input value={f.microLoc} onChange={e => set("microLoc", e.target.value)} placeholder="CI med, CI lat..." />
              </Field>
            </div>
          )}
          <Cb
            checked={f.retourExterne}
            onChange={v => set("retourExterne", v)}
            label={`Retour externe — Lemaire${dtAvailable ? (f.greffon === "DIDT" ? " sur DI" : " sur brin accessoire DT") : ""}`}
          />
        </div>
        <Field label="Lésions cartilagineuses">
          <div className="field-with-mic">
            <input value={f.lesionCart} onChange={e => set("lesionCart", e.target.value)} placeholder="Description..." />
            <MicBtn field="lesionCart" active={speech.active} onStart={speech.start} />
          </div>
        </Field>
      </FormCard>
      <FormCard title="Remarque opératoire">
        <div className="field-with-mic">
          <textarea value={f.remarqueOp} onChange={e => set("remarqueOp", e.target.value)} placeholder="Particularités..." rows={2} />
          <MicBtn field="remarqueOp" active={speech.active} onStart={speech.start} />
        </div>
      </FormCard>
    </>
  );
}

// ─── ARTHROSCOPIE ───────────────────────────
function ArthroscopieFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Gestes arthroscopiques">
        <div className="cb-group">
          <Cb checked={f.regMenMed} onChange={v => set("regMenMed", v)} label="Régularisation méniscale médiale" />
          <Cb checked={f.regMenLat} onChange={v => set("regMenLat", v)} label="Régularisation méniscale latérale" />
          <Cb checked={f.sutureMen} onChange={v => set("sutureMen", v)} label="Suture méniscale" />
          <Cb checked={f.chondroplastie} onChange={v => set("chondroplastie", v)} label="Chondroplastie" />
          <Cb checked={f.microfractures} onChange={v => set("microfractures", v)} label="Microfractures" />
          <Cb checked={f.synovectomie} onChange={v => set("synovectomie", v)} label="Synovectomie arthroscopique" />
          <Cb checked={f.corpsEtrangers} onChange={v => set("corpsEtrangers", v)} label="Ablation corps étrangers" />
        </div>
      </FormCard>
      <FormCard title="Détail opératoire">
        <div className="field-with-mic">
          <textarea value={f.detailOp} onChange={e => set("detailOp", e.target.value)} placeholder="Description arthroscopique détaillée..." rows={4} />
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start} />
        </div>
      </FormCard>
    </>
  );
}

// ─── ABLATION MATÉRIEL ──────────────────────
function AblationFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Voie d'abord">
        <Field label="Voie d'abord">
          <select value={f.voieAbord} onChange={e => set("voieAbord", e.target.value)}>
            <option>Reprise cicatrice antérieure</option>
            <option>Médiale para-patellaire</option>
            <option>Postéro-latérale hanche</option>
            <option>Antérieure cheville</option>
            <option>Postérieure cheville</option>
            <option>Dorsale poignet</option>
            <option>Antérieure jambe</option>
            <option>Autre (préciser)</option>
          </select>
        </Field>
        {f.voieAbord === "Autre (préciser)" && (
          <Field label="Préciser">
            <div className="field-with-mic">
              <input value={f.voieAbordDetail} onChange={e => set("voieAbordDetail", e.target.value)} />
              <MicBtn field="voieAbordDetail" active={speech.active} onStart={speech.start} />
            </div>
          </Field>
        )}
      </FormCard>
      <FormCard title="Matériel">
        <div className="field-row">
          <Field label="Type implant">
            <select value={f.typeImplant} onChange={e => set("typeImplant", e.target.value)}>
              <option>Vis(s)</option><option>Clou centromédullaire</option><option>Plaque-vis</option>
              <option>Cerclages</option><option>Broches</option><option>Matériel mixte</option>
            </select>
          </Field>
          <Field label="Localisation">
            <select value={f.locImplant} onChange={e => set("locImplant", e.target.value)}>
              <option>Cheville</option><option>Jambe</option><option>Genou</option><option>Fémur</option>
              <option>Hanche</option><option>Poignet</option><option>Avant-bras</option><option>Autre</option>
            </select>
          </Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.ablationComplete} onChange={v => set("ablationComplete", v)} label="Ablation complète" />
          <Cb checked={f.ablationPartielle} onChange={v => set("ablationPartielle", v)} label="Ablation partielle" />
          <Cb checked={f.diffTechnique} onChange={v => set("diffTechnique", v)} label="Difficulté technique" condLabel="ossification / visserie bloquée" />
        </div>
      </FormCard>
      <FormCard title="Détail opératoire">
        <div className="field-with-mic">
          <textarea value={f.detailOp} onChange={e => set("detailOp", e.target.value)} placeholder="Description opératoire détaillée..." rows={4} />
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start} />
        </div>
      </FormCard>
    </>
  );
}

// ─── FRACTURES ──────────────────────────────
function FractureFields({ f, set, speech }) {
  return (
    <>
      <PatientFields f={f} set={set} speech={speech} />
      <FormCard title="Installation & sécurité">
        <div className="field-row">
          <Field label="Installation">
            <select value={f.installation} onChange={e => set("installation", e.target.value)}>
              <option>Décubitus dorsal</option><option>Décubitus latéral</option><option>Décubitus ventral</option><option>Table orthopédique</option>
            </select>
          </Field>
          <Field label="Amplificateur">
            <RadioGroup value={f.ampli} onChange={v => set("ampli", v)} options={["Oui", "Non"]} />
          </Field>
        </div>
        <div className="field-row">
          <Field label="Garrot">
            <RadioGroup value={f.garrot} onChange={v => set("garrot", v)} options={["Oui", "Non"]} />
          </Field>
          {f.garrot === "Oui" && (
            <Field label="Pression garrot">
              <input value={f.garrotPression} onChange={e => set("garrotPression", e.target.value)} placeholder="mmHg" />
            </Field>
          )}
        </div>
        <div className="cb-group">
          <Cb checked={f.antibioprophylaxie} onChange={v => set("antibioprophylaxie", v)} label="Antibioprophylaxie — Céfazoline 2g IV" />
          <Cb checked={f.checklistOK} onChange={v => set("checklistOK", v)} label="Check-list HAS validée" />
        </div>
      </FormCard>
      <FormCard title="Fracture & fixation">
        <div className="field-row">
          <Field label="Localisation">
            <select value={f.locFracture} onChange={e => set("locFracture", e.target.value)}>
              <option>Cheville</option><option>Poignet / radius distal</option><option>ESF</option><option>Diaphyse fémorale</option>
              <option>Plateau tibial</option><option>Diaphyse tibiale</option><option>Autre</option>
            </select>
          </Field>
          <Field label="Fixation">
            <select value={f.fixation} onChange={e => set("fixation", e.target.value)}>
              <option>Enclouage centromédullaire</option><option>Plaque-vis</option><option>Vis seules</option>
              <option>Broches</option><option>DHS</option><option>Clou gamma</option><option>Mixte</option>
            </select>
          </Field>
        </div>
        <div className="cb-group">
          <Cb checked={f.greffe} onChange={v => set("greffe", v)} label="Greffe osseuse / substitut" />
          <Cb checked={f.geszteLig} onChange={v => set("geszteLig", v)} label="Geste ligamentaire associé" />
        </div>
      </FormCard>
      <FormCard title="Description opératoire (texte libre)">
        <div className="field-with-mic">
          <textarea value={f.detailOp} onChange={e => set("detailOp", e.target.value)}
            placeholder="Trait de fracture, qualité de réduction, détail de la fixation, contrôle scopique, fermeture..." rows={6} />
          <MicBtn field="detailOp" active={speech.active} onStart={speech.start} />
        </div>
      </FormCard>
    </>
  );
}

// ═══════════════════════════════════════════
//  GÉNÉRATION TEXTE PREVIEW
// ═══════════════════════════════════════════
function ptNom(f) { return `${f.civ || ""} ${f.nom?.toUpperCase() || "—"} ${f.prenom || ""}`.trim(); }
function dateStr(d) { if (!d) return "—"; const [y,m,j] = d.split("-"); return `${j}/${m}/${y}`; }
function coteStr(f) { return f.cote || "—"; }

function buildCRO_PTH(f) {
  const rev = f._inter === "pth_revision";
  const blocs = [];
  if (f.renfortMetal) blocs.push("mise en place d'un renfort métallique acétabulaire (cage/augment)");
  if (f.ablationMat || f.ablationVisCotyle) blocs.push("ablation du matériel préexistant (visserie / cerclages)");
  if (f.greffeCotyle) blocs.push("greffe osseuse acétabulaire");
  if (rev && f.cotyleCimente && f.ablationCimentCotyle) blocs.push("ablation du ciment cotyloïdien");
  if (rev && f.tigeCimentee) {
    let s = "ablation tige cimentée";
    if (f.ciseauxAO) s += " aux ciseaux AO";
    if (f.ablationCiment) s += " avec ablation ciment fémoral";
    if (f.femoroclasie) s += " — fémoroclasie réalisée";
    blocs.push(s);
  }
  if (rev && f.femoratomie) blocs.push(`fémorotomie ETO réalisée avec synthèse par ${f.nbCerclages || "?"} cerclages`);
  if (f.cerclageProphy) blocs.push("cerclage prophylactique fémoral");
  if (f.tenotomiePsoas) blocs.push("ténotomie du psoas");
  if (f.bursectomie) blocs.push("bursectomie trochantérienne");
  const blocsStr = blocs.length ? `\n\nGestes associés : ${blocs.join(", ")}.` : "";

  return `COMPTE-RENDU OPÉRATOIRE
${rev ? "PTH DE RÉVISION" : "PROTHÈSE TOTALE DE HANCHE"} — CÔTÉ ${coteStr(f).toUpperCase()}

Patient : ${ptNom(f)} — né(e) le ${dateStr(f.ddn)} (${f.age || "—"} ans)
Date d'intervention : ${dateStr(f.dateInter)}
Chirurgien : Dr T. ROUSSEL — Pr C. CHANTELOT (aides : ${f.aides || "—"})
Anesthésie : ${f.anesthesie || "—"}

INSTALLATION
Décubitus latéral opposé. Champ opératoire selon protocole CHU.

VOIE D'ABORD
Voie postéro-latérale de Moore. Désinsertion des pelvitrochantériens. Arthrotomie postérieure.

TEMPS COTYLOÏDIEN
Luxation de la prothèse${rev ? " — dépose cup" : ""}. Fraisage acétabulaire progressif. ${f.cotyleModele || "Cotyle"} ${f.cotyleTaille || "—"} mm impacté en position satisfaisante (antéversion 15°, inclinaison 40°).${blocs.filter(b => b.includes("acétabu") || b.includes("cotyle") || b.includes("greffe")).length ? "\n[" + blocs.filter(b => b.includes("acétabu") || b.includes("cotyle") || b.includes("greffe")).join(" — ") + "]" : ""}

TEMPS FÉMORAL
Préparation du fémur. Râpe N°${f.rapeTaille || "—"}. Tige ${f.tigeModele || "—"} ${f.tigeTaille || "—"}${rev ? " (reprise — " + (f.typesTige || "") + ")" : " (" + (f.typesTige || "standard") + ")"}. Col ${f.col || "standard"}. Tête ${f.teteTaille || "—"} mm ${f.teteMat || "céramique"}.${blocsStr}

RÉDUCTION — STABILITÉ
Réduction de la prothèse. Test de stabilité satisfaisant — pas de conflit, amplitude complète. Infiltration péri-articulaire${f.infiltration ? " : " + f.infiltration : " selon protocole"}.

FERMETURE
Réinsertion des pelvitrochantériens. Fermeture plan par plan. Vicryl 2 + Stratafix. Agrafes cutanées. Pansement compressif.`;
}

function buildCRO_PTG(f) {
  const def = f.deformation || "Varus";
  const deg = f.degres ? ` de ${f.degres}°` : "";
  const releaseStr = f.releaseMed ? " Release ligamentaire médial réalisée." : f.releaseLat ? " Release ligamentaire latéral réalisée." : "";
  return `COMPTE-RENDU OPÉRATOIRE
PROTHÈSE TOTALE DU GENOU — CÔTÉ ${coteStr(f).toUpperCase()}

Patient : ${ptNom(f)} — né(e) le ${dateStr(f.ddn)} (${f.age || "—"} ans)
Date d'intervention : ${dateStr(f.dateInter)}
Chirurgien : Dr T. ROUSSEL — Pr C. CHANTELOT (aides : ${f.aides || "—"})
Anesthésie : ${f.anesthesie || "—"}

INSTALLATION
Décubitus dorsal. Garrot pneumatique. Champ opératoire selon protocole CHU.

VOIE D'ABORD
Voie médiale para-patellaire. Résection du Hoffa. Mise en place du pivot central.${f.ablationMatPTG ? "\n[Ablation matériel préexistant réalisée (agrafes / visserie).]" : ""}

COUPES OSSEUSES
Déformation en ${def}${deg}.${releaseStr} Coupe tibiale première (hémi-espaceur). Temps fémoral : guide Mehary puis faux espaceur. Coupes fémorales à 5 valgus. Mesure des espaces en flexion-extension — équilibre satisfaisant.

IMPLANTS
Fémur ACS N°${f.femurACS || "—"} · Plateau ACS N°${f.plateauACS || "—"} · Insert ${f.insert || "CR"} ${f.insertEp || "—"} mm.${f.resurfacageRotule ? `\nResurfaçage rotulien systématique : bouton ${f.boutonRotule || "—"}. No thumb test négatif.` : ""}${f.synovectomie ? "\nSynovectomie réalisée." : ""}

CIMENTATION
Cimentation composants tibial et fémoral en deux temps. Retrait des excès de ciment.

FERMETURE
Flexion obtenue : ${f.flexion || "—"}°. Vicryl 2 + Stratafix / Vicryl 0 capsule. Agrafes cutanées. Pansement compressif.${f.remarqueOp ? "\n\nREMARQUE : " + f.remarqueOp : ""}`;
}

function buildCRO_LCA(f) {
  const suture = f.sutureMed || f.sutureLat || f.rampTrans || f.rampAllInside;
  const innohep = suture ? "45 jours" : "21 jours";
  const greffon = f.greffon || "DT3+2";
  const retStr = f.retourExterne
    ? `\nRetour externe de Lemaire modifié (${greffon === "DIDT" ? "sur DI" : greffon === "DT3+2" ? "sur brin accessoire DT" : "fascia lata"}). Tunnel 6 mm. Endobouton. Fixation en rotation neutre extension complète.`
    : "";
  return `COMPTE-RENDU OPÉRATOIRE
LIGAMENTOPLASTIE LCA — CÔTÉ ${coteStr(f).toUpperCase()}

Patient : ${ptNom(f)} — né(e) le ${dateStr(f.ddn)} (${f.age || "—"} ans)
Date d'intervention : ${dateStr(f.dateInter)}
Chirurgien : Dr T. ROUSSEL — Pr C. CHANTELOT (aides : ${f.aides || "—"})
Anesthésie : ${f.anesthesie || "—"} — Ressaut rotatoire : ${f.ressaut || "positif"}

INSTALLATION
Décubitus dorsal, flexion à 90°. Garrot pneumatique 300 mmHg. Champ opératoire selon protocole CHU.

PRÉLÈVEMENT ${greffon}
Voie patte d'oie. Stripper atraumatique. Préservation des vinculas. Compresse à la Vancomycine pédiculée sur le site de prélèvement. Préparation : TigerStick + XBRAID. Calibrage.

EXPLORATION ARTHROSCOPIQUE
Voie optique antéro-latérale puis antéro-médiale à l'aiguille. Section du ligament suspenseur de Hoffa — préservation du pied tibial. Exploration des 4 compartiments.${f.regMed ? "\nRégularisation méniscale médiale." : ""}${f.regLat ? "\nRégularisation méniscale latérale." : ""}${f.sutureMed ? "\nSuture méniscale médiale réalisée." : ""}${f.sutureLat ? "\nSuture méniscale latérale réalisée." : ""}${f.rampTrans ? "\nRamp lésion — suture transtibiale réalisée." : ""}${f.rampAllInside ? "\nRamp lésion — all-inside réalisée." : ""}${f.chondroplastie ? "\nChondroplastie réalisée." : ""}${f.microfractures ? `\nMicrofractures : ${f.microLoc || "—"}.` : ""}

TEMPS TIBIAL
Guide à 55°. Mèche 9 mm. Shaver. Tunnelisation tibiale.

TEMPS FÉMORAL
Contre-abord épicondyle latéral. Guide outside-in à 55°. Tunnelisation fémorale.

FIXATION
Montée des fils relais. Cyclage du greffon. Fixation fémur : vis d'interférence ${f.visFemorale || "—"}. Fixation tibiale à 30° de flexion : ${f.visTibiale || "—"}.${retStr}

CONTRÔLE
Lachman et tiroir antérieur négatifs. Ressaut absent.

FERMETURE
INNOHEP ${innohep}. Vicryl 2-0 / 3-0 rapide. Pansement sec.${f.remarqueOp ? "\n\nREMARQUE : " + f.remarqueOp : ""}`;
}

function buildCRH(f) {
  const inter = f._inter;
  const suture = f.sutureMed || f.sutureLat || f.rampTrans || f.rampAllInside;
  const innohepDur = inter === "lca" ? (suture ? "45" : "21") : inter === "pth" || inter === "pth_revision" ? "35" : "21";

  if (inter === "lca") {
    return `Cher Confrère,

Nous avons eu le plaisir de prendre en charge votre patient(e) ${ptNom(f)}, né(e) le ${dateStr(f.ddn)}, en ambulatoire le ${dateStr(f.dateInter)} pour une ligamentoplastie du LCA ${coteStr(f)} sous ${f.anesthesie || "anesthésie loco-régionale"}.

Le geste opératoire a consisté en une reconstruction du LCA par greffon ${f.greffon || "DT3+2"}${f.retourExterne ? " avec retour externe de Lemaire modifié" : ""}. ${suture ? "Un geste méniscal complémentaire (suture) a été réalisé." : ""}

Les suites opératoires ont été simples. Sortie le jour même.

CONSIGNES DE SORTIE
— Appui autorisé ${suture ? "avec 2 cannes pendant 1 mois" : "complet d'emblée"}
— Pansements à renouveler tous les 48h
— Ablation des agrafes à J15
— Kinésithérapie en urgence : protocole DT3+2 (prescription jointe)
— INNOHEP 4000 UI pendant ${innohepDur} jours
— Antalgiques selon prescription

Rendez-vous de contrôle à 4 semaines avec radiographies.

Nous restons à votre disposition pour tout renseignement complémentaire.

Dr T. ROUSSEL — Service de Chirurgie Orthopédique
Pr C. CHANTELOT — CHU Lille, Hôpital Roger Salengro`;
  }

  if (inter === "ptg") {
    return `Cher Confrère,

Nous avons eu le plaisir de prendre en charge votre patient(e) ${ptNom(f)}, né(e) le ${dateStr(f.ddn)}, hospitalisé(e) du ${dateStr(f.dateInter)} au ${dateStr(f.dateSortie)} pour la mise en place d'une prothèse totale du genou ${coteStr(f)} sous ${f.anesthesie || "rachianesthésie"}.

L'intervention s'est parfaitement déroulée. Déformation initiale en ${f.deformation || "varus"} de ${f.degres || "—"}°. Flexion obtenue : ${f.flexion || "—"}°. Suites simples par ailleurs, sortie ce jour.

CONSIGNES DE SORTIE
— Kinésithérapie intensive — appui complet d'emblée
— Pansements à renouveler tous les 4 jours
— Ablation des agrafes à J15
— INNOHEP 4000 UI pendant ${innohepDur} jours
— Antalgiques selon prescription

Rendez-vous de contrôle à 6 semaines avec pangonogramme.

Nous restons à votre disposition.

Dr T. ROUSSEL — Service de Chirurgie Orthopédique
Pr C. CHANTELOT — CHU Lille, Hôpital Roger Salengro`;
  }

  return `Cher Confrère,

Nous avons eu le plaisir de prendre en charge votre patient(e) ${ptNom(f)}, né(e) le ${dateStr(f.ddn)}, hospitalisé(e) du ${dateStr(f.dateInter)} au ${dateStr(f.dateSortie)} pour la mise en place d'une ${inter === "pth_revision" ? "prothèse totale de hanche de révision" : "prothèse totale de hanche"} ${coteStr(f)} sous ${f.anesthesie || "rachianesthésie"}.

L'intervention s'est parfaitement déroulée. Suites simples. Kinésithérapie avec reprise de la marche débutée dès J1.

CONSIGNES DE SORTIE
— Pansements à renouveler tous les 4 jours
— Ablation des agrafes à J15
— Kinésithérapie de rééducation
— Appui complet autorisé + précautions anti-luxation pendant 6 semaines
— Antalgiques selon prescription
— INNOHEP 4000 UI pendant ${innohepDur} jours

Rendez-vous de contrôle à 6 semaines avec radio bassin + hanche de face.

Nous restons à votre disposition.

Dr T. ROUSSEL — Service de Chirurgie Orthopédique
Pr C. CHANTELOT — CHU Lille, Hôpital Roger Salengro`;
}

function buildOrdoKineeLCA() {
  return `ORDONNANCE KINÉSITHÉRAPIE — PROTOCOLE DT3+2

LIGAMENTOPLASTIE LCA — PROTOCOLE DT3+2

Phase 1 — S1 à S3
Travail de cicatrisation, lutte contre l'épanchement. Mobilisation douce. Travail isométrique quadriceps. Électrostimulation.

Phase 2 — S3 à M2
Récupération des amplitudes articulaires. Renforcement musculaire en chaîne fermée. Proprioception de base. Marche sans cannes si non prescrites.

Phase 3 — M2 à M4
Renforcement musculaire progressif. Travail excentrique IJ. Proprioception avancée. Début vélo / natation.

Phase 4 — Test isocinétique à M4
Évaluation : rapport IJ/Q ≥ 60%, déficit ≤ 15%. Décision de poursuite selon résultat.

Phase 5 — M4 à M6
Course à pied sur terrain plat. Travail pliométrique débuté. Appui monopodal.

Phase 6 — M6 à M9
Course avec changements de direction. Exercices spécifiques sport. Travail de vitesse.

Phase 7 — M9 à M12
Reprise progressive de l'activité sportive. Reprise de la compétition autorisée à environ 1 an post-opératoire sous couvert d'un test isocinétique satisfaisant.

Nombre de séances : non limité — à adapter selon progression clinique`;
}

function buildOrdoPharma(f) {
  const inter = f._inter;
  const suture = f.sutureMed || f.sutureLat || f.rampTrans || f.rampAllInside;
  const innohepDur = inter === "lca" ? (suture ? 45 : 21) : inter?.includes("pth") ? 35 : 21;
  return `ORDONNANCE PHARMACEUTIQUE

Patient : ${ptNom(f)} — né(e) le ${dateStr(f.ddn)}
Date : ${dateStr(f.dateInter)}

— INNOHEP 4000 UI/0.4mL — 1 injection sous-cutanée par jour pendant ${innohepDur} jours
— PARACETAMOL 1g — 1 comprimé toutes les 6h si douleur (max 4g/j)
— IBUPROFENE 400mg — 1 comprimé toutes les 8h pendant 5 jours (si pas de contre-indication)
— Protection gastrique si AINS prolongés

Renouvellement non autorisé sauf avis médical.
Dr T. ROUSSEL — RPPS 10102203147`;
}

function buildOrdoIDE(f) {
  return `ORDONNANCE INFIRMIÈRE

Patient : ${ptNom(f)} — né(e) le ${dateStr(f.ddn)}
Date : ${dateStr(f.dateInter)}

— Injection INNOHEP 4000 UI SC 1x/jour pendant la durée prescrite
— Surveillance et renouvellement pansement tous les 2-4 jours selon intervention
— Contrôle point de ponction
— Signaler tout signe inflammatoire local, fièvre > 38.5°C, douleur inhabituelle

Dr T. ROUSSEL — RPPS 10102203147`;
}

// ─── GENERATEURS DOCX ───────────────────────
// Import simplifié — utilise docx.js
async function generateDocx(title, content) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const paragraphs = content.split("\n").map(line => {
    if (!line.trim()) return new Paragraph({});
    const isBold = line === line.toUpperCase() && line.length > 4 && line.trim().length > 0 && /^[A-ZÉÀÈÙ\s\-—]+$/.test(line.trim());
    return new Paragraph({
      children: [new TextRun({ text: line, bold: isBold, size: 20, font: "Calibri" })],
    });
  });
  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }]
  });
  return Packer.toBlob(doc);
}

// ═══════════════════════════════════════════
//  CONFIGURATION INTERVENTIONS
// ═══════════════════════════════════════════
const INTERVENTIONS = {
  hanche: [
    { id: "pth", label: "PTH", sub: "Prothèse totale de hanche", color: "hanche" },
    { id: "pth_revision", label: "PTH de révision", sub: "Reprise uni/bipolaire", color: "hanche" },
  ],
  genou: [
    { id: "ptg", label: "PTG", sub: "Prothèse totale du genou", color: "genou" },
    { id: "lca", label: "LCA", sub: "Ligamentoplastie", color: "genou" },
    { id: "arthroscopie", label: "Arthroscopie genou", sub: "Diagnostique/thérapeutique", color: "genou" },
  ],
  trauma: [
    { id: "fracture", label: "Fracture", sub: "Cheville / Poignet / ESF", color: "trauma" },
    { id: "ablation", label: "Ablation matériel", sub: "Vis / Clou / Plaque", color: "trauma" },
  ],
  autre: [],
};

const DOCS_BY_INTER = {
  pth: ["CRO", "CRH", "Ordo pharma", "Ordo IDE", "Ordo kiné", "Ordo matériel"],
  pth_revision: ["CRO", "CRH", "Ordo pharma", "Ordo IDE", "Ordo kiné"],
  ptg: ["CRO", "CRH", "Ordo pharma", "Ordo IDE", "Ordo kiné", "Ordo matériel"],
  lca: ["CRO", "CRH", "Ordo pharma", "Ordo IDE", "Ordo kiné LCA"],
  arthroscopie: ["CRO", "CRH", "Ordo pharma", "Ordo IDE"],
  fracture: ["CRO", "CRH", "Ordo pharma", "Ordo IDE"],
  ablation: ["CRO", "CRH", "Ordo pharma", "Ordo IDE"],
};

const DEFAULT_FIELDS = {
  civ: "M.", nom: "", prenom: "", ddn: "", age: "", dateInter: "", dateSortie: "",
  cote: "Droit", anesthesie: "Rachianesthésie", medTraitant: "", indication: "", atcd: "", aides: "",
  // PTH
  cotyleModele: "", cotyleTaille: "", renfortMetal: false, ablationMat: false, greffeCotyle: false,
  rapeTaille: "", typesTige: "Standard", tigeModele: "", tigeTaille: "",
  col: "", teteMat: "Céramique", teteTaille: "", cerclageProphy: false, infiltration: "",
  tenotomiePsoas: false, bursectomie: false,
  // PTH révision spécifique
  typeReprise: "Bipolaire (cup + tige)", cotyleCimente: false, ablationCimentCotyle: false,
  ablationVisCotyle: false, tigeCimentee: false, ciseauxAO: false, ablationCiment: false,
  femoroclasie: false, femoratomie: false, nbCerclages: "", cerclagesFemoratomie: false,
  // PTG
  deformation: "Varus", degres: "", releaseMed: false, releaseLat: false,
  femurACS: "", plateauACS: "", insert: "CR — conservation LCP", insertEp: "",
  resurfacageRotule: true, boutonRotule: "", ablationMatPTG: false, synovectomie: false, flexion: "",
  // LCA
  greffon: "DT3+2", diamTibial: "", diamFemoral: "", visTibiale: "", visFemorale: "",
  ressaut: "Positif", regMed: false, regLat: false, sutureMed: false, sutureLat: false,
  rampTrans: false, rampAllInside: false, chondroplastie: false, microfractures: false,
  microLoc: "", retourExterne: true, lesionCart: "",
  // Arthroscopie
  regMenMed: false, regMenLat: false, sutureMen: false, corpsEtrangers: false,
  detailOp: "",
  // Ablation
  voieAbord: "Reprise cicatrice antérieure", voieAbordDetail: "",
  typeImplant: "Vis(s)", locImplant: "Cheville", ablationComplete: true, ablationPartielle: false, diffTechnique: false,
  // Fractures
  installation: "Décubitus dorsal", ampli: "Oui", garrot: "Non", garrotPression: "",
  antibioprophylaxie: true, checklistOK: true,
  locFracture: "Cheville", fixation: "Plaque-vis", greffe: false, geszteLig: false,
  remarqueOp: "",
};

// ═══════════════════════════════════════════
//  APP PRINCIPALE
// ═══════════════════════════════════════════
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("od_theme") || "light");
  const [spec, setSpec] = useState("hanche");
  const [screen, setScreen] = useState("home"); // home | form | preview | done
  const [inter, setInter] = useState(null);
  const [fields, setFields] = useState({ ...DEFAULT_FIELDS });
  const [activeDocs, setActiveDocs] = useState([]);
  const [previewDoc, setPreviewDoc] = useState(0);
  const [history, setHistory] = useState(loadHistory);
  const [generated, setGenerated] = useState([]);
  const [toast, setToast] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("od_theme", theme);
  }, [theme]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const setField = useCallback((k, v) => setFields(f => ({ ...f, [k]: v })), []);

  const speech = useSpeech((field, text) => {
    setFields(f => ({ ...f, [field]: (f[field] ? f[field] + " " : "") + text }));
  });

  const openInter = (id) => {
    setInter(id);
    setFields({ ...DEFAULT_FIELDS, _inter: id });
    setActiveDocs(DOCS_BY_INTER[id] || []);
    setScreen("form");
  };

  const reopenHistory = (entry) => {
    setInter(entry.inter);
    setFields({ ...entry.fields, _inter: entry.inter });
    setActiveDocs(entry.activeDocs || DOCS_BY_INTER[entry.inter] || []);
    setScreen("form");
  };

  const toggleDoc = (doc) => {
    setActiveDocs(d => d.includes(doc) ? d.filter(x => x !== doc) : [...d, doc]);
  };

  // ─── PREVIEW ─────────────────────────────
  const getDocContent = (doc) => {
    const f = fields;
    if (doc === "CRO") {
      if (inter === "pth" || inter === "pth_revision") return buildCRO_PTH(f);
      if (inter === "ptg") return buildCRO_PTG(f);
      if (inter === "lca") return buildCRO_LCA(f);
      if (inter === "arthroscopie") return f.detailOp || "(Détail opératoire à saisir)";
      if (inter === "fracture") return `COMPTE-RENDU OPÉRATOIRE\nFRACTURE — ${f.locFracture?.toUpperCase() || ""}\n\nPatient : ${ptNom(f)}\nDate : ${dateStr(f.dateInter)}\nInstallation : ${f.installation}\nFixation : ${f.fixation}\n\n${f.detailOp || "(Description à saisir)"}`;
      if (inter === "ablation") return `COMPTE-RENDU OPÉRATOIRE\nABLATION MATÉRIEL — ${f.locImplant?.toUpperCase() || ""}\n\nPatient : ${ptNom(f)}\nDate : ${dateStr(f.dateInter)}\nVoie d'abord : ${f.voieAbord}\nMatériel : ${f.typeImplant}\n\n${f.detailOp || "(Description à saisir)"}`;
    }
    if (doc === "CRH") return buildCRH(f);
    if (doc === "Ordo pharma") return buildOrdoPharma(f);
    if (doc === "Ordo IDE") return buildOrdoIDE(f);
    if (doc === "Ordo kiné" || doc === "Ordo kiné LCA") return buildOrdoKineeLCA();
    return "(Document à définir)";
  };

  // ─── GÉNÉRATION ──────────────────────────
  const handleGenerate = async () => {
    setGenerating(true);
    const entry = {
      id: Date.now().toString(),
      inter, fields, activeDocs,
      nom: `${fields.nom} ${fields.prenom}`.trim(),
      interLabel: INTERVENTIONS[spec]?.find(i => i.id === inter)?.label || inter,
      date: fields.dateInter,
    };
    saveToHistory(entry);
    setHistory(loadHistory());

    const docs = [];
    for (const doc of activeDocs) {
      const content = getDocContent(doc);
      try {
        const blob = await generateDocx(doc, content);
        const nom = (fields.nom || "Patient").toUpperCase();
        const date = fields.dateInter?.replace(/-/g, "") || "date";
        const fname = `${doc.replace(/\s/g, "_")}_${nom}_${date}.docx`;
        docs.push({ name: fname, blob, doc });
      } catch (e) {
        console.error(e);
      }
    }
    setGenerated(docs);
    setGenerating(false);
    setScreen("done");
  };

  const downloadDoc = (item) => {
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement("a");
    a.href = url; a.download = item.name; a.click();
    URL.revokeObjectURL(url);
    showToast(`↓ ${item.name}`);
  };

  const downloadAll = () => generated.forEach(downloadDoc);

  const sendMail = () => {
    const nom = `${fields.nom} ${fields.prenom}`.trim();
    const interLabel = INTERVENTIONS[spec]?.find(i => i.id === inter)?.label || inter || "";
    const subject = `Documents post-opératoires — ${nom} — ${interLabel} — ${dateStr(fields.dateInter)}`;
    const body = `Bonjour,\n\nVeuillez trouver ci-joints les documents post-opératoires pour ${nom} (${interLabel} du ${dateStr(fields.dateInter)}).\n\nFichiers à joindre :\n${generated.map(d => "• " + d.name).join("\n")}\n\nCordialement,\nDr T. ROUSSEL`;
    window.location.href = `mailto:coralie.wallaert@chu-lille.fr?cc=alexandre1.delmeire@chu-lille.fr&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getFormComponent = () => {
    if (inter === "pth") return <PTHFields f={fields} set={setField} speech={speech} />;
    if (inter === "pth_revision") return <PTHRevisionFields f={fields} set={setField} speech={speech} />;
    if (inter === "ptg") return <PTGFields f={fields} set={setField} speech={speech} />;
    if (inter === "lca") return <LCAFields f={fields} set={setField} speech={speech} />;
    if (inter === "arthroscopie") return <ArthroscopieFields f={fields} set={setField} speech={speech} />;
    if (inter === "ablation") return <AblationFields f={fields} set={setField} speech={speech} />;
    if (inter === "fracture") return <FractureFields f={fields} set={setField} speech={speech} />;
    return null;
  };

  const interLabel = inter ? (
    Object.values(INTERVENTIONS).flat().find(i => i.id === inter)?.label || inter
  ) : "";

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            {screen !== "home" && (
              <button className="back-btn" onClick={() => setScreen(screen === "done" ? "form" : screen === "preview" ? "form" : "home")}>←</button>
            )}
            <div className="app-icon">🦴</div>
            <div>
              <div className="app-name">OrthoDocs</div>
              <div className="app-sub">CHU Lille · Dr Roussel</div>
            </div>
          </div>
          <div className="topbar-right">
            <button className="btn-icon" onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
              {theme === "light" ? "☾" : "☀"}
            </button>
          </div>
        </div>

        <div className="content">
          {/* ── HOME ── */}
          {screen === "home" && (
            <>
              <div className="spec-tabs">
                {["hanche", "genou", "trauma", "autre"].map(s => (
                  <button key={s} className={`spec-tab${spec === s ? " active" : ""}`} onClick={() => setSpec(s)}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>

              {INTERVENTIONS[spec]?.length > 0 ? (
                <div className="tile-grid">
                  {INTERVENTIONS[spec].map(item => (
                    <div key={item.id} className={`tile ${item.color}`} onClick={() => openInter(item.id)}>
                      <div className="tile-name">{item.label}</div>
                      <div className="tile-sub">{item.sub}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "var(--text3)", fontSize: 13, textAlign: "center", padding: "40px 0" }}>
                  Aucune intervention configurée pour cette spécialité.
                </div>
              )}

              {history.length > 0 && (
                <>
                  <div className="section-label">Récents</div>
                  <div className="hist-list">
                    {history.map(h => (
                      <div key={h.id} className="hist-row">
                        <div className="hist-info">
                          <div className="hist-name">{h.nom || "Patient"} — {h.interLabel}</div>
                          <div className="hist-meta">{dateStr(h.date)}</div>
                        </div>
                        <button className="btn-reopen" onClick={() => reopenHistory(h)}>Rouvrir</button>
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
              <div className="form-header">
                <div className="form-title">{interLabel}</div>
              </div>
              {getFormComponent()}

              <div className="section-label" style={{ marginTop: 20 }}>Documents à générer</div>
              <div className="docs-grid">
                {(DOCS_BY_INTER[inter] || []).map(doc => (
                  <div key={doc} className={`doc-chip${activeDocs.includes(doc) ? " active" : ""}`} onClick={() => toggleDoc(doc)}>
                    {doc}
                  </div>
                ))}
              </div>

              <div className="btn-row">
                <button className="btn-outline" onClick={() => setScreen("home")}>Annuler</button>
                <button className="btn-primary" onClick={() => { setPreviewDoc(0); setScreen("preview"); }}>
                  Prévisualiser →
                </button>
              </div>
            </>
          )}

          {/* ── PREVIEW ── */}
          {screen === "preview" && (
            <>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 16, fontFamily: "Lora, serif", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  Prévisualisation — {ptNom(fields)}
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>Vérifiez les documents avant génération</div>
              </div>

              <div className="preview-tabs">
                {activeDocs.map((doc, i) => (
                  <div key={doc} className={`prev-tab${previewDoc === i ? " active" : ""}`} onClick={() => setPreviewDoc(i)}>
                    {doc}
                  </div>
                ))}
              </div>

              <div className="preview-doc">
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "DM Sans, sans-serif", fontSize: 12.5, lineHeight: 1.7, color: "var(--text)" }}>
                  {getDocContent(activeDocs[previewDoc])}
                </pre>
              </div>

              <div className="btn-row">
                <button className="btn-outline" onClick={() => setScreen("form")}>← Modifier</button>
                <button className="btn-primary" disabled={generating} onClick={handleGenerate}>
                  {generating ? "Génération..." : "Générer les documents"}
                </button>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {screen === "done" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontFamily: "Lora, serif", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                  {generated.length} document{generated.length > 1 ? "s" : ""} générés
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>
                  {ptNom(fields)} · {interLabel} · {dateStr(fields.dateInter)}
                </div>
              </div>

              <div className="gen-list">
                {generated.map(item => (
                  <div key={item.name} className="gen-row">
                    <div className="gen-name">{item.name}</div>
                    <button className="btn-dl" onClick={() => downloadDoc(item)}>↓</button>
                  </div>
                ))}
              </div>

              <div className="btn-row">
                <button className="btn-outline" onClick={downloadAll}>↓ Tout télécharger</button>
                <button className="btn-mail" onClick={sendMail}>✉ Envoyer secrétariat</button>
              </div>

              <div style={{ marginTop: 8 }}>
                <button className="btn-outline" style={{ width: "100%" }} onClick={() => setScreen("home")}>
                  ← Nouveau dossier
                </button>
              </div>
            </>
          )}
        </div>

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
