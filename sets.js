'use strict';

// Babel
function _instanceof(left, right) { if (right != null && typeof Symbol !== 'undefined' && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }
function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Utils =
  /*#__PURE__*/
  function () {
    function Utils() {
      _classCallCheck(this, Utils);
    }

    _createClass(Utils, null, [{
      key: 'subU',
      // Superscript для Юникода
      value: function subU(n) {
        var supArr = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
        if (n == 0)
          return supArr[0];

        var minus = false;
        if (n < 0) {
          minus = true;
          n = -n;
        }

        var result = '';
        while (n > 0) {
          var rem = n % 10;
          result = supArr[rem] + result;
          n = ~~(n / 10);
        }

        return minus ? '⁻' + result : result;
      }
    }, {
      key: 'formatQ',
      // formatter для рациональных чисел
      value: function formatQ(num) {
        var red = RED_Q_Q(num);
        if (red.q == '1')
          return red.p.toString();
        return red.toString();
      }
    }]);

    return Utils;
  }();

/*******************************************/
/**************Классы множеств**************/
/*******************************************/
// Множество натуральных чисел с 0
var Natural =
  /*#__PURE__*/
  function () {
    function Natural(val) {
      _classCallCheck(this, Natural);
      this.a = val;
    }

    _createClass(Natural, [{
      key: 'delLeadingZeros',
      value: function delLeadingZeros() {
        while (this.arr.length > 1 && this.arr[0] == 0)
          this.arr.shift();
      }
    }, {
      key: 'a',
      get: function get() {
        return this.arr;
      },
      set: function set(val) {
       var num;
        if (Array.isArray(val))
          num = val;
        else
          num = val.toString().split('');
        this.arr = num.map(function (digit) { return Number(digit); });
        if (!/^\d+$/.test(this.arr.join('')))
          throw new Error('Invalid value for Natural');
      }
    }, {
      key: 'n',
      get: function get() {
        if (this.arr) for (var i = 0; i < this.arr.length; i++)
          if (this.arr[i] > 0)
            return this.arr.length - i;
        return 0;
      }
    }]);

    return Natural;
  }();
Natural.prototype.toString = function () { return this.a.join(''); };

// Множество целых чисел
var Integer =
  /*#__PURE__*/
  function () {
    function Integer(val) {
      _classCallCheck(this, Integer);
      this.a = val;
    }

    _createClass(Integer, [{
      key: 'a',
      get: function get() {
        return this.natural.a;
      },
      set: function set(val) {
        var num;
        if (Array.isArray(val))
          num = val.slice(0);
        else
          num = val.toString().split('');
        if (!/^-?\d+$/.test(num.join('')))
         throw new Error('Invalid value for Integer');

        if (num[0] === '-') {
          this.negative = true;
          num.shift();
        }
        else
          this.negative = false;

        this.natural = new Natural(num);
      }
    }, {
      key: 'n',
      get: function get() {
        return this.natural.n;
      }
    }, {
      key: 'b',
      get: function get() {
        return this.negative;
      },
      set: function set(val) {
        this.negative = val;
      }
    }]);

    return Integer;
  }();
Integer.prototype.toString = function () { return (this.b ? '-' : '') + this.natural; };

// Множество рациональных чисел
var Rational =
  /*#__PURE__*/
  function () {
    function Rational(numerator, denumerator) {
      _classCallCheck(this, Rational);

      var arr = numerator.toString().split('/');
      if (arr.length > 1) {
        numerator = arr[0];
        denumerator = arr[1];
      }

      this.p = numerator; // Числитель
      this.q = denumerator; // Знаменатель
    }

    _createClass(Rational, [{
      key: 'p',
      get: function get() {
        return this.numerator;
      },
      set: function set(val) {
        this.numerator = new Integer(val);
      }
    }, {
      key: 'q',
      get: function get() {
        return this.denumerator;
      },
      set: function set(val) {
        if (val === undefined)
          val = 1;
        this.denumerator = new Natural(val);
      }
    }, {
      key: 'b',
      get: function get() {
        return this.numerator.b;
      }
    }]);

    return Rational;
  }();
Rational.prototype.toString = function () {
  var str = this.numerator;
  if (this.denumerator !== undefined)
    str += '/' + this.denumerator;
  return str;
};

// Многочлен
var Polynomial =
  /*#__PURE__*/
  function () {
    function Polynomial(val) {
      _classCallCheck(this, Polynomial);
      this.c = val;
    }

    _createClass(Polynomial, [{
      key: 'c',
      get: function get() {
        return this.arr;
      },
      set: function set(val) {
        if (Array.isArray(val))
          throw Error();
        if (val.c && Array.isArray(val.c)) {
          this.arr = val.c.slice();
          return;
        }

        this.arr = [];
        var vars = val.toString().split(/\+|(?=-)/);
        for (var i = 0; i < vars.length; i++) {
          var parts = vars[i].split('x');
          if(parts[0] === '')
            parts[0] = 1;
          if(parts.length === 1) // константа
            parts[1] = 0;
          else if(parts[1][0] !== '^') // x^1
            parts[1] = 1;
          else {
            parts[1] = parseInt(parts[1].substr(1));
            if(!Number.isSafeInteger(parts[1]))
              throw Error('недопустимая степень полинома');
          }
          if(!this.arr[parts[1]])
            this.arr[parts[1]] = new Rational(parts[0]);
          else
            this.arr[parts[1]] = ADD_QQ_Q(this.arr[parts[1]], new Rational(parts[0]));
          this.arr[parts[1]] = RED_Q_Q(this.arr[parts[1]]);
        }
      }
    }, {
      key: 'm',
      get: function get() {
        return this.arr.length - 1;
      }
    }]);

    return Polynomial;
  }();
Polynomial.prototype.toString = function () {
  var str = '';
  for (var i = this.m; i >= 0; i--)
    if (this.c[i] && this.c[i].p.n > 0) {
      var k = Utils.formatQ(this.c[i]);
      str += (str.length > 0 && !this.c[i].b ? '+' : '') + (i == 0 ? k : ((k === '1' ? '' : k) + ('x' + (i > 1 ? Utils.subU(i) : ''))));
    }
  return str.length > 0 ? str : '0';
};