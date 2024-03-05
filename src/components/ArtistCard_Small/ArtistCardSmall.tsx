import React from 'react'
import ArtistCardContext from '../ArtistCard/ArtistCardContext'

type Props = {
  data: object
}

const ArtistCardSmall = ({data}: Props) => {
  return (
    <ArtistCardContext.Provider value={data}>ArtistCardSmall</ArtistCardContext.Provider>
  )
}

export default ArtistCardSmall