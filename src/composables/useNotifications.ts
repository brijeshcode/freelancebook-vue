// composables/useNotifications.ts
import { push } from 'notivue'

export interface NotificationOptions {
  title?: string
  message?: string
  duration?: number
  closable?: boolean
}

export const useNotifications = () => {
  
  // Success notifications for freelancer operations
  const success = (message: string, options?: NotificationOptions) => {
    push.success({
      title: options?.title || 'Success',
      message,
      duration: options?.duration || 4000,
      ...options
    })
  }

  // Error notifications for failed operations
  const error = (message: string, options?: NotificationOptions) => {
    push.error({
      title: options?.title || 'Error',
      message,
      duration: options?.duration || 6000,
      ...options
    })
  }

  // Warning notifications for important alerts
  const warning = (message: string, options?: NotificationOptions) => {
    push.warning({
      title: options?.title || 'Warning',
      message,
      duration: options?.duration || 5000,
      ...options
    })
  }

  // Info notifications for general information
  const info = (message: string, options?: NotificationOptions) => {
    push.info({
      title: options?.title || 'Info',
      message,
      duration: options?.duration || 4000,
      ...options
    })
  }

  // Specific notifications for freelancer management operations
  const clientSuccess = (action: string, clientName?: string) => {
    success(`Client ${clientName ? `"${clientName}" ` : ''}${action} successfully`)
  }

  const projectSuccess = (action: string, projectName?: string) => {
    success(`Project ${projectName ? `"${projectName}" ` : ''}${action} successfully`)
  }

  const invoiceSuccess = (action: string, invoiceNumber?: string) => {
    success(`Invoice ${invoiceNumber ? `#${invoiceNumber} ` : ''}${action} successfully`)
  }

  const paymentSuccess = (amount?: number, clientName?: string) => {
    success(`Payment ${amount ? `of $${amount} ` : ''}${clientName ? `from ${clientName} ` : ''}recorded successfully`)
  }

  // Validation error handler for Laravel validation responses
  const validationError = (errors: Record<string, string[]>) => {
    const firstError = Object.values(errors)[0]?.[0]
    if (firstError) {
      error(firstError, { title: 'Validation Error' })
    }
  }

  // Server error handler
  const serverError = (message?: string) => {
    error(message || 'Something went wrong. Please try again later.', {
      title: 'Server Error',
      duration: 7000
    })
  }

  // Network error handler
  const networkError = () => {
    error('Network connection failed. Please check your internet connection.', {
      title: 'Connection Error',
      duration: 7000
    })
  }

  return {
    success,
    error,
    warning,
    info,
    clientSuccess,
    projectSuccess,
    invoiceSuccess,
    paymentSuccess,
    validationError,
    serverError,
    networkError
  }
}