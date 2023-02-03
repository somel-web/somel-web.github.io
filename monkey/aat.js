// ==UserScript==
// @name        AAT-Mail
// @version     1.5
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

//https://espacepro.ameli.fr/aat/*//

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
  
  //https://github.com/AugmentedWeb/UserGui/
  //https://beautifytools.com/html-form-builder.php
  const Gui = new UserGui;
  Gui.settings.window.title = "Mail Au Patient"; // set window title
  Gui.settings.window.centered = true; // GUI starts at the center of the screen
  Gui.settings.gui.internal.darkCloseButton = true; // Changes the close button to dark theme
  Gui.addPage("Some tab name", `
  <div class="rendered-form">
      <div class="formbuilder-textarea form-group field-textarea-message">
          <label for="textarea-message" class="formbuilder-textarea-label">Message</label>
          <textarea type="textarea" class="form-control" name="textarea-message" access="false" rows="5" id="textarea-message"></textarea>
      </div>
  
      <div class="formbuilder-text form-group field-text-nom_patient">
          <label for="text-nom_patient" class="formbuilder-text-label">Nom Patient</label>
          <input type="text" class="form-control" name="text-nom_patient" access="false" id="text-nom_patient">
      </div>
      <div class="formbuilder-text form-group field-text-mail_patient">
          <label for="text-mail_patient" class="formbuilder-text-label">mail patient</label>
          <input type="email" class="form-control" name="text-mail_patient" access="false" id="text-mail_patient" required="required" aria-required="true">
      </div>
      <div class="formbuilder-button form-group field-button-mail">
          <button type="button" class="btn-success btn" name="button-mail" access="false" style="success" id="button-mail">Envoyer par mail au patient</button>
      </div>
      <div class="formbuilder-button form-group field-button-mail_amoi">
          <button type="button" class="btn-primary btn" name="button-mail_amoi" access="false" style="primary" id="button-mail_amoi">envoyer par mail a MOI</button>
      </div>
  </div>
  `);
  
  function mail(pdf_aat, mail_adress, nom_patient, id_medecin, message) {
    var URL = `https://www.h24scm.fr/scm/mcsos/server/amelipdf.php?mail_adress=${mail_adress}&nom_patient=${nom_patient}&id_medecin=${id_medecin}&message=${message}`;
    URL = encodeURI(URL);
    console.log(URL);
  
    GM_xmlhttpRequest({
      method: "POST",
      url: URL,
      data: pdf_aat,
      onload: function (response) {
        console.log(response.responseText);
        Gui.close();
      }
  
    });
  
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
  }
  
  //hook de la page pour intercpter les evenemets xhr
  function open(method, url) {
    console.log(url);
    // (url == "/aat-api/pdf/cerfa/" || url == "/aat-api/pdf/cerfa" || url.indexOf('/aat-api/pdf/recapitulatif?idAAT') >-1 || url== '/aat-api/pdf/volet/employeur')
  
    if (url == "/aat-api/pdf/cerfa/"
      || url == "/aat-api/pdf/cerfa"
      || url.indexOf('/aat-api/pdf/recapitulatif?idAAT') > -1
      || url == '/aat-api/pdf/recapitulatif/'
      || url == '/aat-api/pdf/volet/employeur'
      || url == '/aat-api/pdf/volet/employeur/'
  
    ) {
      message = messageFromUrl(url);
      this.addEventListener('load', () => {
  
        pdf = arrayBufferToBase64(this.response);
        //console.log(pdf);
        // GM_setValue("testo",arrayBufferToBase64(this.response));
        Gui.open(() => {
          Gui.setValue("textarea-message", message);
          Gui.setValue("text-nom_patient", nom_patient);
          Gui.setValue("text-mail_patient", config_mcsos.fiche_sobek.mail_patient);
  
          Gui.event("button-mail", "click", () => {
            message = Gui.getValue("textarea-message");
            mail_adress = Gui.getValue("text-mail_patient");
            nom_patient = Gui.getValue("text-nom_patient");
            mail(pdf, mail_adress, nom_patient, config_mcsos.mcsos_params.id_medecin, message);
          });
  
          Gui.event("button-mail_amoi", "click", () => {
            message = Gui.getValue("textarea-message");
            mail_adress = config_mcsos.mcsos_params.email_medecin;
            nom_patient = Gui.getValue("text-nom_patient");
            mail(pdf, mail_adress, nom_patient, config_mcsos.mcsos_params.id_medecin, message);
          });
  
        });
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
    //document.getElementById("infos").innerText
    if (node_prenom) {
      nom_patient = (node_prenom.innerText);
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
  