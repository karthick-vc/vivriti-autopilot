(function () {
    if (window.MyChatWidgetLoaded) return;
    window.MyChatWidgetLoaded = true;

    // === Create shadow host ===
    const host = document.createElement('div');
    host.id = 'my-chat-widget';
    host.style.position = 'fixed';
    host.style.bottom = '20px';
    host.style.right = '20px';
    host.style.zIndex = '99999';
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: 'open' });

    // === Inject styles ===
    const style = document.createElement('style');
    style.textContent = `
      .chat-launcher {
        width: 60px;
        height: 60px;
        background: #5480cd;
        border-radius: 50%;
        color: #fff;
        font-size: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      }
  
      .chat-window {
        width: 360px;
        height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        position: absolute;
        bottom: 80px;
        right: 0;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: sans-serif;
      }
  
      .chat-header {
        background: #5480cd;
        color: white;
        padding: 16px;
        font-size: 18px;
      }
  
      .chat-body {
        padding: 16px;
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
  
      .chat-input {
        display: flex;
        padding: 12px;
        border-top: 1px solid #eee;
      }
  
      .chat-input input {
        flex: 1;
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid #ccc;
        font-size: 14px;
      }
  
      .chat-bubble {
        padding: 10px 14px;
        border-radius: 15px;
        max-width: 75%;
      }
  
      .user { align-self: flex-end; background: #e0f0ff; }
      .bot { align-self: flex-start; background: #f5f5f5; }
    `;

    // === Inject HTML ===
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="chat-launcher" title="Chat">&#128172;</div>
      <div class="chat-window">
        <div class="chat-header">Chat with Us</div>
        <div class="chat-body"></div>
        <div class="chat-input">
          <input type="text" placeholder="Type your message..." />
        </div>
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);

    // === Chat logic ===
    const launcher = shadow.querySelector('.chat-launcher');
    const chatWindow = shadow.querySelector('.chat-window');
    const input = shadow.querySelector('input');
    const chatBody = shadow.querySelector('.chat-body');

    const appendMessage = (text, type) => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${type}`;
        bubble.textContent = text;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    launcher.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            const msg = input.value.trim();
            appendMessage(msg, 'user');
            input.value = '';
            setTimeout(() => {
                appendMessage(`You said: "${msg}"`, 'bot');
            }, 500);
        }
    });

    // Optional: Initial greeting
    appendMessage("Hello! How can I help you today?", 'bot');
})();
