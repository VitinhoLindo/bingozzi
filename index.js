class Bingozzi {
  constructor() {
    this.window = window;
    this.document = this.window.document;

    this.valueOffSet = {
      x: 70,
      y: 70
    };
    this.currentValues = [];
    this.winvalues = [];

    this.cartelainput = this.document.getElementById('cartela');
    this.values       = this.document.getElementById('values');

    this.listen();
  }

  listen() {
    this.window.onresize = (event) => this.resize(event);
    this.cartelainput.onchange = (event) => this.changeCartela(event);
  }

  removeLastNumbers() {
    this.currentValues = [];
    this.winvalues = [];
    let children = null;


    while(this.values.firstChild) {
      let child = this.values.firstChild;

      while(child.firstChild) {
        child.removeChild(child.firstChild);
      }

      this.values.removeChild(child);
    }
  }

  getNumbersArray(value) {
    if (/[Cartela:]/g.test(value) == false) {
      alert('invalid value input');
      return null;
    }

    value = value.split(':').filter((line) => {
      line = line.replace(/[a-zA-Z:]/g, '');

      return !!line;
    });
    value = value[0].split(',').map((line) => {
      return parseInt(line);
    });

    return value;
  }

  mainOffSet() {
    const { innerHeight, innerWidth } = this.window;
    return { innerHeight, innerWidth };
  }

  valueElementOffSet() {
    let rect = this.values.getClientRects()[0];

    let { width , height } = rect;
    return { width , height };
  }

  valuesInPage(length) {
    // Cartela: 3,4,18,25,32,34,35,38,45,46,48,53,57,58,65,74,75,77,80,82,86,87,88,89
    let { width, height } = this.valueElementOffSet();

    return Math.floor(width / this.valueOffSet.x);
  }

  valueInput(value) {
    if (this.winvalues.indexOf(value) >= 0) return;
    this.winvalues.push(value);

    let valueToWin = this.currentValues.filter((_value) => {
      return (this.winvalues.indexOf(_value) < 0) ? true : false;
    });

    if (!valueToWin.length) alert('winner !');
  }

  clickButton(event = new MouseEvent) {
    const button = event.srcElement;

    button.className = 'btn-value-set';

    this.valueInput(parseInt(button.value));
  }

  addLines(valuesLinesArray) {
    for(let index in valuesLinesArray) {
      let line = this.document.createElement('div');

      line.classList.add('line-value');

      for(let value of valuesLinesArray[index]) {
        let btn = this.document.createElement('button');

        btn.className = 'btn-value-unset'
        btn.innerHTML = value;
        btn.value = value;
        btn.onclick = (event) => this.clickButton(event);

        line.appendChild(btn);
      }

      this.values.appendChild(line);
    }
  }
  
  setValues(values = []) {
    this.currentValues = values;
    let valueLines = [], count = 0;
    let totalLine = this.valuesInPage(values.length);

    while(true) {
      if (count >= values.length) break;
      let index = 0;
      let _values = [];

      while(true) {
        if (index == totalLine) break;
        let value = values[index + count];
        if (!value) break;

        _values.push(value);
        index++;
      }

      valueLines.push(_values);
      count += index;
    }

    this.addLines(valueLines);
  }

  changeCartela(event = new InputEvent, arg = { valueArray: [], winerArray: [] }) {
    this.removeLastNumbers();

    if (!event) {
      this.winvalues = arg.winerArray;
      this.setValues(arg.valueArray);
      return;
    }

    let numberArray = this.getNumbersArray(event.srcElement.value);
    if (numberArray == null) return;
    this.setValues(numberArray);
  }

  resize(event) {
    this.changeCartela(null, {
      valueArray: this.currentValues,
      winerArray: this.winvalues
    });
  }


}

window.onload = function () {
  new Bingozzi();
};

// 64