// ==UserScript==
// @name        quotidmed generaliste
// @downloadURL https://somel-web.github.io/monkey/pressemed.user.js
// @updateURL   https://somel-web.github.io/monkey/pressemed.user.js
// @match       https://www.lequotidiendumedecin.fr/*
// @match 		https://www.legeneraliste.fr/*
// @grant       none
// @version     1.2
// @author      -
// @description 03/02/2023 05:30:19
// ==/UserScript==

if (document.getElementsByClassName("listing-body-article")[0]){
	var t = document.getElementsByClassName("listing-body-article")[0].innerHTML;
var link = document.createElement('link');
    link.rel="stylesheet";
    link.href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css";

document.body.appendChild(link);
var script = document.createElement('script');
script.src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" ;
document.body.appendChild(script);

var html =`
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
  voir article
</button>

<div style="width:100%" class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">article</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    <div id="article">
      Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
    </div>
  </div>
</div>`;

var div = document.createElement("div");
div.classList.add("sticky-bottom");

//div.style.position = "absolute";
	div.style.top = "10px";
	div.style.backgroundColor = "white";
	div.style.zIndex = "10000";
div.innerHTML = html;
document.body.appendChild(div);
document.getElementById("article").innerHTML = t;
}

