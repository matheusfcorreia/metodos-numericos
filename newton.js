// const { create, all } = require('mathjs');
// const math = create(all);

const newton = async (xPoints, yPoints, selectedPoint) => {
  math.config({
    number: 'Fraction'
  })
  const memory = [];
  let polinomy = 'd0';
  let differences = [];
  const dN = [];

  for (i = 1; i < yPoints.length; i++) {
    let v = ''
    for (j = 0; j < i; j++) {
      v += `(x-x${j})`;
    }
    polinomy += `+d${i}${v}`;
  }
  memory.push(`Criado o polinômio: ${polinomy}`);

  dN.push(parseFloat(yPoints[0]).toFixed(4));
  memory.push(`d0: ${parseFloat(yPoints[0]).toFixed(4)}`);

  for (i = 0; i < yPoints.length - 1; i++) {
    let difference = { 'valor': (yPoints[i + 1] - yPoints[i]) / (xPoints[i + 1] - xPoints[i]), max: xPoints[i + 1], min: xPoints[i] };

    memory.push(`Diferença dividida: x=${xPoints[i]} e y=${yPoints[i]} com x=${xPoints[i + 1]} e y=${yPoints[i + 1]}. Resultado ${difference['valor']}`);
    if (i == 0) {
      memory.push(`Encontrado o dn ${dN.length}: ${parseFloat(difference['valor']).toFixed(4)}`);
      dN.push(parseFloat(difference['valor']).toFixed(4));
    }
    differences.push(difference);
  }

  const newDifferences = [];
  for (i = 0; i < differences.length - 1; i++) {
    max = (differences[i + 1]['max'] > differences[i]['max']) ? differences[i + 1]['max'] : differences[i]['max'];
    min = (differences[i + 1]['min'] < differences[i]['min']) ? differences[i + 1]['min'] : differences[i]['min'];
    difference = { 'valor': (differences[i + 1]['valor'] - differences[i]['valor']) / (max - min), max: max, min: min };
    memory.push(`Diferença dividida: x=${min} e y=${differences[i]['valor']} com x=${max} e y=${differences[i + 1]['valor']}. Resultado ${difference['valor']}`);

    if (i == 0) {
      memory.push(`Encontrado o dn ${dN.length}: ${parseFloat(difference['valor']).toFixed(4)}`);
      dN.push(parseFloat(difference['valor']).toFixed(4));
    }
    newDifferences.push(difference);
  }
  differences = newDifferences;

  oldPolinomy = polinomy;
  for (i = 0; i < yPoints.length; i++) {
    const dRegex = new RegExp(`d${i}`, 'g');
    polinomy = polinomy.replace(dRegex, `(${dN[i]})`);
  }
  memory.push(`Substituindo os dn ${oldPolinomy}. Resultado: ${polinomy}`);

  oldPolinomy = polinomy;
  for (i = 0; i < xPoints.length - 1; i++) {
    const xRegex = new RegExp(`x${i}`, 'g');
    polinomy = polinomy.replace(xRegex, `(${xPoints[i]})`);
  }
  memory.push(`Substituindo os xn ${oldPolinomy}. Resultado: ${polinomy}`);
  memory.push(`Polinômio: ${polinomy}`);

  selectedPoint = (selectedPoint == '') ? 1 : selectedPoint;
  const scope = { x: selectedPoint };
  const result = `y = ${eval(math.format(math.evaluate(polinomy, scope))).toFixed(4)}`;

  return { Polinomio: polinomy, 'Passo-a-Passo': memory, Resultado: result };
}

// console.log(newton([0.5, 2.5, 4.5], [0.8, 1.1, 1.5], 3.5));

document.querySelector("#btnCalcular").addEventListener('click', async () => {
  const xPoints = [
    Number(document.querySelector('#px1').value), 
    Number(document.querySelector('#px2').value), 
    Number(document.querySelector('#px3').value)
  ];
  const yPoints = [
    Number(document.querySelector('#py1').value), 
    Number(document.querySelector('#py2').value), 
    Number(document.querySelector('#py3').value)
  ];
  const point = document.querySelector('#point').value;

  const res = await newton(xPoints, yPoints, point);

  document.querySelector('#result').value = res.Resultado;
});
