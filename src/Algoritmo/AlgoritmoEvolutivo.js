import { obtenerPoblacionInicial } from "./ObtenerPoblacionInicial"
import { LeerArchivo } from "./LeerArchivo"
import { mutacion } from "./Mutacion"
import { cruce } from "./Cruce"
import { seleccionarIndividuos } from "./Seleccion"
import { MatCostos } from "./MatCostos"
import { Camino } from "./Camino"

export async function evolucion({instancia_problema, tipo_mutacion, prob_mutacion, tipo_cruce, tipo_seleccion_padres, k_padres, tipo_seleccion_sobrevivientes, k_sobrevivientes}){
    //se genera la matriz de costos leyendo el archivo de la instancia del problema
    let mat = new MatCostos(await LeerArchivo(instancia_problema))
    let cant_ciudades = mat.getCantCiudades()
    Camino.setCostos(mat)

    let mejores_fitness=[]

    let poblacion = []
    let padres = []
    let hijos = []

    //obtengo pob inicial
    poblacion = obtenerPoblacionInicial(cant_ciudades)
    
    mejores_fitness[0] = obtenerMejorFitness(poblacion)

    let mejor_camino_inicio = obtenerMejorCamino(poblacion)
    mejor_camino_inicio={'codificacion':mejor_camino_inicio.getCodificacion(), 'costo':mejor_camino_inicio.getCosto()}

    //comienza el loop en donde la poblacion evoluciona
    let start = performance.now()
    for( let i = 0; i<cant_ciudades; i++){

        //muto poblacion
        for(let i = 0; i<cant_ciudades; i++)
            mutacion(poblacion[i], prob_mutacion, cant_ciudades, tipo_mutacion)

        //seleccionar padres
        padres = seleccionarIndividuos(poblacion, cant_ciudades, tipo_seleccion_padres, k_padres, 'no_distintos')

        //se obtienen los hijos a partir del cruce de los padres
        hijos = cruce(padres, tipo_cruce, cant_ciudades)

        //se seleccionan los individuos sobrevivientes
        poblacion = seleccionarIndividuos(poblacion.concat(hijos), cant_ciudades, tipo_seleccion_sobrevivientes, k_sobrevivientes, 'distintos')

        mejores_fitness[i+1] = obtenerMejorFitness(poblacion)
    }
    let end = performance.now()

    let mejor_camino = obtenerMejorCamino(poblacion)
    mejor_camino={'codificacion':mejor_camino.getCodificacion(), 'costo':mejor_camino.getCosto()}
    
    // creo un arreglo de iteraciones
    let iteraciones =[]
    for(let i= 0; i<=cant_ciudades; i++)
        iteraciones[i]=i
    
    return {'evolucion_mejor_fitness' : mejores_fitness,  
        'mejor_individuo':mejor_camino,
        'mejor_individuo_inicial':mejor_camino_inicio,
        'iteraciones': iteraciones,
        'instancia_problema' : instancia_problema,
        'tipo_mutacion' : tipo_mutacion,
        'prob_mutacion' : prob_mutacion,
        'tipo_cruce' : tipo_cruce,
        'tipo_seleccion_padres' : tipo_seleccion_padres,
        'k_padres' : k_padres,
        'tipo_seleccion_sobrevivientes' : tipo_seleccion_sobrevivientes,
        'k_sobrevivientes' : k_sobrevivientes,
        'tiempo_ejecucion' : Math.floor((end-start))
    }
}

function obtenerMejorFitness(poblacion){
    let fitness = 0
    for(let i = 0; i<poblacion.length; i++)
        if(fitness < poblacion[i].getFitness()){
            fitness = poblacion[i].getFitness()
        }
    return fitness
}

function obtenerMejorCamino(poblacion){
    let mejor_camino = poblacion[0]
    for(let i = 1; i<poblacion.length; i++)
        if(mejor_camino.getCosto() > poblacion[i].getCosto())
            mejor_camino = poblacion[i]
    return mejor_camino
}