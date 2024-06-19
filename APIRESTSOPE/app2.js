var express = require('express');
var mysql = require('mysql');
var cors = require('cors');


var app = express();
app.use(express.json());
app.use(cors());

//parametros de conexion
var conexion  = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'jugo2024',
    database: 'indupartes'
});

conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("Conexion Exitosa!");
    }
});

app.get('/', function(req,res){
    res.send('/form');
})

//mostrar los articulos 
app.get('/api/guias', (req,res)=>{
    conexion.query('SELECT * FROM guias ', (error, filas) =>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//mostrar un solo dato
app.get('/api/guias/:idguias', (req,res)=>{
    conexion.query('SELECT * FROM clientes WHERE idguias = ?',[req.params.idguias], (error, fila) =>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

//Insertar o crear un nuevo dato
app.post('/api/guias', (req,res) =>{
    let data = {idguias:req.body.idguias, Nombre:req.body.Nombre, Motor:req.body.Motor, Precio:req.body.Precio, Cantidad_caja:req.body.Cantidad_caja, Interior:req.body.Interior, Exterior:req.body.Exterior, Longitud:req.body.Longitud, Precio_caja:req.body.Precio_caja }
    let sql = "INSERT INTO guias SET ?" ;
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            Object.assign(data, {idguias: results.insertId }) //agregamos el ID al objeto data             
            res.send(data) //enviamos los valores               
        }
    });
});

//Editar datos
app.put('/api/guias/:idguias', (req,res) =>{
    let Nombre = req.body.Nombre
    let Motor = req.body.Motor
    let Precio = req.body.Precio
    let Cantidad_caja = req.body.Cantidad_caja
    let Interior = req.body.Interior
    let Exterior = req.body.Exterior
    let Longitud = req.body.Longitud
    let Precio_caja = req.body.Precio_caja
    let idguias = req.body.idguias
    let sql = "UPDATE guias SET Nombre = ?, Motor = ?, Precio = ?, Cantidad_caja = ?, Interior = ?, Exterior = ?, Longitud = ?, Precio_caja = ? WHERE idguias = ?" ;
    conexion.query(sql, [Nombre, Motor, Precio, Cantidad_caja, Interior, Exterior, Longitud, Precio_caja, idguias], function(error, results){
        if(error){
            throw error;
        }else{
        res.send(results);
        }
    });
});

//Eliminar datos
app.delete('/api/guias/:idguias', (req,res) => {
    conexion.query('DELETE FROM guias WHERE idguias = ?', [req.params.idguias], function(error,filas){
        if(error){
            throw error;
        }else{
        res.send(filas);
        }
    });
});
    
app.listen(4000, function(){
    console.log("Servidor Ok");
});