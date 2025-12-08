import express from 'express';

const app = express();
const PORT = process.env.PORT;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Dental Appointment System Backend is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
