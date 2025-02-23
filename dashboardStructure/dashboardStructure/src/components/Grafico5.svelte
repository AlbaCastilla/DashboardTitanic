<div class="container">
    <div class="box">Survived by class</div>
  </div>
  <script>
    import {dataByClass} from '../stores_titanic.js';
    dataByClass.subscribe(result => {
  console.log('Data by class:', result);
});
</script>
  <style>

  </style>
  