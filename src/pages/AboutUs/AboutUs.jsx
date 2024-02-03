import classNames from "classnames/bind";
import styles from "./style.module.css";
import { motion } from "framer-motion";
import {useQuery,useQueryClient} from "@tanstack/react-query"
import { supabase } from "../../helper/supabase";
import AboutCard from "../../components/AboutCard/AboutCard";
function AboutUs() {
  const sx = classNames.bind(styles);
  const {data,isError,status} = useQuery({queryKey: ["aboutUs"], queryFn: async () => {
    const res = await supabase.from("author").select("*");
    return res.data;
  }})
  
  console.log(data);
  if(status === "loading") return <div>loading</div>
  return (
    <div className={sx("mainContainer")}>
      <div className={sx("header")}>關於我們</div>
      
      <div className={sx("authorContainer")}>
        {status === "success" ?
        data.map((item,index) => {
          return  <AboutCard key={index} author_data={item}/>
        }) : <div>error</div>} 
      </div>
      <div className={sx("dcContainer")}>
        <div className={sx("text")}>資料出錯? 想換你的照片? 想要在這個網站貢獻些什麽?  有什麽想要的功能? 歡迎加入我們的DC 來討論</div>
        <div className={sx("linkContainer")}>

        </div>
      </div>
    </div>
  );
}
export default AboutUs;
