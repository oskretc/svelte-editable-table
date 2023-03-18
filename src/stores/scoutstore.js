/* eslint-disable prettier/prettier */
import {writable} from 'svelte/store';
// import {ScoutField} from '../types.ts';

export const mydata = writable([
    {scoutName: 'S1', growerName: 'G1', fieldName: 'F1', acres: 100},
    {scoutName: 'S1', growerName: 'G2', fieldName: 'F2', acres: 200},
    {scoutName: 'S2', growerName: 'G3', fieldName: 'F3', acres: 300},
    {scoutName: 'S2', growerName: 'G4', fieldName: 'F4', acres: 400}
  ]);
