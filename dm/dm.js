"use strict";

// Таблица модулей
const Modules = {
	COM_NN_D: {
		function: COM_NN_D,
		reqFields: {'a1': 'Первое число', 'n1': 'Порядок старшей позиции', 'a2': 'Второе число', 'n2': 'Порядок старшей позиции'},
		description: 'Сравнение натуральных чисел',
		//returnCodes: { 0:'Числа одинаковы', 1:'Второе число больше первого', 2:'Первое число больше второго' }
		returnCodes: { 0:'Пока не работает xD' }
	},
	NZER_N_B: {
		function: NZER_N_B,
		reqFields: {'a': 'Число', 'n': 'Порядок старшей позиции'},
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
	var len = Math.min(n, a.length);
	for (let i=0; i<len; i++) {
		if(a[i] != 0)
			return 1;
	}
	return 0;
};

/* Коллбэки
 * 
 */
 
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
	for(var fieldName in module.reqFields) {
		var fieldDiv = document.createElement('div'); 
		fieldDiv.setAttribute('class', 'arg');
		var divContent = document.createTextNode(module.reqFields[fieldName]);
		var divInput = document.createElement('input');
		divInput.setAttribute('type', 'text');
		divInput.setAttribute('name', fieldName);
		fieldDiv.appendChild(divContent);
		fieldDiv.appendChild(divInput);
		var form = select.parentNode;
		form.insertBefore(fieldDiv, form.submit);
	}
}

function processForm(form) {
	var moduleName = form.select.options[form.select.selectedIndex].value;
	if(moduleName == 'default')
		return false;
	
	var module = Modules[moduleName];
	// Формируем аргументы
	var args = [];
	for(var fieldName in module.reqFields) {
		args.push(form[fieldName].value);
	}
	var retVal = module.function.apply(this, args);
	
	// Выводим результат
	if(module.returnCodes !== undefined)
		retVal = module.returnCodes[retVal];
	//alert(retVal);
	
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