const ROLL_NUMBER_ODD = true;
const STEP_SIZE = ROLL_NUMBER_ODD ? 3 : 2;

const fileInput = document.querySelector(".file-input");
const filterOptions = document.querySelectorAll(".filter-section .options button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");
const rotateOptions = document.querySelectorAll(".rotate .options button");
const previewImg = document.querySelector(".preview-img img");
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const resetFilterBtn = document.querySelector(".reset-filter");
const chooseImgBtn = document.querySelector(".choose-img");
const saveImgBtn = document.querySelector(".save-img");
const placeholderText = document.getElementById("placeholder-text");

const btnUndo = document.getElementById('btn-undo');
const btnRedo = document.getElementById('btn-redo');
const btnHistoryToggle = document.getElementById('toggle-history');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');


let originalImage = null;
let activeFilter = "brightness";

let filters = {
    brightness: 100,
    saturation: 100,
    inversion: 0,
    grayscale: 0,
    sepia: 0,
    rotate: 0,
    rotateSlider: 0,
    rotateGeometric: 0,
    flipHorizontal: 1,
    flipVertical: 1
};

const historyLog = [];
let currentHistoryIndex = -1;

const applyFilters = () => {
    if (!originalImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((filters.rotateGeometric + filters.rotateSlider) * Math.PI / 180);
    ctx.scale(filters.flipHorizontal, filters.flipVertical);

    ctx.filter = `brightness(${filters.brightness}%) saturate(${filters.saturation}%) invert(${filters.inversion}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur || 0}px)`;

    ctx.drawImage(originalImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    ctx.restore();
}

const loadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        originalImage = img;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.display = "block";
        placeholderText.style.display = "none";

        resetFilter();

        addToHistory("Image Loaded", true);
    }
}

const updateFilterUI = () => {
    filterName.innerText = activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);

    let val = filters[activeFilter];

    if (activeFilter === "brightness" || activeFilter === "saturation") {
        filterSlider.max = "200";
        filterSlider.value = val;
        filterValue.innerText = `${val}%`;
    } else if (activeFilter === "rotateSlider") {
        filterSlider.max = "180";
        filterSlider.min = "-180";
        filterSlider.value = val;
        filterValue.innerText = `${val}°`;
    } else if (activeFilter === "blur") {
        filterSlider.min = "0";
        filterSlider.max = "10";
        filterSlider.value = val !== undefined ? val : 0;
        filterValue.innerText = `${val}px`;
    } else {
        filterSlider.min = "0";
        filterSlider.max = "100";
        filterSlider.value = val;
        filterValue.innerText = `${val}%`;
    }
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter-section .options .active").classList.remove("active");
        option.classList.add("active");
        activeFilter = option.id;
        updateFilterUI();
    });
});

const updateFilter = () => {
    let val = parseInt(filterSlider.value);

    filterValue.innerText = `${val}%`;
    if (activeFilter === "rotateSlider") filterValue.innerText = `${val}°`;
    if (activeFilter === "blur") filterValue.innerText = `${val}px`;

    filters[activeFilter] = val;

    applyFilters();
}

filterSlider.addEventListener("input", updateFilter);
filterSlider.addEventListener("change", () => {
    addToHistory(`${activeFilter} Change`);
});
filterSlider.step = STEP_SIZE;


rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            filters.rotateGeometric = (filters.rotateGeometric - 90) % 360;
            addToHistory("Rotate Left");
        } else if (option.id === "right") {
            filters.rotateGeometric = (filters.rotateGeometric + 90) % 360;
            addToHistory("Rotate Right");
        } else if (option.id === "horizontal") {
            filters.flipHorizontal = filters.flipHorizontal === 1 ? -1 : 1;
            addToHistory("Flip Horizontal");
        } else if (option.id === "vertical") {
            filters.flipVertical = filters.flipVertical === 1 ? -1 : 1;
            addToHistory("Flip Vertical");
        }
        applyFilters();
    });
});

const resetFilter = () => {
    filters = {
        brightness: 100,
        saturation: 100,
        inversion: 0,
        grayscale: 0,
        sepia: 0,
        blur: 0,
        rotateSlider: 0,
        rotateGeometric: 0,
        flipHorizontal: 1,
        flipVertical: 1
    };

    activeFilter = "brightness";
    document.querySelector(".filter-section .options .active").classList.remove("active");
    filterOptions[0].classList.add("active");

    updateFilterUI();
    applyFilters();
}

resetFilterBtn.addEventListener("click", () => {
    resetFilter();
    addToHistory("Reset Filters");
});

const saveImage = () => {
    if (!originalImage) return;
    const link = document.createElement("a");
    link.download = "image.png";
    link.href = canvas.toDataURL();
    link.click();
}

const chooseImage = () => fileInput.click();

fileInput.addEventListener("change", loadFile);
chooseImgBtn.addEventListener("click", chooseImage);
saveImgBtn.addEventListener("click", saveImage);

function addToHistory(actionName, isInitial = false) {
    if (isInitial) {
        historyLog.length = 0;
        currentHistoryIndex = -1;
    }

    if (currentHistoryIndex < historyLog.length - 1) {
        historyLog.splice(currentHistoryIndex + 1);
    }

    historyLog.push({
        name: actionName,
        state: JSON.parse(JSON.stringify(filters))
    });
    currentHistoryIndex++;
    updateHistoryUI();
}

function updateHistoryUI() {
    btnUndo.disabled = currentHistoryIndex <= 0;
    btnRedo.disabled = currentHistoryIndex >= historyLog.length - 1;

    historyList.innerHTML = "";
    historyLog.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerText = item.name;
        if (index === currentHistoryIndex) li.classList.add("active");
        li.onclick = () => restoreHistory(index);
        historyList.appendChild(li);
    });
}


btnUndo.addEventListener("click", () => {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        restoreHistory(currentHistoryIndex, false);
    }
});

btnRedo.addEventListener("click", () => {
    if (currentHistoryIndex < historyLog.length - 1) {
        currentHistoryIndex++;
        restoreHistory(currentHistoryIndex, false);
    }
});

function restoreHistory(index, setIndex = true) {
    if (setIndex) currentHistoryIndex = index;
    filters = JSON.parse(JSON.stringify(historyLog[index].state));
    applyFilters();
    updateFilterUI();
    updateHistoryUI();
}

btnHistoryToggle.addEventListener("click", () => {
    historyPanel.classList.toggle("hidden");
    btnHistoryToggle.innerText = historyPanel.classList.contains("hidden") ? "Show History" : "Hide History";
});
