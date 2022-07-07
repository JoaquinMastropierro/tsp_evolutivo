export function mutacion(camino, prob_mutar, cant_ciudades, tipo_mutacion){
    if( Math.random() < prob_mutar ){
        let ciudades = camino.getCodificacion();
        let pos_ciudad1 = Math.floor(Math.random() * cant_ciudades)
        let pos_ciudad2 = Math.floor(Math.random() * cant_ciudades)
        while(pos_ciudad1==pos_ciudad2){
            pos_ciudad2 = Math.floor(Math.random() * cant_ciudades)
        }
        
        if(tipo_mutacion == "insercion")
            mutacionPorInsercion(ciudades, pos_ciudad1, pos_ciudad2)
        else
            mutacionPorIntercambio(ciudades, pos_ciudad1, pos_ciudad2)
        camino.setCodificacion(ciudades)
    }
    
}

function mutacionPorIntercambio(ciudades, pos_ciudad1, pos_ciudad2){
    let ciudad_aux = ciudades[pos_ciudad1];
    ciudades[pos_ciudad1] = ciudades[pos_ciudad2];
    ciudades[pos_ciudad2] = ciudad_aux;
}

function mutacionPorInsercion(ciudades, pos_ciudad1, pos_ciudad2){
    //miro cual esta mas a la izquierda
    if(pos_ciudad1 < pos_ciudad2){
        corrimientoADerecha(ciudades, pos_ciudad1, pos_ciudad2)
    }
    else{
        corrimientoADerecha(ciudades, pos_ciudad2, pos_ciudad1)
    }
}

function corrimientoADerecha(ciudades, pos1, pos2){
    //miro que no esten uno al lado del otro
    if(pos1 < pos2 - 1){
        let ciudad_aux = ciudades[pos2];
        for(let i = pos2; i>pos1+1; i--){
            ciudades[i] = ciudades[i-1];
        }
        ciudades[pos1+1]=ciudad_aux;
    }
}