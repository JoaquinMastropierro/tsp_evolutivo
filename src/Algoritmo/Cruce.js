import { Camino } from './Camino'

export function cruce(padres, tipo_cruce, cant_ciudades){
    //creo un array para seleccionar los padres
    let indices_padres = []
    for(let i = 0; i<padres.length; i++)
        indices_padres[i]=i;

    //lo reacomodo para generar parejas
    indices_padres.sort(function(){return Math.random() - 0.5})

    const func_cruce = tipo_cruce=="PMX" ? crucePMX : cruceOrden;

    const hijos =[];

    for(let i = 0; i<padres.length-1; i=i+2){
        let puntosCruce = obtenerPuntosCruce(cant_ciudades)
        hijos.push(new Camino(func_cruce(padres[indices_padres[i]].getCodificacion(), padres[indices_padres[i+1]].getCodificacion(), puntosCruce[0],puntosCruce[1], cant_ciudades)))
        hijos.push(new Camino(func_cruce(padres[indices_padres[i+1]].getCodificacion(), padres[indices_padres[i]].getCodificacion(), puntosCruce[0],puntosCruce[1], cant_ciudades)))
    }
    return hijos
}

function cruceOrden(padre1, padre2, punto1, punto2,cant_ciudades){
    //creo el arreglo y lo relleno 
    const hijo = []
    for(let i = 0; i<cant_ciudades;i++)
        hijo[i] = -1

    let cant_copiados = 0

    //copio el fragmento del primer padre
    for(let i = punto1; i<=punto2; i++){
        hijo[i]=padre1[i]
        cant_copiados++
    }

    let posicion_hijo = (punto2+1==cant_ciudades) ? 0 : punto2+1
    let posicion_padre2 = posicion_hijo

    //copio en base al orden en segundo padre
    while(cant_copiados < cant_ciudades){
        if(!hijo.includes(padre2[posicion_padre2])){
            hijo[posicion_hijo] = padre2[posicion_padre2] 
            cant_copiados++
            posicion_hijo = (posicion_hijo+1==cant_ciudades) ? 0 : posicion_hijo+1
        }
        posicion_padre2 = (posicion_padre2+1==cant_ciudades) ? 0 : posicion_padre2+1
    }
    return hijo
}

function obtenerPosicionPMX(padre2, hijo, posicion_padre2){
    let pos = padre2.indexOf( hijo[posicion_padre2] )
    if( hijo[pos] == -1 )
        return pos
    else
        return obtenerPosicionPMX(padre2, hijo, pos)
}

function crucePMX(padre1, padre2, punto1, punto2,cant_ciudades){
    //creo el arreglo y lo lleno porque si no lo lleno no anda
    const hijo = []
    for(let i = 0; i<cant_ciudades;i++)
        hijo[i] = -1

    //copio el fragmento del primer padre
    for(let i = punto1; i<=punto2; i++){
        hijo[i]=padre1[i]
    }

    //completar con elementos de p2 entre puntos de cruce que no estan en el hijo
    for(let i = punto1; i<=punto2; i++){
        if(!hijo.includes(padre2[i])){
            hijo[obtenerPosicionPMX(padre2, hijo, i)] = padre2[i]
        }
    }
    
    for(let i = 0; i<cant_ciudades; i++){
        if(hijo[i] == -1)
            hijo[i] = padre2[i]
    }

    return hijo
}

function obtenerPuntosCruce(cantidad){
    let val1 = Math.floor(Math.random() * cantidad)
    let val2 = Math.floor(Math.random() * cantidad)
    while (val1 == val2)
        val2 = Math.floor(Math.random() * cantidad)
    return (val1<val2) ? [val1,val2] : [val2,val1]
}