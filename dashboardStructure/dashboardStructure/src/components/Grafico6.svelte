<script>
    /*import {dataByPortAge} from '../stores_titanic.js';
    dataByPortAge.subscribe(result => {
  console.log('Edad por puerto:', result);
});


import {dataBySexAge} from '../stores_titanic.js';
    dataBySexAge.subscribe(result => {
  console.log('Edad por sexo:', result);
  

});

import { onMount } from "svelte";
  import { scaleLinear, select } from "d3";
import { curveMonotoneX, line} from "d3";
import {dataByClassEjemplo, ageStats, maxCount} from '../stores_titanic.js';

let svg;
    let width = 500, height = 500;
    onMount(() => {
      const svgElement = select(svg);
      
      dataByClassEjemplo.subscribe(data => {
        console.log('Edad por clase ejemplo:', data);
        svgElement.selectAll("circle").remove(); // Limpiar antes de redibujar
  
        const xScale = scaleLinear().domain([0, 100]).range([50, width - 50]);
        const yScale = scaleLinear().domain([0, 100]).range([height - 50, 50]);
        const rScale = scaleLinear().domain([0, maxCount]).range([2, 15]);
        
        const colors = {
          "3": '#ffafcc', // Tercera clase (rosa)
          "2": '#bde0fe', // Segunda clase (azul claro)
          "1": 'orange'   // Primera clase (naranja)
        };
        
        data.forEach(classData => {
          classData.values.forEach(d => {
            svgElement.append("circle")
              .attr("cx", xScale(d.Age))
              .attr("cy", yScale(d.count))
              .attr("r", rScale(d.count))
              .attr("fill", colors[classData.pclass])
              .attr("opacity", 0.7);
          });
        });
      });
    });

import {dataByClassEjemplo, ageStats, maxCount} from '../stores_titanic.js';
    dataByClassEjemplo.subscribe(result => {
  console.log('Edad por clase ejemplo:', result);
  const colors = {
		"3": '#ffafcc', // Tercera clase (rosa)
		"2": '#bde0fe', // Segunda clase (azul claro)
		"1": 'orange'   // Primera clase (naranja)
	};

  
});




import {dataByClassAge} from '../stores_titanic.js';
    dataByClassAge.subscribe(result => {
  console.log('Edad por clase:', result);
});



	// // Cuando width y height están definidos, configuramos las escalas y la línea
	// $: {
	// 	// Escala X basada en la edad (ageExtent)
	// 	//es como poner una regla de 3, está en los otros 2 componentes 
	// 	//Manualmente === function barHeight(count){return (count/maxCount)*100 + %}
	// 	xScale = scaleLinear().domain([$ageStats.min,$ageStats.max]).range([50, width - 50]);
	// 	// Escala Y basada en el número máximo de pasajeros (maxCount)
	// 	yScale = scaleLinear().domain([0, $maxCount]).range([adjustedHeight - 50, 50]);

	// 	// Definimos la línea que une los puntos de datos
	// 	lineG = line()
	// 		.x(d => xScale(d.Age)) // Posición X basada en la edad
	// 		.y(d => yScale(d.count)) // Posición Y basada en la cantidad de pasajeros
	// 		.curve(curveMonotoneX); // Suaviza la línea para una mejor visualización
	// }


//scala X

// escala Y 
*/
import { onMount } from "svelte";
import { get } from "svelte/store";
import { dataByClassEjemplo, maxCount } from "../stores_titanic.js";

let width = 250, height = 250; // Tamaño reducido

const colors = {
  "3": '#ffafcc',
  "2": '#bde0fe',
  "1": 'orange'
};

let puntos = [];
let maxY = 1;

onMount(() => {
  dataByClassEjemplo.subscribe(data => {
    let maxCountValue = get(maxCount) || 1;
    
    puntos = [];
    maxY = 0;

    data.forEach(classData => {
      classData.values.forEach(d => {
        puntos.push({
          x: d.Age,  
          y: d.count,  // Mantener el valor real
          color: colors[classData.pclass],
          size: (d.count / maxCountValue) * 10
        });

        if (d.count > maxY) maxY = d.count;
      });
    });

    maxY = Math.ceil(maxY / 10) * 10;
  });
});
</script>

<style>
  .chart {
    position: relative;
    width: 100%;
    max-width: 250px;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .point {
    position: absolute;
    border-radius: 50%;
    opacity: 0.7;
  }

  .x-axis-line, .y-axis-line {
    position: absolute;
    background-color: #000;
  }

  .x-axis-line {
    bottom: 20px;
    left: 20px;
    width: calc(100% - 40px);
    height: 2px;
  }

  .y-axis-line {
    left: 20px;
    bottom: 20px;
    height: calc(100% - 40px);
    width: 2px;
  }

  .x-axis-labels, .y-axis-labels {
    position: absolute;
    font-size: 10px;
    color: black;
  }

  .x-axis-labels {
    bottom: 5px;
    left: 20px;
    width: calc(100% - 40px);
    display: flex;
    justify-content: space-between;
  }

  .y-axis-labels {
    left: 5px;
    bottom: 20px;
    height: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>

<div class="chart">
  {#each puntos as { x, y, color, size }}
    <div class="point"
      style="left: {`${20 + x * ((width - 40) / 80) - size / 4}px`}; 
             bottom: {`${(y / maxY) * (height - 60) + 10 - size / 4}px`};

             width: {`${size / 1.5}px`}; 
             height: {`${size / 1.5}px`}; 
             background-color: {color};">
    </div>
  {/each}

  <div class="x-axis-line"></div>
  <div class="x-axis-labels">
    {#each Array(9) as _, i}
      <span>{i * 10}</span>
    {/each}
  </div>
  
  <div class="y-axis-line"></div>
  <div class="y-axis-labels">
    {#each Array(5) as _, i}
      <span>{Math.round((i * maxY) / 4)}</span>
    {/each}
  </div>
</div>



<!--
{#each $dataByClassEjemplo as item, i}
  <div class="clase">
    <h3>Clase {item.pclass}</h3>
    {#each item.values as punto}
      <div class="punto" style="background-color: {colors[item.pclass]}; width: {punto.count * 5}px;">
        {punto.Age}: {punto.count}
      </div>
    {/each}
  </div>
{/each}

 {#each $dataByClassEjemplo as item, i}
<div class="punto">{i}</div>
  {#each item.values as punto, i}
    <div class="punto">{punto.count}</div>
  {/each}
{/each} -->



 
  

  <!-- <script>
    import { onMount } from "svelte";
    import { scaleLinear, select } from "d3";
    import { dataByClassEjemplo, maxCount } from "../stores_titanic.js";
  
    let svg;
    let width = 500, height = 500;
  
    onMount(() => {
      const svgElement = select(svg);
      
      dataByClassEjemplo.subscribe(data => {
        svgElement.selectAll("circle").remove(); // Limpiar antes de redibujar
  
        const xScale = scaleLinear().domain([0, 100]).range([50, width - 50]);
        const yScale = scaleLinear().domain([0, 100]).range([height - 50, 50]);
        const rScale = scaleLinear().domain([0, maxCount]).range([2, 15]);
        
        const colors = {
          "3": '#ffafcc', // Tercera clase (rosa)
          "2": '#bde0fe', // Segunda clase (azul claro)
          "1": 'orange'   // Primera clase (naranja)
        };
        
        data.forEach(classData => {
          classData.values.forEach(d => {
            svgElement.append("circle")
              .attr("cx", xScale(d.Age))
              .attr("cy", yScale(d.count))
              .attr("r", rScale(d.count))
              .attr("fill", colors[classData.pclass])
              .attr("opacity", 0.7);
          });
        });
      });
    });
  </script>
  
  <svg bind:this={svg} width={width} height={height}></svg>
   -->