(function () {
    if (window.VivritiWidgetLoaded) return;
    window.VivritiWidgetLoaded = true;

    // Load Font Awesome
    const faLink = document.createElement('link');
    faLink.rel = 'stylesheet';
    faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(faLink);

    const logoImgUrl = 'https://yourdomain.com/assets/vivriti-next.svg';
    const logoWhiteUrl = 'https://yourdomain.com/assets/Vivriti-Next-logo-White.svg';

    // Create logo button
    const logo = document.createElement('div');
    logo.id = 'bottom-search-logo';
    logo.innerHTML = `<img src="${logoImgUrl}" width="40" height="40" />`;
    Object.assign(logo.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 10000,
        cursor: 'pointer'
    });
    document.body.appendChild(logo);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'bottom-search-overlay';
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '320px';
    overlay.style.height = '100vh';
    overlay.style.background = '#fff';
    overlay.style.boxShadow = '2px 0 10px rgba(0,0,0,0.2)';
    overlay.style.zIndex = '9999';
    overlay.style.flexDirection = 'column';
    overlay.style.padding = '10px';

    overlay.innerHTML = `
      <div class="exs-header-top">
        <img src="${logoWhiteUrl}" style="width: 100%; max-height: 50px;" />
      </div>
      <div id="response" class="chat-response" style="flex: 1; overflow-y: auto; margin-bottom: 10px;"></div>
      <div id="loader" style="display: none;">Searching...</div>
      <div id="search-box" class="chat-input-bar" style="padding-top: 10px;">
        <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
          <input type="text" id="search-input" placeholder="Type or speak your query..." style="flex: 1; padding: 8px;" />
          <button id="mic-button" title="Speak your query" style="font-family: FontAwesome;">&#xf130;</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Toggle on logo click
    logo.onclick = () => {
        const isVisible = overlay.style.display === 'flex';
        overlay.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            document.getElementById('search-input').focus();
        }
    };

    // === Search functionality ===
    const input = overlay.querySelector('#search-input');
    const loader = overlay.querySelector('#loader');
    const response = overlay.querySelector('#response');

    function handleSearch(query) {
        if (!query) return;
        loader.style.display = 'block';
        response.innerHTML = '';

        // Simulate async
        setTimeout(() => {
            loader.style.display = 'none';
            typeText(response, `You searched for "${query}". This is a sample response.`);
        }, 1000);
    }

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch(input.value.trim());
    });

    function typeText(element, text, i = 0) {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            setTimeout(() => typeText(element, text, i + 1), 30);
        }
    }

    // === Speech Recognition ===
    const micButton = overlay.querySelector('#mic-button');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        let isRecognizing = false;

        micButton.onclick = () => {
            if (isRecognizing) {
                recognition.stop();
            } else {
                recognition.start();
            }
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
