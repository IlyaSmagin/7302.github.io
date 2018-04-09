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
        if (n === 0)
          return supArr[0];
        n = n.toString().split('');
        var result = '';
        while (n.length > 0) {
          result += supArr[n[0]];
          n.shift();
        }
        return result;
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
      key: 'd',
      get: function get() {
        return this.deg;
      }
    }, {
      key: 'c',
      get: function get() {
        return this.arr;
      },
      set: function set(val) {
        if (Array.isArray(val))
          throw Error();
        if (val.d && val.c) {
          this.deg = val.d.slice(0);
          this.arr = this.cloneC(val.c);
          return;
        }

        this.deg = [];
        this.arr = [];
        var vars = val.toString().split(/\+|(?=-)/);
        for (var i = 0; i < vars.length; i++) {
          var parts = vars[i].split('x');
          if(parts[0] === '')
            parts[0] = 1;
          if(parts.length === 1) // константа
            parts[1] = new Natural('0');
          else if(parts[1][0] !== '^') // x^1
            parts[1] = new Natural('1');
          else
            parts[1] = new Natural(parts[1].substr(1));
          this.add(parts[1], parts[0]);
          this.arr[parts[1]] = RED_Q_Q(this.arr[parts[1]]);
        }
      }
    }, {
      key: 'm',
      get: function get() {
        return this.deg[this.deg.length - 1];
      }
    }, {
      key: 'cloneC',
      // Клонирование коэфов полинома
      value: function cloneC(obj) {
        var copy = [];
        for (var attr in obj)
          if (obj.hasOwnProperty(attr))
            copy[attr] = new Rational(obj[attr]);
        return copy;
      }
    }, {
      key: 'add',
      // Прибавление коэфа по степени
      value: function add(deg, num) {
        if(!this.arr[deg])
        {
          this.deg.push(deg);
          this.deg.sort(function (a, b) {
            var comp = COM_NN_D(a, b);
            return comp === 2 ? 1 : (comp === 1 ? -1 : 0);
          });
          this.arr[deg] = new Rational(num);
        }
        else
          this.arr[deg] = ADD_QQ_Q(this.arr[deg], new Rational(num));
      }
    }]);

    return Polynomial;
  }();
Polynomial.prototype.toString = function () {
  var str = '';
  for(var i = this.deg.length - 1; i >= 0; i--) {
    var degree = this.deg[i];
    if (this.c[degree].p.n > 0) {
      var k = Utils.formatQ(this.c[degree]);
      if (str.length > 0 && !this.c[degree].b)
        str += '+';
      if (!NZER_N_B(degree))
        str += k;
      else
      {
        if (k !== '1') {
          if (k !== '-1')
            str += k;
          else
            str += '-';
        }
        str += 'x';
        if (COM_NN_D(degree, new Natural(1)))
          str += Utils.subU(degree);
      }
    }
  }
  return str.length > 0 ? str : '0';
};