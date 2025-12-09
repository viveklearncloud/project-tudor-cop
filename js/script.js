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
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
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

// Section Management
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    
    // Get all sections
    const sections = document.querySelectorAll('.section');
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
    news: [],

    async init() {
        try {
            console.log('Loading data from JSON files...');
            
            // Load communications
            const commResponse = await fetch('models/communications.json');
            if (commResponse.ok) {
                this.communications = []; //await commResponse.json();
                console.log('Communications loaded:', this.communications.length);
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

            // Load news
            const newsResponse = await fetch('models/news.json');
            if (newsResponse.ok) {
                this.news = await newsResponse.json();
                console.log('News loaded:', this.news.length);
            }
            
            // Check localStorage for any user-added data
            /* const stored = localStorage.getItem('hbTrackerData');
            if (stored) {
                const data = JSON.parse(stored);
                if (data.communications && data.communications.length > 0) {
                    this.communications = [...this.communications, ...data.communications];
                }
                if (data.meetings && data.meetings.length > 0) {
                    this.meetings = [...this.meetings, ...data.meetings];
                }
                if (data.documents && data.documents.length > 0) {
                    this.documents = [...this.documents, ...data.documents];
                }
            } */
            
        } catch (error) {
            console.error('Error loading JSON files:', error);
            console.log('Using default data...');
            this.loadDefaultData();
        }
    },

    loadDefaultData() {
        // Fallback data if JSON files fail to load
        this.communications = [
            /* {
                id: 1,
                name: 'Rajesh Kumar',
                type: 'email',
                details: 'Received payment schedule and project timeline update',
                date: '2025-12-05'
            } */
        ];
        this.meetings = [
            /* {
                id: 1,
                title: 'Site Inspection',
                with: 'Project Manager',
                date: '2025-12-10',
                time: '10:00',
                details: 'Complete inspection of property and surrounding amenities',
                location: 'Casagrand Tudor, Mumbai'
            } */
        ];
        this.documents = [
            /* {
                id: 1,
                name: 'Property Agreement',
                type: 'legal',
                thumbnail: '📄',
                path: 'documents/agreement.pdf',
                uploadDate: '2025-11-25'
            } */
        ];
        this.news = [];
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
        this.save();
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
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
    },

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        // Restore body scroll
        document.body.style.overflow = 'auto';
    },

    setupCloseButtons() {
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal.id);
            });
        });

        // Close on outside click (full-page modal)
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                // Only close if clicking on the background, not the content
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal) {
                    this.closeModal(activeModal.id);
                }
            }
        });
    }
};

// Communication Management
function setupCommunications() {
    const addBtn = document.getElementById('addCommBtn');
    const commForm = document.getElementById('commForm');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modalManager.openModal('commModal');
        });    
    }

    commForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const communication = {
            name: document.getElementById('commName').value,
            type: document.getElementById('commType').value,
            details: document.getElementById('commDetails').value,
            date: document.getElementById('commDate').value
        };

        dataManager.addCommunication(communication);
        commForm.reset();
        modalManager.closeModal('commModal');
        renderCommunications();
        updateDashboard();
    });
}

// Render communications as timeline like meetings
function renderCommunications() {
    const list = document.getElementById('communicationsList');
    
    // Sort communications by date in descending order
    const sortedComms = [...dataManager.communications].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );

    if (sortedComms.length === 0) {
        list.innerHTML = '<p class="empty-message">No communications yet.    Add one to get started!</p>';
        return;
    }

    // Map communication types to icons
    const iconMap = {
        'email': '📧',
        'phone': '☎️',
        'whatsapp': '💬',
        'in-person': '👤'
    };

    list.innerHTML = `
        <div class="timeline-container">
            ${sortedComms.map((comm, index) => {
                // Find linked document
                const linkedDoc = comm.linkedDocumentId ?  
                    dataManager.documents.find(d => d.id === comm.linkedDocumentId) : null;
                
                return `
                    <div class="timeline-item">
                        <div class="timeline-marker">${iconMap[comm.type] || '📞'}</div>
                        <div class="timeline-content">
                            <h3>${comm.name}</h3>
                            <p><strong>Type:</strong> ${comm.type.charAt(0).toUpperCase() + comm.type.slice(1).replace('-', ' ')}</p>
                            <p><strong>Details:</strong> ${comm.details}</p>
                            <div class="timeline-meta">
                                <span class="timeline-date">${formatDate(comm.date)}</span>
                                <span class="timeline-type">${comm.type.toUpperCase()}</span>
                                ${linkedDoc ? `<button class="btn-view-doc" onclick="viewDocument(${linkedDoc.id})">📄 View Document</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderMeetings() {
    const list = document.getElementById('meetingsList');
    
    // Sort meetings by date only in descending order (newest first)
    const sortedMeetings = [...dataManager.meetings].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // Descending order (newest first)
    });

    if (sortedMeetings.length === 0) {
        list.innerHTML = '<p class="empty-message">No meetings scheduled yet.   Add one to get started! </p>';
        return;
    }

    list.innerHTML = `
        <div class="timeline-container">
            ${sortedMeetings.map((meeting, index) => {
                // Find linked document
                const linkedDoc = meeting.linkedDocumentId ? 
                    dataManager.documents.find(d => d.id === meeting.linkedDocumentId) : null;
                
                return `
                    <div class="timeline-item">
                        <div class="timeline-marker">📅</div>
                        <div class="timeline-content">
                            <h3>${meeting.title}</h3>
                            <p><strong>With:</strong> ${meeting.with}</p>
                            <p><strong>Details:</strong> ${meeting.details}</p>
                            <div class="timeline-meta">
                                <span class="timeline-date">${formatDate(meeting.date)} at ${meeting.time}</span>
                                ${meeting.location ? `<span class="timeline-location">📍 ${meeting.location}</span>` : ''}
                                ${linkedDoc ? `<button class="btn-view-doc" onclick="viewDocument(${linkedDoc.id})">📄 View Document</button>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Meeting Management
function setupMeetings() {
    const addBtn = document.getElementById('addMeetingBtn');
    const meetingForm = document.getElementById('meetingForm');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            modalManager.openModal('meetingModal');
        });
    }

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

// Document Management
function setupDocuments() {
    const searchBox = document.getElementById('docSearch');
    const filterSelect = document.getElementById('docFilter');
    const viewCardBtn = document.getElementById('viewCardBtn');
    const viewTableBtn = document.getElementById('viewTableBtn');

    searchBox.addEventListener('input', filterDocuments);
    filterSelect.addEventListener('change', filterDocuments);
    
    viewCardBtn.addEventListener('click', () => switchView('card'));
    viewTableBtn.addEventListener('click', () => switchView('table'));

    renderDocuments();
}

let currentView = 'card';
let currentSortColumn = 'uploadDate';
let currentSortOrder = 'desc';

function switchView(view) {
    currentView = view;
    
    // Update button states
    document.getElementById('viewCardBtn').classList.toggle('active', view === 'card');
    document.getElementById('viewTableBtn').classList.toggle('active', view === 'table');
    
    // Re-render documents
    filterDocuments();
}

function filterDocuments() {
    const search = document.getElementById('docSearch').value.toLowerCase();
    const filter = document.getElementById('docFilter').value;

    const filtered = dataManager.documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(search);
        const matchesFilter = filter === '' || doc.type === filter;
        return matchesSearch && matchesFilter;
    });

    if (currentView === 'card') {
        renderFilteredDocumentsAsCards(filtered);
    } else {
        renderFilteredDocumentsAsTable(filtered);
    }
}

function renderDocuments() {
    if (currentView === 'card') {
        renderFilteredDocumentsAsCards(dataManager.documents);
    } else {
        renderFilteredDocumentsAsTable(dataManager.documents);
    }
}

function renderFilteredDocumentsAsCards(docs) {
    const grid = document.getElementById('documentsList');
    grid.className = 'documents-grid';

    if (docs.length === 0) {
        grid.innerHTML = '<p class="empty-message">No documents found.</p>';
        return;
    }

    // Sort documents by upload date (newest first)
    const sorted = [...docs].sort((a, b) => 
        new Date(b.uploadDate) - new Date(a.uploadDate)
    );

    grid.innerHTML = sorted.map(doc => `
        <div class="document-tile" onclick="viewDocument(${doc.id})">
            <div class="doc-thumbnail">
                ${doc.thumbnail}
            </div>
            <div class="doc-info">
                <h4>${doc.name}</h4>
                <p>${formatDate(doc.uploadDate)}</p>
                <span class="doc-type doc-type-${doc.type}">
                    ${doc.type.toUpperCase()}
                </span>
            </div>
        </div>
    `).join('');
}

function renderFilteredDocumentsAsTable(docs) {
    const grid = document.getElementById('documentsList');
    grid.className = '';

    if (docs.length === 0) {
        grid.innerHTML = '<p class="empty-message">No documents found.</p>';
        return;
    }

    // Sort documents based on current sort column
    const sorted = [...docs].sort((a, b) => {
        let aVal, bVal;

        switch (currentSortColumn) {
            case 'name':
                aVal = a.name.toLowerCase();
                bVal = b.name.toLowerCase();
                break;
            case 'type':
                aVal = a.type.toLowerCase();
                bVal = b.type.toLowerCase();
                break;
            case 'uploadDate':
            default:
                aVal = new Date(a.uploadDate);
                bVal = new Date(b.uploadDate);
        }

        if (aVal < bVal) return currentSortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const table = document.createElement('table');
    table.className = 'documents-table';
    
    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = [
        { label: '', width: '50px', sortCol: null },
        { label: 'Document Name', sortCol: 'name' },
        { label: 'Type', sortCol: 'type' },
        { label: 'Upload Date', sortCol: 'uploadDate' }
    ];
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.style.width = header.width || 'auto';
        
        if (header.sortCol) {
            th.style.cursor = 'pointer';
            th.innerHTML = header.label;
            
            if (currentSortColumn === header.sortCol) {
                th.classList.add('sort-active', `sort-${currentSortOrder}`);
            }
            
            th.addEventListener('click', () => {
                if (currentSortColumn === header.sortCol) {
                    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSortColumn = header.sortCol;
                    currentSortOrder = 'desc';
                }
                filterDocuments();
            });
        } else {
            th.innerHTML = header.label;
        }
        
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Table body
    const tbody = document.createElement('tbody');
    
    sorted.forEach(doc => {
        const row = document.createElement('tr');
        
        const cellThumbnail = document.createElement('td');
        cellThumbnail.className = 'doc-table-thumbnail';
        cellThumbnail.innerHTML = doc.thumbnail;
        row.appendChild(cellThumbnail);
        
        const cellName = document.createElement('td');
        cellName.className = 'doc-table-name';
        cellName.textContent = doc.name;
        cellName.onclick = (e) => {
            e.stopPropagation();
            viewDocument(doc.id);
        };
        row.appendChild(cellName);
        
        const cellType = document.createElement('td');
        const typeSpan = document.createElement('span');
        typeSpan.className = `doc-table-type doc-type-${doc.type}`;
        typeSpan.textContent = doc.type.toUpperCase();
        cellType.appendChild(typeSpan);
        row.appendChild(cellType);
        
        const cellDate = document.createElement('td');
        cellDate.className = 'doc-table-date';
        cellDate.textContent = formatDate(doc.uploadDate);
        row.appendChild(cellDate);
        
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => viewDocument(doc.id));
        
        tbody.appendChild(row);
    });
    
    table.appendChild(tbody);
    grid.innerHTML = '';
    grid.appendChild(table);
}

function viewDocument(docId) {
    const doc = dataManager.documents.find(d => d.id === docId);
    if (! doc) {
        console.error('Document not found:', docId);
        return;
    }

    // Check if title element exists
    const titleElement = document.getElementById('docViewerTitle');
    if (titleElement) {
        titleElement.textContent = doc.name;
    }
    
    // Get file extension
    const fileExtension = doc.path.split('.').pop().toLowerCase();
    
    // Determine viewer type based on file extension
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(fileExtension);
    const isPdf = fileExtension === 'pdf';
    const isExcel = ['xls', 'xlsx', 'xlsm', 'csv'].includes(fileExtension);
    const isWord = ['doc', 'docx'].includes(fileExtension);
    
    // Get the viewer container
    const docViewerContainer = document.querySelector('.doc-viewer');
    if (!docViewerContainer) {
        console.error('Doc viewer container not found');
        return;
    }
    
    // Clear previous content
    docViewerContainer.innerHTML = '';
    
    // Create appropriate viewer based on file type
    if (isImage) {
        const img = document.createElement('img');
        img.src = doc.path;
        img.alt = doc.name;
        img.style.cssText = 'max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 8px;';
        docViewerContainer.appendChild(img);
        console.log('Image viewer created for:', doc.name);
    } else if (isPdf) {
        const iframe = document.createElement('iframe');
        iframe.src = doc.path;
        iframe.type = 'application/pdf';
        iframe.style.cssText = 'width: 100%; height: 500px; border: none; border-radius: 8px;';
        docViewerContainer.appendChild(iframe);
        console.log('PDF viewer created for:', doc.name);
    } else if (isExcel) {
        // Show loading message
        const loadingMsg = document.createElement('p');
        loadingMsg.style.cssText = 'text-align: center; padding: 2rem; color: #7f8c8d;';
        loadingMsg.innerHTML = '<strong>Loading spreadsheet...</strong>';
        docViewerContainer.appendChild(loadingMsg);

        // Read and display Excel file
        fetch(doc.path)
            .then(res => res.arrayBuffer())
            .then(data => {
                try {
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const html = XLSX.utils.sheet_to_html(worksheet);
                    
                    const container = document.createElement('div');
                    container.style.cssText = 'overflow-x: auto; max-height: 600px; overflow-y: auto; background-color: #f9f9f9; border-radius: 8px; padding: 1rem;';
                    container.innerHTML = html;
                    
                    // Style the table
                    const table = container.querySelector('table');
                    if (table) {
                        table.style.cssText = 'border-collapse: collapse; width: 100%; font-family: "Segoe UI", Arial, sans-serif; font-size: 13px; background-color: white;';
                        
                        table.querySelectorAll('td, th').forEach(cell => {
                            cell.style.cssText = 'border: 1px solid #ddd; padding: 10px; text-align: left; word-break: break-word;';
                        });
                        
                        table.querySelectorAll('th').forEach(header => {
                            header.style.cssText = 'background-color: #3498db; color: white; border: 1px solid #2980b9; padding: 10px; font-weight: 600;';
                        });
                    }
                    
                    // Clear loading message and add table
                    docViewerContainer.innerHTML = '';
                    docViewerContainer.appendChild(container);
                    console.log('Excel viewer created for:', doc.name);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    docViewerContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;"><strong>Error loading spreadsheet.</strong><br>Please use Download or Open in New Tab to view this file.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading Excel file:', error);
                docViewerContainer.innerHTML = '<p style="text-align: center; padding: 2rem; color: red;"><strong>Error loading file.</strong><br>Please use Download or Open in New Tab to view this file.</p>';
            });
    } else if (isWord) {
        const container = document.createElement('div');
        container.style.cssText = 'background-color: #f5f5f5; padding: 2rem; border-radius: 8px; text-align: center;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 3rem; margin-bottom: 1rem;';
        icon.innerHTML = '📝';
        
        const message = document.createElement('p');
        message.style.cssText = 'color: #7f8c8d; margin: 0;';
        message.innerHTML = `<strong>Word Document Preview</strong><br><br>This is a Word document (. ${fileExtension})<br><br>Use the <strong>Download</strong> or <strong>Open in New Tab</strong> buttons to view this document.`;
        
        container.appendChild(icon);
        container.appendChild(message);
        docViewerContainer.appendChild(container);
        console.log('Word viewer note created for:', doc.name);
    } else {
        // Fallback for unknown types
        const container = document.createElement('div');
        container.style.cssText = 'background-color: #f5f5f5; padding: 2rem; border-radius: 8px; text-align: center;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'font-size: 3rem; margin-bottom: 1rem;';
        icon.innerHTML = '❓';
        
        const message = document.createElement('p');
        message.style.cssText = 'color: #7f8c8d; margin: 0;';
        message.innerHTML = `<strong>Preview not available for .  ${fileExtension.toUpperCase()} files</strong><br><br>Use the <strong>Download</strong> button to view this file.`;
        
        container.appendChild(icon);
        container.appendChild(message);
        docViewerContainer.appendChild(container);
        console.log('Unsupported file type:', fileExtension);
    }
    
    // Setup download button
    const downloadBtn = document.getElementById('docDownloadBtn');
    if (downloadBtn) {
        downloadBtn.onclick = () => downloadDocument(doc.path, doc.name);
    }
    
    // Setup open in new tab button
    const openNewBtn = document.getElementById('docOpenNewBtn');
    if (openNewBtn) {
        openNewBtn.onclick = () => {
            window.open(doc.path, '_blank');
        };
    }

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

// Back Button Navigation
function setupBackButtons() {
    const backButtons = [
        { id: 'backCommBtn', section: 'dashboard' },
        { id: 'backMeetingBtn', section: 'dashboard' },
        { id: 'backDocBtn', section: 'dashboard' },
        { id: 'backAboutBtn', section: 'dashboard' }
    ];

    backButtons.forEach(btn => {
        const backBtn = document.getElementById(btn.id);
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update nav links
                navLinks.forEach(link => {
                    if (link.getAttribute('data-section') === btn.section) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
                
                // Show section
                showSection(btn.section);
            });
        }
    });
}

// About Page Tabs
function setupAboutTabs() {
    const tabButtons = document.querySelectorAll('.about-tab-btn');
    const tabContents = document.querySelectorAll('.about-tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const tabName = btn.getAttribute('data-tab');
            console.log('Tab clicked:', tabName);
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            const targetContent = document.getElementById(tabName);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Activated:', tabName);
            } else {
                console.error('Tab content not found:', tabName);
            }
        });
    });
}

function renderNewsTicker() {
    const list = document.getElementById('newsTicker');
    if (!list) return;

    const iconMap = {
        alert: "🚨",
        update: "📰",
        info: "ℹ️"
    };

    // Generate original news items
    const items = dataManager.news.map(news => `
        <li>
            <span class="news-icon">${iconMap[news.category] || "📌"}</span>
            <span>${news.text}</span>
            <span class="news-category category-${news.category}">
                ${news.category.toUpperCase()}
            </span>
        </li>
    `).join('');

    // Duplicate items for perfect infinite scrolling
    list.innerHTML = items + items;
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
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing app...');
    
    // Wait for data to be loaded from JSON files
    await dataManager.init();
    
    modalManager.setupCloseButtons();
    setupCommunications();
    setupMeetings();
    setupDocuments();
    setupDashboardCards();
    setupBackButtons();
    setupAboutTabs();
    
    updateDashboard();
    renderCommunications();
    renderMeetings();
    renderDocuments();
    renderNewsTicker();
    
    console.log('App initialization complete! ');
});