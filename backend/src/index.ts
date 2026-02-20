import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import reviewRoutes from './routes/review';
import statusRoutes from './routes/status';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/review', reviewRoutes);
app.use('/api/status', statusRoutes);

app.get('/', (req, res) => {
    res.send('UX Reviewer Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
