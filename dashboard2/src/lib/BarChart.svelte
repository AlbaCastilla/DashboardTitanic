<script>
  import * as d3 from 'd3';
  export let data = [];
  
  // Filtrar solo los pasajeros sobrevivientes
  $: survivors = data.filter(d => d.Survived === 1);
  
  // Agrupar por clase (Pclass)
  $: grouped = d3.rollup(
    survivors,
    v => v.length,
    d => d.Pclass
  );
  
  // Convertir la agrupación en un array y ordenarlo por clase
  $: entries = Array.from(grouped, ([key, value]) => ({ key, value }))
    .sort((a, b) => +a.key - +b.key);
  
  // Dimensiones del SVG (300 x 150)
  let width = 300;
  let height = 150;
  // Márgenes para ubicar correctamente las barras y la leyenda
  let margin = { top: 20, right: 80, bottom: 40, left: 5 };
  
  // Escala X para las barras (por clase)
  $: xScale = d3.scaleBand()
    .domain(entries.map(d => d.key))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  
  // Escala Y para los valores
  $: yScale = d3.scaleLinear()
    .domain([0, d3.max(entries, d => d.value) || 0])
    .nice()
    .range([height - margin.bottom, margin.top]);
  
  // Mapeo de colores para cada clase
  const colorMapping = {
    "1": "purple",
    "2": "green",
    "3": "orange"
  };
</script>

<svg {width} {height}>
  {#each entries as d}
    <!-- Dibujar la barra -->
    <rect
      x={xScale(d.key)}
      y={yScale(d.value)}
      width={xScale.bandwidth()}
      height={height - margin.bottom - yScale(d.value)}
      fill={colorMapping[d.key]}
    />
    <!-- Número sobre la barra -->
    <text
      x={xScale(d.key) + xScale.bandwidth() / 2}
      y={yScale(d.value) - 5}
      text-anchor="middle"
      font-size="12"
      fill="#000"
    >
      {d.value}
    </text>
  {/each}
  {#each entries as d}
    <!-- Etiquetas del eje X -->
    <text
      x={xScale(d.key) + xScale.bandwidth() / 2}
      y={height - margin.bottom + 15}
      text-anchor="middle"
      font-size="12"
      fill="#000"
    >
      {d.key} class
    </text>
  {/each}
  <!-- Leyenda, posicionada en la esquina superior derecha -->
  <g transform={`translate(${width - margin.right + 5}, ${margin.top})`}>
    <g transform="translate(0,0)">
      <rect width="12" height="12" fill="purple"></rect>
      <text x="16" y="10" font-size="12" fill="#000">1st Class</text>
    </g>
    <g transform="translate(0,18)">
      <rect width="12" height="12" fill="green"></rect>
      <text x="16" y="10" font-size="12" fill="#000">2nd Class</text>
    </g>
    <g transform="translate(0,36)">
      <rect width="12" height="12" fill="orange"></rect>
      <text x="16" y="10" font-size="12" fill="#000">3rd Class</text>
    </g>
  </g>
</svg>

<style>
  svg {
    display: block;
    margin: auto;
  }
</style>
