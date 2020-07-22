/* https://console.cloud.google.com/storage/browser/quickdraw_dataset/full/simplified */

const fs = require('fs');
const path = require('path');
const {getQuickDraw} = require('../src/lib/qdparser');
const {linesToGcode} = require('../src/lib/lines-to-gcode');
const {plot} = require('../src/lib/plot');

const size = 250;
const margin = 20;
const scale = 0.1;
const nX = 13;
const nY = 7;

const init = async function() {
  const lines = [];
  for (let drawingX = 0; drawingX < nX; drawingX++) {
    for (let drawingY = 0; drawingY < nY; drawingY++) {
      const drawing = await getQuickDraw('./data/full_simplified_owl.ndjson');

      const drawingLines = drawing.drawing.map(stroke => {
        const parts = [];
        stroke[0].forEach((x, i) => {
          parts.push([
            (x + drawingX * (size + margin)) * scale,
            (stroke[1][i] + drawingY * (size + margin)) * scale
          ]);
        });
        return parts;
      });
      lines.push(...drawingLines);
      console.log(lines.length);
    }
  }

  const commands = linesToGcode(lines, 1500);
  console.log(commands);

  plot('/dev/tty.wchusbserial142220', commands);
};

init();
