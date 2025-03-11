const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const enhanceBtn = document.getElementById("enhanceBtn");
const downloadBtn = document.getElementById("downloadBtn");
const restoreBtn = document.getElementById("restoreBtn");

let img = new Image();
let originalImageData = null;

// Evento para carregar imagem no canvas sem distorção
fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Desenha a imagem mantendo as proporções originais
img.onload = function () {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Salva a imagem original sem distorção
    originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

// Função aprimorada para realçar a imagem sem exageros
function enhanceImage() {
    if (!img.src) return;

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i];     
        let g = data[i + 1]; 
        let b = data[i + 2];

        // Calcular brilho médio
        let brightness = (r + g + b) / 3;

        // 🔹 Ajuste de brilho moderado para evitar manchas
        let brightnessFactor = brightness < 80 ? 1.08 : brightness < 180 ? 1.03 : 0.97;
        r = Math.min(255, r * brightnessFactor);
        g = Math.min(255, g * brightnessFactor);
        b = Math.min(255, b * brightnessFactor);

        // 🔹 Contraste mais equilibrado
        let contrastFactor = brightness < 128 ? 1.1 : 1.03;
        r = (r - 128) * contrastFactor + 128;
        g = (g - 128) * contrastFactor + 128;
        b = (b - 128) * contrastFactor + 128;

        // 🔹 Saturação mais sutil
        let saturationFactor = 1.05;
        let avg = (r + g + b) / 3;
        r = avg + (r - avg) * saturationFactor;
        g = avg + (g - avg) * saturationFactor;
        b = avg + (b - avg) * saturationFactor;

        // 🔹 Correção de temperatura da cor levemente quente
        let temperatureAdjustment = 1.015;
        r = Math.min(255, r * temperatureAdjustment);
        g = Math.min(255, g * 1.01);
        b = Math.min(255, b * 0.99);

        // 🔹 Suavização para evitar manchas e melhorar nitidez
        data[i] = Math.min(255, Math.max(0, r * 0.98 + 5));
        data[i + 1] = Math.min(255, Math.max(0, g * 0.98 + 5));
        data[i + 2] = Math.min(255, Math.max(0, b * 0.98 + 5));
    }

    ctx.putImageData(imageData, 0, 0);
}

// Função para restaurar a imagem original
function restoreImage() {
    if (originalImageData) {
        ctx.putImageData(originalImageData, 0, 0);
    }
}

// Evento para aprimorar a imagem ao clicar no botão
enhanceBtn.addEventListener("click", enhanceImage);

// Evento para restaurar a imagem original
restoreBtn.addEventListener("click", restoreImage);

// Função para baixar a imagem aprimorada
function downloadImage() {
    const link = document.createElement("a");
    link.download = "imagem_aprimorada.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Evento para baixar imagem
downloadBtn.addEventListener("click", downloadImage);
