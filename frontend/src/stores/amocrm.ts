import { defineStore } from 'pinia'
import axios from 'axios'

interface Entity {
  id: string
  type: string
}

export const useAmoCRMStore = defineStore('amocrm', {
  state: () => ({
    entities: [] as Entity[],
    loading: false,
    error: null as string | null,
  }),
  
  actions: {
    async createEntity(type: string) {
      this.loading = true
      this.error = null
      
      try {
        const response = await axios.post('http://localhost:3000/api/entities', { type })
        const newEntity = {
          id: response.data.id,
          type,
        }
        this.entities.push(newEntity)
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An error occurred'
      } finally {
        this.loading = false
      }
    },
  },
})
