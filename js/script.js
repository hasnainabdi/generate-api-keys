// About section animation on scroll
document.addEventListener('DOMContentLoaded', function() {
  var about = document.querySelector('.about-animated');
  if (about) {
    var observer = new window.IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          about.classList.add('visible');
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(about);
  }
});
// Helpers
    const $ = (sel) => document.querySelector(sel);
    const toast = (msg) => { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); setTimeout(()=> el.classList.remove('show'), 2000); };

    // Mobile menu
    $('#menuBtn').addEventListener('click', ()=> $('#mobileMenu').classList.toggle('open'));

  // Footer year (fix: only set if #year exists)
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Smooth scroll for all anchor links and buttons
    document.querySelectorAll('a[href^="#"], .cta, .ghost, .btn').forEach(el => {
      el.addEventListener('click', function(e) {
        const href = el.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    // Key generation (client-side demo)
    function randomChunk(n){
      let out='';
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789abcdefghijkmnopqrstuvwxyz';
      for(let i=0;i<n;i++){ out += chars[Math.floor(Math.random()*chars.length)]; }
      return out;
    }
    function buildKey(category, userId){
      const prefix = category.toUpperCase().replace(/[^A-Z0-9]/g,'-');
      const uid = userId ? userId.replace(/\s+/g,'').slice(0,24) : 'PUBLIC';
      const partA = randomChunk(6);
      const partB = randomChunk(10);
      const ts = Date.now().toString(36).toUpperCase();
      return `${prefix}.${uid}.${partA}-${partB}.${ts}`;
    }

    function storageKey(category){ return `demo_key_${category}`; }

    function saveKey(category, key){
      try{ localStorage.setItem(storageKey(category), key); }catch(e){}
    }
    function loadKey(category){
      try{ return localStorage.getItem(storageKey(category)); }catch(e){ return null; }
    }

    // UI wiring
    const genBtn = $('#genBtn');
    const restoreBtn = $('#restoreBtn');
    const copyBtn = $('#copyBtn');
    const categorySel = $('#category');
    const userIdInput = $('#userId');
    const resultWrap = $('#resultWrap');
    const apiKeyInput = $('#apiKey');

    function showKey(key){
      apiKeyInput.value = key; resultWrap.style.display = 'flex';
      // Show code example
      var codeWrap = document.getElementById('apiCodeExample');
      var codeBlock = document.getElementById('apiCodeBlock');
      var copyBtn = document.getElementById('copyBtn');
      if(codeWrap && codeBlock && copyBtn){
        codeWrap.style.display = 'block';
        codeBlock.textContent =
`fetch('https://api.example.com/data', {
  headers: { 'Authorization': 'Bearer ${key}' }
})
.then(res => res.json())
.then(data => console.log(data));`;
        copyBtn.style.display = 'inline-flex';
      }
    }

    function resetKeyUI() {
      apiKeyInput.value = '';
      resultWrap.style.display = 'none';
      var codeWrap = document.getElementById('apiCodeExample');
      var codeBlock = document.getElementById('apiCodeBlock');
      var copyBtn = document.getElementById('copyBtn');
      if(codeWrap && codeBlock && copyBtn){
        codeWrap.style.display = 'none';
        codeBlock.textContent = '// Example will appear here';
        copyBtn.style.display = 'none';
      }
    }
    // Hide copy button initially and when code example is hidden
    document.addEventListener('DOMContentLoaded', function() {
      var copyBtn = document.getElementById('copyBtn');
      if(copyBtn) copyBtn.style.display = 'none';
    });

    genBtn.addEventListener('click', ()=>{
      const category = categorySel.value;
      const userId = userIdInput.value.trim();
      const existingKey = loadKey(category + '_' + userId);
      if(existingKey){
        showKey(existingKey);
        toast('Key already exists for this user/category');
        return;
      }
      const key = buildKey(category, userId);
      saveKey(category + '_' + userId, key);
      showKey(key);
      toast('Key generated');
    });

    restoreBtn.addEventListener('click', ()=>{
      const category = categorySel.value;
      const userId = userIdInput.value.trim();
      const key = loadKey(category + '_' + userId);
      if(key){ showKey(key); toast('Restored saved key'); }
      else{ toast('No saved key for this category/user'); }
    });

    copyBtn.addEventListener('click', async ()=>{
      apiKeyInput.select();
      try{ await navigator.clipboard.writeText(apiKeyInput.value); toast('Copied to clipboard'); }
      catch(e){ toast('Copy failed'); }
    });

    // On refresh, reset key/code UI
    document.addEventListener('DOMContentLoaded', ()=>{
      resetKeyUI();
    });

    fetch("http://localhost:3000/api/data")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.message); // "API working"
    // backend se jo bhi response aya use frontend mein use karo
  });
