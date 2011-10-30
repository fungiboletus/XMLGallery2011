var clicOnTag = function(e) {

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

	
	for (var i = 0; i < l_ul; ++i) {
		gallery.appendChild(ul_arr[i]);
	}

	var obj = ScrollBar_instances['gallery'];
	obj.scrollTop = 0;
	obj.scroll();
	return false;
};

var n_file = -1;
var ancienne_image = -1;

var clicOnFile = function (e) {
	var n;
	for (n = e.target; n.nodeName != 'A'; n = n.parentNode) {
		if (n.nodeName == 'UL') {
			n = null;
			break;
		}
	}

	if (n!= undefined) {

		var mimetype = n.getElementsByClassName('icon')[0].alt;
	
		if (mimetype.indexOf('/') == -1 || mimetype.indexOf('image/') == 0) {
		
			byId('mainview_iframe').style.display = 'none';
			byId('mainview_audio').style.display = 'none';
			byId('mainview_video').style.display = 'none';
			byId('mainview_image_1').style.display = 'block';
			byId('mainview_image_2').style.display = 'block';

			var li = n.parentNode;

			var ancien_n_file = n_file;
			n_file = parseInt(li.id.slice(5));

			if (ancien_n_file == n_file) { return false; }

			window.location.hash = '#'+n_file;

			var image_a = byId('mainview_image_'+ancienne_image);

			var nouvelle_image = ancienne_image == 1 ? 2 : 1;
			ancienne_image = nouvelle_image;
			
			var image_n = byId('mainview_image_'+nouvelle_image);

			image_n.style.backgroundImage = 'url("'+n.href.replace('"', '\\"')+'")';

			if (image_a != null) image_a.className = "mainview_image";
			image_n.className = "mainview_image affiche";
		

			var ul = li.parentNode.getElementsByClassName('file');
			var l_ul = ul.length;
			for (var i = 0; i < l_ul; ++i) {
				ul[i].className = ul[i].className.replace(/selected_file/, '');
			}
			
			li.className += ' selected_file ';
	
		}

		else if (mimetype.indexOf('audio/') == 0) {
			byId('mainview_iframe').style.display = 'none';
			byId('mainview_audio').style.display = 'block';
			byId('mainview_video').style.display = 'none';
			byId('mainview_image_1').style.display = 'none';
			byId('mainview_image_2').style.display = 'none';
	
			var source = byId('mainview_audio').getElementsByTagName('source')[0];
			source.src = n.href;

			source.type = mimetype;
		}		
		else if (mimetype.indexOf('video/') == 0) {
			byId('mainview_iframe').style.display = 'none';
			byId('mainview_audio').style.display = 'none';
			byId('mainview_video').style.display = 'block';
			byId('mainview_image_1').style.display = 'none';
			byId('mainview_image_2').style.display = 'none';
	
			var source = byId('mainview_video').getElementsByTagName('source')[0];
			source.src = n.href;

			source.type = mimetype;
				
		} else {
			byId('mainview_iframe').style.display = 'block';
			byId('mainview_audio').style.display = 'none';
			byId('mainview_video').style.display = 'none';
			byId('mainview_image_1').style.display = 'none';
			byId('mainview_image_2').style.display = 'none';
		
			byId('mainview_iframe').src = n.href;
		}

	}
	return false;
};

var mClicOnImage = 0;

var clicOnImage = function(e) {
	var i = e.target;

	var modes = ['cover', 'contain', '100% 100%', 'auto auto'];

	if (++mClicOnImage == modes.length) mClicOnImage = 0;

	var mode = modes[mClicOnImage];

	var  images = document.getElementsByClassName('mainview_image');
	images[0].style.backgroundSize = mode;
	images[1].style.backgroundSize = mode;
};

var simulerClicOnFile = function (id) {
	var e = new Object();
	e.target = byId('file_'+id).getElementsByTagName('a')[0];

	var obj = ScrollBar_instances['gallery'];
	obj.scrollTop = (e.target.offsetTop > 30) ? e.target.offsetTop-30 : 0;
	obj.scroll();
	clicOnFile(e);
};

var file_id = 1;

var clicOnPrevious = function () {
	if (--file_id == 0) file_id = document.getElementsByClassName('file').length;

	simulerClicOnFile(file_id);
};

var clicOnNext = function () {
	if (file_id++ == document.getElementsByClassName('file').length) file_id = 1;

	simulerClicOnFile(file_id);
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

	submitSearch();
	
	var  images = document.getElementsByClassName('mainview_image');
	images[0].onclick = clicOnImage;
	images[1].onclick = clicOnImage;

	file_id = window.location.hash.length > 1 ? window.location.hash.slice(1) : 1;

	simulerClicOnFile(file_id);

	byId('button_previous').onclick = clicOnPrevious;
	byId('button_next').onclick = clicOnNext;

	// Desactivate this function if it called two times
	// the function can be called two time for callback with browsers
	// that don't support html5 DomContentLoaded
	main = noNo;
	
};

addEventFunction('DOMContentLoaded', window, function() { main() });
addEventFunction('load', window, function() { main() });
