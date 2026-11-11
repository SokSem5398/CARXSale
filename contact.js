const contactForm = document.querySelector("#contact-form");
const contactFormNote = document.querySelector("#contact-form-note");
document.querySelector("#year").textContent = new Date().getFullYear();

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const emailSubject = encodeURIComponent(`CARX contact: ${subject}`);
  const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  contactFormNote.textContent = "Opening your email app with your message. Please send it there to reach us.";
  window.location.href = `mailto:mrrsem8065@gmail.com?subject=${emailSubject}&body=${emailBody}`;
});
