const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const db = require('./config/database');
const router = require('./routes/router');


app.use(express.json());

app.use('/api', router);

// db.authenticate()
// .then(async () => {
//     console.log('Koneksi berhasil');
//     await db.sync({alter:true});
// })
// .catch(err => console.log('Error: ' + err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
