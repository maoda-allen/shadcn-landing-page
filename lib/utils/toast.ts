// 简单的Toast通知系统
export interface ToastOptions {
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

class ToastManager {
  private container: HTMLElement | null = null;
  private toastCount = 0;

  private createContainer() {
    if (this.container) return this.container;

    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 8px;
    `;
    document.body.appendChild(this.container);
    return this.container;
  }

  private getToastStyles(type: string) {
    const baseStyles = `
      pointer-events: auto;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-size: 14px;
      font-weight: 500;
      max-width: 400px;
      word-wrap: break-word;
      transform: translateX(100%);
      transition: all 0.3s ease;
      margin-bottom: 8px;
    `;

    const typeStyles = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      warning: 'background: #f59e0b; color: white;',
      info: 'background: #3b82f6; color: white;'
    };

    return baseStyles + typeStyles[type as keyof typeof typeStyles];
  }

  show(message: string, options: ToastOptions = {}) {
    const {
      type = 'info',
      duration = 3000,
      position = 'top-right'
    } = options;

    const container = this.createContainer();
    const toast = document.createElement('div');
    const toastId = ++this.toastCount;

    toast.style.cssText = this.getToastStyles(type);
    toast.textContent = message;
    toast.setAttribute('data-toast-id', toastId.toString());

    container.appendChild(toast);

    // 动画进入
    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    // 自动移除
    const removeToast = () => {
      toast.style.transform = 'translateX(100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
        // 如果没有更多toast，移除容器
        if (container.children.length === 0 && container.parentNode) {
          container.parentNode.removeChild(container);
          this.container = null;
        }
      }, 300);
    };

    // 点击关闭
    toast.addEventListener('click', removeToast);

    // 自动关闭
    if (duration > 0) {
      setTimeout(removeToast, duration);
    }

    return {
      close: removeToast,
      element: toast
    };
  }

  success(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'success' });
  }

  error(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'error' });
  }

  warning(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'warning' });
  }

  info(message: string, options?: Omit<ToastOptions, 'type'>) {
    return this.show(message, { ...options, type: 'info' });
  }
}

// 导出单例实例
export const toast = new ToastManager(); 