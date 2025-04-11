(function () {
  const iframe = document.createElement('iframe');
  iframe.src = '/jarvis.html'; // <-- Replace with your actual hosted URL
  iframe.style.position = 'fixed';
  iframe.style.bottom = '30px';
  iframe.style.right = '30px';
  iframe.style.width = '320px';
  iframe.style.height = '450px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '16px';
  iframe.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)';
  iframe.style.zIndex = '10000';
  iframe.allow = 'microphone';

  document.body.appendChild(iframe);
})();
