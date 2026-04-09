# Gio Portfolio — Netlify Deployment

## Project structure
```
/
├── index.html                   ← Your portfolio (with Gio AI Studio embedded)
├── netlify.toml                 ← Netlify config + /api/* routing
├── netlify/functions/
│   ├── gemini.js                ← Secure proxy → Google Gemini API (text & code)
│   └── image.js                 ← Secure proxy → Hugging Face API (images)
└── [your existing assets]       ← polka.gif, duchyy.gif, cat.gif, etc.
```

## Deploy to Netlify (5 min)

### 1. Get your API keys
- **Gemini**: https://aistudio.google.com/apikey → Create API key (covered by Google AI Pro)
- **Hugging Face**: https://huggingface.co/settings/tokens → New token (read access, free)

### 2. Push everything to GitHub
```bash
git init
git add .
git commit -m "Portfolio + Gio AI Studio"
gh repo create my-portfolio --public --push
```
Make sure all your image/gif assets (polka.gif, duchyy.gif, cat.gif, dashboard.png, etc.)
are in the same folder as index.html before pushing.

### 3. Connect to Netlify
1. Go to https://app.netlify.com → "Add new site" → "Import an existing project"
2. Connect GitHub → select your repo
3. Build settings are auto-detected — leave defaults
4. Click Deploy site

### 4. Add environment variables
Netlify dashboard → Site configuration → Environment variables → Add variable:

| Key              | Value                        |
|------------------|------------------------------|
| GEMINI_API_KEY   | AIza... (from AI Studio)     |
| HF_API_TOKEN     | hf_...  (from Hugging Face)  |

Then: Deploys → Trigger deploy → Deploy site

Your portfolio is live with Gio AI Studio working for ALL visitors!

## Local development
```bash
npm install -g netlify-cli
# Create a .env file:
echo "GEMINI_API_KEY=AIza..." > .env
echo "HF_API_TOKEN=hf_..." >> .env
netlify dev
```
