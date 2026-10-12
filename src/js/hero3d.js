/**
 * Hero 3D Parallax & Magnetic Perspective Motion
 * Adds subtle, fluid physics-based mouse tracking to the editorial spotlight card
 */

export function initHeroParallax() {
  const heroSection = document.querySelector('.editorial-hero-section') || document.querySelector('.hero-section');
  const spotlightCard = document.querySelector('.editorial-spotlight-card') || document.querySelector('.badge-3d-box');

  if (!heroSection || !spotlightCard) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isHovering = false;
  let rafId = null;

  function onMouseMove(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX = (x / rect.width - 0.5) * 2;
    mouseY = (y / rect.height - 0.5) * 2;
    isHovering = true;

    if (!rafId) {
      rafId = requestAnimationFrame(updateParallax);
    }
  }

  function onMouseLeave() {
    isHovering = false;
    mouseX = 0;
    mouseY = 0;
  }

  function updateParallax() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (spotlightCard) {
      const bX = currentX * 10;
      const bY = currentY * 8;
      const bRotX = -currentY * 12;
      const bRotY = currentX * 14;
      spotlightCard.style.transform = `translate3d(${bX}px, ${bY}px, 0) rotateX(${bRotX}deg) rotateY(${bRotY}deg)`;
    }

    if (isHovering || Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
  heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });
}
