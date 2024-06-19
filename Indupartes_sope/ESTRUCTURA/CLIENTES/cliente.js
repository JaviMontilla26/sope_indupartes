    //Definición de variables
const url = 'http://localhost:4000/api/clientes/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalClientes = new bootstrap.Modal(document.getElementById('modalClientes'))
const formCliente = document.querySelector('form')
const idClientes = document.getElementById('idClientes')
const Nombre = document.getElementById('Nombre')
const Telefono = document.getElementById('Telefono')
const Direccion = document.getElementById('Direccion')
const Estado = document.getElementById('Estado')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    idClientes.value = ''
    Nombre.value = ''
    Telefono.value = ''
    Direccion.value = ''
    Estado.value = ''
    modalClientes.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (articulos) => {
    articulos.forEach(cliente => {
        resultados += `<tr>
                            <td>${cliente.idClientes}</td>
                            <td>${cliente.Nombre}</td>
                            <td>${cliente.Telefono}</td>
                            <td>${cliente.Direccion}</td>
                            <td>${cliente.Estado}</td>
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
    const Telefonoform = fila.children[2].innerHTML
    const Direccionform = fila.children[3].innerHTML
    const Estadoform = fila.children[4].innerHTML
    Nombre.value = Nombreform
    Telefono.value = Telefonoform
    Direccion.value = Direccionform
    Estado.value = Estadoform
    opcion = 'editar'
    modalClientes.show()

  
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
                idClientes:idClientes.value,
                Nombre:Nombre.value,
                Telefono:Telefono.value,
                Direccion:Direccion.value,
                Estado:Estado.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoCliente = []
            nuevoCliente.push(data)
            mostrar(nuevoCliente) 
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
                idClientes:idClientes.value,
                Nombre:Nombre.value,
                Telefono:Telefono.value,
                Direccion:Direccion.value,
                Estado:Estado.value
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoCliente = []
            nuevoCliente.push(data)
            mostrar(nuevoCliente) 
        })
        .then( response => location.reload() )
    }
    modalClientes.hide()
})








