document.addEventListener('DOMContentLoaded', function() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    let data = loadData();

    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const folderList = document.getElementById('folderList');
    const historyChartCtx = document.getElementById('historyChart').getContext('2d');

    let selectedFolders = new Set();
    let chart = null;

    function loadData() {
        const savedData = localStorage.getItem('habitTrackerData');
        if (savedData) {
            return JSON.parse(savedData);
        }
        return {
            userName: '',
            folders: []
        };
    }

    function setDefaultDateRange() {
        const today = new Date();
        const sixDaysAgo = new Date(today);
        sixDaysAgo.setDate(today.getDate() - 6);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() +1)

        const formatDate = (date) => date.toISOString().split('T')[0];

        startDateInput.value = formatDate(sixDaysAgo);
        endDateInput.value = formatDate(tomorrow);
    }

    function renderFolders() {
        folderList.innerHTML = '';
        data.folders.forEach((folder, index) => {
            const folderItem = document.createElement('li');
            folderItem.textContent = folder.folderName;

            if (index === 0) {
                folderItem.classList.add('selected');
                selectedFolders.add(folder.folderName);
            }

            folderItem.addEventListener('click', () => {
                if (folderItem.classList.contains('selected')) {
                    folderItem.classList.remove('selected');
                    selectedFolders.delete(folder.folderName);
                } else {
                    folderItem.classList.add('selected');
                    selectedFolders.add(folder.folderName);
                }

                if (selectedFolders.has('All Counters') && selectedFolders.size > 1) {
                    selectedFolders.delete('All Counters');
                    folderList.querySelector('li:first-child').classList.remove('selected');
                }

                renderChart();
            });

            folderList.appendChild(folderItem);
        });
    }

    function getFilteredData() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        endDate.setHours(23, 59, 59, 999); // Set end date to end of the day
        const countersData = {};

        selectedFolders.forEach(folderName => {
            const folder = data.folders.find(f => f.folderName === folderName);
            folder.counters.forEach(counter => {
                if (!countersData[counter.name]) {
                    countersData[counter.name] = {};
                }
                counter.history.forEach(record => {
                    const recordDate = new Date(record.date);
                    if (recordDate >= startDate && recordDate <= endDate) {
                        const dateString = recordDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
                        if (!countersData[counter.name][dateString]) {
                            countersData[counter.name][dateString] = 0;
                        }
                        countersData[counter.name][dateString] += record.amount;
                    }
                });
            });
        });

        return countersData;
    }

    function getDateRange(startDate, endDate) {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split('T')[0]); // Format date as YYYY-MM-DD
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    function renderChart() {
        const countersData = getFilteredData();
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        endDate.setHours(23, 59, 59, 999); // Set end date to end of the day
        const allDates = getDateRange(startDate, endDate);
        const datasets = [];

        Object.keys(countersData).forEach(counterName => {
            const dataEntries = countersData[counterName];
            const dataset = {
                label: counterName,
                data: allDates.map(date => dataEntries[date] || 0),
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
                borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
                borderWidth: 1
            };

            datasets.push(dataset);
        });

        if (chart) {
            chart.destroy(); // Ensure the existing chart is destroyed
        }

        chart = new Chart(historyChartCtx, {
            type: 'bar',
            data: {
                labels: allDates,
                datasets: datasets
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Value'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    setDefaultDateRange();
    startDateInput.addEventListener('change', renderChart);
    endDateInput.addEventListener('change', renderChart);

    renderFolders();
    renderChart();
});
