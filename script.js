document.addEventListener('DOMContentLoaded', function() {
    let data = loadData();

    const folderList = document.getElementById('folderList');
    const countersContainer = document.getElementById('countersContainer');
    const totalCount = document.getElementById('totalCount');
    const selectedFolderName = document.getElementById('selectedFolderName');
    let selectedFolder = data.folders[0]; // Default to "All Counters"

    function loadData() {
        const savedData = localStorage.getItem('habitTrackerData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            userName: '',
            folders: [
                { folderName: "All Counters", counters: [] }
            ]
        };
    }

    function saveData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(data));
    }

    function renderFolders() {
        folderList.innerHTML = '';
        data.folders.forEach((folder, index) => {
            const folderItem = document.createElement('li');
            folderItem.className = 'folder';
            folderItem.textContent = folder.folderName;
            folderItem.setAttribute('draggable', true);
            folderItem.dataset.index = index;

            if (folder === selectedFolder) {
                folderItem.classList.add('selected');
            }

            folderItem.addEventListener('click', () => {
                selectedFolder = folder;
                renderCounters();
                renderFolders();
            });

            folderItem.addEventListener('dragstart', (e) => {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', index);
            });

            folderItem.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            folderList.appendChild(folderItem);
        });
    }

    function renderCounters() {
        countersContainer.innerHTML = '';
        let total = 0;

        selectedFolder.counters.forEach((counter, index) => {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'counter';

            const counterName = document.createElement('span');
            counterName.textContent = counter.name;

            const counterValue = document.createElement('span');
            counterValue.textContent = counter.count;

            const incrementInput = document.createElement('input');
            incrementInput.type = 'number';
            incrementInput.value = 1;

            const incrementButton = document.createElement('button');
            incrementButton.textContent = '+';

            incrementButton.addEventListener('click', () => {
                const incrementValue = parseInt(incrementInput.value) || 1;
                counter.count += incrementValue;
                counter.history.push({ date: new Date().toLocaleDateString(), amount: incrementValue });
                renderCounters();
                saveData();
            });

            counterDiv.appendChild(counterName);
            counterDiv.appendChild(counterValue);
            counterDiv.appendChild(incrementInput);
            counterDiv.appendChild(incrementButton);

            countersContainer.appendChild(counterDiv);

            total += counter.count;
        });

        totalCount.textContent = `Total: ${total}`;
        selectedFolderName.textContent = selectedFolder.folderName;
    }

    document.getElementById('createFolderButton').addEventListener('click', () => {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            data.folders.push({ folderName, counters: [] });
            renderFolders();
            saveData();
        }
    });

    document.getElementById('addCounterButton').addEventListener('click', () => {
        const counterName = prompt("Enter counter name:");
        if (counterName) {
            const newCounter = { name: counterName, count: 0, history: [] };

            // Add to selected folder
            selectedFolder.counters.push(newCounter);

            // Always add to "All Counters" folder
            data.folders[0].counters.push(newCounter);

            renderCounters();
            saveData();
        }
    });

    document.getElementById('editCountersButton').addEventListener('click', () => {
        let action = prompt("Type 'delete' to remove counters, 'reorder' to reorder:");
        if (action === 'delete') {
            const counterName = prompt("Enter the name of the counter to delete:");
            selectedFolder.counters = selectedFolder.counters.filter(counter => counter.name !== counterName);
            renderCounters();
            saveData();
        } else if (action === 'reorder') {
            alert('Drag and drop counters to reorder them.');
            enableCounterReordering();
        }
    });

    document.getElementById('editFoldersButton').addEventListener('click', () => {
        let action = prompt("Type 'delete' to remove folders, 'reorder' to reorder:");
        if (action === 'delete') {
            const folderName = prompt("Enter the name of the folder to delete (except 'All Counters'):");
            if (folderName !== "All Counters") {
                data.folders = data.folders.filter(folder => folder.folderName !== folderName);
                selectedFolder = data.folders[0];
                renderFolders();
                renderCounters();
                saveData();
            } else {
                alert("Cannot delete 'All Counters' folder.");
            }
        } else if (action === 'reorder') {
            alert('Drag and drop folders to reorder them.');
            enableFolderReordering();
        }
    });

    function enableCounterReordering() {
        const counters = countersContainer.querySelectorAll('.counter');
        counters.forEach((counter, index) => {
            counter.setAttribute('draggable', true);
            counter.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                e.target.classList.add('dragging');
            });

            counter.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            counter.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = countersContainer.querySelector('.dragging');
                const targetElement = e.target.closest('.counter');
                if (targetElement && targetElement !== draggingElement) {
                    countersContainer.insertBefore(draggingElement, targetElement.nextSibling);
                    reorderCounters();
                }
            });
        });
    }

    function reorderCounters() {
        const reorderedCounters = Array.from(countersContainer.querySelectorAll('.counter')).map((counter, index) => {
            const counterName = counter.querySelector('span').textContent;
            return selectedFolder.counters.find(c => c.name === counterName);
       
        });
        selectedFolder.counters = reorderedCounters;
        saveData();
    }

    function enableFolderReordering() {
        const folders = folderList.querySelectorAll('.folder');
        folders.forEach((folder, index) => {
            folder.setAttribute('draggable', true);
            folder.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                e.target.classList.add('dragging');
            });

            folder.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            folder.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingElement = folderList.querySelector('.dragging');
                const targetElement = e.target.closest('.folder');
                if (targetElement && targetElement !== draggingElement) {
                    folderList.insertBefore(draggingElement, targetElement.nextSibling);
                    reorderFolders();
                }
            });
        });
    }

    function reorderFolders() {
        const reorderedFolders = Array.from(folderList.querySelectorAll('.folder')).map((folder, index) => {
            const folderName = folder.textContent;
            return data.folders.find(f => f.folderName === folderName);
        });
        data.folders = reorderedFolders;
        saveData();
    }

    renderFolders();
    renderCounters();
});
