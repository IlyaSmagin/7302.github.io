'use strict';
/*******************************************/
/**************Таблица модулей**************/
/*******************************************/
const Modules = {
  def: {
    reqFields: [],
    description: 'Выберите модуль...',
    comment: 'Выберите модуль из списка для начала работы. Для смены типа отображения функций в списке используйте соотвествующие переключатели в верху страницы.'
  },
  COM_NN_D: {
    func: COM_NN_D,
    classType: Natural,
    reqFields: [
      { caption: 'Первое число', name: 'a1', regexType: 'N0' },
      { caption: 'Второе число', name: 'a2', regexType: 'N0' }
    ],
    description: 'Сравнение натуральных чисел',
    returnCodes: { 0:'Числа одинаковы', 1:'Второе число больше первого', 2:'Первое число больше второго' }
  },
  NZER_N_B: {
    func: NZER_N_B,
    classType: Natural,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'N0' }
    ],
    description: 'Проверка на ноль',
    returnCodes: { 0:'Число равно 0', 1:'Число не равно 0' }
  },
  ADD_1N_N: {
    func: ADD_1N_N,
    classType: Natural,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'N0' }
    ],
    description: 'Добавление 1 к натуральному числу',
    returnFormat: function (num) { num.delLeadingZeros(); return num.toString(); }
  },
  SUB_NN_N: {
    func: SUB_NN_N,
    classType: Natural,
    reqFields: [
      { caption: 'Уменьшаемое', name: 'a1', regexType: 'N0' },
      { caption: 'Вычитаемое', name: 'a2', regexType: 'N0' }
    ],
    description: 'Вычитание из первого большего натурального числа второго меньшего или равного'
  },
  ABS_Z_N: {
    func: ABS_Z_N,
    classType: Integer,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Z' }
    ],
    description: 'Абсолютная величина числа, результат - натуральное'
  },
  POZ_Z_D: {
    func: POZ_Z_D,
    classType: Integer,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Z' }
    ],
    description: 'Определение положительности числа',
    returnCodes: { 0:'Число равно нулю', 1:'Число отрицательно', 2:'Число положительно' }
  },
  MUL_ZM_Z: {
    func: MUL_ZM_Z,
    classType: Integer,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Z' }
    ],
    description: 'Умножение целого на (-1)'
  },
  TRANS_N_Z: {
    func: TRANS_N_Z,
    classType: Natural,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'N' }
    ],
    description: 'Преобразование натурального в целое'
  },
  TRANS_Z_N: {
    func: TRANS_Z_N,
    classType: Integer,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'N0' }
    ],
    description: 'Преобразование целого неотрицательного в натуральное'
  },
  INT_Q_B: {
    func: INT_Q_B,
    classType: Rational,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Q' }
    ],
    description: 'Проверка на целое, если рациональное число является целым',
    returnCodes: { 0:'Число является целым', 1:'Число не является целым' }
  },
  TRANS_Z_Q: {
    func: TRANS_Z_Q,
    classType: Integer,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Z' }
    ],
    description: 'Преобразование целого в дробное'
  },
  TRANS_Q_Z: {
    func: TRANS_Q_Z,
    classType: Rational,
    reqFields: [
      { caption: 'Число', name: 'a', regexType: 'Q' }
    ],
    description: 'Преобразование дробного в целое (если знаменатель равен 1)'
  },
  DER_P_P: {
    func: DER_P_P,
    classType: Polynomial,
    reqFields: [
      { caption: 'Коэффициенты многочлена', name: 'a', regexType: 'P' }
    ],
    description: 'Производная многочлена',
    comment: 'Коэффициенты вводяться через пробел в порядке убывания степени многочлена, дробь задается знаком деления. Пример: "-3/2 1/2 0 42" будет соответствовать многочлену -3/2x³+1/2x²+42',
  }
};

/*******************************************/
/*************Реализация функций************/
/*******************************************/
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
  for(var i=num.n-1; i>=0; i--)
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

function SUB_NN_N(num1, num2) {
  var result = new Natural(0);
  if (COM_NN_D(num1, num2) == 1)
    return "Ошибка: вычитаемое больше уменьшаемого";
  else {
    // Если вычитаемое больше или равно уменьшаемому
    var i = num1.n - 1;
    result.a[i] = 0;
    while (i >= (num1.n - num2.n)) {
      if (num1.a[i] + result.a[i] >= num2.a[i - (num1.n - num2.n)]) {
        result.a[i] = num1.a[i] - num2.a[i - (num1.n - num2.n)] + result.a[i];
        result.a[i - 1] = 0;
      } else {
        result.a[i] = num1.a[i] + 10 - num2.a[i - (num1.n - num2.n)] + result.a[i];
        result.a[i - 1] = -1;
      }
      i--;
    }
    // Нашли последние n.num2 цифр разности
    if (num2.n != num1.n) {
      while (i >= 0) {
        if ((result.a[i] == -1) && (num1.a[i] == 0)) {
          result.a[i] = result.a[i] + 10;
          result.a[i - 1] = -1;
        } else {
          result.a[i] = result.a[i] + num1.a[i];
          result.a[i - 1] = 0;
        }
        i--;
      }
      // Нашли цифры разности со второй по num1.n - (num2.n+1) 
    }
  }
  result.delLeadingZeros();
  return result;
}

function ABS_Z_N(num) {
  num.b = false;
  return new Natural(num);
}

function POZ_Z_D(num) {
  return num.n ? num.b ? 1 : 2 : 0;
}

function MUL_ZM_Z(num) {
  if(num.n == 0)
    return num;
  num.b = !num.b;
  return num;
}

function TRANS_N_Z(num) {
  return new Integer(num);
}

function TRANS_Z_N(num) {
  return ABS_Z_N(num);
}

function INT_Q_B(num){
  return num.q.n == 1 && num.q.a[0] == 1 ? 0 : 1;
}

function TRANS_Z_Q(num) {
  return new Rational(num);
}

function TRANS_Q_Z(num) {
  if(num.q.n != 1 || num.q.a[0] != 1)
    return "Ошибка: знаменатель не равен 1"
  return new Integer(num.p);
}

function DER_P_P(poly)
{
  // TODO: use big number arithmetics
  for(let i=0; i<=poly.m; i++)
    poly.c[i].p.a = (poly.c[i].p.a.join('')*(poly.m-i)).toString().split('');
  poly.c.pop(); // degrade
  if(poly.c.m < 0)
    poly.c.push(new Rational(0));
  return poly;
}