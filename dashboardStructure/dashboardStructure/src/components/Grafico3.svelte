<div class="grafico">
    <p>Parte 1 del gráfico</p>
  </div>
  
  <script>
    import {totalSurvivors} from '../stores_titanic.js';
    totalSurvivors.subscribe(result => {
  console.log('Numero pasajeros supervivoentes:', result);
});
</script>
  <style>
    .grafico {
      background-color: lightcoral;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border-radius: 5px;
    }
  </style>