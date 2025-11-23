# Voucher & Promotion Management API

A production-ready RESTful API for managing vouchers, promotions, and applying discounts to orders. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Live Demo

- **API Base URL**: https://voucher-promotion-api.onrender.com
- **API Documentation**: https://voucher-promotion-api.onrender.com/api-docs
- **Health Check**: https://voucher-promotion-api.onrender.com/health

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

## ✨ Features

### Core Functionality
- ✅ **Voucher Management**: Full CRUD operations for vouchers
- ✅ **Promotion Management**: Full CRUD operations for promotions
- ✅ **Discount Application**: Apply vouchers/promotions to orders with validation
- ✅ **Business Rules Enforcement**:
  - Expiration date validation
  - Usage limit tracking
  - Minimum order value requirements
  - Eligible category filtering for promotions
  - Maximum 50% discount cap
  - Single voucher/promotion per order

### Additional Features
- ✅ **Rate Limiting**: 100 requests per 15 minutes
- ✅ **Input Validation**: Zod schema validation on all POST requests
- ✅ **API Documentation**: Interactive Swagger/OpenAPI documentation
- ✅ **Health Monitoring**: Health check endpoint for uptime monitoring
- ✅ **Error Handling**: Comprehensive error messages and validation
- ✅ **Testing**: Unit and integration tests with Jest
- ✅ **TypeScript**: Full type safety

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest, Supertest
- **Deployment**: Render
- **Database Hosting**: Supabase

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or use Supabase)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/mhaseebali/voucher-promotion-api.git
   cd voucher-promotion-api
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   
   Create a \`.env\` file in the root directory:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@host:port/database"
   PORT=3000
   \`\`\`

4. **Run database migrations**
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

5. **Generate Prisma Client**
   \`\`\`bash
   npx prisma generate
   \`\`\`

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

The API will be available at \`http://localhost:3000\`

## 📚 API Documentation

### Interactive Documentation
Visit \`/api-docs\` for interactive Swagger documentation where you can test all endpoints directly in your browser.

### Quick Reference

#### Vouchers

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/vouchers\` | Create a new voucher |
| GET | \`/api/vouchers\` | Get all vouchers |
| PUT | \`/api/vouchers/:id\` | Update a voucher |
| DELETE | \`/api/vouchers/:id\` | Delete a voucher |

#### Promotions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/promotions\` | Create a new promotion |
| GET | \`/api/promotions\` | Get all promotions |
| PUT | \`/api/promotions/:id\` | Update a promotion |
| DELETE | \`/api/promotions/:id\` | Delete a promotion |

#### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | \`/api/orders/apply-discount\` | Apply voucher/promotion to order |

### Example Requests

#### Create a Voucher
\`\`\`bash
curl -X POST https://voucher-promotion-api.onrender.com/api/vouchers \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "SAVE20",
    "discountType": "PERCENTAGE",
    "discountValue": 20,
    "expirationDate": "2025-12-31",
    "usageLimit": 100,
    "minOrderValue": 50
  }'
\`\`\`

#### Create a Promotion
\`\`\`bash
curl -X POST https://voucher-promotion-api.onrender.com/api/promotions \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "TECHDEAL",
    "discountType": "FIXED",
    "discountValue": 15,
    "expirationDate": "2025-12-31",
    "usageLimit": 500,
    "eligibleCategories": ["electronics", "gadgets"]
  }'
\`\`\`

#### Apply Discount to Order
\`\`\`bash
curl -X POST https://voucher-promotion-api.onrender.com/api/orders/apply-discount \\
  -H "Content-Type: application/json" \\
  -d '{
    "items": [
      {"productId": "1", "price": 200, "category": "electronics"}
    ],
    "voucherCode": "SAVE20"
  }'
\`\`\`

## 🧪 Testing

### Run Tests
\`\`\`bash
npm test
\`\`\`

### Run Tests in Watch Mode
\`\`\`bash
npm run test:watch
\`\`\`

### Test Coverage
Tests include:
- Health check endpoint validation
- Voucher CRUD operations
- Promotion CRUD operations
- Order discount application logic
- Error handling and edge cases
- Business rule validation

## 🚢 Deployment

### Render Deployment

1. **Push code to GitHub**
   \`\`\`bash
   git push origin main
   \`\`\`

2. **Create Web Service on Render**
   - Connect your GitHub repository
   - **Build Command**: \`npm install && npx prisma generate && npx tsc\`
   - **Start Command**: \`node dist/app.js\`

3. **Set Environment Variables**
   - \`DATABASE_URL\`: Your PostgreSQL connection string
   - \`PORT\`: 10000 (or leave blank for auto-detection)

4. **Deploy**
   Render will automatically deploy on every push to main branch.

### Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Get the connection string from Project Settings → Database
3. Use **Session pooler** connection string for production
4. Run migrations: \`npx prisma migrate deploy\`

## 📁 Project Structure

\`\`\`
voucher-promotion-api/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Database schema
├── src/
│   ├── __tests__/           # Test files
│   │   └── api.test.ts
│   ├── controllers/         # Request handlers
│   │   ├── voucher.controller.ts
│   │   ├── promotion.controller.ts
│   │   └── order.controller.ts
│   ├── routes/              # API routes
│   │   ├── voucher.routes.ts
│   │   ├── promotion.routes.ts
│   │   └── order.routes.ts
│   ├── services/            # Business logic
│   │   └── discount.service.ts
│   ├── app.ts               # Express app setup
│   ├── prisma.ts            # Prisma client
│   └── swagger.ts           # API documentation config
├── .env                     # Environment variables
├── .gitignore
├── jest.config.js           # Jest configuration
├── package.json
├── README.md
└── tsconfig.json            # TypeScript configuration
\`\`\`

## 🔒 Business Rules

### Voucher Rules
- Unique voucher codes
- Expiration date validation
- Usage limit enforcement
- Minimum order value requirement
- Maximum 50% discount cap

### Promotion Rules
- Unique promotion codes
- Category-based eligibility
- Expiration date validation
- Usage limit enforcement
- Maximum 50% discount cap on eligible items

### Order Rules
- Only one voucher OR promotion per order
- Discount cannot exceed 50% of order value
- Voucher minimum order value must be met
- Promotion applies only to eligible categories

## 📝 License

ISC

## 👤 Author

**Muhammad Haseeb Ali**
- GitHub: [@mhaseebali](https://github.com/mhaseebali)

## 🙏 Acknowledgments

- Built as part of a technical assessment
- Uses modern best practices for Node.js API development
- Follows RESTful API design principles
