import br17 from '../br17.atsp'
import p43 from '../p43.atsp'
//-------------------------------------------------
// LECTURA DEL ARCHIVO
async function LeerArchivo(instacia_problema) {
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
//-------------------------------------------------
// MATRIZ DE COSTOS
class MatCostos{
    constructor(matriz){
        this.matriz = matriz
        this.cant_ciudades = matriz.length
    }
    getCosto(c1, c2){
        return this.matriz[c1][c2]
    }
    getCantCiudades(){
        return this.cant_ciudades
    }
}
//-------------------------------------------------
// CAMINO
class Camino{

    //static para que todos los caminos accedan a la misma matriz
    static mat_costos 
    static setCostos(mat){
        this.mat_costos = mat
    }

    static distancia(c1,c2){
        return this.mat_costos.getCosto(c1,c2)
    }

    constructor(ciudades){
        this.ciudades = ciudades.slice();
        this.costo = -1
    }

    getCosto(){
        if(this.costo==-1){
            this.costo = 0;
            for(let i = 0; i < this.ciudades.length-1; i++ ){
                this.costo+= Camino.distancia(
                    this.ciudades[i],this.ciudades[i+1])
            }
            this.costo+= Camino.distancia(
                this.ciudades[this.ciudades.length-1],this.ciudades[0])
        }
        return this.costo
    }

    setCodificacion(ciudades){
        this.ciudades = ciudades.slice()
        this.costo = -1
    }

    getFitness(){
        return 1 / this.getCosto();
    }

    getCodificacion(){
        return this.ciudades.slice();
    }
}

//-------------------------------------------------
// POBLACION INICIAL
function obtenerPoblacionInicial(cant_ciudades){
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

//-------------------------------------------------
// RULETA
class Ruleta {
    constructor(probabilidades) {
      this.probs_acumuladas=this.calcProbs(probabilidades)
    }
    
    calcProbs(probabilidades){
      let probs_acum = []
      let acumulacion = 0.0;
      probabilidades.forEach(proba => {
        acumulacion = proba + acumulacion;
        probs_acum.push(acumulacion)
      });
      return probs_acum
    }

    setProbs(probabilidades){
      this.probs_acumuladas=this.calcProbs(probabilidades)
    }

    getRandom() {
      const prob = Math.random();
      let pos = 0;
      while(pos < this.probs_acumuladas.length){
        if(prob < this.probs_acumuladas[pos])
          return pos;
        pos++;
      }
      return this.probs_acumuladas.length - 1;
    }

    //selecciona una cantidad de elementos seguidos a la lista seleccion
    //seleccion terminara como maximo con la misma cantidad de elementos 
    // como elementos tenga la ruleta
    rellenarElementos(seleccion, cantidad){
      let restantes = (cantidad>this.probs_acumuladas.length) ? this.probs_acumuladas.length : cantidad
      for(let i = seleccion.length; i < restantes; i++){
        let elem_actual = this.getRandom();
        while(seleccion.includes(elem_actual))
          elem_actual = this.getRandom();
        seleccion[i] =elem_actual;
      }
    }
    
    seleccionarElementos(cantidad){
      let seleccion = []
      for(let i = 0; i<cantidad; i++){
        let elem_actual = this.getRandom();
        while(seleccion.includes(elem_actual))
            elem_actual = this.getRandom();
        seleccion[i] =elem_actual;
      }
      return seleccion
    }
}

class RuletaRepetida extends Ruleta{
    constructor(probabilidades){
        super(probabilidades)
    }

    seleccionarElementos(cantidad){
        let seleccion = []
        for(let i = 0; i<cantidad; i++)
          seleccion[i] = super.getRandom();
        return seleccion
      }

}

//-------------------------------------------------
// MUTACION
function mutacion(camino, prob_mutar, cant_ciudades, tipo_mutacion){
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

//-------------------------------------------------
// SELECCION
function seleccionarIndividuos(individuos, cant_individuos, tipo_seleccion, k, tipo_seleccionados){
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

//-------------------------------------------------
// CRUCE
function cruce(padres, tipo_cruce, cant_ciudades){
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
    //creo el arreglo y lo lleno porque si no lo lleno no anda
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
//-------------------------------------------------
// OBTENER MEJORES INDIVIDUOS
function obtenerMejorFitness(poblacion){
    let fitness = 0
    for(let i = 0; i<poblacion.length; i++)
        if(fitness < poblacion[i].getFitness()){
            fitness = poblacion[i].getFitness()
        }
    return fitness
}
//-------------------------------------------------
// OBTENER MEJORE CAMINO
function obtenerMejorCamino(poblacion){
    let mejor_camino = poblacion[0]
    for(let i = 1; i<poblacion.length; i++)
        if(mejor_camino.getCosto() > poblacion[i].getCosto())
            mejor_camino = poblacion[i]
    return mejor_camino
}


//-------------------------------------------------
// EJECUCION
export default async function ejecucion({instancia_problema, tipo_mutacion, prob_mutacion, tipo_cruce, tipo_seleccion_padres, k_padres, tipo_seleccion_sobrevivientes, k_sobrevivientes}){
    // Parametros de entrada
    // let instacia_problema = 'br17'
    // let tipo_mutacion = 'insercion2'
    // let prob_mutacion = 0.5
    // let tipo_cruce = 'PMX'
    // let tipo_seleccion_padres = 'torneo'
    // let k_padres = 3
    // let tipo_seleccion_sobrevivientes = 'torneo'
    // let k_sobrevivientes = 3

    // Run
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

    let start = performance.now()
    for( let i = 0; i<cant_ciudades; i++){

        //muto poblacion
        for(let i = 0; i<cant_ciudades; i++)
            mutacion(poblacion[i], prob_mutacion, cant_ciudades, tipo_mutacion)

        //seleccionar padres
        padres = seleccionarIndividuos(poblacion, cant_ciudades, tipo_seleccion_padres, k_padres, 'no_distintos')

        hijos = cruce(padres, tipo_cruce, cant_ciudades)

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
    console.log(start + ' ' + end + ' ' + (end-start))
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