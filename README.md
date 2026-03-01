# Shokesu Invite-Only B2B Sake Portal

Next.js + TypeScript + PostgreSQL + Prisma + NextAuth magic-link app for invite-only B2B ordering with request approval workflow.

## Features
- Invite-only authentication (explicit email allowlist only).
- Catalog and bottle detail always visible, including out-of-stock and not-currently-carried.
- Trello JSON importer with dry-run preview endpoint.
- Excel inventory importer (all sheets, Product/Service rows).
- Request-to-buy flow with admin approval and inventory decrement.
- Client-specific pricing fallback to base inventory pricing; hidden when stock is 0.
- Notify-me interests, admin demand view, and manual availability email sending.
- QBO-friendly CSV export for approved orders and marks exported.

## Setup
1. Install dependencies: `npm install`
2. Create `.env` based on `.env.example`
3. Run Prisma migrate + generate:
   - `npx prisma generate`
   - `npx prisma migrate deploy`
4. Seed admin: `npm run prisma:seed`
5. Start app: `npm run dev`

## Required env vars
See `.env.example`.

## Key routes
- `/catalog`, `/bottle/[id]`
- `/account/interests`
- `/admin/import/trello`
- `/admin/requests`
- `/admin/orders`
- `/admin/interests`
- `/admin/invites`
