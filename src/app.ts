import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import voucherRoutes from './routes/voucher.routes';
import promotionRoutes from './routes/promotion.routes';
import orderRoutes from './routes/order.routes';

import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vouchers', voucherRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Voucher & Promotion API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
