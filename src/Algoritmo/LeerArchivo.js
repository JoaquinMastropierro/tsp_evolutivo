import br17 from '../br17.atsp'
import p43 from '../p43.atsp'

export async function LeerArchivo(instacia_problema) {
    let data
    if(instacia_problema == 'br17'){
        data = await fetch(br17)
        .then(response => response.text())
    }
    else{
        data = await fetch(p43)
        .then(response => response.text())
    }
    let dimension = obtenerDimension(data)
    let matriz = obtenerMatriz(data, dimension)
    return matriz
}

function obtenerMatriz(data, dimension){
    const matriz = []
    const arrFilas = data.split('EDGE_WEIGHT_SECTION')[1].split('EOF')[0].split('\n')
    for(let i = 1; i<=dimension; i++){
        const fila = []
        const arrCeldas = arrFilas[i].split(' ')
        let posicion=0
        for(let j = 0; j<dimension; j++){
            while(arrCeldas[posicion]==='')
                posicion++
            fila[j]=parseInt(arrCeldas[posicion])
            posicion++
        }
        matriz[i-1]=fila
    }
    return matriz
}

function obtenerDimension(data){
    let dimension = data.split('\n')[3].split('DIMENSION:')[1].split(' ')
    return parseInt(dimension[dimension.length-1])
}