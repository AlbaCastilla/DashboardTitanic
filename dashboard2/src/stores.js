import { writable } from 'svelte/store';
import * as d3 from 'd3';

export const titanicData = writable([]);

d3.csv('https://raw.githubusercontent.com/datasciencedojo/datasets/f0ccab6a7ceafdff780052166fb6fab3311398eb/titanic.csv', d3.autoType)
  .then(rawData => {
    titanicData.set(rawData);
  })
  .catch(error => {
    console.error('Error al cargar el CSV:', error);
  });
