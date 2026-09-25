/**
 * Ashwin E — Portfolio interactions
 *
 * Add your real profile links once, here. Leave a value blank to keep the
 * corresponding development placeholder message in the interface.
 */
const SITE_CONFIG = Object.freeze({
  email: "",
  linkedin: "",
  github: "",
  resumeUrl: "assets/ashwin-e-resume.pdf",
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const header = document.querySelector("#site-header");
const navToggle = document.querySelector("#nav-toggle");
const navMenu = document.querySelector("#nav-menu");
const progressBar = document.querySelector("#scroll-progress-bar");
const toast = document.querySelector("#toast");
const toastMessage = document.querySelector("#toast-message");
let toastTimer;

/** Display a short, accessible status message. */
function showToast(message, type = "success") {
  if (!toast || !toastMessage) return;

  window.clearTimeout(toastTimer);
  toastMessage.textContent = message;
  toast.classList.toggle("is-error", type === "error");
  toast.classList.add("is-visible");

  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 4200);
}

/* Header, progress, and mobile navigation */
function setMenu(open) {
  if (!navMenu || !navToggle) return;

  navMenu.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("menu-open", open);
}

navToggle?.addEventListener("click", () => {
  setMenu(navToggle.getAttribute("aria-expanded") !== "true");
});

document.querySelectorAll(".nav-link, .nav-contact").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navToggle?.getAttribute("aria-expanded") === "true") {
    setMenu(false);
    navToggle.focus();
  }
});

document.querySelector("main")?.addEventListener("click", () => {
  if (navToggle?.getAttribute("aria-expanded") === "true") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 880) setMenu(false);
});

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
let scrollFrame;

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? Math.min(scrollTop / scrollableHeight, 1) : 0;

  header?.classList.toggle("is-scrolled", scrollTop > 16);
  if (progressBar) progressBar.style.width = `${progress * 100}%`;

  const marker = scrollTop + Math.min(window.innerHeight * 0.38, 330);
  let currentId = sections[0]?.id;

  sections.forEach((section) => {
    if (section.offsetTop <= marker) currentId = section.id;
  });

  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  scrollFrame = null;
}

function requestScrollUpdate() {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(updateScrollUI);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("load", requestScrollUpdate);
updateScrollUI();

/* Reveal sections as they enter the viewport */
const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  revealElements.forEach((element, index) => {
    if (element.closest(".hero")) {
      element.style.transitionDelay = `${Math.min(index * 70, 350)}ms`;
    }
    revealObserver.observe(element);
  });
}

/* Subtle pointer-driven depth for the hero visual */
const heroVisual = document.querySelector("#hero-visual");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

function resetHeroTilt() {
  if (!heroVisual) return;
  heroVisual.style.setProperty("--rotate-x", "0deg");
  heroVisual.style.setProperty("--rotate-y", "0deg");
}

if (heroVisual && finePointer.matches && !prefersReducedMotion.matches) {
  heroVisual.addEventListener("pointermove", (event) => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroVisual.style.setProperty("--rotate-y", `${x * 5}deg`);
    heroVisual.style.setProperty("--rotate-x", `${y * -4}deg`);
  });

  heroVisual.addEventListener("pointerleave", resetHeroTilt);
}

/* Contact links */
const contactDisplay = {
  email: SITE_CONFIG.email || "Add your email",
  linkedin: SITE_CONFIG.linkedin ? "View LinkedIn profile" : "Connect with me",
  github: SITE_CONFIG.github ? "View GitHub profile" : "View my work",
};

document.querySelectorAll("[data-contact-value]").forEach((element) => {
  const key = element.dataset.contactValue;
  if (contactDisplay[key]) element.textContent = contactDisplay[key];
});

document.querySelectorAll("[data-contact-method]").forEach((button) => {
  button.addEventListener("click", () => {
    const method = button.dataset.contactMethod;
    const value = SITE_CONFIG[method];

    if (!value) {
      showToast(`Add your ${method} address in SITE_CONFIG at the top of script.js.`, "error");
      return;
    }

    if (method === "email") {
      window.location.href = `mailto:${value}`;
      return;
    }

    window.open(value, "_blank", "noopener,noreferrer");
  });
});

/* Contact form: opens the visitor's email app with a prepared message */
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonContent = submitButton.innerHTML;
  const formData = new FormData(contactForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const subject = formData.get("subject").trim();
  const message = formData.get("message").trim();

  if (!SITE_CONFIG.email) {
    formStatus.textContent = "The form is ready — add your email in SITE_CONFIG to enable sending.";
    formStatus.className = "form-status is-error";
    showToast("Add your email address in SITE_CONFIG to enable the contact form.", "error");
    return;
  }

  const emailSubject = `Portfolio message from ${name}: ${subject}`;
  const emailBody = [
    `Hi Ashwin,`,
    "",
    message,
    "",
    `From: ${name}`,
    `Email: ${email}`,
  ].join("\n");

  const mailtoUrl = `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  formStatus.textContent = "Opening your email application…";
  formStatus.className = "form-status is-success";
  submitButton.disabled = true;
  submitButton.textContent = "Preparing message…";
  window.location.href = mailtoUrl;

  window.setTimeout(() => {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonContent;
  }, 1800);
});

/* Resume download */
document.querySelectorAll("[data-resume-button]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!SITE_CONFIG.resumeUrl) {
      showToast("Add a resume file path to SITE_CONFIG to enable this button.", "error");
      return;
    }

    const link = document.createElement("a");
    link.href = SITE_CONFIG.resumeUrl;
    link.download = "Ashwin-E-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});

/* Project details */
const projectDetails = {
  ewaste: {
    kicker: "Sustainability technology · Prototype",
    title: "E-Waste Smart Collection System",
    summary:
      "A smart collection concept that encourages people to return unused electronics and makes the path toward responsible recycling clearer.",
    focus:
      "The project explores how a digital collection experience and smart automation can reduce the friction involved in returning e-waste.",
    approach: [
      "Make device collection easy to understand and access.",
      "Use technology to support sorting and collection decisions.",
      "Connect users, collection points, and responsible recycling.",
    ],
    tags: ["IoT", "AI", "Automation", "Sustainability"],
  },
  "ai-project": {
    kicker: "Generative AI · Practical solution",
    title: "AI-Based Practical Solution",
    summary:
      "An AI-focused project that demonstrates a repeatable process for turning a Generative AI concept into a useful, testable digital solution.",
    focus:
      "The focus is on applying AI to a real need while keeping the process structured, testable, and understandable.",
    approach: [
      "Define a meaningful problem before choosing a tool.",
      "Create, evaluate, and refine prompts with clear outcomes.",
      "Iterate on the result and identify practical limitations.",
    ],
    tags: ["Python", "Generative AI", "Prompt Engineering", "AI"],
  },
};

const projectDialog = document.querySelector("#project-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogSummary = document.querySelector("#dialog-summary");
const dialogFocus = document.querySelector("#dialog-focus");
const dialogApproach = document.querySelector("#dialog-approach");
const dialogTags = document.querySelector("#dialog-tags");
let activeProjectTrigger = null;

function openProjectDialog(projectKey, trigger) {
  const project = projectDetails[projectKey];
  if (!project || !projectDialog || typeof projectDialog.showModal !== "function") {
    showToast("Project details are not available in this browser.", "error");
    return;
  }

  activeProjectTrigger = trigger;
  dialogKicker.textContent = project.kicker;
  dialogTitle.textContent = project.title;
  dialogSummary.textContent = project.summary;
  dialogFocus.textContent = project.focus;
  dialogApproach.replaceChildren(
    ...project.approach.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }),
  );
  dialogTags.replaceChildren(
    ...project.tags.map((tag) => {
      const tagElement = document.createElement("span");
      tagElement.textContent = tag;
      return tagElement;
    }),
  );

  projectDialog.showModal();
  document.body.classList.add("dialog-open");
}

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => openProjectDialog(button.dataset.project, button));
});

document.querySelector("[data-dialog-close]")?.addEventListener("click", () => projectDialog?.close());

document.querySelector("[data-dialog-contact]")?.addEventListener("click", () => {
  projectDialog?.close();
  document.querySelector("#contact")?.scrollIntoView({ behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
  window.setTimeout(() => document.querySelector("#name")?.focus(), prefersReducedMotion.matches ? 0 : 550);
});

projectDialog?.addEventListener("click", (event) => {
  if (event.target === projectDialog) projectDialog.close();
});

projectDialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  activeProjectTrigger?.focus();
  activeProjectTrigger = null;
});

/* Footer year */
const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();
