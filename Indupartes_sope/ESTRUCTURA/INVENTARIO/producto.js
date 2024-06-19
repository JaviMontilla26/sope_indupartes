//Definición de variables
const url = 'http://localhost:4000/api/guias/'
const contenedor = document.querySelector('tbody')
let resultados = ''

const modalProductos = new bootstrap.Modal(document.getElementById('modalProductos'))
const formProducto = document.querySelector('form')
const idguias = document.getElementById('idguias')
const Nombre = document.getElementById('Nombre')
const Motor = document.getElementById('Motor')
const Precio = document.getElementById('Precio')
const Cantidad_caja = document.getElementById('Cantidad_caja')
const Interior = document.getElementById('Interior')
const Exterior = document.getElementById('Exterior')
const Longitud = document.getElementById('Longitud')
const Precio_caja = document.getElementById('Precio_caja')
var opcion = ''

btnCrear.addEventListener('click', ()=>{
    idguias.value = ''
    Nombre.value = ''
    Motor.value = ''
    Precio.value = ''
    Cantidad_caja.value = ''
    Interior.value =''
    Exterior.value =''
    Longitud.value =''
    Precio_caja = ''
    modalProductos.show()
    opcion = 'crear'
})

//funcion para mostrar los resultados
const mostrar = (articulos) => {
    articulos.forEach(producto => {
        resultados += `<tr>
                            <td>${producto.idguias}</td>
                            <td>${producto.Nombre}</td>
                            <td>${producto.Motor}</td>
                            <td>${producto.Precio}</td>
                            <td>${producto.Cantidad_caja}</td>
                            <td>${producto.Interior}</td>
                            <td>${producto.Exterior}</td>
                            <td>${producto.Longitud}</td>
                            <td>${producto.Precio_caja}</td>
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
    const Motorform = fila.children[2].innerHTML
    const Precioform = fila.children[3].innerHTML
    const Cantidad_cajaform = fila.children[4].innerHTML
    const Interiorform = fila.children[5].innerHTML
    const Exteriorform = fila.children[6].innerHTML
    const Longitudform = fila.children[7].innerHTML
    const Precio_cajaform = fila.children[8].innerHTML
    Nombre.value = Nombreform
    Motor.value = Motorform
    Precio.value = Precioform
    Cantidad_caja.value = Cantidad_cajaform
    Interior.value = Interiorform
    Exterior.value = Exteriorform
    Longitud.value = Longitudform
    Precio_caja.value = Precio_cajaform
    opcion = 'editar'
    modalProductos.show()

  
})

//Procedimiento para Crear y Editar 
formProducto.addEventListener('submit', (e) =>{
    e.preventDefault()
    if(opcion=='crear'){
        //console.log('OPCION CREAR')
        fetch(url, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                idguias:idguias.value,
                Nombre:Nombre.value,
                Motor:Motor.value,
                Precio:Precio.value,
                Cantidad_caja:Cantidad_caja.value,
                Interior:Interior.value,
                Exterior:Exterior.value,
                Longitud:Longitud.value,
                Precio_caja:Precio_caja.value 
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoProducto = []
            nuevoProducto.push(data)
            mostrar(nuevoProducto) 
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
                idguias:idguias.value,
                Nombre:Nombre.value,
                Motor:Motor.value,
                Precio:PrecioUnidad.value,
                Cantidad_caja:Cantidad_caja.value,
                Interior:Interior.value,
                Exterior:Exterior.value,
                Longitud:Longitud.value,
                Precio_caja:Precio_caja.value 
            })
        })
        .then( response => response.json() )
        .then( data => {
            const nuevoProducto = []
            nuevoProducto.push(data)
            mostrar(nuevoProducto) 
        })
        .then( response => location.reload() )
    }
    modalProductos.hide()
})