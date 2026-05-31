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
  const res = await fetch(ROOT + path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
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
      <a class="nav-logo" href="${ROOT}index.html">${owner.name.split(' ').slice(-1)[0]}</a>
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
      <a href="${owner.socials.linkedin}" target="_blank" rel="noopener">LinkedIn</a> &nbsp;·&nbsp; 
      <a href="${owner.socials.github}" target="_blank" rel="noopener">GitHub</a>
    </p>
    <p style="margin-top:6px; font-size:11px;">© ${year} — ${owner.domain}</p>
  `;
}

function statusBadge(status) {
  if (status === 'production') return `<span class="badge badge-prod"><i class="ti ti-circle-check" aria-hidden="true"></i> Production</span>`;
  return `<span class="badge badge-mvp"><i class="ti ti-flask" aria-hidden="true"></i> MVP</span>`;
}

function tagList(tags) {
  return tags.map(t => `<span class="tag">${t}</span>`).join('');
}

window.SiteLoader = { loadOwner, loadProjects, loadProject, buildNav, buildFooter, statusBadge, tagList, ROOT };
