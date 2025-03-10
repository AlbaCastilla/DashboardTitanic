<script>
  import * as d3 from 'd3';
  import { onMount } from 'svelte';

  // Se espera que 'data' tenga los campos: Fare y Pclass.
  export let data = [];

  // Dimensiones del gráfico para que encaje en la caja (450 x 150)
  let width = 450;
  let height = 150;
  let margin = { top: 20, right: 20, bottom: 30, left: 40 };

  // Para cada clase: filtrar, ordenar de menor a mayor Fare y asignar un "rank"
  $: data1 = data
    .filter(d => d.Pclass == 1)
    .sort((a, b) => a.Fare - b.Fare)
    .map((d, i) => ({ ...d, rank: i + 1 }));
  $: data2 = data
    .filter(d => d.Pclass == 2)
    .sort((a, b) => a.Fare - b.Fare)
    .map((d, i) => ({ ...d, rank: i + 1 }));
  $: data3 = data
    .filter(d => d.Pclass == 3)
    .sort((a, b) => a.Fare - b.Fare)
    .map((d, i) => ({ ...d, rank: i + 1 }));

  // Determinar el máximo de pasajeros (rank) entre las clases
  $: maxRank = Math.max(data1.length, data2.length, data3.length);

  // Escala X basada en el "rank" (posición en el orden de Fare)
  $: xScale = d3.scaleLinear()
    .domain([1, maxRank])
    .range([margin.left, width - margin.right]);

  // Escala Y basada en la tarifa (Fare) usando todo el dataset
  $: yDomain = d3.extent(data, d => d.Fare);
  $: yScale = d3.scaleLinear()
    .domain(yDomain)
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Generador de línea: la x se basa en rank y la y en Fare
  const lineGenerator = d3.line()
    .x(d => xScale(d.rank))
    .y(d => yScale(d.Fare));

  // Referencias para los ejes
  let xAxisRef;
  let yAxisRef;

  onMount(() => {
    const xAxis = d3.axisBottom(xScale).ticks(4);
    d3.select(xAxisRef).call(xAxis);

    const yAxis = d3.axisLeft(yScale).ticks(4);
    d3.select(yAxisRef).call(yAxis);
  });
</script>

<svg {width} {height}>
  <!-- Título centrado -->
  <text
    x={width / 2}
    y={margin.top - 5}
    text-anchor="middle"
    font-size="14"
    font-weight="bold"
  >
    Passager class according to fare paid
  </text>

  <!-- Eje X -->
  <g transform={`translate(0, ${height - margin.bottom})`} bind:this={xAxisRef} />
  <!-- Eje Y -->
  <g transform={`translate(${margin.left}, 0)`} bind:this={yAxisRef} />

  <!-- Líneas de cada clase -->
  <path d={lineGenerator(data1)} fill="none" stroke="purple" stroke-width="2" />
  <path d={lineGenerator(data2)} fill="none" stroke="green" stroke-width="2" />
  <path d={lineGenerator(data3)} fill="none" stroke="orange" stroke-width="2" />

  <!-- Leyenda en la esquina superior derecha -->
  <g transform={`translate(${width - margin.right - 100}, ${margin.top})`}>
    <g transform="translate(0,0)">
      <rect width="12" height="12" fill="purple"></rect>
      <text x="16" y="10" font-size="12" fill="#000">1st Class</text>
    </g>
    <g transform="translate(0,15)">
      <rect width="12" height="12" fill="green"></rect>
      <text x="16" y="10" font-size="12" fill="#000">2nd Class</text>
    </g>
    <g transform="translate(0,30)">
      <rect width="12" height="12" fill="orange"></rect>
      <text x="16" y="10" font-size="12" fill="#000">3rd Class</text>
    </g>
  </g>
</svg>

<style>
  svg {
    font-family: sans-serif;
  }
</style>
