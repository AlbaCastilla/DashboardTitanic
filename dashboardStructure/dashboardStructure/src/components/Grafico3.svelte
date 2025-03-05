<div class="grafico">
 
  <!-- Aquí se mostrará el número total de sobrevivientes -->
  <p id="total-survivors">Cargando...</p>
</div>

<script>
import { totalSurvivors } from '../stores_titanic.js';

// Asegurémonos de que el valor se actualiza correctamente cuando se recibe el total
totalSurvivors.subscribe(result => {
  const totalSurvivorsElement = document.getElementById('total-survivors');
  if (totalSurvivorsElement) {
    if (result !== undefined && result !== null) {
      totalSurvivorsElement.textContent = `Número de pasajeros sobrevivientes: ${result}`;
    } else {
      totalSurvivorsElement.textContent = `No se pudo obtener el número de sobrevivientes.`;
    }
  }
});
</script>

<style>
.grafico {
  background-color: lightcoral;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 5px;
  text-align: center;
}

#total-survivors {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
}
</style>
