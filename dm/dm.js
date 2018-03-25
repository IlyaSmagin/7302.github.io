'use strict';

// Таблица модулей
const Modules = {
	def: {
		reqFields: [],
		description: 'Выберите модуль...'
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
		else
			debugger;
	}
	var timeBeforeCall = performance.now();
	var retVal = module.func.apply(this, args);
	var elapsedTime = performance.now() - timeBeforeCall;
	
	// Выводим результат
	if(typeof retVal != 'string' && module.returnCodes !== undefined)
		retVal = module.returnCodes[retVal];
	
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
}

function validateOpt(option)
{
	var validated = true;
	switch(option.classList.item(0))
	{
		case 'N0':
			validated = /^\d+$/.test(option.value);
			break;
		case 'Q':
			validated = /^-?\d+$/.test(option.value);
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

function formatSelect() {
	var showId = !document.getElementById('type1').checked;
	
	// Чистим список
	var select = document.getElementById('select');
	var index = select.selectedIndex;
	var elements = select.childNodes;
	while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
	// Формируем список
	for(var moduleName in Modules) {
		var module = Modules[moduleName];
		var fieldOpt = document.createElement('option'); 
		fieldOpt.setAttribute('value', moduleName);
		if(module.func !== undefined && showId)
			fieldOpt.innerHTML = moduleName;
		else
			fieldOpt.innerHTML = module.description;
		select.appendChild(fieldOpt);
		select.selectedIndex = index > 0 ? index : 0;
	}
}