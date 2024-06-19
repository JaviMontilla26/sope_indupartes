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
app.get('/api/clientes', (req,res)=>{
    conexion.query('SELECT * FROM clientes ', (error, filas) =>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//mostrar un solo dato
app.get('/api/clientes/:idClientes', (req,res)=>{
    conexion.query('SELECT * FROM clientes WHERE idClientes = ?',[req.params.idClientes], (error, fila) =>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

//Insertar o crear un nuevo dato
app.post('/api/clientes', (req,res) =>{
    let data = {idClientes:req.body.idClientes, Nombre:req.body.Nombre, Telefono:req.body.Telefono, Direccion:req.body.Direccion, Estado:req.body.Estado}
    let sql = "INSERT INTO clientes SET ?" ;
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            Object.assign(data, {idClientes: results.insertId }) //agregamos el ID al objeto data             
            res.send(data) //enviamos los valores               
        }
    });
});

//Editar datos
app.put('/api/clientes/:idClientes', (req,res) =>{
    let Nombre = req.body.Nombre
    let Telefono = req.body.Telefono
    let Direccion = req.body.Direccion
    let Estado = req.body.Estado
    let idClientes = req.body.idClientes
    let sql = "UPDATE clientes SET Nombre = ?, Telefono = ?, Direccion = ?, Estado = ? WHERE idClientes = ?" ;
    conexion.query(sql, [Nombre, Telefono, Direccion, Estado, idClientes], function(error, results){
        if(error){
            throw error;
        }else{
        res.send(results);
        }
    });
});

//Eliminar datos
app.delete('/api/clientes/:idClientes', (req,res) => {
    conexion.query('DELETE FROM clientes WHERE idClientes = ?', [req.params.idClientes], function(error,filas){
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