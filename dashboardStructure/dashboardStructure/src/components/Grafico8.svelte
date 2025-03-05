<!--<script lang="ts">
  import { scaleLinear, extent, max, line, bin} from 'd3';
  import type { Bin } from 'd3';
  import { dataBySurvivalFare } from '../stores_titanic.js';
  import * as d3 from 'd3'; // Import all d3 functions

  
  // Interfaz para los bins mapeados
  interface BinData {
    x0: number;
    x1: number;
    count: number;
    midpoint: number;
  }

  // Variables para almacenar los datos binneados
  let survivorsBins: BinData[] = [];
  // Escalas para los ejes
  let xScale: d3.ScaleLinear<number, number>;
  let yScale: d3.ScaleLinear<number, number>;

  // Dimensiones del SVG y márgenes
  let width = 600;
  let height = 300;
  let margin = { top: 20, right: 20, bottom: 50, left: 40 };

  // Suscribirse al store para obtener los datos de supervivientes
  dataBySurvivalFare.subscribe(result => {
    console.log('Fare results:', result);
    if (!result) return;
    const { survivors } = result;
    if (!survivors) return;

    // Extraer las tarifas de los supervivientes
    const fares = survivors.map(d => d.fare);
    // Hallar el mínimo y máximo de fare
    const [fareMin, fareMax] = extent(fares) as [number, number];

    // Crear el generador de bins para agrupar los datos en 10 intervalos
    const binGenerator = bin<{ fare: number }, number>()
      .domain([fareMin, fareMax])
      .thresholds(10)
      .value(d => d.fare);
    const bins = binGenerator(survivors);

    // Mapear cada bin a un objeto con: x0, x1, count y el punto medio (midpoint)
    survivorsBins = bins.map((b: Bin<{ fare: number }, number>) => {
      return {
        x0: b.x0 as number,
        x1: b.x1 as number,
        count: b.length,
        midpoint: ((b.x0 as number) + (b.x1 as number)) / 2
      };
    });

    // Configurar la escala X: de fareMin a fareMax → [margin.left, width - margin.right]
    xScale = scaleLinear()
      .domain([fareMin, fareMax])
      .range([margin.left, width - margin.right]);

    // Configurar la escala Y: de 0 a la cuenta máxima de pasajeros en un bin → [height - margin.bottom, margin.top]
    const maxCount = max(survivorsBins, d => d.count) || 0;
    yScale = scaleLinear()
      .domain([0, maxCount])
      .range([height - margin.bottom, margin.top]);
  });

  // Función para generar la línea
  const lineGenerator = line<BinData>()
    .x(d => xScale(d.midpoint))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX);  // Esto suaviza la curva de la línea
</script>

<div class="chart-container">
  <h2>Distribución de tarifas entre supervivientes</h2>
  <svg {width} {height} style="background: #222;">
    {#if xScale && yScale}
      <!- Dibujar la línea --
      <path d={lineGenerator(survivorsBins)} fill="none" stroke="limegreen" stroke-width="2" />

      <!- Dibujar los puntos en la línea --
      {#each survivorsBins as survivorBin}
        <circle 
          cx={xScale(survivorBin.midpoint)} 
          cy={yScale(survivorBin.count)} 
          r="4" 
          fill="limegreen" 
        />
        <!- Mostrar el número de supervivientes en la parte superior de cada punto --
        <text 
          x={xScale(survivorBin.midpoint)} 
          y={yScale(survivorBin.count) - 5} 
          fill="white" 
          text-anchor="middle" 
          font-size="12"
        >
          {survivorBin.count}
        </text>
      {/each}

      <!- Eje X --
      <line 
        x1={margin.left} 
        y1={height - margin.bottom} 
        x2={width - margin.right} 
        y2={height - margin.bottom} 
        stroke="white"
      />
      {#each xScale.ticks(10) as tick}
        <line 
          x1={xScale(tick)} 
          y1={height - margin.bottom} 
          x2={xScale(tick)} 
          y2={height - margin.bottom + 5} 
          stroke="white"
        />
        <text 
          x={xScale(tick)}
          y={height - margin.bottom + 20}
          fill="white"
          text-anchor="middle"
          font-size="12"
        >
          {tick.toFixed(1)}
        </text>
      {/each}

      <!- Eje Y ->
      <line 
        x1={margin.left} 
        y1={margin.top} 
        x2={margin.left} 
        y2={height - margin.bottom} 
        stroke="white"
      />
      {#each yScale.ticks(5) as tick}
        <line 
          x1={margin.left - 5} 
          y1={yScale(tick)} 
          x2={margin.left} 
          y2={yScale(tick)} 
          stroke="white"
        />
        <text 
          x={margin.left - 10} 
          y={yScale(tick)}
          fill="white"
          text-anchor="end"
          alignment-baseline="middle"
          font-size="12"
        >
          {tick}
        </text>
      {/each}
    {/if}
  </svg>
</div>

<style>
  .chart-container {
    max-width: 800px;
    margin: auto;
    text-align: center;
    font-family: Arial, sans-serif;
    background: #fff;
    padding: 1rem;
  }
  h2 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
  svg {
    display: block;
    margin: auto;
  }
</style>
-->
<!-- <script lang="ts">
  import { scaleLinear, extent, max, line, bin } from 'd3';
  import type { Bin } from 'd3';
  import { dataBySurvivalFare } from '../stores_titanic.js';
  import * as d3 from 'd3';

  // Interfaz para los bins mapeados
  interface BinData {
    x0: number;
    x1: number;
    count: number;
    midpoint: number;
  }

  // Variables para almacenar los datos binneados
  let survivorsBins: BinData[] = [];
  let nonSurvivorsBins: BinData[] = []; // Añadir para los no supervivientes
  // Escalas para los ejes
  let xScale: d3.ScaleLinear<number, number>;
  let yScale: d3.ScaleLinear<number, number>;

  // Dimensiones del SVG y márgenes
  let width = 600;
  let height = 300;
  let margin = { top: 20, right: 20, bottom: 50, left: 40 };

  // Suscribirse al store para obtener los datos de supervivientes y no supervivientes
  dataBySurvivalFare.subscribe(result => {
    console.log('Fare results:', result);
    if (!result) return;
    const { survivors, nonSurvivors } = result;
    if (!survivors || !nonSurvivors) return;

    // Extraer las tarifas de los supervivientes
    const survivorFares = survivors.map(d => d.fare);
    const nonSurvivorFares = nonSurvivors.map(d => d.fare);

    // Hallar el mínimo y máximo de fare
    const [fareMin, fareMax] = extent([...survivorFares, ...nonSurvivorFares]) as [number, number];

    // Crear el generador de bins para agrupar los datos en 10 intervalos
    const binGenerator = bin<{ fare: number }, number>()
      .domain([fareMin, fareMax])
      .thresholds(10)
      .value(d => d.fare);

    // Bins para supervivientes
    const survivorBins = binGenerator(survivors);
    survivorsBins = survivorBins.map((b: Bin<{ fare: number }, number>) => {
      return {
        x0: b.x0 as number,
        x1: b.x1 as number,
        count: b.length,
        midpoint: ((b.x0 as number) + (b.x1 as number)) / 2
      };
    });

    // Bins para no supervivientes
    const nonSurvivorBins = binGenerator(nonSurvivors);
    nonSurvivorsBins = nonSurvivorBins.map((b: Bin<{ fare: number }, number>) => {
      return {
        x0: b.x0 as number,
        x1: b.x1 as number,
        count: b.length,
        midpoint: ((b.x0 as number) + (b.x1 as number)) / 2
      };
    });

    // Configurar la escala X: de fareMin a fareMax → [margin.left, width - margin.right]
    xScale = scaleLinear()
      .domain([fareMin, fareMax])
      .range([margin.left, width - margin.right]);

    // Configurar la escala Y: de 0 a la cuenta máxima de pasajeros en un bin → [height - margin.bottom, margin.top]
    const maxCount = max([...survivorsBins, ...nonSurvivorsBins], d => d.count) || 0;
    yScale = scaleLinear()
      .domain([0, maxCount])
      .range([height - margin.bottom, margin.top]);
  });

  // Función para generar las líneas
  const lineGenerator = line<BinData>()
    .x(d => xScale(d.midpoint))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX);  // Esto suaviza la curva de la línea
</script> -->
<script lang="ts">
  import { scaleLinear, extent, max, line, bin } from 'd3';
  import type { Bin } from 'd3';
  import { dataBySurvivalFare } from '../stores_titanic.js';
  import * as d3 from 'd3';

  interface BinData {
    x0: number;
    x1: number;
    count: number;
    midpoint: number;
  }

  let survivorsBins: BinData[] = [];
  let nonSurvivorsBins: BinData[] = [];
  let xScale: d3.ScaleLinear<number, number>;
  let yScale: d3.ScaleLinear<number, number>;

  let width = 400;  
  let height = 200; 
  let margin = { top: 20, right: 20, bottom: 30, left: 40 };

  dataBySurvivalFare.subscribe(result => {
    console.log('Fare results:', result);
    // Si no hay datos, salimos de la función
    if (!result) return;
    // Desestructuramos el resultado en los datos de supervivientes y no supervivientes
    const { survivors, nonSurvivors } = result;
    // Si no hay datos de supervivientes o no supervivientes, salimos de la función
    if (!survivors || !nonSurvivors) return;

    // Extraemos las tarifas de los supervivientes y los no supervivientes
    const survivorFares = survivors.map(d => d.fare);
    const nonSurvivorFares = nonSurvivors.map(d => d.fare);

    // Calculamos el rango de las tarifas (mínimo y máximo) combinando ambas listas de tarifas
    const [fareMin, fareMax] = extent([...survivorFares, ...nonSurvivorFares]) as [number, number];

    // Esto agrupará las tarifas en un número determinado de intervalos
    const binGenerator = bin<{ fare: number }, number>()
    .domain([fareMin, fareMax])  // Establecemos el dominio de los "bins" usando las tarifas mínima y máxima
    .thresholds(10)  // Usamos 10 intervalos
    .value(d => d.fare);  // Indicamos que la clave para agrupar es la propiedad 'fare' de cada elemento

    // Aplicamos sobre los datos de supervivientes
    const survivorBins = binGenerator(survivors);
    // Procesamos cada "bin" para extraer la información relevante y almacenarla en el array survivorsBins
  survivorsBins = survivorBins.map((b: Bin<{ fare: number }, number>) => {
    return {
      x0: b.x0 as number,  // Límite inferior del intervalo
      x1: b.x1 as number,  // Límite superior del intervalo
      count: b.length,     // Cantidad de elementos dentro del intervalo
      midpoint: ((b.x0 as number) + (b.x1 as number)) / 2  // El punto medio del intervalo (para colocar las marcas en el gráfico)
    };
  });

    const nonSurvivorBins = binGenerator(nonSurvivors);
    nonSurvivorsBins = nonSurvivorBins.map((b: Bin<{ fare: number }, number>) => {
      return {
        x0: b.x0 as number,
        x1: b.x1 as number,
        count: b.length,
        midpoint: ((b.x0 as number) + (b.x1 as number)) / 2
      };
    });

    // Definimos la escala para el eje X (tarifas), que mapea las tarifas a la anchura del gráfico
    xScale = scaleLinear()
      .domain([fareMin, fareMax])
      .range([margin.left, width - margin.right]);

      // Calculamos el valor máximo de las cuentas en los "bins" de supervivientes y no supervivientes
    const maxCount = max([...survivorsBins, ...nonSurvivorsBins], d => d.count) || 0;
    
    // Definimos la escala para el eje Y (conteo de personas), que mapea el número de personas a la altura del gráfico
    yScale = scaleLinear()
      .domain([0, maxCount])
      .range([height - margin.bottom, margin.top]);
  });

  const lineGenerator = line<BinData>()
    .x(d => xScale(d.midpoint))
    .y(d => yScale(d.count))
    .curve(d3.curveMonotoneX);
</script>

<div class="chart-container">
  <h5>EjeY:ersonas EjeX:tarifas</h5>
  <!-- Creamos un contenedor SVG para el gráfico -->
  <svg {width} {height} style="background: #222;">
    {#if xScale && yScale}
      <!-- Dibujar la línea para los supervivientes -->
      <path d={lineGenerator(survivorsBins)} fill="none" stroke="limegreen" stroke-width="2" />

      <!-- Dibujar la línea para los no supervivientes -->
      <path d={lineGenerator(nonSurvivorsBins)} fill="none" stroke="red" stroke-width="2" />

      <!-- Dibujar los puntos en la línea de supervivientes -->
      {#each survivorsBins as survivorBin}
      <!-- Posición X del punto (punto medio del bin) -->
       <!-- Posición Y del punto (conteo de personas) -->
        <!-- Radio del círculo -->
         <!-- Radio del círculo -->
        <circle 
          cx={xScale(survivorBin.midpoint)} 
          cy={yScale(survivorBin.count)} 
          r="4" 
          fill="limegreen" 
        />
        <!-- Posición X del texto -->
         <!-- Posición Y del texto (un poco arriba del punto) -->
          <!-- Color del texto -->
           <!-- Centrar el texto horizontalmente -->
            <!-- Tamaño de la fuente -->
        <text 
          x={xScale(survivorBin.midpoint)} 
          y={yScale(survivorBin.count) - 5} 
          fill="limegreen" 
          text-anchor="middle" 
          font-size="10"
        >
        <!-- Mostrar el conteo de personas en el bin -->
          {survivorBin.count}
        </text>
      {/each}

      <!-- Dibujar los puntos en la línea de no supervivientes -->
      {#each nonSurvivorsBins as nonSurvivorBin}
        <circle 
          cx={xScale(nonSurvivorBin.midpoint)} 
          cy={yScale(nonSurvivorBin.count)} 
          r="4" 
          fill="red" 
        />
        <text 
          x={xScale(nonSurvivorBin.midpoint)} 
          y={yScale(nonSurvivorBin.count) + 15} 
          fill="red" 
          text-anchor="middle" 
          font-size="10"
        >
          {nonSurvivorBin.count}
        </text>
      {/each}

      <!-- Eje X -->
      <line 
        x1={margin.left} 
        y1={height - margin.bottom} 
        x2={width - margin.right} 
        y2={height - margin.bottom} 
        stroke="white"
      />
      {#each xScale.ticks(10) as tick}
        <line 
          x1={xScale(tick)} 
          y1={height - margin.bottom} 
          x2={xScale(tick)} 
          y2={height - margin.bottom + 5} 
          stroke="white"
        />
        <text 
          x={xScale(tick)}
          y={height - margin.bottom + 20}
          fill="white"
          text-anchor="middle"
          font-size="10"
        >
        {Math.round(tick)} 
        </text>
      {/each}

      <!-- Eje Y -->
      <line 
        x1={margin.left} 
        y1={margin.top} 
        x2={margin.left} 
        y2={height - margin.bottom} 
        stroke="white"
      />
      {#each yScale.ticks(5) as tick}
        <line 
          x1={margin.left - 5} 
          y1={yScale(tick)} 
          x2={margin.left} 
          y2={yScale(tick)} 
          stroke="white"
        />
        <text 
          x={margin.left - 10} 
          y={yScale(tick)}
          fill="white"
          text-anchor="end"
          alignment-baseline="middle"
          font-size="10"
        >
          {tick}
        </text>
      {/each}
    {/if}
  </svg>
</div>


<style>
  /* .chart-container {
    max-width: 400px;
    margin: auto;
    text-align: center;
    font-family: Arial, sans-serif;
    background: #fff;
    padding: 1rem;
  }
  
  svg {
    display: block;
    margin: auto;
    width: 100%;
    height: 100%;
  } */
  .chart-container {
  width: 100%; /* Asegura que el contenedor del gráfico ocupe todo el espacio disponible */
  height: 100%; /* Asegura que el contenedor del gráfico ocupe toda la altura de su contenedor */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center; /* Centra el gráfico dentro del contenedor */
  align-items: center;
  background: #fff;
}

svg {
  width: 100%; /* El SVG ocupa el 100% del espacio disponible */
  height: 100%; /* El SVG ocupa el 100% del espacio disponible */
  background: #222;
}

</style>
