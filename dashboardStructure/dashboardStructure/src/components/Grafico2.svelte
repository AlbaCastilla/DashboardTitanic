<div class="grafico">

  <!-- Aquí se mostrará el número total de pasajeros -->
  <p id="total-passengers">Cargando...</p>
</div>

<script>
import { totalPassengers } from '../stores_titanic.js';

// Asegurémonos de que el valor se actualiza correctamente cuando se recibe el total
totalPassengers.subscribe(result => {
  const totalPassengersElement = document.getElementById('total-passengers');
  if (totalPassengersElement) {
    if (result !== undefined && result !== null) {
      totalPassengersElement.textContent = `Número de pasajeros totales: ${result}`;
    } else {
      totalPassengersElement.textContent = `No se pudo obtener el número de pasajeros.`;
    }
  }
});
</script>

<style>
.grafico {
  background-color: lightblue;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 5px;
  text-align: center;
}

#total-passengers {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
