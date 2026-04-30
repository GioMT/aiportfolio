/* ── Gio AI Studio JS — Netlify proxy edition ── */
let aiStyleSuffix = '';

function aiSwitchTab(tab, btn) {
  document.querySelectorAll('.ai-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('ai-panel-' + tab).classList.add('active');
  btn.classList.add('active');
}

function aiSelectStyle(el, suffix) {
  document.querySelectorAll('.ai-style-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  aiStyleSuffix = suffix;
}

function aiToast(msg) {
  let t = document.getElementById('aiToast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'aiToast';
    t.style.cssText = 'position:fixed;bottom:90px;right:30px;background:#1a1a1a;border:1px solid rgba(255,106,0,.3);color:#e0e0e0;padding:11px 18px;border-radius:10px;font-size:.85rem;z-index:3000;opacity:0;transform:translateY(8px);transition:all .25s;pointer-events:none;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1'; t.style.transform = 'translateY(0)';
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(8px)'; }, 2800);
}

function aiCopy(id) {
  navigator.clipboard.writeText(document.getElementById(id).innerText).then(() => aiToast('Copied ✓'));
}

function aiSetLoading(btnId, on, label) {
  const btn = document.getElementById(btnId);
  btn.disabled = on;
  btn.innerHTML = on
    ? '<span class="ai-spinner"></span> Generating...'
    : '<span>' + (label || 'Generate') + '</span><span>→</span>';
}

async function aiCallGemini(system, prompt, contentEl, outputEl) {
  outputEl.style.display = 'block';
  contentEl.textContent = '';

  const res = await fetch('/.netlify/functions/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system, prompt })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Server error ' + res.status);
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const cursor = document.createElement('span');
  cursor.className = 'ai-cursor';
  contentEl.appendChild(cursor);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (!data || data === '[DONE]') continue;
      try {
        const p = JSON.parse(data);
        const text = p.candidates &&
          p.candidates[0] &&
          p.candidates[0].content &&
          p.candidates[0].content.parts &&
          p.candidates[0].content.parts[0] &&
          p.candidates[0].content.parts[0].text;
        if (text) {
          cursor.remove();
          contentEl.appendChild(document.createTextNode(text));
          contentEl.appendChild(cursor);
        }
      } catch(e) {}
    }
  }
  cursor.remove();
}

async function aiGenerateText() {
  const prompt = document.getElementById('aiTextPrompt').value.trim();
  if (!prompt) { aiToast('Enter a prompt first'); return; }
  const mode = document.getElementById('aiTextMode').value;
  const tone = document.getElementById('aiTextTone').value;
  const modeMap = { creative:'You are a creative writer. Write vivid, engaging, imaginative content.', essay:'You are an analytical writer. Write structured, insightful essays.', summary:'You are a concise summarizer.', qa:'You are a knowledgeable assistant. Explain clearly.', email:'You are a professional communicator. Write clear emails and letters.' };
  const toneMap = { balanced:'', formal:'Use a formal, professional tone.', casual:'Use a casual, friendly tone.', poetic:'Use beautiful, lyrical language.', technical:'Use precise, technical language.' };
  const sys = modeMap[mode] + ' ' + toneMap[tone] + ' Respond directly without preamble.';
  aiSetLoading('aiBtnText', true);
  try { 
    await aiCallGemini(sys, prompt, document.getElementById('aiTextContent'), document.getElementById('aiTextOut')); 
  } catch(e) { 
    document.getElementById('aiTextOut').style.display = 'none'; 
    document.getElementById('ai-status-notice').style.display = 'flex'; 
  } finally { 
    aiSetLoading('aiBtnText', false); 
  }
}

async function aiGenerateCode() {
  const prompt = document.getElementById('aiCodePrompt').value.trim();
  if (!prompt) { aiToast('Enter a prompt first'); return; }
  const lang = document.getElementById('aiCodeLang').value;
  const mode = document.getElementById('aiCodeMode').value;
  const modeMap = { generate:'Generate clean, well-commented ' + lang + ' code with brief explanations.', explain:'Explain the following ' + lang + ' code step by step.', debug:'Debug and fix the following ' + lang + ' code. Explain what was wrong.', refactor:'Refactor and optimize the following ' + lang + ' code.', test:'Write comprehensive tests for the following ' + lang + ' code.' };
  const sys = 'You are an expert software engineer. ' + modeMap[mode] + ' Be concise and practical.';
  aiSetLoading('aiBtnCode', true);
  try { 
    await aiCallGemini(sys, prompt, document.getElementById('aiCodeContent'), document.getElementById('aiCodeOut')); 
  } catch(e) { 
    document.getElementById('aiCodeOut').style.display = 'none'; 
    document.getElementById('ai-status-notice').style.display = 'flex'; 
  } finally { 
    aiSetLoading('aiBtnCode', false); 
  }
}

async function aiGenerateImage() {
  const prompt = document.getElementById('aiImgPrompt').value.trim();
  if (!prompt) { aiToast('Enter an image prompt first'); return; }
  const full = aiStyleSuffix ? prompt + ', ' + aiStyleSuffix : prompt;
  const out = document.getElementById('aiImgOut');
  out.innerHTML = '<div class="ai-img-status"><span class="ai-spinner"></span> Generating with FLUX.1-schnell...</div>';
  aiSetLoading('aiBtnImg', true, 'Generate Image');
  try {
    const res = await fetch('/.netlify/functions/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: full })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image generation failed');
    const imgSrc = 'data:' + data.contentType + ';base64,' + data.image;
    out.innerHTML = '';
    const img = document.createElement('img'); img.src = imgSrc; img.alt = 'Generated image';
    out.appendChild(img);
    const dl = document.createElement('button');
    dl.className = 'ai-btn-sec'; dl.style.marginTop = '12px'; dl.textContent = '⬇ Download';
    dl.onclick = function() { const a = document.createElement('a'); a.href = imgSrc; a.download = 'gio-ai-image.png'; a.click(); };
    out.appendChild(dl);
  } catch(e) {
    out.innerHTML = '<div class="ai-img-status" style="color:#f87171;">Error: ' + e.message + '</div>';
  }
  aiSetLoading('aiBtnImg', false, 'Generate Image');
}
