<script>
  import * as d3 from 'd3';
  export let data = [];

  // --- Estados para alternar la vista ---
  let isBarChart = true;   // true => BarChart; false => PieChart
  let selectedPort = "S";  // Puerto seleccionado para el modo circular

  function toggleChart() {
    isBarChart = !isBarChart;
  }

  // Puertos y clases
  const allPorts = ["S", "C", "Q"];
  const classes = [1, 2, 3];

  // Colores para las clases
  const classColors = { 1: "purple", 2: "green", 3: "orange" };

  // --- DATOS COMUNES: Filtrar sobrevivientes y agrupar ---
  $: survivors = data.filter(d => d.Survived === 1);
  $: grouped = d3.rollup(
    survivors,
    v => v.length,
    d => d.Embarked, // puerto
    d => d.Pclass    // clase
  );

  // --- MODO BARCHART ---
  let barWidth = 360, barHeight = 150;
  let marginBar = { top: 40, right: 80, bottom: 40, left: 40 };
  let groupScale, innerScale, bars = [], maxCount = 0, yScale;

  $: if (isBarChart && data && data.length) {
    let portsBar = Array.from(grouped.keys())
      .filter(port => allPorts.includes(port))
      .sort();
    groupScale = d3.scaleBand()
      .domain(portsBar)
      .range([marginBar.left, barWidth - marginBar.right])
      .padding(0.4);
    innerScale = d3.scaleBand()
      .domain(classes)
      .range([0, groupScale.bandwidth()])
      .padding(0.3);
    bars = [];
    for (let port of portsBar) {
      let classMap = grouped.get(port) || new Map();
      for (let c of classes) {
        let count = classMap.get(c) || 0;
        bars.push({ port, pclass: c, value: count });
      }
    }
    maxCount = d3.max(bars, d => d.value) || 0;
    let availableHeight = barHeight - marginBar.top - marginBar.bottom;
    yScale = d3.scaleLinear()
      .domain([0, maxCount])
      .range([0, availableHeight]);
  } else {
    bars = [];
    maxCount = 0;
  }

  function getCount(port, pclass) {
    return grouped.get(port)?.get(pclass) || 0;
  }

  // --- MODO PIECHART ---
  // Dimensiones para el pastel (más pequeño)
  let pieWidth = 150, pieHeight = 150;
  let marginPie = { top: 20, right: 20, bottom: 20, left: 20 };

  $: pieData = classes.map(c => {
    let val = getCount(selectedPort, c);
    return { pclass: c, value: val };
  });
  $: totalPie = d3.sum(pieData, d => d.value);

  let arcs = [];
  let arcGen;
  $: if (!isBarChart && totalPie > 0) {
    let pieLayout = d3.pie().value(d => d.value)(pieData);
    let radius = Math.min(pieWidth, pieHeight) / 2 - 15;
    arcGen = d3.arc()
      .outerRadius(radius)
      .innerRadius(0);
    arcs = pieLayout.map(d => ({
      path: arcGen(d),
      color: classColors[d.data.pclass],
      data: d.data
    }));
  }
</script>

{#if isBarChart}
  <!-- MODO BARCHART: se muestra el gráfico de barras con su leyenda interna -->
  <div class="chart-and-legend">
    <svg width={barWidth} height={barHeight} class="chart-svg">
      <!-- Título -->
      <text
        x={barWidth / 2.25}
        y={marginBar.top / 2}
        text-anchor="middle"
        font-size="9"
        font-weight="bold"
        fill="#000"
      >
        Number of passengers survived by class and port
      </text>
      <!-- Leyenda (dentro del SVG, en la esquina superior derecha) -->
      <g transform={`translate(${barWidth - marginBar.right + 10}, ${marginBar.top / 2 - 10})`}>
        <g transform="translate(0,0)">
          <rect width="12" height="12" fill="purple"></rect>
          <text x="16" y="10" font-size="10" fill="#000">1st Class</text>
        </g>
        <g transform="translate(0,15)">
          <rect width="12" height="12" fill="green"></rect>
          <text x="16" y="10" font-size="10" fill="#000">2nd Class</text>
        </g>
        <g transform="translate(0,30)">
          <rect width="12" height="12" fill="orange"></rect>
          <text x="16" y="10" font-size="10" fill="#000">3rd Class</text>
        </g>
      </g>
      <!-- Dibujar las barras -->
      {#each bars as b}
        <rect
          x={groupScale(b.port) + innerScale(b.pclass)}
          y={marginBar.top + ((barHeight - marginBar.top - marginBar.bottom) - yScale(b.value) || 0)}
          width={innerScale.bandwidth()}
          height={yScale(b.value) || 0}
          fill={ b.pclass === 1 ? "purple" : b.pclass === 2 ? "green" : "orange" }
        />
        {#if b.value > 0}
          <text
            x={groupScale(b.port) + innerScale(b.pclass) + innerScale.bandwidth()/2}
            y={marginBar.top + ((barHeight - marginBar.top - marginBar.bottom) - yScale(b.value) || 0) - 3}
            text-anchor="middle"
            font-size="10"
            fill="#000"
          >
            {b.value}
          </text>
        {/if}
      {/each}
      <!-- Etiquetas de puerto -->
      {#each Array.from(grouped.keys()).filter(p => allPorts.includes(p)) as port}
        <text
          x={groupScale(port) + groupScale.bandwidth() / 2}
          y={barHeight - marginBar.bottom + 15}
          text-anchor="middle"
          font-size="12"
          fill="#000"
        >
          {port}
        </text>
      {/each}
    </svg>
  </div>
{:else}
  <!-- MODO PIECHART: contenedor en 3 columnas: radio buttons a la izquierda, gráfico en el centro y leyenda a la derecha -->
  <div class="chart-container-circular">
    <div class="radio-controls">
      {#each allPorts as p}
        <label>
          <input type="radio" name="port" value={p} bind:group={selectedPort} />
          {p}
        </label>
      {/each}
    </div>
    <svg width={pieWidth} height={pieHeight} class="chart-svg">
      {#if totalPie > 0}
        <text
          x={pieWidth / 2}
          y="15"
          text-anchor="middle"
          font-size="11"
          font-weight="bold"
        >
          Survived in port {selectedPort}
        </text>
        <g transform={`translate(${pieWidth/2}, ${pieHeight/2 + 5})`}>
          {#each arcs as arc}
            <path d={arc.path} fill={arc.color}></path>
          {/each}
        </g>
      {:else}
        <text
          x={pieWidth/2}
          y={pieHeight/2}
          text-anchor="middle"
          fill="#999"
        >
          No data for port {selectedPort}
        </text>
      {/if}
    </svg>
    <div class="legend-circular">
      <div class="legend-item">
        <span class="legend-value">{pieData.find(d => d.pclass === 1)?.value || 0}</span>
        <div class="legend-color" style="background-color: purple;"></div>
        <span>1st Class</span>
      </div>
      <div class="legend-item">
        <span class="legend-value">{pieData.find(d => d.pclass === 2)?.value || 0}</span>
        <div class="legend-color" style="background-color: green;"></div>
        <span>2nd Class</span>
      </div>
      <div class="legend-item">
        <span class="legend-value">{pieData.find(d => d.pclass === 3)?.value || 0}</span>
        <div class="legend-color" style="background-color: orange;"></div>
        <span>3rd Class</span>
      </div>
    </div>
  </div>
{/if}

<!-- Controles abajo: botón -->
<div class="bottom-controls">
  <button on:click={toggleChart} class="switch-btn">
    {isBarChart ? "SWITCH TO CIRCULAR GRAPH" : "SWITCH TO BAR CHART"}
  </button>
</div>

<style>
  .chart-and-legend {
    display: flex;
    align-items: center;
  }
  .chart-container-circular {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
  }
  .radio-controls {
    width: 50px;
    text-align: center;
    font-size: 12px;
  }
  .radio-controls label {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .chart-svg {
    flex-shrink: 0;
    display: block;
  }
  .legend-circular {
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 90px;
    justify-content: center;
  }
  .legend-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
  }
  .legend-value {
    margin-bottom: 3px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    margin-bottom: 3px;
  }
  .bottom-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
    gap: 10px;
  }
  .switch-btn {
    background-color: #666;
    color: #fff;
    border: none;
    padding: 5px 10px;
    font-size: 12px;
    cursor: pointer;
  }
</style>
