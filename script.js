// ===== Tema claro / oscuro =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");

function getStoredTheme() {
  try { return localStorage.getItem("theme"); } catch { return null; }
}

const initialTheme =
  getStoredTheme() ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
root.setAttribute("data-theme", initialTheme);

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch {}
});

// ===== Menú móvil =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", open);
});

navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

// ===== Navbar al hacer scroll y botón "volver arriba" =====
const nav = document.getElementById("nav");
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 500);
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Efecto de escritura =====
const phrases = [
  "en la UNASAM 🎓",
  "apasionado por la tecnología 💡",
  "desarrollador web en formación 💻",
  "siempre aprendiendo 🚀",
];
const typed = document.getElementById("typed");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = Array.from(phrases[phraseIndex]);
  typed.textContent = current.slice(0, charIndex).join("");

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(type, 70);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1800);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 35);
  } else {
    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 300);
  }
}
type();

// ===== Animaciones al aparecer en pantalla =====
function animateCounter(el) {
  const target = Number(el.dataset.target);
  const duration = 1500;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");
      el.querySelectorAll(".bar__fill").forEach((bar) => (bar.style.width = bar.dataset.level + "%"));
      el.querySelectorAll(".stat__num").forEach(animateCounter);
      observer.unobserve(el);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== Enlace activo en el menú =====
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.querySelectorAll("a").forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => sectionObserver.observe(s));

// ===== Año del footer =====
document.getElementById("year").textContent = new Date().getFullYear();
