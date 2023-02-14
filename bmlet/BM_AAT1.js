(function() {
    const loc = document.location.pathname.replaceAll('/', '');
    var card = "";
    if (! (loc == "aat" || loc == "atmp")) {
        console.log("it'not the good url");
        return
    }
    var alias_med = localStorage.getItem('alias_med');
    if ( ! alias_med) {alias_med = window.prompt("votre login Sobek (ABCD)","");}
    if (! alias_med ){return} else 
    {
        const node_prenom = document.getElementById("prenom");
        const node_nom_atmp = document.getElementsByClassName("p2-nom-patient")[0];
        if (node_prenom) {
            nom_patient = (node_prenom.innerText);
        }
        if (node_nom_atmp) {
            nom_patient = (node_nom_atmp.innerText);
        }
        var q = "?alias_med="+ alias_med +"&loc=" + loc + "&nom_patient=" + nom_patient
        let mxhr = new XMLHttpRequest();
        mxhr.open('GET', "https://www.h24scm.fr/scm/mcsos/server/espacepro/htmlinsert.php" + q, false);
        mxhr.send();
        card = mxhr.response;
        if (card==""){
            localStorage.removeItem('alias_med');
            return;
            
        } else
        {
            localStorage.setItem('alias_med', alias_med);
            var ss = document.createElement('link');
            ss.rel = 'stylesheet';
            ss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css';
            document.getElementsByTagName('head')[0].appendChild(ss);
            document.querySelector('body').insertAdjacentHTML('afterbegin', card);
            document.getElementById("bt").addEventListener('click', function() {
                localStorage.removeItem('alias_med');
                location.reload();
            });
            var origOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                console.log(this.responseURL);
                if (this.responseType == "arraybuffer") {
                    document.getElementById("sos_message").innerHTML = "pdf recu";
                    const d = document.getElementById("card");
                    var q = "?id_ps=" + d.getAttribute('id_ps'); 
                    q += "&mail_patient=" + d.getAttribute('mail_patient');
                    q += "&loc=" + d.getAttribute('loc');
                    console.log(q);
                    fetch("https://www.h24scm.fr/scm/mcsos/server/espacepro/amelipdfab.php" + q, {
                        method: "POST",
                        body: this.response
                    }).then(function(response) {
                        return response.text();
                    }).then(function(resp) {
                        console.log(resp);
                        document.getElementById("sos_message").innerHTML = resp;
                    });
                }
            });
            origOpen.apply(this, arguments);
        }
        }
    }
})();