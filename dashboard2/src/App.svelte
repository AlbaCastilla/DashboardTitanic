<script>
  import { titanicData } from './stores.js';
  import BarChart from './lib/BarChart.svelte'; // Gráfica original (derecha)
  import ScatterPlot from './lib/ScatterPlot.svelte';
  import LineChart from './lib/LineChart.svelte';
  import GroupedBarChart from './lib/GroupedBarChart.svelte';
  
  // Reactive statements para calcular las estadísticas:
  $: totalPassengers = $titanicData.length;
  $: survivorsCount = $titanicData.filter(d => d.Survived === 1).length;
  $: averageAge = (() => {
    const validAges = $titanicData.filter(d => d.Age != null && !isNaN(d.Age));
    return validAges.length ? validAges.reduce((sum, d) => sum + d.Age, 0) / validAges.length : 0;
  })();
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: sans-serif;
  }

  .dashboard-container {
    position: relative;
    width: 1100px;
    height: 600px;
    margin: 0 auto;
    background: url('/background.png') center center no-repeat;
    background-size: cover;
  }

  /* Se añade box-sizing para que el contenido se ajuste */
  .box {
    position: absolute;
    background-color: rgba(226, 223, 223, 0.871);
    color: #000;
    text-align: center;
    border-radius: 8px;
    box-sizing: border-box;
  }

  /* Clase para centrar contenido de estadísticas */
  .box-stats {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    margin: 0;
  }

  .box-barras-1 {
  top: 60px;
  left: 30px;
  width: 360px;
  height: 150px;
}


.box-dashboard {
  top: 255px;
  left: 30px;
  width: 200px;
  height: 110px;
  padding: 0px;
  /* Elimina o establece un fondo transparente: */
  background-color: transparent;
  color: white;
  font-size: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
}


  .box-dispersion {
    top: 420px;
    left: 30px;
    width: 400px;
    height: 165px;
    padding: 10px;
  }

  .box-pasajeros {
    top: 60px;
    left: 450px;
    width: 100px;
    height: 70px;
    padding: 10px;
  }

  .box-survivors {
    top: 140px;
    left: 450px;
    width: 100px;
    height: 70px;
    padding: 10px;
  }

  /* Caja ovalada para la foto */
  .box-foto {
    top: 240px;
    left: 250px;
    width: 500px;
    height: 145px;
    border-radius: 50% / 50%;
    overflow: hidden;
  }

  .box-foto img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .box-grafico-1 {
    top: 60px;
    left: 605px;
    width: 450px;
    height: 140px;
    border-radius: 5% / 5%;
    overflow: hidden;
  }

  .box-barras-2 {
    top: 230px;
    left: 775px;
    width: 300px;
    height: 140px;
  }

  .box-lineas {
    top: 420px;
    left: 620px;
    width: 460px;
    height: 165px;
    padding: 10px;
  }

  .box-media-edad {
    top: 450px;
    left: 450px;
    width: 150px;
    height: 100px;
    padding: 10px;
  }
</style>

<div class="dashboard-container">
  <!-- Gráfica de barras agrupadas: sobrevivientes por puerto y clase (izquierda) -->
  <div class="box box-barras-1">
    <GroupedBarChart data={$titanicData} />
  </div>

  <!-- TITANIC DASHBOARD -->
  <div class="box box-dashboard">
    <p>TITANIC DASHBOARD</p>
  </div>

  <!-- Gráfico de dispersión -->
  <div class="box box-dispersion">
    <ScatterPlot data={$titanicData} />
  </div>

  <!-- Caja para “Total de pasajeros” -->
  <div class="box box-pasajeros">
    <div class="box-stats">
      <p>Total nº passengers {totalPassengers}</p>
    </div>
  </div>

  <!-- Caja para “Nº survivors” -->
  <div class="box box-survivors">
    <div class="box-stats">
      <p>Nº survivors {survivorsCount}</p>
    </div>
  </div>

  <!-- Caja ovalada para la foto del Titanic -->
  <div class="box box-foto">
    <img src="/titanic.jpg" alt="Foto del Titanic" />
  </div>

  <div class="box box-grafico-1">
    <img src="/barcoRaro.png" alt="Barco Raro" style="width: 100%; height: 100%; object-fit: cover;" />
  </div>
  

  <!-- Gráfica de barras original (derecha) -->
  <div class="box box-barras-2">
    <BarChart data={$titanicData} />
  </div>

  <!-- Caja para gráfico de líneas (comentado) -->
  <div class="box box-lineas">
    <LineChart data={$titanicData} />
  </div>

  <div class="box box-dispersion">
    <ScatterPlot data={$titanicData} />
  </div>
  <!-- Caja para Media de edad -->
  <div class="box box-media-edad">
    <div class="box-stats">
      <p>Average age</p>
      <p>{averageAge.toFixed(1)}</p>
    </div>
  </div>
</div>
