/**
 * loader.js — JSON-driven site engine
 * All content is driven by /data/owner.json and /data/projects.json
 * To add a project: add entry to projects.json + create data/projects/[slug].json
 */

const ROOT = (() => {
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    const m = s.src.match(/^(.*?)assets\/js\/loader\.js/);
    if (m) return m[1];
  }
  return '/';
})();

async function fetchJSON(path) {
  const url = `${ROOT}${path}${path.includes('?') ? '&' : '?'}_=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  return res.json();
}

async function loadOwner() {
  return fetchJSON('data/owner.json');
}

async function loadProjects() {
  return fetchJSON('data/projects.json');
}

async function loadProject(slug) {
  return fetchJSON(`data/projects/${slug}.json`);
}

function buildNav(owner, activePage) {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a class="nav-logo" href="${ROOT}index.html">${owner.name}</a>
      <ul class="nav-links">
        <li><a href="${ROOT}index.html" ${activePage === 'home' ? 'class="active"' : ''}>Home</a></li>
        <li><a href="${ROOT}portfolio/index.html" ${activePage === 'portfolio' ? 'class="active"' : ''}>Portfolio</a></li>
        <li><a href="${owner.socials.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></li>
      </ul>
    </div>
  `;
}

function buildFooter(owner) {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <p>${owner.name} &nbsp;·&nbsp; 
      <a href="${owner.socials.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    </p>
    <p style="margin-top:6px; font-size:11px;">© ${year} — ${owner.domain}</p>
  `;
}

function statusBadge(status) {
  if (status === 'production') return `<span class="badge badge-prod"><i class="ti ti-circle-check" aria-hidden="true"></i> Production</span>`;
  if (status === 'development') return `<span class="badge badge-dev"><i class="ti ti-progress" aria-hidden="true"></i> Under development</span>`;
  return `<span class="badge badge-mvp"><i class="ti ti-flask" aria-hidden="true"></i> MVP</span>`;
}

function tagList(tags) {
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}

let lastFocusedScreenshot = null;

function ensureScreenshotLightbox() {
  let lightbox = document.getElementById('ss-lightbox');
  if (lightbox) return lightbox;

  lightbox = document.createElement('div');
  lightbox.id = 'ss-lightbox';
  lightbox.className = 'ss-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Screenshot preview');
  lightbox.innerHTML = `
    <button type="button" class="ss-lightbox-close" aria-label="Close preview">&times;</button>
    <img class="ss-lightbox-img" alt="" />
    <p class="ss-lightbox-caption"></p>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.ss-lightbox-img');
  const lightboxCaption = lightbox.querySelector('.ss-lightbox-caption');
  const lightboxClose = lightbox.querySelector('.ss-lightbox-close');

  function closeScreenshotLightbox() {
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
    document.body.style.overflow = '';
    lastFocusedScreenshot?.focus();
  }

  function openScreenshotLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  lightboxClose.addEventListener('click', closeScreenshotLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeScreenshotLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeScreenshotLightbox();
  });

  lightbox._open = openScreenshotLightbox;
  return lightbox;
}

function initScreenshotGrid(gridEl, screenshots, assetPrefix = '../../') {
  if (!gridEl) return;

  if (screenshots && screenshots.length > 0) {
    gridEl.innerHTML = screenshots.map((s, i) => {
      const isMain = i === 0;
      const src = `${assetPrefix}${s.file}`;
      return `
        <a href="${src}" class="screenshot-slot ${isMain ? 'main-shot' : ''}" data-ss-caption="${s.caption.replace(/"/g, '&quot;')}" aria-label="View full screenshot: ${s.caption.replace(/"/g, '&quot;')}">
          <img src="${src}" alt="${s.caption.replace(/"/g, '&quot;')}" loading="lazy" draggable="false" />
          <span class="ss-caption">${s.caption}</span>
        </a>
      `;
    }).join('');

    const lightbox = ensureScreenshotLightbox();

    if (gridEl._ssClickHandler) {
      gridEl.removeEventListener('click', gridEl._ssClickHandler);
    }
    gridEl._ssClickHandler = (e) => {
      const link = e.target.closest('a.screenshot-slot');
      if (!link || !gridEl.contains(link)) return;
      e.preventDefault();
      lastFocusedScreenshot = link;
      const caption = link.dataset.ssCaption || link.querySelector('img')?.alt || '';
      lightbox._open(link.getAttribute('href'), caption);
    };
    gridEl.addEventListener('click', gridEl._ssClickHandler);
  } else {
    gridEl.innerHTML = `<div class="screenshot-slot main-shot"><div class="ss-placeholder"><i class="ti ti-photo-off" aria-hidden="true"></i><span class="ss-caption">No screenshots yet</span></div></div>`;
  }
}

window.SiteLoader = { loadOwner, loadProjects, loadProject, buildNav, buildFooter, statusBadge, tagList, initScreenshotGrid, ROOT };
