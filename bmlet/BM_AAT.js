(function () {
    const nom_ps = document.getElementById("nom_prenom_ps").innerText;
    var id_ps = "";
    let mxhr = new XMLHttpRequest();
    mxhr.open('GET', "https://www.h24scm.fr/scm/mcsos/server/espacepro/infomed.php?med=" + nom_ps, false);
    mxhr.send();
    id_ps = mxhr.response;
    console.log(id_ps);
    var loc = document.location.pathname;
    if ((id_ps != "") && (loc == "/aat/" || loc == "/atmp/")) {
        loc = loc.replaceAll('/', '');
        const node_prenom = document.getElementById("prenom");
        const node_nom_atmp = document.getElementsByClassName("p2-nom-patient")[0];
        if (node_prenom) {
            nom_patient = (node_prenom.innerText);
        }
        if (node_nom_atmp) {
            nom_patient = (node_nom_atmp.innerText);
        }
        var ss = document.createElement('link');
        ss.rel = 'stylesheet';
        ss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css';
        document.getElementsByTagName('head')[0].appendChild(ss);
        var d = document.createElement('div');
        d.classList.add("card", "fixed-top");
        d.style = "background-color:rgb(179 69 198 / 50%);";
        d.innerHTML = "<div class='card-body'><p id='sos_message' class='card-text'>" + nom_ps + " en attente de document pour " + nom_patient + "</p></div>";
        document.querySelector('body').prepend(d);
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('load', function () {
                console.log(this.responseURL);
                if (this.responseType == "arraybuffer") {
                    document.getElementById("sos_message").innerHTML = "pdf recu";
                    fetch("https://www.h24scm.fr/scm/mcsos/server/amelipdfab.php", {
                        method: "POST",
                        body: this.response
                    }).then(function (response) {
                        return response.text();
                    }).then(function (resp) {
                        console.log(resp);
                        document.getElementById("sos_message").innerHTML = resp;
                    });
                }
            });
            origOpen.apply(this, arguments);
        }
    }
})();