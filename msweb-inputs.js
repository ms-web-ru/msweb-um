/*
 * Компонент, позволяющий создавать альтернативные поля ввода
 * из обычных div блоков. также при необходимости с кнопками +-
 * В месте где необходимо поместить поле ввода необходимо разместить блок
 * <div class="msweb-input"></div>
 * Ему можно задать при необходимости свой собственный стиль и другие аттрибуты
 *
 * доступные аттрибуты для настройки:
 * max - максимальное значение (только для типа number)
 * min - минимальное значение (только для типа number)
 * type - text | email | number
 * controls="true" - наличие кнопок + -
 * validator - название своей функции, например "myValidatorFunction". В неё будет передаваться событие keyup. Должна вернуть true если проверка пройдена.
 * defaulvalidator="true" - работает только для email | number
 * editable - true | false
 *
 * @author Mixail Sayapin
 * https://ms-web.ru
 */
function MSInputs(params) {
	this.params = params || {};
	this.init();
}

MSInputs.prototype.init = function () {
	this.addCSS();
	var inputs = document.querySelectorAll('.msweb-input');
	for (var i = 0; i < inputs.length; i++)
		this.renderInput(inputs[i]);
};

MSInputs.prototype.addCSS = function () {
	if (MSInputs.cssRendered)
		return;
	var css = '.msweb-input-area {border: 1px solid silver;min-height: 25px;border-radius: 3px;width: 50px;margin: auto;display: block;}.msweb-input-area.wrong {border: 2px solid red;}.msweb-inputs-minus {width: 20px;height: 20px;border: 1px solid silver;border-radius: 20px;text-align: center;cursor: pointer;font-size: 30px;line-height: 13px;background: #e1ffbe;margin: auto;}.msweb-inputs-plus {width: 20px;height: 20px;border: 1px solid silver;border-radius: 20px;text-align: center;cursor: pointer;font-size: 22px;line-height: 17px;background: #e1ffbe;margin: auto;}.msweb-inputs-plus:hover, .msweb-inputs-minus:hover {background: #cae6a9;}table.msweb-inputs-controls-table {width:100%;}.msweb-inputs-minus:active, .msweb-inputs-plus:active {border-width: 2px;} .msweb-inputs-plus, .msweb-inputs-minus  {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}';
	var style = document.createElement('style');
	style.type = 'text/css';
	if (style.styleSheet) {
		// This is required for IE8 and below.
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}
	var head = document.head || document.getElementsByTagName('head')[0];
	head.appendChild(style);
	MSInputs.cssRendered = true;
};

MSInputs.prototype.renderInput = function (el) {
	if (el.isrendered)
		return;
	var controls = el.getAttribute('controls');
	var defaulValidatorEnabled = el.getAttribute('defaulvalidator');
	var type = el.getAttribute('type') || 'text';
	var validator = el.getAttribute('validator');
	validator = typeof validator === 'function' && validator;
	var editable = el.getAttribute('editable');
	editable = editable && editable == 'false' ? false : true;

	var input = document.createElement('div');
	input.parent_ = el;
	input.addEventListener('paste', function (e) {
		e.preventDefault();
	});
	input.className = 'msweb-input-area';

	if (type == 'number') {
		input.innerHTML = 1;
		input.style.textAlign = 'center';
	}

	if (editable)
		input.setAttribute('contenteditable', true);

	if (validator) {
		input.addEventListener('keyup', function (ev) {
			if (!validator())
				this.setState(input, 'wrong');
			else
				this.setState(input, 'success');
		}.bind(this));
	}
	else if ((defaulValidatorEnabled && (type == 'number' || type == 'email')) || (!defaulValidatorEnabled && type == 'number')) {
		input.addEventListener('keydown', this.validateNumber.bind(this));
		input.addEventListener('keyup', this.validateMinMax.bind(this));
	}

	var tr = this.getControlsWrapper(el);
	var td;
	if (controls) {
		var leftControl = document.createElement('div');
		leftControl.className = 'msweb-inputs-minus';
		leftControl.innerHTML = '-';
		leftControl.addEventListener('click', function (ev) {
			this.onMinus(input);
		}.bind(this));
		this.createControlsTd(leftControl, tr, '33.33333%');
	}
	this.createControlsTd(input, tr, controls ? '33.33333%' : '100%');
	if (controls) {
		var rightControl = document.createElement('div');
		rightControl.className = 'msweb-inputs-plus';
		rightControl.innerHTML = '+';
		rightControl.addEventListener('click', function (ev) {
			this.onPlus(input);
		}.bind(this));
		this.createControlsTd(rightControl, tr, '33.33333%');
	}
	el.isrendered = true;
};

MSInputs.prototype.validateMinMax = function (e) {
	var input = e.target || e;
	var min = input.parent_.getAttribute('min');
	var max = input.parent_.getAttribute('max');
	if (min && +input.innerText < +min && +input.innerText != 0)
		++input.innerText;
	if (max && +input.innerText > +max)
		--input.innerText;
};

MSInputs.prototype.onMinus = function (el) {
	var value = parseFloat(el.innerText) || 1;
	el.innerText = --value;
	this.validateMinMax(el);
};

MSInputs.prototype.onPlus = function (el) {
	var value = parseFloat(el.innerText) || 0;
	el.innerText = ++value;
	this.validateMinMax(el);
};

MSInputs.prototype.createControlsTd = function (contentEl, parentEl, width) {
	var td = document.createElement('td');
	td.style.width = width;
	td.appendChild(contentEl);
	parentEl.appendChild(td);
};

/**
 * таблица для инпута
 * @returns {Element} tr
 */
MSInputs.prototype.getControlsWrapper = function (parent) {
	var maxWidth = parent.getAttribute('max-width');
	var margin = parent.getAttribute('margin');
	var table = document.createElement('table');
	table.className = 'msweb-inputs-controls-table';
	if (maxWidth)
		table.style.maxWidth = maxWidth;
	if (margin)
		table.style.margin = margin;
	parent.appendChild(table);
	table.appendChild(document.createElement('tbody'));
	table.tBodies[0].appendChild(document.createElement('tr'));
	return table.tBodies[0].children[0];
};

MSInputs.prototype.validateNumber = function (e) {
	if (
		!(e.keyCode >= 48 && e.keyCode <= 57 && !e.shiftKey) && // int
		!(e.keyCode >= 96 && e.keyCode <= 105) && // num
		!(e.keyCode == 8) && // backspace
		!(e.keyCode == 9) && // tab
		!(e.keyCode == 46) && // delete
		!(e.keyCode == 65 && e.ctrlKey) && // ctrl+A
		!(e.keyCode == 82 && e.ctrlKey) // ctrl+r
	) {
		e.preventDefault();
	}
};

/**
 * @param el
 * @param type wrong | success
 */
MSInputs.prototype.setState = function (el, type) {
	el.classList.remove('wrong');
	el.classList.remove('success');
	el.classList.add(type);
};

