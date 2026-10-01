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

/*    DEMO SUBMIT  */

document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const button = this.querySelector(".main-btn");
    const oldText = button.textContent;
    button.textContent = "✓ SUCCESS";
    setTimeout(() => {
      button.textContent = oldText;
    }, 1800);
  });
});