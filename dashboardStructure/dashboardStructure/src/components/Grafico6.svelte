<div class="container">
    <div class="box">Survived by select</div>
  </div>
  <script>
    import {dataByPortAge} from '../stores_titanic.js';
    dataByPortAge.subscribe(result => {
  console.log('Edad por puerto:', result);
});

import {dataBySexAge} from '../stores_titanic.js';
    dataBySexAge.subscribe(result => {
  console.log('Edad por sexo:', result);
});

import {dataByClassAge} from '../stores_titanic.js';
    dataByClassAge.subscribe(result => {
  console.log('Edad por clase:', result);
});
</script>
  <style>
    
  </style>
  