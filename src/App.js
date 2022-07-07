import './App.css';
import Grafico from './Grafico';
import { evolucion } from './Algoritmo/AlgoritmoEvolutivo';
import { useState } from 'react';
import { scroller as scroll, Element } from 'react-scroll'
import { saveAs} from 'file-saver'


function App() {
  const [values, setValues] = useState({});
  const [resultado, setResultado] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    
    evolucion(values)
      .then(response => {
        setResultado(response)
        
        setValues({
          ...values,
          ['estado']:'listo'
        })
      })

    scroll.scrollTo('punto-scroll',{
      duration:1000,
      delay: 100,
      smooth: true
    })
  }

  const obtenerArchivo = () => {
    let contenido = 'Instacia del problema: ' + resultado.instancia_problema
    contenido+= '\nTipo de mutacion: ' + resultado.tipo_mutacion
    contenido+= '\nProbabilidad de mutacion: ' + resultado.prob_mutacion
    contenido+= '\nTipo de cruce: ' + resultado.tipo_cruce
    contenido+= '\nTipo de seleccion de padres: ' + resultado.tipo_seleccion_padres
    if(resultado.tipo_seleccion_padres=='torneo')
      contenido+= '\nValor de k se seleccion de padres: ' + resultado.k_padres
    contenido+= '\nTipo de seleccion de sobrevivientes: ' + resultado.tipo_seleccion_sobrevivientes
    if(resultado.tipo_seleccion_sobrevivientes=='torneo')
      contenido+= '\nValor de k se seleccion de sobrevivientes: ' + resultado.k_sobrevivientes
    contenido+= '\nCosto del mejor individuo inicial: ' + resultado.mejor_individuo_inicial.costo
    contenido+= '\nCosto del mejor individuo obtenido: ' + resultado.mejor_individuo.costo
    contenido+= '\nCodificacion del mejor individuo obtenido: [' + resultado.mejor_individuo.codificacion + ']'
    contenido+= '\nEvolucion del mejor fitness: [' + resultado.evolucion_mejor_fitness + ']'
    contenido+= '\nTiempo de ejecucion:  ' + resultado.tiempo_ejecucion + 'ms'
    return contenido
  }

  const handleDownload = () => {
    const blob = new Blob([obtenerArchivo()], {type: 'text/plain;charset=utf-8'})
    saveAs(blob, 'datos-ejecucion.txt')
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
        ...values,
        [name]: value,
    })
  }

  return (
    <div className="body">
      <h1>Problema del Viajante</h1>
      <p>
        Completando el siguienten formulario se podra resolver<br/> el problema del viajante utilizando 
        un algoritmo evolutivo.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="input">
          Seleccionar conjunto de ciudades
          <label>
            <input
              type="radio"
              name="instancia_problema"
              value="br17"
              checked={values.instancia_problema === "br17"}
              onChange={handleChange}
              required
            />
            br17
          </label>
          <label>
            <input
              type="radio"
              name="instancia_problema"
              value="p43"
              checked={values.instancia_problema === "p43"}
              onChange={handleChange}
              required
            />
            p43
          </label>
        </div>
        <div className="input">
          Seleccionar el tipo de mutacion
          <label>
            <input
              type="radio"
              name="tipo_mutacion"
              value="insercion"
              checked={values.tipo_mutacion === "insercion"}
              onChange={handleChange}
              required
            />
            insercion
          </label>
          <label>
            <input
              type="radio"
              name="tipo_mutacion"
              value="intercambio"
              checked={values.tipo_mutacion === "intercambio"}
              onChange={handleChange}
              required
            />
            intercambio
          </label>
        </div>
        <div className='input'>
          Seleccionar la probabilidad de mutacion
          <label>
            <input 
              type='number' 
              name='prob_mutacion'
              value={values.prob_mutacion}
              min='0.1' 
              step='0.01' 
              max='0.3'
              onChange={handleChange} 
              required
            />
          </label>
        </div>
        <div className="input">
          Seleccionar el tipo de cruce
          <label>
            <input
              type="radio"
              name="tipo_cruce"
              value="PMX"
              checked={values.tipo_cruce === "PMX"}
              onChange={handleChange}
              required
            />
            PMX
          </label>
          <label>
            <input
              type="radio"
              name="tipo_cruce"
              value="de orden"
              checked={values.tipo_cruce === "de orden"}
              onChange={handleChange}
              required
            />
            de orden
          </label>
        </div>
        <div className="input">
          Seleccionar el tipo de seleccion de padres
          <label>
            <input
              type="radio"
              name="tipo_seleccion_padres"
              value="torneo"
              checked={values.tipo_seleccion_padres === "torneo"}
              onChange={handleChange}
              required
            />
            torneo
          </label>
          <label>
            <input
              type="radio"
              name="tipo_seleccion_padres"
              value="rueda de ruleta"
              checked={values.tipo_seleccion_padres === "rueda de ruleta"}
              onChange={handleChange}
              required
            />
            rueda de ruleta
          </label>
        </div>
        {values.tipo_seleccion_padres == 'torneo' && 
          <div className='input'>
            Ingresar el valor de k para la seleccion de los padres por torneo
            <label>
              <input 
                type='number' 
                name='k_padres' 
                value={values.k_padres} 
                min='4' 
                step='1' 
                max='6' 
                onChange={handleChange} 
                required
              />
            </label>
          </div>
        }
        <div className="input">
          Seleccionar el tipo de seleccion de sobrevivientes
          <label>
            <input
              type="radio"
              name="tipo_seleccion_sobrevivientes"
              value="torneo"
              checked={values.tipo_seleccion_sobrevivientes === "torneo"}
              onChange={handleChange}
              required
            />
            torneo
          </label>
          <label>
            <input
              type="radio"
              name="tipo_seleccion_sobrevivientes"
              value="rueda de ruleta"
              checked={values.tipo_seleccion_sobrevivientes === "rueda de ruleta"}
              onChange={handleChange}
              required
            />
            rueda de ruleta
          </label>
        </div>
        {values.tipo_seleccion_sobrevivientes == 'torneo' && 
          <div className='input'>
            Ingresar el valor de k para la seleccion de los sobrevivientes por torneo
            <label>
              <input 
                type='number' 
                name='k_sobrevivientes' 
                value={values.k_sobrevivientes} 
                min='4' 
                step='1' 
                max='6' 
                onChange={handleChange} 
                required
              />
            </label>
          </div>
        }
        <input type='submit' value='Ejecutar' />
      </form>
      {values.estado == 'listo' &&
        <div className='resultado'>
          <h2>Resultados</h2>
          <h3>
            Instacia del problema: {resultado.instancia_problema} <br/>
            Tipo de mutacion: {resultado.tipo_mutacion} <br/>
            Probabilidad de mutacion: {resultado.prob_mutacion} <br/>
            Tipo de cruce: {resultado.tipo_cruce} <br/>
            Tipo de seleccion de padres: {resultado.tipo_seleccion_padres} <br/>
            {resultado.tipo_seleccion_padres=='torneo' && <>Valor de k se seleccion de padres: {resultado.k_padres} <br/></>} 
            Tipo de seleccion de sobrevivientes: {resultado.tipo_seleccion_sobrevivientes} <br/>
            {resultado.tipo_seleccion_sobrevivientes=='torneo' && <>Valor de k se seleccion de sobrevivientes: {resultado.k_sobrevivientes} <br/></>}
            Costo del mejor individuo inicial: {resultado.mejor_individuo_inicial.costo}<br/>          
            Costo del mejor individuo obtenido: {resultado.mejor_individuo.costo}<br/>
            Tiempo de ejecucion: {resultado.tiempo_ejecucion}ms<br/>
          </h3>
          <div className='grafico'>
            <Grafico 
              valores_x={resultado.iteraciones} 
              valores_y={resultado.evolucion_mejor_fitness} 
              titulo={'Evolucion del mejor fitness'}  
              eje_x={'Iteraciones'} 
              eje_y={'Fitness'} 
            />
          </div>  
          <button onClick={handleDownload}>Descargar Archivo</button>
        </div>
      }
      <Element name='punto-scroll'/>
    </div>

  );
}

export default App;
