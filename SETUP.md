# Auswander-Kompass — Setup-Anleitung

Alle Schritte, die **vor dem ersten produktiven Einsatz** noch erledigt werden müssen. Diese Anleitung deckt die offenen Einstellungen aus Sprint 1–4 ab.

---

## 1. Supabase einrichten

### 1.1 Projekt anlegen
- Gehe zu https://supabase.com → neues Projekt erstellen
- Region: **Frankfurt (eu-central-1)** wählen (DSGVO-Konformität)
- Datenbank-Passwort sicher speichern

### 1.2 Migrations ausführen
Im Supabase Dashboard → **SQL Editor** → New Query → beide Migrations nacheinander ausführen:

1. `supabase/migrations/001_init.sql` — legt `quiz_submissions`, `subscriptions`, `roadmap_views` an
2. `supabase/migrations/002_access_tokens.sql` — ergänzt `access_token` + `quiz_submission_id`

### 1.3 API-Keys kopieren
Dashboard → **Project Settings → API** → folgende Werte in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public>
SUPABASE_SERVICE_ROLE_KEY=<service_role secret>  # NIEMALS im Client verwenden
```

---

## 2. Stripe einrichten

### 2.1 Produkt + Preis anlegen
Stripe Dashboard → **Products → Add Product**:
- Name: `Auswander-Kompass`
- Beschreibung: „Monatlicher Zugang zum persönlichen Auswanderungs-Fahrplan"
- Pricing: **29 €** · **Recurring** · **Monatlich** · Währung EUR

Nach dem Anlegen: `Price ID` (`price_xxxxx`) kopieren.

### 2.2 API-Keys
Dashboard → **Developers → API Keys**:
```
STRIPE_SECRET_KEY=sk_test_...            # Zum Start: TEST-MODE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRICE_ID=price_...
```

### 2.3 Webhook einrichten
**Lokal (Entwicklung):**
```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhook
```
Das Ausgabe-Signing-Secret (`whsec_...`) in `.env.local`:
```
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Produktion (nach Deployment):**
Dashboard → **Developers → Webhooks → Add endpoint**:
- URL: `https://auswanderkompass.de/api/webhook`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.deleted`
- Signing-Secret erneut kopieren und in Vercel-ENV speichern

### 2.4 Customer Portal aktivieren
Dashboard → **Settings → Billing → Customer Portal** → Aktivieren.
- „Allow customers to cancel subscriptions" aktivieren
- „Allow switching plans" **deaktivieren** (wir haben nur einen Plan)

### 2.5 Live-Mode
**Erst nach vollständigem QA-Durchlauf im Test-Mode:**
1. Im Dashboard auf „Live data" umschalten
2. Live-Keys erzeugen und in Vercel Production-ENV eintragen
3. Live-Webhook analog zu 2.3 einrichten

---

## 3. Resend einrichten

### 3.1 Domain verifizieren
Resend Dashboard → **Domains → Add Domain**:
- Domain: `auswanderkompass.de`
- DNS-Einträge (SPF, DKIM, Return-Path) beim Domain-Provider setzen
- Warten bis Verifizierung grün ist (~15 min)

### 3.2 API-Key
Dashboard → **API Keys → Create API Key**:
```
RESEND_API_KEY=re_...
```

### 3.3 Sender-Adresse
In `src/app/api/webhook/route.ts` und `src/app/api/login/request/route.ts` wird aktuell `hallo@auswanderkompass.de` als Absender verwendet. Bei Bedarf anpassen.

---

## 4. PostHog einrichten

### 4.1 Projekt anlegen
https://eu.posthog.com → neues Projekt (EU-Instanz für DSGVO)

### 4.2 Project-API-Key
```
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
```

### 4.3 Events-Dashboard erstellen
Im PostHog-Dashboard folgende Events tracken (erscheinen automatisch nach ersten Interaktionen):
- `lp_view` · `diagnose_start` · `q_answered` · `diagnose_complete`
- `result_view` · `paywall_view` · `checkout_start` · `roadmap_view`

Empfohlene Funnels:
1. `lp_view → diagnose_start → diagnose_complete → paywall_view → checkout_start`
2. `checkout_start → roadmap_view` (über Stripe-Webhook-Signal messbar)

---

## 5. Session-Secret setzen

Für sichere Cookie-Signierung (Dashboard-Zugang):
```
AK_SESSION_SECRET=<zufälliger String, min. 32 Zeichen>
```

Erzeugen mit:
```bash
openssl rand -hex 32
```

---

## 6. Base-URL

Lokal:
```
NEXT_PUBLIC_URL=http://localhost:3000
```

Produktion (nach Vercel-Deployment):
```
NEXT_PUBLIC_URL=https://auswanderkompass.de
```

---

## 7. Vercel Deployment

### 7.1 Projekt verknüpfen
```bash
npm i -g vercel
vercel link
```

### 7.2 ENV-Variablen übertragen
Alle 11 Variablen aus `.env.local` im Vercel-Dashboard unter **Project → Settings → Environment Variables** eintragen — Scope: **Production + Preview**.

**Liste:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_POSTHOG_KEY
NEXT_PUBLIC_POSTHOG_HOST
NEXT_PUBLIC_URL
AK_SESSION_SECRET
```

### 7.3 Domain verbinden
Vercel Dashboard → **Domains** → `auswanderkompass.de` hinzufügen → DNS-Einträge beim Domain-Provider setzen.

### 7.4 Region
`vercel.json` ist auf `fra1` (Frankfurt) vorkonfiguriert — passt zu Supabase-EU.

---

## 8. Legal-Pages vervollständigen

Alle vier Legal-Pages enthalten Platzhalter `[...]`. Vor Launch **pflichtweise ausfüllen**:

- `src/app/rechtliches/impressum/page.tsx` — Anbieter-Angaben, USt-ID, Kontakt
- `src/app/rechtliches/datenschutz/page.tsx` — Verantwortlicher, Kontakt-Mail
- `src/app/rechtliches/agb/page.tsx` — Anbieter-Angaben
- `src/app/rechtliches/widerruf/page.tsx` — Kontakt-Mail

**Tipp:** Prüfe die finalen Texte durch eine:n Anwalt:in, bevor Live-Traffic läuft. Das Risiko einer Abmahnung wegen unvollständigem Impressum ist real.

---

## 9. QA-Selbsttest

Nach vollständigem Setup:

```bash
npm run dev
curl http://localhost:3000/api/qa/scoring
```

Erwartung: `{"status":"pass","passed":N,"failed":0,...}` mit allen 7 Logik-Szenarien grün.

**Manueller End-to-End-Test** (3× durchspielen, verschiedene Profile):
1. Landing → Diagnose → Ergebnis → Paywall → Stripe Test-Karte `4242 4242 4242 4242` (12/34, CVC 123) → Welcome-Mail → Dashboard
2. Dashboard neu laden → Zugangslink aus Mail nutzen → Cookie-freie Rückkehr funktioniert
3. Billing Portal → Kündigen → Webhook setzt Status auf `cancelled`

---

## 10. Launch-Checkliste

- [ ] Supabase Migrations gelaufen (001 + 002)
- [ ] Stripe Test-Mode End-to-End getestet
- [ ] Resend-Domain verifiziert, Welcome-Mail kommt an
- [ ] PostHog zeigt Events an
- [ ] Legal-Pages vollständig (keine Platzhalter mehr)
- [ ] Vercel-Domain aktiv, HTTPS grün
- [ ] Stripe Live-Webhook aktiv
- [ ] `AK_SESSION_SECRET` in Vercel produktiv
- [ ] Erster echter 29€-Test-Kauf durchgespielt (mit echter Karte)

---

## Support

Fragen oder Probleme: Im Repo-Issue öffnen oder intern nachfragen.
