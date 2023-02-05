// ==UserScript==
// @name        certdc
// @downloadURL https://somel-web.github.io/monkey/certdc.user.js
// @updateURL   https://somel-web.github.io/monkey/certdc.user.js
// @match       https://certdc.inserm.fr/certdc-front/#/certificat*
// @grant       none
// @version     1.0
// @author      -
// @description 03/02/2023 05:53:10
// ==/UserScript==

document.querySelector("#certdc-app > section > cdc-menu-front").remove();
document.querySelector("#certdc-app > section > div > cdc-certificat > div > div.helpbar-container").remove();
document.querySelector("#certdc-app > cdc-footer").remove();
document.querySelector("#certdc-app > section > div > cdc-certificat > div > div.width").classList.remove("width");
document.querySelector("#certdc-app > cdc-navbar").remove();
const demoClasses = document.querySelectorAll('.p-component');
demoClasses.forEach(element =>{
    element.style.fontSize = '12px'
	});
const demoClassesa = document.querySelectorAll('.p-accordion-header-link');
demoClassesa.forEach(element =>{
    element.style.fontSize = '12px'
});
const demoClassesr = document.querySelectorAll('.flex-row');
demoClassesr.forEach(element =>{
    element.style.display = 'block'
});
const demoClassesz = document.querySelectorAll('.flex-col');
demoClassesz.forEach(element =>{
    element.style.marginLeft = '1px'
});
var ss = document.styleSheets[0];
ss.insertRule('section {background-image: linear-gradient(355deg, #dee2e6, #958b62)!important;}');