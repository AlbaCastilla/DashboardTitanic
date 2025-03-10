<script>
  import * as d3 from 'd3';
  export let data = [];

  // Estados de los controles (checkboxes)
  let showFemales = true;       // Si true: filtrar para género femenino, si false: masculino.
  let showSurvivors = true;     // Si true: filtrar para sobrevivientes; si false: para fallecidos.
  let colorByClass = true;      // Si true: usar colores por clase; si false: usar colores por género.

  // Filtrado reactivo según los controles.
  $: filtered = data
    .filter(d => d.Age != null && d.Age !== "")
    .filter(d => showSurvivors ? d.Survived === 1 : d.Survived !== 1)
    .filter(d => showFemales ? d.Sex === "female" : d.Sex === "male")
    .map(d => ({
      age: +d.Age,
      pclass: +d.Pclass
    }));

  // Calcular el máximo de edad (para el binning)
  $: maxAge = d3.max(filtered, d => d.age) || 100;

  // Crear intervalos (bins) de 5 años
  $: thresholds = d3.range(0, maxAge + 5, 5);
  $: bins = d3.bin()
    .value(d => d.age)
    .thresholds(thresholds)(filtered);

  // Agrupar (por bin) y, para cada bin, contar el total y también por clase.
  // Se calcula el punto medio del bin, el conteo total y se determina la clase predominante.
  const classes = [1, 2, 3];
  $: aggregated = bins.map(bin => {
    let total = bin.length;
    let counts = {};
    let predominant = null;
    let maxCountClass = 0;
    classes.forEach(c => {
      counts[c] = bin.filter(d => d.pclass === c).length;
      if (counts[c] > maxCountClass) {
        maxCountClass = counts[c];
        predominant = c;
      }
    });
    return { ageBin: (bin.x0 + bin.x1) / 2, total, counts, predominant };
  }).filter(d => d.total > 0);

  // Dimensiones base para el gráfico (viewBox)
  const svgWidth = 600;
  const svgHeight = 300;
  let marginChart = { top: 50, right: 40, bottom: 50, left: 60 };

  // Escala X: mapea el conteo total de pasajeros al ancho
  $: maxTotal = d3.max(aggregated, d => d.total) || 1;
  $: xScale = d3.scaleLinear()
      .domain([0, maxTotal])
      .range([marginChart.left, svgWidth - marginChart.right]);

  // Escala Y: mapea la edad (valor medio del bin) a la altura
  $: yScale = d3.scaleLinear()
      .domain([0, maxAge])
      .range([svgHeight - marginChart.bottom, marginChart.top]);

  // Color mapping para las clases
  const classColors = {
    1: "purple",
    2: "green",
    3: "orange"
  };
  // Colores por género (cuando no se colorea por clase)
  const genderColors = {
    female: "pink",
    male: "blue"
  };
</script>

<div class="chart-container">
  <!-- Gráfico (SVG) -->
  <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid meet">
    <!-- Título centrado -->
    <text x="300" y={marginChart.top / 2} text-anchor="middle" font-size="14" font-weight="bold" fill="#000">
      Number of passengers by Age (binned every 5 years)
    </text>
    {#each aggregated as d}
      <!-- Punto de dispersión: posición horizontal según el total, vertical según la edad media -->
      <circle 
        cx={xScale(d.total)}
        cy={yScale(d.ageBin)}
        r="5"
        fill={ colorByClass ? classColors[d.predominant] : (showFemales ? genderColors.female : genderColors.male) }
      />
      <!-- Mostrar el conteo junto al punto -->
      <text 
        x={xScale(d.total) + 7}
        y={yScale(d.ageBin) + 4}
        font-size="10"
        fill="#000"
      >
        {d.total}
      </text>
    {/each}
    <!-- Eje X -->
    <line 
      x1={marginChart.left} 
      y1={svgHeight - marginChart.bottom} 
      x2={svgWidth - marginChart.right} 
      y2={svgHeight - marginChart.bottom} 
      stroke="black" 
    />
    <!-- Eje Y -->
    <line 
      x1={marginChart.left} 
      y1={svgHeight - marginChart.bottom} 
      x2={marginChart.left} 
      y2={marginChart.top} 
      stroke="black" 
    />
    <!-- Etiqueta para el eje X -->
    <text 
      x={(marginChart.left + (svgWidth - marginChart.right)) / 2} 
      y={svgHeight - marginChart.bottom + 30} 
      text-anchor="middle" 
      font-size="12" 
      fill="#000"
    >
      Number of Passengers
    </text>
    <!-- Etiqueta para el eje Y -->
    <text 
      transform={`translate(${marginChart.left - 40}, ${(svgHeight - marginChart.bottom + marginChart.top) / 2}) rotate(-90)`}
      text-anchor="middle" 
      font-size="12" 
      fill="#000"
    >
      Age
    </text>
  </svg>

  <!-- Controles en la parte derecha -->
  <div class="controls">
    <div class="checkboxes">
      <div class="checkbox-item">
        <input type="checkbox" bind:checked={showFemales}>
        <span>Gender</span>
      </div>
      <div class="checkbox-item">
        <input type="checkbox" bind:checked={showSurvivors}>
        <span>Survivors</span>
      </div>
      <div class="checkbox-item">
        <input type="checkbox" bind:checked={colorByClass}>
        <span>By Class</span>
      </div>
    </div>
    <div class="legend">
      <!-- Primera fila: Leyenda por clase -->
      <div class="legend-group">
        <div class="legend-item">
          <div class="legend-color" style="background-color: purple;"></div>
          <span>1st Class</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: green;"></div>
          <span>2nd Class</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: orange;"></div>
          <span>3rd Class</span>
        </div>
      </div>
      <!-- Segunda fila: Leyenda por género (siempre visible) -->
      <div class="legend-group">
        <div class="legend-item">
          <div class="legend-color" style="background-color: pink;"></div>
          <span>Female</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background-color: blue;"></div>
          <span>Male</span>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .chart-container {
    display: flex;
    width: 100%;
    height: 100%;
  }
  svg {
    flex: 1;
    font-family: sans-serif;
    display: block;
  }
  .controls {
    width: 150px;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: hidden;
  }
  .checkboxes {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .checkbox-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 9px;
    white-space: nowrap;
  }
  .checkbox-item input {
    margin-bottom: 3px;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .legend-group {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .legend-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    margin-bottom: 3px;
  }
</style>
