// ==UserScript==
// @name        AAT-MCSOS
// @version     1.1
// @description
// @match       https://espacepro.ameli.fr/aat/*
// @match       https://espacepro.ameli.fr/atmp/*

// ==/UserScript==


(function() {
    var a = document.createElement('iframe');
    a.id = "dest";
    a.src = "https://www.h24scm.fr/scm/mcsos/server/espacepro/iframe_msg_channel.html";
    a.style = "width:0; height:0 ";
    document.querySelector('body').append(a);

		var d = document.createElement('div');
		d.id = "signal";
	  d.style = "box-shadow: 2px 2px 1px #8a0;height: 25px; width: 25px; border-radius: 50%; display: inline-block; background-color:rgb(179 69 198 / 50%);position: fixed;z-index: 9000;top: 20px;left: 20px;";
    d.innerHTML = "";
    document.querySelector('body').prepend(d);

	var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            console.log(this.responseURL);
            if (this.responseType == "arraybuffer") {
                document.getElementById("dest").contentWindow.postMessage(this.response, '*');
            }
        });
        origOpen.apply(this, arguments);
    };
})();