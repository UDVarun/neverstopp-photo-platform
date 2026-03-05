<<<<<<< Updated upstream
import { supabase } from "../lib/supabase"
=======
import axios from "axios"

const API = import.meta.env.VITE_API_URL || "http://localhost:3000"
>>>>>>> Stashed changes

export const loginUser = async (data) => {

    const res = await axios.post(

<<<<<<< Updated upstream
export const registerUser = async ({ name, email, password }) => {

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  })

  if (error) throw error

  return data
}



export const loginUser = async ({ email, password }) => {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  return data
}



export const logoutUser = async () => {

  await supabase.auth.signOut()
=======
        API + "/auth/login",

        data

    )

    localStorage.setItem(
        "token",
        res.data.token
    )

    return res.data
>>>>>>> Stashed changes

}



<<<<<<< Updated upstream
/* ✅ FIXED isLoggedIn FOR SUPABASE */

export const isLoggedIn = async () => {

  const { data } = await supabase.auth.getSession()

  return !!data.session
=======
export const registerUser = async (data) => {

    const res = await axios.post(

        API + "/auth/register",

        data

    )

    return res.data

}



export const logoutUser = () => {

    localStorage.removeItem("token")

}



export const isLoggedIn = () => {

    return localStorage.getItem("token")
>>>>>>> Stashed changes

}