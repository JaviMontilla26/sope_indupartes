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
app.get('/api/empleados', (req,res)=>{
    conexion.query('SELECT * FROM empleados ', (error, filas) =>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
});

//mostrar un solo dato
app.get('/api/empleados/:idempleados', (req,res)=>{
    conexion.query('SELECT * FROM clientes WHERE idempleados = ?',[req.params.idempleados], (error, fila) =>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
});

//Insertar o crear un nuevo dato
app.post('/api/clientes', (req,res) =>{
    let data = {idempleados:req.body.idempleados, Nombre:req.body.Nombre, Apellido:req.body.Apellido, Edad:req.body.Edad, Cargo:req.body.Cargo, Direccion:req.body.Direccion, Telefono:req.body.Telefono}
    let sql = "INSERT INTO empleados SET ?" ;
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            Object.assign(data, {idempleados: results.insertId }) //agregamos el ID al objeto data             
            res.send(data) //enviamos los valores               
        }
    });
});

//Editar datos
app.put('/api/clientes/:idClientes', (req,res) =>{
    let Nombre = req.body.Nombre
    let Apellido = req.body.Apellido
    let Edad = req.body.Edad
    let Cargo = req.body.Cargo
    let Direccion = req.body.Direccion
    let Telefono = req.body.Telefono
    let idempleados = req.body.idempleados
    let sql = "UPDATE clientes SET Nombre = ?, Apellido = ?, Edad = ?, Cargo = ?, Direccion = ?, Telefono = ? WHERE idempleados = ?" ;
    conexion.query(sql, [Nombre, Apellido, Edad, Cargo, Direccion, Telefono, idempleados], function(error, results){
        if(error){
            throw error;
        }else{
        res.send(results);
        }
    });
});

//Eliminar datos
app.delete('/api/empleados/:idempleados', (req,res) => {
    conexion.query('DELETE FROM empleados WHERE idempleados = ?', [req.params.idempleados], function(error,filas){
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