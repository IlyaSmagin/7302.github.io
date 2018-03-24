"use strict";

// Таблица модулей
const Modules = {
	COM_NN_D: {
		function: COM_NN_D,
		reqFields: [
			{caption: 'Первое число', name: 'a1', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n1', className: 'N0'},
			{caption: 'Второе число', name: 'a2', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n2', className: 'N0'}
		],
		description: 'Сравнение натуральных чисел',
		//returnCodes: { 0:'Числа одинаковы', 1:'Второе число больше первого', 2:'Первое число больше второго' }
		returnCodes: { 0:'Пока не работает xD' }
	},
	NZER_N_B: {
		function: NZER_N_B,
		reqFields: [
			{caption: 'Число', name: 'a', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n', className: 'N0'}
		],
		description: 'Проверка на ноль',
		returnCodes: { 0:'Число равно 0', 1:'Число не равно 0' }
	}
};

function COM_NN_D(a1, n1, a2, n2)
{
	return 0;
}

function NZER_N_B(a, n) {
	// TODO: Уточнить про порядок
	a = a.split('').reverse();
	n = parseInt(n);
	var len = Math.min(n+1, a.length);
	for (let i=0; i<len; i++) {
		if(a[i] != 0)
			return 1;
	}
	return 0;
};

/*************
 * Callbacks *
 *************/
function selectOnChange(select) {
	var module = Modules[select.options[select.selectedIndex].value];
	if(module === undefined || module.function === undefined || module.reqFields === undefined)
		debugger;
	
	// Удаляем старые поля
	var elements = document.getElementsByClassName('arg');
	while(elements.length > 0){
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
		fieldDiv.appendChild(divContent);
		fieldDiv.appendChild(divInput);
		var form = select.parentNode;
		form.insertBefore(fieldDiv, form.submit);
	}
}

function checkOpt(option)
{
	var checkPassed;
	switch(option.className)
	{
		case 'N0':
			checkPassed = /^\d+$/.test(option.value);
			break;
		case 'Q':
			checkPassed = /^-?\d+$/.test(option.value);
			break;
		default:
			debugger;
	}
	
	if(checkPassed)
		option.removeAttribute('style');
	else
		option.setAttribute('style','background-color:#ffe6e6');
	
	return checkPassed;
}

function processForm(form) {
	var moduleName = form.select.options[form.select.selectedIndex].value;
	if(moduleName == 'default')
		return false;
	
	// Проверяем поля
	var checkPassed = true;
	var elements = document.querySelectorAll("input[type=text]");
	for(let i=0; i<elements.length; i++)
		if(!checkOpt(elements[i]))
			checkPassed = false;
	if(!checkPassed)
		return false;
	
	var module = Modules[moduleName];
	// Формируем аргументы и вызываем функцию
	var args = [];
	for(let i=0; i<module.reqFields.length; i++) {
		args.push(form[module.reqFields[i].name].value);
	}
	var retVal = module.function.apply(this, args);
	
	// Выводим результат
	if(module.returnCodes !== undefined)
		retVal = module.returnCodes[retVal];
	
	var result = document.getElementById('right-half');
	result.appendChild(document.createTextNode(retVal));	
	result.appendChild(document.createElement('br'));
	
    return false;
}

function onLoad() {
	// Формируем список
	for(var fieldName in Modules) {
		var fieldOpt = document.createElement('option'); 
		fieldOpt.setAttribute('value', fieldName);
		fieldOpt.innerHTML = Modules[fieldName].description;
		document.getElementById('select').appendChild(fieldOpt);
	}
}