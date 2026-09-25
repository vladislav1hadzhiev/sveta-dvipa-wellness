
const heroDescription = document.querySelector("#heroDescription");
const readMoreBtn = document.querySelector("#readMoreBtn");
const readMoreIcon = readMoreBtn.querySelector("i");

readMoreBtn.addEventListener("click", () => {
  const isExpanded = heroDescription.classList.contains("expanded");

  if (isExpanded) {
    heroDescription.classList.remove("expanded");
    heroDescription.classList.add("collapsed");

    readMoreBtn.firstChild.textContent = "Read more ";

    readMoreIcon.classList.remove("fa-arrow-up");
    readMoreIcon.classList.add("fa-arrow-down");
  } else {
    heroDescription.classList.remove("collapsed");
    heroDescription.classList.add("expanded");

    readMoreBtn.firstChild.textContent = "Read less ";

    readMoreIcon.classList.remove("fa-arrow-down");
    readMoreIcon.classList.add("fa-arrow-up");
  }
});

const menuBtn = document.querySelector(".header__menu-toggle");
const nav = document.querySelector(".navigation");

menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("active");
  nav.classList.toggle("active");
});


document.addEventListener("DOMContentLoaded", () => {
  const journeySlider = document.querySelector(".journey__slider");
  const journeyTrack = document.querySelector(".journey__track");
  const journeyCards = Array.from(document.querySelectorAll(".journey-card"));
  const previousButton = document.querySelector(".journey__button--prev");
  const nextButton = document.querySelector(".journey__button--next");

  if (
    !journeySlider ||
    !journeyTrack ||
    !journeyCards.length ||
    !previousButton ||
    !nextButton
  ) {
    console.error("Journey slider: missing HTML element.");
    return;
  }

  let currentSlide = 0;

  function getSliderValues() {
    const cardWidth = journeyCards[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(journeyTrack).gap) || 0;

    const cardStep = cardWidth + gap;
    const visibleCards = Math.max(
      1,
      Math.floor(journeySlider.clientWidth / cardStep),
    );

    const maxSlide = Math.max(0, journeyCards.length - visibleCards);

    return { cardStep, maxSlide };
  }

  function updateJourneySlider() {
    const { cardStep, maxSlide } = getSliderValues();

    currentSlide = Math.min(currentSlide, maxSlide);

    journeyTrack.style.transform = `translateX(-${currentSlide * cardStep}px)`;

    previousButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === maxSlide;
  }

  nextButton.addEventListener("click", () => {
    const { maxSlide } = getSliderValues();

    if (currentSlide < maxSlide) {
      currentSlide += 1;
      updateJourneySlider();
    }
  });

  previousButton.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateJourneySlider();
    }
  });

  window.addEventListener("resize", updateJourneySlider);

  updateJourneySlider();

  let touchStartX = 0;
  let touchStartY = 0;

  journeySlider.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    },
    { passive: true },
  );

  journeySlider.addEventListener(
    "touchend",
    (event) => {
      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const horizontalDistance = touchEndX - touchStartX;
      const verticalDistance = touchEndY - touchStartY;
      const swipeThreshold = 50;

      const isHorizontalSwipe =
        Math.abs(horizontalDistance) > swipeThreshold &&
        Math.abs(horizontalDistance) > Math.abs(verticalDistance);

      if (!isHorizontalSwipe) return;

      if (horizontalDistance < 0) {
        nextButton.click();
      } else {
        previousButton.click();
      }
    },
    { passive: true },
  );
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

const contactModal = document.querySelector(".contact-modal");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const contactClose = document.querySelector(".contact-modal__close");

const serviceInput = document.querySelector("#service");
const messageInput = document.querySelector("#message");




// ========================================
// ONLINE THERAPY
// ========================================

const onlineBookingTriggers = document.querySelectorAll(
  ".online-booking__trigger"
);

const contactSubmitButton = document.querySelector(
  "#contact-form button[type='submit']"
);

onlineBookingTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    const card = trigger.closest(".therapy-card_online");

    if (!card) {
      console.error("Online therapy card not found.");
      return;
    }

    const service = card.dataset.service;
    const duration = card.dataset.duration;
    const price = card.dataset.price;
    const session = card.dataset.session;

    console.log("ONLINE BOOKING");
    console.log("Service:", service);
    console.log("Duration:", duration);
    console.log("Price:", price);
    console.log("Session:", session);

    serviceInput.value = service;

    messageInput.value =
      `Hello, I am interested in an online ${service} session.\n\n` +
      `Session: ${session}\n` +
      `Duration: ${duration} min\n` +
      `Price: €${price}\n\n` +
      `I would like to send a request for an online session.`;

    if (contactSubmitButton) {
      contactSubmitButton.textContent = "Request Online Session";
    }

    contactModal.classList.add("contact-modal--is-open");
  });
});

// ========================================
// CLOSE CONTACT MODAL
// ========================================

contactClose.addEventListener("click", () => {
  contactModal.classList.remove("contact-modal--is-open");
});
/* ========================================
   OPEN CONTACT MODAL
======================================== */

contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    
    const service = trigger.dataset.service;

    serviceInput.value = service;

    messageInput.value = `Hello, I am interested in ${service}. I would like to receive more information.`;

    contactModal.classList.add("contact-modal--is-open");
  });
});
/* ========================================
   EMAILJS
======================================== */

emailjs.init({
  publicKey: "C9lKxIcMlLcPw7Qyq"
});

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  formStatus.textContent = "Sending...";
  formStatus.className = "form-status";

  emailjs.sendForm(
  "service_ezhob2u",
  "template_t0s1jyi",
  contactForm
)
  .then(() => {
    formStatus.textContent =
      "Your message has been sent successfully.";

    formStatus.classList.add("success");

    contactForm.reset();
  })
  .catch((error) => {
    console.error("EmailJS error:", error);
    console.error("Status:", error.status);
    console.error("Text:", error.text);

    formStatus.textContent =
      "Something went wrong. Please try again.";

    formStatus.classList.add("error");
  });
});

// ========================================
// BOOKING FROM THERAPY CARDS
// ========================================

const bookingTriggers = document.querySelectorAll(".booking-trigger");

bookingTriggers.forEach((trigger) => {

  trigger.addEventListener("click", (event) => {

    event.preventDefault();

    // Works with BOTH card types
    const card = trigger.closest(
      ".therapy-card, .therapy-card_online"
    );

    if (!card) {
      console.error("Therapy card not found.");
      return;
    }

    // ========================================
    // GET SERVICE
    // ========================================

    const service =
      card.dataset.service ||
      card.querySelector(".therapy-card__title")?.textContent.trim();

    // ========================================
    // GET SESSION DATA
    // ========================================

    const selectedSession =
      card.querySelector(".session-card input:checked");

    const sessionCard = selectedSession
      ? selectedSession.closest(".session-card")
      : card.querySelector(".session-card");

    const duration =
      card.dataset.duration ||
      sessionCard?.querySelector(".session-card__duration")?.textContent.trim();

    const price =
      card.dataset.price
        ? `€${card.dataset.price}`
        : sessionCard?.querySelector(".session-card__price")?.textContent.trim();

    const session =
      card.dataset.session ||
      sessionCard?.querySelector(".session-card__name")?.textContent.trim();

    // ========================================
    // CONTACT MODAL
    // ========================================

    const contactModal = document.querySelector(".contact-modal");
    const serviceInput = document.querySelector("#service");
    const messageInput = document.querySelector("#message");

    if (!contactModal || !serviceInput || !messageInput) {
      console.error("Contact modal elements not found.");
      return;
    }

    // ========================================
    // RESET SUBMIT BUTTON
    // ========================================

    if (contactSubmitButton) {
      contactSubmitButton.textContent = "Send Message";
    }

    // ========================================
    // SERVICE
    // ========================================

    serviceInput.value = service;

    // ========================================
    // MESSAGE
    // ========================================

    messageInput.value =
      `Hello, I am interested in ${service}. ` +
      `I would like to book this session.\n\n` +
      `Session: ${session}\n` +
      `Duration: ${duration}\n` +
      `Price: ${price}`;

    // ========================================
    // OPEN CONTACT MODAL
    // ========================================

    contactModal.classList.add("contact-modal--is-open");

  });

});