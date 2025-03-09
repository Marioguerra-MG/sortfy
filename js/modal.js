// Selecionando os elementos
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modal = document.getElementById('modal');

// Função para abrir o modal
openModalBtn.addEventListener('click', () => {
  modal.style.display = 'flex'; // Exibe o modal (flex para centralizar)
});

// Função para fechar o modal
closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none'; // Oculta o modal
});

// Fechar o modal clicando fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

function editScheduledPost(schedule) {
  let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts')) || [];
  const postToEdit = scheduledPosts.find(post => post.schedule === schedule);

  if (!postToEdit) return;

  // Preenche os campos do modal com os dados do agendamento
  document.getElementById('modalPlatform').value = postToEdit.platform;
  document.getElementById('modalTitulo').value = postToEdit.title;
  document.getElementById('modalDescription').value = postToEdit.description;
  document.getElementById('modalHashtags').value = postToEdit.hashtags;
  document.getElementById('modalSchedule').value = postToEdit.schedule;

  // Exibe o modal
  const modal = document.getElementById('editModal');
  modal.style.display = "block";

  // Marca o formulário como "editando" e salva a referência ao agendamento
  document.getElementById('modalForm').dataset.editing = schedule;

  // Fecha o modal quando o botão de fechar for clicado
  document.querySelector('.close-btn').addEventListener('click', function () {
    modal.style.display = "none";
  });

  // Fecha o modal quando o usuário clicar fora da área do modal
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };

  // Lógica de submissão do formulário do modal
  document.getElementById('modalForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const platform = document.getElementById('modalPlatform').value;
    const title = document.getElementById('modalTitulo').value;
    const description = document.getElementById('modalDescription').value;
    const hashtags = document.getElementById('modalHashtags').value;
    const schedule = document.getElementById('modalSchedule').value;

    // Atualiza o agendamento específico
    scheduledPosts = scheduledPosts.map(post => {
      if (post.schedule === schedule) {
        return { platform, title, description, hashtags, schedule };
      }
      return post;
    });

    // Salva os agendamentos atualizados
    saveScheduledPosts(scheduledPosts);

    // Fecha o modal
    modal.style.display = "none";

    // Atualiza a lista de agendamentos
    reloadPostList();
  });
}

// Modal menu

// Selecionando os elementos
const openModalBtnMenu = document.getElementById('openModalBtnMenu');
const closeModalBtnMenu = document.getElementById('closeModalBtnMenu');
const modalMenu = document.getElementById('modalMenu');

// Função para abrir o modal
openModalBtnMenu.addEventListener('click', () => {
  modalMenu.style.display = 'flex'; // Exibe o modal (flex para centralizar)
});

// Função para fechar o modal
closeModalBtnMenu.addEventListener('click', () => {
  modalMenu.style.display = 'none'; // Oculta o modal
});

// Fechar o modal clicando fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modalMenu.style.display = 'none';
  }
});
