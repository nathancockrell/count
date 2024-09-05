document.addEventListener('DOMContentLoaded', function() {
    // Initialize data and UI elements
    const navbarTrigger = document.getElementById('navbar-trigger');
    const countersContainer = document.getElementById('countersContainer');
    const labelsContainer = document.getElementById('labelsContainer');
    const selectedLabelsDiv = document.getElementById('selectedLabels');
    const totalCount = document.getElementById('totalCount');
    const addCounterButton = document.getElementById('addCounterButton');
    const data = loadData();
    const today = new Date().toLocaleDateString();
    let shown = false;
    let selectedLabels = [];

    // Event Listeners
    setupNavbarToggle();
    setupAddCounterButton();
    
    // Initial Render
    render();

    // Setup Navbar Toggle
    function setupNavbarToggle() {
        navbarTrigger.addEventListener("click", () => {
            toggleNavbar();
        });
    }

    function toggleNavbar() {
        const navbarModal = document.getElementById("navbar-modal");
        if (!shown) {
            navbarModal.classList.remove("hidden");
            shown = true;
        } else {
            navbarModal.classList.add("hidden");
            shown = false;
        }
    }

    // Setup Add Counter Button
    function setupAddCounterButton() {
        addCounterButton.addEventListener('click', () => {
            const counterName = prompt("Enter counter name:");
            if (counterName) {
                addNewCounter(counterName);
                saveData();
                render();
            }
        });
    }

    function addNewCounter(name) {
        const newCounter = {
            name,
            count: 0,
            labels: [],
            history: [],
            color: ""
        };
        data.counters.push(newCounter);
    }

    // Data Handling
    function loadData() {
        const savedData = localStorage.getItem('habitTrackerData');
        return savedData ? JSON.parse(savedData) : initializeData();
    }

    function initializeData() {
        return {
            userName: '',
            counters: [],
            labels: [],
            preferences: ""
        };
    }

    function saveData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(data));
    }

    // Rendering Functions
    function render() {
        renderLabels(labelsContainer, selectedLabelsDiv, data.labels);
        renderCounters(countersContainer, data.counters, selectedLabels);
    }

    function renderCounters(location, counterArray, filter) {
        location.innerHTML = '';
        let total = 0;
        const filteredCounters = applyFilter(counterArray, filter);

        filteredCounters.forEach((counter, index) => {
            total += counter.count;
            location.appendChild(createCounterElement(counter, index));
        });

        totalCount.textContent = `Total: ${total}`;
        if (filteredCounters.length === 0) {
            location.innerHTML = "<p>No counters here</p>";
        }
    }

    function applyFilter(counterArray, filter) {
        if (filter.length === 0) return counterArray;

        return counterArray.filter(counter => 
            counter.labels.some(label => filter.includes(label.labelName))
        );
    }

    function createCounterElement(counter, index) {
        const counterDiv = document.createElement('div');
        counterDiv.className = 'counter';
        counterDiv.classList.add(`counter-${index}`);

        const infoDiv = document.createElement("div");
        infoDiv.classList.add("info-div");

        const counterName = document.createElement('h1');
        counterName.textContent = counter.name;

        const valueDiv = document.createElement("div");
        valueDiv.classList.add("value-div");

        const counterValue = document.createElement('span');
        counterValue.textContent = counter.count;

        const counterDayCount = document.createElement('span');
        // TODO: Calculate day count here

        const incrementDiv = document.createElement("div");
        incrementDiv.classList.add("increment-div");

        const incrementButton = document.createElement('button');
        incrementButton.classList.add("increment");
        incrementButton.textContent = '+';

        const incrementInput = document.createElement("input");
        incrementInput.type = 'number';
        incrementInput.placeholder = '1';

        incrementButton.addEventListener('click', () => {
            incrementCounter(counter, incrementInput.value || 1);
            renderCounters(countersContainer, data.counters, selectedLabels);
            saveData();
        });

        incrementDiv.appendChild(incrementInput);
        incrementDiv.appendChild(incrementButton);
        valueDiv.appendChild(counterValue);
        valueDiv.appendChild(counterDayCount);
        valueDiv.appendChild(incrementDiv);

        const counterEdit = createEditButton(counter);
        infoDiv.appendChild(counterName);
        infoDiv.appendChild(counterEdit);

        counterDiv.appendChild(infoDiv);
        counterDiv.appendChild(valueDiv);

        return counterDiv;
    }

    function incrementCounter(counter, incrementValue) {
        counter.count += parseInt(incrementValue, 10);

        let dayLog = counter.history.find(log => log.date === today);
        if (dayLog) {
            dayLog.amount += incrementValue;
        } else {
            counter.history.push({ date: today, amount: incrementValue });
        }
    }

    function createEditButton(counter) {
        const counterEdit = document.createElement('button');
        counterEdit.textContent = "⋮";
        counterEdit.classList.add('counter-edit');

        const editModal = createEditModal(counter);
        counterEdit.addEventListener("click", (event) => {
            toggleEditModal(editModal, event);
        });

        return counterEdit;
    }

    function createEditModal(counter) {
        const editModal = document.createElement("div");
        editModal.classList.add("hidden", "edit-modal");

        const editCounterButton = document.createElement("button");
        editCounterButton.textContent = "Edit";
        editCounterButton.addEventListener("click", () => {
            renderCounterModal(counter);
            editModal.classList.add("hidden");
        });

        // Additional edit buttons (Rename, Delete, Move, etc.)
        // ...

        editModal.appendChild(editCounterButton);
        return editModal;
    }

    function toggleEditModal(editModal, event) {
        if (editModal.classList.contains("hidden")) {
            editModal.style.top = `${event.clientY}px`;
            editModal.style.right = `${event.clientX + 200}px`;
            editModal.classList.remove("hidden");
            editModal.focus();
        } else {
            editModal.classList.add("hidden");
        }
    }

    function renderCounterModal(counter) {
        // Implementation for counter modal rendering
        // ...
    }

    function renderLabels(location, location2, array) {
        location.innerHTML = '';
        array.forEach(label => {
            const labelDiv = createLabelElement(label);
            location.appendChild(labelDiv);
        });

        renderSelectedLabels(location2);
    }

    function createLabelElement(label) {
        const labelDiv = document.createElement("div");
        labelDiv.classList.add("label-div");

        const labelTitle = document.createElement("p");
        labelTitle.classList.add("label-title");
        labelTitle.style.background = label.color;
        labelTitle.textContent = label.labelName;

        if (selectedLabels.includes(label)) {
            labelDiv.classList.add("selected");
        }

        labelDiv.addEventListener("click", () => {
            toggleLabelSelection(label);
            render();
        });

        labelDiv.appendChild(labelTitle);
        return labelDiv;
    }

    function toggleLabelSelection(label) {
        const index = selectedLabels.indexOf(label);
        if (index > -1) {
            selectedLabels.splice(index, 1);
        } else {
            selectedLabels.push(label);
        }
    }

    function renderSelectedLabels(location) {
        location.innerHTML = "<p class='labeltag'>Labels: </p>";
        selectedLabels.forEach(label => {
            const labelDisplay = createSelectedLabelElement(label);
            location.appendChild(labelDisplay);
        });
    }

    function createSelectedLabelElement(label) {
        const labelDisplay = document.createElement("div");
        labelDisplay.classList.add("label-display");

        const labelIcon = document.createElement("div");
        labelIcon.classList.add("label-icon");
        labelIcon.style.backgroundColor = label.color;

        const labelTitle = document.createElement("p");
        labelTitle.classList.add("label-title");
        labelTitle.textContent = label.labelName;

        labelDisplay.addEventListener("click", () => {
            selectedLabels = selectedLabels.filter(l => l !== label);
            render();
        });

        labelDisplay.appendChild(labelIcon);
        labelDisplay.appendChild(labelTitle);

        return labelDisplay;
    }
});
