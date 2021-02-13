import express from 'express';
import { userRouter } from './routes';

const app = express();
app.use(express.json());

app.use('/users', userRouter);

app.listen(5000, () => {
    console.log(`Server is listening on port 5000`);
});