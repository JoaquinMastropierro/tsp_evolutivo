import {Camino} from "./Camino";

export function obtenerPoblacionInicial(cant_ciudades){
    //creo la lista de ciudades
    let ciudades = [];
    for(let i = 0; i < cant_ciudades; i++)
        ciudades[i]=i

    let poblacion = []
    
    for(let i=0; i<cant_ciudades; i++){
        let ciudades_restantres = ciudades.slice()
        let camino_actual = []
        for(let j=0; j<cant_ciudades; j++){
            camino_actual[j] = ciudades_restantres.
                splice(Math.floor(Math.random() * ciudades_restantres.length),1)[0]
        }
        poblacion[i] = new Camino(camino_actual); 
    }
    return poblacion
}