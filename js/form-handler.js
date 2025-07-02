// Contact Form Handler

class ContactForm {
    constructor(formSelector = '#contact-form') {
        this.form = document.querySelector(formSelector);
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.originalButtonText = this.submitButton?.innerHTML;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.bindEvents();
        this.setupValidation();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });
    }
    
    setupValidation() {
        // Add validation attributes if not present
        const emailInput = this.form.querySelector('input[type="email"]');
        if (emailInput && !emailInput.pattern) {
            emailInput.pattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$';
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const formData = this.getFormData();
        
        try {
            this.setLoadingState(true);
            await this.submitForm(formData);
            this.handleSuccess();
        } catch (error) {
            this.handleError(error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }
        
        // Email validation
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation (if present)
        if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                this.showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Minimum length validation
        const minLength = field.getAttribute('minlength');
        if (minLength && value.length < parseInt(minLength)) {
            this.showFieldError(field, `${this.getFieldLabel(field)} must be at least ${minLength} characters`);
            return false;
        }
        
        return true;
    }
    
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        if (label) {
            return label.textContent.replace('*', '').trim();
        }
        
        return field.placeholder || field.name.charAt(0).toUpperCase() + field.name.slice(1);
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Accessibility
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id || 'error-' + field.name);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }
    
    async submitForm(data) {
        // This is a mock submission - replace with your actual form handling
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Message sent successfully!' });
                } else {
                    reject(new Error('Failed to send message. Please try again.'));
                }
            }, 2000);
        });
    }
    
    setLoadingState(isLoading) {
        if (!this.submitButton) return;
        
        if (isLoading) {
            this.submitButton.disabled = true;
            this.submitButton.innerHTML = `
                <span class="loading-spinner"></span>
                Sending...
            `;
        } else {
            this.submitButton.disabled = false;
            this.submitButton.innerHTML = this.originalButtonText;
        }
    }
    
    handleSuccess() {
        this.showNotification('Thank you! Your message has been sent successfully.', 'success');
        this.form.reset();
        
        // Clear any remaining errors
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.style.display = 'none');
        
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => field.classList.remove('error'));
    }
    
    handleError(error) {
        console.error('Form submission error:', error);
        this.showNotification(error.message || 'Something went wrong. Please try again.', 'error');
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ⓘ'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification with animation
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        
        // Auto hide after 5 seconds
        const autoHideTimer = setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            clearTimeout(autoHideTimer);
            this.hideNotification(notification);
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                clearTimeout(autoHideTimer);
                this.hideNotification(notification);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    hideNotification(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm('#contact-form');
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContactForm;
} 