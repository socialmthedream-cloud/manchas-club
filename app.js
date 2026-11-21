(function(){
"use strict";
const S = window.SEASON;
const KEY = "manchas-passport-" + S.code;
const PREVIEW = /[?&]preview(=|&|$)/.test(location.search);
const ICON = {balloon:"i-balloon", leaf:"i-leaf", sky:"i-sky", bulb:"i-bulb", gear:"i-gear"};

// Expand ranges for lands that are planned but not written yet.
S.lands.forEach(l => {
  if (!l.eps && l.range) {
    l.eps = [];
    for (let n = l.range[0]; n <= l.range[1]; n++) {
      const first = n === l.range[0], last = n === l.range[1];
      l.eps.push({ ep: "S01E" + String(n).padStart(2, "0"), title: first ? "We have arrived!" : last ? "What we found" : "Coming soon", special: first || last });
    }
  }
});
const ALL = S.lands.flatMap(l => l.eps).concat([Object.assign({ special: true }, S.finale)]);
const isOpen = e => !!e.word && (e.released || PREVIEW);

let state = { stamps: {}, tab: S.lands[0].id };
try { const s = JSON.parse(localStorage.getItem(KEY) || "null"); if (s && s.stamps) state = Object.assign(state, s); } catch (e) {}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

const app = document.getElementById("app");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const landDone = l => l.eps.every(e => state.stamps[e.ep]);
let justStamped = null;

async function fingerprint(word){
  const data = new TextEncoder().encode("manchas:" + word.trim().toUpperCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function render(){
  const n = Object.keys(state.stamps).length, total = ALL.length;
  const L = S.lands.find(l => l.id === state.tab) || S.lands[0];
  const got = L.eps.filter(e => state.stamps[e.ep]).length, done = landDone(L);
  app.innerHTML = `
  ${PREVIEW ? '<div class="preview">Preview mode: all written episodes are open</div>' : ""}
  <header class="top"><img src="assets/manchas.png" alt="Manchas the plush puppy" width="64" height="84"><div><h1>My Wonder <span class="red">Map</span></h1><div class="sub">Season 1 · Explain It Like I'm 6</div></div></header>
  <section class="prog" aria-label="Season progress"><div class="row"><b>Season 1 passport</b><span class="n">${n} of ${total} stamps</span></div><div class="track"><i style="width:${Math.round(n / total * 100)}%"></i></div></section>
  <nav class="tabs" role="tablist" aria-label="Lands">${S.lands.map(l => `<button class="tab" role="tab" aria-selected="${l.id === L.id}" data-tab="${l.id}"><svg aria-hidden="true"><use href="#${ICON[l.icon]}"/></svg>${esc(l.name)}${landDone(l) ? " ✓" : ""}</button>`).join("")}</nav>
  <section class="land" style="--c:${L.color}">
    <h2><svg aria-hidden="true"><use href="#${ICON[L.icon]}"/></svg>${esc(L.name)}</h2>
    <p>${esc(L.blurb)} · ${got} of ${L.eps.length} stamped</p>
    <div class="grid">${L.eps.map(e => {
      const d = state.stamps[e.ep], out = isOpen(e);
      const cls = d ? "done" : out ? "out" : "soon";
      return `<button class="slot ${cls} ${e.special && !d ? "special" : ""} ${justStamped === e.ep ? "pop" : ""}" style="--f:${L.fill}" data-ep="${e.ep}" ${out || d ? "" : 'aria-disabled="true"'} aria-label="${e.ep} ${esc(e.title)}${d ? ", stamped" : out ? ", out now" : ", coming soon"}"><span class="e">${d ? "✓" : e.ep.slice(4)}</span><span class="t">${esc(e.title)}</span></button>`;
    }).join("")}</div>
    ${done ? `<button class="reward" data-reward="${L.id}"><span class="gift">🎁</span><span><b>Reward unlocked! Tap to open</b><span>${esc(L.reward)}</span></span></button>`
           : `<div class="reward"><div class="gift">🔒</div><div><b>Finish this land to unlock</b><span>${esc(L.reward)}</span></div></div>`}
  </section>
  <div class="reward"><div class="gift">🏅</div><div><b>Whole map: Curious Club Explorer</b><span>A special certificate for finishing all of Season 1</span></div></div>
  <section class="how"><b>How it works</b><ol><li>Watch an episode with Manchas.</li><li>At the very end, look for the <b style="display:inline;font-family:inherit;font-size:inherit;color:var(--red)">magic word</b>.</li><li>Tap that episode's circle and type the word to get your stamp.</li></ol></section>
  <div class="grown"><b>For grown-ups:</b> no sign-up, no names, no emails, no tracking. Stamps are saved only in this browser on this device. <a href="privacy.html">Privacy</a></div>
  <div class="foot">Explain It Like I'm 6 · Join the Curious Club, and bring your biggest why.</div>`;
  justStamped = null;
}

function sheet(html){
  const v = document.createElement("div");
  v.className = "veil";
  v.innerHTML = `<div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  v.addEventListener("click", e => { if (e.target === v || e.target.closest("[data-close]")) v.remove(); });
  document.body.appendChild(v);
  return v;
}

function openEp(id){
  const L = S.lands.find(l => l.eps.some(e => e.ep === id)); const e = L.eps.find(x => x.ep === id);
  if (state.stamps[id]) { sheet(`<span class="k">${id} · ${esc(L.name)}</span><h3>Stamped! ✓</h3><p>${esc(e.title)} is in your passport.</p><button class="btn" data-close>Back to my map</button>`); return; }
  if (!isOpen(e)) return;
  const v = sheet(`<span class="k">${id} · ${esc(L.name)}</span><h3>${esc(e.title)}</h3>
    <p>Watched it? At the very end, Manchas shows a magic word. Type it here to get your stamp.</p>
    <label for="mw">Magic word</label><input id="mw" autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="go" placeholder="?????"><div class="err" id="err" role="alert"></div>
    <div class="rowb"><button class="btn ghost" data-close>Not yet</button><button class="btn red" data-go>Stamp it!</button></div>`);
  const inp = v.querySelector("#mw"); setTimeout(() => inp.focus(), 50);
  const go = async () => {
    if (!inp.value.trim()) return;
    let ok = false;
    try { ok = (await fingerprint(inp.value)) === e.word; } catch (err) {}
    if (ok) {
      state.stamps[id] = Date.now(); justStamped = id; save(); v.remove(); render();
      if (landDone(L)) setTimeout(() => openReward(L), 650);
    } else {
      v.querySelector("#err").textContent = "Hmm, not quite. Watch the last seconds again!";
    }
  };
  v.querySelector("[data-go]").onclick = go;
  inp.addEventListener("keydown", ev => { if (ev.key === "Enter") go(); });
}

// Rewards are drawn on the phone; the name typed here is never sent anywhere.
const manchasImg = new Image(); manchasImg.src = "assets/manchas.png";
function drawCert(c, L, name){
  const x = c.getContext("2d"), W = c.width, H = c.height;
  x.fillStyle = "#F7EEDD"; x.fillRect(0, 0, W, H);
  x.strokeStyle = L.color; x.lineWidth = 28; x.strokeRect(40, 40, W - 80, H - 80);
  x.strokeStyle = "rgba(74,46,34,.35)"; x.lineWidth = 3; x.strokeRect(80, 80, W - 160, H - 160);
  x.fillStyle = "#4A2E22"; x.textAlign = "center";
  x.font = "700 92px Caveat, cursive"; x.fillText(L.id === "tour" ? "Tour Explorer" : "Explorer of " + L.name, W / 2, 230);
  if (manchasImg.complete) x.drawImage(manchasImg, W / 2 - 170, 290, 340, 449);
  x.font = "600 34px Nunito, sans-serif"; x.fillStyle = "#7A6A5E"; x.fillText("This certifies that", W / 2, 820);
  x.font = "700 96px Caveat, cursive"; x.fillStyle = "#B8433A"; x.fillText(name || "A Curious Explorer", W / 2, 930);
  x.strokeStyle = "#4A2E22"; x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 360, 955); x.lineTo(W / 2 + 360, 955); x.stroke();
  x.font = "600 34px Nunito, sans-serif"; x.fillStyle = "#7A6A5E";
  x.fillText("collected every stamp in " + L.name + " with Manchas", W / 2, 1020);
  x.font = "700 52px Caveat, cursive"; x.fillStyle = "#4A2E22"; x.fillText("Explain It Like I'm 6 · meetmanchas.com", W / 2, H - 150);
}
function drawWall(c, L){
  const x = c.getContext("2d"), W = c.width, H = c.height;
  x.fillStyle = "#F7EEDD"; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W / 2, H * .45, 50, W / 2, H * .45, W * .8); g.addColorStop(0, L.fill); g.addColorStop(1, "rgba(247,238,221,0)");
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  if (manchasImg.complete) x.drawImage(manchasImg, W / 2 - 380, H * .3, 760, 1003);
  x.textAlign = "center"; x.fillStyle = "#4A2E22"; x.font = "700 120px Caveat, cursive"; x.fillText(L.name, W / 2, H * .2);
  x.font = "700 64px Caveat, cursive"; x.fillStyle = "#B8433A"; x.fillText("Curious Club", W / 2, H * .9);
}
function download(c, file){
  c.toBlob(b => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = file; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }, "image/png");
}
async function openReward(L){
  try { await document.fonts.load("700 40px Caveat"); await document.fonts.load("600 20px Nunito"); } catch (e) {}
  const v = sheet(`<span class="k">${esc(L.name)} complete!</span><h3>You did it! 🎉</h3>
    <label for="nm">Name for the certificate (stays on this phone)</label><input id="nm" class="nm" maxlength="28" autocomplete="off" placeholder="Type a name">
    <canvas id="cert" width="1500" height="1300" aria-label="Your certificate"></canvas>
    <div class="dl"><button class="btn red" data-dl="cert">Save certificate</button><button class="btn" data-dl="wall">Save wallpaper</button></div>
    <button class="btn ghost" data-close>Back to my map</button>`);
  const c = v.querySelector("#cert"), nm = v.querySelector("#nm");
  const redraw = () => drawCert(c, L, nm.value.trim());
  redraw(); manchasImg.onload = redraw; nm.addEventListener("input", redraw);
  v.querySelector('[data-dl="cert"]').onclick = () => download(c, "manchas-" + L.id + "-certificate.png");
  v.querySelector('[data-dl="wall"]').onclick = () => { const w = document.createElement("canvas"); w.width = 1080; w.height = 1920; drawWall(w, L); download(w, "manchas-" + L.id + "-wallpaper.png"); };
}

app.addEventListener("click", ev => {
  const t = ev.target.closest("[data-tab],[data-ep],[data-reward]"); if (!t) return;
  if (t.dataset.tab) { state.tab = t.dataset.tab; save(); render(); }
  else if (t.dataset.ep) openEp(t.dataset.ep);
  else if (t.dataset.reward) openReward(S.lands.find(l => l.id === t.dataset.reward));
});
document.addEventListener("keydown", ev => { if (ev.key === "Escape") { const v = document.querySelector(".veil"); if (v) v.remove(); } });
render();
})();
