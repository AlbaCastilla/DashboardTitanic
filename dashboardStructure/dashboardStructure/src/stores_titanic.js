// Importamos las funciones necesarias de Svelte y D3.js
import { readable, derived, writable } from 'svelte/store';
import { csv, autoType } from 'd3';

// Definimos la ruta del archivo que contiene los datos del Titanic desde el repositorio online
const dataPath = 'https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv';

// Store que carga los datos del Titanic desde el archivo CSV y los almacena en un store `readable`
export const dataTitanic = readable([], set => {
  csv(dataPath, autoType).then(d => {
    set(d);
  });
});

export const dataByPortAndClass = derived(
  dataTitanic,
  ($dataTitanic) => {
    // Si los datos no han cargado aún, devolvemos un objeto vacío
    if (!$dataTitanic.length) return {};

    // Definimos los puertos y las clases a considerar
    const ports = ['C', 'Q', 'S'];
    const classes = [1, 2, 3];

    const result = {};

    ports.forEach(port => {
      // Convertimos el valor de Embarked a mayúsculas y lo recortamos para evitar espacios
      const portData = $dataTitanic.filter(d => 
        d.Embarked && d.Embarked.toUpperCase().trim() === port
      );

      result[port] = {};

      classes.forEach(cls => {
        const classData = portData.filter(d => d.Pclass === cls);
        result[port][cls] = {
          total: classData.length,
          survivors: classData.filter(d => d.Survived === 1).length
        };
      });
    });

    return result;
  }
);

  
// devuelve el número total de supervivientes en el dataset
export const totalSurvivors = derived(
  dataTitanic,
  ($dataTitanic) => $dataTitanic.filter(d => d.Survived === 1).length
);

//  devuelve el número total de pasajeros en el dataset
export const totalPassengers = derived(
  dataTitanic,
  ($dataTitanic) => $dataTitanic.length
);

//devuelve, por género, el número total de pasajeros y el número de supervivientes.
// Se agrupan en tres categorías:
// - male: pasajeros de género masculino.
// - female: pasajeros de género femenino.
// - everyone: todos los pasajeros (suma de male y female).
export const dataByGender = derived(
    dataTitanic,
    ($dataTitanic) => {
      // Filtrar los datos por género
      const maleData = $dataTitanic.filter(d => d.Sex === 'male');
      const femaleData = $dataTitanic.filter(d => d.Sex === 'female');
  
      // Calcular totales por género
      const maleTotal = maleData.length;
      const femaleTotal = femaleData.length;
      const everyoneTotal = $dataTitanic.length;
  
      // Calcular el número de supervivientes por género
      const maleSurvivors = maleData.filter(d => d.Survived === 1).length;
      const femaleSurvivors = femaleData.filter(d => d.Survived === 1).length;
      const everyoneSurvivors = $dataTitanic.filter(d => d.Survived === 1).length;
  
      // Devolver un objeto con la información para cada categoría
      return {
        male: {
          total: maleTotal,
          survivors: maleSurvivors
        },
        female: {
          total: femaleTotal,
          survivors: femaleSurvivors
        },
        everyone: {
          total: everyoneTotal,
          survivors: everyoneSurvivors
        }
      };
    }
  );

  export const dataByPort = derived(dataTitanic,($dataTitanic) => {
      // Filtrar los datos por género
      const portC = $dataTitanic.filter(d => d.Embarked === 'C');
      const portQ = $dataTitanic.filter(d => d.Embarked === 'Q');
      const portS = $dataTitanic.filter(d => d.Embarked === 'S');
  
      // Calcular totales por género
      const portCTotal = portC.length;
      const portQTotal = portQ.length;
      const portSTotal = portS.length;
  
      // Calcular el número de supervivientes por género
      const portCSurvivors = portC.filter(d => d.Survived === 1).length;
      const portQSurvivors = portQ.filter(d => d.Survived === 1).length;
      const portSSurvivors = portS.filter(d => d.Survived === 1).length;
      
  
      // Devolver un objeto con la información para cada categoría
      return {
        C: {
          total: portCTotal,
          survivors: portCSurvivors
        },
        Q: {
          total: portQ,
          survivors: portQSurvivors
        },
        S: {
          total: portS,
          survivors: portSSurvivors
        }
      };
    }
  );
  export const dataByClass = derived(dataTitanic,($dataTitanic) => {
    // Filtrar los datos por género
    const class1 = $dataTitanic.filter(d => d.Pclass === 1);
    const class2 = $dataTitanic.filter(d => d.Pclass === 2);
    const class3 = $dataTitanic.filter(d => d.Pclass === 3);


    const class1Total = class1.length;
    const class2Total = class2.length;
    const class3Total = class3.length;

   
    const class1Survivors = class1.filter(d => d.Survived === 1).length;
    const  class2Survivors = class2.filter(d => d.Survived === 1).length;
    const class3Survivors = class3.filter(d => d.Survived === 1).length;
    

    // Devolver un objeto con la información para cada categoría
    return {
      1: {
        total: class1Total,
        survivors: class1Survivors
      },
      2: {
        total: class2Total,
        survivors: class2Survivors
      },
      3: {
        total: class3Total,
        survivors: class3Survivors
      }
    };
  }
);
  

  export const dataByPortAge = derived(dataTitanic, ($dataTitanic) => {
    // Para cada puerto (C, Q, S), filtramos los registros y mapeamos cada objeto
    // para obtener únicamente la edad (d.Age) y la propiedad de supervivencia (d.Survived)
    const portC = $dataTitanic
      .filter(d => d.Embarked === 'C')
      .map(d => ({ age: d.Age, survived: d.Survived }));
    const portQ = $dataTitanic
      .filter(d => d.Embarked === 'Q')
      .map(d => ({ age: d.Age, survived: d.Survived }));
    const portS = $dataTitanic
      .filter(d => d.Embarked === 'S')
      .map(d => ({ age: d.Age, survived: d.Survived }));
  
    // Se devuelve un objeto con las claves 'C', 'Q' y 'S', 
    // cada una conteniendo un array de objetos con la edad y el estado de supervivencia.
    return { C: portC, Q: portQ, S: portS };
  });

  export const dataBySexAge = derived(dataTitanic, ($dataTitanic) => {
    // Para cada género (male y female), filtramos los registros y mapeamos cada objeto
    // para obtener únicamente la edad (d.Age) y la propiedad de supervivencia (d.Survived)
    const male = $dataTitanic
      .filter(d => d.Sex === 'male')
      .map(d => ({ age: d.Age, survived: d.Survived }));
    const female = $dataTitanic
      .filter(d => d.Sex === 'female')
      .map(d => ({ age: d.Age, survived: d.Survived }));
  
    // Se devuelve un objeto con las claves 'male' y 'female', 
    // cada una conteniendo un array de objetos con la edad y el estado de supervivencia.
    return { male, female };
  });

  export const dataByClassAge = derived(dataTitanic, ($dataTitanic) => {
    // Para cada clase (1, 2 y 3), filtramos los registros y mapeamos cada objeto
    // para obtener únicamente la edad (d.Age) y la propiedad de supervivencia (d.Survived)
    const class1 = $dataTitanic
      .filter(d => d.Pclass === 1)
      .map(d => ({ age: d.Age, survived: d.Survived }));
    const class2 = $dataTitanic
      .filter(d => d.Pclass === 2)
      .map(d => ({ age: d.Age, survived: d.Survived }));
    const class3 = $dataTitanic
      .filter(d => d.Pclass === 3)
      .map(d => ({ age: d.Age, survived: d.Survived }));
  
    // Se devuelve un objeto con las claves '1', '2' y '3', 
    // cada una conteniendo un array de objetos con la edad y el estado de supervivencia.
    return { 1: class1, 2: class2, 3: class3 };
  });
  

  export const ageStats = derived(dataTitanic, ($dataTitanic) => {
    // Filtramos los registros que tienen definida la edad
    const validAges = $dataTitanic
      .filter(d => d.Age != null)
      .map(d => d.Age);
  
    // Calculamos la edad mínima y máxima usando Math.min y Math.max
    const minAge = Math.min(...validAges);
    const maxAge = Math.max(...validAges);
  
    // Calculamos la media de edad sumando todas las edades y dividiendo por el número total
    const meanAge = validAges.reduce((sum, age) => sum + age, 0) / validAges.length;
  
    // Retornamos un objeto con la media, la edad mínima y la edad máxima
    return {
      average: meanAge,
      min: minAge,
      max: maxAge
    };
  });
  
  export const dataBySurvivalFare = derived(dataTitanic, ($dataTitanic) => {
    // Filtramos los registros de los pasajeros que sobrevivieron y mapeamos para obtener su precio (fare)
    const survivors = $dataTitanic
      .filter(d => d.Survived === 1)
      .map(d => ({ fare: d.Fare }));
  
    // Filtramos los registros de los pasajeros que no sobrevivieron y mapeamos para obtener su precio (fare)
    const nonSurvivors = $dataTitanic
      .filter(d => d.Survived === 0)
      .map(d => ({ fare: d.Fare }));
  
    // Devolvemos un objeto con dos propiedades:
    // 'survivors' contiene los precios de los pasajeros que sobrevivieron
    // 'nonSurvivors' contiene los precios de los pasajeros que no sobrevivieron
    return { survivors, nonSurvivors };
  });
  
  
  /*export const dataByAge = derived(dataTitanic,($dataTitanic) => {
    // Filtrar los datos por género
    const genderTotal = $dataTitanic.filter(d => d.Sex);
    const portTotal = $dataTitanic.filter(d => d.Embarked);
    const classTotal = $dataTitanic.filter(d => d.Pclass);

    // filtros
    const genderMale = genderTotal.filter(d => d.Sex === 'male');
    const genderFemale = genderTotal.filter(d => d.Sex === 'female');
    const portQ = portTotal.filter(d => d.Embarked === 'Q');
    const portC = portTotal.filter(d => d.Embarked === 'C');
    const portS = portTotal.filter(d => d.Embarked === 'S');
    const class1 = portTotal.filter(d => d.Pclass === '1');
    const class2 = portTotal.filter(d => d.Pclass === '2');
    const class3 = portTotal.filter(d => d.Pclass === '3');

    // Calcular el número de supervivientes por género
    const genderMaleAge = genderMale.filter(d => d.Age);
    const genderFemaleAge = genderFemale.filter(d => d.Age);
    const portQAge = portQ.filter(d => d.Age);
    const portSAge = portS.filter(d => d.Age);
    const portcAge = portC.filter(d => d.Age);
    const class1Age = class1.filter(d => d.Age);
    const class2Age = class2.filter(d => d.Age);
    const class3Age = class3.filter(d => d.Age);

    //  no se como devolver toda la informacion
    return {
      Genero: {
        Genero: genderMale,
        Edad: portCSurvivors
      },
      Puerto: {
        total: portQ,
        survivors: portQSurvivors
      },
      Clase: {
        total: portS,
        survivors: portSSurvivors
      }
    };
  }
);*/

