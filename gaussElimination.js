 const { create, all } = require('mathjs');
 const math = create(all);
 
function increasedMatrix(matrix, vector) {
  const increasedMatrix = []
  matrix.map((element) => increasedMatrix.push(element));

  for (let i = 0; i < increasedMatrix.length; i++) {
    increasedMatrix[i].push(vector[i])
  }

  return increasedMatrix;
}

function system(a, b) {
  expressoes = []
  a.forEach((el, index) => {
    expr = ''
    for (i = index; i < el.length - 1; i++) {
      expr += `+(${el[i]}) X${i + 1} `
    }
    expr += ` = (${b[index]})`
    expressoes.push(expr)
  })
  return expressoes
}

function gaussElimination(matrix) {
  math.config({
    number: 'Fraction'
  })
  memory = []
  increasedMatrix = matrix

  memory.push({ acao: 'Inicio da matriz A', matrix: increasedMatrix.toString() })

  columnPivo = 0
  linePivo = 0

  for (i = 0; i < increasedMatrix.length - 1; i++) {
    if (increasedMatrix[linePivo][columnPivo] == '0') {

      biggerColumnsElem = 0
      biggerRowElem = 0

      for (k = linePivo + 1; k < increasedMatrix.length; k++) {
        element = increasedMatrix[k][columnPivo];
        if (element >= biggerColumnsElem) {
          biggerColumnsElem = element
          biggerRowElem = k
        }
      }

      if (biggerColumnsElem == '0') continue

      auxLine = increasedMatrix[linePivo]
      increasedMatrix[linePivo] = increasedMatrix[biggerRowElem]
      increasedMatrix[biggerRowElem] = auxLine
      memory.push({ acao: 'Pivotamento de linha', matrix: increasedMatrix.toString()})
    }

    pivo = increasedMatrix[linePivo][columnPivo]
    memory.push({ acao: 'Pivô', pivo })

    for (j = linePivo + 1; j < increasedMatrix.length; j++) {
      line = j

      lineMultiplier = math.divide(math.evaluate(increasedMatrix[line][columnPivo]), math.evaluate(pivo))
      memory.push({ acao: `Multiplicador da linha ${line}`, matrix: lineMultiplier.toString() })

      increasedMatrix[line].forEach((lineElement, elemIndex) => {
        multiplication = math.multiply(lineMultiplier, increasedMatrix[linePivo][elemIndex])
        resultado = math.format(math.subtract(lineElement, multiplication))
        increasedMatrix[line][elemIndex] = resultado.split('/')[1] == '1' ? resultado.split('/')[0] : resultado
        memory.push({ acao: `Operação com o elemento ${elemIndex} da linha ${line}`, matrix: increasedMatrix.toString() })
      });
    }

    linePivo += 1
    columnPivo += 1
  }

  increasedMatrixAux = increasedMatrix
  newVector = []
  for (i = 0; i < increasedMatrixAux.length; i++) {
    newVector.push(math.fraction(increasedMatrixAux[i].pop()))
    for (j = 0; j < increasedMatrixAux[i].length; j++) {
      increasedMatrixAux[i][j] = math.fraction(increasedMatrixAux[i][j]);
    }
  }

  expressions = system(increasedMatrixAux, newVector);

  solutions = math.usolve(increasedMatrixAux, newVector);

  solutions.forEach((element, index) => {
    formatted = math.format(element).slice(1, -1)
    solutions[index] = formatted.split('/')[1] == '1' ? formatted.split('/')[0] : formatted
  })
  memory.push({ acao: `Matriz Aumentada`, matrix: increasedMatrixAux.toString() });
  memory.push({ acao: `Vetor b`, matrix: newVector.toString() });
  memory.push({ acao: `Sistema`, memory: expressions });
  memory.push({ acao: `Solução`, memory: solutions });

  return {
    solutions,
    expressions,
    memory
  }

}

async function getArrayFromRow(func) {
  let aux = func;
  const newArray = [];

  aux = aux.split(/\s/gm);
  aux.map((val) => {
    if (val === '=' || val === '+' || val === '-') return;
    newArray.push(val.replace(/[A-Za-z()]/gm, ''));
  })

  return newArray;
}

const matrix = [[2, 1, -1, -3], [1, 2, 1, 3], [1, 1, 1, 2]];

const res = gaussElimination(matrix);

console.log(res);
// document.querySelector("#btnCalcular").addEventListener('click', async () => {
//   const row1 = document.querySelector('#row1').value;
//   const row2 = document.querySelector('#row2').value;
//   const row3 = document.querySelector('#row3').value;
//   const matrix = [await getArrayFromRow(row1), await getArrayFromRow(row2), await getArrayFromRow(row3)]

//   const res = await gaussElimination(matrix);
//   let logs = '';
//   res.memory.map(val => {
//     logs += val.acao.toString() + (val.matrix ? val.matrix : val.memory);
//   })

//   document.querySelector('#result-gauss').value = res.solutions;
// })
