/* Shop pullix — collegamento a Stripe.
 *
 * Come si attiva: creare i prodotti nel dashboard Stripe (anche in modalità
 * test), generare i Payment Link e incollarli qui sotto. Finché un link è
 * vuoto, il pulsante mostra l'avviso "shop in arrivo" con fallback WhatsApp.
 *
 * - x1 / scheda-*  → Payment Link del prodotto (https://buy.stripe.com/…)
 * - portal         → link login del Customer Portal (https://billing.stripe.com/p/login/…)
 * - referral       → per ora vuoto: il codice si richiede via WhatsApp;
 *                    in futuro può puntare a un form o a Rewardful.
 */
(function () {
  /* Link di TEST (buy.stripe.com/test_…): al go-live sostituire con i link live. */
  var LINKS = {
    'x1': 'https://buy.stripe.com/test_cNi00l0tZ9NR3m795uco000',
    'scheda-transformation': 'https://buy.stripe.com/test_cNieVf6Sn9NR9KvchGco001',
    'scheda-athlete': 'https://buy.stripe.com/test_28E3cx0tZ1hlf4P81qco002',
    'portal': 'https://billing.stripe.com/p/login/test_cNi00l0tZ9NR3m795uco000',
    'referral': ''
  };

  var WA = 'https://wa.me/393495134895?text=';
  var WA_MSG = {
    'default': 'Ciao! Vorrei informazioni sull’acquisto di pullix X1.',
    'referral': 'Ciao! Ho acquistato pullix e vorrei il mio codice referral.'
  };

  function showToast(kind) {
    var old = document.querySelector('.sh-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'sh-toast';
    t.setAttribute('role', 'status');
    var msg = kind === 'referral'
      ? '<strong>Programma referral in arrivo.</strong> Intanto scrivici su WhatsApp: ti riserviamo il codice appena parte.'
      : '<strong>Lo shop online apre a breve.</strong> Intanto puoi ordinare direttamente su WhatsApp: rispondiamo entro 24 ore.';
    t.innerHTML = msg +
      '<div class="sh-toast-actions">' +
      '<a href="' + WA + encodeURIComponent(WA_MSG[kind] || WA_MSG['default']) + '" target="_blank" rel="noopener">Scrivici su WhatsApp</a>' +
      '<button type="button">Chiudi</button>' +
      '</div>';
    document.body.appendChild(t);
    t.querySelector('button').addEventListener('click', function () { t.remove(); });
  }

  /* Ringraziamento dopo il checkout (redirect da Stripe con ?ok=1) */
  if (new URLSearchParams(location.search).get('ok') === '1') {
    var t = document.createElement('div');
    t.className = 'sh-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = '<strong>Grazie per il tuo ordine!</strong> Riceverai a breve una email di conferma con la ricevuta. Per qualsiasi cosa siamo su WhatsApp.' +
      '<div class="sh-toast-actions"><button type="button">Chiudi</button></div>';
    document.body.appendChild(t);
    t.querySelector('button').addEventListener('click', function () { t.remove(); });
    history.replaceState(null, '', location.pathname);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-stripe]') : null;
    if (!btn) return;
    e.preventDefault();
    var key = btn.getAttribute('data-stripe');
    var url = LINKS[key];
    if (url) { window.open(url, '_blank', 'noopener'); return; }
    showToast(key === 'referral' ? 'referral' : 'default');
  });
})();
