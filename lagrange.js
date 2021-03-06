// const { create, all } = require('mathjs');
// const math = create(all);

const lagrange = async (xPoints, yPoints, selectedPoint) => {
  math.config({
    number: 'Fraction'
  })
  
  const memory = [];
  let polinomy = '0';
  const ls = [];

  for (i = 0; i < yPoints.length; i++) {
    polinomy += `+(y${i}*L${i})`;
  }
  memory.push(`Construindo polinômio: ${polinomy}`);
  oldPolinomy = polinomy;

  for (i = 0; i < yPoints.length; i++) {
    polinomy = polinomy.replace(`y${i}`, yPoints[i]);
  }
  memory.push(`Substituindo variáveis ${oldPolinomy} => ${polinomy}`);

  for (i = 0; i < yPoints.length; i++) {
    let l = '/';
    for (j = 0; j < yPoints.length; j++) {
      if (j == i) continue;
      else {
        l = (`(x-x${j})`) + l;
        l += (`(x${i}-x${j})`);
      }
    }
    memory.push(`Gerado o L ${i}: ${l}`);
    ls.push(l);
  }

  oldLs = ls
  for (i = 0; i < ls.length; i++) {
    for (j = 0; j < xPoints.length; j++) {
      const xRegex = new RegExp(`x${j}`, 'g');
      ls[i] = ls[i].replace(xRegex, `(${xPoints[j]})`);
    }
  }
  memory.push(`Substituindo variáveis ${oldLs} => ${ls}`);

  oldPolinomy = polinomy;
  for (i = 0; i < ls.length; i++) {
    polinomy = polinomy.replace(`L${i}`, `(${math.simplify(ls[i])})`);
  }
  memory.push(`Substituindo variáveis ${oldPolinomy} => ${polinomy}`);
  memory.push(`Polinômio: ${polinomy}`);

  selectedPoint = (selectedPoint == '') ? 1 : selectedPoint;

  scope = { x: selectedPoint };
  result = math.evaluate(polinomy, scope);
  const resultToShow = `y = ${eval(math.format(result)).toFixed(4)}`;

  return { Polinomio: polinomy, 'Passo-a-Passo': memory, Resultado: resultToShow };
}

// console.log(lagrange([0.5, 2.5, 4.5], [0.8, 1.1, 1.5], 3.5));

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

  const res = await lagrange(xPoints, yPoints, point);

  document.querySelector('#result').value = res.Resultado;
});