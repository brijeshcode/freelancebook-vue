<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
      :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">FreelancePro</h1>
          </div>
        </div>
        <!-- Close button for mobile -->
        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <!-- Dashboard -->
          <router-link
            to="/dashboard"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/dashboard') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Home class="mr-3 h-5 w-5 flex-shrink-0" />
            Dashboard
          </router-link>

          <!-- Clients -->
          <router-link
            to="/clients"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/clients') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Users class="mr-3 h-5 w-5 flex-shrink-0" />
            Clients
          </router-link>

          <!-- Projects -->
          <router-link
            to="/projects"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/projects') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Folder class="mr-3 h-5 w-5 flex-shrink-0" />
            Projects
          </router-link>

          <!-- Services -->
          <router-link
            to="/services"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/services') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Settings class="mr-3 h-5 w-5 flex-shrink-0" />
            Services
          </router-link>

          <!-- Invoices -->
          <router-link
            to="/invoices"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/invoices') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <FileText class="mr-3 h-5 w-5 flex-shrink-0" />
            Invoices
          </router-link>

          <!-- Payments -->
          <router-link
            to="/payments"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/payments') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <CreditCard class="mr-3 h-5 w-5 flex-shrink-0" />
            Payments
          </router-link>

          <!-- Recurring Services -->
          <router-link
            to="/recurring-services"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/recurring-services') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <RotateCcw class="mr-3 h-5 w-5 flex-shrink-0" />
            Recurring Services
          </router-link>

          <!-- Reports -->
          <router-link
            to="/reports"
            class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
            :class="isActiveRoute('/reports') 
              ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <BarChart3 class="mr-3 h-5 w-5 flex-shrink-0" />
            Reports
          </router-link>
        </div>

        <!-- Settings Section -->
        <div class="mt-8">
          <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings
          </h3>
          <div class="mt-2 space-y-1">
            <router-link
              to="/settings"
              class="group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="isActiveRoute('/settings') 
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
            >
              <Settings class="mr-3 h-5 w-5 flex-shrink-0" />
              Settings
            </router-link>
          </div>
        </div>
      </nav>

      <!-- User Profile Section -->
      <div class="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              class="h-8 w-8 rounded-full"
              :src="user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=3B82F6&color=fff`"
              :alt="user?.name"
            />
          </div>
          <div class="ml-3 flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {{ user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {{ user?.email }}
            </p>
          </div>
          <div class="ml-2 flex-shrink-0">
            <button
              @click="toggleUserMenu"
              class="bg-white dark:bg-gray-800 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              <ChevronUp v-if="userMenuOpen" class="h-5 w-5 text-gray-400" />
              <ChevronDown v-else class="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        <!-- User Dropdown Menu -->
        <div 
          v-if="userMenuOpen"
          class="mt-2 bg-white dark:bg-gray-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1">
            <router-link
              to="/profile"
              class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Your Profile
            </router-link>
            <button
              @click="toggleDarkMode"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
            </button>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top Navigation Bar (Mobile) -->
      <div class="lg:hidden bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between h-16 px-4">
          <button
            @click="toggleSidebar"
            class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <Menu class="h-6 w-6" />
          </button>
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">FreelancePro</h1>
          <div class="w-8"></div> <!-- Spacer for centering -->
        </div>
      </div>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="p-6">
          <router-view />
        </div>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { logout } from '@/services/authService'
import { useNotifications } from '@/composables/useNotifications'
import {
  Home,
  Users,
  Folder,
  Settings,
  FileText,
  CreditCard,
  RotateCcw,
  BarChart3,
  Menu,
  X,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const notifications = useNotifications()

// State
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const isDarkMode = ref(false)

// Mock user data - replace with actual user store/auth
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null
})

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  // Apply dark mode to document
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}

const isActiveRoute = (path: string): boolean => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  try {
    await logout()
    notifications.success('You have been logged out successfully', {
      title: 'Logout Successful'
    })
    router.push('/login')
  } catch (error) {
    notifications.error('Error logging out', {
      title: 'Logout Failed'
    })
  }
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false
  }
}

// Close user menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (userMenuOpen.value && !(event.target as Element).closest('.user-menu')) {
    userMenuOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Check for saved dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  }

  window.addEventListener('resize', handleResize)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', handleClickOutside)
})
</script>