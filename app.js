/* ─────────────────────────────────────────
   MERCH — app.js
   ───────────────────────────────────────── */

const STORAGE_KEY = 'merch_items';

let items    = loadItems();
let selected = null; // currently selected preview image (dataURL)
let previews = [];   // array of { dataURL } for queued uploads
let currentFilter = 'all';

/* ── ELEMENTS ── */
const grid          = document.getElementById('grid');
const emptyState    = document.getElementById('emptyState');
const toggleBtn     = document.getElementById('toggleUpload');
const uploadPanel   = document.getElementById('uploadPanel');
const dropZone      = document.getElementById('dropZone');
const fileInput     = document.getElementById('fileInput');
const uploadPreview = document.getElementById('uploadPreview');
const itemName      = document.getElementById('itemName');
const itemPrice     = document.getElementById('itemPrice');
const itemCategory  = document.getElementById('itemCategory');
const addBtn        = document.getElementById('addBtn');
const lightbox      = document.getElementById('lightbox');
const lightboxBack  = document.getElementById('lightboxBackdrop');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxName  = document.getElementById('lightboxName');
const lightboxPrice = document.getElementById('lightboxPrice');
const lightboxCat   = document.getElementById('lightboxCat');
const navLinks      = document.querySelectorAll('.nav-link');

/* ── INIT ── */
renderGrid();
setupEvents();

/* ── EVENTS ── */
function setupEvents() {
  // Toggle upload panel
  toggleBtn.addEventListener('click', () => {
    uploadPanel.classList.toggle('open');
    toggleBtn.textContent = uploadPanel.classList.contains('open')
      ? '− Close'
      : '+ Add clothing';
  });

  // File input
  fileInput.addEventListener('change', e => handleFiles(e.target.files));

  // Drag and drop
  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('dragging');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    handleFiles(e.dataTransfer.files);
  });
  dropZone.addEventListener('click', () => fileInput.click());

  // Add button
  addBtn.addEventListener('click', addItem);

  // Lightbox close
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBack.addEventListener('click', closeLightbox);

  // Filter nav
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      currentFilter = link.dataset.filter;
      renderGrid();
    });
  });

  // Keyboard esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ── FILE HANDLING ── */
function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      previews.push({ dataURL: e.target.result });
      renderPreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderPreviews() {
  uploadPreview.innerHTML = '';
  previews.forEach((p, i) => {
    const img = document.createElement('img');
    img.src = p.dataURL;
    img.className = 'preview-thumb' + (selected === p.dataURL ? ' selected' : '');
    img.title = 'Click to select as primary';
    img.addEventListener('click', () => {
      selected = p.dataURL;
      renderPreviews();
    });
    uploadPreview.appendChild(img);
  });

  // Auto-select first
  if (previews.length && !selected) {
    selected = previews[0].dataURL;
    renderPreviews();
  }
}

/* ── ADD ITEM ── */
function addItem() {
  if (!selected) {
    alert('Please add and select an image first.');
    return;
  }
  const name = itemName.value.trim() || 'Untitled';
  const price = itemPrice.value.trim() || '';
  const category = itemCategory.value;

  const item = {
    id: Date.now().toString(),
    name,
    price,
    category,
    img: selected,
  };

  items.unshift(item);
  saveItems();
  renderGrid();

  // Reset
  itemName.value = '';
  itemPrice.value = '';
  previews = [];
  selected = null;
  uploadPreview.innerHTML = '';
  fileInput.value = '';
}

/* ── RENDER GRID ── */
function renderGrid() {
  // Remove all cards (not emptyState)
  Array.from(grid.querySelectorAll('.card')).forEach(c => c.remove());

  const filtered = currentFilter === 'all'
    ? items
    : items.filter(i => i.category === currentFilter);

  emptyState.style.display = filtered.length === 0 ? 'block' : 'none';

  filtered.forEach(item => {
    const card = buildCard(item);
    grid.appendChild(card);
  });
}

/* ── BUILD CARD ── */
function buildCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = item.id;

  const catTag = document.createElement('span');
  catTag.className = 'card-cat-tag';
  catTag.textContent = item.category;

  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-img-wrap';

  const img = document.createElement('img');
  img.src = item.img;
  img.alt = item.name;
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  const overlay = document.createElement('div');
  overlay.className = 'card-overlay';
  overlay.innerHTML = `
    <div class="card-name">${item.name}</div>
    ${item.price ? `<div class="card-price">${item.price}</div>` : ''}
  `;

  const removeBtn = document.createElement('button');
  removeBtn.className = 'card-remove';
  removeBtn.textContent = '×';
  removeBtn.title = 'Remove';
  removeBtn.addEventListener('click', e => {
    e.stopPropagation();
    removeItem(item.id);
  });

  card.appendChild(catTag);
  card.appendChild(imgWrap);
  card.appendChild(overlay);
  card.appendChild(removeBtn);

  card.addEventListener('click', () => openLightbox(item));

  return card;
}

/* ── REMOVE ITEM ── */
function removeItem(id) {
  items = items.filter(i => i.id !== id);
  saveItems();
  renderGrid();
}

/* ── LIGHTBOX ── */
function openLightbox(item) {
  lightboxImg.src = item.img;
  lightboxImg.alt = item.name;
  lightboxName.textContent = item.name;
  lightboxPrice.textContent = item.price || '';
  lightboxCat.textContent = item.category;
  lightbox.classList.add('open');
  lightboxBack.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxBack.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── STORAGE ── */
function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch(e) {
    console.warn('Storage full — items may not persist across sessions.');
  }
}

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}
