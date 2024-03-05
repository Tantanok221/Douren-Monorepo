import React from 'react'
import ArtistCardContext from '../ArtistCard/ArtistCardContext'
import { FF } from '../../../types/FF'

type Props = {
  data: FF
}

const ArtistCardSmall = ({data}: Props) => {
  return (
    <ArtistCardContext.Provider value={data}>ArtistCardSmall</ArtistCardContext.Provider>
  )
}

export default ArtistCardSmall