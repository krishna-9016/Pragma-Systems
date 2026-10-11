/**
 * Hero 3D Parallax & Spatial Floating Motion
 * Adds subtle, fluid physics-based mouse tracking to floating hero elements
 */

export function initHeroParallax() {
  const heroSection = document.querySelector('.hero-section');
  const floatingElements = document.querySelectorAll('.floating-element');
  const badge3D = document.querySelector('.badge-3d-box');

  if (!heroSection || floatingElements.length === 0) return;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Depth factors for each floating element to create authentic multi-layer parallax
  const depthFactors = [
    { x: -28, y: -22, rX: 5, rY: -6 },   // Pinned note
    { x: 35, y: -18, rX: -8, rY: 8 },    // Check tile
    { x: -20, y: 30, rX: 6, rY: -4 },    // Tasks card
    { x: 26, y: -28, rX: -6, rY: 7 },    // Timer tile
    { x: -32, y: 18, rX: 4, rY: -6 },    // Reminders card
    { x: 30, y: 26, rX: -5, rY: 6 },     // Integrations card
  ];

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

    // Normalized from -1 to 1 based on hero center
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
    // Smooth lerp (linear interpolation)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    floatingElements.forEach((el, index) => {
      const config = depthFactors[index % depthFactors.length];
      const moveX = currentX * config.x;
      const moveY = currentY * config.y;
      const rotX = currentY * config.rX;
      const rotY = currentX * config.rY;

      // Extract base rotate from existing style or class if any
      const baseRotate = index === 0 ? -6 : index === 1 ? 4 : index === 3 ? 8 : index === 4 ? 2 : 0;
      el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${baseRotate}deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    // Central 3D badge subtle response
    if (badge3D) {
      const bX = currentX * 12;
      const bY = currentY * 10;
      const bRotX = -currentY * 12;
      const bRotY = currentX * 14;
      badge3D.style.transform = `translate3d(${bX}px, ${bY}px, 20px) rotateX(${bRotX}deg) rotateY(${bRotY}deg)`;
    }

    // Continue loop until settled if not hovering
    if (isHovering || Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      rafId = null;
    }
  }

  heroSection.addEventListener('mousemove', onMouseMove, { passive: true });
  heroSection.addEventListener('mouseleave', onMouseLeave, { passive: true });
}
