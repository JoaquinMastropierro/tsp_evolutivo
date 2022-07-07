export class Ruleta {
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

export class RuletaRepetida extends Ruleta{
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