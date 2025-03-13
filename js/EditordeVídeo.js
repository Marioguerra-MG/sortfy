document.addEventListener("DOMContentLoaded", () => {
    const videoInput = document.getElementById("videoInput");
    const videoPlayer = document.getElementById("videoPlayer");
    const filterRange = document.getElementById("filterRange");
    const spnRangeValue = document.getElementById("spnRangeValue");

    // Filtros
    const filterBrightness = document.getElementById("filterBrightness");
    const filterContrast = document.getElementById("filterContrast");
    const filterSaturation = document.getElementById("filterSaturation");
    const filterGrayscale = document.getElementById("filterGrayscale");
    const filterInvert = document.getElementById("filterInvert");

    let currentFilter = "brightness"; // Filtro inicial

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Função para aplicar o filtro ao vídeo
    const applyFilter = () => {
        let value = filterRange.value;
        let filterValue;

        switch (currentFilter) {
            case "brightness":
                filterValue = `brightness(${value}%)`;
                break;
            case "contrast":
                filterValue = `contrast(${value}%)`;
                break;
            case "saturation":
                filterValue = `saturate(${value}%)`;
                break;
            case "grayscale":
                filterValue = `grayscale(${value}%)`;
                break;
            case "invert":
                filterValue = `invert(${value}%)`;
                break;
            default:
                break;
        }

        // Aplica o filtro
        videoPlayer.style.filter = filterValue;
        spnRangeValue.textContent = `${value}%`;
    };

    // Evento para carregamento de vídeo
    videoInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            videoPlayer.src = url;
            videoPlayer.load();
        }
    });

    // Eventos dos filtros
    filterBrightness.addEventListener("click", () => {
        currentFilter = "brightness";
        filterRange.value = 100;
        applyFilter();
        updateActiveFilter(filterBrightness);
    });

    filterContrast.addEventListener("click", () => {
        currentFilter = "contrast";
        filterRange.value = 100;
        applyFilter();
        updateActiveFilter(filterContrast);
    });

    filterSaturation.addEventListener("click", () => {
        currentFilter = "saturation";
        filterRange.value = 100;
        applyFilter();
        updateActiveFilter(filterSaturation);
    });

    filterGrayscale.addEventListener("click", () => {
        currentFilter = "grayscale";
        filterRange.value = 0;
        applyFilter();
        updateActiveFilter(filterGrayscale);
    });

    filterInvert.addEventListener("click", () => {
        currentFilter = "invert";
        filterRange.value = 0;
        applyFilter();
        updateActiveFilter(filterInvert);
    });

    // Atualiza o filtro ativo
    const updateActiveFilter = (activeButton) => {
        document.querySelectorAll(".filters-content button").forEach((button) => {
            button.classList.remove("active");
        });
        activeButton.classList.add("active");
    };

    // Evento para o controle deslizante
    filterRange.addEventListener("input", applyFilter);

    // Função para limpar os filtros
    const btnResetFilters = document.getElementById("btnResetFilters");
    btnResetFilters.addEventListener("click", () => {
        filterRange.value = 100;
        videoPlayer.style.filter = "";
        spnRangeValue.textContent = "100%";
        document.querySelectorAll(".filters-content button").forEach((button) => {
            button.classList.remove("active");
        });
        filterBrightness.classList.add("active");
    });

    // Função para salvar o vídeo (gera uma imagem)
    const btnSalvarVideo = document.getElementById("btnSalvarVideo");
    btnSalvarVideo.addEventListener("click", () => {
        // Define o tamanho do canvas para o tamanho do vídeo
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        // Desenha o vídeo no canvas
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

        // Cria a URL para o conteúdo do canvas como imagem
        const imageUrl = canvas.toDataURL("image/png");

        // Cria um link de download para a imagem
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = "video_quadro_editado.png"; // Nome do arquivo de imagem
        a.click();
    });
});
