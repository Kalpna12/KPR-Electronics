const products = [
  { id:1, name:"KPR Smart LED TV", img:"https://via.placeholder.com/600x400?text=Smart+TV", desc:"4K UHD, HDR10+", category:"Home Appliances" },
  { id:2, name:"KPR Bluetooth Speaker", img:"https://via.placeholder.com/600x400?text=Speaker", desc:"20W, deep bass", category:"Audio Devices" },
  { id:3, name:"KPR Air Purifier", img:"https://via.placeholder.com/600x400?text=Air+Purifier", desc:"HEPA filter, silent mode", category:"Home Appliances" },
  { id:4, name:"KPR Smart Watch", img:"https://via.placeholder.com/600x400?text=Smart+Watch", desc:"Health tracking, 7-day battery", category:"Wearables" },
  { id:5, name:"KPR Smart Light", img:"https://via.placeholder.com/600x400?text=Smart+Light", desc:"RGB, voice control", category:"Smart Gadgets" }
];

const grid = document.getElementById('products');
const categories = document.querySelectorAll('.cat-item');
const searchBar = document.getElementById('searchBar');
const modalBg = document.getElementById('modalBg');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const quoteForm = document.getElementById('quoteForm');
const closeModalBtn = document.getElementById('closeModal');
let activeCategory = '';
let activeProduct = null;

// Render products
function renderProducts(filter = '', searchTerm=''){
  grid.innerHTML = '';
  const term = searchTerm.trim().toLowerCase();
  const filtered = products.filter(p => (!filter || p.category===filter) && (!term || p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)) );
  if(filtered.length===0){ grid.innerHTML='<p style="grid-column:1/-1;text-align:center;opacity:0.7;">No products found.</p>'; return; }

  filtered.forEach(p=>{
    const card = document.createElement('div');
    card.className='card fade-in';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="specs">${p.category} • ${p.desc}</div>
      <div class="actions">
        <button class="btn" onclick="openModal(${p.id})">Get a Quote</button>
        <button class="mini" onclick="openModal(${p.id})">Reviews</button>
      </div>
    `;
    grid.appendChild(card);
  });
  observeFadeIns();
}

// Categories
categories.forEach(cat => cat.addEventListener('click',()=>{
  categories.forEach(c=>c.classList.remove('active'));
  cat.classList.add('active');
  activeCategory = cat.dataset.cat;
  renderProducts(activeCategory, searchBar.value);
}));

// Search
searchBar.addEventListener('input',e=>renderProducts(activeCategory,e.target.value));

// Modal
function openModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  activeProduct=p;
  modalTitle.textContent='Request a Quote — '+p.name;
  modalBg.style.display='flex';
}
closeModalBtn.addEventListener('click',()=>modalBg.style.display='none');
modalBg.addEventListener('click',e=>{ if(e.target===modalBg) modalBg.style.display='none'; });

// Quote form submission
quoteForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  if(!activeProduct) return;
  const data = new FormData(quoteForm);
  const payload = {
    product: activeProduct.name,
    name: data.get('name'),
    email: data.get('email'),
    message: data.get('message')
  };
  try{
    const res = await fetch('/api/quote',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    if(res.ok) alert('Quote request sent!');
    else alert('Failed to send.');
  }catch{ alert('Server error'); }
  quoteForm.reset();
  modalBg.style.display='none';
});

// Theme toggle
const themeBtn = document.getElementById('themeToggle');
themeBtn.addEventListener('click',()=>{
  const next = document.body.classList.contains('dark')?'light':'dark';
  document.body.className=next;
  themeBtn.textContent=next==='dark'?'Light':'Dark';
  localStorage.setItem('kpr_theme',next);
});
window.addEventListener('load',()=>{
  const saved = localStorage.getItem('kpr_theme')||'light';
  document.body.className=saved;
  themeBtn.textContent=saved==='dark'?'Light':'Dark';
  document.getElementById('copyYear').textContent=new Date().getFullYear();
  renderProducts();
});

// Fade-in animation
function observeFadeIns(){
  const obs = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); }); },{threshold:0.15});
  document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el));
}