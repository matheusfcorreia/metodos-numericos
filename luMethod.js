const { create, all } = require('mathjs');
const math = create(all);

math.config({
  number: 'Fraction'
})

function system(a, b){
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

function luMethod(matrixA, matrixB) {
  memory = []
  increasedMatrix = matrixA

  memory.push({ acao: 'Matriz Aumentada', memory: [...increasedMatrix] });

  columnPivo = 0
  linePivo = 0

  lMatrix = []
  diagonal = 0
  for (i = 0; i < increasedMatrix.length; i++) {
    line = [];
    for (j = 0; j < increasedMatrix[i].length; j++) {

      if (j == diagonal) {
        line.push(1);
      } else {
        line.push(0);
      }
    }
    lMatrix.push(line);
    diagonal += 1;
  }

  memory.push({ acao: 'crição a matriz L', memory: lMatrix })

  for (i = 0; i < increasedMatrix.length - 1; i++) {
    if (increasedMatrix[linePivo][columnPivo] == '0') {

      biggerColumnElem = 0
      biggerLineElem = 0

      for (j = linePivo + 1; j < increasedMatrix.length; j++) {
        element = increasedMatrix[j][columnPivo];
        if (element >= biggerColumnElem) {
          biggerColumnElem = element
          biggerLineElem = j
        }
      }

      if (biggerColumnElem == '0') continue

      auxLine = increasedMatrix[linePivo]
      increasedMatrix[linePivo] = increasedMatrix[biggerLineElem]
      increasedMatrix[biggerLineElem] = auxLine
      memory.push({ acao: 'Pivotamento de linha', memory: increasedMatrix })
    }

    pivo = increasedMatrix[linePivo][columnPivo]
    memory.push({ acao: 'Pivô', memory: pivo })

    for (j = linePivo + 1; j < increasedMatrix.length; j++) {
      line = j

      lineMultiplicator = math.divide(math.evaluate(increasedMatrix[line][columnPivo]), math.evaluate(pivo))
      memory.push({ acao: `Multiplicador da linha ${line}`, memory: lineMultiplicator })
      lMatrix[line][columnPivo] = lineMultiplicator

      increasedMatrix[line].forEach((lineElem, i) => {
        multiplication = math.multiply(lineMultiplicator, increasedMatrix[linePivo][i])
        result = math.format(math.subtract(lineElem, multiplication))
        increasedMatrix[line][i] = result.split('/')[1] == '1' ? result.split('/')[0] : result
        memory.push({ acao: `Operação com o elemento ${i} da linha ${line}`, memory: increasedMatrix })
      });
    }
    linePivo += 1
    columnPivo += 1
  }

  uMatrix = increasedMatrix
  memory.push({ acao: `Criação da matriz U`, memory: uMatrix })

  lSystem = system(lMatrix, matrixB)

  lSolution = math.lsolve(lMatrix, matrixB)
  lSolution.forEach((elemento, index) => {
    formatted = math.format(elemento).slice(1, -1);
    lSolution[index] = formatted.split('/')[1] == '1' ? formatted.split('/')[0] : formatted;
  })
  memory.push({ acao: `Sistema L`, memory: lSystem })
  memory.push({ acao: `Solução L`, memory: lSolution })

  lSolutionFormatted = []
  math.config({ number: 'number' })
  lSolution.map(e => lSolutionFormatted.push(math.evaluate(e)))
  uFormatted = []
  uMatrix.map(e => { uFormatted.push(math.evaluate(e)) })


  math.config({ number: 'Fraction' })
  uSystem = system(uMatrix, lSolution)
  uSolution = math.usolve(uFormatted, lSolutionFormatted)
  uSolution.forEach((element, index) => {
    formatted = math.format(element).slice(1, -1)
    uSolution[index] = formatted.split('/')[1] == '1' ? formatted.split('/')[0] : formatted
  })
  memory.push({ acao: `Sistema U`, memory: uSystem })
  memory.push({ acao: `Solução U`, memory: uSolution })

  return {
    lSystem,
    lSolution,
    uSystem,
    uSolution,
    // memory
  }
}


const matrix = [[2, 1, -1], [1, 2, 1], [1, 1, 1]];
const vector = [-3, 3, 2];

const res = luMethod(matrix, vector);
console.log(res);