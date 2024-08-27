import { useQuery } from "@tanstack/react-query";
import { TableName } from "../types/Utility";
import { supabase, supabaseBaseURL, supabasePublicKey } from "../helper/supabase";

interface uuid  {
  count: number
}
//TODO: Potential Bug where table without uuid will not work
export function useGetTotalPage(tableName: TableName,filterCondition?: string) {
  const {data} =  useQuery({
    queryKey: [tableName],
    queryFn: async (): Promise<uuid[] | null> => {
      const url = supabaseBaseURL
      const response = await fetch(`${url}/rest/v1/${tableName}?select=uuid.count()${filterCondition ?"&"+filterCondition :""}`,{
        headers: {
          "apikey": supabasePublicKey,
          'Authorization': `Bearer ${supabasePublicKey}`
        }
      });
      const data = await response.json();

      console.log(data)
      return data;
    },
  });
  if(data) return data[0].count 
}
