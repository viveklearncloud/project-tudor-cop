// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e. preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l. classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Close menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Show section
        const sectionId = link.getAttribute('data-section');
        showSection(sectionId);
    });
});

// Section Management - FIXED
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    
    // Get all sections
    const sections = document. querySelectorAll('.section');
    console.log('Found sections:', sections.length);
    
    // Remove active from all
    sections.forEach(section => {
        section.classList.remove('active');
        console.log('Removed active from:', section.id);
    });
    
    // Add active to target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log('Added active to:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    updateDashboard();
}

// Data Manager - LOADS FROM JSON FILES
const dataManager = {
    communications: [],
    meetings: [],
    documents: [],

    async init() {
        try {
            console.log('Loading data from JSON files...');
            
            // Load communications
            const commResponse = await fetch('models/communications.json');
            if (commResponse.ok) {
                this.communications = await commResponse.json();
                console.log('Communications loaded:', this.communications. length);
            }
            
            // Load meetings
            const meetingResponse = await fetch('models/meetings.json');
            if (meetingResponse.ok) {
                this.meetings = await meetingResponse.json();
                console.log('Meetings loaded:', this.meetings.length);
            }
            
            // Load documents
            const docResponse = await fetch('models/documents.json');
            if (docResponse.ok) {
                this.documents = await docResponse.json();
                console.log('Documents loaded:', this.documents.length);
            }
            
            // Check localStorage for any user-added data
            const stored = localStorage.getItem('hbTrackerData');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.communications && data.communications.length > 0) {
                    this.communications = [... this.communications, ...data.communications];
                }
                if (data.meetings && data.meetings. length > 0) {
                    this.meetings = [...this. meetings, ...data.meetings];
                }
                if (data. documents && data.documents.length > 0) {
                    this.documents = [...this.documents, ...data.documents];
                }
            }
            
        } catch (error) {
            console.error('Error loading JSON files:', error);
            console.log('Using default data...');
            this.loadDefaultData();
        }
    },

    loadDefaultData() {
        // Fallback data if JSON files fail to load
        this.communications = [
            {
                id: 1,
                name: 'Rajesh Kumar',
                type: 'email',
                details: 'Received payment schedule and project timeline update',
                date: '2025-12-05'
            }
        ];
        this.meetings = [
            {
                id: 1,
                title: 'Site Inspection',
                with: 'Project Manager',
                date: '2025-12-10',
                time: '10:00',
                details: 'Complete inspection of property and surrounding amenities',
                location: 'Casagrand Tudor, Mumbai'
            }
        ];
        this.documents = [
            {
                id: 1,
                name: 'Property Agreement',
                type: 'legal',
                thumbnail: '📄',
                path: 'documents/agreement.pdf',
                uploadDate: '2025-11-25'
            }
        ];
    },

    save() {
        const data = {
            communications: this.communications,
            meetings: this.meetings,
            documents: this.documents
        };
        localStorage.setItem('hbTrackerData', JSON.stringify(data));
    },

    addCommunication(comm) {
        comm.id = Date.now();
        this.communications.unshift(comm);
        this. save();
    },

    addMeeting(meeting) {
        meeting.id = Date.now();
        this.meetings.unshift(meeting);
        this.save();
    },

    addDocument(doc) {
        doc.id = Date.now();
        this.documents.push(doc);
        this.save();
    }
};

// Modal Management
const modalManager = {
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

    setupCloseButtons() {
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons. forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e. target === modal) {
                    this. closeModal(modal.id);
                }
            });
        });
    }
};

// Communication Management
function setupCommunications() {
    const addBtn = document.getElementById('addCommBtn');
    const commForm = document.getElementById('commForm');

    addBtn.addEventListener('click', () => {
        modalManager.openModal('commModal');
    });

    commForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const communication = {
            name: document.getElementById('commName').value,
            type: document.getElementById('commType').value,
            details: document.getElementById('commDetails'). value,
            date: document. getElementById('commDate').value
        };

        dataManager.addCommunication(communication);
        commForm.reset();
        modalManager.closeModal('commModal');
        renderCommunications();
        updateDashboard();
    });
}

function renderCommunications() {
    const list = document.getElementById('communicationsList');
    
    if (dataManager.communications. length === 0) {
        list.innerHTML = '<p class="empty-message">No communications yet.  Add one to get started!</p>';
        return;
    }

    list. innerHTML = dataManager.communications.map(comm => `
        <div class="communication-item">
            <div class="comm-details">
                <span class="comm-type">${comm.type. toUpperCase()}</span>
                <h3>${comm.name}</h3>
                <p>${comm.details}</p>
            </div>
            <div class="comm-date">${formatDate(comm.date)}</div>
        </div>
    `).join('');
}

// Meeting Management
function setupMeetings() {
    const addBtn = document.getElementById('addMeetingBtn');
    const meetingForm = document.getElementById('meetingForm');

    addBtn.addEventListener('click', () => {
        modalManager.openModal('meetingModal');
    });

    meetingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const meeting = {
            title: document.getElementById('meetingTitle').value,
            with: document.getElementById('meetingWith').value,
            date: document.getElementById('meetingDate').value,
            time: document.getElementById('meetingTime').value,
            details: document.getElementById('meetingDetails').value,
            location: document.getElementById('meetingLocation').value
        };

        dataManager.addMeeting(meeting);
        meetingForm.reset();
        modalManager.closeModal('meetingModal');
        renderMeetings();
        updateDashboard();
    });
}

function renderMeetings() {
    const list = document.getElementById('meetingsList');
    
    // Sort meetings by date in descending order
    const sortedMeetings = [...dataManager.meetings].sort((a, b) => 
        new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)
    );

    if (sortedMeetings.length === 0) {
        list.innerHTML = '<p class="empty-message">No meetings scheduled yet. Add one to get started!</p>';
        return;
    }

    list.innerHTML = `
        <div class="timeline-container">
            ${sortedMeetings.map((meeting, index) => `
                <div class="timeline-item">
                    <div class="timeline-marker">📅</div>
                    <div class="timeline-content">
                        <h3>${meeting.title}</h3>
                        <p><strong>With:</strong> ${meeting.with}</p>
                        <p><strong>Details:</strong> ${meeting.details}</p>
                        <div class="timeline-meta">
                            <span class="timeline-date">${formatDate(meeting.date)} at ${meeting.time}</span>
                            ${meeting.location ? `<span class="timeline-location">📍 ${meeting.location}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Document Management
function setupDocuments() {
    const searchBox = document.getElementById('docSearch');
    const filterSelect = document.getElementById('docFilter');

    searchBox.addEventListener('input', filterDocuments);
    filterSelect. addEventListener('change', filterDocuments);

    renderDocuments();
}

function filterDocuments() {
    const search = document.getElementById('docSearch').value. toLowerCase();
    const filter = document.getElementById('docFilter').value;

    const filtered = dataManager.documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(search);
        const matchesFilter = filter === '' || doc.type === filter;
        return matchesSearch && matchesFilter;
    });

    renderFilteredDocuments(filtered);
}

function renderDocuments() {
    renderFilteredDocuments(dataManager.documents);
}

function renderFilteredDocuments(docs) {
    const grid = document.getElementById('documentsList');

    if (docs.length === 0) {
        grid.innerHTML = '<p class="empty-message">No documents found. </p>';
        return;
    }

    grid.innerHTML = docs.map(doc => `
        <div class="document-tile" onclick="viewDocument(${doc. id})">
            <div class="doc-thumbnail">
                ${doc.thumbnail}
            </div>
            <div class="doc-info">
                <h4>${doc.name}</h4>
                <p>${formatDate(doc.uploadDate)}</p>
                <span class="doc-type">${doc.type. toUpperCase()}</span>
            </div>
        </div>
    `).join('');
}

function viewDocument(docId) {
    const doc = dataManager.documents.find(d => d.id === docId);
    if (! doc) return;

    document.getElementById('docViewerTitle').textContent = doc.name;
    document.getElementById('docViewerImg').src = doc.path;
    document.getElementById('docDownloadBtn').onclick = () => downloadDocument(doc. path, doc.name);

    modalManager.openModal('docModal');
}

function downloadDocument(path, name) {
    const link = document.createElement('a');
    link.href = path;
    link.download = name;
    link.click();
}

// Dashboard Card Navigation
function setupDashboardCards() {
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    console.log('Setting up dashboard cards.  Found:', dashboardCards.length);
    
    dashboardCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let sectionId;
            
            // Map card index to section ID
            if (index === 0) {
                sectionId = 'communications';
            } else if (index === 1) {
                sectionId = 'meetings';
            } else if (index === 2) {
                sectionId = 'documents';
            }
            
            if (sectionId) {
                console.log('Card clicked - Navigating to:', sectionId);
                
                // Update nav links
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Close menu
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Show section
                showSection(sectionId);
            }
        });
    });
}

// Dashboard Updates
function updateDashboard() {
    document.getElementById('comm-count').textContent = dataManager.communications.length;
    document.getElementById('meeting-count').textContent = dataManager.meetings.length;
    document.getElementById('doc-count').textContent = dataManager.documents.length;

    document.getElementById('total-comm'). textContent = dataManager.communications. length;
    document.getElementById('total-meet').textContent = dataManager.meetings.length;
    document.getElementById('total-docs').textContent = dataManager.documents.length;
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize App - UPDATED TO USE ASYNC
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing app...');
    
    // Wait for data to be loaded from JSON files
    await dataManager.init();
    
    modalManager.setupCloseButtons();
    setupCommunications();
    setupMeetings();
    setupDocuments();
    setupDashboardCards();
    
    updateDashboard();
    renderCommunications();
    renderMeetings();
    renderDocuments();
    
    console.log('App initialization complete!');
});