# Voucher & Promotion Management System

A backend API for managing vouchers and promotions, built with Node.js, Express, TypeScript, and Prisma.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Language**: TypeScript
-   **Database**: PostgreSQL (via Prisma ORM). SQLite used for local development.
-   **Deployment**: Ready for Render, Vercel, or Heroku.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Copy `.env.example` to `.env` (or create it):
    ```env
    DATABASE_URL="file:./dev.db"
    PORT=3000
    ```
    For production (PostgreSQL), set `DATABASE_URL` to your connection string.

3.  **Database Migration**:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Run Locally**:
    ```bash
    npm run dev
    # or
    npx ts-node src/app.ts
    ```

## API Endpoints

### Vouchers
-   `POST /api/vouchers`: Create a voucher.
-   `GET /api/vouchers`: List all vouchers.
-   `PUT /api/vouchers/:id`: Update a voucher.
-   `DELETE /api/vouchers/:id`: Delete a voucher.

### Promotions
-   `POST /api/promotions`: Create a promotion.
-   `GET /api/promotions`: List all promotions.
-   `PUT /api/promotions/:id`: Update a promotion.
-   `DELETE /api/promotions/:id`: Delete a promotion.

### Orders
-   `POST /api/orders/apply-discount`: Apply a voucher/promotion and create an order.
    -   Body: `{ "items": [...], "voucherCode": "...", "promotionCode": "..." }`

## Logic & Rules

-   **Vouchers**: Apply to the total order amount. Checked for expiry, usage limit, and minimum order value.
-   **Promotions**: Apply to eligible items only. Checked for expiry and usage limit.
-   **Constraints**:
    -   Only one voucher OR promotion per order.
    -   Discount capped at 50% of the applicable amount.
    -   Usage counts are tracked and enforced.

## Deployment Guide (Render)

1.  Push this repository to GitHub.
2.  Create a new Web Service on [Render](https://render.com).
3.  Connect your GitHub repo.
4.  **Build Command**: `npm install && npx prisma generate && npx tsc`
5.  **Start Command**: `node dist/app.js`
6.  **Environment Variables**:
    -   `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Supabase or Render's managed Postgres).
    -   `PORT`: `10000` (or whatever Render assigns).

## Deployment Guide (Vercel)

1.  Install Vercel CLI or use the dashboard.
2.  Add a `vercel.json` if needed (standard Express apps might need serverless adaptation, but Vercel supports Node.js builds).
3.  Set `DATABASE_URL` in Vercel project settings.
