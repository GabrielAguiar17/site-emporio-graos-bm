/* ===========================
   EMPÓRIO DOS GRÃOS BM
   script.js
=========================== */

// ── Header: scroll shadow + nav highlight ──────────────────────────────────
const header = document.getElementById('header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#nav a');

function onScroll() {
  // Sombra extra ao rolar
  header.style.boxShadow = window.scrollY > 50
    ? '0 4px 30px rgba(0,0,0,.3)'
    : '0 2px 20px rgba(0,0,0,.2)';

  // Destaca link ativo conforme seção visível
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });


// ── Menu mobile (hamburger) ─────────────────────────────────────────────────
const menuToggle = document.getElementById('menuToggle');
const nav        = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open);
});

// Fecha ao clicar num link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', false);
  });
});


// ── Filtro de produtos ──────────────────────────────────────────────────────
const filtros  = document.querySelectorAll('.filtro');
const cards    = document.querySelectorAll('.card');

filtros.forEach(btn => {
  btn.addEventListener('click', () => {
    // Desativa apenas os botões do mesmo grupo (mesmo pai)
    const grupo = btn.closest('.filtros');
    grupo.querySelectorAll('.filtro').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.cat;

    // Filtra apenas os cards dentro da mesma seção
    const secao = btn.closest('section');
    secao.querySelectorAll('.card').forEach(card => {
      const match = cat === 'todos' || cat === 'todos-f' || cat === 'todos-c' || cat === 'todos-g' || card.dataset.cat === cat;
      if (match) {
        card.classList.remove('hidden');
        card.style.animation = 'cardIn .35s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


// ── Animação fade-up (Intersection Observer) ────────────────────────────────
const fadeEls = document.querySelectorAll(
  '.card, .benef-card, .sobre-text, .contato-form, .contato-info, .sobre-img'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

fadeEls.forEach(el => observer.observe(el));


// ── Formulário → redireciona ao WhatsApp ────────────────────────────────────
const form = document.getElementById('contatoForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const nome      = document.getElementById('nome').value.trim();
  const telefone  = document.getElementById('telefone').value.trim();
  const mensagem  = document.getElementById('mensagem').value.trim();

  if (!nome || !mensagem) return;

  // Número do WhatsApp — troque pelo número real (só dígitos, com DDI)
  const numero = '5538992193008';

  const texto = encodeURIComponent(
    `Olá, Empório dos Grãos BM! 👋\n\n` +
    `*Nome:* ${nome}\n` +
    (telefone ? `*Telefone:* ${telefone}\n` : '') +
    `*Mensagem:* ${mensagem}`
  );

  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
  form.reset();
  showToast('Mensagem enviada! Redirecionando ao WhatsApp… 🎉');
});


// ── Toast de confirmação ────────────────────────────────────────────────────
function showToast(msg) {
  // Remove toast anterior se existir
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);

  // Força reflow antes de adicionar a classe para a transição funcionar
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}


// ── Smooth scroll para links âncora ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});


// ── Contador animado (estatísticas do Sobre) ────────────────────────────────
function animateCount(el, end, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (end / duration) * 16;

  const timer = setInterval(() => {
    start += step;
    if (start >= end) {
      el.textContent = `+${end}${suffix}`;
      clearInterval(timer);
    } else {
      el.textContent = `+${Math.floor(start)}${suffix}`;
    }
  }, 16);
}

const statEls = document.querySelectorAll('.sobre-stat strong');
let counted = false;

const statObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !counted) {
    counted = true;
    // +500 Produtos, +5 Anos
    animateCount(statEls[0], 500);
    animateCount(statEls[1], 5);
  }
}, { threshold: 0.5 });

if (statEls.length) statObserver.observe(statEls[0]);


// ── Injetar estilos do Toast e animação cardIn via JS ──────────────────────
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 5.5rem;
    right: 2rem;
    background: #e8c000;
    color: #0a120a;
    padding: .9rem 1.6rem;
    border-radius: 50px;
    font-size: .88rem;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    box-shadow: 0 6px 24px rgba(232,192,0,.4);
    opacity: 0;
    transform: translateY(16px);
    transition: opacity .35s ease, transform .35s ease;
    z-index: 2000;
    pointer-events: none;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: scale(.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
document.head.appendChild(style);


// ── Busca global de produtos ────────────────────────────────────────────────
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const searchOverlay = document.getElementById('searchOverlay');
const searchResults = document.getElementById('searchResults');
const searchCount   = document.getElementById('searchCount');
const btnFechar     = document.getElementById('btnFecharBusca');

function getAllCards() {
  return Array.from(document.querySelectorAll('.produtos-grid .card'));
}

function renderSearch(query) {
  const q = query.trim().toLowerCase();
  if (!q) { closeSearch(); return; }

  const allCards = getAllCards();
  const matches = allCards.filter(card => {
    const nome = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
    const cat  = card.querySelector('.card-cat-pill')?.textContent.toLowerCase() || '';
    return nome.includes(q) || desc.includes(q) || cat.includes(q);
  });

  searchResults.innerHTML = '';

  if (matches.length === 0) {
    searchResults.innerHTML = `
      <div class="search-empty">
        <i class="fas fa-leaf"></i>
        Nenhum produto encontrado para "<strong>${query}</strong>"
      </div>`;
    searchCount.textContent = '0 resultados';
  } else {
    matches.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.remove('hidden', 'fade-up', 'visible');
      clone.style.animation = 'cardIn .35s ease forwards';
      searchResults.appendChild(clone);
    });
    searchCount.textContent = `${matches.length} produto${matches.length > 1 ? 's' : ''} encontrado${matches.length > 1 ? 's' : ''}`;
  }

  searchOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  searchOverlay.classList.remove('active');
  document.body.style.overflow = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim();
  searchClear.classList.toggle('visible', q.length > 0);
  if (q.length >= 2) renderSearch(q);
  else if (q.length === 0) closeSearch();
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSearch();
});

searchClear.addEventListener('click', closeSearch);
btnFechar.addEventListener('click', closeSearch);

searchOverlay.addEventListener('click', e => {
  if (e.target === searchOverlay) closeSearch();
});
