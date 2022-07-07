export class Camino{

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