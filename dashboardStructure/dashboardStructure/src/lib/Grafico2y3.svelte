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
      grid-template-rows: 1fr 1fr; 
      gap: 10px; 
    }
    .grafico2{
        padding: 7vh;
    }
    .grafico3{
        padding: 7vh;
    }
  </style>
  