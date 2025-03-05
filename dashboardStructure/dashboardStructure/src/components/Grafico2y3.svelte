<script>
    import Grafico2 from './Grafico2.svelte';
    import Grafico3 from './Grafico3.svelte';
  </script>
  
  <main>
    <div class="grafico-container">
        <div class="grafico2"><Grafico2 /></div>
        <div class="grafico3"><Grafico3 /></div>
    </div>
  </main>
  
  <style>
    .grafico-container {
    display: grid;
    grid-template-columns: 1fr;  /* Una sola columna */
    grid-template-rows: auto auto; /* Filas automáticas sin espacio extra */
    margin: 0;  /* Eliminar márgenes adicionales */
    padding: 0; /* Eliminar padding del contenedor */
  }
  .grafico2, .grafico3 {
    margin: 0; /* Eliminar el margen de los gráficos */
    padding: 0; /* Eliminar padding dentro de los gráficos */
  }
  </style>
  