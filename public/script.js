// Particle System for Interactive Background
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.particleCount = 80;
        
        this.resize();
        this.init();
        this.animate();
        
        window.addEventListener('resize', () => {
            this.resize();
            this.init(); // Reinitialize particles on resize
        });
        
        // Smooth mouse tracking
        let targetMouseX = 0;
        let targetMouseY = 0;
        window.addEventListener('mousemove', (e) => {
            targetMouseX = e.clientX;
            targetMouseY = e.clientY;
        });
        
        // Smooth mouse interpolation
        const smoothMouse = () => {
            this.mouse.x += (targetMouseX - this.mouse.x) * 0.1;
            this.mouse.y += (targetMouseY - this.mouse.y) * 0.1;
            requestAnimationFrame(smoothMouse);
        };
        smoothMouse();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 3 + 2.5,
                color: this.getRandomColor(),
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.02
            });
        }
        this.lastTime = performance.now();
    }
    
    getRandomColor() {
        const colors = ['#00f0ff', '#8b5cf6', '#ec4899', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        const currentTime = performance.now();
        const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 2); // Cap at 2x speed
        this.lastTime = currentTime;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, i) => {
            // Update pulse phase for shimmer effect
            particle.pulsePhase += particle.pulseSpeed * deltaTime;
            
            // Mouse interaction (smoother with easing)
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                // Smoother easing
                particle.vx += (dx / distance) * force * 0.005 * deltaTime;
                particle.vy += (dy / distance) * force * 0.005 * deltaTime;
            }
            
            // Apply friction for smoother movement
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            // Update position
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // Bounce off edges (smoother)
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -0.8;
                particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -0.8;
                particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            }
            
            // Calculate pulse for shimmer effect
            const pulse = 1 + Math.sin(particle.pulsePhase) * 0.2;
            const currentRadius = particle.radius * pulse;
            
            // Draw multiple glow layers for shinier effect
            // Outer glow layer 1 (largest, faintest)
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius + 8, 0, Math.PI * 2);
            const gradient1 = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, currentRadius + 8
            );
            gradient1.addColorStop(0, particle.color);
            gradient1.addColorStop(0.3, particle.color + '40');
            gradient1.addColorStop(1, particle.color + '00');
            this.ctx.fillStyle = gradient1;
            this.ctx.globalAlpha = 0.4;
            this.ctx.fill();
            
            // Outer glow layer 2
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius + 5, 0, Math.PI * 2);
            const gradient2 = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, currentRadius + 5
            );
            gradient2.addColorStop(0, particle.color);
            gradient2.addColorStop(0.5, particle.color + '60');
            gradient2.addColorStop(1, particle.color + '00');
            this.ctx.fillStyle = gradient2;
            this.ctx.globalAlpha = 0.6;
            this.ctx.fill();
            
            // Outer glow layer 3 (medium)
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius + 3, 0, Math.PI * 2);
            const gradient3 = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, currentRadius + 3
            );
            gradient3.addColorStop(0, particle.color);
            gradient3.addColorStop(0.7, particle.color + '80');
            gradient3.addColorStop(1, particle.color + '00');
            this.ctx.fillStyle = gradient3;
            this.ctx.globalAlpha = 0.8;
            this.ctx.fill();
            
            // Main particle with intense glow
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, currentRadius, 0, Math.PI * 2);
            const mainGradient = this.ctx.createRadialGradient(
                particle.x - currentRadius * 0.3, particle.y - currentRadius * 0.3, 0,
                particle.x, particle.y, currentRadius
            );
            mainGradient.addColorStop(0, '#ffffff');
            mainGradient.addColorStop(0.3, particle.color);
            mainGradient.addColorStop(1, particle.color + 'CC');
            this.ctx.fillStyle = mainGradient;
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = particle.color;
            this.ctx.globalAlpha = 1;
            this.ctx.fill();
            
            // Bright center highlight
            this.ctx.beginPath();
            this.ctx.arc(particle.x - currentRadius * 0.2, particle.y - currentRadius * 0.2, currentRadius * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.globalAlpha = 0.9;
            this.ctx.fill();
            
            // Reset alpha
            this.ctx.globalAlpha = 1;
            this.ctx.shadowBlur = 0;
            
            // Draw connections between particles
            this.particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    // Use a softer, more muted color
                    const alpha = (150 - distance) / 150 * 0.15;
                    this.ctx.strokeStyle = particle.color;
                    this.ctx.globalAlpha = alpha;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.shadowBlur = 2;
                    this.ctx.shadowColor = particle.color;
                    this.ctx.stroke();
                    this.ctx.globalAlpha = 1;
                    this.ctx.shadowBlur = 0;
                }
            });
        });
        
        // Draw connections from cursor to nearby particles
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            const cursorConnections = [];
            
            // Find all particles within range of cursor
            this.particles.forEach(particle => {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    cursorConnections.push({
                        particle: particle,
                        distance: distance
                    });
                }
            });
            
            // Sort by distance (closest first)
            cursorConnections.sort((a, b) => a.distance - b.distance);
            
            // Connect to at least 3 particles (or all if fewer than 3 are available)
            // If more than 3 are available, show up to 5 for better visual effect
            const minConnections = 3;
            const maxConnections = 5;
            let numConnections;
            if (cursorConnections.length < minConnections) {
                numConnections = cursorConnections.length; // Show all if less than 3
            } else {
                numConnections = Math.min(maxConnections, cursorConnections.length); // Show up to 5 if 3+ available
            }
            const connectionsToDraw = cursorConnections.slice(0, numConnections);
            
            // Draw lines from cursor to selected particles (softer, less sharp)
            connectionsToDraw.forEach(({ particle, distance }) => {
                const opacity = (200 - distance) / 200 * 0.25;
                const lineWidth = (200 - distance) / 200 * 1.2;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.mouse.x, this.mouse.y);
                this.ctx.lineTo(particle.x, particle.y);
                this.ctx.strokeStyle = particle.color;
                this.ctx.globalAlpha = opacity;
                this.ctx.lineWidth = lineWidth;
                this.ctx.shadowBlur = 3;
                this.ctx.shadowColor = particle.color;
                this.ctx.lineCap = 'round';
                this.ctx.stroke();
                this.ctx.globalAlpha = 1;
                this.ctx.shadowBlur = 0;
            });
            
            // Draw cursor indicator (softer glow)
            if (connectionsToDraw.length > 0) {
                this.ctx.beginPath();
                this.ctx.arc(this.mouse.x, this.mouse.y, 3, 0, Math.PI * 2);
                this.ctx.fillStyle = '#00f0ff';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00f0ff';
                this.ctx.globalAlpha = 0.6;
                this.ctx.fill();
                this.ctx.globalAlpha = 1;
                this.ctx.shadowBlur = 0;
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Interactive Grid System
class InteractiveGrid {
    constructor() {
        this.gridOverlay = document.querySelector('.grid-overlay');
        this.mouse = { x: 0, y: 0 };
        this.targetX = 0;
        this.targetY = 0;
        this.currentX = 0;
        this.currentY = 0;
        
        if (this.gridOverlay) {
            this.init();
        }
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Calculate grid offset based on mouse position
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Normalize mouse position (-1 to 1)
            const normalizedX = (this.mouse.x - centerX) / centerX;
            const normalizedY = (this.mouse.y - centerY) / centerY;
            
            // Calculate target offset (max 30px movement)
            this.targetX = normalizedX * 30;
            this.targetY = normalizedY * 30;
        });
        
        this.animate();
    }
    
    animate() {
        // Smooth interpolation
        this.currentX += (this.targetX - this.currentX) * 0.1;
        this.currentY += (this.targetY - this.currentY) * 0.1;
        
        if (this.gridOverlay) {
            // Get current animation progress (0-50px based on time)
            const time = Date.now() / 1000;
            const animX = (time * 2.5) % 50;
            const animY = (time * 2.5) % 50;
            
            // Combine base animation with mouse interaction
            const finalX = animX + this.currentX;
            const finalY = animY + this.currentY;
            
            // Apply transform with smooth interpolation
            this.gridOverlay.style.transform = `translate(${finalX}px, ${finalY}px)`;
            
            // Increase opacity near cursor
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distance = Math.sqrt(
                Math.pow(this.mouse.x - centerX, 2) + 
                Math.pow(this.mouse.y - centerY, 2)
            );
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            const opacity = 0.3 + (1 - distance / maxDistance) * 0.4;
            this.gridOverlay.style.opacity = Math.min(opacity, 0.7);
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when page loads
let particleSystem;
let interactiveGrid;
window.addEventListener('load', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        particleSystem = new ParticleSystem(canvas);
    }
    interactiveGrid = new InteractiveGrid();
});

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 240, 255, 0.2)';
        navbar.style.borderBottomColor = 'rgba(0, 240, 255, 0.3)';
    } else {
        navbar.style.boxShadow = '0 4px 30px rgba(0, 240, 255, 0.1)';
        navbar.style.borderBottomColor = 'rgba(0, 240, 255, 0.2)';
    }
});

// Tab functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Quiz functionality
const quizQuestions = [
    {
        question: "Which data structure is best for implementing a LIFO (Last In First Out) system?",
        options: ["Stack", "Queue", "Array", "Linked List"],
        correct: 0
    },
    {
        question: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        correct: 1
    },
    {
        question: "Which algorithm is used to find the shortest path in a weighted graph?",
        options: ["BFS", "DFS", "Dijkstra's Algorithm", "Bubble Sort"],
        correct: 2
    },
    {
        question: "What is the time complexity of accessing an element in a hash table (average case)?",
        options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
        correct: 2
    },
    {
        question: "Which data structure is used to implement a priority queue efficiently?",
        options: ["Array", "Linked List", "Heap", "Stack"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let totalQuestions = quizQuestions.length;

function loadQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        showFinalScore();
        return;
    }

    const question = quizQuestions[currentQuestion];
    document.getElementById('questionText').textContent = question.question;
    
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        const span = document.createElement('span');
        span.textContent = option;
        button.appendChild(span);
        button.setAttribute('data-correct', index === question.correct);
        button.addEventListener('click', () => selectAnswer(button, index === question.correct));
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('quizFeedback').classList.remove('show');
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('total').textContent = totalQuestions;
}

function selectAnswer(button, isCorrect) {
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('quizFeedback');
    
    // Disable all buttons
    options.forEach(btn => btn.disabled = true);
    
    // Mark correct/incorrect
    options.forEach(btn => {
        if (btn.getAttribute('data-correct') === 'true') {
            btn.classList.add('correct');
        } else if (btn === button && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });
    
    // Show feedback
    if (isCorrect) {
        feedback.textContent = '✓ Correct! Well done!';
        feedback.className = 'quiz-feedback show correct';
        score++;
    } else {
        feedback.textContent = '✗ Incorrect. Try again next time!';
        feedback.className = 'quiz-feedback show incorrect';
    }
    
    document.getElementById('score').textContent = score;
    document.getElementById('nextBtn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function showFinalScore() {
    const quizContainer = document.querySelector('.quiz-container');
    const percentage = Math.round((score / totalQuestions) * 100);
    
    let message = '';
    if (percentage === 100) {
        message = 'Perfect! You\'re a DSA master! 🎉';
    } else if (percentage >= 80) {
        message = 'Excellent! Great understanding of DSA! 🌟';
    } else if (percentage >= 60) {
        message = 'Good job! Keep learning! 👍';
    } else {
        message = 'Keep practicing! DSA takes time to master! 💪';
    }
    
    quizContainer.innerHTML = `
        <div style="text-align: center;">
            <h2 style="margin-bottom: 1rem; color: #e0e0e0; text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);">Quiz Complete!</h2>
            <div style="font-size: 3rem; margin: 2rem 0; background: linear-gradient(135deg, #00f0ff 0%, #8b5cf6 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.5));">
                ${score}/${totalQuestions}
            </div>
            <p style="font-size: 1.2rem; color: #a0a0b0; margin-bottom: 2rem;">${message}</p>
            <button class="next-btn" onclick="location.reload()">Take Quiz Again</button>
        </div>
    `;
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Initialize quiz
loadQuestion();

// Add parallax effect to hero section and orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const orbs = document.querySelectorAll('.glow-orb');
    
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Parallax effect for orbs
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.1;
        orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

