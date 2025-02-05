const express = require('express');
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const fs = require('fs');
const DBConnection = require('./js/database');

const app = express();
const PORT = 3000;

const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('pages'));
app.use(express.static('js'));

app.post('/upload', async (req, res) =>{
    const db = new DBConnection();

    if(!req.files || !req.files.archivo){
        return res.status(400).send('No se subió ningún archivo.');
    }

    const archivo = req.files.archivo;
    const extension = archivo.name.split('.').pop().toLowerCase();

    if(extension !== 'xlsx' && extension !== 'json'){
        return res.status(400).send('Solo se permiten archivos Excel (.xlsx) o JSON (.json).');
    }

    const filePath = `uploads/${archivo.name}`;
    archivo.mv(filePath, async (err) =>{
        if(err) return res.status(500).send(err);

        let estudiantes = [];

        if(extension === 'xlsx'){
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            estudiantes = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        }else if(extension === 'json'){
            const data = fs.readFileSync(filePath);
            estudiantes = JSON.parse(data);
        }

        fs.unlinkSync(filePath);

        try{
            for(const estudiante of estudiantes){
                await db.query('INSERT INTO estudiantes (nombre, apellido, edad, correo, telefono) VALUES (?, ?, ?, ?, ?)', [estudiante.nombre, estudiante.apellido, estudiante.edad, estudiante.correo, estudiante.telefono]);
            }
            res.status(200).send('Todos los datos se guardaron correctamente.');
        }catch(error){
            res.status(500).send('Error insertando datos: ' + error.message);
        }
    });
});

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});