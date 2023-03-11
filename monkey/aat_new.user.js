// ==UserScript==
// @name        at-pdf new
// @version     1.0
// @description
// @downloadURL https://somel-web.github.io/monkey/aat_new.user.js
// @updateURL   https://somel-web.github.io/monkey/aat_new.user.js
// @match       https://ext.somel.ovh/aat/*
// @match       https://espacepro.ameli.fr/aat/*
// @match       https://espacepro.ameli.fr/atmp/*

// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2


// ==/UserScript==

var a = document.createElement('iframe')
a.src = "https://www.h24scm.fr/scm/mcsosp/amelipro/"
a.id = "dest"
a.style = "visibility:hidden;"
a.onload = () => {
	var mes = {}
	mes.type = "width"
	mes.data = window.innerWidth
	document.getElementById("dest").contentWindow.postMessage(mes, '*')
}
document.querySelector('body').prepend(a)

window.onmessage = (event) => {
	//console.log(event.data);
	switch (event.data.action) {
		case 'style':
			a.style[event.data.style.attr] = event.data.style.value
			break;
		case 'style_G':
			a.style = event.data.style
			break;
	}
}

window.onresize = (event) => {
	var mes = {}
	mes.type = "width"
	mes.data = window.innerWidth
	document.getElementById("dest").contentWindow.postMessage(mes, '*')
}

var origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
	this.addEventListener('load', function () {
		//console.log(this.responseURL);
		if (this.responseType == "arraybuffer") {
			//console.log(this.response);
			var mes = {}
			mes.type = "arraybuffer"
			mes.data = this.response
			document.getElementById("dest").contentWindow.postMessage(mes, '*');
		}
	});
	origOpen.apply(this, arguments);
};

// attendre le chargment de toute la page avc un mutation obserever
const disconnect = VM.observe(document.body, () => {
	const num_am_ps = document.getElementById("num_am_ps");
	if (num_am_ps) {
		var mes = {}
		mes.type = "num_am_ps"
		mes.data = num_am_ps.innerText
		document.getElementById("dest").contentWindow.postMessage(mes, '*')
		return true
	}

});
