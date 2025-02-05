const express = require('express');
const DBConnection = require('./js/database');
const app = express();
const PORT = 3000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('pages'));
app.use(express.static('js'));

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});