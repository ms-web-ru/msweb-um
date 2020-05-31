/*
 * @author Mixail Sayapin
 * https://ms-web.ru
 */
(function ($) {
	if (!window.MSweb)
		MSweb = function () {
			this.currTitle_ = document.title;
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
		var z = parent && parent[0] && parent[0].style && parent[0].style.zIndex && parent[0].style.zIndex + 1 || 999995;
		var parentPos = parent ? parent[0].getBoundingClientRect() : false;
		var info = params.info || '';

		$(bg).css({
			'background': params.background || 'rgba(0, 0, 0, 0.21)',
			'position': parent ? 'absolute' : 'fixed',
			'z-index': z,
			'top': parentPos ? parentPos.y + 'px' : 0,
			'left': parentPos ? parentPos.x + 'px' : 0,
			'width': params.width || (parentPos ? parentPos.width + 'px' : width + 'px'),
			'height': params.height || (parentPos ? parentPos.height + 'px' : height + 'px'),
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
			'z-index': 111111
		});
		if (!this.loader) {
			this.loader = {
				bg: bg,
				img: img
			};
			this.loader.info = $('<p style="z-index: 999996;display: block;position: relative;text-align: center;width: 100%;top: 80px;">' + info + '</p>')
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
	 * @param html - string | dom | $(dom)
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
			overflow: 'auto',
			background: '#fff',
			'z-index': opt_params.zIndex || opt_params['z-index'] || 1112,
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
			'z-index': opt_params.zIndex || opt_params['z-index'] || 1113
		});
		this.refreshModalPosition_(cont, bg, closer, size);
		window.addEventListener('resize', this.refreshModalPosition_.bind(this, cont, bg, closer, size));
		cont[0].close = function () {
			this.disposeModal(cont, bg, closer, opt_params.ondispose);
		}.bind(this)
		bg.click(function () {
			cont[0].close();
		});
		closer.click(function () {
			cont[0].close();
		});
		document.addEventListener('keydown', function (ev) {
			if (ev.keyCode == 27)
				cont[0].close();
		}.bind(this));

		parent.append(cont).append(bg).append(closer);
		if (typeof html === 'string')
			cont.html(html);
		else
			cont.append(html);
		if (opt_params.speed == 'fast') {
			cont.show();
			closer.show();
			bg.show();
		} else {
			cont.fadeIn();
			closer.fadeIn();
			bg.fadeIn();
		}
		return cont;
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
	MSweb.prototype.initTooltips = function (params) {
		if (this.initTooltips.inited)
			return;
		var A = this;
		this.tooltipContainer = $('<div>');
		$('body').append(this.tooltipContainer);
		this.tooltipContainer.css({
			'z-index': 999999,
			'position': 'absolute',
			'display': 'none',
			'top': '0px',
			'left': '0px',
			'background-color': 'rgba(21, 66, 197, 0.83)',
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
			var umWidth = el.getAttribute('um-width');
			if (umWidth)
				this.tooltipContainer.css({
					width: umWidth,
					'max-width': ''
				});
			else
				this.tooltipContainer.css({
					width: '',
					'max-width': '250px'
				});
			var tooltip = el.getAttribute && el.getAttribute('um-tooltip') ||
				elParent && elParent.getAttribute && elParent.getAttribute('um-tooltip') ||
				elPP && elPP.getAttribute && elPP.getAttribute('um-tooltip');

			if (tooltip) {
				A.tooltipContainer.html(tooltip);
				var width = A.tooltipContainer.width();
				var left = ev.clientX - (width / 2 + 5);
				//debugger
				//left = (ev.clientX - left) > 0 ? ev.clientX - (width / 2 + 5) : 0;
				A.tooltipContainer.css({
					"top": ev.clientY + window.scrollY + 20,
					"left": left
				})
					.show();
				width = A.tooltipContainer.width();
				//if (!umWidth && width < 250 && window.innerWidth > 320) {
				//	A.tooltipContainer.css({left: left - (250 - width)});
				//}
			} else if (el != A.tooltipContainer[0] && elPP != A.tooltipContainer[0] && elPPP != A.tooltipContainer[0]) {
				A.tooltipContainer.hide()
					.text("")
					.css({
						"top": 0,
						"left": 0
					});
			}
		}.bind(this);

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
		return (n + "").replace(/[\s]/g, '').split("").reverse().join("").replace(/(\d{3})/g, "$1 ").split("").reverse().join("").replace(/^ /, "");
	};

	MSweb.prototype.validateEmail = function (email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	};

	/**
	 * Получение случайного целого числа
	 * @param min
	 * @param max
	 * @returns {*}
	 */
	MSweb.prototype.rand = function (min, max) {
		max--;
		return Math.floor(Math.random() * (max - min)) + min;
	};


	/**
	 * Простой таймер обратного отсчёта
	 * @param duration - кол-во секунд до конца отсчёта
	 * @param container
	 * @returns {Console | void}
	 */
	MSweb.prototype.simpleTimer = function (duration, container) {
		container = container || document.querySelector('#ms-simple-timer');
		if (!duration || !container)
			return window.console && console.warn('SimpleTimer - empty required parameters');
		var timer = duration, minutes, seconds, hours;
		setInterval(function () {
			hours = parseInt(timer / 60 / 60, 10);
			minutes = parseInt((timer / 60) % 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			container.textContent = hours + ':' + minutes + ":" + seconds;

			if (--timer < 0) {
				timer = duration;
			}
		}, 1000);
	};

	/**
	 * Анимация случайных чисел в контейнере перед вставкой результата.
	 * @param target - куда вставляется результат
	 * @param opt_value - значение (опционально)
	 * если не передано значение, тогда надо передавать минимальное и максимальное:
	 * @param opt_min
	 * @param opt_max
	 * @param opt_timeout - время анимации. По умолчанию 1 секунда
	 * @param opt_speed - 'slow', 'medium', 'fast' скорость анимации по умолчанию medium
	 */
	MSweb.prototype.animateRandom = function (target, opt_value, opt_min, opt_max, opt_timeout, opt_speed) {
		var A = this;
		opt_min = opt_min || 0;
		opt_max = opt_max || 1000;
		opt_max += 2;
		opt_value = opt_value || this.rand(opt_min, opt_max);
		if (String(opt_value).length < String(opt_max).length)
			opt_max = opt_value;
		var tempVal = A.rand(opt_min, opt_max);
		opt_speed = opt_speed == 'slow' ? 100 : (opt_speed == 'medium' || !opt_speed ? 50 : '');

		if (opt_speed) {
			var interval = setInterval(function () {
				tempVal = A.rand(opt_min, opt_max);
			}, 50);
		}
		$({numberValue: opt_min}).animate({numberValue: opt_value}, {
			duration: opt_timeout || 1000,
			easing: "linear",
			step: function (val) {
				target.innerHTML = tempVal;
			},
			complete: function () {
				target.innerHTML = opt_value;
				if (opt_speed) {
					clearInterval(interval);
				}
				console.log(opt_value);
			}
		});
	};

	MSweb.prototype.MD5 = function (d) {
		function M(d) {
			for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
			return f;
		}

		function X(d) {
			for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
			for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
			return _;
		}

		function V(d) {
			for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
			return _;
		}

		function Y(d, _) {
			d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
			for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
				var h = m, t = f, g = r, e = i;
				f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
			}
			return Array(m, f, r, i);
		}

		function md5_cmn(d, _, m, f, r, i) {
			return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m);
		}

		function md5_ff(d, _, m, f, r, i, n) {
			return md5_cmn(_ & m | ~_ & f, d, _, r, i, n);
		}

		function md5_gg(d, _, m, f, r, i, n) {
			return md5_cmn(_ & f | m & ~f, d, _, r, i, n);
		}

		function md5_hh(d, _, m, f, r, i, n) {
			return md5_cmn(_ ^ m ^ f, d, _, r, i, n);
		}

		function md5_ii(d, _, m, f, r, i, n) {
			return md5_cmn(m ^ (_ | ~f), d, _, r, i, n);
		}

		function safe_add(d, _) {
			var m = (65535 & d) + (65535 & _);
			return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m;
		}

		function bit_rol(d, _) {
			return d << _ | d >>> 32 - _;
		}

		var result = M(V(Y(X(d), 8 * d.length)));
		return result.toLowerCase();
	};

	MSweb.prototype.getRandomId = function (opt_length, opt_chars) {
		opt_length = opt_length || 8;
		opt_chars = opt_chars || 'ABCDEFGHJKLMNPQRSTYVWXYZ23456789';
		var str = '';
		var ln = opt_chars.length;
		while (opt_length) {
			str += opt_chars[this.rand(0, ln)];
			opt_length--;
		}
		return str;
	};

	MSweb.prototype.htmlspecialchars = function (text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};

		return text.replace(/[&<>"']/g, function (m) {
			return map[m];
		});
	};

	MSweb.prototype.htmlspecialchars_decode = function (str) {
		if (typeof (str) == "string") {
			str = str.replace(/&amp;/g, '&'); /* must do &amp; first */
			str = str.replace(/&quot;/g, '"');
			str = str.replace(/&#039;/g, "'");
			str = str.replace(/&lt;/g, "<");
			str = str.replace(/&gt;/g, ">");
		}
		return str;
	};

	MSweb.prototype.blinkTitle = function (blinktitle) {
		if (this.isBlinking_)
			this.blinkTitleStop();
		document.title = blinktitle;
		setTimeout(function () {
			document.title = this.currTitle_;
		}.bind(this), 1000);
		this.titleInterval_ = setInterval(function () {
			document.title = blinktitle;
			setTimeout(function () {
				document.title = this.currTitle_;
			}.bind(this), 1000);
		}.bind(this), 2000);
		this.isBlinking_ = true;
	};

	MSweb.prototype.blinkTitleStop = function () {
		document.title = this.currTitle_;
		clearInterval(this.titleInterval_);
		this.isBlinking_ = false;
	};
	/**
	 * Перключение класса с интервалом
	 * @param el jQuery | DOMElement
	 * @param className {String}
	 * @param interval {opt msec}
	 */
	MSweb.prototype.setIntervalToggleClass = function (el, className, interval, clearOnHover) {
		el = el instanceof jQuery ? el : $(el);
		clearOnHover = clearOnHover || true;

		if (!el[0].mswebIntervalToggleClass) {
			el[0].mswebIntervalToggleClass = {};
		}
		if (el[0].mswebIntervalToggleClass[className])
			return;
		el[0].mswebIntervalToggleClass[className] = className;
		interval = interval || 1000;

		var interval = setInterval(function () {
			el.toggleClass(className);
		}, interval);
		if (clearOnHover)
			el.on('mouseover click contextmenu focus', function () {
				el.removeClass(className);
				clearInterval(interval);
			});
	};

	/**
	 * Поиск в объекте содержащем объекты по значению ключа в них.
	 * например для получения из объекта: {
	 *  2: {option_name: "Цель кредита", id: "2", option_type: "select", status: "1", option_values: Array(17)}
			9: {
				option_name: "Занятость"
				id: "9"
				option_type: "select"
				status: "1"
				option_values: (5) [{…}, {…}, {…}, {…}, {…}]
			}
	 * }
	 * дочернего объекта с option_name = "Занятость"
	 * @param obj - объект для поиска
	 * @param key - ключ, например 'option_name'
	 * @param val - значение искомого ключа, например "Занятость"
	 */
	MSweb.prototype.findByKey = function (obj, key, val) {
		if (!obj.length) {
			for (var i in obj) {
				if (obj[i][key] == val)
					return obj[i];
			}
		}
	};

	MSweb.prototype.createCaretPlacer = function (atStart) {
		return function (el) {
			el.focus();
			if (typeof window.getSelection != "undefined"
				&& typeof document.createRange != "undefined") {
				var range = document.createRange();
				range.selectNodeContents(el);
				range.collapse(atStart);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (typeof document.body.createTextRange != "undefined") {
				var textRange = document.body.createTextRange();
				textRange.moveToElementText(el);
				textRange.collapse(atStart);
				textRange.select();
			}
		};
	}

	MSweb.prototype.setCursorInEnd = function (el) {
		let [r, s] = [document.createRange(), window.getSelection()];
		r.selectNodeContents(el);
		r.collapse(false);
		s.removeAllRanges();
		s.addRange(r);
	};


	if (window.msweb)
		msweb = Object.assign(new MSweb(), msweb);
	else
		msweb = new MSweb();

	MSweb.prototype.placeCaretAtStart = msweb.createCaretPlacer(true);
	MSweb.prototype.placeCaretAtEnd = msweb.createCaretPlacer(false);

})(jQuery);