// 1 invocar express
const express = require('express');
const app = express();

// 2 setear url econoded capura datos formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// 3 invocar dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

// 4 directorio public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname +'/public'));

//5 motor de plantillas
app.set('view engine','ejs');

//6 invocar bcryptjs
const bcryptjs = require('bcryptjs');

//7 Variables de sesion
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
})); 

// 8 Invocar modulo de conexion 
const connection = require('./database/db');


// 9 establecimiento de rutas 

app.get('/login', (req,res)=>{
    res.render('login');
})

app.get('/register', (req,res)=>{
    res.render('register');
})

//10 Registro
app.post('/register', async (req,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register', {
				alert: true,
				alertTitle: "Registration",
				alertMessage: "¡Usuario Registrado!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: ''
			});
            //res.redirect('/');         
        }
	});
})

//11 Loguearse 
app.post('/auth', async (req,res)=>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD incorrectas",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'    
                });			
        } else {            
            req.session.loggedin = true;                
            req.session.name = results[0].name;
            res.render('login', {
                alert: true,
                alertTitle: "Conexión exitosa",
                alertMessage: "¡LOGIN CORRECTO!",
                alertIcon:'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });        			
        }			
        res.end();
    });
} else {	
    res.send('Please enter user and Password!');
    res.end();
}
});

//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('index',{
			login:false,
			name:'Iniciar sesion',			
		});				
	}
	res.end();
});


//Limpiar cache
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});





app.listen(4001, (req, res) =>{
    console.log('servidor ok en http://localhost:4001');
})