import { INDUSTRIES_DATA } from '../data/industries.js';

/**
 * Industry Explorer Controller
 * Clean, modern, aesthetic implementation with 3D card physics,
 * fully responsive mobile sheet dropdown, and zero cluttered section numbering.
 */
export function initExplorer() {
  const sectionsContainer = document.getElementById('industry-sections-container') || document.getElementById('portfolio-grid');
  const searchInput = document.getElementById('industry-search');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resultsCount = document.getElementById('results-count');
  
  // Dropdown Elements
  const dropdownWrapper = document.getElementById('sector-dropdown-wrapper');
  const btnDropdown = document.getElementById('btn-sector-dropdown');
  const dropdownMenu = document.getElementById('sector-dropdown-menu');
  const dropdownGrid = document.getElementById('dropdown-sectors-grid');
  const btnResetAll = document.getElementById('btn-dropdown-reset-all');
  const activeLabel = document.getElementById('dropdown-active-label');
  const dropdownBackdrop = document.getElementById('sector-dropdown-backdrop');
  
  // Active Filter Chip Elements
  const activeFilterBadge = document.getElementById('active-filter-badge');
  const activeFilterText = document.getElementById('active-filter-text');
  const btnClearActiveFilter = document.getElementById('btn-clear-active-filter');

  if (!sectionsContainer) return;

  let selectedIndustryId = 'all';
  let searchQuery = '';

  // 2. Setup Sector Mega-Dropdown Popover & Mobile Sheet
  function setupDropdown() {
    if (!btnDropdown || !dropdownMenu || !dropdownGrid) return;

    // Populate all 15 clean sectors inside the menu (clean titles with modern dot indicators)
    dropdownGrid.innerHTML = INDUSTRIES_DATA.map(ind => `
      <button type="button" class="sector-item-btn ${selectedIndustryId === ind.id ? 'active' : ''}" data-id="${ind.id}">
        <span class="item-bullet-dot"></span>
        <span class="item-title-text">${ind.title}</span>
      </button>
    `).join('');

    // Toggle Dropdown open/close
    btnDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdownMenu.classList.contains('visible');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    // Close on mobile backdrop tap
    if (dropdownBackdrop) {
      dropdownBackdrop.addEventListener('click', () => {
        closeDropdown();
      });
    }

    // Sector selection inside dropdown
    dropdownGrid.querySelectorAll('.sector-item-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const indId = btn.dataset.id;
        selectIndustry(indId);
        closeDropdown();
      });
    });

    // Reset All button inside dropdown
    if (btnResetAll) {
      btnResetAll.addEventListener('click', (e) => {
        e.stopPropagation();
        selectIndustry('all');
        closeDropdown();
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (dropdownWrapper && !dropdownWrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    });

    // Reposition on window resize if open
    window.addEventListener('resize', () => {
      if (dropdownMenu && dropdownMenu.classList.contains('visible')) {
        positionDropdown();
      }
    });
  }

  function positionDropdown() {
    if (!dropdownMenu || !btnDropdown) return;
    if (window.innerWidth <= 768) {
      dropdownMenu.style.left = '';
      dropdownMenu.style.right = '';
      dropdownMenu.style.width = '';
      return;
    }

    const btnRect = btnDropdown.getBoundingClientRect();
    const availableWidth = window.innerWidth - 32;
    const targetWidth = Math.min(650, availableWidth);
    dropdownMenu.style.width = `${targetWidth}px`;

    // Calculate left edge if aligned with button's right edge
    const leftIfRightAligned = btnRect.right - targetWidth;

    if (leftIfRightAligned >= 16) {
      // Safe to align right so it never overflows the right screen margin
      dropdownMenu.style.right = '0';
      dropdownMenu.style.left = 'auto';
    } else {
      // Clamp safely within the screen margin
      const leftOffset = -(btnRect.left - 16);
      dropdownMenu.style.left = `${leftOffset}px`;
      dropdownMenu.style.right = 'auto';
    }
  }

  function openDropdown() {
    if (dropdownMenu) {
      positionDropdown();
      dropdownMenu.classList.add('visible');
      if (dropdownBackdrop) dropdownBackdrop.classList.add('visible');
      if (btnDropdown) {
        btnDropdown.classList.add('open');
        btnDropdown.setAttribute('aria-expanded', 'true');
      }
    }
  }

  function closeDropdown() {
    if (dropdownMenu) {
      dropdownMenu.classList.remove('visible');
      if (dropdownBackdrop) dropdownBackdrop.classList.remove('visible');
      if (btnDropdown) {
        btnDropdown.classList.remove('open');
        btnDropdown.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // 3. Select Industry Handler
  function selectIndustry(industryId, shouldScroll = false) {
    selectedIndustryId = industryId;

    // Update Dropdown Buttons active class
    if (dropdownGrid) {
      dropdownGrid.querySelectorAll('.sector-item-btn').forEach(btn => {
        if (btn.dataset.id === selectedIndustryId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Update Dropdown Trigger label & Active Filter Chip
    if (selectedIndustryId === 'all') {
      if (activeLabel) activeLabel.textContent = 'All Industries';
      if (activeFilterBadge) activeFilterBadge.style.display = 'none';
    } else {
      const selectedInd = INDUSTRIES_DATA.find(i => i.id === selectedIndustryId);
      if (selectedInd) {
        if (activeLabel) activeLabel.textContent = selectedInd.title;
        if (activeFilterText) activeFilterText.textContent = selectedInd.title;
        if (activeFilterBadge) activeFilterBadge.style.display = 'inline-flex';
      }
    }

    filterAndRender();

    // Smooth scroll to top of explorer if requested
    if (shouldScroll) {
      const explorerHeader = document.querySelector('.explorer-header');
      if (explorerHeader) {
        explorerHeader.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Wire clear button on the active filter chip
  if (btnClearActiveFilter) {
    btnClearActiveFilter.addEventListener('click', () => {
      selectIndustry('all');
    });
  }

  // Helper to escape regex special characters
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Helper to highlight matching text
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // 4. Attach 3D Card Hover Physics
  function attachCardPhysics() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = sectionsContainer.querySelectorAll('.concept-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -6;
        const rotY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
      });
    });
  }

// Module-level progressive image handlers
if (typeof window !== 'undefined') {
  window.pragmaImageLoad = function(img) {
    img.classList.add('loaded');
    const ph = img.nextElementSibling;
    if (ph && ph.classList.contains('ph-placeholder-inner')) {
      ph.style.opacity = '0';
      ph.style.pointerEvents = 'none';
    }
  };

  window.pragmaImageError = function(img) {
    try {
      const list = JSON.parse(img.getAttribute('data-candidates') || '[]');
      let idx = parseInt(img.getAttribute('data-c-idx') || '0', 10);
      idx++;
      if (idx < list.length) {
        img.setAttribute('data-c-idx', idx.toString());
        img.src = list[idx];
      } else {
        img.classList.remove('loaded');
        img.style.display = 'none';
        const ph = img.nextElementSibling;
        if (ph && ph.classList.contains('ph-placeholder-inner')) {
          ph.style.opacity = '1';
        }
      }
    } catch (e) {
      img.classList.remove('loaded');
      img.style.display = 'none';
    }
  };
}

// Helper: Progressive image candidate paths across subfolder and root conventions
function getConceptCandidates(ind, concept, cIdx) {
  const folder = `${ind.code}-${ind.id}`;
  const blockNum = cIdx + 1; // 1, 2, 3, 4
  
  const rawPath = concept.image || '';
  const filenameWithExt = rawPath.split('/').pop() || '';
  const baseName = filenameWithExt.replace(/\.(jpg|jpeg|png|webp|svg)$/i, '');
  const slugWithoutCode = baseName.replace(new RegExp(`^${ind.code}-${blockNum}-`), '');

  const exts = ['png', 'jpg', 'jpeg', 'webp'];
  const candidates = [];

  // Direct concept.image if specified
  if (concept.image) {
    candidates.push(concept.image);
  }

  // Priority 1: In section folder with clean number (1.png, 1.jpg, etc.)
  exts.forEach(ext => {
    const p = `/images/industries/${folder}/${blockNum}.${ext}`;
    if (!candidates.includes(p)) candidates.push(p);
  });

  // Priority 2: In section folder with descriptive slug (doctors-clinics.png, etc.)
  exts.forEach(ext => {
    const p = `/images/industries/${folder}/${slugWithoutCode}.${ext}`;
    if (!candidates.includes(p)) candidates.push(p);
  });

  // Priority 3: In section folder with full name (01-1-doctors-clinics.png)
  exts.forEach(ext => {
    const p = `/images/industries/${folder}/${baseName}.${ext}`;
    if (!candidates.includes(p)) candidates.push(p);
  });

  // Priority 4: In root industries folder with full name (01-1-doctors-clinics.png)
  exts.forEach(ext => {
    const p = `/images/industries/${baseName}.${ext}`;
    if (!candidates.includes(p)) candidates.push(p);
  });

  // Priority 5: In root industries folder with short code (01-1.png)
  exts.forEach(ext => {
    const p = `/images/industries/${ind.code}-${blockNum}.${ext}`;
    if (!candidates.includes(p)) candidates.push(p);
  });

  return candidates;
}

  // 5. Filter and Render All 15 Sections with their 4 Blocks (60 Blocks total)
  function filterAndRender() {
    const query = searchQuery.trim().toLowerCase();

    // Filter Industries
    const filteredIndustries = INDUSTRIES_DATA.filter(ind => {
      // 1. Dropdown Filter Match
      const matchesIndustry = (selectedIndustryId === 'all') || (ind.id === selectedIndustryId);
      if (!matchesIndustry) return false;

      // 2. Search Query Match
      if (!query) return true;

      const titleMatch = ind.title.toLowerCase().includes(query);
      const descMatch = ind.description.toLowerCase().includes(query);
      const conceptsMatch = ind.concepts.some(c => 
        c.title.toLowerCase().includes(query) || 
        c.tagline.toLowerCase().includes(query)
      );

      return titleMatch || descMatch || conceptsMatch;
    });

    // Calculate Counts
    const totalConcepts = filteredIndustries.reduce((acc, curr) => acc + curr.concepts.length, 0);

    if (resultsCount) {
      if (filteredIndustries.length === INDUSTRIES_DATA.length && !query && selectedIndustryId === 'all') {
        resultsCount.innerHTML = `Showing all Industries & Website Concept Blocks`;
      } else if (filteredIndustries.length === 1) {
        resultsCount.innerHTML = `Showing <strong>1</strong> Industry & <strong>${totalConcepts}</strong> Concept Blocks`;
      } else {
        resultsCount.innerHTML = `Showing <strong>${filteredIndustries.length}</strong> Industries (<strong>${totalConcepts}</strong> Concept Blocks)`;
      }
    }

    // Empty Search State
    if (filteredIndustries.length === 0) {
      sectionsContainer.innerHTML = `
        <div class="empty-state-card">
          <h3 class="empty-state-title">No matching industries or concepts found</h3>
          <p class="empty-state-text">No results matched your search "${searchQuery}".</p>
          <button type="button" class="btn-reset-filters" id="btn-reset-filters">
            Reset Search & Show All Industries
          </button>
        </div>
      `;

      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', resetAll);
      }
      return;
    }

    // Render Each Industry Section with its 4 Concept Blocks (Clean typography, no "SECTION 1" clutter)
    sectionsContainer.innerHTML = filteredIndustries.map(ind => `
      <section class="industry-section-group" id="${ind.id}">
        <!-- Section Header -->
        <header class="section-group-header">
          <div class="section-header-top-row">
            <h2 class="section-group-title">${highlightText(ind.title, query)}</h2>
            <span class="section-count-badge">4 Concepts</span>
          </div>
          <p class="section-group-desc">${highlightText(ind.description, query)}</p>
        </header>

        <!-- 4 Separate Visual Concept Blocks (Awwwards Reference Grid) -->
        <div class="concepts-grid">
          ${ind.concepts.map((concept, cIdx) => {
            const candidates = getConceptCandidates(ind, concept, cIdx);
            const candidatesAttr = JSON.stringify(candidates).replace(/"/g, '&quot;');
            const folderName = `${ind.code}-${ind.id}`;
            const blockNum = cIdx + 1;
            return `
            <article class="concept-card" data-id="${concept.id}">
              <!-- Large Rectangular Image Placeholder (Consistent 16:10 ratio) -->
              <div class="concept-image-wrapper" title="Image for ${concept.title}: /images/industries/${folderName}/${blockNum}.png">
                <!-- Auto-loaded user image if available across folder & root candidates -->
                <img 
                  class="concept-uploaded-img"
                  src="${candidates[0]}"
                  data-candidates="${candidatesAttr}"
                  data-c-idx="0"
                  alt="${concept.title}"
                  onload="window.pragmaImageLoad(this)"
                  onerror="window.pragmaImageError(this)"
                >

                <!-- Clean Neutral Architectural Placeholder (Shown until user adds photo) -->
                <div class="ph-placeholder-inner" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%;">
                  <div class="ph-corner ph-corner-tl"></div>
                  <div class="ph-corner ph-corner-tr"></div>
                  <div class="ph-corner ph-corner-bl"></div>
                  <div class="ph-corner ph-corner-br"></div>
                  
                  <div class="ph-center-meta">
                    <div class="ph-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="m21 15-5-5L5 21"/>
                      </svg>
                    </div>
                    <span class="ph-code-label">${concept.title}</span>
                    <span class="ph-ratio-sub">16 : 10 Canvas • ${folderName}/${blockNum}.png</span>
                  </div>
                </div>
              </div>

              <!-- Typography Below Image (Awwwards Style: Title & Tagline) -->
              <div class="concept-meta">
                <h3 class="concept-title">${highlightText(concept.title, query)}</h3>
                <p class="concept-tagline">${highlightText(concept.tagline, query)}</p>
              </div>
            </article>
            `;
          }).join('')}
        </div>
      </section>
    `).join('');

    // Immediately activate any cached or loaded images
    sectionsContainer.querySelectorAll('.concept-uploaded-img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        window.pragmaImageLoad(img);
      }
    });

    // Attach 3D physics to new elements
    attachCardPhysics();
  }

  // 6. Reset All Helper
  function resetAll() {
    searchQuery = '';
    selectedIndustryId = 'all';
    if (searchInput) searchInput.value = '';
    if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
    selectIndustry('all');
  }

  // 7. Live Search Event Listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (searchQuery.length > 0) {
          clearSearchBtn.classList.add('visible');
        } else {
          clearSearchBtn.classList.remove('visible');
        }
      }
      filterAndRender();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      filterAndRender();
    });
  }

  // Initialize
  setupDropdown();
  filterAndRender();
}
