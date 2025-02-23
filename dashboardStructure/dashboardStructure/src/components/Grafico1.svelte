<div class="container">
    <div class="box">Number of passangers survived classified by class and port where they boarded</div>
  </div>
  
  <script>
    import { dataByPortAndClass } from '../stores_titanic.js';

// Nos suscribimos al store y mostramos el valor en la consola
dataByPortAndClass.subscribe(result => {
  console.log('Datos procesados puerto-clase:', result);
});
  </script>
  <style>
    
  </style>
  