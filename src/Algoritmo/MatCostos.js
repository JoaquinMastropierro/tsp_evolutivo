export class MatCostos{
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