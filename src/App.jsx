import React from "react";
import { supabase } from "./helper/supabase.js";
import ArtistCard from "./components/ArtistCard/ArtistCard.jsx";
function App() {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const { data, error } = await supabase.from("FF42").select("").limit(10);
    if (data) {
      setData(data);
    }
    if (error) {
      setError(error);
    }
  };

  if (!data) {
    return <div>Loading...</div>; // or some loading spinner
  }
  if (error) {
    return <div>error</div>;
  }
  return data.map((item, index) => {
    console.log(item)
    return <ArtistCard key={item.id} data={item} />;
  });
}
export default App;
