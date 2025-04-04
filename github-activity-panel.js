// github-activity-panel.js
// Responsive version with mobile-friendly features

document.addEventListener('DOMContentLoaded', function() {
  // Create container for the dashboard if it doesn't exist
  if (!document.getElementById('github-activity-dashboard')) {
    createDashboard();
    populateDashboard();
    addInteractivity();
    addResizeHandler();
  }
});

function createDashboard() {
  // Add CSS styles first to ensure they're available
  addStyles();
  
  // Create main container
  const dashboard = document.createElement('div');
  dashboard.id = 'github-activity-dashboard';
  dashboard.className = 'activity-dashboard';
  
  // Add dashboard title
  const title = document.createElement('div');
  title.className = 'dashboard-title';
  title.innerHTML = `<h2>PETER MARTIN'S CONTROL PANEL</h2>`;
  
  // Add the grid layout for the dashboard
  const grid = document.createElement('div');
  grid.className = 'dashboard-grid';
  
  // Add sections to the grid
  const sections = [
    {id: 'activity-monitor', title: 'ACTIVITY MONITOR'},
    {id: 'commit-log', title: 'RECENT COMMITS'},
    {id: 'skill-radar', title: 'SKILL RADAR'},
    {id: 'project-status', title: 'PROJECT STATUS'},
    {id: 'connection-status', title: 'CONNECTION STATUS'},
    {id: 'terminal', title: 'TERMINAL ACCESS'}
  ];
  
  sections.forEach(section => {
    const sectionEl = document.createElement('div');
    sectionEl.id = section.id;
    sectionEl.className = 'dashboard-section';
    
    const header = document.createElement('div');
    header.className = 'section-header';
    header.innerHTML = `
      <div class="section-title">${section.title}</div>
      <div class="section-controls">
        <span class="control-dot" style="background-color: #ff5f56;"></span>
        <span class="control-dot" style="background-color: #ffbd2e;"></span>
        <span class="control-dot" style="background-color: #27c93f;"></span>
      </div>
    `;
    
    const content = document.createElement('div');
    content.className = 'section-content';
    content.id = `${section.id}-content`;
    
    sectionEl.appendChild(header);
    sectionEl.appendChild(content);
    grid.appendChild(sectionEl);
  });
  
  // Add decorative elements - blinking cursor
  const cursor = document.createElement('div');
  cursor.className = 'blinking-cursor';
  cursor.innerHTML = '_';
  
  // Add scan line effect
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  
  // Create footer status bar that doesn't obscure content
  const statusBar = document.createElement('div');
  statusBar.className = 'status-bar';
  statusBar.innerHTML = `
    <div class="status-text">STATUS: ACTIVE</div>
    <div class="status-indicators">
      <span class="status-dot"></span>
      <span class="status-dot"></span>
      <span class="status-dot"></span>
    </div>
    <div class="status-uptime">UPTIME: 263D:14H:22M</div>
    <div class="status-version">v1.0.4</div>
  `;
  
  // Assemble the dashboard
  dashboard.appendChild(title);
  dashboard.appendChild(grid);
  dashboard.appendChild(cursor);
  dashboard.appendChild(scanLine);
  dashboard.appendChild(statusBar);
  
  // Add the dashboard to the container
  const container = document.getElementById('dashboard-container');
  if (container) {
    container.appendChild(dashboard);
  } else {
    document.body.appendChild(dashboard);
  }
}

function addStyles() {
  // Check if styles already exist
  if (document.getElementById('dashboard-styles')) {
    return;
  }
  
  const style = document.createElement('style');
  style.id = 'dashboard-styles';
  style.textContent = `
    /* Dashboard Variables */
    :root {
      --primary-color: #00ff00;
      --secondary-color: #00aa00;
      --background-color: #0d1117;
      --panel-bg-color: rgba(0, 30, 0, 0.5);
      --terminal-font: 'Courier New', monospace;
      --section-height: 12rem;
      --section-height-mobile: 10rem;
      --section-padding: 1rem;
      --section-padding-mobile: 0.75rem;
      --border-radius: 5px;
    }
    
    /* Dashboard main styles */
    .activity-dashboard {
      width: 100%;
      background-color: var(--background-color);
      border-radius: var(--border-radius);
      padding: var(--section-padding-mobile);
      font-family: var(--terminal-font);
      color: var(--primary-color);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--primary-color);
    }
    
    @media screen and (min-width: 768px) {
      .activity-dashboard {
        padding: var(--section-padding);
      }
    }
    
    /* Title styles */
    .dashboard-title {
      text-align: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--primary-color);
    }
    
    .dashboard-title h2 {
      margin: 0;
      padding: 0;
      font-size: 1.25rem;
    }
    
    @media screen and (min-width: 768px) {
      .dashboard-title h2 {
        font-size: 1.5rem;
      }
    }
    
    /* Grid layout - Mobile First (single column) */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 3rem; /* Space for status bar */
    }
    
    /* Two column layout on tablets */
    @media screen and (min-width: 600px) {
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* Larger gap on desktop */
    @media screen and (min-width: 992px) {
      .dashboard-grid {
        gap: 1rem;
      }
    }
    
    /* Section styles */
    .dashboard-section {
      background-color: var(--panel-bg-color);
      border: 1px solid var(--secondary-color);
      border-radius: var(--border-radius);
      padding: var(--section-padding-mobile);
      position: relative;
      transition: all 0.3s ease;
    }
    
    @media screen and (min-width: 768px) {
      .dashboard-section {
        padding: var(--section-padding);
      }
    }
    
    .dashboard-section:hover, .dashboard-section:focus, .dashboard-section:active {
      border-color: var(--primary-color);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
    }
    
    /* Add touch friendly tap targets on mobile */
    @media (hover: none) and (pointer: coarse) {
      .dashboard-section {
        cursor: pointer;
      }
    }
    
    /* Section header */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      padding-bottom: 0.25rem;
      border-bottom: 1px solid var(--secondary-color);
      font-size: 0.875rem;
      font-weight: bold;
    }
    
    @media screen and (min-width: 768px) {
      .section-header {
        font-size: 1rem;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
      }
    }
    
    /* Section title */
    .section-title {
      display: flex;
      align-items: center;
    }
    
    /* Control dots */
    .section-controls {
      display: flex;
      align-items: center;
    }
    
    .control-dot {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      margin-left: 0.25rem;
    }
    
    @media screen and (min-width: 768px) {
      .control-dot {
        width: 0.75rem;
        height: 0.75rem;
        margin-left: 0.375rem;
      }
    }
    
    /* Section content */
    .section-content {
      height: var(--section-height-mobile);
      overflow: auto;
      font-size: 0.75rem;
      scrollbar-width: thin;
      scrollbar-color: var(--secondary-color) var(--background-color);
    }
    
    @media screen and (min-width: 768px) {
      .section-content {
        height: var(--section-height);
        font-size: 0.875rem;
      }
    }
    
    /* Custom scrollbars */
    .section-content::-webkit-scrollbar {
      width: 4px;
    }
    
    .section-content::-webkit-scrollbar-track {
      background: var(--background-color);
    }
    
    .section-content::-webkit-scrollbar-thumb {
      background-color: var(--secondary-color);
      border-radius: 6px;
    }
    
    /* Blinking cursor */
    .blinking-cursor {
      position: absolute;
      bottom: 3rem; /* Above status bar */
      right: 0.625rem;
      font-size: 1.25rem;
      animation: blink 1s infinite;
    }
    
    @media screen and (min-width: 768px) {
      .blinking-cursor {
        bottom: 3.5rem;
        right: 0.75rem;
        font-size: 1.5rem;
      }
    }
    
    /* Scan line */
    .scan-line {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background-color: rgba(0, 255, 0, 0.5);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
      animation: scan 3s linear infinite;
      z-index: 1;
    }
    
    /* Status bar - fixed at bottom */
    .status-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2rem;
      background-color: #0a0f14;
      border-top: 1px solid var(--primary-color);
      display: flex;
      align-items: center;
      padding: 0 0.625rem;
      font-size: 0.75rem;
      z-index: 10; /* Ensure it's above other elements */
    }
    
    @media screen and (min-width: 768px) {
      .status-bar {
        height: 2.5rem;
        padding: 0 1rem;
        font-size: 0.875rem;
      }
    }
    
    /* Status bar elements */
    .status-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .status-indicators {
      display: flex;
      gap: 0.25rem;
      margin: 0 0.5rem;
    }
    
    .status-dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background-color: var(--primary-color);
      animation: blink 2s infinite;
    }
    
    @media screen and (min-width: 768px) {
      .status-indicators {
        gap: 0.375rem;
        margin: 0 0.75rem;
      }
      
      .status-dot {
        width: 0.5rem;
        height: 0.5rem;
      }
    }
    
    .status-dot:nth-child(2) {
      animation-delay: 0.3s;
    }
    
    .status-dot:nth-child(3) {
      animation-delay: 0.6s;
    }
    
    .status-uptime {
      margin-right: 0.75rem;
      display: none; /* Hide on smallest screens */
    }
    
    @media screen and (min-width: 480px) {
      .status-uptime {
        display: block;
      }
    }
    
    .status-version {
      margin-left: auto;
    }
    
    /* Terminal text */
    .terminal-text {
      color: var(--primary-color);
      margin: 0;
      padding: 0;
      line-height: 1.5;
    }
    
    /* Skill radar chart */
    #skill-radar-content canvas {
      width: 100%;
      height: 100%;
    }
    
    /* Animations */
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    @keyframes scan {
      0% { top: 0; }
      100% { top: 100%; }
    }
    
    @keyframes pulse {
      0% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
      50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
      100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
    }
    
    /* Hover effects */
    @media (hover: hover) {
      .activity-dashboard:hover {
        animation: pulse 2s infinite;
      }
    }
    
    /* Reduce animations for users who prefer reduced motion */
    @media (prefers-reduced-motion) {
      .scan-line, .blinking-cursor, .status-dot {
        animation-duration: 4s;
      }
      
      .activity-dashboard:hover {
        animation: none;
      }
    }
  `;
  
  document.head.appendChild(style);
}

function populateDashboard() {
  // Activity Monitor
  const activityMonitor = document.getElementById('activity-monitor-content');
  activityMonitor.innerHTML = `
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <p class="terminal-text">Commits today: <span id="commits-today">7</span></p>
        <p class="terminal-text">Current streak: <span id="current-streak">12 days</span></p>
        <p class="terminal-text">Last active: <span id="last-active">1 hour ago</span></p>
      </div>
      <div style="background-color: rgba(0, 50, 0, 0.3); border-radius: 3px; padding: 5px;">
        <div id="activity-bar" style="height: 1.25rem; width: 75%; background-color: #00ff00; border-radius: 2px; position: relative;">
          <span style="position: absolute; right: 5px; color: #001400; font-weight: bold; font-size: 0.625rem;">75%</span>
        </div>
        <p class="terminal-text" style="margin-top: 5px; font-size: 0.625rem;">Activity level: HIGH</p>
      </div>
    </div>
  `;
  
  // Recent Commits
  const commitLog = document.getElementById('commit-log-content');
  commitLog.innerHTML = `
    <ul style="list-style: none; padding: 0; margin: 0;">
      <li class="terminal-text">[<span style="color: #ffbd2e;">Today 14:23</span>] Implemented new feature</li>
      <li class="terminal-text">[<span style="color: #ffbd2e;">Today 11:05</span>] Fixed responsive layout</li>
      <li class="terminal-text">[<span style="color: #ffbd2e;">Yesterday 18:47</span>] Updated documentation</li>
      <li class="terminal-text">[<span style="color: #ffbd2e;">Yesterday 16:32</span>] Initial commit</li>
    </ul>
  `;
  
  // Skill Radar - We'll use a canvas for this
  const skillRadar = document.getElementById('skill-radar-content');
  skillRadar.innerHTML = `<canvas id="radar-chart"></canvas>`;
  
  // Project Status
  const projectStatus = document.getElementById('project-status-content');
  projectStatus.innerHTML = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem;">
      <tr>
        <th style="text-align: left; padding: 3px; border-bottom: 1px solid #00aa00;">Project</th>
        <th style="text-align: left; padding: 3px; border-bottom: 1px solid #00aa00;">Status</th>
        <th style="text-align: left; padding: 3px; border-bottom: 1px solid #00aa00;">Progress</th>
      </tr>
      <tr>
        <td style="padding: 3px;">Project 1</td>
        <td style="padding: 3px;"><span style="color: #27c93f;">ACTIVE</span></td>
        <td style="padding: 3px;">75%</td>
      </tr>
      <tr>
        <td style="padding: 3px;">Project 2</td>
        <td style="padding: 3px;"><span style="color: #ffbd2e;">PENDING</span></td>
        <td style="padding: 3px;">30%</td>
      </tr>
      <tr>
        <td style="padding: 3px;">Project 3</td>
        <td style="padding: 3px;"><span style="color: #ff5f56;">CRITICAL</span></td>
        <td style="padding: 3px;">90%</td>
      </tr>
    </table>
  `;
  
  // Connection Status
  const connectionStatus = document.getElementById('connection-status-content');
  connectionStatus.innerHTML = `
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <p class="terminal-text">GitHub: <span style="color: #27c93f;">CONNECTED</span></p>
        <p class="terminal-text">LinkedIn: <span style="color: #27c93f;">CONNECTED</span></p>
        <p class="terminal-text">Twitter: <span style="color: #ffbd2e;">STANDBY</span></p>
        <p class="terminal-text">Portfolio: <span style="color: #27c93f;">CONNECTED</span></p>
      </div>
      <div>
        <p class="terminal-text" style="font-size: 0.75rem;">ENCRYPTION: <span style="color: #27c93f;">ENABLED</span></p>
        <p class="terminal-text" style="font-size: 0.75rem;">VPN STATUS: <span style="color: #27c93f;">ACTIVE</span></p>
      </div>
    </div>
  `;
  
  // Terminal
  const terminal = document.getElementById('terminal-content');
  terminal.innerHTML = `
    <div id="terminal-output" style="font-family: 'Courier New', monospace; color: #00ff00;">
      <p class="terminal-text">$ whoami</p>
      <p class="terminal-text">peter.martin</p>
      <p class="terminal-text">$ pwd</p>
      <p class="terminal-text">/home/peter.martin/projects</p>
      <p class="terminal-text">$ <span id="typing-command"></span></p>
    </div>
  `;
  
  // Draw radar chart for skills if Chart.js is available
  setTimeout(() => {
    if (typeof Chart !== 'undefined') {
      drawSkillRadar();
    } else {
      // Fallback if Chart.js is not available
      document.getElementById('skill-radar-content').innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <p class="terminal-text">SKILLS</p>
          <ul style="list-style: none; padding: 0;">
            <li class="terminal-text">JavaScript [=========] 90%</li>
            <li class="terminal-text">Python [=======] 70%</li>
            <li class="terminal-text">React [========] 80%</li>
            <li class="terminal-text">Node.js [========] 80%</li>
            <li class="terminal-text">CSS [======] 60%</li>
          </ul>
        </div>
      `;
    }
  }, 500);
}

function drawSkillRadar() {
  const ctx = document.getElementById('radar-chart').getContext('2d');
  
  // Check if a chart already exists and destroy it
  if (window.skillChart) {
    window.skillChart.destroy();
  }
  
  // Responsive font size based on screen width
  const fontSize = window.innerWidth < 768 ? 8 : 10;
  
  window.skillChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['JavaScript', 'Python', 'React', 'Node.js', 'CSS', 'Git'],
      datasets: [{
        label: 'Skills',
        data: [90, 70, 80, 80, 60, 85],
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: '#00ff00',
        pointBackgroundColor: '#00ff00',
        pointBorderColor: '#00ff00',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00ff00'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 2
        }
      },
      scale: {
        ticks: {
          beginAtZero: true,
          max: 100,
          stepSize: 20
        }
      },
      scales: {
        r: {
          pointLabels: {
            font: {
              size: fontSize
            }
          },
          ticks: {
            display: window.innerWidth >= 480, // Hide ticks on smallest screens
            font: {
              size: fontSize
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function addInteractivity() {
  // Typing effect in terminal
  const commands = [
    'ls -la',
    'git status',
    'npm run build',
    'docker ps',
    'ssh server1'
  ];
  
  let commandIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function typeCommand() {
    const typingElement = document.getElementById('typing-command');
    if (!typingElement) return;
    
    const currentCommand = commands[commandIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentCommand.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentCommand.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentCommand.length) {
      isDeleting = true;
      typingSpeed = 1000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      commandIndex = (commandIndex + 1) % commands.length;
      typingSpeed = 500; // Pause before typing next command
    }
    
    setTimeout(typeCommand, typingSpeed);
  }
  
  // Start the typing animation
  setTimeout(typeCommand, 1000);
  
  // Make the activity bar "live"
  let direction = 1;
  let activityLevel = 75;
  
  function updateActivityBar() {
    const activityBar = document.getElementById('activity-bar');
    if (!activityBar) return;
    
    // Randomly change direction occasionally
    if (Math.random() < 0.1) {
      direction = -direction;
    }
    
    // Update activity level
    activityLevel += direction * Math.random() * 2;
    
    // Keep within bounds
    if (activityLevel > 95) {
      activityLevel = 95;
      direction = -1;
    } else if (activityLevel < 50) {
      activityLevel = 50;
      direction = 1;
    }
    
    // Update the display
    activityBar.style.width = `${activityLevel}%`;
    activityBar.innerHTML = `<span style="position: absolute; right: 5px; color: #001400; font-weight: bold; font-size: 0.625rem;">${Math.round(activityLevel)}%</span>`;
    
    setTimeout(updateActivityBar, 2000);
  }
  
  // Start activity bar animation
  setTimeout(updateActivityBar, 2000);
  
  // Add click/touch events to sections
  const sections = document.querySelectorAll('.dashboard-section');
  sections.forEach(section => {
    section.addEventListener('click', function() {
      // Highlight the clicked section
      sections.forEach(s => s.style.boxShadow = 'none');
      this.style.boxShadow = '0 0 15px rgba(0, 255, 0, 0.5)';
      
      // Add a "selected" indicator
      const header = this.querySelector('.section-header');
      const indicator = document.createElement('span');
      indicator.className = 'section-selected';
      indicator.textContent = 'ACTIVE';
      indicator.style.cssText = `
        color: #00ff00;
        font-size: 0.625rem;
        margin-left: 0.5rem;
        animation: blink 1s infinite;
      `;
      
      // Remove any existing indicators
      document.querySelectorAll('.section-selected').forEach(el => el.remove());
      
      // Add the new indicator
      header.querySelector('.section-title').appendChild(indicator);
    });
  });
}

function addResizeHandler() {
  // Re-render chart on window resize for responsiveness
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      // Redraw the skill chart when window is resized
      if (typeof Chart !== 'undefined') {
        drawSkillRadar();
      }
    }, 250);
  });
}
