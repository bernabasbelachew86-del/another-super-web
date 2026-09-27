const form = document.querySelector('#signup-form');
const message = document.querySelector('#form-message');
const comments = document.querySelector('#comments');
const characterCount = document.querySelector('#character-count');

if (comments && characterCount) {
  comments.addEventListener('input', () => {
    characterCount.textContent = `${comments.value.length} / 500`;
  });
}

if (form && message) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    message.hidden = false;
    message.textContent = 'Demo complete! Your entries were checked in this browser, but nothing was sent or saved.';
    message.focus();
  });
}
