// ---------------- TOAST ----------------
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  if (type === "success") toast.style.background = "#4CAF50";
  else if (type === "error") toast.style.background = "#F44336";
  else if (type === "info") toast.style.background = "#2196F3";

  container.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => container.removeChild(toast), 300);
  }, 3000);
}

// ---------------- LOCAL STORAGE ----------------
function getPosts() {
  return JSON.parse(localStorage.getItem('scheduledPosts')) || [];
}

function savePosts(posts) {
  localStorage.setItem('scheduledPosts', JSON.stringify(posts));
}

// ---------------- INÍCIO ----------------
window.onload = function() {
  requestNotificationPermission();
  loadScheduledPosts();
  setupFilter();
  checkUpcomingPosts();
  updateStats();
  startCountdowns();
}

// ---------------- NOTIFICAÇÕES ----------------
function requestNotificationPermission() {
  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission();
  }
}

function sendNotification(post) {
  if (Notification.permission === 'granted') {
    new Notification(`Postagem em breve: ${post.title}`, {
      body: `A postagem na plataforma ${post.platform} será realizada em breve.`,
      icon: 'icon.png'
    });
  }
}

// ---------------- LOAD POSTS ----------------
function loadScheduledPosts(platformFilter = '') {
  const postList = document.getElementById('scheduled-posts');
  postList.innerHTML = '';

  let posts = getPosts();

  if (platformFilter && platformFilter !== 'todos') {
    posts = posts.filter(p => p.platform === platformFilter);
  }

  posts.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));

  posts.forEach(post => displayScheduledPost(post));
  updateStats();
}

// ---------------- DISPLAY POSTS ----------------
function displayScheduledPost(post) {
  const postList = document.getElementById('scheduled-posts');
  const li = document.createElement('li');

  const descriptionLimit = 150;
  let truncated = post.description;
  if (truncated.length > descriptionLimit) truncated = truncated.substring(0, descriptionLimit) + '...';

  let borderColor = '#969696';
  if (post.platform === 'instagram') borderColor = '#E1306C';
  else if (post.platform === 'kawai') borderColor = '#F85959';
  else if (post.platform === 'tiktok') borderColor = '#69C9D0';

  li.style.borderLeft = `5px solid ${borderColor}`;
  li.style.padding = "10px";
  li.style.marginBottom = "8px";

  li.innerHTML = `
    <strong>Plataforma:</strong> ${post.platform}<br>
    <strong>Título:</strong> ${post.title}<br>
    <strong>Descrição:</strong> <span class="description-text">${truncated}</span>
    ${post.description.length > descriptionLimit ? '<a href="#" class="see-more"> Ver mais</a>' : ''}<br>
    ${post.hashtags ? `<strong>Hashtags:</strong> ${post.hashtags}<br>` : ''}
    <strong>Agendado para:</strong> ${new Date(post.schedule).toLocaleString()}<br>
    <strong>Status:</strong> <span class="status-text">${post.posted ? 'Postado' : 'Pendente'}</span>
    <br>
    <div class="countdown" id="countdown-${post.id}"></div>

    <div class="grupoCopiarExcluir">
      <button class="copy-btn">Copiar</button>
      <button class="delete-btn">Excluir</button>
      <button class="edit-btn">Editar</button>
      <!--<button class="posted-btn">${post.posted ? 'Desmarcar' : 'Marcar Postado'}</button>
      <button class="favorite-btn">${post.favorite ? '★' : '☆'}</button>
      -->
    </div>
  `;

  // Ver mais
  const seeMore = li.querySelector('.see-more');
  if (seeMore) {
    seeMore.addEventListener('click', e => {
      e.preventDefault();
      li.querySelector('.description-text').textContent = post.description;
      seeMore.remove();
    });
  }

  // Botões
  li.querySelector('.copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(`${post.title}\n${post.description}\n${post.hashtags || ''}`);
    showToast("Copiado para área de transferência!", "success");
  });

  li.querySelector('.delete-btn').addEventListener('click', () => {
    deletePost(post.id);
  });

  li.querySelector('.edit-btn').addEventListener('click', () => {
    openModalWithPost(post);
  });
  /*
  li.querySelector('.posted-btn').addEventListener('click', () => {
    togglePosted(post.id);
  });

  li.querySelector('.favorite-btn').addEventListener('click', (e) => {
    toggleFavorite(post.id, e.target);
  });
  */

  postList.appendChild(li);
}

// ---------------- CRUD ----------------
function addPost(post) {
  let posts = getPosts();
  posts.push(post);
  savePosts(posts);
  loadScheduledPosts();
  showToast("Post agendado com sucesso!", "success");
}

function deletePost(id) {
  let posts = getPosts();
  posts = posts.filter(p => p.id !== id);
  savePosts(posts);
  loadScheduledPosts();
  showToast("Post excluído!", "info");
}

function updatePost(updatedPost) {
  let posts = getPosts();
  posts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
  savePosts(posts);
  loadScheduledPosts();
}

// ---------------- TOGGLE POSTED/FAVORITE ----------------
function togglePosted(id) {
  let posts = getPosts();
  posts = posts.map(p => {
    if (p.id === id) p.posted = !p.posted;
    return p;
  });
  savePosts(posts);
  loadScheduledPosts();
}

function toggleFavorite(id, btn) {
  let posts = getPosts();
  posts = posts.map(p => {
    if (p.id === id) {
      p.favorite = !p.favorite;
      btn.textContent = p.favorite ? '★' : '☆';
    }
    return p;
  });
  savePosts(posts);
}

// ---------------- EDIT MODAL ----------------
function openModalWithPost(post) {
  document.getElementById("modal").style.display = "block";
  document.getElementById("platform").value = post.platform;
  document.getElementById("titulo").value = post.title;
  document.getElementById("description").value = post.description;
  document.getElementById("hashtags").value = post.hashtags || '';
  document.getElementById("schedule").value = post.schedule;

  document.getElementById("post-form").onsubmit = function(e) {
    e.preventDefault();
    const updatedPost = {
      id: post.id,
      platform: document.getElementById("platform").value,
      title: document.getElementById("titulo").value,
      description: document.getElementById("description").value,
      hashtags: document.getElementById("hashtags").value,
      schedule: document.getElementById("schedule").value,
      posted: post.posted || false,
      favorite: post.favorite || false
    };
    updatePost(updatedPost);
    document.getElementById("post-form").reset();
    document.getElementById("modal").style.display = "none";
    showToast("Post atualizado com sucesso!", "success");
  };
}

// ---------------- STATS ----------------
function updateStats() {
  const posts = getPosts(); // função que retorna os posts do localStorage
  const container = document.getElementById("stats-container");
  container.innerHTML = '';

  const statsData = [
    { title: 'Total de Posts', value: posts.length, icon: 'fa-solid fa-database', color: '#0081CF' },
    { title: 'Instagram', value: posts.filter(p => p.platform==='instagram').length, icon: 'fa-brands fa-instagram', color: '#E1306C' },
    { title: 'TikTok', value: posts.filter(p => p.platform==='tiktok').length, icon: 'fa-brands fa-tiktok', color: '#000' },
    { title: 'Kwai', value: posts.filter(p => p.platform==='kawai').length, icon: 'fa-solid fa-video', color: '#F85959' },
  ];

  statsData.forEach(stat => {
    const item = document.createElement('div');
    item.className = 'stat-item';

    item.innerHTML = `
      <div class="stat-top">
        <i class="${stat.icon}" style="background:${stat.color}"></i>
        <div class="stat-content">
          <span class="stat-title">${stat.title}</span>
          <span class="stat-value">${stat.value}</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${posts.length ? (stat.value/posts.length*100).toFixed(1) : 0}%"></div>
      </div>
    `;

    container.appendChild(item);
  });
}


//---------------- FILTER ----------------
function setupFilter() {
  // Filtro por plataforma (apenas select)
  document.getElementById('platformfilter').addEventListener('change', function() {
    loadScheduledPosts(this.value);
  });
}

// ---------------- CHECK UPCOMING ----------------
function checkUpcomingPosts() {
  const posts = getPosts();
  const now = Date.now();

  posts.forEach(post => {
    const postTime = new Date(post.schedule).getTime();
    const diff = postTime - now;
    if (diff > 0 && diff <= 10 * 60 * 1000) sendNotification(post);
  });

  setTimeout(checkUpcomingPosts, 60000);
}

// ---------------- COUNTDOWN ----------------
function startCountdowns() {
  setInterval(() => {
    const posts = getPosts();
    posts.forEach(post => {
      const cdElem = document.getElementById(`countdown-${post.id}`);
      if (!cdElem) return;
      const diff = new Date(post.schedule).getTime() - Date.now();
      if (diff <= 0) {
        cdElem.textContent = 'Postado!';
      } else {
        const h = Math.floor(diff / (1000*60*60));
        const m = Math.floor((diff % (1000*60*60)) / (1000*60));
        const s = Math.floor((diff % (1000*60)) / 1000);
        cdElem.textContent = `Faltam: ${h}h ${m}m ${s}s`;
      }
    });
  }, 1000);
}

// ---------------- FORM SUBMIT ----------------
document.getElementById('post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const post = {
    id: Date.now(),
    platform: document.getElementById("platform").value,
    title: document.getElementById("titulo").value,
    description: document.getElementById("description").value,
    hashtags: document.getElementById("hashtags").value,
    schedule: document.getElementById("schedule").value,
    posted: false,
    favorite: false
  };
  addPost(post);
  document.getElementById("post-form").reset();
  document.getElementById("modal").style.display = "none";
});
