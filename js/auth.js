// Authentication System
// Handles login, session management, and role-based access

class AuthService {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    // Get user from localStorage
    getStoredUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Store user in localStorage
    storeUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear stored user
    clearUser() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Login user
    login(username, password) {
        const user = dataService.authenticate(username, password);

        if (user) {
            this.storeUser(user);
            return {
                success: true,
                user: user
            };
        }

        return {
            success: false,
            error: 'Invalid username or password'
        };
    }

    // Logout user
    logout() {
        this.clearUser();
        window.location.href = '../index.html';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    // Redirect to appropriate dashboard based on role
    redirectToDashboard() {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return;
        }

        const dashboardMap = {
            'student': './dashboards/student.html',
            'parent': './dashboards/parent.html',
            'counselor': './dashboards/counselor.html',
            'admin': './dashboards/admin.html'
        };

        const dashboard = dashboardMap[this.currentUser.role];
        if (dashboard && !window.location.pathname.includes(dashboard)) {
            window.location.href = dashboard;
        }
    }

    // Require authentication and specific role
    requireAuth(allowedRoles = []) {
        if (!this.isAuthenticated()) {
            window.location.href = '../index.html';
            return false;
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(this.currentUser.role)) {
            this.redirectToDashboard();
            return false;
        }

        return true;
    }

    // Get demo credentials for display
    getDemoCredentials() {
        return [
            { role: 'Student', username: 'student1', password: 'student123' },
            { role: 'Parent', username: 'parent1', password: 'parent123' },
            { role: 'Counselor', username: 'counselor1', password: 'counselor123' },
            { role: 'Admin', username: 'admin1', password: 'admin123' }
        ];
    }
}

// Create global auth service instance
const authService = new AuthService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = authService;
}
