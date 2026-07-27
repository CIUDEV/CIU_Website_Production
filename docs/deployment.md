# Deployment workflow

Two environments, two branches:

| Branch | Purpose | Deploy target |
| --- | --- | --- |
| `main` | Day-to-day development | Vercel (preview / staging) |
| `production` | Live site | Cloudflare Workers |

## Daily workflow

1. Work and commit on **`main`**.
2. Push to GitHub — Vercel builds **`main`** for testing.
3. When you are happy with the Vercel preview, promote to live:

```bash
git checkout production
git merge main
git push origin production
git checkout main
```

4. Cloudflare Workers Builds picks up the push to **`production`** and deploys automatically.

You do **not** need to run `npm run deploy` locally for production once Workers Builds is connected.

## Connect Cloudflare to the `production` branch (one-time)

Your worker already exists: **`ciu-website`**.

1. Open [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages).
2. Select **`ciu-website`**.
3. Go to **Settings → Builds**.
4. Click **Connect** and authorize GitHub.
5. Select repository: **`Fuwad2000/CIU`** (or your fork).
6. Set build settings:

| Setting | Value |
| --- | --- |
| **Production branch** | `production` |
| **Build command** | `npm run cf:build` |
| **Deploy command** | `npm run cf:deploy` |

7. **Disable preview builds** for other branches (recommended). You test on Vercel with `main`; only `production` should go live on Cloudflare.
8. Save and trigger a test deploy (push to `production` or use **Retry build**).

Live URL after deploy: https://ciu-website.oladegafuwad7.workers.dev

## Local commands (optional)

| Command | Use |
| --- | --- |
| `npm run dev` | Local Next.js dev server |
| `npm run preview` | Build + preview in the Workers runtime locally |
| `npm run deploy` | Manual full build + deploy (fallback only) |

## Notes

- `wrangler.jsonc` and `open-next.config.ts` are already configured for this worker.
- Environment variables for runtime (if any) go in Cloudflare **Settings → Variables & Secrets**, not in Git.
- Keep **`main`** and **`production`** in sync only when you intentionally release; do not push every commit straight to `production`.
