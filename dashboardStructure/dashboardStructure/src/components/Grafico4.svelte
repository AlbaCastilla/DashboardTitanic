<div class="container">
    <div class="box">Boat</div>
  </div>
  <script>
    import {dataByGender} from '../stores_titanic.js';
    dataByGender.subscribe(result => {
  console.log('Gráfico del barco:', result);
});
</script>
  <style>
   
  </style>
  