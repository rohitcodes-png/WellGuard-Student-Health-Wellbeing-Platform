// Utility Functions
// Shared helper functions across the application

const utils = {
    // Format date
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-IN', options);
    },

    // Format date relative (e.g., "2 days ago")
    formatDateRelative(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return this.formatDate(dateStr);
    },

    // Calculate deadline status
    getDeadlineStatus(deadlineStr) {
        const deadline = new Date(deadlineStr);
        const now = new Date();
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return { status: 'overdue', class: 'badge-danger', text: 'Overdue' };
        if (diffDays === 0) return { status: 'today', class: 'badge-warning', text: 'Due Today' };
        if (diffDays === 1) return { status: 'tomorrow', class: 'badge-warning', text: 'Due Tomorrow' };
        if (diffDays <= 3) return { status: 'soon', class: 'badge-info', text: `${diffDays} days left` };
        return { status: 'upcoming', class: 'badge-secondary', text: `${diffDays} days left` };
    },

    // Get wellness score color and status
    getWellnessStatus(score) {
        if (score >= 80) return { class: 'success', text: 'Excellent', color: 'var(--color-success)' };
        if (score >= 60) return { class: 'info', text: 'Good', color: 'var(--color-info)' };
        if (score >= 40) return { class: 'warning', text: 'Fair', color: 'var(--color-warning)' };
        return { class: 'danger', text: 'Needs Attention', color: 'var(--color-danger)' };
    },

    // Get activity type icon
    getActivityIcon(type) {
        const icons = {
            running: '🏃',
            walking: '🚶',
            cycling: '🚴',
            yoga: '🧘',
            sports: '⚽',
            gym: '💪'
        };
        return icons[type] || '🏋️';
    },

    // Get task category icon
    getTaskIcon(category) {
        const icons = {
            study: '📚',
            exercise: '💪',
            sleep: '😴',
            digital_detox: '📵',
            mental_wellness: '🧘'
        };
        return icons[category] || '✓';
    },

    // Get task category color
    getTaskColor(category) {
        const colors = {
            study: '#3b82f6',
            exercise: '#10b981',
            sleep: '#8b5cf6',
            digital_detox: '#f59e0b',
            mental_wellness: '#ec4899'
        };
        return colors[category] || '#6b7280';
    },

    // Calculate progress percentage
    calculateProgress(current, total) {
        return Math.min(Math.round((current / total) * 100), 100);
    },

    // Truncate text
    truncate(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} toast-notification`;
        toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      min-width: 300px;
      animation: slideInRight 0.3s ease-out;
    `;
        toast.innerHTML = `
      <div class="alert-content">
        <div class="alert-title">${message}</div>
      </div>
    `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Show confirmation dialog
    showConfirm(title, message, onConfirm) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          <p>${message}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline cancel-btn" data-i18n="common.cancel">Cancel</button>
          <button class="btn btn-primary confirm-btn" data-i18n="common.confirm">Confirm</button>
        </div>
      </div>
    `;

        document.body.appendChild(backdrop);

        backdrop.querySelector('.cancel-btn').addEventListener('click', () => {
            backdrop.remove();
        });

        backdrop.querySelector('.confirm-btn').addEventListener('click', () => {
            onConfirm();
            backdrop.remove();
        });

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.remove();
            }
        });
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Generate unique ID
    generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // Validate email
    isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Get severity class
    getSeverityClass(severity) {
        const classes = {
            low: 'badge-info',
            moderate: 'badge-warning',
            high: 'badge-danger'
        };
        return classes[severity] || 'badge-secondary';
    },

    // Format number with commas
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Calculate days until date
    daysUntil(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = date - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
}
