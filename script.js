// Remplacez par l'ID de votre canal et votre clé API
const CHANNEL_ID = '123456'; // Remplacez par votre ID de canal
const API_KEY = 'ABCDEFGHIJKLMN'; // Remplacez par votre clé API
const API_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=10`;

// Fonction pour récupérer les données de ThingSpeak
async function fetchData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const feeds = data.feeds;

        // Mise à jour des graphiques et du tableau
        updateChart(feeds);
        updateTable(feeds);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

// Mise à jour des graphiques
function updateChart(feeds) {
    const labels = feeds.map(feed => new Date(feed.created_at).toLocaleTimeString());
    const reactorTemps = feeds.map(feed => parseFloat(feed.field1));
    const upperTankTemps = feeds.map(feed => parseFloat(feed.field2));
    const lowerTankTemps = feeds.map(feed => parseFloat(feed.field3));

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Réacteur (°C)',
                    data: reactorTemps,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    fill: true,
                },
                {
                    label: 'Haut Réservoir (°C)',
                    data: upperTankTemps,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    fill: true,
                },
                {
                    label: 'Bas Réservoir (°C)',
                    data: lowerTankTemps,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        },
    });
}

// Mise à jour du tableau
function updateTable(feeds) {
    const tableBody = document.getElementById('dataTable');
    tableBody.innerHTML = ''; // Efface les données existantes

    feeds.forEach(feed => {
        const row = `
            <tr>
                <td>${new Date(feed.created_at).toLocaleString()}</td>
                <td>${feed.field1}°C</td>
                <td>${feed.field2}°C</td>
                <td>${feed.field3}°C</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Appel initial et mise à jour toutes les 30 secondes
fetchData();
setInterval(fetchData, 30000);
