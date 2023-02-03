// ==UserScript==
// @name        quotidmed generaliste
// @downloadURL https://ext.somel.ovh/aat/aat-pdf.js
// @updateURL   https://ext.somel.ovh/aat/aat-pdf.js
// @match       https://www.lequotidiendumedecin.fr/*
// @match 			https://www.legeneraliste.fr/*
// @grant       none
// @version     1.0
// @author      -
// @description 03/02/2023 05:30:19
// ==/UserScript==

if (document.getElementsByClassName("listing-body-article")[0]){
	var t = document.getElementsByClassName("listing-body-article")[0].innerHTML;
	var a = document.createElement('iframe');
a.width = "600";
a.height = "600";

	a.style.position = "absolute";
	a.style.top = "40px";
	a.style.backgroundColor = "white";
	a.style.zIndex = "100";

document.querySelector('body').appendChild(a);
	   var doc = a.contentWindow.document;
   doc.open();
   doc.write(t);
   doc.close();

}
