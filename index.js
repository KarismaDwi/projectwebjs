const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const express = require('express');
const FileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');

const app = express();
const db = require('./config/database');
const router = require('./routes/router');
const komplain = require('./models/komplainModels');
const produk = require('./models/produkModels');
const cart = require('./models/troliModels');
const CustomOrder = require('./models/customOrderModels');
const checkout = require('./models/checkoutModels');
const payment = require('./models/paymentModels');
const checkoutDetail = require('./models/checkoutDetailModels');

const e = require('express');


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(FileUpload());
app.use('/upload', express.static('upload'));
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
