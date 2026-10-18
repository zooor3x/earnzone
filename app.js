
const SUPABASE_URL = "https://vfkxtnlzbligismjeulr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rsLQnIMgXbHrUxfzM84KCA_IIxAzA1D";

if (!window.supabase) {
  alert("Nie udało się załadować Supabase. Odśwież stronę.");
  throw new Error("Supabase library not loaded");
}

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Przykładowe oferty demonstracyjne
const offers = [
  { id: "game", category: "games", icon: "🎮", title: "Przetestuj grę", description: "Przejdź poziom w przykładowej grze demonstracyjnej.", reward: 120, tag: "Gra" },
  { id: "survey", category: "surveys", icon: "📝", title: "Krótka ankieta", description: "Zobacz, jak będzie wyglądał przepływ ankiety.", reward: 70, tag: "Ankieta" },
  { id: "app", category: "apps", icon: "📱", title: "Poznaj aplikację", description: "Przykładowe zadanie instalacji — bez prawdziwego pobierania.", reward: 90, tag: "Aplikacja" },
  { id: "quiz", category: "surveys", icon: "💡", title: "Quiz wiedzy", description: "Odpowiedz na kilka przykładowych pytań.", reward: 45, tag: "Quiz" },
  { id: "puzzle", category: "games", icon: "🧩", title: "Rozwiąż łamigłówkę", description: "Zadanie testowe do demonstracji naliczania punktów.", reward: 55, tag: "Gra" },
  { id: "mobile", category: "apps", icon: "🚀", title: "Odkryj nową apkę", description: "Przykładowa karta oferty w panelu EarnZone.", reward: 100, tag: "Aplikacja" }
];

const storageKey = "earnzone-demo-completed-v1";
let completed;

try {
  completed = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
} catch {
  completed = new Set();
}

const grid = document.querySelector("#offerGrid");
const balance = document.querySelector("#balance");
const loginBtn = document.querySelector("#loginBtn");

if (!grid || !balance || !loginBtn) {
  throw new Error("Nie znaleziono wymaganych elementów strony EarnZone.");
}

// Własne okno logowania w stylu EarnZone
const authStyle = document.createElement("style");
authStyle.textContent = `
  .ez-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 18px;
    background: rgba(2, 8, 18, .82);
    backdrop-filter: blur(8px);
  }
  .ez-overlay.ez-visible { display: flex; }
  .ez-modal {
    position: relative;
    width: 100%;
    max-width: 410px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px 24px;
    border: 1px solid rgba(110, 231, 255, .2);
    border-radius: 22px;
    background: #0d192a;
    color: #f4f7fb;
    box-shadow: 0 24px 80px rgba(0,0,0,.45);
    font-family: inherit;
  }
  .ez-brand {
    margin-bottom: 22px;
    font-size: 23px;
    font-weight: 800;
    letter-spacing: -.6px;
  }
  .ez-brand span { color: #55e6d0; }
  .ez-kicker {
    margin: 0 0 8px;
    color: #55e6d0;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .ez-modal h2 {
    margin: 0 0 9px;
    font-size: 27px;
    line-height: 1.2;
  }
  .ez-desc {
    margin: 0 0 23px;
    color: #a9b7c9;
    font-size: 14px;
    line-height: 1.6;
  }
  .ez-close {
    position: absolute;
    top: 14px;
    right: 15px;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 10px;
    background: #18273a;
    color: #dce7f4;
    font-size: 24px;
    cursor: pointer;
  }
  .ez-field { margin-bottom: 15px; }
  .ez-field label {
    display: block;
    margin-bottom: 7px;
    color: #dce7f4;
    font-size: 13px;
    font-weight: 600;
  }
  .ez-field input {
    box-sizing: border-box;
    width: 100%;
    padding: 13px 14px;
    border: 1px solid #304258;
    border-radius: 11px;
    outline: none;
    background: #091321;
    color: white;
    font: inherit;
    font-size: 15px;
  }
  .ez-field input:focus { border-color: #55e6d0; }
  .ez-submit {
    width: 100%;
    margin-top: 7px;
    padding: 14px;
    border: 0;
    border-radius: 11px;
    background: linear-gradient(100deg, #55e6d0, #65c9f4);
    color: #071522;
    font: inherit;
    font-weight: 800;
    cursor: pointer;
  }
  .ez-submit:disabled { opacity: .6; cursor: wait; }
  .ez-switch {
    margin: 19px 0 0;
    text-align: center;
    color: #a9b7c9;
    font-size: 13px;
  }
  .ez-link {
    padding: 0;
    border: 0;
    background: none;
    color: #55e6d0;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  .ez-message {
    display: none;
    margin: 15px 0 0;
    padding: 11px 12px;
    border-radius: 10px;
    background: #17283b;
    color: #dce7f4;
    font-size: 13px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }
  .ez-message.ez-show { display: block; }
  .ez-legal {
    margin: 19px 0 0;
    color: #8495aa;
    font-size: 11px;
    line-height: 1.5;
    text-align: center;
  }
  body.ez-lock { overflow: hidden; }
`;
document.head.appendChild(authStyle);

const overlay = document.createElement("div");
overlay.className = "ez-overlay";
overlay.id = "ezAuthOverlay";
overlay.innerHTML = `
  <section class="ez-modal" role="dialog" aria-modal="true"
    aria-labelledby="ezAuthTitle">
    <button class="ez-close" id="ezAuthClose" aria-label="Zamknij">×</button>
    <div class="ez-brand">EARN<span>ZONE</span></div>
    <p class="ez-kicker" id="ezAuthKicker">TWOJA STREFA NAGRÓD</p>
    <h2 id="ezAuthTitle">Witaj ponownie!</h2>
    <p class="ez-desc" id="ezAuthDesc">Zaloguj się, aby przejść do swojego konta EarnZone.</p>
    <form id="ezAuthForm">
      <div class="ez-field">
        <label for="ezEmail">Adres e-mail</label>
        <input id="ezEmail" type="email" autocomplete="email"
          placeholder="ty@email.com" required maxlength="254">
      </div>
      <div class="ez-field">
        <label for="ezPassword">Hasło</label>
        <input id="ezPassword" type="password"
          autocomplete="current-password" placeholder="Minimum 6 znaków"
          required minlength="6" maxlength="72">
      </div>
      <button class="ez-submit" id="ezAuthSubmit" type="submit">Zaloguj się</button>
    </form>
    <div class="ez-message" id="ezAuthMessage" role="status" aria-live="polite"></div>
    <p class="ez-switch">
      <span id="ezSwitchText">Nie masz jeszcze konta?</span>
      <button class="ez-link" id="ezSwitchMode" type="button">Zarejestruj się</button>
    </p>
    <p class="ez-legal">Nie udostępniaj nikomu swojego hasła. Punkty na tej stronie są obecnie demonstracyjne.</p>
  </section>
`;
document.body.appendChild(overlay);

const authForm = document.querySelector("#ezAuthForm");
const emailInput = document.querySelector("#ezEmail");
const passwordInput = document.querySelector("#ezPassword");
const authTitle = document.querySelector("#ezAuthTitle");
const authKicker = document.querySelector("#ezAuthKicker");
const authDesc = document.querySelector("#ezAuthDesc");
const authSubmit = document.querySelector("#ezAuthSubmit");
const authMessage = document.querySelector("#ezAuthMessage");
const switchText = document.querySelector("#ezSwitchText");
const switchModeBtn = document.querySelector("#ezSwitchMode");

let authMode = "login";
let currentSession = null;

function showMessage(text) {
  authMessage.textContent = text;
  authMessage.classList.add("ez-show");
}

function clearMessage() {
  authMessage.textContent = "";
  authMessage.classList.remove("ez-show");
}

function setAuthMode(mode) {
  authMode = mode;
  clearMessage();

  const registering = mode === "signup";
  authKicker.textContent = registering ? "DOŁĄCZ DO EARNZONE" : "TWOJA STREFA NAGRÓD";
  authTitle.textContent = registering ? "Utwórz konto" : "Witaj ponownie!";
  authDesc.textContent = registering
    ? "Załóż konto, aby rozpocząć korzystanie z EarnZone."
    : "Zaloguj się, aby przejść do swojego konta EarnZone.";
  authSubmit.textContent = registering ? "Utwórz konto" : "Zaloguj się";
  passwordInput.autocomplete = registering ? "new-password" : "current-password";
  switchText.textContent = registering ? "Masz już konto?" : "Nie masz jeszcze konta?";
  switchModeBtn.textContent = registering ? "Zaloguj się" : "Zarejestruj się";
}

function openAuth() {
  clearMessage();
  overlay.classList.add("ez-visible");
  document.body.classList.add("ez-lock");

  if (currentSession) {
    authKicker.textContent = "TWOJE KONTO";
    authTitle.textContent = "Jesteś zalogowany";
    authDesc.textContent = currentSession.user.email || "Zalogowano do EarnZone.";
    authForm.style.display = "none";
    switchText.textContent = "";
    switchModeBtn.textContent = "Wyloguj się";
  } else {
    authForm.style.display = "block";
    switchText.textContent = authMode === "signup"
      ? "Masz już konto?"
      : "Nie masz jeszcze konta?";
    switchModeBtn.textContent = authMode === "signup"
      ? "Zaloguj się"
      : "Zarejestruj się";
  }
}

function closeAuth() {
  overlay.classList.remove("ez-visible");
  document.body.classList.remove("ez-lock");
}

document.querySelector("#ezAuthClose").addEventListener("click", closeAuth);
overlay.addEventListener("click", (event) => {
  if (event.target === overlay) closeAuth();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAuth();
});

loginBtn.addEventListener("click", openAuth);

switchModeBtn.addEventListener("click", async () => {
  if (currentSession) {
    switchModeBtn.disabled = true;
    const { error } = await supabaseClient.auth.signOut();
    switchModeBtn.disabled = false;

    if (error) {
      showMessage("Nie udało się wylogować. Spróbuj ponownie.");
      return;
    }

    currentSession = null;
    loginBtn.textContent = "Zaloguj się";
    authForm.reset();
    authForm.style.display = "block";
    setAuthMode("login");
    showMessage("Wylogowano pomyślnie.");
    return;
  }

  setAuthMode(authMode === "login" ? "signup" : "login");
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || password.length < 6) {
    showMessage("Podaj prawidłowy e-mail i hasło mające co najmniej 6 znaków.");
    return;
  }

  authSubmit.disabled = true;
  authSubmit.textContent = authMode === "signup"
    ? "Tworzenie konta..."
    : "Logowanie...";

  try {
    if (authMode === "signup") {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname
        }
      });

      if (error) throw error;

      if (data.session) {
        showMessage("Konto utworzone! Możesz już korzystać z logowania.");
      } else {
        showMessage("Wysłaliśmy prośbę o rejestrację. Sprawdź pocztę i kliknij link potwierdzający, jeśli otrzymasz wiadomość.");
      }
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("Logowanie zakończone pomyślnie.");
      authForm.reset();
    }
  } catch (error) {
    const message = error && error.message ? error.message : "";
    showMessage(
      message.includes("Invalid login credentials")
        ? "Nieprawidłowy e-mail lub hasło."
        : message.includes("User already registered")
        ? "To konto już istnieje. Spróbuj się zalogować."
        : message.includes("Password should be")
        ? "Hasło nie spełnia wymagań. Wybierz inne."
        : message || "Wystąpił błąd. Spróbuj ponownie."
    );
  } finally {
    authSubmit.disabled = false;
    authSubmit.textContent = authMode === "signup"
      ? "Utwórz konto"
      : "Zaloguj się";
  }
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
  currentSession = session;
  loginBtn.textContent = session ? "Moje konto" : "Zaloguj się";

  const accountName = document.querySelector("#account .account-box strong");
  const accountInfo = document.querySelector("#account .account-box .muted");
  const avatar = document.querySelector("#account .avatar");

  if (accountName) {
    accountName.textContent = session
      ? (session.user.email || "Użytkownik EarnZone")
      : "Gość EarnZone";
  }

  if (accountInfo) {
    accountInfo.textContent = session
      ? "Konto połączone z Supabase"
      : "Tryb demonstracyjny";
  }

  if (avatar) {
    avatar.textContent = session && session.user.email
      ? session.user.email.charAt(0).toUpperCase()
      : "G";
  }
});

function render(filter = "all") {
  grid.innerHTML = "";

  offers
    .filter((offer) => filter === "all" || offer.category === filter)
    .forEach((offer) => {
      const done = completed.has(offer.id);
      const card = document.createElement("article");
      card.className = "offer";

      card.innerHTML = `
        <div class="offer-top">
          <span class="offer-icon">${offer.icon}</span>
          <span class="reward">+${offer.reward} EZ</span>
        </div>
        <h3>${offer.title}</h3>
        <p>${offer.description}</p>
        <button class="btn ${done ? "done" : ""}" ${done ? "disabled" : ""}>
          ${done ? "Ukończono ✓" : "Przetestuj zadanie"}
        </button>
      `;

      card.querySelector("button").addEventListener("click", () => {
        if (completed.has(offer.id)) return;

        completed.add(offer.id);
        localStorage.setItem(storageKey, JSON.stringify([...completed]));
        updateBalance();
        render(filter);
      });

      grid.appendChild(card);
    });
}

function updateBalance() {
  balance.textContent = offers
    .filter((offer) => completed.has(offer.id))
    .reduce((total, offer) => total + offer.reward, 0)
    .toLocaleString("pl-PL");
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    render(button.dataset.filter);
  });
});

const resetButton = document.querySelector("#resetBtn");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    completed.clear();
    localStorage.removeItem(storageKey);
    updateBalance();
    render();
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

updateBalance();
render();

supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Nie udało się pobrać sesji Supabase.");
    return;
  }

  currentSession = data.session;
  loginBtn.textContent = currentSession ? "Moje konto" : "Zaloguj się";

  const accountName = document.querySelector("#account .account-box strong");
  const accountInfo = document.querySelector("#account .account-box .muted");
  const avatar = document.querySelector("#account .avatar");

  if (accountName) {
    accountName.textContent = currentSession
      ? (currentSession.user.email || "Użytkownik EarnZone")
      : "Gość EarnZone";
  }

  if (accountInfo) {
    accountInfo.textContent = currentSession
      ? "Konto połączone z Supabase"
      : "Tryb demonstracyjny";
  }

  if (avatar) {
    avatar.textContent = currentSession && currentSession.user.email
      ? currentSession.user.email.charAt(0).toUpperCase()
      : "G";
  }
});
