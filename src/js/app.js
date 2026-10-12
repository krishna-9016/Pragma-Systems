import { initHeroParallax } from './hero3d.js';
import { initExplorer } from './explorer.js';

/**
 * Main Application Orchestrator
 * Seamless view switching, route handling, and micro-interactions
 */

function setupRouting() {
  const homeView = document.getElementById('view-home');
  const explorerView = document.getElementById('view-explorer');
  const navLinkHome = document.getElementById('nav-link-home');
  const navLinkIndustries = document.getElementById('nav-link-industries');
  const navCtaBtn = document.getElementById('nav-cta-btn');
  const heroCtaBtn = document.getElementById('hero-cta-btn');
  const brandLogo = document.getElementById('brand-logo');

  function showPage(pageId, pushState = true) {
    if (pageId === 'explorer' || pageId === 'industries') {
      if (homeView) homeView.classList.add('hidden');
      if (explorerView) {
        explorerView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (navLinkHome) navLinkHome.classList.remove('active');
      if (navLinkIndustries) navLinkIndustries.classList.add('active');
      if (pushState && window.location.hash !== '#/industries') {
        history.pushState(null, '', '#/industries');
      }
      document.title = 'Explore Industries — Pragma Systems';
    } else {
      if (explorerView) explorerView.classList.add('hidden');
      if (homeView) {
        homeView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (navLinkIndustries) navLinkIndustries.classList.remove('active');
      if (navLinkHome) navLinkHome.classList.add('active');
      if (pushState && window.location.hash !== '#/' && window.location.hash !== '') {
        history.pushState(null, '', '#/');
      }
      document.title = 'Pragma Systems — Digital Experiences for Every Industry';
    }
  }

  // Handle URL Hash on Initial Load & Popstate
  function handleHash() {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('industries') || hash.includes('explorer')) {
      showPage('explorer', false);
    } else {
      showPage('home', false);
    }
  }

  window.addEventListener('hashchange', handleHash);
  window.addEventListener('popstate', handleHash);

  // Wire CTA & Navigation Clicks
  const editorialExploreBtn = document.getElementById('editorial-explore-btn');

  if (editorialExploreBtn) {
    editorialExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('explorer');
    });
  }

  if (heroCtaBtn) {
    heroCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('explorer');
    });
  }

  if (navCtaBtn) {
    navCtaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('explorer');
    });
  }

  if (navLinkIndustries) {
    navLinkIndustries.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('explorer');
    });
  }

  if (navLinkHome) {
    navLinkHome.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('home');
    });
  }

  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('home');
    });
  }

  // Initial Check
  handleHash();
}

document.addEventListener('DOMContentLoaded', () => {
  setupRouting();
  initHeroParallax();
  initExplorer();
});
