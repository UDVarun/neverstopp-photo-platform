import axios from "axios"

<<<<<<< Updated upstream
const api = axios.create({
  baseURL: "/api"
})

export default api
=======
export default axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
})
>>>>>>> Stashed changes
