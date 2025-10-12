import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import employeeRoute from './routes/employee.js';

dotenv.config();

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: '*'// Allow all origins
};

app.use(cors(corsOptions));// Enable CORS for all routes
app.use(bodyParser.json());// Parse JSON request bodies

app.use('/api/employee', employeeRoute);
app.use((err, req, res, next) => { // global error handler
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({ error: message });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;