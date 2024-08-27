import React, { createContext, useState } from 'react'
import { ReactUseState } from '../../../../types/Utility'

interface Props  {
  children: React.ReactNode
  defaultValue: string
}

export const SearchColumnContext = createContext<null|ReactUseState<string>>(null)

export const SearchColumnContextProvider = ({defaultValue,children}: Props) => {
  const [searchColumn,setSearchColumn] = useState(defaultValue)
  return (
    <SearchColumnContext.Provider value={[searchColumn, setSearchColumn]} >{children}</SearchColumnContext.Provider>
  )
}


