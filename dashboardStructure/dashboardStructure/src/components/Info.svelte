<!-- <div class="container">
    <div class="box">Info</div>
  </div>
  
  <style>
    
   
  </style>
   -->
  

   <script>
    //import { onMount } from "svelte";
  
    let flipped = false; // Variable para controlar el estado de giro
  </script>
  
  
  
  <style>
    .flip-container {
      width: 600px;
      height: 120px;
      margin: 2rem auto;
      perspective: 1000px;
      cursor: pointer;
      border-radius: 70% / 80%;
      overflow: hidden;
      border: solid 2px #1a1a1a;
    }
  
    .flip-inner {
      width: 100%;
      height: 100%;
      transition: transform 0.8s;
      transform-style: preserve-3d;
      position: relative;
    }
  
    .flipped .flip-inner {
      transform: rotateX(180deg);
    }
  
    .flip-front,
    .flip-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 70% / 50%; 
      display: flex;
      align-items: flex-start; 
      justify-content: center;
      padding-bottom: 1rem; 
      text-align: center;
    }
  
    .flip-front img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
    .flip-back {
      transform: rotateX(180deg);
      background-color: #1a1a1a;
      color: #fff;
      padding: 1rem;
    }
  
    .flip-back p {
      margin-top: 8%;
      font-size: 0.85rem; 
      max-width: 90%;
    }
  </style>
  
  <!--Si flipped es true, se añade class="flipped" al <div>.
  Si flipped es false, la clase flipped se elimina automáticamente.-->
  <div class="flip-container" on:click={() => flipped = !flipped} class:flipped={flipped}>
    <div class="flip-inner">
      <div class="flip-front">
        <img src="../imgs/Barco.png" alt="Titanic">
      </div>
      <div class="flip-back">
        <p>De los más de 2,200 pasajeros y tripulantes a bordo del Titanic, solo alrededor de 700 personas sobrevivieron, en su mayoría mujeres y niños, ya que la evacuación siguió la norma de “mujeres y niños primero”. Muchos supervivientes fueron rescatados por el RMS Carpathia, que llegó varias horas después del hundimiento.</p>
      </div>
    </div>
  </div>