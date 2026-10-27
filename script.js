/* ==========================================================
   CONFIG — troque pelos dados reais da cliente
   ========================================================== */
const CONFIG = {
  brand: "Esquema Lolita",
  whatsapp: "5513981743343", // DDI + DDD + número, só dígitos
  instagram: "esquemalolita",
  freeShipping: 350,
  installments: 3,
};

const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage indisponível */ }
  },
};

/* ---------- Fotos ---------- */
const photo = (file, alt, cls = "") => `<img class="${cls}" src="fotos/${file}.webp" alt="${alt}" loading="lazy" decoding="async">`;
const findProduct = (id) => PRODUCTS.find((p) => p.id === +id);
const variantOf = (p, i = 0) => p.variants[i] || p.variants[0];

/* ---------- Estado ---------- */
let cart = store.get("lolita-cart", []).filter((i) => findProduct(i.id));
let favs = store.get("lolita-favs", []).filter((id) => findProduct(id));
const ui = { tab: "all", cat: "Todos", q: "", sort: "relevance" };
const selectedVariant = {};

const iconHeart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.2 3.3 4.5 7 4.5c2 0 3.5 1.1 5 3 1.5-1.9 3-3 5-3 3.7 0 6 3.7 4.5 7.3C19.5 16.4 12 21 12 21z"/></svg>`;

/* ---------- Vitrine ---------- */
function filtered() {
  let list = PRODUCTS.filter((p) => {
    if (ui.tab === "best" && !p.tags.includes("best")) return false;
    if (ui.tab === "novo" && !p.tags.includes("novo")) return false;
    if (ui.tab === "destaque" && !p.tags.includes("destaque")) return false;
    if (ui.tab === "favs" && !favs.includes(p.id)) return false;
    if (ui.cat !== "Todos" && p.cat !== ui.cat) return false;
    if (ui.q) {
      const hay = `${p.name} ${p.cat} ${p.line} ${p.variants.map((v) => v[0]).join(" ")}`.toLowerCase();
      if (!hay.includes(ui.q.toLowerCase())) return false;
    }
    return true;
  });
  if (ui.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (ui.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (ui.sort === "az") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  return list;
}

function swatchesHTML(p, active, attr) {
  if (p.variants.length < 2) return "";
  return `<div class="swatches">${p.variants.map((v, i) => `<button class="sw ${i === active ? "active" : ""}" style="background:${v[1]}" ${attr}="${p.id}:${i}" aria-label="${v[0]}" title="${v[0]}"></button>`).join("")}</div>`;
}

function cardHTML(p) {
  const vi = selectedVariant[p.id] || 0;
  const v = variantOf(p, vi);
  const tag = p.tags.includes("novo") ? `<span class="tag new">Novo</span>` : p.tags.includes("best") ? `<span class="tag">Mais vendido</span>` : "";
  return `<article class="card" data-id="${p.id}">
    <div class="card-media" data-open="${p.id}">
      ${tag}
      <button class="fav ${favs.includes(p.id) ? "on" : ""}" data-fav="${p.id}" aria-label="Favoritar ${p.name}">${iconHeart}</button>
      ${photo(v[2], `${p.name} ${v[0]}`, "product-img")}
      <button class="quick" data-open="${p.id}">${p.sizes.length > 1 ? "Escolher tamanho" : "Ver detalhes"}</button>
    </div>
    <div class="card-body">
      <div class="meta">${p.line}</div>
      <h3 data-open="${p.id}">${p.name}</h3>
      <div class="price"><strong>${brl(p.price)}</strong><small>${CONFIG.installments}x ${brl(p.price / CONFIG.installments)} sem juros</small></div>
      ${swatchesHTML(p, vi, "data-sw")}
    </div>
  </article>`;
}

function renderGrid() {
  const list = filtered();
  $("#grid").innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<p class="empty">${ui.tab === "favs" ? "Você ainda não favoritou nenhuma peça. Toque no ♡ para salvar." : "Nenhuma peça encontrada. Tente outra busca."}</p>`;
}

function renderChips() {
  const cats = ["Todos", ...new Set(PRODUCTS.map((p) => p.cat))];
  $("#chips").innerHTML = cats.map((c) => `<button class="chip ${c === ui.cat ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
}

/* ---------- Categorias ---------- */
const CAT_CARDS = [
  ["Kits", "kit-ballet-preto-rosa", "Look completo"],
  ["Ballet", "collant-regata-rosa", "Collants e saias"],
  ["Jazz", "short-jazz-grafite", "Shorts e básicos"],
  ["Natação", "touca-vinho", "Toucas e maiôs"],
  ["Saídas", "colete-verde", "Coletes e parkas"],
];
function renderCats() {
  $("#cats").innerHTML = CAT_CARDS.map(([name, file, sub]) =>
    `<a href="#loja" class="cat reveal" data-gocat="${name}"><div class="art">${photo(file, name)}</div><h3>${name}</h3><span>${sub}</span></a>`
  ).join("");
}

/* ---------- Favoritos ---------- */
function toggleFav(id) {
  favs = favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id];
  store.set("lolita-favs", favs);
  updateBadges();
  toast(favs.includes(id) ? "Salvo nos favoritos ♡" : "Removido dos favoritos");
}

/* ---------- Visualização rápida ---------- */
let modalState = null;
function openModal(id) {
  const p = findProduct(id);
  modalState = { id: p.id, variant: selectedVariant[p.id] || 0, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
  drawModal();
  $("#modal").classList.add("open");
  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function drawModal() {
  const p = findProduct(modalState.id);
  const { variant, size } = modalState;
  const v = variantOf(p, variant);
  $("#modalMedia").innerHTML = photo(v[2], `${p.name} ${v[0]}`);
  $("#modalInfo").innerHTML = `
    <div class="eyebrow">${p.line}</div>
    <h3>${p.name}</h3>
    <div class="price"><strong style="font-size:1.4rem">${brl(p.price)}</strong><small>ou ${CONFIG.installments}x ${brl(p.price / CONFIG.installments)} sem juros</small></div>
    <p class="desc">${p.desc}</p>
    <div class="opt-label"><span>Cor: <span style="font-weight:600;letter-spacing:0;text-transform:none">${v[0]}</span></span></div>
    ${swatchesHTML(p, variant, "data-mvar")}
    <div class="opt-label"><span>Tamanho</span>${p.sizes.length > 1 ? `<a href="#medidas" data-close>Guia de medidas</a>` : ""}</div>
    <div class="size-opts" id="sizeOpts">${p.sizes.map((s) => `<button class="size-opt ${s === size ? "active" : ""}" data-msize="${s}">${s}</button>`).join("")}</div>
    <div class="modal-actions">
      <div class="qty" style="margin:0"><button data-mqty="-1" aria-label="Menos">−</button><span>${modalState.qty}</span><button data-mqty="1" aria-label="Mais">+</button></div>
      <button class="btn btn-primary" id="addToCart">Adicionar à sacola</button>
      <button class="icon-btn fav ${favs.includes(p.id) ? "on" : ""}" style="position:static;background:var(--white)" data-fav="${p.id}" aria-label="Favoritar">${iconHeart}</button>
    </div>`;
}
function closeAll() {
  $("#modal").classList.remove("open");
  $("#drawer").classList.remove("open");
  $("#overlay").classList.remove("open");
  $("#mobileNav").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------- Sacola ---------- */
function saveCart() { store.set("lolita-cart", cart); renderCart(); updateBadges(true); }
function addToCart() {
  const { id, variant, size, qty } = modalState;
  if (!size) {
    const el = $("#sizeOpts");
    el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    toast("Escolha um tamanho");
    return;
  }
  const key = `${id}-${variant}-${size}`;
  const found = cart.find((i) => i.key === key);
  if (found) found.qty += qty; else cart.push({ key, id, variant, size, qty });
  saveCart();
  $("#modal").classList.remove("open");
  openDrawer();
}
function openDrawer() {
  renderCart();
  $("#drawer").classList.add("open");
  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}
function cartTotal() {
  return cart.reduce((s, i) => s + findProduct(i.id).price * i.qty, 0);
}
function renderCart() {
  const total = cartTotal();
  const missing = CONFIG.freeShipping - total;
  $("#shipText").innerHTML = missing > 0
    ? `Faltam <strong>${brl(missing)}</strong> para o <strong>frete grátis</strong>`
    : `Parabéns! Você ganhou <strong>frete grátis</strong> ✦`;
  $("#shipFill").style.width = `${Math.min(100, (total / CONFIG.freeShipping) * 100)}%`;
  $("#cartTotal").textContent = brl(total);
  $("#cartInstall").textContent = `ou ${CONFIG.installments}x de ${brl(total / CONFIG.installments)} sem juros`;
  $("#drawerFoot").style.display = cart.length ? "" : "none";
  $("#drawerItems").innerHTML = cart.length
    ? cart.map((i) => {
        const p = findProduct(i.id);
        const v = variantOf(p, i.variant);
        return `<div class="line-item">
          <div class="thumb">${photo(v[2], p.name)}</div>
          <div><h4>${p.name}</h4><small>${v[0]} · Tam. ${i.size}</small>
            <div class="qty"><button data-cq="${i.key}:-1" aria-label="Menos">−</button><span>${i.qty}</span><button data-cq="${i.key}:1" aria-label="Mais">+</button></div></div>
          <div style="text-align:right"><strong>${brl(p.price * i.qty)}</strong><br><button class="remove" data-rm="${i.key}">Remover</button></div>
        </div>`;
      }).join("")
    : `<div class="drawer-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M5 8h14l-1.2 12.1a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><p>Sua sacola está vazia.</p><a href="#loja" class="btn btn-ghost" data-close>Explorar a loja</a></div>`;
}
function checkout() {
  const lines = cart.map((i) => {
    const p = findProduct(i.id);
    return `• ${i.qty}x ${p.name} — ${variantOf(p, i.variant)[0]}, tam. ${i.size} (${brl(p.price * i.qty)})`;
  });
  const total = cartTotal();
  const msg = `Olá, ${CONFIG.brand}! Quero finalizar meu pedido:\n\n${lines.join("\n")}\n\n*Total: ${brl(total)}*${total >= CONFIG.freeShipping ? "\n(Frete grátis ✨)" : ""}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

function updateBadges(bump = false) {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const cb = $("#cartBadge"), fb = $("#favBadge");
  cb.textContent = count; cb.classList.toggle("show", count > 0);
  fb.textContent = favs.length; fb.classList.toggle("show", favs.length > 0);
  if (bump) { cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); }
}

let toastTimer;
function toast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Guia de medidas ---------- */
const SIZE_TABLES = {
  adulto: [["Tam.", "Busto", "Cintura", "Quadril", "Altura"], ["P", "80–86", "62–66", "88–94", "1,55–1,63"], ["M", "86–92", "66–72", "94–100", "1,60–1,68"], ["G", "92–98", "72–78", "100–106", "1,63–1,72"], ["GG", "98–104", "78–86", "106–112", "1,65–1,76"]],
  infantil: [["Tam.", "Idade", "Busto", "Cintura", "Altura"], ["2", "2 anos", "52–54", "50–52", "86–94"], ["4", "3–4 anos", "54–58", "52–54", "95–106"], ["6", "5–6 anos", "58–62", "54–56", "107–118"], ["8", "7–8 anos", "62–66", "56–58", "119–130"], ["10", "9–10 anos", "66–72", "58–62", "131–142"], ["12", "11–12 anos", "72–78", "62–66", "143–152"], ["14", "13–14 anos", "78–82", "64–68", "150–160"]],
};
function renderSizes(kind) {
  const [head, ...rows] = SIZE_TABLES[kind];
  $("#sizeTable").innerHTML = `<thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
  $$("[data-size-kind]").forEach((b) => b.classList.toggle("active", b.dataset.sizeKind === kind));
}

/* ---------- Eventos ---------- */
function setTab(tab) {
  ui.tab = tab;
  $$("[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, a, [data-open]");
  if (!t) return;
  const d = t.dataset;

  if (d.fav) { e.stopPropagation(); toggleFav(+d.fav); renderGrid(); if ($("#modal").classList.contains("open")) drawModal(); return; }
  if (d.sw) {
    const [id, i] = d.sw.split(":");
    selectedVariant[id] = +i;
    t.closest(".card").outerHTML = cardHTML(findProduct(id));
    return;
  }
  if (d.open) { openModal(+d.open); return; }
  if (d.mvar) { modalState.variant = +d.mvar.split(":")[1]; selectedVariant[modalState.id] = modalState.variant; drawModal(); renderGrid(); return; }
  if (d.msize) { modalState.size = d.msize; drawModal(); return; }
  if (d.mqty) { modalState.qty = Math.max(1, modalState.qty + +d.mqty); drawModal(); return; }
  if (t.id === "addToCart") { addToCart(); return; }
  if (d.cq) {
    const [key, n] = d.cq.split(":");
    const item = cart.find((i) => i.key === key);
    item.qty += +n;
    if (item.qty < 1) cart = cart.filter((i) => i.key !== key);
    saveCart(); return;
  }
  if (d.rm) { cart = cart.filter((i) => i.key !== d.rm); saveCart(); return; }
  if (d.tab) { setTab(d.tab); renderGrid(); return; }
  if (d.cat) { ui.cat = d.cat; renderChips(); renderGrid(); return; }
  if (d.gocat) { ui.cat = d.gocat; setTab("all"); renderChips(); renderGrid(); }
  if (d.sizeKind) { renderSizes(d.sizeKind); return; }
  if (t.id === "favBtn") {
    setTab("favs"); ui.cat = "Todos";
    renderChips(); renderGrid();
    $("#loja").scrollIntoView({ behavior: "smooth" }); return;
  }
  if (t.id === "cartBtn") { openDrawer(); return; }
  if (t.id === "checkout") { checkout(); return; }
  if (t.id === "menuBtn") { $("#mobileNav").classList.add("open"); return; }
  if ("close" in d) closeAll();
});
$("#overlay").addEventListener("click", closeAll);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

$("#search").addEventListener("input", (e) => { ui.q = e.target.value.trim(); renderGrid(); });
$("#sort").addEventListener("change", (e) => { ui.sort = e.target.value; renderGrid(); });

window.addEventListener("scroll", () => $(".header").classList.toggle("scrolled", scrollY > 10), { passive: true });

/* ---------- Init ---------- */
$$("[data-brand]").forEach((el) => (el.textContent = CONFIG.brand));
$$("[data-wa]").forEach((el) => (el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(`Olá, ${CONFIG.brand}! Vim pelo site e queria tirar uma dúvida.`)}`));
$$("[data-ig]").forEach((el) => (el.href = `https://instagram.com/${CONFIG.instagram}`));
$$("[data-ig-name]").forEach((el) => (el.textContent = `@${CONFIG.instagram}`));
$$("[data-free]").forEach((el) => (el.textContent = brl(CONFIG.freeShipping).replace(",00", "")));
$("#year").textContent = new Date().getFullYear();

renderCats();
renderChips();
renderGrid();
renderCart();
renderSizes("infantil");
updateBadges();

const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));
