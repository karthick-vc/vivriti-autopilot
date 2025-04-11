(function () {
  const chatDiv = `
    <div id="chat-container" style="display:flex; flex-direction:column; position:fixed; bottom:130px; right:20px; width:300px; background:white; padding:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15); border-radius:10px; z-index:10000;">
      <div class="exs-header-top">
        <img src="https://karthick-vc.github.io/vivriti-autopilot/Vivriti-Next-logo-White.svg" style="max-height:30px;" />
      </div>
      <div class="response-container" style="flex:1; overflow-y:auto; margin:10px 0;">
        <div id="response" class="chat-response"></div>
        <div id="loader" style="display: none; padding: 10px; font-style: italic;">Jarvis Searching...</div>
      </div>
      <div id="search-box" class="chat-input-bar">
        <div style="display:flex; gap:8px;">
          <input type="text" id="search-input" placeholder="Type or speak..." style="flex:1;padding:8px;border-radius:20px;border:1px solid #ccc;" />
          <button id="mic-button" title="Speak your query" style="font-family:'Font Awesome 5 Free';font-weight:900;font-size:18px;background:none;border:none;cursor:pointer;">&#xf130;</button>
        </div>
      </div>
    </div>`;

  const toggleBtn = document.createElement('div');
  toggleBtn.id = 'chat-toggle-button';
  toggleBtn.style.cssText = 'position:fixed;bottom:140px;right:20px;z-index:10001;';
  toggleBtn.innerHTML = `<img src="https://karthick-vc.github.io/vivriti-autopilot/image.png" width="40px" height="40px" />`;
  document.body.appendChild(toggleBtn);

  const iframe = document.createElement('iframe');
  iframe.src = 'https://karthick-vc.github.io/vivriti-autopilot/jarvis.html'; // replace this with your actual widget iframe URL
  iframe.id = 'jarvis-widget';
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '0px',
    right: '0px',
    width: '100px',
    height: '100px',
    border: 'none',
    borderRadius: '16px',
    zIndex: '10000'
  });
  iframe.allow = 'microphone';
  document.body.appendChild(iframe);

  toggleBtn.addEventListener('click', () => {
    let chatContainer = document.getElementById('chat-container');
    const isVisible = chatContainer && chatContainer.style.display === 'flex';
    if (!chatContainer) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = chatDiv;
      const chatElement = wrapper.firstElementChild;
      const targetIframe = document.getElementById('jarvis-widget');
      if (targetIframe && targetIframe.parentNode) {
        targetIframe.parentNode.insertBefore(chatElement, targetIframe);
      } else {
        document.body.appendChild(chatElement);
      }
      setupChatEvents();
    } else {
      chatContainer.style.display = isVisible ? 'none' : 'flex';
    }
  });

  function setupChatEvents() {
    const input = document.getElementById('search-input');
    const loader = document.getElementById('loader');
    const response = document.getElementById('response');
    const micButton = document.getElementById('mic-button');

    function appendMessage(text, sender = 'bot') {
      const msg = document.createElement('div');
      msg.textContent = text;
      Object.assign(msg.style, {
        maxWidth: '80%',
        padding: '8px 12px',
        borderRadius: '15px',
        alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
        background: sender === 'user' ? '#cce5ff' : '#f1f1f1',
        color: '#000',
        fontSize: '14px'
      });
      response.appendChild(msg);
      response.scrollTop = response.scrollHeight;
    }

    function handleSearch(query) {
      if (!query) return;
      appendMessage(query, 'user');
      input.value = '';
      loader.style.display = 'block';
      setTimeout(() => {
        loader.style.display = 'none';
        typeText(`You asked: "${query}". This is a sample bot response.`);
      }, 1000);
    }

    function typeText(text, i = 0, buffer = '') {
      if (i < text.length) {
        buffer += text.charAt(i);
        setTimeout(() => typeText(text, i + 1, buffer), 30);
      } else {
        appendMessage(buffer, 'bot');
      }
    }

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(input.value.trim());
      });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      let isRecognizing = false;

      micButton.onclick = () => {
        if (isRecognizing) recognition.stop();
        else recognition.start();
      };

      recognition.onstart = () => {
        isRecognizing = true;
        micButton.innerHTML = '&#xf28d;';
      };
      recognition.onend = () => {
        isRecognizing = false;
        micButton.innerHTML = '&#xf130;';
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        input.value = transcript;
        handleSearch(transcript);
      };
    } else {
      micButton.disabled = true;
      micButton.title = "Speech recognition not supported.";
    }
  }
})();
