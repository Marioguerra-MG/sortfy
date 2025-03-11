document.addEventListener("DOMContentLoaded", () => {
    const newImg = document.getElementById('newImg');
    const inputFile = document.querySelector("input[type=file]");
    const img = document.querySelector(".img-content img");

    const buttonsFilter = document.querySelectorAll(".filters-content button");

    const range = document.querySelector("input[type=range]");
    const spnRangeValue = document.getElementById('spnRangeValue');

    const btnResetFilters = document.getElementById('btnResetFilters');
    const btnSalvar = document.getElementById('btnSalvarImg');

    let rotate, flipY, flipX;
    let filterActive;
    let filters;

    btnResetFilters.onclick = () => init();

    init();

    function init() {
        filters = {
            Brilho: { value: 100, max: 200 },
            Contraste: { value: 100, max: 200 },
            Saturação: { value: 100, max: 200 },
            Cinza: { value: 0, max: 100 },
            Inversão: { value: 0, max: 100 },
        };

        rotate = 0;
        flipY = 1;
        flipX = 1;

        filterActive = "Brilho";

        spnRangeValue.innerHTML = filters[filterActive].value;
        range.max = filters[filterActive].max;
        range.value = filters[filterActive].value;

        if (img) {
            img.style.transform = "";
            img.style.filter = "";
        } else {
            console.error("Erro: Elemento <img> não encontrado.");
            return;
        }

        const activeButton = document.querySelector(".active");
        if (activeButton) {
            activeButton.classList.remove("active");
        }

        const filterDefault = document.getElementById('filterDefault');
        if (filterDefault) {
            filterDefault.classList.add("active");
        }
    }

    newImg.onclick = () => inputFile.click();

    inputFile.onchange = () => loadNewImage();

    function loadNewImage() {
        let file = inputFile.files[0];

        if (file) {
            img.src = URL.createObjectURL(file);
        }

        init();
    }

    buttonsFilter.forEach((item) => {
        item.onclick = () => {
            const activeElement = document.querySelector(".active");
            if (activeElement) {
                activeElement.classList.remove('active');
            }
            item.classList.add("active");

            // Define o filtro ativo
            const selectedFilter = item.innerHTML.trim(); // Remove espaços extras
            if (!filters[selectedFilter]) {
                console.error(`Filtro "${selectedFilter}" não encontrado.`);
                return;
            }

            filterActive = selectedFilter;

            // Atualiza os valores do range apenas se o filtro existir
            range.max = filters[filterActive].max;
            range.value = filters[filterActive].value;
            spnRangeValue.innerHTML = range.value;
        };
    });

    range.oninput = () => {
        if (!filters[filterActive]) return;

        filters[filterActive].value = range.value;
        spnRangeValue.innerHTML = range.value;

        img.style.filter = `
        brightness(${filters["Brilho"].value}%)
        contrast(${filters["Contraste"].value}%)
        saturate(${filters["Saturação"].value}%)
        grayscale(${filters["Cinza"].value}%)
        invert(${filters["Inversão"].value}%)
        `;
    };

    function handleDirection(type) {
        if (type === "rotateRight") {
            rotate += 90;
        } else if (type === "rotateLeft") {
            rotate -= 90;
        } else if (type === "reflectY") {
            flipY = flipY === 1 ? -1 : 1;
        } else {
            flipX = flipX === 1 ? -1 : 1;
        }

        if (img) {
            img.style.transform = `rotate(${rotate}deg) scale(${flipY}, ${flipX})`;
        } else {
            console.error("Erro: Elemento <img> não encontrado.");
        }
    }

    btnSalvar.onclick = () => download();

    function download() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        ctx.filter = `
        brightness(${filters["Brilho"].value}%)
        contrast(${filters["Contraste"].value}%)
        saturate(${filters["Saturação"].value}%)
        grayscale(${filters["Cinza"].value}%)
        invert(${filters["Inversão"].value}%)
        `;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotate !== 0) ctx.rotate((rotate * Math.PI) / 180);

        ctx.scale(flipY, flipX);
        ctx.drawImage(
            img,
            -canvas.width / 2,
            -canvas.height / 2,
            canvas.width,
            canvas.height
        );

        const link = document.createElement("a");
        link.download = "Foto_Editada.png";
        link.href = canvas.toDataURL();
        link.click();
    }

    window.handleDirection = handleDirection;
});
