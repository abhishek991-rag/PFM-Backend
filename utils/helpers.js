// server/utils/helpers.js

// Helper function to format date (example)
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    return `<span class="math-inline">\{year\}\-</span>{month}-${day}`;
};

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Add more helper functions as needed (e.g., data validation, calculations)

module.exports = {
    formatDate,
    capitalizeFirstLetter,
    // ...other helper functions
};