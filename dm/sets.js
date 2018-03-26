'use strict';
/*******************************************/
/**************Классы множеств**************/
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
    if(this.arr)
      for(let i=0; i<this.arr.length; i++)
        if(this.arr[i] > 0)
          return this.arr.length - i;
    return 0;
  }
  set a(val) {
    if(!Array.isArray(val))
      val = val.toString().split('');
    this.arr = val.map(function(digit) { return Number(digit); });
    if(!/^\d+$/.test(this.arr.join('')))
      debugger;
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
  set b(val) {
    this.negative = val;
  }
  set a(val) {
    if(!Array.isArray(val))
      val = val.toString().split('');
    if(!/^-?\d+$/.test(val.join('')))
      debugger;
    if(val[0] == '-')
    {
      this.negative = true;
      val.shift();
    }
    else
      this.negative = false;
    
    this.natural = new Natural(val);
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
    return this.numerator;
  }
  // Знаменатель
  get q() {
    return this.denumerator;
  }
  get b() {
    return this.numerator.b;
  }
  set p(val) {
    this.numerator = new Integer(val);
  }
  set q(val) {
    if(val === undefined)
      val = 1;
    this.denumerator = new Natural(val);
  }
}
Rational.prototype.toString = function() { var str = this.numerator; if(this.denumerator !== undefined) str+='/'+this.denumerator; return str; };
Rational.prototype.valueOf = Rational.prototype.toString;

class Polynomial {
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
Polynomial.prototype.toString = function() {
  // TODO: use big number arithmetics
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
  function intRat(rat) {
    if(rat.q.m == 1 && rat.q.a[0] == 1)
      return rat.p.a.join('');
    return rat.p.a.join('')%rat.q.a.join('') ? null : rat.p.a.join('')/rat.q.a.join('');
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
    if(this.c[i].p.n != 0)
    {
      var k = formatRat(this.c[i]);
      str += (str.length>0&&!this.c[i].b>0?'+':'') + (k==1?'':k) + 'x' + subU(this.m-i);
    }
  }
  var constant = this.c[this.m]
  if(constant.p.n != 0 || str.length == 0)
    str += (str.length>0&&!constant.b?'+':'') + formatRat(constant);
  
  return str;
}
Polynomial.prototype.valueOf = Rational.prototype.toString;