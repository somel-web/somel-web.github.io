// ==UserScript==
// @name        AAt-pdf
// @version     1.10
// @downloadURL https://somel-web.github.io/monkey/aat.js
// @updateURL   https://somel-web.github.io/monkey/aat.js
// @description
// @match       https://ext.somel.ovh/aat/*
// @match       https://espacepro.ameli.fr/aat/*
// @require     https://unpkg.com/gm-compat@1.1.0
// @require     https://github.com/AugmentedWeb/UserGui/raw/Release-1.0/usergui.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest

// ==/UserScript==

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
function isValidEmailAddress(emailAddress) {
  var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
  return pattern.test(emailAddress);
};

//https://github.com/AugmentedWeb/UserGui/
//https://beautifytools.com/html-form-builder.php

const Gui = new UserGui;

const imgmail = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
</svg>`;

var htmlpage = `
<div class="rendered-form">

    <div class="formbuilder-text form-group field-text-mail_patient">
        <input type="email" class="form-control" name="text-mail_patient" access="false" placeholder="mail patient" id="text-mail_patient" required="required" aria-required="true">
    </div>

    <div class="form-group field-button-mail">
        <button type="button" class="btn-success btn w-100" name="button-mail" access="false" style="success" id="button-mail">Envoyer par mail au patient</button>
    </div>
		<div class=" form-group field-button-mail_amoi">
        <button type="button" class="btn-primary btn w-100" name="button-mail_amoi" access="false" style="primary" id="button-mail_amoi">envoyer par mail a MOI</button>
    </div>
	</div>

`;
//Gui.settings.window.centered = false;
Gui.settings.window.title = "Envoyer au patient"; // set window title
Gui.settings.window.centered = true; // GUI starts at the center of the screen
Gui.settings.gui.internal.darkCloseButton = true; // Changes the close button to dark theme
Gui.addPage("mail", htmlpage);




function mail(pdf_aat, mail_adress, nom_patient, id_medecin, message) {
  var URL = `https://www.h24scm.fr/scm/mcsos/server/amelipdf.php?mail_adress=${mail_adress}&nom_patient=${nom_patient}&id_medecin=${id_medecin}&message=${message}`;
  URL = encodeURI(URL);
  //console.log(mail_adress);
  if (!isValidEmailAddress(mail_adress)) { alert("mail invalide") }
  else {
    Gui.close();
    GM_xmlhttpRequest({
      method: "POST",
      url: URL,
      data: pdf_aat,
      onload: function (response) {
        console.log(response.responseText);

      }

    });

  }

}

function totop() {
  var list = document.getElementsByTagName("iframe");

  for (let item of list) {
    item.style.top = "0px";
  }
}

//GM_setValue("test","rer");

const xhrProto = GMCompat.unsafeWindow.XMLHttpRequest.prototype
const oldOpen = xhrProto.open
var pdf;
var config_mcsos;
var nom_patient;
var message;


function messageFromUrl(url) {
  if (url == "/aat-api/pdf/cerfa/" || url == "/aat-api/pdf/cerfa") { return `Votre arret de travail a imprimer \nle volet 1 et 2 sont envoyer a votre caisse\nle volet 3 est a envoyer a votre employeur` }
  if (url.indexOf('/aat-api/pdf/recapitulatif?idAAT') > -1 || url == '/aat-api/pdf/recapitulatif/') { return `L'arret de travail a été transmis a votre caisse maladie\nvoici Votre justificatif a envoyer a votre employeur` }
  if (url == '/aat-api/pdf/volet/employeur' || url == '/aat-api/pdf/volet/employeur/') { return `L'arret de travail a été transmis a votre caisse maladie\nvoici Votre justificatif a envoyer a votre employeur` }
  if (url == '/atmp-api/pdf/cerfa/atmp') { return `votre declaration d'accident du travail` }
  if (url == '/atmp-api/pdf/exemplaire/assure') { return `votre avis d'accident du travail` }
  if (url.indexOf('/atmp-api/pdf/recap/ps?idATMP') > -1) { return `avis d'accident du travail` }
}

//hook de la page pour intercpter les evenemets xhr
function open(method, url) {

  console.log(url);

  if (url == "/aat-api/pdf/cerfa/"
    || url == "/aat-api/pdf/cerfa"
    || url.indexOf('/aat-api/pdf/recapitulatif?idAAT') > -1
    || url == '/aat-api/pdf/recapitulatif/'
    || url == '/aat-api/pdf/volet/employeur'
    || url == '/aat-api/pdf/volet/employeur/'
    || url == '/atmp-api/pdf/cerfa/atmp'
    || url == '/atmp-api/pdf/exemplaire/assure'
    || url.indexOf('/atmp-api/pdf/recap/ps?idATMP') > -1

  ) {
    message = messageFromUrl(url);
    this.addEventListener('load', () => {


      pdf = arrayBufferToBase64(this.response);
      //console.log(pdf);
      // GM_setValue("testo",arrayBufferToBase64(this.response));
      if (config_mcsos.mcsos_params) {
        Gui.open(() => {
          Gui.window.document.getElementById("button-mail_amoi").innerHTML = `${imgmail}  ${config_mcsos.mcsos_params.email_medecin}`;
          //Gui.setValue("text-nom_patient", nom_patient);
          Gui.setValue("text-mail_patient", config_mcsos.fiche_sobek.mail_patient);

          Gui.event("button-mail", "click", () => {
            mail_adress = Gui.getValue("text-mail_patient");
            //nom_patient = Gui.getValue("text-nom_patient");
            mail(pdf, mail_adress, nom_patient, config_mcsos.mcsos_params.id_medecin, message);

          });

          Gui.event("button-mail_amoi", "click", () => {
            mail_adress = config_mcsos.mcsos_params.email_medecin;
            mail(pdf, mail_adress, nom_patient, config_mcsos.mcsos_params.id_medecin, message);
          });
        });
      }
      else {

        Gui.open(() => {
          Gui.window.document.getElementById("button-mail_amoi").innerText = "McSos ??";
          Gui.setValue("text-mail_patient", "");
          Gui.disable("button-mail_amoi");
          Gui.event("button-mail", "click", () => {
            mail_adress = Gui.getValue("text-mail_patient");
            mail(pdf, mail_adress, nom_patient, "O", message);
          });

        });
      }
    })
  }
  GMCompat.apply(this, oldOpen, arguments)
}
xhrProto.open = GMCompat.export(open)


// attendre le chargment de toute la page avc un mutation obserever
//pour rcupere le nom du patient (et du medecin)
const disconnect = VM.observe(document.body, () => {
  const node_prenom = document.getElementById("prenom"); // prenom = nom prenom patient !!
  const nom_prenom_ps = document.getElementById("nom_prenom_ps");
  const node_nom_atmp = document.getElementsByClassName("p2-nom-patient")[0];
  //document.getElementById("infos").innerText
  if (node_prenom) {
    nom_patient = (node_prenom.innerText);
  }
  if (node_nom_atmp) {
    nom_patient = (node_nom_atmp.innerText);
  }
  if (node_prenom || node_nom_atmp) {
    // disconnect observer
    return true;

  }
});

//injecter un iframe mcsos qui permet de recuperer les infos du localstorage
//par le biais de message inter window
window.addEventListener("message", receiveMessage, false);
function receiveMessage(event) {
  config_mcsos = event.data;

  console.log(config_mcsos);
  // config_mcsos.fiche_sobek.mail_patient;
}

var a = document.createElement('iframe');
a.src = "https://www.h24scm.fr/scm/mcsos/iframe.html"; //add your iframe path here
a.width = "0";
a.height = "0";
document.querySelector('body').appendChild(a)
