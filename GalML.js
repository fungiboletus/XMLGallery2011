var ScrollBar_instances = null;

var ScrollBar = function(container, id) {

	var firstScrollBar = ScrollBar_instances == null;

	if (firstScrollBar) {
		ScrollBar_instances = [];
	}

	ScrollBar_instances[container.id] = this;

	this.container = container;

	var scrollBar = newDom('div');
	this.scrollBar = scrollBar;
	
	scrollBar.className = 'scrollbar';
	scrollBar.id = id;

	var buttonMore = newDom('div');
	var buttonLess = newDom('div');
	this.buttonMore = buttonMore;
	this.buttonLess = buttonLess;

	buttonMore.className = 'buttonMore';
	buttonLess.className = 'buttonLess';
	buttonMore.id = 'buttonMore_'+container.id;
	buttonLess.id = 'buttonLess_'+container.id;

	buttonMore.appendChild(document.createTextNode('+'));
	buttonLess.appendChild(document.createTextNode('-'));

	buttonMore.onclick = this.clickButtonMore;
	buttonMore.onselectstart = noNo;
	buttonLess.onclick = this.clickButtonLess;
	buttonLess.onselectstart = noNo;

	var body = byId('body');

	body.appendChild(buttonMore);
	body.appendChild(buttonLess);


	body.appendChild(scrollBar);

	this.scrollTop = 0;

	try {
	if (sessionStorage) {
		var cache = sessionStorage[this.container.id+'_scroll'];

		if (cache > 0) {
			this.scrollTop = parseInt(cache);
		}
	}} catch(e) {}

	this.setScrollBarHeight();
	
	if (this.container.addEventListener){
		// Pour Firefox	
		this.container.addEventListener('MozMousePixelScroll', this.mousewheel, false); 
		this.container.addEventListener('mousewheel', this.mousewheel, false); 

		if (firstScrollBar) {
			window.addEventListener('resize',this.setScrollBarHeight,false);
		}

	// Pour ie…
	} else if (this.container.attachEvent) {
		this.container.attachEvent('onmousewheel', this.mousewheel); 
		
		if (firstScrollBar) {
			window.attachEvent('onresize', this.setScrollBarHeight); 
		}
	}
};

ScrollBar.prototype.setScrollBarHeight = function() {

	for (var key in ScrollBar_instances) {
		var obj = ScrollBar_instances[key];

		if (obj.container.offsetHeight >= obj.container.scrollHeight) {
			obj.scrollBar.style.display = 'none';
			obj.scrollBarHeight = null;

			obj.buttonMore.style.display = 'none';
			obj.buttonLess.style.display = 'none';
		} else {

			var h = Math.round((obj.container.offsetHeight * obj.container.offsetHeight) / obj.container.scrollHeight);

			obj.scrollBar.style.height = h+'px';

			// update position if necesarry
			if (h != obj.scrollBarHeight) {
				if (!obj.scrollBarHeight) {
					obj.scrollBar.style.display = 'block';
					obj.buttonMore.style.display = 'block';
					obj.buttonLess.style.display = 'block';
				}

				var rapport = h/obj.scrollBarHeight;
				var newPos = Math.round(obj.scrollBar.offsetTop*rapport);
				obj.scrollBar.style.top = newPos+'px';
				
				obj.buttonMore.style.top = (obj.container.offsetHeight - obj.buttonMore.offsetHeight)+'px';
				obj.buttonLess.style.top = obj.container.offsetTop+'px';

				obj.buttonMore.style.left = obj.container.offsetLeft+obj.container.offsetWidth-obj.buttonMore.offsetWidth+'px';
				obj.buttonLess.style.left = obj.buttonMore.style.left;
			}
			
			obj.scrollBarHeight = h;

			obj.scroll();
		}
	}
}

ScrollBar.prototype.scroll = function() {

	// If scroll event when the scroll is useless
	if (this.scrollBarHeight == null) return;

	var max_scroll = this.container.scrollHeight-this.container.offsetHeight;
	var margin = 5;

	var hideMore = false;
	var hideLess = false;

	if (this.scrollTop <= margin) {
		hideLess = true;
		this.scrollTop = 0;
	} else if (this.scrollTop > (max_scroll - margin)) {
		hideMore = true;
		this.scrollTop = max_scroll;
	}
	
	try {
	if (sessionStorage) {
		sessionStorage[this.container.id+'_scroll'] = this.scrollTop;
	}
	} catch(e) {}

	this.buttonMore.style.display = hideMore ? 'none' : 'block';
	this.buttonLess.style.display = hideLess ? 'none' : 'block';

	this.container.scrollTop = this.scrollTop;

	var h = this.container.offsetHeight - this.scrollBar.offsetHeight;
	var r = this.scrollTop/max_scroll;
	var t = Math.round(r*h);

	this.scrollBar.style.top = t+'px';
}

ScrollBar.prototype.mousewheel = function(e) {

	// IE et les autres :-)
	var dom = e.target ? e.target : e.srcElement;
	var obj;

	while (dom != null) {
		if (dom.id && ScrollBar_instances[dom.id]) {
			obj = ScrollBar_instances[dom.id];
			break;
		}
		dom = dom.parentNode;
	}

	obj.scrollTop -= e.wheelDeltaY ? e.wheelDeltaY : -e.detail;

	var max_scroll = obj.container.scrollHeight-obj.container.offsetHeight;
	
	if (obj.scrollTop < 0) {
		obj.scrollTop = 0;
	} else if (obj.scrollTop > max_scroll) {
		obj.scrollTop = max_scroll;
	}

	obj.scroll();

}

ScrollBar.prototype.clickButtonMore = function(e) {
	var obj = ScrollBar_instances[this.id.slice(11)];
	obj.scrollTop += obj.container.offsetHeight - 100;
	obj.scroll();
}

ScrollBar.prototype.clickButtonLess = function(e) {
	var obj = ScrollBar_instances[this.id.slice(11)];
	obj.scrollTop -= obj.container.offsetHeight - 100;
	obj.scroll();
}


var clicOnTag = function(e) {

	log(e);
	var tag = e.target.firstChild.data;

	if (tag.indexOf(" ") != -1) {
		tag = '"'+tag+'"';
	}

	var input = byId('input_search'); 
	var key = input.value;

	if (key.indexOf(tag) == -1) {
		input.value = trim(key + ' ' + tag);
	} else {
		input.value = trim(key.replace(tag, ''));
	}

	return submitSearch();
};

var submitSearch = function() {

	var input = byId('input_search'); 
	var keys = input.value.toLowerCase().match(/\w+|"[^"]+"/g);
	var l_keys = keys ? keys.length : 0;
	for (var i = 0; i < l_keys; ++i) {
		keys[i] = keys[i].replace(/^"(.+)"$/g,'$1');
	}

	log(keys);

	var gallery = byId('gallery');
	var ul = gallery.getElementsByClassName('file');
	var l_ul = ul.length;
	var ul_arr = [];

	for (var i = 0; i < l_ul; ++i) {
		ul_arr.push(ul[i]);
		var print = 0;

		for (var ii = 0; ii < l_keys; ++ii) {
			var key = keys[ii];

			if (key.length > 0 && ul[i].innerHTML.toLowerCase().indexOf(key) != -1) {
				++print;
			}
		}

		if (print == l_keys) {
			ul[i].className = ul[i].className.replace('hidden', '');
		} else if (ul[i].className.indexOf('hidden') == -1) {
			ul[i].className += ' hidden ';
		}
	}

	ul_arr.sort(function(a, b) {
		var aa = a.className.indexOf('hidden');
		var bb = b.className.indexOf('hidden');

		var aaa = parseInt(a.id.slice(5));
		var bbb = parseInt(b.id.slice(5));

		return aa == bb ? (aaa > bbb ? 1 : -1) : (aa > bb ? 1 : -1);
	});

	
		log("canard");
	for (var i = 0; i < l_ul; ++i) {
		log(ul_arr[i]);
		gallery.appendChild(ul_arr[i]);
	}

	var obj = ScrollBar_instances['gallery'];
	obj.scrollTop = 0;
	obj.scroll();
	return false;
};

var clicOnFile = function (e) {
	byId('view').src = e.target.href;
	return false;
};

var main = function() {
	new ScrollBar(document.getElementsByClassName('gallery')[0],
			'scrollbar_gallery');

	byId('input_search').onkeyup = function() {
		var width = this.value.length * 0.5;
		if (width < 20) width = 20;
		if (width > 62) width = 62;

		this.style.width = width+"em";
	};

	var  a = byId('gallery').getElementsByTagName('a');
	var  l_a = a.length;

	for (var i = 0; i < l_a; ++i) {
		a[i].onclick = clicOnFile;
	}


	var  tags = document.getElementsByClassName('tag');
	var  l_tags = tags.length;

	for (var i = 0; i < l_tags; ++i) {
		tags[i].onclick = clicOnTag;
	}

	byId('search').onsubmit = submitSearch;

	// Desactivate this function if it called two times
	// the function can be called two time for callback with browsers
	// that don't support html5 DomContentLoaded
	main = noNo;
	
	submitSearch();
};

addEventFunction('DOMContentLoaded', window, function() { main() });
addEventFunction('load', window, function() { main() });
