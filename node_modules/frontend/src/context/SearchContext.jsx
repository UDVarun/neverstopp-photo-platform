import { createContext, useContext, useState } from "react"

const SearchContext = createContext()

export function SearchProvider({ children }) {

  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        search,
        setSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  return useContext(SearchContext)
}