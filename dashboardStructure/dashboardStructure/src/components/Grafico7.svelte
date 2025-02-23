<div class="container">
    <div class="box">Average age number</div>
  </div>
  
  <script>
    import {ageStats} from '../stores_titanic.js';
    ageStats.subscribe(result => {
  console.log('Edades:', result);
});
</script>
  <style>
    
  </style>
  