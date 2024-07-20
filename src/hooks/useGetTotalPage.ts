import { useQuery } from "@tanstack/react-query";
import { TableName } from "../types/Utility";
import { supabase } from "../helper/supabase";

interface uuid  {
  uuid: number
}
//! Supabase Have Problem cannot use aggregate function so currently do this as a workaround
//TODO: Potential Bug where table without uuid will not work
export function useGetTotalPage(tableName: TableName) {
  const {data} =  useQuery({
    queryKey: [tableName],
    queryFn: async (): Promise<uuid[] | null> => {
      const query = supabase
        .from(tableName)
        .select("uuid,uuid(count)");
      const { data, error } = await query;
      console.log(data)
      if (error) throw error;
      return data;
    },
  });
  console.log(data)
  if(data != undefined && data!= null) return data.length 
}
