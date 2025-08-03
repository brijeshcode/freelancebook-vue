import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    // Guest routes (Authentication)
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/Login.vue'),
      meta: {
        requiresGuest: true,
        title: 'Sign In'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/Register.vue'),
      meta: {
        requiresGuest: true,
        title: 'Create Account'
      }
    },
    
    // Protected routes with Sidebar layout
    {
      path: '/',
      component: () => import('@/views/layouts/Sidebar.vue'),
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
          meta: {
            title: 'Dashboard'
          }
        },
        {
          path: 'clients',
          name: 'Clients',
          component: () => import('@/views/clients/Index.vue'),
          meta: {
            title: 'Clients'
          }
        },
        {
          path: 'clients/create',
          name: 'ClientCreate',
          component: () => import('@/views/clients/Create.vue'),
          meta: {
            title: 'Add New Client'
          }
        },
        {
          path: 'clients/:id',
          name: 'ClientShow',
          component: () => import('@/views/clients/Show.vue'),
          meta: {
            title: 'Client Details'
          }
        },
        {
          path: 'clients/:id/edit',
          name: 'ClientEdit',
          component: () => import('@/views/clients/Edit.vue'),
          meta: {
            title: 'Edit Client'
          }
        },
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('@/views/projects/Index.vue'),
          meta: {
            title: 'Projects'
          }
        },
        {
          path: 'projects/create',
          name: 'ProjectCreate',
          component: () => import('@/views/projects/Create.vue'),
          meta: {
            title: 'Add New Project'
          }
        },
        {
          path: 'projects/:id',
          name: 'ProjectShow',
          component: () => import('@/views/projects/Show.vue'),
          meta: {
            title: 'Project Details'
          }
        },
        {
          path: 'projects/:id/edit',
          name: 'ProjectEdit',
          component: () => import('@/views/projects/Edit.vue'),
          meta: {
            title: 'Edit Project'
          }
        },
        {
          path: 'services',
          name: 'Services',
          component: () => import('@/views/services/Index.vue'),
          meta: {
            title: 'Services'
          }
        },
        {
          path: 'services/create',
          name: 'ServiceCreate',
          component: () => import('@/views/services/Create.vue'),
          meta: {
            title: 'Add New Service'
          }
        },
        {
          path: 'services/:id',
          name: 'ServiceShow',
          component: () => import('@/views/services/Show.vue'),
          meta: {
            title: 'Service Details'
          }
        },
        {
          path: 'services/:id/edit',
          name: 'ServiceEdit',
          component: () => import('@/views/services/Edit.vue'),
          meta: {
            title: 'Edit Service'
          }
        },
        {
          path: 'invoices',
          name: 'Invoices',
          component: () => import('@/views/invoices/Index.vue'),
          meta: {
            title: 'Invoices'
          }
        },
        {
          path: 'invoices/create',
          name: 'InvoiceCreate',
          component: () => import('@/views/invoices/Create.vue'),
          meta: {
            title: 'Create Invoice'
          }
        },
        {
          path: 'invoices/:id',
          name: 'InvoiceShow',
          component: () => import('@/views/invoices/Show.vue'),
          meta: {
            title: 'Invoice Details'
          }
        },
        {
          path: 'invoices/:id/edit',
          name: 'InvoiceEdit',
          component: () => import('@/views/invoices/Edit.vue'),
          meta: {
            title: 'Edit Invoice'
          }
        },
        {
          path: 'payments',
          name: 'Payments',
          component: () => import('@/views/payments/Index.vue'),
          meta: {
            title: 'Payments'
          }
        },
        {
          path: 'payments/create',
          name: 'PaymentCreate',
          component: () => import('@/views/payments/Create.vue'),
          meta: {
            title: 'Record Payment'
          }
        },
        {
          path: 'payments/:id',
          name: 'PaymentShow',
          component: () => import('@/views/payments/Show.vue'),
          meta: {
            title: 'Payment Details'
          }
        },
        // {
        //   path: 'recurring-services',
        //   name: 'RecurringServices',
        //   component: () => import('@/views/recurring-services/Index.vue'),
        //   meta: {
        //     title: 'Recurring Services'
        //   }
        // },
        // {
        //   path: 'recurring-services/create',
        //   name: 'RecurringServiceCreate',
        //   component: () => import('@/views/recurring-services/Create.vue'),
        //   meta: {
        //     title: 'Add Recurring Service'
        //   }
        // },
        // {
        //   path: 'recurring-services/:id',
        //   name: 'RecurringServiceShow',
        //   component: () => import('@/views/recurring-services/Show.vue'),
        //   meta: {
        //     title: 'Recurring Service Details'
        //   }
        // },
        // {
        //   path: 'recurring-services/:id/edit',
        //   name: 'RecurringServiceEdit',
        //   component: () => import('@/views/recurring-services/Edit.vue'),
        //   meta: {
        //     title: 'Edit Recurring Service'
        //   }
        // },
        // {
        //   path: 'reports',
        //   name: 'Reports',
        //   component: () => import('@/views/reports/Index.vue'),
        //   meta: {
        //     title: 'Reports'
        //   }
        // },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/settings/Index.vue'),
          meta: {
            title: 'Settings'
          }
        },
        // {
        //   path: 'profile',
        //   name: 'Profile',
        //   component: () => import('@/views/profile/Index.vue'),
        //   meta: {
        //     title: 'Your Profile'
        //   }
        // }
      ]
    },
    
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
      meta: {
        title: 'Page Not Found'
      }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Check authentication status
  const authenticated = isAuthenticated()

  // Routes that require authentication
  if (to.meta.requiresAuth && !authenticated) {
    next('/login')
    return
  }

  // Routes that require guest (not logged in)
  if (to.meta.requiresGuest && authenticated) {
    next('/dashboard')
    return
  }

  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - FreelancePro`
  }

  next()
})

export default router