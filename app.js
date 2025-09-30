// POWERGRID Materials Forecasting Dashboard
// Application Data
const applicationData = {
    forecast: {
        months: ["Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"],
        demand: [67.9, 81.5, 54.3, 36.2, 27.2, 22.6, 36.2, 54.3, 72.4, 45.3],
        confidence: [94, 95, 92, 88, 85, 87, 90, 93, 95, 94]
    },
    project: {
        id: "PGCIL-2025-TL-001",
        name: "765kV Transmission Line - Mumbai to Pune",
        total_required: 452.8,
        total_cost: 22.0,
        accuracy: 94
    }
};

let demandChart = null;
let isVoiceActive = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    createDemandChart();
    initializeVoiceInterface();
    initializeInteractiveElements();
});

// Navigation functionality
function initializeNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            const targetTab = tab.getAttribute('data-tab');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Create demand forecast chart
function createDemandChart() {
    const ctx = document.getElementById('demandChart');
    if (!ctx) return;

    demandChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: applicationData.forecast.months,
            datasets: [{
                label: 'ACSR Demand (Tons)',
                data: applicationData.forecast.demand,
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1e40af',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Confidence (%)',
                data: applicationData.forecast.confidence,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: 'y1'
            }]
        },
        options: {
      responsive: true,
    maintainAspectRatio: false, // Keep proportions fixed
    aspectRatio: 2, // Width is 2x the height, adjust as needed
    animation: { duration: 0 },

            plugins: {
                title: { display: false },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'ACSR Demand (Tons)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Confidence (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            }
        }
    });
}

// Voice interface functionality
function initializeVoiceInterface() {
    const voiceBtn = document.getElementById('voiceBtn');
    const queryButtons = document.querySelectorAll('.query-btn');

    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceRecognition);
    }

    queryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            simulateVoiceQuery(query);
        });
    });
}

function toggleVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.querySelector('.voice-status');

    if (!isVoiceActive) {
        isVoiceActive = true;
        voiceBtn.classList.add('active');
        voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        voiceStatus.textContent = 'Listening... Speak your question';

        setTimeout(() => {
            stopVoiceRecognition();
            simulateVoiceQuery("How much ACSR needed for Mumbai-Pune line?");
        }, 3000);
    } else {
        stopVoiceRecognition();
    }
}

function stopVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    const voiceStatus = document.querySelector('.voice-status');

    isVoiceActive = false;
    voiceBtn.classList.remove('active');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceStatus.textContent = 'Click to activate voice recognition';
}

function simulateVoiceQuery(query) {
    const responses = {
        "How much ACSR needed for Mumbai-Pune line?": "Based on AI analysis, the Mumbai-Pune 765kV line requires 452.8 tons of ACSR conductor with 94% confidence.",
        "What is the current inventory status?": "Current inventory shows 245 tons ACSR available (85% capacity). Insulators at 35% capacity - recommend restocking.",
        "Show me corrosion alerts for this month": "Two critical alerts: Tower #127 insulator corrosion (96% confidence), Tower #89 vegetation encroachment.",
        "When should we schedule maintenance for Tower 127?": "Schedule within 48 hours. Optimal window: 10 AM-4 PM tomorrow. Estimated repair time: 4-6 hours."
    };

    const response = responses[query] || responses["How much ACSR needed for Mumbai-Pune line?"];
    console.log("Voice Query:", query);
    console.log("AI Response:", response);
}

// Interactive elements
function initializeInteractiveElements() {
    const scanBtn = document.querySelector('.scan-btn');
    if (scanBtn) {
        scanBtn.addEventListener('click', simulateQRScan);
    }
}

function simulateQRScan() {
    const scanBtn = document.querySelector('.scan-btn');
    scanBtn.textContent = 'Scanning...';
    scanBtn.disabled = true;

    setTimeout(() => {
        scanBtn.textContent = 'Material Authenticated!';
        scanBtn.style.background = '#10b981';

        setTimeout(() => {
            scanBtn.textContent = 'Start Scanner';
            scanBtn.style.background = '#1e40af';
            scanBtn.disabled = false;
        }, 3000);
    }, 2000);
}

// Export for external use
window.PowerGridApp = {
    data: applicationData,
    simulateVoiceQuery,
    toggleVoiceRecognition,
    simulateQRScan
};
