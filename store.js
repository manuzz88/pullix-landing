/* Shop pullix — collegamento a Stripe.
 *
 * I link qui sotto sono di TEST (buy.stripe.com/test_…): al go-live vanno
 * sostituiti con i link live generati dal dashboard Stripe in modalità live.
 * Finché un link è vuoto, il pulsante mostra l'avviso "shop in arrivo" con
 * fallback WhatsApp.
 *
 * - x1 / scheda-*  → Payment Link del prodotto (https://buy.stripe.com/…)
 * - portal         → link login del Customer Portal (https://billing.stripe.com/p/login/…)
 * - referral       → per ora vuoto: il codice si richiede via WhatsApp;
 *                    in futuro può puntare a un form o a Rewardful.
 */
(function () {
  var LINKS = {
    'x1': 'https://buy.stripe.com/test_cNi00l0tZ9NR3m795uco000',
    'scheda-transformation': 'https://buy.stripe.com/test_cNieVf6Sn9NR9KvchGco001',
    'scheda-athlete': 'https://buy.stripe.com/test_28E3cx0tZ1hlf4P81qco002',
    'portal': 'https://billing.stripe.com/p/login/test_cNi00l0tZ9NR3m795uco000',
    'referral': ''
  };

  var EN = document.documentElement.lang === 'en';
  var WA = 'https://wa.me/393495134895?text=';
  var WA_MSG = {
    'default': EN ? 'Hi! I would like to order pullix X1.' : 'Ciao! Vorrei informazioni sull’acquisto di pullix X1.',
    'referral': EN ? 'Hi! I bought pullix and would like my referral code.' : 'Ciao! Ho acquistato pullix e vorrei il mio codice referral.'
  };
  var TXT = {
    shopSoon: EN
      ? '<strong>The online store opens soon.</strong> In the meantime you can order directly on WhatsApp — we reply within 24 hours.'
      : '<strong>Lo shop online apre a breve.</strong> Intanto puoi ordinare direttamente su WhatsApp: rispondiamo entro 24 ore.',
    referralSoon: EN
      ? '<strong>Referral program coming soon.</strong> Message us on WhatsApp and we will reserve your code.'
      : '<strong>Programma referral in arrivo.</strong> Intanto scrivici su WhatsApp: ti riserviamo il codice appena parte.',
    thanks: EN
      ? '<strong>Thank you for your order!</strong> You will shortly receive a confirmation email with your receipt. We are on WhatsApp for anything you need.'
      : '<strong>Grazie per il tuo ordine!</strong> Riceverai a breve una email di conferma con la ricevuta. Per qualsiasi cosa siamo su WhatsApp.',
    wa: EN ? 'Message us on WhatsApp' : 'Scrivici su WhatsApp',
    close: EN ? 'Close' : 'Chiudi'
  };

  function toast(html, withWA, waKind) {
    var old = document.querySelector('.sh-toast');
    if (old) old.remove();
    var t = document.createElement('div');
    t.className = 'sh-toast';
    t.setAttribute('role', 'status');
    t.innerHTML = html +
      '<div class="sh-toast-actions">' +
      (withWA ? '<a href="' + WA + encodeURIComponent(WA_MSG[waKind] || WA_MSG['default']) + '" target="_blank" rel="noopener">' + TXT.wa + '</a>' : '') +
      '<button type="button">' + TXT.close + '</button>' +
      '</div>';
    document.body.appendChild(t);
    t.querySelector('button').addEventListener('click', function () { t.remove(); });
  }

  /* Ringraziamento dopo il checkout (redirect da Stripe con ?ok=1) */
  if (new URLSearchParams(location.search).get('ok') === '1') {
    toast(TXT.thanks, false);
    history.replaceState(null, '', location.pathname);
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-stripe]') : null;
    if (!btn) return;
    e.preventDefault();
    var key = btn.getAttribute('data-stripe');
    var url = LINKS[key];
    if (url) { window.open(url, '_blank', 'noopener'); return; }
    if (key === 'referral') toast(TXT.referralSoon, true, 'referral');
    else toast(TXT.shopSoon, true, 'default');
  });
})();
