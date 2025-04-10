(function () {
    if (window.VivritiWidgetLoaded) return;
    window.VivritiWidgetLoaded = true;

    // === Create shadow host ===
    const shadowHost = document.createElement('div');
    shadowHost.id = 'vivriti-widget-root';
    shadowHost.style.position = 'fixed';
    shadowHost.style.bottom = '80px';
    shadowHost.style.right = '30px';
    shadowHost.style.zIndex = '99999';
    document.body.appendChild(shadowHost);

    const shadow = shadowHost.attachShadow({ mode: 'open' });

    // === Append Font Awesome & custom styles to shadow DOM ===
    const style = document.createElement('style');
    style.textContent = `
      #bottom-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    z-index: 9999;
    font-family: sans-serif;
}

#chat-container {
    position: fixed;
    bottom: 30px;
    right: 80px;
    width: 420px;
    height: 70vh;
    background: #fff;
    z-index: 9999;
    display: flex;
    border-radius: 20px;
    flex-direction: column;
    box-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);
    overflow: hidden;
}

div#search-box {
    width: 100%;
    margin: auto;
    padding: 15px 15px 15px 15px;
    box-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);
}

#background-overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

div#response {
    background-color: #569ff70f;
    margin-bottom: 0px !important;
}

.chat-input-bar {
    padding: 10px;
    border-top: 1px solid #eee;
    background-color: #f9f9f9;
}

#search-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    width: 100%;
    border-radius: 30px;
}

div#response {
    max-height: 400px;
    overflow-y: auto;
    flex: 1;
    overflow-y: auto;
    padding: 30px;
}

.exs-header-top {
    background-color: #5480cd;
    margin: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px;
    height: 60px;
}
.exs-header-top img{
    width: 150px;
}

.chat-response .chat-bubble {
    background-color: #e0f0ff;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    max-width: 80%;
}

#mic-button {
    cursor: pointer;
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    font-size: 18px;
    border: 0;
    background-color: transparent;
}

div#loader {
    text-align: center;
    padding: 20px 0px;
}

input#search-input:focus-visible {
    outline: none;
}
    `;

    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

    // === Build widget HTML inside shadow DOM ===
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="bottom-search-logo">
        <img src="https://www.vivriticapital.com/assets/image/logo/fav-icon.png" width="40" height="40" />
      </div>
      <div id="bottom-search-overlay" style="display: none;">
        <div id="background-overlay"></div>
        <div id="chat-container">
          <div class="exs-header-top">
            <img src="https://www.vivriticapital.com/assets/image/logo/vivirti_logo_img.svg" />
          </div>
          <div id="response" class="chat-response"></div>
          <div id="loader" style="display: none;">Searching...</div>
          <div id="search-box" class="chat-input-bar">
            <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
              <input type="text" id="search-input" placeholder="Type or speak your query..." />
              <button id="mic-button" title="Speak your query">&#xf130;</button>
            </div>
          </div>
        </div>
      </div>
    `;

    shadow.appendChild(fontAwesome);
    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    // === Functionality ===
    const logo = shadow.querySelector('#bottom-search-logo');
    const overlay = shadow.querySelector('#bottom-search-overlay');
    const input = shadow.querySelector('#search-input');
    const response = shadow.querySelector('#response');
    const loader = shadow.querySelector('#loader');
    const micButton = shadow.querySelector('#mic-button');

    logo.onclick = () => {
        overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
        input.focus();
    };

    function handleSearch(query) {
        if (!query) return;
        loader.style.display = 'block';
        response.innerHTML = '';
        setTimeout(() => {
            loader.style.display = 'none';
            typeText(response, `You searched for "${query}". This is a sample response.`);
        }, 1000);
    }

    function typeText(el, text, i = 0) {
        if (i < text.length) {
            el.innerHTML += text.charAt(i);
            setTimeout(() => typeText(el, text, i + 1), 30);
        }
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(input.value.trim());
    });

    // === Speech Recognition ===
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
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
})();