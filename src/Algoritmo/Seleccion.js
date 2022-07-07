import { Ruleta , RuletaRepetida } from './Ruleta'

export function seleccionarIndividuos(individuos, cant_individuos, tipo_seleccion, k, tipo_seleccionados){
    let mapeo = obtenerMapeoExponencial(individuos)

    let indices_seleccionados = tipo_seleccion=="torneo" ? 
        seleccionarTorneo(mapeo, cant_individuos, k, tipo_seleccionados) : 
            seleccionarRuleta(mapeo, cant_individuos, tipo_seleccionados)
    let caminos_seleccionados = []

    for(let i = 0; i<cant_individuos;i++){
        caminos_seleccionados[i]=individuos[indices_seleccionados[i]]
    }

    return caminos_seleccionados
}

function seleccionarTorneo(mapeo, cant_individuos, k, tipo_seleccionados){
    //crear arreglo de probabilidades
    let probabilidades =[];
    for(let i = 0; i < mapeo.length; i++){
        probabilidades[i] = 1/mapeo.length;
    }
    let rueda_ruleta = new Ruleta(probabilidades);
    
    return tipo_seleccionados=='distintos' ? 
        obtenerDistintos(mapeo, cant_individuos, k, rueda_ruleta) : 
            obtenerIguales(mapeo, cant_individuos, k, rueda_ruleta)
}

function obtenerIguales(mapeo, cant_individuos, k, rueda_ruleta){
    let seleccionados = []
    for(let i =0; i<cant_individuos; i++){
        let k_seleccionados = rueda_ruleta.seleccionarElementos(k)
        seleccionados[i] = seleccionarMejor(mapeo, k_seleccionados)
    }
    return seleccionados
}

function obtenerDistintos(mapeo, cant_individuos, k, rueda_ruleta){
    let seleccionados = []
    for(let i =0; i<cant_individuos; i++){
        let k_seleccionados = rueda_ruleta.seleccionarElementos(k)
        let seleccionado = seleccionarMejor(mapeo, k_seleccionados)
        while(seleccionados.includes(seleccionado)){
            k_seleccionados = rueda_ruleta.seleccionarElementos(k)
            seleccionado = seleccionarMejor(mapeo, k_seleccionados)
        }
        seleccionados[i] = seleccionado
    }
    return seleccionados
}

function seleccionarMejor(mapeo, k_seleccionados){
    let mejor = 0
    let mayor_mapeo = 0
    for(let i = 0; i<k_seleccionados.length; i++){
        if(mayor_mapeo < mapeo[k_seleccionados[i]]){
            mejor=k_seleccionados[i]
            mayor_mapeo=mapeo[k_seleccionados[i]]
        }
    }
    return mejor
}

function seleccionarRuleta(mapeo, cant_individuos, tipo_seleccionados){
    let ruleta = tipo_seleccionados=='distintos' ? 
        new Ruleta(mapeo) : new RuletaRepetida(mapeo)
    return ruleta.seleccionarElementos(cant_individuos)
}

function obtenerMapeoExponencial(individuos){
    //obtener indices de poblacion
    let indices = []
    for(let i =0; i<individuos.length; i++)
        indices[i]=i

    //indices ordenados en base al fitness que referencian en la poblacion
    indices.sort(function(a,b){
        return individuos[a].getFitness() - individuos[b].getFitness()
        // return individuos[a].sum - individuos[b].sum
    })

    let probabilidades=[]
    //obtener mapeo exponencial
    let C = 0
    // 1 - e^-i en cada elemento
    // ademas calculo C
    for(let i = 0; i<individuos.length; i++){
        probabilidades[i] = 1 - Math.exp(-(i+1))
        C+=probabilidades[i]
    }

    //divido cada elemento por C
    for(let i = 0; i<individuos.length; i++){
        probabilidades[i] = probabilidades[i]/C
    }
    
    //ahora reacomodo las probs en base a los indices
    
    //genero y relleno el arreglo resultado
    //porque sino tira error
    let mapeo_ordenado =[]
    for(let i =0; i<individuos.length; i++)
        mapeo_ordenado[i]=0

    //lo relleno en base a las probs obtenidas
    for(let i =0; i<individuos.length; i++)
        mapeo_ordenado[indices[i]]=probabilidades[i]

    //este arreglo tiene la probabilidad del camino poblacion[i] en mapeo_ordenado[i]
    return mapeo_ordenado
}