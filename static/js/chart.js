let chart = null;

function createChart() {
    const labels = JSON.parse(window.chartLabels || '[]');
    let data = JSON.parse(window.chartData || '[]');
    const ctx = document.getElementById('expensesChart');
    
    // Check if all data is zero, if so add fallback data
    const total = data.reduce((sum, val) => sum + val, 0);
    if (total === 0) {
        data = [1, 1, 1, 1]; // Minimal data to show chart
        console.log('No data found, using fallback values');
    }
    
    if (ctx && labels && data) {
        // Destroy existing chart if it exists
        if (chart) {
            chart.destroy();
        }
        
        chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: ['#22c55e','#ef4444','#06b6d4','#f59e0b'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { 
                        position: 'bottom',
                        labels: {
                            color: '#e5e7eb',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17,24,39,0.9)',
                        titleColor: '#e5e7eb',
                        bodyColor: '#e5e7eb',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                if (value === 1 && total === 0) {
                                    return context.label + ': No data';
                                }
                                return context.label + ': $' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
        
        // Update status to show chart was created
        const statusEl = document.getElementById('chart-status');
        if (statusEl) {
            statusEl.textContent = 'Chart Status: Chart created successfully!';
            statusEl.style.color = '#22c55e';
        }
    } else {
        console.error('Chart initialization failed:', {ctx, labels, data});
        const statusEl = document.getElementById('chart-status');
        if (statusEl) {
            statusEl.textContent = 'Chart Status: Chart initialization failed';
            statusEl.style.color = '#ef4444';
        }
    }
}

// Wait for Chart.js to be available
function waitForChart() {
    const statusEl = document.getElementById('chart-status');
    if (typeof Chart !== 'undefined') {
        console.log('Chart.js loaded, creating chart...');
        statusEl.textContent = 'Chart Status: Chart.js loaded, creating chart...';
        createChart();
    } else {
        console.log('Waiting for Chart.js...');
        statusEl.textContent = 'Chart Status: Waiting for Chart.js to load...';
        setTimeout(waitForChart, 100);
    }
}

// Initialize chart when DOM is ready
function initChart() {
    console.log('Initializing chart...');
    console.log('Chart labels:', window.chartLabels);
    console.log('Chart data:', window.chartData);
    console.log('Chart.js available:', typeof Chart !== 'undefined');
    
    // Wait for Chart.js to be available
    waitForChart();
    
    // Timeout fallback after 5 seconds
    setTimeout(function() {
        if (typeof Chart === 'undefined') {
            console.log('Chart.js loading timeout - showing fallback');
            const statusEl = document.getElementById('chart-status');
            const fallbackEl = document.getElementById('fallback-chart');
            if (statusEl) {
                statusEl.textContent = 'Chart Status: Chart.js loading timeout - showing fallback';
                statusEl.style.color = '#f59e0b';
            }
            if (fallbackEl) {
                fallbackEl.style.display = 'block';
            }
        }
    }, 5000);
}

// Auto-refresh every 30 seconds to show real-time updates
function setupAutoRefresh() {
    setInterval(function() {
        // Reload the page to get fresh data
        window.location.reload();
    }, 30000);
}

// Manual refresh button functionality
function refreshData() {
    window.location.reload();
}

// Add refresh button to the chart section
function addRefreshButton() {
    const chartCard = document.querySelector('.chart-card');
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 Refresh Data';
    refreshBtn.className = 'btn-primary';
    refreshBtn.style.cssText = 'margin-left: 10px; padding: 6px 12px; font-size: 12px;';
    refreshBtn.onclick = refreshData;
    
    const title = chartCard.querySelector('h3');
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.appendChild(refreshBtn);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing chart system...');
    initChart();
    setupAutoRefresh();
    addRefreshButton();
});
