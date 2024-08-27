document.addEventListener('DOMContentLoaded', function() {
    let data = loadData();
    let today = new Date().toLocaleDateString();

    const navbarTrigger = document.getElementById('navbar-trigger')
    const folderList = document.getElementById('folderList');
    const countersContainer = document.getElementById('countersContainer');
    const totalCount = document.getElementById('totalCount');
    const selectedFolderName = document.getElementById('selectedFolderName');
    let selectedFolder = data.folders[0]; // Default to "All Counters"

    let shown=false;
    navbarTrigger.addEventListener("click", ()=>{
        if(!shown) {
            document.getElementById("navbar-modal").classList.remove("hidden")
            shown=true;
        }else {
            document.getElementById("navbar-modal").classList.add("hidden")
            shown=false;
        }
    })

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
            counterDiv.classList.add(index)

            const counterName = document.createElement('h1');
            counterName.textContent = counter.name;

            const incrementDiv = document.createElement("div");
            incrementDiv.classList.add("increment-div")

            const incrementButton = document.createElement('button');
            incrementButton.classList.add("increment")
            incrementButton.textContent = '+';
            const incrementInput = document.createElement('input');
            incrementInput.type = 'number';
            incrementInput.value = 1;

            const counterValue = document.createElement('span');
            counterValue.textContent = counter.count;
            const counterDayCount = document.createElement('span')
            let dayLog = counter.history.filter(x => x.date === today)
            if(dayLog.length>0)counterDayCount.textContent = dayLog[0].amount;
            else{counterDayCount.textContent = 0;}
            // 

            const counterEdit = document.createElement('button');
            counterEdit.textContent = "⋮"
            counterEdit.classList.add('counter-edit')
            const editModal = document.createElement("div");
            editModal.classList.add("hidden");
            editModal.classList.add("edit-modal");

            const editCounter = document.createElement("button")
            editCounter.textContent = "Edit"
            const editColor = document.createElement("button")
            editColor.textContent = "Color"

            const editTitle = document.createElement("p");
            editTitle.textContent = counter.name;
            const editMove = document.createElement("button");
            editMove.textContent = "Move Folders"
            const editDelete = document.createElement("button");
            editDelete.textContent = "Delete"
            const editRename = document.createElement('button');
            editRename.textContent = "Rename"
            const editHistory = document.createElement('button');
            editHistory.textContent = "History"
            const editClose = document.createElement("button");
            editClose.textContent="Cancel"


            incrementButton.addEventListener('click', () => {
                const incrementValue = parseInt(incrementInput.value) || 1;
                counter.count += incrementValue;
                
                let i = counter.history.findIndex(x => x.date === today.toString())
                // console.log(i)
                if(i>-1){
                    counter.history[i].amount += incrementValue
                }
                else {
                    counter.history.push({ date: new Date().toLocaleDateString(), amount: incrementValue });
                }

                renderCounters();
                saveData();
            });
            counterEdit.addEventListener("click", (event)=>{
                if(editModal.classList.contains("hidden")){
                    editModal.style.top=event.clientY;
                    editModal.style.right=event.clientX +200;
                    editModal.classList.remove("hidden");
                    
                }
                else{
                    editModal.classList.add("hidden");
                    counterEdit.textContent="⋮"
                }    
                
            });
            editDelete.addEventListener("click", (index)=>{
                editModal.classList.add("hidden");
                selectedFolder.counters = selectedFolder.counters.filter(counter => counter.name !== counterName.textContent);
                saveData();
                renderCounters();
                
            });
            editRename.addEventListener("click", (event, index)=>{
                const i = (selectedFolder.counters.findIndex(x => x.name === counter.name))
                counter.name = prompt("Enter new name")
                if(counter.name != ""){
                    selectedFolder.counters[i].name=counter.name;
                counterName.textContent = counter.name;
                editTitle.textContent = counter.name;
                saveData();
                }
                editModal.classList.add("hidden");
                counterEdit.textContent="⋮";
            });
            editHistory.addEventListener("click", (index)=>{
                document.getElementById("counterHistory").classList.remove("hidden")
                document.getElementById("history-title").textContent = counter.name + " history"
                document.getElementById("entries").innerHTML = "";
                for (let i=0; i<counter.history.length;i++){
                    const entry = document.createElement("button")
                    entry.innerHTML = `${i+1}: ${counter.history[i].date} : Amount: ${counter.history[i].amount}`
                    document.getElementById("entries").appendChild(entry)
                }
                editModal.classList.add("hidden");
                counterEdit.textContent="⋮"
            });
            document.getElementById("close-history").addEventListener("click", ()=>{
                document.getElementById("entries").innerHTML = "";
                document.getElementById("counterHistory").classList.add("hidden")
            })
            editMove.addEventListener("click", ()=>{
                const i = (selectedFolder.counters.findIndex(x => x.name === counter.name))
                let temp = selectedFolder.counters[i];
                const destination = prompt("Move to folder:")
                data.folders[data.folders.findIndex(x => x.folderName===destination)].counters.push(temp);
                selectedFolder.counters.splice(i, 1);
                saveData();
                renderCounters();
                renderFolders();
            })

            editCounter.addEventListener("click", ()=>{
                const i = (selectedFolder.counters.findIndex(x => x.name === counter.name))
                let guy = selectedFolder.counters[i];
                let place = selectedFolder.folderName;
                console.log(place)
                renderCounterEdit(guy, place);
                editModal.classList.add("hidden");
            })
            editClose.addEventListener("click", ()=>{
                editModal.classList.add("hidden");
            })
            
            editModal.appendChild(editCounter)
            editModal.appendChild(editColor)

            // editModal.appendChild(editTitle);
            // editModal.appendChild(editRename);
            // editModal.appendChild(editHistory);
            // editModal.appendChild(editMove);
            // editModal.appendChild(editDelete);
            editModal.appendChild(editClose);

            

            incrementDiv.appendChild(incrementButton);
            // incrementDiv.appendChild(incrementInput)

            counterDiv.appendChild(counterName);
            counterDiv.appendChild(counterValue);
            counterDiv.appendChild(counterDayCount);
            counterDiv.appendChild(incrementDiv);
            counterDiv.appendChild(counterEdit);
            counterDiv.appendChild(editModal);

            countersContainer.appendChild(counterDiv);

            total += counter.count;
        });

        totalCount.textContent = `Total: ${total}`;
        selectedFolderName.textContent = selectedFolder.folderName;
    }
    function renderCounterEdit(guy, place){
        console.log(guy, place)
    }

    document.getElementById('createFolderButton').addEventListener('click', () => {
        const folderName = prompt("Enter folder name:");
        if (folderName && folderName !== "All Counters") {
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
            console.log(selectedFolderName.innerHTML)
            if(selectedFolderName.innerHTML!="All Counters")data.folders[0].counters.push(selectedFolder.counters[selectedFolder.counters.length-1]);

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
            if(folder.innerHTML !== "All Counters"){
                
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
                    if (targetElement && targetElement !== draggingElement && targetElement !== folders[0]) {
                        folderList.insertBefore(draggingElement, targetElement.nextSibling);
                        reorderFolders();
                    }
                });
            }
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
