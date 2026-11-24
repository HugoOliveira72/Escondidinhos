/*
 * Cadê? - front-end demo application
 * All data is stored in this browser (localStorage). No server/API is used.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'cade-demo-state-v1';
  const DEFAULTS = {
    users: [
      { id: 'demo-student', name: 'João', surname: 'Palombo', email: 'aluno@cade.local', password: '123456', registration: '2026001', cpf: '00000000000', phone: '(11) 90000-0001', role: 'student', createdAt: '2026-09-02' },
      { id: 'demo-admin', name: 'Maria', surname: 'Joana', email: 'admin@cade.local', password: 'admin123', registration: '', cpf: '', phone: '', role: 'admin', createdAt: '2026-09-02' }
    ],
    currentUserId: null,
    items: [
      { id: 'seed-powerbank', type: 'lost', title: 'Powerbank Branco', brand: 'Samsung', location: 'Cantina / segundo andar', phone: '(11) 90000-0001', description: 'Perdi este Powerbank nas proximidades do segundo andar. Peço que quem encontrar entre em contato.', status: 'procurando', ownerId: 'demo-student', ownerName: 'João Palombo', createdAt: '2026-09-02', image: '' },
      { id: 'seed-umbrella', type: 'lost', title: 'Guarda-Chuva Rosa', brand: 'Sem marca', location: 'Biblioteca', phone: '(11) 90000-0001', description: 'Guarda-chuva rosa com cabo curvo.', status: 'procurando', ownerId: 'demo-student', ownerName: 'João Palombo', createdAt: '2026-03-27', image: '' },
      { id: 'seed-vinyl', type: 'found', title: 'Disco de Vinil', brand: 'Som Livre', location: 'Refeitório', phone: '(11) 90000-0001', description: 'Disco do cantor Roberto Carlos, capa azul. Foi encontrado no refeitório.', status: 'procurando', ownerId: 'demo-student', ownerName: 'João Palombo', createdAt: '2026-09-02', image: '' },
      { id: 'seed-keys', type: 'found', title: 'Molho de Chaves', brand: 'Sem marca', location: 'Pátio', phone: '(11) 90000-0001', description: 'Chaves com um chaveiro azul.', status: 'procurando', ownerId: 'demo-student', ownerName: 'João Palombo', createdAt: '2026-03-27', image: '' }
    ],
    notifications: [
      { id: 'seed-notification-1', ownerId: 'demo-student', title: 'Rafael comentou em “Disco de Vinil”', message: 'Oi! Acho que este disco pode ser meu. Podemos conversar?', createdAt: '2026-09-03T10:00:00.000Z', read: false },
      { id: 'seed-notification-2', ownerId: 'demo-student', title: 'Bianca comentou em “Powerbank Branco”', message: 'Encontrei um item parecido perto da biblioteca.', createdAt: '2026-09-03T09:00:00.000Z', read: false }
    ],
    messages: []
  };

  let state = loadState();
  let pendingImage = '';

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return clone(DEFAULTS);
      const parsed = JSON.parse(saved);
      return {
        ...clone(DEFAULTS),
        ...parsed,
        users: Array.isArray(parsed.users) ? parsed.users : clone(DEFAULTS.users),
        items: Array.isArray(parsed.items) ? parsed.items : clone(DEFAULTS.items),
        notifications: Array.isArray(parsed.notifications) ? parsed.notifications : clone(DEFAULTS.notifications),
        messages: Array.isArray(parsed.messages) ? parsed.messages : []
      };
    } catch (error) {
      console.warn('Não foi possível ler os dados locais do Cadê?.', error);
      return clone(DEFAULTS);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Não foi possível salvar no armazenamento local.', error);
      toast('O armazenamento do navegador está cheio. Tente usar uma imagem menor.', 'error');
      return false;
    }
  }

  function currentUser() {
    return state.users.find(user => user.id === state.currentUserId) || null;
  }

  function makeId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function formatDate(value) {
    if (!value) return 'Hoje';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }

  function toast(message, type = 'success') {
    let node = document.getElementById('cadeToast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'cadeToast';
      node.className = 'cade-toast';
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.dataset.type = type;
    node.classList.add('show');
    window.clearTimeout(node._hideTimer);
    node._hideTimer = window.setTimeout(() => node.classList.remove('show'), 3200);
  }

  function notify(ownerId, title, message) {
    if (!ownerId) return;
    state.notifications.unshift({ id: makeId('notification'), ownerId, title, message, createdAt: new Date().toISOString(), read: false });
    saveState();
  }

  function updateHeader() {
    const user = currentUser();
    document.querySelectorAll('.header-icons a[href="page2.html"]').forEach(link => {
      link.href = user ? 'page30.html' : 'page2.html';
      link.title = user ? `${user.name} ${user.surname}` : 'Entrar';
      const image = link.querySelector('img');
      if (image) image.alt = user ? 'Minha conta' : 'Entrar';
      else if (user) link.textContent = `${user.name}`;
    });

    document.querySelectorAll('#addContainer a[href="page34.html"]').forEach(link => {
      link.href = 'page35.html';
      link.textContent = 'Meus Achados';
    });

    const unread = state.notifications.filter(note => (!user || note.ownerId === user.id) && !note.read).length;
    document.querySelectorAll('a[href="page9.html"]').forEach(link => {
      if (!link.querySelector('.cade-notification-count') && unread > 0) {
        const badge = document.createElement('span');
        badge.className = 'cade-notification-count';
        badge.textContent = String(unread);
        link.appendChild(badge);
      } else {
        const badge = link.querySelector('.cade-notification-count');
        if (badge) badge.remove();
        if (unread > 0) {
          const newBadge = document.createElement('span');
          newBadge.className = 'cade-notification-count';
          newBadge.textContent = String(unread);
          link.appendChild(newBadge);
        }
      }
    });
  }

  function getItemFromUrl(fallbackType) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) return state.items.find(item => item.id === id) || null;
    return state.items.find(item => item.type === fallbackType) || null;
  }

  function getOwnedItems(type) {
    const user = currentUser();
    const ownerId = user ? user.id : 'demo-student';
    return state.items.filter(item => item.type === type && item.ownerId === ownerId);
  }

  function statusLabel(status) {
    return ({ procurando: 'Procurando', encontrado: 'Encontrado', arquivado: 'Arquivado' })[status] || status || 'Procurando';
  }

  function itemCard(item, destination) {
    const targetPage = destination === 'page12' && item.type === 'found' ? 'page14' : destination;
    const image = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.title)}">` : '<span aria-hidden="true">🖼</span>';
    const typeLabel = item.type === 'lost' ? 'Alerta de item perdido' : 'Item encontrado';
    return `<a class="cade-item-card" href="${targetPage}.html?id=${encodeURIComponent(item.id)}">
      <div class="cade-item-image">${image}</div>
      <div class="cade-item-copy"><strong>${escapeHtml(item.title)}</strong>
      <small>${escapeHtml(typeLabel)} · ${escapeHtml(formatDate(item.createdAt))}</small>
      <small class="cade-status status-${escapeHtml(item.status)}">Status: ${escapeHtml(statusLabel(item.status))}</small>
      <small>${escapeHtml(item.location || 'Local não informado')}</small></div>
      <span class="cade-card-arrow">›</span>
    </a>`;
  }

  function renderOwnedLists() {
    const page = window.location.pathname.split('/').pop();
    const body = document.querySelector('.content-body');
    if (!body) return;
    if (page === 'page31.html' || page === 'page35.html') {
      body.querySelectorAll('.card-box').forEach(card => card.remove());
      let list = body.querySelector('#cadeDynamicList');
      if (!list) {
        list = document.createElement('div');
        list.id = 'cadeDynamicList';
        list.className = 'cade-item-list';
        body.appendChild(list);
      }
      const type = page === 'page31.html' ? 'lost' : 'found';
      const items = getOwnedItems(type).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const destination = type === 'lost' ? 'page32' : 'page37';
      list.innerHTML = items.length
        ? items.map(item => itemCard(item, destination)).join('')
        : `<div class="cade-empty"><div>📭</div><strong>Nenhum item cadastrado ainda</strong><p>Use o menu de adicionar para cadastrar um ${type === 'lost' ? 'alerta de item perdido' : 'item encontrado'}.</p></div>`;
    }
  }

  function renderNotifications() {
    if (!document.title.toLowerCase().includes('notifica')) return;
    const body = document.querySelector('.content-body');
    if (!body) return;
    const user = currentUser();
    const ownerId = user ? user.id : 'demo-student';
    const notes = state.notifications.filter(note => note.ownerId === ownerId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    body.querySelectorAll('.card-box').forEach(card => card.remove());
    let list = body.querySelector('#cadeNotifications');
    if (!list) {
      list = document.createElement('div');
      list.id = 'cadeNotifications';
      list.className = 'cade-notification-list';
      body.appendChild(list);
    }
    list.innerHTML = notes.length ? notes.map(note => `<article class="cade-notification ${note.read ? '' : 'unread'}" data-notification-id="${escapeHtml(note.id)}">
      <div class="cade-avatar">${note.read ? '✓' : '✉'}</div><div class="cade-notification-text"><strong>${escapeHtml(note.title)}</strong><p>${escapeHtml(note.message)}</p><small>${new Date(note.createdAt).toLocaleString('pt-BR')}</small></div>
      <button class="cade-text-button" type="button" data-mark-read="${escapeHtml(note.id)}">${note.read ? 'Lida' : 'Marcar como lida'}</button>
    </article>`).join('') : '<div class="cade-empty"><div>🔔</div><strong>Você está em dia!</strong><p>Quando houver novidades sobre seus itens, elas aparecerão aqui.</p></div>';
  }

  function renderSearchResults() {
    if (window.location.pathname.split('/').pop() !== 'page10.html') return;
    const body = document.querySelector('.content-body');
    if (!body) return;
    const params = new URLSearchParams(window.location.search);
    const query = (params.get('q') || '').trim();
    const normalized = query.toLocaleLowerCase('pt-BR');
    const results = state.items.filter(item => item.status !== 'arquivado' && (!normalized || [item.title, item.brand, item.location, item.description, item.ownerName].join(' ').toLocaleLowerCase('pt-BR').includes(normalized)));
    body.innerHTML = `<div class="cade-search-heading"><div><h2>Resultados da pesquisa</h2><p>${results.length} ${results.length === 1 ? 'item encontrado' : 'itens encontrados'}${query ? ` para “${escapeHtml(query)}”` : ''}.</p></div><a class="btn-red" href="page20.html">+ Cadastrar achado</a></div>
      <div class="cade-search-filters"><button type="button" class="active" data-filter="all">Todos</button><button type="button" data-filter="lost">Perdidos</button><button type="button" data-filter="found">Achados</button></div>
      <div id="cadeSearchResults" class="cade-search-grid">${results.length ? results.map(item => itemCard(item, 'page12')).join('') : '<div class="cade-empty"><div>🔎</div><strong>Nenhum resultado por aqui</strong><p>Tente outro termo ou cadastre um novo item.</p></div>'}</div>`;
    body.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      body.querySelectorAll('[data-filter]').forEach(node => node.classList.toggle('active', node === button));
      const filtered = button.dataset.filter === 'all' ? results : results.filter(item => item.type === button.dataset.filter);
      const target = body.querySelector('#cadeSearchResults');
      target.innerHTML = filtered.length ? filtered.map(item => itemCard(item, 'page12')).join('') : '<div class="cade-empty"><strong>Nenhum item nesta categoria</strong></div>';
    }));
  }

  function renderItemDetails() {
    const page = window.location.pathname.split('/').pop();
    const config = {
      'page12.html': { type: 'lost', canContact: true },
      'page14.html': { type: 'found', canContact: true },
      'page32.html': { type: 'lost', owner: true },
      'page37.html': { type: 'found', owner: true },
      'page34.html': { type: 'lost', edit: true },
      'page39.html': { type: 'found', edit: true }
    }[page];
    if (!config) return;
    const item = getItemFromUrl(config.type);
    if (!item) {
      const body = document.querySelector('.content-body') || document.querySelector('.screen-container');
      if (body) body.innerHTML = '<div class="cade-empty"><strong>Item não encontrado</strong><p>Este item pode ter sido removido.</p><a class="btn-red" href="page7.html">Voltar ao início</a></div>';
      return;
    }
    if (config.edit) {
      renderEditForm(item);
      return;
    }
    const body = document.querySelector('.content-body');
    if (!body) return;
    const signedInUser = currentUser();
    const own = signedInUser ? signedInUser.id === item.ownerId : item.ownerId === 'demo-student';
    const photo = item.image ? `<img src="${item.image}" alt="${escapeHtml(item.title)}">` : '🖼';
    const info = `<div class="cade-detail-layout"><div><div class="cade-detail-photo">${photo}</div><p><small>Status do item</small></p><div class="cade-status status-${escapeHtml(item.status)}">${escapeHtml(statusLabel(item.status))}</div></div>
      <div class="cade-detail-info"><div><span class="cade-type-pill">${item.type === 'lost' ? 'ITEM PERDIDO' : 'ITEM ENCONTRADO'}</span><h2>${escapeHtml(item.title)}</h2></div>
      <p><strong>Marca:</strong> ${escapeHtml(item.brand || 'Não informada')}</p><p><strong>${item.type === 'lost' ? 'Perdido por' : 'Encontrado por'}:</strong> ${escapeHtml(item.ownerName || 'Usuário')}</p>
      <p><strong>Local:</strong> ${escapeHtml(item.location || 'Não informado')}</p><p><strong>Data do cadastro:</strong> ${escapeHtml(formatDate(item.createdAt))}</p><p><strong>Descrição:</strong></p><p class="cade-description">${escapeHtml(item.description || 'Sem descrição adicional.')}</p>
      ${own ? `<div class="cade-detail-actions"><a class="btn-black" href="${item.type === 'lost' ? 'page34' : 'page39'}.html?id=${encodeURIComponent(item.id)}">Editar</a><button type="button" class="btn-red" data-delete-item="${escapeHtml(item.id)}">Excluir</button><button type="button" class="btn-black" data-cycle-status="${escapeHtml(item.id)}">Alterar status</button></div>` : config.canContact ? `<button type="button" class="btn-black" data-contact-item="${escapeHtml(item.id)}">Contatar usuário</button>` : ''}
      </div></div>`;
    body.innerHTML = info;
  }

  function renderEditForm(item) {
    const pageContent = document.querySelector('.screen-container');
    if (!pageContent) return;
    pageContent.innerHTML = `<div class="content-body"><a href="${item.type === 'lost' ? 'page32' : 'page37'}.html?id=${encodeURIComponent(item.id)}" class="cade-back-link">← Voltar ao item</a><h2>Editar ${item.type === 'lost' ? 'alerta' : 'item encontrado'}</h2>
      <form id="cadeEditItemForm" class="cade-form" data-edit-item="${escapeHtml(item.id)}">
        <label>Nome do item<input name="title" required maxlength="80" value="${escapeHtml(item.title)}"></label>
        <label>Marca<input name="brand" value="${escapeHtml(item.brand || '')}"></label>
        <label>Local ${item.type === 'lost' ? 'onde foi perdido' : 'onde foi encontrado'}<input name="location" required value="${escapeHtml(item.location || '')}"></label>
        <label>Telefone / celular<input name="phone" value="${escapeHtml(item.phone || '')}"></label>
        <label>Descrição<textarea name="description" rows="4">${escapeHtml(item.description || '')}</textarea></label>
        <label>Status<select name="status"><option value="procurando" ${item.status === 'procurando' ? 'selected' : ''}>Procurando</option><option value="encontrado" ${item.status === 'encontrado' ? 'selected' : ''}>Encontrado</option><option value="arquivado" ${item.status === 'arquivado' ? 'selected' : ''}>Arquivado</option></select></label>
        <div class="cade-form-actions"><button class="btn-red" type="submit">Salvar alterações</button><a class="btn-black" href="${item.type === 'lost' ? 'page32' : 'page37'}.html?id=${encodeURIComponent(item.id)}">Cancelar</a></div>
      </form></div>`;
  }

  function renderContactModal(item) {
    document.getElementById('cadeContactModal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'cadeContactModal';
    modal.className = 'modal-overlay active';
    modal.innerHTML = `<div class="modal-content"><button class="cade-modal-close" type="button" aria-label="Fechar" data-close-modal>×</button><h3>Entrar em contato</h3><p>Envie uma mensagem para ${escapeHtml(item.ownerName || 'quem cadastrou o item')} sobre “${escapeHtml(item.title)}”.</p><form id="cadeContactForm" data-contact-owner="${escapeHtml(item.ownerId)}" data-contact-item="${escapeHtml(item.id)}"><label>Sua mensagem<textarea name="message" rows="4" required maxlength="500" placeholder="Descreva por que você está entrando em contato..."></textarea></label><button class="btn-red" type="submit">Enviar mensagem</button></form></div>`;
    document.body.appendChild(modal);
  }


  function renderRecentItems() {
    if (window.location.pathname.split('/').pop() !== 'page8.html') return;
    const body = document.querySelector('.content-body');
    if (!body) return;
    const items = state.items.filter(item => item.status !== 'arquivado').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    body.innerHTML = `<div class="cade-search-heading"><div><h2>Achados e perdidos recentes</h2><p>Itens cadastrados pela comunidade.</p></div><a class="btn-red" href="page21.html">Cadastrar item perdido</a></div>
      <div class="cade-search-grid">${items.length ? items.map(item => itemCard(item, 'page12')).join('') : '<div class="cade-empty"><strong>Nenhum item cadastrado.</strong></div>'}</div>`;
  }

  function renderHistory() {
    if (window.location.pathname.split('/').pop() !== 'page36.html') return;
    const body = document.querySelector('.content-body');
    if (!body) return;
    const user = currentUser();
    const ownerId = user ? user.id : 'demo-student';
    const items = state.items.filter(item => item.ownerId === ownerId && item.status !== 'procurando').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    body.innerHTML = `<h2>Histórico de itens</h2><div class="cade-item-list">${items.length ? items.map(item => itemCard(item, item.type === 'lost' ? 'page32' : 'page37')).join('') : '<div class="cade-empty"><div>🕒</div><strong>Seu histórico está vazio</strong><p>Itens encontrados ou arquivados aparecerão aqui.</p></div>'}</div>`;
  }

  function renderHomepageStats() {
    const page = window.location.pathname.split('/').pop();
    if (page !== 'page7.html' && page !== 'index.html') return;
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length >= 3) {
      stats[0].textContent = String(state.items.filter(item => item.status === 'encontrado').length);
      stats[1].textContent = String(state.items.filter(item => item.type === 'found' && item.status !== 'arquivado').length);
      stats[2].textContent = String(state.items.filter(item => item.type === 'lost' && item.status === 'procurando').length);
    }
  }

  function renderDashboard() {
    if (window.location.pathname.split('/').pop() !== 'page30.html') return;
    const user = currentUser();
    const heading = document.querySelector('h2');
    if (heading && user) heading.textContent = `Olá, ${user.name}!`;
    const nameBlock = document.querySelector('.screen-container > div:first-child');
    if (nameBlock && user) nameBlock.setAttribute('title', `${user.name} ${user.surname}`);
    const cards = document.querySelectorAll('.screen-container .card-box');
    if (cards.length >= 4) {
      cards[0].title = 'Meus alertas';
      cards[0].setAttribute('aria-label', 'Meus alertas');
      cards[1].title = 'Histórico';
      cards[2].title = 'Meus achados';
      cards[3].title = 'Sair da conta';
      cards[3].onclick = () => { state.currentUserId = null; saveState(); window.location.href = 'page2.html'; };
    }
  }

  function renderProfileForm() {
    if (window.location.pathname.split('/').pop() !== 'page41.html') return;
    const user = currentUser();
    if (!user) return;
    const fields = document.querySelectorAll('.screen-container input');
    const values = [user.name, user.surname, user.registration, user.cpf, user.email, user.phone];
    fields.forEach((field, index) => { if (values[index] !== undefined) field.value = values[index]; });
    const saveLink = document.querySelector('.screen-container > a.btn-black');
    if (saveLink) {
      const form = document.createElement('form');
      form.id = 'cadeProfileForm';
      form.className = 'cade-profile-form';
      const grid = document.querySelector('.screen-container > div[style*="display:grid"]');
      if (grid) form.appendChild(grid);
      saveLink.replaceWith(form);
      const button = document.createElement('button');
      button.type = 'submit';
      button.className = 'btn-black';
      button.style.cssText = 'margin-top:20px;width:100%;';
      button.textContent = 'Salvar alterações';
      form.appendChild(button);
    }
  }

  function bindSearch() {
    document.querySelectorAll('.search-bar input').forEach(input => {
      input.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          const query = input.value.trim();
          window.location.href = `page10.html?q=${encodeURIComponent(query)}`;
        }
      });
    });
  }

  function bindItemUpload() {
    const input = document.querySelector('[data-item-image]');
    if (!input) return;
    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
        toast('Escolha uma imagem JPG, PNG ou WEBP.', 'error');
        input.value = '';
        return;
      }
      if (file.size > 1.5 * 1024 * 1024) {
        toast('A imagem deve ter no máximo 1,5 MB para esta demonstração.', 'error');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        pendingImage = String(reader.result || '');
        const preview = document.querySelector('[data-image-preview]');
        if (preview) preview.innerHTML = `<img src="${pendingImage}" alt="Prévia do item">`;
      };
      reader.readAsDataURL(file);
    });
  }

  function findSimilarItems(item) {
    const keyWords = item.title.toLocaleLowerCase('pt-BR').split(/\W+/).filter(word => word.length > 3);
    if (!keyWords.length) return [];
    return state.items.filter(other => other.id !== item.id && other.type !== item.type && other.status !== 'arquivado' && keyWords.some(word => other.title.toLocaleLowerCase('pt-BR').includes(word)));
  }

  function handleNewItem(form) {
    const data = new FormData(form);
    const user = currentUser();
    const title = String(data.get('title') || '').trim();
    if (!title) return toast('Informe o nome do item.', 'error');
    const type = form.dataset.itemType;
    const item = {
      id: makeId('item'), type, title,
      brand: String(data.get('brand') || '').trim(),
      location: String(data.get('location') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      description: String(data.get('description') || '').trim(),
      status: 'procurando', ownerId: user ? user.id : 'demo-student',
      ownerName: user ? `${user.name} ${user.surname}`.trim() : 'João Palombo',
      createdAt: today(), image: pendingImage
    };
    state.items.unshift(item);
    const matches = findSimilarItems(item);
    matches.forEach(match => notify(match.ownerId, `Possível correspondência: ${item.title}`, `Um novo item foi cadastrado e pode combinar com “${match.title}”. Confira os detalhes no Cadê?.`));
    if (matches.length) notify(item.ownerId, 'Possível item correspondente', `Encontramos ${matches.length} item(ns) que podem combinar com “${item.title}”.`);
    saveState();
    pendingImage = '';
    toast('Item cadastrado com sucesso!');
    window.location.href = type === 'lost' ? 'page31.html' : 'page35.html';
  }

  function handleLogin(form) {
    const data = new FormData(form);
    const identifier = String(data.get('identifier') || '').trim().toLocaleLowerCase('pt-BR');
    const password = String(data.get('password') || '');
    const selectedRole = form.querySelector('input[name="userType"]:checked')?.value || 'aluno';
    const account = state.users.find(user => {
      const matchesIdentifier = [user.email, user.registration, user.cpf].some(value => String(value || '').toLocaleLowerCase('pt-BR') === identifier);
      const matchesRole = selectedRole === 'adm' ? user.role === 'admin' : user.role !== 'admin';
      return matchesIdentifier && matchesRole && user.password === password;
    });
    if (!account) {
      toast('Dados inválidos. Confira o acesso ou crie uma conta.', 'error');
      const message = document.getElementById('toastMessage');
      if (message) { message.textContent = 'Não foi possível entrar. Confira seus dados.'; message.classList.remove('hidden'); }
      return;
    }
    state.currentUserId = account.id;
    saveState();
    toast(`Bem-vindo(a), ${account.name}!`);
    window.location.href = account.role === 'admin' ? 'page22.html' : 'page30.html';
  }

  function handleSignup(form) {
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const surname = String(data.get('surname') || '').trim();
    const email = String(data.get('email') || '').trim().toLowerCase();
    const password = String(data.get('password') || '');
    const confirmPassword = String(data.get('confirmPassword') || '');
    if (password.length < 6) return toast('A senha deve ter pelo menos 6 caracteres.', 'error');
    if (password !== confirmPassword) return toast('As senhas não são iguais.', 'error');
    if (state.users.some(user => user.email.toLowerCase() === email)) return toast('Já existe uma conta com este e-mail.', 'error');
    const user = {
      id: makeId('user'), name, surname, email, password,
      registration: String(data.get('registration') || '').trim(),
      cpf: String(data.get('cpf') || '').replace(/\D/g, ''),
      phone: String(data.get('phone') || '').trim(),
      role: 'student', createdAt: today()
    };
    state.users.push(user);
    state.currentUserId = user.id;
    saveState();
    toast('Conta criada com sucesso!');
    window.location.href = 'page30.html';
  }

  function bindForms() {
    document.querySelectorAll('[data-item-form]').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      handleNewItem(form);
    }));
    document.querySelectorAll('[data-login-form]').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      handleLogin(form);
    }));
    document.querySelectorAll('[data-signup-form]').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      handleSignup(form);
    }));
    document.querySelectorAll('#cadeEditItemForm').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      const item = state.items.find(entry => entry.id === form.dataset.editItem);
      if (!item) return toast('Item não encontrado.', 'error');
      const data = new FormData(form);
      ['title', 'brand', 'location', 'phone', 'description', 'status'].forEach(key => { item[key] = String(data.get(key) || '').trim(); });
      saveState();
      toast('Alterações salvas!');
      window.location.href = `${item.type === 'lost' ? 'page32' : 'page37'}.html?id=${encodeURIComponent(item.id)}`;
    }));
    const profileForm = document.getElementById('cadeProfileForm');
    if (profileForm) profileForm.addEventListener('submit', event => {
      event.preventDefault();
      const user = currentUser();
      if (!user) return;
      const fields = profileForm.querySelectorAll('input');
      [user.name, user.surname, user.registration, user.cpf, user.email, user.phone] = Array.from(fields).map(field => field.value.trim());
      saveState();
      toast('Perfil atualizado!');
      window.location.href = 'page30.html';
    });
  }

  function bindGlobalActions() {
    document.addEventListener('click', event => {
      const markRead = event.target.closest('[data-mark-read]');
      if (markRead) {
        const note = state.notifications.find(entry => entry.id === markRead.dataset.markRead);
        if (note) { note.read = true; saveState(); renderNotifications(); updateHeader(); }
        return;
      }
      const contact = event.target.closest('[data-contact-item]');
      if (contact && contact.tagName !== 'FORM') {
        const item = state.items.find(entry => entry.id === contact.dataset.contactItem);
        if (item) renderContactModal(item);
        return;
      }
      const deleteButton = event.target.closest('[data-delete-item]');
      if (deleteButton && deleteButton.tagName !== 'FORM') {
        const item = state.items.find(entry => entry.id === deleteButton.dataset.deleteItem);
        if (item && window.confirm(`Deseja realmente excluir “${item.title}”?`)) {
          state.items = state.items.filter(entry => entry.id !== item.id);
          saveState();
          toast('Item excluído.');
          window.location.href = item.type === 'lost' ? 'page31.html' : 'page35.html';
        }
        return;
      }
      const cycle = event.target.closest('[data-cycle-status]');
      if (cycle) {
        const item = state.items.find(entry => entry.id === cycle.dataset.cycleStatus);
        if (item) {
          const statuses = ['procurando', 'encontrado', 'arquivado'];
          item.status = statuses[(statuses.indexOf(item.status) + 1) % statuses.length];
          saveState();
          toast(`Status atualizado: ${statusLabel(item.status)}.`);
          renderItemDetails();
        }
        return;
      }
      if (event.target.closest('[data-close-modal]')) document.getElementById('cadeContactModal')?.remove();
      if (event.target.id === 'cadeContactModal') event.target.remove();
      const logout = event.target.closest('[data-logout]');
      if (logout) { state.currentUserId = null; saveState(); window.location.href = 'page2.html'; }
    });

    document.addEventListener('submit', event => {
      const form = event.target.closest('#cadeContactForm');
      if (!form) return;
      event.preventDefault();
      const message = String(new FormData(form).get('message') || '').trim();
      if (!message) return toast('Escreva uma mensagem antes de enviar.', 'error');
      const ownerId = form.dataset.contactOwner;
      const itemId = form.dataset.contactItem;
      const item = state.items.find(entry => entry.id === itemId);
      state.messages.push({ id: makeId('message'), itemId, fromUserId: currentUser()?.id || 'guest', toUserId: ownerId, message, createdAt: new Date().toISOString() });
      notify(ownerId, `Nova mensagem sobre “${item?.title || 'seu item'}”`, message);
      saveState();
      document.getElementById('cadeContactModal')?.remove();
      toast('Mensagem enviada! O responsável receberá uma notificação.');
    });
  }

  function bindHeaderMenu() {
    window.adicionar = function () {
      const menu = document.getElementById('addContainer');
      if (menu) menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    };
    window.openDeleteModal = function () { document.getElementById('deleteModal')?.classList.add('active'); };
    window.closeDeleteModal = function () { document.getElementById('deleteModal')?.classList.remove('active'); };
  }

  function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (form && document.title.toLowerCase().includes('login')) {
      form.dataset.loginForm = 'true';
      form.removeAttribute('onsubmit');
      const identifier = form.querySelector('input[name="identifier"]');
      const password = form.querySelector('input[type="password"]');
      if (identifier) identifier.name = 'identifier';
      if (password) password.name = 'password';
      const radio = form.querySelector('input[name="userType"]');
      if (radio) radio.name = 'userType';
      const submit = form.querySelector('button[type="submit"]');
      if (submit && submit.parentElement.tagName === 'A') submit.parentElement.replaceWith(submit);
    }
  }

  function init() {
    bindHeaderMenu();
    if (window.location.pathname.split('/').pop() === 'page40.html') {
      document.querySelectorAll('a[href="page2.html"]').forEach(link => { if (link.classList.contains('btn-black')) link.dataset.logout = 'true'; });
    }
    updateHeader();
    bindSearch();
    bindItemUpload();
    initLoginPage();
    bindGlobalActions();
    renderOwnedLists();
    renderNotifications();
    renderSearchResults();
    renderRecentItems();
    renderHistory();
    renderItemDetails();
    renderHomepageStats();
    renderDashboard();
    renderProfileForm();
    bindForms();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Expose a tiny reset helper for classroom demonstrations/dev testing.
  window.cadeDemo = {
    reset() { localStorage.removeItem(STORAGE_KEY); state = clone(DEFAULTS); window.location.reload(); },
    getState() { return clone(state); }
  };
})();
