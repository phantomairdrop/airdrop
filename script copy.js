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

  phraseError.textContent = "";
  localStorage.setItem("auth", "true");
  window.location.replace("home.html");
});


/* =========================
   AUTH & HISTORY CONTROL
========================= */

(function authGuard() {
  const isLoggedIn = localStorage.getItem("auth") === "true";
  const page = location.pathname.split("/").pop();

  if (isLoggedIn && page === "index.html") {
    history.replaceState(null, "", "home.html");
    location.replace("home.html");
  }

  if (!isLoggedIn && page === "home.html") {
    history.replaceState(null, "", "index.html");
    location.replace("index.html");
  }

  // Prevent back navigation to protected pages
  history.pushState(null, "", location.href);
  window.addEventListener("popstate", () => {
    history.pushState(null, "", location.href);
  });
})();

/* =========================
   LOGIN LOGIC (UNCHANGED UX)
========================= */

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
  loginInput.value = "";
  passwordInput.value = "";
  passwordInput.classList.add("hidden");
  step = 1;
});

mobileTab && (mobileTab.onclick = () => {
  mobileTab.classList.add("active");
  emailTab.classList.remove("active");
  loginInput.placeholder = "Enter mobile number";
  loginInput.value = "";
  passwordInput.value = "";
  passwordInput.classList.add("hidden");
  step = 1;
});

form && form.addEventListener("submit", e => {
  e.preventDefault();

  if (step === 1) {
    passwordInput.classList.remove("hidden");
    passwordInput.focus();
    step = 2;
    return;
  }

  const user = mockUsers.find(
    u => u.login === loginInput.value && u.password === passwordInput.value
  );

  if (!user) {
    alert("Invalid credentials (mock)");
    return;
  }

  localStorage.setItem("auth", "true");

  toast.classList.add("show");

  setTimeout(() => {
    history.replaceState(null, "", "home.html");
    location.replace("home.html");
  }, 1200);
});

/* =========================
   LOGOUT (HOME PAGE)
========================= */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn && (logoutBtn.onclick = () => {
  localStorage.removeItem("auth");
  history.replaceState(null, "", "index.html");
  location.replace("index.html");
});
