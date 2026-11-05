function flipCard() {
  const card = document.getElementById("authCard");
  card.classList.toggle("flipped");
}

function togglePassword(id, button) {
  const input = document.getElementById(id);
  const icon = button.querySelector("i");

  if (!input || !icon) return;

  const showingPassword = input.type === "password";
  input.type = showingPassword ? "text" : "password";
  icon.classList.toggle("fa-eye", !showingPassword);
  icon.classList.toggle("fa-eye-slash", showingPassword);
}

const accountsStorageKey = "loginDemoAccounts";
const rememberMeStorageKey = "loginRememberMe";
const localAuthStorageKey = "loginDemoAuth";
const sessionAuthStorageKey = "loginDemoSession";

function showMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function readAccounts() {
  const savedAccounts = localStorage.getItem(accountsStorageKey);
  if (!savedAccounts) return [];

  const accounts = JSON.parse(savedAccounts);
  if (!Array.isArray(accounts)) {
    throw new Error("Saved demo accounts have an invalid format.");
  }
  return accounts;
}

async function hashPassword(password) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function setDemoSession(account, rememberMe) {
  const session = JSON.stringify({
    email: account.email,
    name: account.name,
  });

  localStorage.removeItem(localAuthStorageKey);
  sessionStorage.removeItem(sessionAuthStorageKey);
  if (rememberMe) {
    localStorage.setItem(localAuthStorageKey, session);
  } else {
    sessionStorage.setItem(sessionAuthStorageKey, session);
  }
}

const rememberMeInput = document.getElementById("rememberMe");
if (rememberMeInput) {
  rememberMeInput.checked =
    localStorage.getItem(rememberMeStorageKey) === "true";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    if (!loginForm.reportValidity()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const message = document.getElementById("loginMessage");
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const rememberMe = rememberMeInput.checked;

    try {
      const accounts = readAccounts();
      const passwordHash = await hashPassword(password);
      const account = accounts.find(
        (savedAccount) =>
          savedAccount.email === email &&
          savedAccount.passwordHash === passwordHash,
      );

      if (!account) {
        showMessage(message, "Email or password is incorrect.", true);
        return;
      }

      localStorage.setItem(rememberMeStorageKey, String(rememberMe));
      setDemoSession(account, rememberMe);
      window.location.assign("dashboard.html");
    } catch (error) {
      showMessage(
        message,
        `Unable to sign in: ${error.message || "browser storage is unavailable."}`,
        true,
      );
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    if (!signupForm.reportValidity()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    const message = document.getElementById("signupMessage");
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email) {
      showMessage(message, "Enter your name and email address.", true);
      return;
    }

    if (password !== confirmPassword) {
      showMessage(message, "Passwords do not match.", true);
      return;
    }

    try {
      const accounts = readAccounts();
      if (accounts.some((account) => account.email === email)) {
        showMessage(message, "An account with this email already exists.", true);
        return;
      }

      accounts.push({ name, email, passwordHash: await hashPassword(password) });
      localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
      document.getElementById("loginEmail").value = email;
      flipCard();
      showMessage(
        document.getElementById("loginMessage"),
        "Demo account created. Sign in to continue.",
      );
      signupForm.reset();
    } catch (error) {
      showMessage(
        message,
        `Unable to create the account: ${error.message || "browser storage is unavailable."}`,
        true,
      );
    }
  });
}

if (document.body.dataset.page === "dashboard") {
  let session;
  try {
    const savedSession =
      localStorage.getItem(localAuthStorageKey) ||
      sessionStorage.getItem(sessionAuthStorageKey);
    session = savedSession ? JSON.parse(savedSession) : null;
  } catch (error) {
    console.error("Could not read the demo login session.", error);
  }

  if (!session || typeof session.name !== "string") {
    window.location.replace("index.html");
  } else {
    document.getElementById("dashboardWelcome").textContent =
      `Welcome, ${session.name}!`;
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem(localAuthStorageKey);
      sessionStorage.removeItem(sessionAuthStorageKey);
      window.location.replace("index.html");
    });
  }
}
