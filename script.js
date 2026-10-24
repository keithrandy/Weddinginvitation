/* CUSTOMIZE THESE FIRST.
   Wedding date must include Philippine timezone offset +08:00.
   Example: '2027-05-16T15:00:00+08:00'
*/
const SETTINGS = {
  weddingDate: '2026-12-12T10:30:00+08:00', // Leave empty until your wedding date is confirmed
  rsvpEmail: '' // Example: 'your-email@example.com' (must be a real inbox)
};

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const countdownStatus = document.querySelector('#countdown-status');
const ids = ['days', 'hours', 'minutes', 'seconds'];
function updateCountdown() {
  if (!SETTINGS.weddingDate) return;
  const target = new Date(SETTINGS.weddingDate);
  if (Number.isNaN(target.getTime())) {
    countdownStatus.textContent = 'Please enter a valid wedding date in script.js.';
    return;
  }
  const label = new Intl.DateTimeFormat('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  }).format(target);;
  document.querySelector('[data-wedding-date-label]').textContent = label.toUpperCase();
  const difference = target.getTime() - Date.now();
  if (difference <= 0) {
    countdownStatus.textContent = 'Our special day is here!';
    ids.forEach(id => document.getElementById(id).textContent = '00');
    return;
  }
  countdownStatus.textContent = `Counting down to ${label}`;
  const values = [Math.floor(difference / 86400000), Math.floor(difference / 3600000) % 24, Math.floor(difference / 60000) % 60, Math.floor(difference / 1000) % 60];
  ids.forEach((id, index) => document.getElementById(id).textContent = String(values[index]).padStart(2, '0'));
}
updateCountdown();
if (SETTINGS.weddingDate) setInterval(updateCountdown, 1000);


/* =================================
   WEDDING RSVP FORM
================================= */

/* RSVP - SHOW AND HIDE QUESTIONS */

const rsvpForm = document.getElementById("weddingRsvpForm");

if (rsvpForm) {
  const yesFields = document.getElementById("rsvpYesFields");
  const noMessage = document.getElementById("rsvpNoMessage");
  const childCount = document.getElementById("rsvpChildCount");
  const emailField = document.getElementById("rsvpEmail");
  const childNumber = document.getElementById("rsvpChildrenNumber");
  const submitButton = document.getElementById("rsvpSubmit");

  function getAnswer(name) {
    return rsvpForm.querySelector(
      `input[name="${name}"]:checked`
    )?.value || "";
  }

  function updateChildren() {
    const show =
      getAnswer("attendance") === "Yes" &&
      getAnswer("children_invited") === "Yes";

    childCount.hidden = !show;
    childNumber.required = show;
    childNumber.disabled = !show;

    if (!show) childNumber.value = "";
  }

  function updateAttendance() {
    const answer = getAnswer("attendance");
    const isYes = answer === "Yes";

    yesFields.hidden = !isYes;
    noMessage.hidden = answer !== "No";

    emailField.required = isYes;
    emailField.disabled = !isYes;

    submitButton.hidden = !answer;
    submitButton.textContent = isYes
      ? "Submit RSVP"
      : "Send Response";

    updateChildren();
  }

  rsvpForm.querySelectorAll(
    'input[name="attendance"]'
  ).forEach(radio => {
    radio.addEventListener("change", updateAttendance);
  });

  rsvpForm.querySelectorAll(
    'input[name="children_invited"]'
  ).forEach(radio => {
    radio.addEventListener("change", updateChildren);
  });

  updateAttendance();
}

// Optional email notification to the couple
if (NOTIFY_EMAIL) {
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: "Wedding RSVP - " + name,
      body:
        "Name: " + name +
        "\nAttendance: " + attendance +
        "\nEmail: " + email +
        "\nChildren invited: " + childrenInvited +
        "\nChildren attending: " + childrenCount
    });
  } catch (mailError) {
    console.error("Notification failed:", mailError);
  }
}
