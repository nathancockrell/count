document.addEventListener('DOMContentLoaded', function() {
    const navbarTrigger = document.getElementById('navbar-trigger');
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

    let data = loadData();
    let today = new Date().toLocaleDateString();
    

    function render(){
        // for each

        // counters page
        renderCounters(countersContainer, data.counters,selectedLabels);
        renderLabels(labelsContainer,selectedLabelsDiv,data.labels);
    }
    // Counters Page:
    // [{location:labelsContainer, location2:selectedLabelsDiv, array:data.labels},
    // {location:countersContainer, array:data.counters},
    // {total:totalCount}]

    // location
    const countersContainer = document.getElementById('countersContainer');
    // location, location2
    const labelsContainer = document.getElementById("labelsContainer")
    const selectedLabelsDiv = document.getElementById('selectedLabels');

    const totalCount = document.getElementById('totalCount');

    let selectedLabels=[]


    // const counterModal = document.getElementById("counter-modal");
    // const modalTitle = document.getElementById("modal-title");
    // modalTitle.textContent=counter.name;
    // const modalTotal = document.getElementById("modal-total");
    // modalTotal.textContent = counter.count;
    // const modalDayCount = document.getElementById('modal-day-count')
    // let dayLog2 = counter.history.filter(x => x.date === today)
    // if(dayLog2.length>0)modalDayCount.textContent = dayLog2[0].amount;
    // else{modalDayCount.textContent = 0;}
    // const incrementInput = document.getElementById('increment-input');
    // incrementInput.value = 1;
    // const modalButton = document.getElementById("modal-button");
    // modalButton.textContent="+"
    // const modalClose = document.getElementById("modal-close");
    // modalClose.textContent="Close"
    // modalButton.addEventListener('click', () => {
    //     const incrementValue = parseInt(incrementInput.value) || 1;
    //     counter.count += incrementValue;
        
    //     let i = counter.history.findIndex(x => x.date === today.toString())
    //     console.log(incrementValue)
    //     if(i>-1){
    //         counter.history[i].amount += incrementValue
    //     }
    //     else {
    //         counter.history.push({ date: new Date().toLocaleDateString(), amount: incrementValue });
    //     }

    //     renderCounters();
    //     saveData();
    // });

    function loadData() {
        const savedData = localStorage.getItem('habitTrackerData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            userName: '',
            // folders: [
            //     { folderName: "All Counters", counters: [] }
            // ],
            counters:[
                
            ],
            labels:[
                
            ],
            preferences:""
        };
    }

    function saveData() {
        localStorage.setItem('habitTrackerData', JSON.stringify(data));
    }


    function renderCounters(location, counterArray,filter) {
        location.innerHTML = '';
        let total = 0;
        let array=[]
        let alteredFilter=[]
        filter.forEach((element)=>{
            let name = element.labelName;
            alteredFilter.push(name);
        })
        console.log(alteredFilter)
        if(alteredFilter.length>0){
            // console.log(counterArray)
            for(let i=0;i<counterArray.length;i++){
                let exit=false;
                for(let j=0;j<counterArray[i].labels.length && !exit;j++){
                    if(alteredFilter.includes(counterArray[i].labels[j])){
                        array.push(counterArray[i]);
                        exit=true;
                    }
                }
            }
        }else{
            for(let i =0; i<counterArray.length;i++){
                array.push(counterArray[i])
            }
        }
        array.forEach((counter, index) => {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'counter';
            counterDiv.classList.add(index)

            const infoDiv = document.createElement("div");
            infoDiv.classList.add("info-div");
            const counterName = document.createElement('h1');
            counterName.textContent = counter.name;

            const valueDiv = document.createElement("div");
            valueDiv.classList.add("value-div")

            const counterValue = document.createElement('span');
            counterValue.textContent = counter.count;
            const counterDayCount = document.createElement('span')
            // let dayLog = counter.history.filter(x => x.date === today)
            // if(dayLog.length>0)counterDayCount.textContent = dayLog[0].amount;
            // else{counterDayCount.textContent = 0;}

            const incrementDiv = document.createElement("div");
            incrementDiv.classList.add("increment-div")

            const incrementButton = document.createElement('button');
            incrementButton.classList.add("increment")
            incrementButton.textContent = '+';

            const incrementInput = document.createElement("input")
            incrementInput.type='number'
            incrementInput.placeholder='1'
            
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

            

            // counterModal.appendChild(modalClose)
            // counterModal.appendChild(modalTitle)
            // counterModal.appendChild(modalTotal)
            // counterModal.appendChild(modalDayCount)
            // counterModal.appendChild(incrementInput)
            // counterModal.appendChild(modalButton)

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

                renderCounters(location, counterArray, filter);
                saveData();
            });
            
            // infoDiv.addEventListener("click", ()=>{
            //     counterModal.classList.remove("hidden")
            // })
            // modalClose.addEventListener("click", ()=>{
            //     counterModal.classList.add("hidden")
            // })
            counterEdit.addEventListener("click", (event)=>{
                if(editModal.classList.contains("hidden")){
                    editModal.style.top=event.clientY;
                    editModal.style.right=event.clientX +200;
                    editModal.classList.remove("hidden");
                    editModal.focus();
                    
                }
                else{
                    editModal.classList.add("hidden");
                    counterEdit.textContent="⋮"
                }    
            });
            editModal.addEventListener("blur", ()=>{
                editModal.classList.add(hidden);
            })
            editDelete.addEventListener("click", (index)=>{
                editModal.classList.add("hidden");
                selectedFolder.counters = selectedFolder.counters.filter(counter => counter.name !== counterName.textContent);
                saveData();
                renderCounters(location, counterArray, filter);
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
                renderCounters(location, counterArray, filter);
            })

            editCounter.addEventListener("click", ()=>{
                const i = (data.counters.findIndex(x => x.name === counter.name))
                let guy = data.counters[i];
                renderCounterModal(guy);
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

            infoDiv.appendChild(counterName);
            infoDiv.appendChild(counterEdit);
            valueDiv.appendChild(counterValue);
            valueDiv.appendChild(counterDayCount);

            incrementDiv.appendChild(incrementInput);
            incrementDiv.appendChild(incrementButton);
            valueDiv.appendChild(incrementDiv)
            
            counterDiv.appendChild(infoDiv)
            counterDiv.appendChild(valueDiv)
            counterDiv.appendChild(editModal);

            location.appendChild(counterDiv);

            total += counter.count;
        });

        if(countersContainer.innerHTML == '') countersContainer.innerHTML="<p>No counters here</p>";
        totalCount.textContent = `Total: ${total}`;
    }
    function renderCounterModal(guy){
        const counterModal = document.getElementById("counter-modal");
        counterModal.classList.remove("hidden")
    const modalTitle = document.getElementById("modal-title");
    modalTitle.textContent=guy.name;
    const modalLabels=document.getElementById("modal-labels")
    modalLabels.innerHTML=''
    console.log(guy.labels)
    guy.labels.forEach((label)=>{
        
        const item = document.createElement("p");
        item.textContent= label;
        modalLabels.appendChild(item)
    })
    const modalTotal = document.getElementById("modal-total");
    modalTotal.textContent = guy.count;
    const modalDayCount = document.getElementById('modal-day-count')
    let dayLog2 = guy.history.filter(x => x.date === today)
    if(dayLog2.length>0)modalDayCount.textContent = dayLog2[0].amount;
    else{modalDayCount.textContent = 0;}
    // const incrementInput = document.getElementById('increment-input');
    // incrementInput.value = 1;
    // const modalButton = document.getElementById("modal-button");
    // modalButton.textContent="+"
    const modalClose = document.getElementById("modal-close");
    modalClose.textContent="Close"
    if(guy.history>0)document.getElementById("modal-history-title").classList.remove("hidden");
    const modalHistory=document.getElementById("modal-history")
    modalHistory.innerHTML=''
    guy.history.forEach((entry)=>{
        console.log("help me")
        const item = document.createElement("p")
        item.textContent= entry.date + " | AMOUNT: " + entry.amount
        modalHistory.appendChild(item)
    })
    const modalRename=document.getElementById("modal-rename");
    modalRename.addEventListener("click", ()=>{
        modalTitle.setAttribute("contenteditable", "true");
        modalTitle.focus();
        modalTitle.addEventListener("blur", ()=>{
            modalTitle.setAttribute("contenteditable", "false");
            guy.name=modalTitle.textContent;
            saveData();
        }, {once:true});
    })
    const modalRecolor=document.getElementById("modal-recolor");
    modalRecolor.style.background=guy.color;
    const colorInput = document.getElementById("color-input")
    modalRecolor.addEventListener("click",()=>{
        colorInput.classList.remove("hidden")
    })
    colorInput.addEventListener("input", ()=>{
        guy.color=colorInput.value;
        console.log("CHAGNEGD")
    })
    colorInput.addEventListener("blur", ()=>{
        console.log("happy done")
        saveData();
        colorInput.classList.add("hidden")
    })
    const modalEditHistory=document.getElementById("modal-edit-history")
    modalEditHistory.addEventListener("click",()=>{
        console.log("editedHSIROY")
    })
    const modalEditLabels=document.getElementById("modal-edit-labels")
    modalEditLabels.addEventListener("click",()=>{
        console.log("editlbale")
    })

    // modalButton.addEventListener('click', () => {
    //     const incrementValue = parseInt(incrementInput.value) || 1;
    //     guy.count += incrementValue;
        
    //     let i = counter.history.findIndex(x => x.date === today.toString())
    //     console.log(incrementValue)
    //     if(i>-1){
    //         guy.history[i].amount += incrementValue
    //     }
    //     else {
    //         guy.history.push({ date: new Date().toLocaleDateString(), amount: incrementValue });
    //     }

    //     render();
    //     saveData();
    // });
    modalClose.addEventListener("click",()=>{
        document.getElementById("modal-history-title").classList.add("hidden")
        counterModal.classList.add("hidden")
        render();
    })
    }

    function renderLabels(location,location2,array){
        location.innerHTML="";
        array.forEach((label) => {
            const labelDiv = document.createElement("div");
            labelDiv.classList.add("label-div");
            const labelIcon = document.createElement("div");
            // labelIcon.classList.add("label-icon");
            // labelIcon.style.backgroundColor=label.color;
            const labelTitle = document.createElement("p");
            labelTitle.classList.add("label-title");
            labelTitle.style.background=label.color;
            labelTitle.textContent=label.labelName;

            if(selectedLabels.some(x=>x.labelName===label.labelName)){
                labelDiv.classList.add("selected")
            }

            labelDiv.addEventListener("click", ()=>{
                if(selectedLabels.includes(label)){
                    selectedLabels.splice(selectedLabels.findIndex(x=>x.labelName == label.labelName),1);
                    labelDiv.classList.remove("selected")
                }else {
                    selectedLabels.push(label);
                    labelDiv.classList.add("selected");
                }
                console.log(selectedLabels)
                render();
            })

            labelDiv.appendChild(labelIcon);
            labelDiv.appendChild(labelTitle);
            location.appendChild(labelDiv);
        })
        location2.innerHTML="<p class='labeltag'>Labels: </p>";
        for(let i =0; i<selectedLabels.length; i++){
            const labelDisplay = document.createElement("div");
            labelDisplay.classList.add("label-display")
            const labelIcon = document.createElement("div");
            labelIcon.classList.add("label-icon");
            labelIcon.style.backgroundColor=selectedLabels[i].color;
            const labelTitle = document.createElement("p");
            labelTitle.classList.add("label-title");
            labelTitle.textContent=selectedLabels[i].labelName;

            labelDisplay.addEventListener("click", ()=>{
                // console.log(selectedLabels[i].name)
                selectedLabels.splice(selectedLabels.findIndex(x=>x.labelName === selectedLabels[i].labelName),1);
                render();
            })

            labelDisplay.appendChild(labelIcon);
            labelDisplay.appendChild(labelTitle);
            location2.appendChild(labelDisplay);
        }
        
    }

    // SPECIFIC RENDER
    document.getElementById('addCounterButton').addEventListener('click', () => {
        const counterName = prompt("Enter counter name:");
        if (counterName) {
            const newCounter = { name: counterName, count: 0, labels:["a","b"], history: [], color:"" };

            data.counters.push(newCounter);
            console.log(data.counters)

            render();
            saveData();
        }
    });
    // SPECIFIC RENDER
    document.getElementById("addLabel").addEventListener("click", ()=>{
        const labelName = prompt("enter label name")
        const randomColor = `rgba(${100 + Math.floor(Math.random() * 156)}, ${100 + Math.floor(Math.random() * 156)}, ${100 + Math.floor(Math.random() * 156)}, 1)`;
        if (data.labels.includes(labelName) || labelName==""){
            // console.log("CANT")
            return;
        }
        else{
            
            data.labels.push({labelName:labelName, color:randomColor})
            render();
            saveData();
        }
    })

    // document.getElementById('editCountersButton').addEventListener('click', () => {
    //     let action = prompt("Type 'delete' to remove counters, 'reorder' to reorder:");
    //     if (action === 'delete') {
    //         const counterName = prompt("Enter the name of the counter to delete:");
    //         selectedFolder.counters = selectedFolder.counters.filter(counter => counter.name !== counterName);
    //         renderCounters();
    //         saveData();
    //     } else if (action === 'reorder') {
    //         alert('Drag and drop counters to reorder them.');
    //         enableCounterReordering();
    //     }
    // });

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
    render();
});
