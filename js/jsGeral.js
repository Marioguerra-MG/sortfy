document.addEventListener("DOMContentLoaded", function () {
    const platformSelect = document.getElementById("platform");
    const descriptionInput = document.getElementById("titulo"); // Corrigido o ID
    const hashtagsInput = document.getElementById("hashtags");
    const scheduleInput = document.getElementById("schedule");
    const description = document.getElementById("description");
    const btnagendarPostagem = document.getElementById("btnagendarPostagem");

    // Função para alterar a cor dos inputs
    function changeInputColor(color) {
        platformSelect.style.borderColor = color;
        descriptionInput.style.borderColor = color; // Corrigido o ID
        description.style.borderColor = color;
        hashtagsInput.style.borderColor = color;
        scheduleInput.style.borderColor = color;
        btnagendarPostagem.style.backgroundColor = color;
    }

    // Evento ao mudar a plataforma
    platformSelect.addEventListener("change", function () {
        const selectedPlatform = platformSelect.value;

        if (selectedPlatform === "instagram") {
            changeInputColor("#E1306C"); // Cor rosa do Instagram
        } else if (selectedPlatform === "tiktok") {
            changeInputColor("#000000"); // Cor preta do TikTok
        } else if (selectedPlatform === "kawai") {
            changeInputColor("#fa7e1e"); // Cor amarela do Kawai
        }
    });

});

// Função para garantir que as hashtags comecem com '#'
document.getElementById('hashtags').addEventListener('input', function () {
    let hashtags = this.value.split(' '); // Divide as hashtags por espaço

    // Verifica se há hashtags sem o # e adiciona
    this.value = hashtags.map((tag, index) => {
        // Se for a primeira palavra ou se a palavra não começar com #, adiciona #
        return tag.startsWith('#') || tag === '' ? tag : `#${tag}`;
    }).join(' '); // Junta as hashtags de volta com um espaço
});



document.addEventListener("DOMContentLoaded", function () {
    const platformSelect2 = document.getElementById("platformfilter");
    const mainElement = document.querySelector("main"); // Seleciona o elemento main
    const openModalBtn = document.getElementById("openModalBtn"); // Seleciona o botão "ADD"

    // Função para alterar a cor de fundo do main
    function changeMainBackgroundColor(color) {
        mainElement.style.background = color;
    }

    // Função para alterar a cor do botão
    function changeButtonColor(color) {
        openModalBtn.style.backgroundColor = color;
    }

    // Evento ao mudar a plataforma
    platformSelect2.addEventListener("change", function () {
        const selectedPlatform = platformSelect2.value;

        if (selectedPlatform === "instagram") {
            changeMainBackgroundColor("linear-gradient(135deg, #E1306C, #d9e7ff)"); // Cor de fundo para Instagram
            changeButtonColor("#E1306C"); // Cor do botão para Instagram
        } else if (selectedPlatform === "tiktok") {
            changeMainBackgroundColor("linear-gradient(135deg, #333333, #1a1a1a)"); // Cor de fundo para TikTok
            changeButtonColor("#000000"); // Cor do botão para TikTok
        } else if (selectedPlatform === "kawai") {
            changeMainBackgroundColor("linear-gradient(135deg, #ffcb64, #ff9f00)"); // Cor de fundo para Kawai
            changeButtonColor("#ff7f00"); // Cor do botão para Kawai
        } else if (selectedPlatform === "todos") {
            changeMainBackgroundColor("linear-gradient(135deg, #f0f8ff, #d9e7ff)"); // Cor de fundo padrão
        }
    });

});

