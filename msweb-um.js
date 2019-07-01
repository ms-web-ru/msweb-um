/*
 * @author Mixail Sayapin
 * https://ms-web.ru
 */
(function ($) {
	if (!window.MSweb)
		MSweb = function () {
			this.imgLoader = '<svg style="-webkit-animation: rotate 1s linear infinite; -moz-animation: rotate 1s linear infinite; -o-animation: rotate 1s linear infinite; animation: rotate 1s linear infinite;" width="76" height="76" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#606060"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"></circle><path d="M36 18c0-9.94-8.06-18-18-18"></path></g></g></svg>';
			var css = '@-webkit-keyframes rotate { 0%{ -webkit-transform: rotate(0deg); } 100%{ -webkit-transform: rotate(360deg); }} @-moz-keyframes rotate{ 0%{ -moz-transform: rotate(0deg); } 100%{ -moz-transform: rotate(360deg); }}@-o-keyframes rotate{ 0%{ -o-transform: rotate(0deg); } 100%{ -o-transform: rotate(360deg); }}@keyframes rotate{ 0%{-webkit-transform: rotate(0deg);-moz-transform: rotate(0deg);-ms-transform: rotate(0deg);transform: rotate(0deg); } 100%{-webkit-transform: rotate(360deg);-moz-transform: rotate(360deg);-ms-transform: rotate(360deg);transform: rotate(360deg); }}';
			var style = document.createElement('style');
			style.innerText = css;
			var head = document.querySelector('head');
			head.appendChild(style);
		};

	MSweb.prototype.listen = function (optEl, type, selector, callback) {
		if (!optEl)
			optEl = $(document);
		else if (!(optEl instanceof jQuery)) {
			optEl = $(optEl);
		}
		optEl.on(type, selector, callback);
	};

	MSweb.prototype.unlisten = function (optEl, type, selector, callback) {
		if (!optEl)
			optEl = $(document);
		else if (!(optEl instanceof jQuery)) {
			optEl = $(optEl);
		}
		optEl.off(type, selector, callback);
	};

	MSweb.prototype.fire = function (optEl, event) {
		if (!optEl)
			optEl = $(document);
		optEl.trigger(event);
	};

	/**
	 *
	 * @param params
	 */
	MSweb.prototype.showLoader = function (params) {
		var img, bg;
		if (this.loader) {
			img = this.loader.img;
		}

		if (!params)
			params = {};

		var parent = params.parent || false;
		var width = parent ? parent.width() : window.innerWidth;
		var height = parent ? parent.height() : window.innerHeight;
		bg = this.loader ? this.loader.bg : document.createElement('div');
		var z = parent && parent[0].style.zIndex && parent[0].style.zIndex + 1 || 1111;
		var parentPos = parent ? parent[0].getBoundingClientRect() : false;
		var info = params.info || '';

		$(bg).css({
			'background': params.background || 'rgba(0, 0, 0, 0.21)',
			'position': parent ? 'absolute' : 'fixed',
			'z-index': z,
			'top': parentPos ? parentPos.y + 'px' : 0,
			'left': parentPos ? parentPos.x + 'px' : 0,
			'width': parentPos ? parentPos.width + 'px' : width + 'px',
			'height': parentPos ? parentPos.height + 'px' : height + 'px',
			'display': 'block'
		});

		if (!parent)
			parent = $('body');

		if (!this.loader) {
			parent.append($(bg));
			img = $(this.imgLoader);
			parent.append(img);
		}
		img.css({
			left: parentPos ? width / 2 + parentPos.x - 35 : width / 2 - 30,
			top: parentPos ? height / 2 + parentPos.y - 40 : height / 2 - 30,
			position: parentPos ? 'absolute' : 'fixed',
			'z-index': 1112
		});
		if (!this.loader) {
			this.loader = {
				bg: bg,
				img: img
			};
			this.loader.info = $('<p style="z-index: 1111;display: block;position: relative;text-align: center;width: 100%;top: 80px;">' + info + '</p>')
			parent.append(this.loader.info);
			this.loader.setInfo = function (info) {
				this.loader.info.html(info);
			}.bind(this);
		}
	};

	MSweb.prototype.removeLoader = function () {
		if (this.loader) {
			clearInterval(this.loader.interval);
			for (var i in this.loader)
				if (i != 'interval' && i != 'setInfo')
					this.loader[i].remove();
		}
		this.loader = null;
	};

	MSweb.prototype.stopLoader = function () {
		this.loader && this.loader.img && this.loader.img.remove();
	};

	/**
	 *
	 * @param html
	 * @param opt_params:
	 *        size - % от ширины + высоты экрана. Если не указан, то 90%
	 *        padding
	 *        ondispose
	 *
	 */
	MSweb.prototype.createModal = function (html, opt_params) {
		opt_params = opt_params || {};
		var size = opt_params && opt_params.size || 90;
		var parent = $('body');
		var cont = $('<div>', {'class': 'msweb-modal-container', style: 'display: none'});
		var bg = $('<div>', {'class': 'msweb-modal-background', style: 'display: none'});
		var closer = $('<div>X</div>', {style: 'display: none'});
		cont.css({
			position: 'fixed',
			background: '#fff',
			'z-index': 1112,
			'border-radius': '5px',
			padding: opt_params.padding !== undefined ? opt_params.padding : '10px'
		});
		bg.css({
			width: '100%',
			height: '100%',
			position: 'fixed',
			top: 0,
			left: 0,
			'background-color': 'rgba(0, 0, 0, 0.43)',
			'z-index': 1111
		});
		closer.css({
			position: 'fixed',
			background: 'red',
			color: '#fff',
			cursor: 'pointer',
			'border-radius': '30px',
			width: '24px',
			height: '24px',
			'padding-left': '6px',
			'font-size': '17px',
			'font-family': 'sans-serif',
			'font-weight': 'bold',
			'z-index': 1113
		});
		this.refreshModalPosition_(cont, bg, closer, size);
		window.addEventListener('resize', this.refreshModalPosition_.bind(this, cont, bg, closer, size));
		bg.click(this.disposeModal.bind(this, cont, bg, closer, opt_params.ondispose));
		closer.click(this.disposeModal.bind(this, cont, bg, closer, opt_params.ondispose));
		parent.append(cont).append(bg).append(closer);
		cont.html(html);
		cont.fadeIn();
		closer.fadeIn();
		bg.fadeIn();
	};

	/**
	 * @private
	 */
	MSweb.prototype.refreshModalPosition_ = function (cont, bg, closer, size) {
		size = 100 % size;
		var percW = size ? window.innerWidth / 100 * size : 0;
		var percH = size ? window.innerHeight / 100 * size : 0;
		var height = window.innerHeight - percH;
		var width = window.innerWidth - percW;
		var left = percW / 2;
		var top = percH / 2;
		cont.css({
			width: width + 'px',
			height: height + 'px',
			top: top + 'px',
			left: left + 'px',
		});
		closer.css({
			top: top + 'px',
			right: left + 'px'
		});
	};

	MSweb.prototype.disposeModal = function (cont, bg, closer, callback) {
		cont.fadeOut();
		bg.fadeOut();
		closer.fadeOut();
		setTimeout(function () {
			cont.remove();
			bg.remove();
			closer.remove();
		}, 800);
		if (callback && typeof callback === 'function') {
			callback();
		}
	};

	/**
	 * @param mess
	 * @param opt_type - success | warning | error
	 */
	MSweb.prototype.notify = function (mess, opt_type, time, opt_callback) {
		var div = $('<div>');
		var color = 'rgb(201, 247, 191)';
		if (opt_type == 'warning') {
			color = 'rgb(247, 238, 191)';
		}
		if (opt_type == 'error') {
			color = 'rgb(255, 219, 217)';
		}
		var top = window.innerHeight / 10;
		var right = window.innerWidth / 10;
		div.css({
			'max-width': '90%',
			width: '300px',
			color: '#000',
			'font-family': 'sans-serif',
			'font-size': '16px',
			position: 'fixed',
			top: top,
			right: right,
			'z-index': 99999,
			'background-color': color,
			padding: '10px',
			'border-radius': '5px'
		});
		div.html(mess);
		$('body').append(div);

		setTimeout(function () {
			div.fadeOut();
			setTimeout(function () {
				div.remove();
			}, 700);
			if (opt_callback && typeof opt_callback === 'function') {
				opt_callback();
			}
		}, time || 3000);
	};

	/**
	 *
	 */
	MSweb.prototype.initTooltips = function () {
		if (this.initTooltips.inited)
			return;
		var A = this;
		this.tooltipContainer = $('<div>');
		$('body').append(this.tooltipContainer);
		this.tooltipContainer.css({
			'z-index': 9999,
			'position': 'absolute',
			'display': 'none',
			'top': '0px',
			'left': '0px',
			'background-color': '#002aa2',
			'padding': '5px 10px 5px 10px',
			'color': 'white',
			'opacity': '0.8',
			'border-radius': '5px',
			'font-size': '12pt',
			'max-width': '250px'
		});
		var work = function (ev) {
			var el = ev.target;
			var elParent = el.parentNode;
			var elPP = elParent && elParent.parentNode;
			var elPPP = elPP && elPP.parentNode;

			var tooltip = el.getAttribute && el.getAttribute('um-tooltip') ||
				elParent && elParent.getAttribute && elParent.getAttribute('um-tooltip') ||
				elPP && elPP.getAttribute && elPP.getAttribute('um-tooltip');

			if (tooltip) {
				A.tooltipContainer.html(tooltip);
				var width = A.tooltipContainer.width();
				var left = width / 2 + 5;
				A.tooltipContainer.css({
					"top": ev.clientY + window.scrollY + 20,
					"left": (ev.clientX - left) > 0 ? ev.clientX - left  : 0
				})
					.show();
			} else {
				A.tooltipContainer.hide()
					.text("")
					.css({
						"top": 0,
						"left": 0
					});
			}
		};

		document.body.addEventListener('mousemove', work);
		document.body.addEventListener('click', work);
		this.initTooltips.inited = true;
	};

	MSweb.prototype.urlGet = function (param) {
		var url = new URL(window.location.href);
		return url.searchParams.get(param) || undefined;
	};

	/**
	 * Склонение слов в зависимости от числа
	 * @param n - число
	 * @param text_forms - ['минута', 'минуты', 'минут']
	 * @returns {*}
	 */
	MSweb.prototype.declineByNumber = function (n, text_forms) {
		if (!n) n = 0;
		n = Math.abs(n) % 100;
		var n1 = n % 10;
		if (n > 10 && n < 20) {
			return text_forms[2];
		}
		if (n1 > 1 && n1 < 5) {
			return text_forms[1];
		}
		if (n1 == 1) {
			return text_forms[0];
		}
		return text_forms[2];
	};

	/**
	 * форматирует числа добавляя пробел после каждого 3-го знака
	 * @param n
	 * @returns {string}
	 */
	MSweb.prototype.abc = function (n) {
		return (n + "").split("").reverse().join("").replace(/(\d{3})/g, "$1 ").split("").reverse().join("").replace(/^ /, "");
	};

	MSweb.prototype.validateEmail = function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};


	msweb = new MSweb();
})(jQuery);