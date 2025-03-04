// Carregar agendamentos ao iniciar
window.onload = function () {
  loadScheduledPosts();
  setupFilter();  // Configurar o filtro
  checkUpcomingPosts();  // Verificar agendamentos próximos a serem postados
};

// Função para carregar os agendamentos do localStorage
function loadScheduledPosts(platformFilter = '') {
  const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
  
  // Se houver um filtro de plataforma, filtra os agendamentos
  const filteredPosts = platformFilter && platformFilter !== 'todos'
    ? scheduledPosts.filter(post => post.platform === platformFilter)
    : scheduledPosts;

  // Ordena os posts pela data de agendamento (mais próximo de ser postado)
  const sortedPosts = filteredPosts.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));

  sortedPosts.forEach(post => {
    displayScheduledPost(post);
  });
}

// Função para verificar os agendamentos próximos (10 minutos antes)
function checkUpcomingPosts() {
  const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
  const currentTime = new Date().getTime();
  
  scheduledPosts.forEach(post => {
    const postTime = new Date(post.schedule).getTime();
    const timeDifference = postTime - currentTime;

    // Verifica se a diferença de tempo é de 10 minutos ou menos
    if (timeDifference > 0 && timeDifference <= 10 * 60 * 1000) {
      sendNotification(post);
    }
  });

  // Verificar novamente a cada 60 segundos (60000 ms)
  setTimeout(checkUpcomingPosts, 60000);
}

// Função para enviar notificação
function sendNotification(post) {
  if (Notification.permission === 'granted') {
    new Notification(`Postagem em breve: ${post.title}`, {
      body: `A postagem na plataforma ${post.platform} será realizada em 10 minutos.`,
      icon: 'icon.png'  // Você pode adicionar um ícone de sua escolha
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        sendNotification(post);
      }
    });
  }
}

// Função para salvar os agendamentos no localStorage
function saveScheduledPosts(posts) {
  localStorage.setItem('scheduledPosts', JSON.stringify(posts));
}

// Função para exibir os agendamentos na lista
function displayScheduledPost(post) {
  const postList = document.getElementById('scheduled-posts');
  const li = document.createElement('li');

  const descriptionLimit = 600;
  let truncatedDescription = post.description;

  if (truncatedDescription.length > descriptionLimit) {
    truncatedDescription = truncatedDescription.substring(0, descriptionLimit) + '...';
  }

  // Adicionando a cor da borda com base na plataforma
  let borderColor = '#969696'; // Cor padrão (neutra)
  if (post.platform === 'Instagram') {
    borderColor = '#E1306C'; // Cor rosa do Instagram
  } else if (post.platform === 'Kwai') {
    borderColor = '#F85959'; // Cor vermelho/rosado do Kwai
  } else if (post.platform === 'TikTok') {
    borderColor = '#69C9D0'; // Cor turquesa do TikTok
  }

  li.innerHTML = ` 
    <strong>Plataforma:</strong> ${post.platform}<br>
    <strong>Título:</strong> ${post.title}<br> 
    <strong>Descrição:</strong> <span class="description-text">${truncatedDescription}</span>
    ${post.description.length > descriptionLimit ? '<a href="#" class="see-more">Ver mais</a>' : ''}<br>
    ${post.hashtags ? `<strong>Hashtags:</strong> ${post.hashtags}<br>` : ''} 
    <strong>Agendado para:</strong> ${new Date(post.schedule).toLocaleString()}<br>

    <div class="grupoCopiarExcluir">
      <div class="editar">
        <button class="copy-btn"><i id="copiar" class="fa-solid fa-copy"></i></button>
        <p>Copiar</p>
      </div>

      <div class="editar">
        <button class="delete-btn" onclick="deleteScheduledPost('${post.schedule}')"><i class="fa-solid fa-trash"></i></button>
        <p>Excluir</p>
      </div> 
    </div>
  `;

  const seeMoreButton = li.querySelector('.see-more');
  if (seeMoreButton) {
    seeMoreButton.addEventListener('click', function (e) {
      e.preventDefault();
      const fullDescription = li.querySelector('.description-text');
      fullDescription.textContent = post.description;
      seeMoreButton.remove();
    });
  }

  const copyButton = li.querySelector('.copy-btn');
  copyButton.addEventListener('click', () => copyToClipboard(post.title, post.description, post.hashtags));

  postList.appendChild(li);
}

// Função para copiar descrição e hashtags para a área de transferência
function copyToClipboard(title, description, hashtags) {
  const textToCopy = `${title} \n${description}\n ${hashtags}`;
  navigator.clipboard.writeText(textToCopy)
    .then(() => alert('Copiado para a área de transferência!'))
    .catch(err => console.error('Erro ao copiar:', err));
}

// Função para excluir um agendamento
function deleteScheduledPost(schedule) {
  let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
  scheduledPosts = scheduledPosts.filter(post => post.schedule !== schedule);
  saveScheduledPosts(scheduledPosts);
  reloadPostList();
}

// Função para recarregar a lista de agendamentos
function reloadPostList(platformFilter) {
  const postList = document.getElementById('scheduled-posts');
  postList.innerHTML = '';
  loadScheduledPosts(platformFilter);  // Passa o filtro para a função de carregamento
}

// Função para configurar o filtro
function setupFilter() {
  const platformFilterSelect = document.getElementById('platformfilter');
  
  platformFilterSelect.addEventListener('change', function() {
    const selectedPlatform = platformFilterSelect.value;
    reloadPostList(selectedPlatform);  // Passa a plataforma selecionada para recarregar os posts
  });
}

// Validação do formulário
function validateForm(platform, description, schedule) {
  if (!platform || !description || !schedule) {
      alert("Todos os campos são obrigatórios!");
      return false;
  }
  return true;
}

// Evento de envio do formulário
document.getElementById('post-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const platform = document.getElementById('platform').value;
  const title = document.getElementById('titulo').value;
  const description = document.getElementById('description').value;
  const hashtags = document.getElementById('hashtags').value;
  const schedule = document.getElementById('schedule').value;

  if (!validateForm(platform, title, description, hashtags, schedule)) return;

  let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
  
  scheduledPosts.push({ platform, title, description, hashtags, schedule });

  saveScheduledPosts(scheduledPosts);
  reloadPostList();
  document.getElementById('post-form').reset();
});
