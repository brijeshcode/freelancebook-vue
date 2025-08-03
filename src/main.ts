import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createNotivue } from 'notivue'

import App from './App.vue'
import router from './router'

// Import Notivue styles
import 'notivue/notification.css'
import 'notivue/animations.css'

const app = createApp(App)

// Create Notivue instance with freelancer management system specific config
const notivue = createNotivue({
  position: 'top-right',
  limit: 4,
  enqueue: true,
  avoidDuplicates: true,
  notifications: {
    global: {
      duration: 5000
    }
  }
})

app.use(createPinia())
app.use(router)
app.use(notivue)

app.mount('#app')