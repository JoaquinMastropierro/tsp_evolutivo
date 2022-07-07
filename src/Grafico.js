import React from 'react';
import Plot from 'react-plotly.js';

export default function Grafico(props) {

    return(
        <Plot
        data={[
          {
            x: props.valores_x,
            y: props.valores_y,
            type: 'scatter'
          },
          {type: 'log'},
        ]}
        layout={ {width: 500, height: 350,
          title:props.titulo,  
          xaxis: {title: props.eje_x},
          yaxis: {title: props.eje_y} } } 
      />

    )
}