'use strict';

// Таблица модулей
const Modules = {
	def: {
		reqFields: [],
		description: 'Выберите модуль...',
		comment: 'Тут должна быть краткая справка в целом, а в модулях по необходимости задается своя справка'
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
		description: 'Добавление 1 к натуральному числу'
	},
	DER_P_P: {
		func: DER_P_P,
		className: 'P',
		reqFields: [
			{ caption: 'Коэффициент многочлена', name: 'a', className: 'P' }
		],
		description: 'Производная многочлена',
		comment: 'Коэффициенты вводяться через пробел в порядке убывания степени многочлена. Например: строка "3 2 0 42" будет соответствовать многочлену 3\u00b3+2x\u00b2+42',
		returnFormat: formatP
	}
};

function COM_NN_D(n1, a1, n2, a2)
{
	if(n1 > n2)
		return 2;
	if(n2 > n1)
		return 1;
	
	for(let i=0; i<n1; i++)
	{
		if(a1[i]>a2[i])
			return 2;
		if(a2[i]>a1[i])
			return 1;
	}
	
	return 0;
}

function NZER_N_B(n, a) {
	return n > 0 ? 1 : 0;
};

function ADD_1N_N(n, a) {
	for(var i=0; i<a.length; i++)
	{
		if(a[i] != 9)
		{
			a[i]++;
			break;
		}
		else
			a[i] = 0;
	}
	if(i == a.length)
		a.push(1);
	
	// reverse back
	a.reverse();
	// remove insignificant 0 
	while(a.length > 0)
	{
		if(a[0] != 0)
			break;
		a.splice(0, 1);
	}
	return a.join('');
}	

function DER_P_P(m, c)
{
	// TODO: K as Array
	for(let i=m; i>=0; i--)
		c[i] *= i;
	c.splice(0, 1); // degrade
	if(c.length == 0)
		c.push(0);
	
	// reverse back
	c.reverse();
	// remove insignificant 0 
	while(c.length > 1)
	{
		if(c[0] != 0)
			break;
		c.splice(0, 1);
	}
	return c;
}

/*******************************************/
/*не трогайти пжалуста все что ниже спосибо*/
/*******************************************/
function orderScan(value)
{
	var order = 0;
	for(let i=0; i<value.length; i++)
		if(value[i] > 0)
			order = i + 1;
		
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

function formatP(arr)
{
	var str = '';
	for(let i=arr.length - 1; i > 0; i--)
	{
		str += arr[i] + 'x' + subU(i) + '+';
	}
	return str + arr[0];
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
		if(module.className == 'N' || module.className == 'Q')
		{
			var arr = form[module.reqFields[i].name].value.split('').reverse();
			if(module.className == 'Q')
			{
				var minus = false;
				if(arr[0] == '-')
				{
					arr.splice(0, 1);
					minus = true;
				}
				args.push(minus);
			}
			args.push(orderScan(arr));
			args.push(arr);
		}
		if(module.className == 'P')
		{
			var arr = form[module.reqFields[i].name].value.split(' ').reverse();
			args.push(arr.length - 1);
			args.push(arr);
		}
		else
			debugger;
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
	fieldDiv.appendChild(document.createTextNode(retVal));	
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
		'N0': /^\d+$/,									//Натуральное с нулем
		'Q': /^-?\d+$/, 								//Целое
		'P': /^(?:0|[1-9][0-9]*)(?: 0| [1-9][0-9]*)*$/	//Коэффициенты многочлена
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
	if(radio !== undefined)	{
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