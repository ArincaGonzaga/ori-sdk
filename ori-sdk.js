(function(window){
  // Extrai UTMs da URL
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content')
    };
  }

  // Envia dados ao webhook
  function sendPayload(payload) {
    fetch('https://teste.arinca.com.br/webhook-test/ori-sessions', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
  }

  // Captura ao carregar a página
  window.addEventListener('load', () => {
    // Envio de sessão simples
    sendPayload({
      type: 'pageview',
      url: window.location.href,
      referer: document.referrer,
      utm: getUtmParams(),
      timestamp: new Date().toISOString()
    });

    // Para cada form existente, adiciona listener de submit
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', event => {
        try {
          // Não bloqueia o submit, apenas dispara paralelamente
          const formData = {};
          // percorre inputs, selects e textareas com atributo name
          Array.from(form.elements).forEach(el => {
            if (el.name) {
              formData[el.name] = el.value;
            }
          });

          sendPayload({
            type: 'form-submit',
            formId: form.id || null,
            formAction: form.action || null,
            url: window.location.href,
            referer: document.referrer,
            utm: getUtmParams(),
            formData,
            timestamp: new Date().toISOString()
          });
        } catch(err) {
          console.error('Ori SDK form capture error:', err);
        }
      });
    });
  });
})(window);
