import { ref } from 'vue'
import axios from 'axios'

const apiKey = import.meta.env.VITE_INVOICE_KEY
const baseUrl = import.meta.env.VITE_BASE_URL

export interface ActiveSystem {
  name: string
  url: string
  subdomain: string
  invoices: number
  expenses: number
  month: string
  year: string
}

export function useFetchActiveSystem() {
  const errorMsg = ref<unknown>(null)
  const loadingActiveSystems = ref(false)
  const token = ref('')
  const activeSystemList = ref<ActiveSystem[]>([])

  const fetchToken = async () => {
    const response = await axios.post(
      baseUrl + 'token-fetcher',
      { api_key: apiKey },
      { headers: { 'Content-Type': 'application/json' } }
    )
    token.value = response.data.data.token
  }

  const activeSystems = async (month: number, year: number) => {
    loadingActiveSystems.value = true
    errorMsg.value = null

    try {
      if (!token.value) {
        await fetchToken()
      }

      const response = await axios.get(baseUrl + 'active-systems', {
        params: { token: token.value, month, year },
        headers: { 'Content-Type': 'application/json' },
      })
      activeSystemList.value = response.data.data
    } catch (err) {
      token.value = ''
      errorMsg.value = err
      activeSystemList.value = []
    } finally {
      loadingActiveSystems.value = false
    }
  }

  return {
    errorMsg,
    loadingActiveSystems,
    activeSystemList,
    activeSystems,
  }
}
