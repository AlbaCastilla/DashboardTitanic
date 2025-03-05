<script>
  import { ageStats } from '../stores_titanic.js';
  let averageAge = "Cargando...";
  let minAge = "Cargando...";
  let maxAge = "Cargando...";

  // Suscribirse a ageStats y actualizar los valores
  ageStats.subscribe(result => {
    if (result) {
      averageAge = result.average.toFixed(2);
      // @ts-ignore
      minAge = result.min;
      // @ts-ignore
      maxAge = result.max;
    }
  });
</script>

<main>
  <div class="container">
    <div class="box">
      <p>Edad promedio: {averageAge}</p>
      <p>Edad mínima: {minAge}</p>
      <p>Edad máxima: {maxAge}</p>
    </div>
  </div>
</main>

<style>
  .container {
    padding: 20px;
    background-color: lightgrey;
  }

  .box {
    background-color: lightblue;
    padding: 15px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .box p {
    font-size: 16px;
    font-weight: bold;
  }
</style>
