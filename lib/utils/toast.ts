// Simple Toast notification system
export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastConfig {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  id?: string;
}

class ToastManager {
  private container: HTMLElement | null = null;
  private toasts: Map<string, HTMLElement> = new Map();
  private toastCounter = 0;

  private init() {
    if (this.container) return;
    
    this.container = document.createElement('div');
    this.container.className = 'fixed top-4 right-4 z-[9000] flex flex-col gap-2 max-w-sm';
    document.body.appendChild(this.container);
  }

  private getIcon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  }

  private getThemeClasses(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200';
      case 'error':
        return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200';
    }
  }

  private createToastElement(config: ToastConfig & { id: string }): HTMLElement {
    const toast = document.createElement('div');
    const themeClasses = this.getThemeClasses(config.type);
    
    toast.className = `
      ${themeClasses}
      border rounded-lg p-4 shadow-lg
      transform transition-all duration-300 ease-in-out
      translate-x-full opacity-0
      min-w-0 max-w-full
    `.replace(/\s+/g, ' ').trim();

    const icon = this.getIcon(config.type);
    const messageHtml = config.message ? `<p class="text-sm mt-1 break-words">${config.message}</p>` : '';
    
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="text-lg flex-shrink-0">${icon}</span>
        <div class="flex-1 min-w-0">
          <h4 class="font-medium break-words">${config.title}</h4>
          ${messageHtml}
        </div>
        <button class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2" data-close>
          ✕
        </button>
      </div>
    `;

    // Animation entry
    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Auto remove
    const duration = config.duration || 5000;
    const removeTimer = setTimeout(() => {
      this.remove(config.id);
    }, duration);

    // If no more toasts, remove container
    const originalRemove = () => {
      if (this.toasts.size === 0 && this.container) {
        document.body.removeChild(this.container);
        this.container = null;
      }
    };

    // Click close
    const closeBtn = toast.querySelector('[data-close]');
    closeBtn?.addEventListener('click', () => {
      clearTimeout(removeTimer);
      // Auto close
      this.remove(config.id);
    });

    return toast;
  }

  show(config: ToastConfig): string {
    this.init();
    
    const id = config.id || `toast-${++this.toastCounter}`;
    const fullConfig = { ...config, id };
    
    const toast = this.createToastElement(fullConfig);
    this.toasts.set(id, toast);
    
    if (this.container) {
      this.container.appendChild(toast);
    }
    
    return id;
  }

  remove(id: string) {
    const toast = this.toasts.get(id);
    if (!toast) return;

    toast.classList.add('translate-x-full', 'opacity-0');
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      this.toasts.delete(id);
      
      if (this.toasts.size === 0 && this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
        this.container = null;
      }
    }, 300);
  }

  clear() {
    this.toasts.forEach((_, id) => this.remove(id));
  }
}

// Export singleton instance
export const toast = new ToastManager(); 