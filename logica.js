
const printMatrix = (matrix) => {
  let print = '';

  for (const row of matrix) {
    let line = '';
    for (const elem of row) {
      elem.toString().length > 1 ? line += `${elem}  ` :
      line += `${elem}   `
    }
    print += `${line} \n`
  }

  return print;
}

const matrixFromSystem = (system) => {
  let matrix = [];
  const vars = new Set();
  for (const row of system) {
    let matrixRow = [];
    for (const elem of row) {
      const variable = elem.match(/[a-zA-Z]/g);
      if (elem.match(/\d/g)) {
        if (variable) vars.add(variable[0]);
        matrixRow.push(Number(elem.match(/[-+]*\d/g)[0]));
      } else {
        vars.add(variable[0]);
        matrixRow.push(1);
      }
    }
    matrix.push(matrixRow);
  }

  return { vars, matrix };
}

const getSystem = (systems) => {
  const systemsArray = [];
  for (const system of systems) {
    let filteredSystem = system.replace(/\s[=]\s|\s[+-]\s/g, ' ');
    filteredSystem = filteredSystem.split(/\s/g);
    systemsArray.push(filteredSystem);
  }

  return systemsArray;
}

const system = ['x + 2y + 3z = 1', '2x + y - z = -2', '9x - 2y + z = 2'];
