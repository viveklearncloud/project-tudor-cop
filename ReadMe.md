# Casagrand Tudor - Owners & Buyers

A comprehensive web application for home buyers to track all communications, meetings, and documents with builders during their property purchase journey.

## Features

- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎨 **Animated Hamburger Menu** - Smooth navigation with animated menu toggle
- 💬 **Communications Tracker** - Log all interactions (email, phone, WhatsApp, in-person)
- 📅 **Meetings Timeline** - View all meetings in a beautiful timeline format, sorted by date
- 📄 **Document Management** - Centralized storage for all important documents with thumbnails
- 🔍 **Search & Filter** - Easily find documents by name or type
- 💾 **LocalStorage** - All data is saved locally in your browser
- 📊 **Dashboard** - Quick overview of all activities and statistics

## Installation

1. Create a repository on GitHub
2. Clone or download the files
3. Create a `documents` folder and add your PDF and image files
4. Update the `logo.png` with your property's logo
5. Open `index.html` in your web browser

## Usage

### Adding Communications
1. Navigate to Communications section
2. Click "Add Communication"
3. Fill in the details and submit
4. Your communication will be displayed in the list

### Adding Meetings
1. Navigate to Meetings section
2. Click "Add Meeting"
3. Fill in the meeting details
4.  Meetings will appear in a timeline format sorted by date (newest first)

### Managing Documents
1. Go to Documents section
2. Documents are displayed as tiles with thumbnails
3. Click on a document tile to view it
4. Use search to find specific documents
5. Filter by document type

## File Structure

```
home-buyer-tracker/
├── index.html          # Main HTML file
├── styles.css          # Stylesheet
├── script.js           # JavaScript logic
├── logo.png            # Property logo
├── documents/          # Document storage folder
│   ├── agreement. pdf
│   ├── layout.pdf
│   ├── receipt.pdf
│   └── brochure.pdf
└── README.md           # This file
```

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- LocalStorage API

## Features Breakdown

### Dashboard
- Quick statistics showing total communications, meetings, and documents
- Card-based interface for easy navigation
- Real-time count updates

### Animated Menu
- Smooth hamburger menu animation
- Slide-in navigation drawer
- Active state indicators

### Communications
- Add new communications with type (email, phone, WhatsApp, in-person)
- List view with date sorting
- Detailed information display

### Meetings
- Add meetings with title, date, time, and location
- Timeline visualization
- Sorted by date in descending order (latest first)
- Visual markers for easy identification

### Documents
- Tile-based grid layout
- Document thumbnails
- Search functionality
- Filter by document type (Legal, Financial, Technical, Agreement)
- Click to view documents
- Download functionality

## Data Storage

All data is stored in the browser's LocalStorage.  Your data persists even after closing the browser.

To clear data:
1. Open browser's Developer Tools (F12)
2. Go to Application/Storage tab
3. Find LocalStorage and clear `hbTrackerData`

## Customization

### Change Logo
Replace `logo.png` with your property's logo file

### Add/Remove Document Types
Edit the document filter options in the `<select id="docFilter">` element

### Update Colors
Modify the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #e74c3c;
    /* ... other colors */
}
```

### Add More Documents
1. Add your files to the `documents` folder
2. Update the sample data in `script.js` with new document entries
3. Include the file path and appropriate icon

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Version

1.0.0 - December 2025

## License

This project is created for property management purposes. 

## Support

For issues or feature requests, please reach out to the development team.