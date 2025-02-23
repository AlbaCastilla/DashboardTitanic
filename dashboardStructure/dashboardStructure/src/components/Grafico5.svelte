<script>
  import { scaleLinear } from 'd3';
  import { dataByClass } from '../stores_titanic.js';

  let datos = [];

  // Suscribirse a dataByClass para obtener los datos
  dataByClass.subscribe(result => {
    datos = Object.entries(result).map(([clase, { total, survivors }]) => ({
      clase,
      total,
      survivors
    }));
  });

  // Escala en el eje Y: 0 → 0px y 500 → 100px
  // Ponemos el contenedor en 110px para que el “500” no se corte arriba.
  const scaleY = scaleLinear()
    .domain([0, 500])
    .range([0, 100]);

  // Ticks en el eje Y (sin el 0)
  const yTicks = [100, 200, 300, 400, 500];
</script>

<main>
  <h5>Supervivientes por Clase</h5>
  <div class="chart-container">
    <div class="chart-area">
      <!-- Eje Y -->
      <div class="y-axis">
        {#each yTicks as tick}
          <div class="y-tick" style="bottom: {scaleY(tick)}px;">
            <span>{tick}</span>
          </div>
        {/each}
        <div class="y-axis-line"></div>
      </div>

      <!-- Gráfico de barras -->
      <div class="chart">
        {#each datos as { clase, total, survivors }}
          <div class="bar-container">
            <!-- Barra total -->
            <div class="bar total" style="height: {scaleY(total)}px;" title="Total {total}">
              <!-- Número de totales encima de la barra -->
              <span class="label-total">{total}</span>

              <!-- Barra de supervivientes dentro de la barra total -->
              <div class="bar survivors" style="height: {scaleY(survivors)}px;" title="Supervivientes {survivors}">
                <span class="label">{survivors}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Línea del eje X -->
      <div class="x-axis-line"></div>
    </div>

    <!-- Etiquetas del eje X -->
    <div class="x-axis-labels">
      {#each datos as { clase }}
        <span class="x-label">Clase {clase}</span>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    font-family: Arial, sans-serif;
    background-color: #fff;
    padding: 1rem;
    box-sizing: border-box;
  }

  /* Título */
  h2 {
    margin-bottom: 1rem;
    font-size: 1.3rem;
  }

  .chart-container {
    width: 100%;
    margin: 0 auto;
  }

  /* Contenedor del gráfico, altura 110px para que se vea "500" arriba */
  .chart-area {
    position: relative;
    height: 110px;
    /*border: 1px solid #ccc;*/
    background-color: #fff;
    overflow: hidden;
  }

  /* Eje Y */
  .y-axis {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 30px;
    height: 100%;
    background: #fdfdfd;
  }

  /* Ticks del eje Y */
  .y-tick {
    position: absolute;
    left: 0;
    font-size: 0.55rem;
    line-height: 0.8rem;
    color: #333;
    transform: translateY(100%);
  }

  .y-axis-line {
    position: absolute;
    left: calc(100% - 2px);
    top: 0;
    width: 2px;
    height: 100%;
    background-color: #333;
  }

  /* Contenedor de barras */
  .chart {
    position: absolute;
    left: 30px;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-evenly;
    padding: 0 0.5rem;
    box-sizing: border-box;
  }

  .bar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  /* Barra total */
  .bar.total {
    width: 30px;
    background-color: #bde0fe;
    border-radius: 3px 3px 0 0;
    position: relative;
    transition: height 0.3s;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  /* Número de totales (arriba de la barra) */
  .label-total {
    position: absolute;
    top: 0; 
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 0.55rem;
    font-weight: bold;
    color: #333;
  }

  .bar.survivors {
    width: 100%;
    background-color: #3498db;
    border-radius: 3px 3px 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: relative;
  }

  .bar.survivors:hover {
    background-color: #2980b9;
  }

  /* Etiqueta de supervivientes */
  .label {
    color: white;
    font-size: 0.55rem;
    font-weight: bold;
    margin-bottom: 1px;
  }

  /* Línea del eje X */
  .x-axis-line {
    position: absolute;
    left: 30px;
    right: 0;
    bottom: 0;
    height: 2px;
    background-color: #333;
  }

  /* Etiquetas del eje X (Clase 1, Clase 2, etc.) */
  .x-axis-labels {
    display: flex;
    justify-content: space-evenly;
    margin-top: 4px;
    font-weight: bold;
    font-size: 0.5rem;
  }
</style>
