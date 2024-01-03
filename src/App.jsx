import React from "react"
import {supabase} from "./helper/supabase.js"
function App() {
  const [data,setData] = React.useState([])
  const [error,setError] = React.useState(null)
  React.useEffect(()=> {
    const fetchData = async () => {
      const {data, error} = await supabase
        .from("FF42")
        .select("")
        .limit(10)
      console.log(data, error)
      if(data){
        setData(data)
      }
      if(error){
        setError(error)
      }
    }
    fetchData()
  },[])
  return (
    <div></div>
  )
}

export default App
