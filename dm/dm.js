'use strict';

// Таблица модулей
const Modules = {
  def: {
    reqFields: [],
    description: 'Выберите модуль...',
    comment: 'Выберите модуль из списка для начала работы. Для смены типа отображения функций в списке используйте соотвествующие переключатели в верху страницы.'
  },
  COM_NN_D: {
    func: COM_NN_D,
    className: 'N',
    reqFields: [
      { caption: 'Первое число', name: 'a1', className: 'N0' },
      { caption: 'Второе число', name: 'a2', className: 'N0' }
    ],
    description: 'Сравнение натуральных чисел',
    returnCodes: { 0:'Числа одинаковы', 1:'Второе число больше первого', 2:'Первое число больше второго' }
  },
  NZER_N_B: {
    func: NZER_N_B,
    className: 'N',
    reqFields: [
      { caption: 'Число', name: 'a', className: 'N0' }
    ],
    description: 'Проверка на ноль',
    returnCodes: { 0:'Число равно 0', 1:'Число не равно 0' }
  },
  ADD_1N_N: {
    func: ADD_1N_N,
    className: 'N',
    reqFields: [
      { caption: 'Число', name: 'a', className: 'N0' }
    ],
    description: 'Добавление 1 к натуральному числу',
    returnFormat: function (num) { num.delLeadingZeros(); return num.toString(); } 
  },
  DER_P_P: {
    func: DER_P_P,
    className: 'P',
    reqFields: [
      { caption: 'Коэффициенты многочлена', name: 'a', className: 'P' }
    ],
    description: 'Производная многочлена',
    comment: 'Коэффициенты вводяться через пробел в порядке убывания степени многочлена, дробь задается знаком деления. Пример: "-3/2 1/2 0 42" будет соответствовать многочлену -3/2x³+1/2x²+42',
  }
};

function COM_NN_D(num1, num2)
{
  // Сравниваем порядок
  if(num1.n > num2.n)
    return 2;
  if(num2.n > num1.n)
    return 1;
  
  // Ищем первый различный старший разряд
  for(let i=0; i<num1.n; i++)
  {
    if(num1.a[i]>num2.a[i])
      return 2;
    if(num2.a[i]>num1.a[i])
      return 1;
  }
  
  return 0;
}

function NZER_N_B(num) {
  return num.n > 0 ? 1 : 0;
};

function ADD_1N_N(num) {
  // Проходимся с конца
  for(var i=num.a.length-1; i>=0; i--)
  {
    // Если не 9 - просто прибавляем 1
    if(num.a[i] != 9)
    {
      num.a[i]++;
      break;
    }
    else
      num.a[i] = 0; // Девятки обнуляем
  }
  
  // Если все цифры были девятками, создаем единичку
  if(i < 0)
    num.a.unshift(1);
  
  return num;
}  

function DER_P_P(poly)
{
  // TODO: use array arithmetics
  for(let i=0; i<=poly.m; i++)
    poly.c[i].p = (poly.c[i].p.join('')*(poly.m-i)).toString().split('');
  poly.c.pop(); // degrade
  if(poly.c.length == 0)
    poly.c.push(new Rational(0));
  return poly;
}

/*******************************************/
/*не трогайти пжалуста все что ниже спосибо*/
/*******************************************/
// Множество натуральных чисел с 0
class Natural {
  constructor(val) {
    this.a = val;
  }
  get a() {
    return this.arr;
  }
  get n() {
    return this.order;
  }
  set a(val) {
    this.arr = Array.isArray(val) ? val : val.toString().split('');
    if(!/^\d+$/.test(this.arr.join('')))
      debugger;
    this.order = orderScan(this.arr);
  }
  delLeadingZeros() {
    while(this.arr.length > 1 && this.arr[0] == 0)
      this.arr.shift();
  }
}
Natural.prototype.toString = function() { return this.a.join(''); };
Natural.prototype.valueOf = Natural.prototype.toString;

// Множество целых чисел
class Integer { 
    constructor(val) {
    this.a = val;
  }
  get a() {
    return this.natural.a;
  }
  get n() {
    return this.natural.n;
  }
  get b() {
    return this.negative;
  }
  set a(val) {
    var arr = Array.isArray(val) ? val : val.toString().split('');
    if(!/^-?\d+$/.test(arr.join('')))
      debugger;
    if(arr[0] == '-')
    {
      this.negative = true;
      arr.shift();
    }
    else
      this.negative = false;
    
    this.natural = new Natural(arr);
  }
}
Integer.prototype.toString = function() { return (this.b?'-':'')+this.natural; };
Integer.prototype.valueOf = Integer.prototype.toString;

// Множество рациональных чисел
class Rational {
  constructor(numerator, denumerator) {
    var arr = numerator.toString().split('/');
    if(arr.length > 1)
    {
      numerator = arr[0];
      denumerator = arr[1];
    }
    this.p = numerator;
    this.q = denumerator;
  }
  // Числитель
  get p() {
    return this.numerator.a;
  }
  // Знаменатель
  get q() {
    return this.denumerator ? this.denumerator.a : null;
  }
  get b() {
    return this.numerator.b;
  }
  set p(val) {
    this.numerator = new Integer(val);
  }
  set q(val) {
    if(val !== undefined)
      this.denumerator = new Natural(val);
  }
}
Rational.prototype.toString = function() { var str = this.numerator; if(this.denumerator !== undefined) str+='/'+this.denumerator; return str; };
Rational.prototype.valueOf = Rational.prototype.toString;

class Polynom {
    constructor(val) {
    this.c = val;
  }
  get c() {
    return this.arr;
  }
  get m() {
    return this.arr.length-1;
  }
  set c(val) {
    if(Array.isArray(val))
      this.arr = val;
    else 
    {
      this.arr = val.toString().split(' ');
      for (let i=0; i<this.arr.length; i++)
        this.arr[i] = new Rational(this.arr[i]);
    }
  }
}
Polynom.prototype.toString = function() {
  // TODO: use array arithmetics
  function intRat(rat) {
    if(!rat.q)
      return rat.p.join('');
    return rat.p.join('')%rat.q.join('') ? null : rat.p.join('')/rat.q.join('');
  }
  
  function formatRat(rat) {
    var result = intRat(rat);
    if(result === null)
      result = rat;
    return result.toString();
  }
  
  var str = '';
  for(let i=0; i < this.m; i++)
  {
    if(this.c[i].p != 0)
    {
      var k = formatRat(this.c[i]);
      str += (str.length>0&&!this.c[i].b>0?'+':'') + (k==1?'':k) + 'x' + subU(this.m-i);
    }
  }
  var constant = this.c[this.m]
  if(constant.p != 0 || str.length == 0)
    str += (str.length>0&&!constant.b?'+':'') + formatRat(constant);
  
  return str;
}
Polynom.prototype.valueOf = Rational.prototype.toString;

function orderScan(value)
{
  var order = 0;
  for(let i=0; i<value.length; i++)
    if(value[i] > 0)
    {
      order = value.length - i;
      break;
    }
  return order;
}

function subU(n)
{
  const supArr = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
  if(n == 0)
    return supArr[0];
  
  var minus = false;
  if(n < 0)
  {
    minus = true;
    n = -n;
  }
  
  var result = '';
  while(n > 0)
  {
    var rem = n % 10;
    result = supArr[rem] + result;
    n = ~~(n/10);
  }
  
  return minus ? '⁻' + result : result;
}

function processForm(form) {
  var module = Modules[form.select.options[form.select.selectedIndex].value];
  if(module.func === undefined)
    return false;
  
  // Проверяем поля
  var validated = true;
  var elements = document.querySelectorAll('input[type=text]');
  for(let i=0; i<elements.length; i++)
    if(!validateOpt(elements[i]))
      validated = false;
  if(!validated)
      return false;
    
  // Формируем аргументы и вызываем функцию
  var args = [];
  for(let i=0; i<module.reqFields.length; i++) {
    var val = form[module.reqFields[i].name].value;
    if(module.className == 'N')
      val = new Natural(val);
    else if(module.className == 'Z')
      val = new Integer(val);
    else if (module.className == 'Q')
      val = new Rational(val);
    else if(module.className == 'P')
      val = new Polynom(val);
    else
      debugger;
    
    args.push(val);
  }
  var timeBeforeCall = performance.now();
  var retVal = module.func.apply(this, args);
  var elapsedTime = performance.now() - timeBeforeCall;
  
  // Формируем результат
  if(typeof retVal != 'string')
  {
    if(module.returnFormat !== undefined)
      retVal = module.returnFormat(retVal);
    else if(module.returnCodes !== undefined)
      retVal = module.returnCodes[retVal];
  }
  
  // Выводим
  var resultHalf = document.getElementById('right-half');
  var fieldDiv = document.createElement('div'); 
  fieldDiv.setAttribute('class', 'result last')
  fieldDiv.appendChild(document.createTextNode(retVal.toString()));  
  fieldDiv.appendChild(document.createElement('br'));
  var ms = document.createElement('span');
  ms.appendChild(document.createTextNode('('+elapsedTime+'ms)'));
  fieldDiv.appendChild(ms);
  if(resultHalf.lastChild !== null)
    resultHalf.lastChild.classList.remove('last');
  resultHalf.appendChild(fieldDiv);
  
    return false;
}

function clearResults() {
  var elements = document.getElementById('right-half').childNodes;
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}
 
function selectOnChange(select) {
  var module = Modules[select.options[select.selectedIndex].value];
  if(module === undefined || module.reqFields === undefined)
    debugger;
  
  // Удаляем старые поля
  var elements = document.getElementsByClassName('arg');
  while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
  // И создаем новые
  for(let i=0; i<module.reqFields.length; i++) {
    var field = module.reqFields[i];
    var fieldDiv = document.createElement('div'); 
    fieldDiv.setAttribute('class', 'arg');
    var divContent = document.createTextNode(field.caption);
    var divInput = document.createElement('input');
    divInput.setAttribute('type', 'text');
    divInput.setAttribute('name', field.name);
    divInput.setAttribute('class', field.className);
    divInput.setAttribute('onchange', 'validateOpt(this)');
    fieldDiv.appendChild(divContent);
    fieldDiv.appendChild(divInput);
    var form = select.parentNode;
    form.insertBefore(fieldDiv, form.submit);
  }
  // Удаляем комментарий (справку)
  var comment = document.getElementById('comment')
  var elements = comment.childNodes;
  while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
  // И пишем новый (если есть)
  if(module.comment !== undefined)
    comment.appendChild(document.createTextNode(module.comment));
}

function validateOpt(option)
{
  const rules = {
    'N0': /^\d+$/,  //Натуральное с нулем
    'Q': /^-?\d+$/,  //Целое
    'P': /^(?:0|-?[1-9][0-9]*(?:\/[1-9][0-9]*)?)(?: 0| -?[1-9][0-9]*(?:\/[1-9][0-9]*)?)*$/  //Коэффициенты многочлена
  };
  
  var className = option.classList.item(0);
  if(rules[className] === undefined)
    debugger;
  
  var validated = rules[className].test(option.value);
  if(validated)
    option.classList.remove('invalidated');
  else
    option.classList.add('invalidated');
  return validated;
}

function formatSelect(radio) {
  var select = document.getElementById('select');
  var elements = select.childNodes;
  
  // Только переключаем отображение
  if(radio !== undefined)  {
    let i = 0;
    for(var moduleName in Modules)
    {
      var module = Modules[moduleName];
      elements[i++].innerHTML = module.func !== undefined && radio.value == 'id' ? moduleName :  module.description;
    }
    return;
  }
  
  // Чистим список
  var index = select.selectedIndex;
  while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
  // Формируем список
  for(var moduleName in Modules) {
    var module = Modules[moduleName];
    var fieldOpt = document.createElement('option'); 
    fieldOpt.setAttribute('value', moduleName);
    if(module.func !== undefined && !document.getElementById('type1').checked)
      fieldOpt.innerHTML = moduleName;
    else
      fieldOpt.innerHTML = module.description;
    select.appendChild(fieldOpt);
    select.selectedIndex = index > 0 ? index : 0;
  }
  
  selectOnChange(document.getElementById('select'));
}