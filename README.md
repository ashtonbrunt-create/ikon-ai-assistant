# IKON Roofing AI Assistant — V2

A branded, company-trained AI operations assistant for roofing companies.
Front end: single HTML page. Backend: one Vercel serverless function that
securely calls the Claude API.

## Project structure

```
roofing-ai-assistant/
├── index.html        ← the entire front end (branding, tools, forms)
├── api/
│   └── generate.js   ← the backend: relays requests to the Claude API
├── lib/
│   └── prompts.js    ← COMPANY KNOWLEDGE: edit this per client
└── package.json
```

## Deploy in ~15 minutes

1. **Get an Anthropic API key**
   - Sign up at https://console.anthropic.com
   - Create an API key (Settings → API Keys), add a payment method.

2. **Create a free Vercel account** at https://vercel.com

3. **Deploy the project**
   - Easiest: install the Vercel CLI (`npm i -g vercel`), then from this
     folder run `vercel` and follow the prompts.
   - Or push this folder to a GitHub repo and click "Import Project"
     in the Vercel dashboard.

4. **Add the API key as an environment variable**
   - In the Vercel dashboard: Project → Settings → Environment Variables
   - Name: `ANTHROPIC_API_KEY`  Value: your key
   - Redeploy so the function picks it up.

5. **Done.** Vercel gives you a URL like `your-project.vercel.app`.
   Add a custom domain (e.g. `app.peakroofing.com`) in Project → Domains.

## Customizing per client

After the discovery meeting, edit **two files**:

### 1. `lib/prompts.js` — the company knowledge
- Update the `COMPANY` block (name, phone, warranty).
- Rewrite the `voice` rules from what you extracted from their documents.
- Adjust each tool's rules to match their actual standards.
- Strongest upgrade: paste one real example (their best proposal, their
  best follow-up email) into the relevant prompt under an `EXAMPLE:` line.
  Real examples improve output quality more than any rule.

### 2. `index.html` — the branding
- The `:root` CSS block at the top holds all brand colors. One edit
  rebrands the whole app.
- Update the company name in the `<header>` and `<title>`.
- Edit the `TOOLS` object to add/remove tools or change form fields —
  no other code changes needed. (If you add a tool, add a matching
  prompt with the same key in `lib/prompts.js`.)

## Notes

- The API key never reaches the browser — it lives only in the Vercel
  environment variable and is used server-side by `api/generate.js`.
- Cost: pay-per-use. A team generating ~20 outputs/day typically lands
  in the $10–30/month range. Check current pricing at
  https://docs.claude.com/en/docs/about-claude/pricing
- There is no login in this version. The simplest access control is
  Vercel's built-in password protection (Project → Settings →
  Deployment Protection) or keeping the URL private. Real user accounts
  are a V2.5/V3 feature.
- Outputs are drafts. The footer reminds users to review before sending.
