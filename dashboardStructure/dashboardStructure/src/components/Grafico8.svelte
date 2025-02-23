<div class="container">
    <div class="box">Passager class according to fare paid</div>
  </div>
  <script>
    import {dataBySurvivalFare} from '../stores_titanic.js';
    dataBySurvivalFare.subscribe(result => {
  console.log('Supervivencia-precio:', result);
});
</script>
  <style>
    
  </style>