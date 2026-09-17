

const bookingDateTimeInputs = document.querySelectorAll(
  'input[type="date"], input[type="time"]',
);

bookingDateTimeInputs.forEach((input) => {
  input.addEventListener("click", () => {
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  });
});

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

const bookingModal = document.querySelector(".booking-modal");

const bookingTriggers = document.querySelectorAll(
  ".booking-modal__trigger, .online-booking__trigger",
);

const bookingCancel = document.querySelector(".booking-modal__cancel");

const modalSessionName = document.querySelector(".booking-modal__session-name");

const modalSessionDescription = document.querySelector(
  ".booking-modal__session-description",
);

const modalSessionDuration = document.querySelector(
  ".booking-modal__session-duration",
);

const modalSessionPrice = document.querySelector(
  ".booking-modal__session-price",
);

const modalImage = document.querySelector(".booking-modal__image");

const bookingModalTitle = document.querySelector(".booking-modal__title");

const bookingSubmitText = document.querySelector("#booking-submit-text");
const bookingSubmitButton = document.querySelector("#booking-submit-button");
const bookingSubmitIcon = document.querySelector("#booking-submit-icon");

// ========================================
// OPEN BOOKING MODAL
// ========================================

bookingTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const card = trigger.closest(".therapy-card, .therapy-card_online");

    if (!card) return;

    // ========================================
    // CHECK IF ONLINE
    // ========================================

    const isOnline = trigger.classList.contains("online-booking__trigger");

    // ========================================
    // MODAL TITLE
    // ========================================

    if (isOnline) {
      bookingSubmitText.textContent = "Book Online Session";
    } else {
      bookingSubmitText.textContent = "Book This Session";
    }

    // ========================================
    // SUBMIT BUTTON TEXT
    // ========================================
    if (isOnline) {
      bookingSubmitText.textContent = "Book Online Session";

      bookingSubmitIcon.className = "fa-solid fa-video";

      bookingSubmitButton.classList.remove("button--primary");

      bookingSubmitButton.classList.add("button--online");
    } else {
      bookingSubmitText.textContent = "Book This Session";

      bookingSubmitIcon.className = "fa-regular fa-calendar-days";

      bookingSubmitButton.classList.remove("button--online");

      bookingSubmitButton.classList.add("button--primary");
    }

    // ========================================
    // THERAPY NAME
    // ========================================

    const sessionName = card
      .querySelector(".therapy-card__title")
      ?.textContent.trim();

    if (sessionName) {
      modalSessionName.textContent = sessionName;
    }

    // ========================================
    // THERAPY DESCRIPTION
    // ========================================

    const sessionDescription = card
      .querySelector(".therapy-card__subtitle")
      ?.textContent.trim()
      .replace(/^\(|\)$/g, "");

    if (sessionDescription) {
      modalSessionDescription.textContent = sessionDescription;
    }

    // ========================================
    // SESSION / PRICE / DURATION
    // ========================================

    const selectedInput = card.querySelector(".session-card input:checked");

    const sessionCard = selectedInput
      ? selectedInput.closest(".session-card")
      : card.querySelector(".session-card");

    if (sessionCard) {
      const duration = sessionCard
        .querySelector(".session-card__duration")
        ?.textContent.trim();

      const price = sessionCard
        .querySelector(".session-card__price")
        ?.textContent.trim();

      if (duration) {
        modalSessionDuration.textContent = duration;
      }

      if (price) {
        modalSessionPrice.textContent = price;
      }
    }

    // ========================================
    // IMAGE
    // ========================================

    const cardImage = card.querySelector(
      ".therapy-card__image img, .therapy-card__image_online img",
    );

    if (cardImage && modalImage) {
      modalImage.src = cardImage.src;

      modalImage.alt = cardImage.alt || sessionName;
    }

    // ========================================
    // OPEN MODAL
    // ========================================

    bookingModal.classList.add("booking-modal--is-open");
  });
});

// ========================================
// CLOSE MODAL
// ========================================

bookingCancel.addEventListener("click", () => {
  bookingModal.classList.remove("booking-modal--is-open");
});

// ========================================
// ESCAPE
// ========================================

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    bookingModal.classList.remove("booking-modal--is-open");
  }
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
  "service_bj1iwac",
  "template_h2im7vx",
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
/* ========================================
   CLOSE CONTACT MODAL
======================================== */

contactClose.addEventListener("click", () => {
  contactModal.classList.remove("contact-modal--is-open");
});

/* ========================================
   CLOSE WITH ESC
======================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    contactModal.classList.remove("contact-modal--is-open");
  }
});
document.querySelectorAll(".session-card_").forEach((card) => {

  const radio = card.querySelector('input[type="radio"]');

  radio.addEventListener("change", () => {

    const options = card.closest(".therapy-card__options");

    options
      .querySelectorAll(".session-card")
      .forEach((item) => {
        item.classList.remove("session-card--selected");
      });

    if (radio.checked) {
      card.classList.add("session-card--selected");
    }

  });

});