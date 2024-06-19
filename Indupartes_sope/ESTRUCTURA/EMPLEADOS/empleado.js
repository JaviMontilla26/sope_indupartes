const url = 'http://localhost:4000/api/empleados/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalEmpleados = new bootstrap.Modal(document.getElementById('modalEmpleados'))
const formEmpleados = document.querySelector('form')
const idempleados = document.getElementById('idempleados')
const Nombre = document.getElementById('Nombre')
const Apellido = document.getElementById('Apellido')
const Edad = document.getElementById('Edad')
const Cargo = document.getElementById('Cargo')
const Direccion = document.getElementById('Direccion')
const Telefono = document.getElementById('Telefono')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    idempleados.value = ''
    Nombre.value = ''
    Apellido.value = ''
    Edad.value = ''
    Cargo.value = ''
    Direccion.value = ''
    Telefono = ''
    modalEmpleados.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (articulos) => {
    articulos.forEach(cliente => {
        resultados += `<tr>
                            <td>${cliente.idempleados}</td>
                            <td>${cliente.Nombre}</td>
                            <td>${cliente.Apellido}</td>
                            <td>${cliente.Edad}</td>
                            <td>${cliente.Cargo}</td>
                            <td>${cliente.Direccion}</td>
                            <td>${cliente.Telefono}</td>
                            <td class="text-center"><a class="btnEditar btn btn-primary">Editar</a><a class="btnBorrar btn btn-danger">Borrar</a></td>
                       </tr>
                    `    
    })
    contenedor.innerHTML = resultados
    
}

//Procedimiento Mostrar
fetch(url)
    .then( response => response.json() )
    .then( data => mostrar(data) )
    .catch( error => console.log(error))

  
const on = (element, event, selector, handler) => {
    //console.log(element)
    //console.log(event)
    //console.log(selector)
    //console.log(handler)
    element.addEventListener(event, e => {
        if(e.target.closest(selector)){
            handler(e)
        }
    })
}

//Procedimiento Borrar
on(document, 'click', '.btnBorrar', e => {
    const fila = e.target.parentNode.parentNode
    const id = fila.firstElementChild.innerHTML
    alertify.confirm("This is a confirm dialog.",
    function(){
        fetch(url+id, {
            method: 'DELETE'
        })
        .then( res => res.json() )
        .then( ()=> location.reload())
        //alertify.success('Ok')
    },
    function(){
        alertify.error('Cancel')
    })
})

//Procedimiento Editar
let idForm = 0
on(document, 'click', '.btnEditar', e => {
    const fila = e.target.parentNode.parentNode
    idForm = fila.children[0].innerHTML
    const Nombreform = fila.children[1].innerHTML
    const Apellidoform = fila.children[2].innerHTML
    const Edadform = fila.children[3].innerHTML
    const Cargoform = fila.children[4].innerHTML
    const Direccionform = fila.children[5].innerHTML
    const Telefonoform = fila.children[6].innerHTML
    Nombre.value = Nombreform
    Apellido.value = Apellidoform
    Edad.value = Edadform
    Cargo.value = Cargoform
    Direccion.value = Direccionform
    Telefono.value = Telefonoform
    opcion = 'editar'
    modalEmpleados.show()

  
})

//Procedimiento para Crear y Editar 
formCliente.addEventListener('submit', (e) =>{
    e.preventDefault()
    if(opcion=='crear'){
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                idempleados:idempleados.value,
                Nombre:Nombre.value,
                Apellido:Apellido.value,
                Edad:Edad.value,
                Cargo:Cargo.value,
                Direccion:Direccion.value,
                Telefono:Telefono.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoEmpleado = []
            nuevoEmpleado.push(data)
            mostrar(nuevoEmpleado) 
        })
    }
    if(opcion=='editar'){
        //console.log('OPCION EDITAR')
        fetch(url+idForm,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                idempleados:idempleados.value,
                Nombre:Nombre.value,
                Apellido:Apellido.value,
                Edad:Edad.value,
                Cargo:Cargo.value,
                Direccion:Direccion.value,
                Telefono:Telefono.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoEmpleado = []
            nuevoEmpleado.push(data)
            mostrar(nuevoEmpleado) 
        })
        .then( response => location.reload() )
    }
    modalEmpleados.hide()
})