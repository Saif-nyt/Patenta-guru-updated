import fs from 'fs';
import path from 'path';

const raw = JSON.parse(fs.readFileSync('scripts/raw_questions.json', 'utf8'));

// Filter candidate questions by chapter
const ch1 = raw.filter(q => q.id_chapter === 1); // Definizioni
const ch2 = raw.filter(q => q.id_chapter === 2); // Pericolo
const ch3 = raw.filter(q => q.id_chapter === 3); // Divieto
const ch4 = raw.filter(q => q.id_chapter === 4); // Obbligo
const ch5 = raw.filter(q => q.id_chapter === 5); // Precedenza
const ch6 = raw.filter(q => q.id_chapter === 6); // Orizzontale
const ch7 = raw.filter(q => q.id_chapter === 7); // Semafori
const ch11 = raw.filter(q => q.id_chapter === 11); // Velocità
const ch12 = raw.filter(q => q.id_chapter === 12); // Distanza
const ch14 = raw.filter(q => q.id_chapter === 14); // Incroci
const ch15 = raw.filter(q => q.id_chapter === 15); // Sorpasso
const ch16 = raw.filter(q => q.id_chapter === 16); // Sosta e fermata

console.log(`Pools: Pericolo=${ch2.length}, Precedenza=${ch5.length}+${ch14.length}, Velocita=${ch11.length}, Sosta=${ch16.length}`);

// Select 30 balanced per round (mix of Vero and Falso)
function pickBalanced(list, count) {
  const veros = list.filter(q => q.answer === 1);
  const falsos = list.filter(q => q.answer === 0);
  const half = Math.floor(count / 2);
  const selected = [];
  
  for (let i = 0; i < half && i < veros.length; i++) selected.push(veros[i]);
  for (let i = 0; i < (count - selected.length) && i < falsos.length; i++) selected.push(falsos[i]);
  
  // Shuffle
  return selected.sort(() => Math.random() - 0.5);
}

const r1Raw = pickBalanced(ch2, 30);
const r2Raw = pickBalanced([...ch5, ...ch14], 30);
const r3Raw = pickBalanced([...ch11, ...ch12], 30);
const r4Raw = pickBalanced([...ch15, ...ch16], 30);
const r5Raw = pickBalanced([...ch3, ...ch4], 30);
const r6Raw = pickBalanced([...ch1, ...ch6, ...ch7], 30);
const r7Raw = pickBalanced([...ch2, ...ch5, ...ch11, ...ch16, ...ch3], 20);

console.log(`Selected: R1=${r1Raw.length}, R2=${r2Raw.length}, R3=${r3Raw.length}, R4=${r4Raw.length}, R5=${r5Raw.length}, R6=${r6Raw.length}, R7=${r7Raw.length}. Total = ${r1Raw.length + r2Raw.length + r3Raw.length + r4Raw.length + r5Raw.length + r6Raw.length + r7Raw.length}`);

