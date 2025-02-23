<div class="grafico">
    <p>Parte 2 del gráfico</p>
    <!-- Aquí puedes agregar contenido o gráficos específicos -->
  </div>
  <script>
    import {totalPassengers} from '../stores_titanic.js';
    totalPassengers.subscribe(result => {
  console.log('Numero pasageros totales:', result);
});
    
  </script>
  <style>
    .grafico {
      background-color: lightblue;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border-radius: 5px;
    }
  </style>