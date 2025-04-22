// ZYLOX Agency Dashboard - Performance Chart
document.addEventListener('DOMContentLoaded', function() {
  // Initialize performance chart if it exists
  const chartContainer = document.getElementById('performance-chart');
  if (chartContainer) {
    initPerformanceChart();
  }
});

// Team performance data
const teamData = [
  { name: 'Moeed', performance: 85 },
  { name: 'Ahmad', performance: 75 },
  { name: 'Hasnain', performance: 90 },
  { name: 'Amaima', performance: 80 },
  { name: 'Shahram', performance: 70 }
];

// Initialize and render performance chart
function initPerformanceChart() {
  const chartContainer = document.getElementById('performance-chart');
  if (!chartContainer) return;
  
  // Create chart HTML
  let chartHTML = `<div class="performance-chart-container">`;
  
  teamData.forEach((member, index) => {
    chartHTML += `
      <div class="performance-bar-container">
        <div class="performance-bar-label">${member.name}</div>
        <div class="performance-bar-wrapper">
          <div class="performance-bar-background"></div>
          <div class="performance-bar-fill" style="width: 0%" data-value="${member.performance}" data-index="${index}"></div>
        </div>
        <div class="performance-bar-value">0%</div>
      </div>
    `;
  });
  
  chartHTML += `</div>`;
  chartContainer.innerHTML = chartHTML;
  
  // Animate bars with GSAP
  const bars = document.querySelectorAll('.performance-bar-fill');
  const values = document.querySelectorAll('.performance-bar-value');
  
  bars.forEach((bar, index) => {
    const targetValue = parseInt(bar.getAttribute('data-value'));
    
    // Animate the bar width
    gsap.to(bar, {
      width: `${targetValue}%`,
      duration: 1.5,
      delay: 0.2 * index,
      ease: 'power3.out'
    });
    
    // Animate the value counter
    gsap.to(values[index], {
      innerText: targetValue,
      duration: 1.5,
      delay: 0.2 * index,
      ease: 'power3.out',
      snap: { innerText: 1 }, // Round to whole numbers
      onUpdate: function() {
        values[index].textContent = `${Math.round(parseFloat(values[index].textContent))}%`;
      }
    });
  });
}