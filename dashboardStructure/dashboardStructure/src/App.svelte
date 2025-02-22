<script>
  import svelteLogo from './assets/svelte.svg';
  import viteLogo from '/vite.svg';
  import Counter from './lib/Counter.svelte';
  import Navbar from './lib/Navbar.svelte';
  import Grafico1 from './lib/Grafico1.svelte';
  import Grafico2y3 from './lib/Grafico2y3.svelte';
  import Grafico4 from './lib/Grafico4.svelte';
  import Grafico5 from './lib/Grafico5.svelte';
  import Grafico6 from './lib/Grafico6.svelte';
  import Grafico7 from './lib/Grafico7.svelte';
  import Grafico8 from './lib/Grafico8.svelte';
  import Info from './lib/Info.svelte';
  import Titulo from './lib/Titulo.svelte';
</script>

<main>
  <!--<div class="navbar">
    <Navbar />
  </div>-->
  <div class="grid-container">
    <div class="box box1">
      <Grafico1 />
    </div>
    <div class="box box2">
      <Grafico2y3 />
    </div>
    <div class="box box3">
      <Grafico4 />
    </div>
    <div class="box box4">
      <Titulo />
    </div>
    <div class="box box5">
      <Info />
    </div>
    <div class="box box6">
      <Grafico5 />
    </div>
    <div class="box box7">
      <Grafico6 />
    </div>
    <div class="box box8">
      <Grafico7 />
    </div>
    <div class="box box9">
      <Grafico8/>
    </div>
  </div>
</main>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(10, 1fr); /* 10 columnas */
    grid-template-rows: repeat(3, 1fr); /* 3 filas */
    width: 100vw;  
    height: 100vh; 
  }

  /* Estilo común para las cajas */
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: gray;
    border-radius: 10px;
    width: 100%; 
    height: 100%;
  }

  .box1 {
    background-color: #FF6347;
    grid-column: span 3; /* Hace que box1 ocupe 3 columnas de largo */
  }
  .box2 { background-color: #4682B4; 
    grid-column: span 2;}
  .box3 { background-color: #cd3232; 
    grid-column: span 5;}
  .box4 { background-color: #090909; 
    grid-column: span 2;}
  .box5 { background-color: #3c3c3d; 
    grid-column: span 5;}
  .box6 { background-color: #FF69B4; 
    grid-column: span 3;}
  .box7 { background-color: #3CB371;
    grid-column: span 4; }
  .box8 { background-color: rgb(55, 0, 255);
    grid-column: span 2; }
  .box9 { background-color: rgb(147, 226, 43); 
    grid-column: span 4;}
  /*.box10 { background-color: #FF4500; }*/

  @media (max-width: 768px) {
    .grid-container {
      display: grid;
      grid-template-columns: 1fr; /* Una columna en pantallas pequeñas */
      grid-template-rows: auto;  /* Las filas se ajustan automáticamente */
      height: auto;  
    }

    /* Orden de los elementos en pantallas pequeñas */
    .box4 { order: 1; }
    .box5 { order: 2; }
    .box1, .box2, .box3, .box6, .box7, .box8, .box9, .box10 {
      order: 3; /* Coloca el resto de los elementos después */
    }

    .box {
      width: 100%; 
      height: auto; 
      min-height: 150px; 
    }
  }
</style>
