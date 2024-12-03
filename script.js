// Mentor data with session tracking
const mentors = [
    {
        id: 1,
        name: "Dr. Sharma",
        expertise: "Artificial Intelligence",
        totalSlots: 8,
        availableSlots: ["Monday 2-3 PM", "Monday 3-4 PM", "Wednesday 4-5 PM", "Wednesday 5-6 PM"],
        bookedSlots: [],
        rating: 4.9,
        experience: "15+ years"
    },
    {
        id: 2,
        name: "Prof. Gupta",
        expertise: "Web Development",
        totalSlots: 8,
        availableSlots: ["Tuesday 1-2 PM", "Tuesday 2-3 PM", "Thursday 3-4 PM", "Thursday 4-5 PM"],
        bookedSlots: [],
        rating: 4.8,
        experience: "12+ years"
    },
    {
        id: 3,
        name: "Dr. Patel",
        expertise: "Data Science",
        totalSlots: 8,
        availableSlots: ["Monday 3-4 PM", "Monday 4-5 PM", "Friday 2-3 PM", "Friday 3-4 PM"],
        bookedSlots: [],
        rating: 4.7,
        experience: "10+ years"
    },
    {
        id: 4,
        name: "Prof. Singh",
        expertise: "Cybersecurity",
        totalSlots: 8,
        availableSlots: ["Wednesday 1-2 PM", "Wednesday 2-3 PM", "Thursday 4-5 PM", "Thursday 5-6 PM"],
        bookedSlots: [],
        rating: 4.9,
        experience: "18+ years"
    }
];

// Store all registered sessions
let allSessions = [];

// DOM Elements
const mentorList = document.getElementById('mentor-list');
const bookingForm = document.getElementById('booking-form');
const mentorSearch = document.getElementById('mentor-search');
const notification = document.getElementById('notification');

// Display Mentors
function displayMentors(filteredMentors = mentors) {
    mentorList.innerHTML = '';
    
    filteredMentors.forEach((mentor, index) => {
        const mentorCard = document.createElement('div');
        mentorCard.className = 'mentor-card animate__animated animate__fadeIn';
        mentorCard.style.animationDelay = `${index * 0.1}s`;
        
        mentorCard.innerHTML = `
           <img src="./images/mentors/${mentor.name}.png" alt="${mentor.name}" class="mentor-image" onerror="this.src='./images/mentors/failsafe.png'; this.style.width='300px'; this.style.height='200px'" width="300" height="200">
            <h3>${mentor.name}</h3>
            <p class="expertise"><strong>Expertise:</strong> ${mentor.expertise}</p>
            <p class="experience"><strong>Experience:</strong> ${mentor.experience}</p>
            <div class="rating">
                <span>★</span> ${mentor.rating}
            </div>
            <div class="available-slots">
                <h4>Available Slots: ${mentor.availableSlots.length}/${mentor.totalSlots}</h4>
                <ul>
                    ${mentor.availableSlots.map(slot => `<li>${slot}</li>`).join('')}
                </ul>
            </div>
            <button onclick="bookMentor(${mentor.id})" class="book-button" ${mentor.availableSlots.length === 0 ? 'disabled' : ''}>
                ${mentor.availableSlots.length === 0 ? 'No Slots Available' : 'Book Session'}
            </button>
        `;
        
        mentorList.appendChild(mentorCard);
    });
}

// Setup Booking Form
function setupBookingForm() {
    bookingForm.innerHTML = `
        <div class="form-group">
            <input type="text" id="student-name" class="form-input" placeholder="Your Name" required>
        </div>
        <div class="form-group">
            <select id="mentor-select" class="form-select" required>
                <option value="">Select a Mentor</option>
                ${mentors.map(mentor => 
                    mentor.availableSlots.length > 0 
                    ? `<option value="${mentor.id}">${mentor.name} - ${mentor.expertise}</option>` 
                    : ''
                ).join('')}
            </select>
        </div>
        <div class="form-group">
            <select id="slot-select" class="form-select" required>
                <option value="">Select a Time Slot</option>
            </select>
        </div>
        <button type="submit" class="submit-button">Book Session</button>
        <button type="button" id="view-sessions" class="view-sessions-button">View All Sessions</button>
    `;

    const mentorSelect = document.getElementById('mentor-select');
    const slotSelect = document.getElementById('slot-select');
    const viewSessionsBtn = document.getElementById('view-sessions');

    // Update available slots when mentor is selected
    mentorSelect.addEventListener('change', () => {
        const selectedMentor = mentors.find(m => m.id === parseInt(mentorSelect.value));
        slotSelect.innerHTML = '<option value="">Select a Time Slot</option>';
        
        if (selectedMentor) {
            selectedMentor.availableSlots.forEach(slot => {
                slotSelect.innerHTML += `<option value="${slot}">${slot}</option>`;
            });
        }
    });

    // View sessions button
    viewSessionsBtn.addEventListener('click', viewAllSessions);

    // Handle form submission
    bookingForm.addEventListener('submit', handleBookingSubmission);
}

// Handle Booking Submission
function handleBookingSubmission(e) {
    e.preventDefault();
    
    const mentorSelect = document.getElementById('mentor-select');
    const slotSelect = document.getElementById('slot-select');
    const studentNameInput = document.getElementById('student-name');
    
    if (mentorSelect.value && slotSelect.value && studentNameInput.value) {
        const selectedMentor = mentors.find(m => m.id === parseInt(mentorSelect.value));
        const selectedSlot = slotSelect.value;
        const studentName = studentNameInput.value;
        
        // Create session object
        const session = {
            mentorId: selectedMentor.id,
            mentorName: selectedMentor.name,
            mentorExpertise: selectedMentor.expertise,
            studentName: studentName,
            slot: selectedSlot,
            bookingDate: new Date().toLocaleString()
        };
        
        // Remove booked slot
        removeBookedSlot(selectedMentor.id, selectedSlot, session);
        
        // Show success notification
        showNotification('Booking successful! You will receive a confirmation email shortly.', 'success');
        
        // Reset form
        bookingForm.reset();
        slotSelect.innerHTML = '<option value="">Select a Time Slot</option>';
    } else {
        showNotification('Please fill in all fields.', 'error');
    }
}

// Remove Booked Slot
function removeBookedSlot(mentorId, bookedSlot, session) {
    const mentor = mentors.find(m => m.id === mentorId);
    if (mentor) {
        // Remove slot from available slots
        mentor.availableSlots = mentor.availableSlots.filter(slot => slot !== bookedSlot);
        
        // Add to booked slots
        mentor.bookedSlots.push(bookedSlot);
        
        // Add to all sessions
        allSessions.push(session);
        
        // Refresh mentor display
        displayMentors();
        setupBookingForm();
    }
}

// View All Sessions
function viewAllSessions() {
    // Create a new page or overlay to show all sessions
    const sessionsPage = window.open('', '_blank');
    sessionsPage.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Registered Mentorship Sessions</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>All Registered Mentorship Sessions</h1>
            <table>
                <thead>
                    <tr>
                        <th>Mentor Name</th>
                        <th>Mentor Expertise</th>
                        <th>Student Name</th>
                        <th>Slot</th>
                        <th>Booking Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${allSessions.map(session => `
                        <tr>
                            <td>${session.mentorName}</td>
                            <td>${session.mentorExpertise}</td>
                            <td>${session.studentName}</td>
                            <td>${session.slot}</td>
                            <td>${session.bookingDate}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `);
}

// Show Notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = 'notification hidden';
    }, 3000);
}

// Search Functionality
function setupSearch() {
    mentorSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredMentors = mentors.filter(mentor => 
            mentor.name.toLowerCase().includes(searchTerm) ||
            mentor.expertise.toLowerCase().includes(searchTerm)
        );
        displayMentors(filteredMentors);
    });
}

// Smooth Scroll Navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Book Mentor Button Click Handler
function bookMentor(mentorId) {
    const mentorSelect = document.getElementById('mentor-select');
    if (mentorSelect) {
        mentorSelect.value = mentorId;
        mentorSelect.dispatchEvent(new Event('change'));
        
        document.querySelector('#booking').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayMentors();
    setupBookingForm();
    setupSearch();
    setupSmoothScroll();
    
    // Add scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Dark Mode Functionality
function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const darkModeIcon = darkModeToggle.querySelector('i');
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('dark-mode');
    
    // Apply saved preference or default to system preference
    if (savedDarkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else if (window.matchMedia && 
               window.matchMedia('(prefers-color-scheme: dark)').matches && 
               savedDarkMode !== 'disabled') {
        document.body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            localStorage.setItem('dark-mode', 'disabled');
        }
    });

    // Listen for system dark mode changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply automatic change if user hasn't explicitly set a preference
        const savedDarkMode = localStorage.getItem('dark-mode');
        if (savedDarkMode === null) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                darkModeIcon.classList.remove('fa-moon');
                darkModeIcon.classList.add('fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                darkModeIcon.classList.remove('fa-sun');
                darkModeIcon.classList.add('fa-moon');
            }
        }
    });
}

// Modify existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    displayMentors();
    setupBookingForm();
    setupSearch();
    setupSmoothScroll();
    setupDarkModeToggle(); // Add this line
    
    // Add scroll animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeIn');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
