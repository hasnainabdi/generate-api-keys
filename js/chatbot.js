// (stray object removed, error fix)
(function(){
  // Floating WhatsApp-style Chatbot Button and Panel with AI & Persistent Chat
  // Insert FAB button
  var fab = document.createElement('div');
  fab.id = 'chatbot-fab';
  fab.innerHTML = '<svg viewBox="0 0 32 32"><g><circle cx="16" cy="16" r="16" fill="var(--brand, #4f7cff)"/><g><rect x="8" y="13" width="16" height="10" rx="5" fill="#fff"/><rect x="12" y="10" width="8" height="6" rx="3" fill="#fff"/><circle cx="13.5" cy="16.5" r="1.2" fill="#4f7cff"/><circle cx="18.5" cy="16.5" r="1.2" fill="#4f7cff"/><rect x="15" y="7" width="2" height="3" rx="1" fill="#fff"/></g></g></svg>';
  document.body.appendChild(fab);

  // Insert chatbot panel
  var panel = document.createElement('div');
  panel.id = 'chatbot-panel';
  panel.innerHTML = `
    <div id="chatbot-header">Ask Assistant <button id="chatbot-close" title="Close">×</button></div>
    <div id="chatbot-messages" aria-live="polite"></div>
    <div id="chatbot-input-row">
      <input id="chatbot-input" type="text" placeholder="Ask about this site..." aria-label="Chat input" autocomplete="off" />
      <button id="chatbot-send" aria-label="Send">➤</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Show/hide logic
  fab.onclick = function(){ panel.classList.add('open'); loadChatHistory(); };
  panel.querySelector('#chatbot-close').onclick = function(){ panel.classList.remove('open'); };

  // Persistent chat: Load history
  function loadChatHistory() {
    try {
      const data = JSON.parse(localStorage.getItem('chatbot-history') || '[]');
      const messages = document.getElementById('chatbot-messages');
      messages.innerHTML = '';
      data.forEach(item => chatbotAddMessage(item.text, item.user));
    } catch {}
  }
  // Persistent chat: Save message
  function saveChatMessage(text, user) {
    try {
      const data = JSON.parse(localStorage.getItem('chatbot-history') || '[]');
      data.push({text, user});
      localStorage.setItem('chatbot-history', JSON.stringify(data));
    } catch {}
  }

  // Chatbot logic (static answers)
  var chatbotInfo = [
    {q:["hi","hello","salam","assalam","asalam","hey","aoa","greetings"],a:"Assalam o Alaikum! Welcome to the Free API Generator. Aap mujh se website, API key, ya features ke baare mein pooch sakte hain."},
    {q:["ok","thanks","thank you","shukriya","thx","great","acha","theek hai"],a:"Shukriya! Agar aapko aur koi madad chahiye ho to poochte rahein."},
    {q:["free","kya free hai","apis free hain","api free hai","muft","charges","price","cost"],a:"Yeh tool sirf demo ke liye hai aur yahan jo API keys generate hoti hain woh bilkul free hain. Lekin yeh real backend se connect nahi, sirf frontend par kaam karti hain."},
    {q:["api key","generate","key","kaise","how to"],a:"API key generate karne ke liye category select karein, User ID (optional) likhein, aur 'Generate key' button dabayein. Key niche code example ke sath show hogi."},
    {q:["category","categories","konsi category"],a:"Categories hain: Image Generator, Video Generator, Calling AI Agent, aur Text Generator. Aap apni marzi se HTML mein bhi categories add/remove kar sakte hain."},
    {q:["restore","save","key wapas","key recover"],a:"Agar aapne pehle key generate ki hai (same category aur user ID ke sath), to 'Restore saved' button se woh key wapas mil sakti hai."},
    {q:["copy","key copy","copy button"],a:"'Copy' button sirf tab dikhai deta hai jab key generate ho jaye. Us par click kar ke aap key clipboard par copy kar sakte hain."},
    {q:["code example","api code","fetch example"],a:"Key generate karne ke baad ek code example bhi show hota hai jisme fetch() ka use hai. Isse aap dekh sakte hain API key ka istemal kaise hota hai."},
    {q:["about","project","creator","who made","author"],a:"Ye website Muhammad Hasnain ne banai hai. Modern, open-source API key generator demo hai, jisme professional UI, accessibility, aur SEO features hain."},
    {q:["theme","dark","light","toggle"],a:"Aap header mein theme toggle se light/dark mode change kar sakte hain. Yeh feature site ki accessibility aur user comfort ke liye hai."},
    {q:["faq","questions","help","sawal"],a:"FAQ section mein aapko key generation, categories, security, aur customization se related sawalon ke jawab milenge."},
    {q:["types of apis","rest","graphql","websocket","soap"],a:"Supported API types: REST, GraphQL, WebSocket, aur SOAP. In sab ki tafseeli maloomat 'Types of APIs' section mein hai."},
    {q:["seo","performance","accessibility","structured data","sitemap","robots"],a:"Is site mein SEO meta tags, Open Graph, structured data, sitemap.xml, robots.txt, aur accessibility improvements shamil hain."},
    {q:["loader","animation","smooth scroll","ui","responsive"],a:"UI modern aur responsive hai, loader, smooth scroll, aur animated sections bhi hain taake user experience behtar ho."},
    {q:["credit","copyright","license"],a:"Footer mein copyright aur credit Muhammad Hasnain ko diya gaya hai. Project open source hai aur LICENSE file bhi shamil hai."},
    {q:["reset","refresh","key reset","page reload"],a:"Page refresh karne par API key aur code example reset ho jate hain. Har category/user combination ke liye ek hi key banti hai, dobara nahi banegi."},
    {q:["remove about","about section","section remove"],a:"About section user ki request par remove ki gayi hai. Saari maloomat ab chatbot aur dusre sections mein available hai."},
    {q:["mobile","responsive","mobile device"],a:"Yeh website fully responsive hai aur mobile par bhi bilkul sahi kaam karti hai."},
    {q:["favicon","icon","browser tab"],a:"Is site ka apna favicon hai jo browser tab mein dikhai deta hai."},
    {q:["sitemap","robots.txt"],a:"Sitemap.xml aur robots.txt files SEO aur crawling ke liye add ki gayi hain."},
    {q:["contact","support","help needed"],a:"Agar aapko koi masla ho ya help chahiye, to chatbot se pooch sakte hain ya project ki README file dekhein."}
  ];
  function chatbotFindAnswer(msg) {
    msg = msg.toLowerCase();
    for (const item of chatbotInfo) {
      if (item.q.some(q => msg.includes(q))) return item.a;
    }
    return null; // No static answer, try AI
  }
  function chatbotAddMessage(text, user=false) {
    var messages = document.getElementById('chatbot-messages');
    if (!messages) return;
    var msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-msg' + (user ? ' user' : '');
    var bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    msgDiv.appendChild(bubble);
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
    saveChatMessage(text, user);
  }

  // AI Integration (OpenAI API)
  async function chatbotAIAnswer(msg) {
    chatbotAddMessage("Thinking...", false);
    try {
      // Replace with your OpenAI API key
      const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + OPENAI_API_KEY
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {role: "system", content: "You are an assistant for a Free API Generator website. Answer only about the website, its features, API key generation, categories, and usage. If asked anything else, politely refuse."},
            {role: "user", content: msg}
          ],
          max_tokens: 100
        })
      });
      const data = await response.json();
      // Remove "Thinking..." message
      var messages = document.getElementById('chatbot-messages');
      if (messages && messages.lastChild && messages.lastChild.textContent === "Thinking...") {
        messages.removeChild(messages.lastChild);
      }
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        chatbotAddMessage(data.choices[0].message.content.trim());
      } else {
        chatbotAddMessage("Sorry, I couldn't get an answer right now.");
      }
    } catch (e) {
      // Remove "Thinking..." message
      var messages = document.getElementById('chatbot-messages');
      if (messages && messages.lastChild && messages.lastChild.textContent === "Thinking...") {
        messages.removeChild(messages.lastChild);
      }
      chatbotAddMessage("Sorry, AI assistant is not available right now.");
    }
  }
  // ====== AI fallback (Google Gemini/PaLM) ======
  async function chatbotAIAnswer(question) {
    // Add your Google API key here
    const GOOGLE_API_KEY = "AIzaSyBjyR48k7D5Pv8Mx52s72zrzskzB7z6Kzs"; // <-- User's Google API key
    if (!GOOGLE_API_KEY) {
      return "AI is not enabled. Please add your Google API key in chatbot.js.";
    }
    // Gemini/PaLM API endpoint (text-bison-001 is a common model)
    const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${GOOGLE_API_KEY}`;
    const headers = {
      "Content-Type": "application/json"
    };
    const body = JSON.stringify({
      prompt: { text: `You are a helpful assistant for the API Generator website. Answer all questions about the site, its features, and usage.\nUser: ${question}` },
      temperature: 0.7,
      candidateCount: 1,
      maxOutputTokens: 256
    });
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body
      });
      if (!response.ok) {
        return "Sorry, AI service is currently unavailable (Google Gemini).";
      }
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].output) {
        return data.candidates[0].output.trim();
      } else {
        return "Sorry, I couldn't get an answer from AI (Google Gemini).";
      }
    } catch (e) {
        return "Sorry, there was an error connecting to AI (Google Gemini).";
      }
    }

  function chatbotSend() {
    var input = document.getElementById('chatbot-input');
    if (!input) return;
    var msg = (input.value || '').trim();
    if (!msg) return;
    chatbotAddMessage(msg, true);
    input.value = '';
    var staticAnswer = chatbotFindAnswer(msg);
    if (staticAnswer && staticAnswer !== "I'm your API Generator assistant! Ask me anything about using this site, generating keys, or its features.") {
      setTimeout(() => chatbotAddMessage(staticAnswer), 400);
    } else {
      // Use Gemini AI fallback
      chatbotAddMessage("Thinking...", false);
      chatbotAIAnswer(msg).then(aiAnswer => {
        // Remove the last "Thinking..." message
        var messages = document.getElementById('chatbot-messages');
        if (messages && messages.lastChild && messages.lastChild.textContent === "Thinking...") {
          messages.removeChild(messages.lastChild);
        }
        chatbotAddMessage(aiAnswer);
      });
    }
  }
  panel.querySelector('#chatbot-send').onclick = function(e){ if(e) e.preventDefault(); chatbotSend(); };
    panel.querySelector('#chatbot-input').onkeydown = function(e){ if(e.key==='Enter'){ e.preventDefault(); chatbotSend(); } };
  
  })();

