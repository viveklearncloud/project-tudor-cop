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
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link. classList.add('active');
        
        // Close menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Show section
        const sectionId = link.getAttribute('data-section');
        showSection(sectionId);
    });
});

// Section Management
function showSection(sectionId) {
    const sections = document.querySelectorAll('. section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    updateDashboard();
}

// Data Management (LocalStorage)
const dataManager = {
    communications: [],
    meetings: [],
    documents: [],

    init() {
        const stored = localStorage.getItem('hbTrackerData');
        if (stored) {
            const data = JSON.parse(stored);
            this.communications = data. communications || [];
            this.meetings = data.meetings || [];
            this.documents = data.documents || [];
        } else {
            this.loadSampleData();
        }
    },

    loadSampleData() {
        this.communications = [
            {
                id: 1,
                name: 'Rajesh Kumar',
                type: 'email',
                details: 'Received payment schedule and project timeline update',
                date: '2025-12-05'
            },
            {
                id: 2,
                name: 'Priya Sharma',
                type: 'phone',
                details: 'Discussed possession timeline and final documentation',
                date: '2025-12-03'
            },
            {
                id: 3,
                name: 'Amit Patel',
                type: 'whatsapp',
                details: 'Site visit confirmation for next week',
                date: '2025-12-01'
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
            },
            {
                id: 2,
                title: 'Documentation Review',
                with: 'Legal Advisor',
                date: '2025-12-08',
                time: '14:00',
                details: 'Review of all purchase documents and agreement clauses',
                location: 'Legal Office'
            },
            {
                id: 3,
                title: 'Payment Discussion',
                with: 'Finance Team',
                date: '2025-12-05',
                time: '11:30',
                details: 'Final payment plan confirmation and mode of payment',
                location: 'Sales Office'
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
            },
            {
                id: 2,
                name: 'Layout Plan',
                type: 'technical',
                thumbnail: '📐',
                path: 'documents/layout.pdf',
                uploadDate: '2025-11-20'
            },
            {
                id: 3,
                name: 'Payment Receipt',
                type: 'financial',
                thumbnail: '💳',
                path: 'documents/receipt.pdf',
                uploadDate: '2025-11-15'
            },
            {
                id: 4,
                name: 'Project Brochure',
                type: 'agreement',
                thumbnail: '📑',
                path: 'documents/brochure.pdf',
                uploadDate: '2025-11-10'
            }
        ];

        this.save();
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
        this. documents.push(doc);
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
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
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
    
    if (dataManager.communications.length === 0) {
        list. innerHTML = '<p class="empty-message">No communications yet.  Add one to get started!</p>';
        return;
    }

    list.innerHTML = dataManager.communications.map(comm => `
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

        dataManager. addMeeting(meeting);
        meetingForm.reset();
        modalManager.closeModal('meetingModal');
        renderMeetings();
        updateDashboard();
    });
}

function renderMeetings() {
    const list = document.getElementById('meetingsList');
    
    // Sort meetings by date in descending order
    const sortedMeetings = [...dataManager. meetings].sort((a, b) => 
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
    const filter = document.getElementById('docFilter'). value;

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
        <div class="document-tile" onclick="viewDocument(${doc.id})">
            <div class="doc-thumbnail">
                ${doc.thumbnail}
            </div>
            <div class="doc-info">
                <h4>${doc.name}</h4>
                <p>${formatDate(doc.uploadDate)}</p>
                <span class="doc-type">${doc.type.toUpperCase()}</span>
            </div>
        </div>
    `). join('');
}

function viewDocument(docId) {
    const doc = dataManager.documents.find(d => d.id === docId);
    if (!doc) return;

    document.getElementById('docViewerTitle').textContent = doc.name;
    document.getElementById('docViewerImg').src = doc.path;
    document.getElementById('docDownloadBtn').onclick = () => downloadDocument(doc. path, doc.name);

    modalManager.openModal('docModal');
}

function downloadDocument(path, name) {
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = path;
    link.download = name;
    link.click();
}

// Dashboard Updates
function updateDashboard() {
    document.getElementById('comm-count').textContent = dataManager.communications.length;
    document.getElementById('meeting-count').textContent = dataManager.meetings.length;
    document.getElementById('doc-count').textContent = dataManager.documents.length;

    document.getElementById('total-comm').textContent = dataManager.communications.length;
    document.getElementById('total-meet').textContent = dataManager.meetings.length;
    document.getElementById('total-docs').textContent = dataManager.documents.length;
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    dataManager.init();
    modalManager.setupCloseButtons();
    setupCommunications();
    setupMeetings();
    setupDocuments();
    updateDashboard();
    renderCommunications();
    renderMeetings();
    renderDocuments();

    // Dashboard cards click navigation
    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = Array.from(document.querySelectorAll('.dashboard-card')).indexOf(card);
            const sections = ['communications', 'meetings', 'documents'];
            if (sections[index]) {
                navLinks. forEach(l => l.classList.remove('active'));
                document.querySelector(`[data-section="${sections[index]}"]`).classList.add('active');
                showSection(sections[index]);
            }
        });
    });
});