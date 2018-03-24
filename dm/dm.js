'use strict';

// Таблица модулей
const Modules = {
	def: {
		reqFields: []
	},
	COM_NN_D: {
		func: COM_NN_D,
		reqFields: [
			{caption: 'Первое число', name: 'a1', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n1', className: 'N'},
			{caption: 'Второе число', name: 'a2', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n2', className: 'N'}
		],
		description: 'Сравнение натуральных чисел',
		//returnCodes: { 0:'Числа одинаковы', 1:'Второе число больше первого', 2:'Первое число больше второго' }
		returnCodes: { 0:'Пока не работает xD' }
	},
	NZER_N_B: {
		func: NZER_N_B,
		reqFields: [
			{caption: 'Число', name: 'a', className: 'N0'},
			{caption: 'Порядок старшей позиции', name: 'n', className: 'N'}
		],
		description: 'Проверка на ноль',
		returnCodes: { 0:'Число равно 0', 1:'Число не равно 0' }
	}
};

function COM_NN_D(a1, n1, a2, n2)
{
	if(n1 > a1.length || n2 > a2.length)
		return 'Ошибка: порядок > кол-ва цифр';
	

	return 0;
}

function NZER_N_B(a, n) {
	if(n > a.length)
		return 'Ошибка: порядок > кол-ва цифр';
	a = a.split('').reverse();
	var len = Math.min(n, a.length);
	for (let i=0; i<len; i++) {
		if(a[i] != 0)
			return 1;
	}
	return 0;
};

/*******************************************
 *не трогайти пжалуста все что ниже спосибо*
 *******************************************/
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
}

function validateOpt(option)
{
	var validated = true;
	switch(option.classList.item(0))
	{
		case 'N':
			validated = /^[1-9][0-9]*$/.test(option.value);
			break;
		case 'N0':
			validated = /^(?:0|[1-9][0-9]*)$/.test(option.value);
			break;
		case 'Q':
			validated = /^(?:0|-?[1-9][0-9]*)$/.test(option.value);
			break;
		default:
			debugger;
	}
	
	if(validated)
		option.classList.remove('invalidated');
	else
		option.classList.add('invalidated');
	
	return validated;
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
		args.push(form[module.reqFields[i].name].value);
	}
	var retVal = module.func.apply(this, args);
	
	// Выводим результат
	if(typeof retVal != 'string' && module.returnCodes !== undefined)
		retVal = module.returnCodes[retVal];
	
	var result = document.getElementById('right-half');
	result.appendChild(document.createTextNode(retVal));	
	result.appendChild(document.createElement('br'));
	
    return false;
}

function onLoad() {
	// Формируем список
	for(var fieldName in Modules) {
		if(Modules[fieldName].func === undefined)
			continue;
		var fieldOpt = document.createElement('option'); 
		fieldOpt.setAttribute('value', fieldName);
		fieldOpt.innerHTML = Modules[fieldName].description;
		document.getElementById('select').appendChild(fieldOpt);
	}
}