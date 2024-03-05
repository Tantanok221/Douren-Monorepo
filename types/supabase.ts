export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Author_Main: {
        Row: {
          Author: string
          Baha_link: string | null
          Baha_name: string | null
          Facebook_link: string | null
          Facebook_name: string | null
          Instagram_link: string | null
          Instagram_name: string | null
          Introduction: string | null
          Myacg_link: string | null
          Official_link: string | null
          Official_name: string | null
          Photo: string | null
          Pixiv_link: string | null
          Pixiv_name: string | null
          Plurk_link: string | null
          Plurk_name: string | null
          Store_link: string | null
          Twitch_link: string | null
          Twitch_name: string | null
          Twitter_link: string | null
          Twitter_name: string | null
          uuid: number
          Youtube_link: string | null
          Youtube_name: string | null
        }
        Insert: {
          Author: string
          Baha_link?: string | null
          Baha_name?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          Instagram_link?: string | null
          Instagram_name?: string | null
          Introduction?: string | null
          Myacg_link?: string | null
          Official_link?: string | null
          Official_name?: string | null
          Photo?: string | null
          Pixiv_link?: string | null
          Pixiv_name?: string | null
          Plurk_link?: string | null
          Plurk_name?: string | null
          Store_link?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          uuid?: number
          Youtube_link?: string | null
          Youtube_name?: string | null
        }
        Update: {
          Author?: string
          Baha_link?: string | null
          Baha_name?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          Instagram_link?: string | null
          Instagram_name?: string | null
          Introduction?: string | null
          Myacg_link?: string | null
          Official_link?: string | null
          Official_name?: string | null
          Photo?: string | null
          Pixiv_link?: string | null
          Pixiv_name?: string | null
          Plurk_link?: string | null
          Plurk_name?: string | null
          Store_link?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          uuid?: number
          Youtube_link?: string | null
          Youtube_name?: string | null
        }
        Relationships: []
      }
      Author_Tag: {
        Row: {
          Tag: string | null
          uuid: number
        }
        Insert: {
          Tag?: string | null
          uuid?: number
        }
        Update: {
          Tag?: string | null
          uuid?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_Author_Tag_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: false
            referencedRelation: "Author_Main"
            referencedColumns: ["uuid"]
          }
        ]
      }
      Event_DM: {
        Row: {
          Booth_name: string | null
          DM: string | null
          Event: string | null
          uuid: number | null
        }
        Insert: {
          Booth_name?: string | null
          DM?: string | null
          Event?: string | null
          uuid?: number | null
        }
        Update: {
          Booth_name?: string | null
          DM?: string | null
          Event?: string | null
          uuid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_Event_DM_uuid_fkey"
            columns: ["uuid"]
            isOneToOne: false
            referencedRelation: "Author_Main"
            referencedColumns: ["uuid"]
          }
        ]
      }
      FF42: {
        Row: {
          Author: string | null
          Baha_link: string | null
          Baha_name: string | null
          Booth_name: string | null
          DAY01_location: string | null
          DAY02_location: string | null
          DAY03_location: string | null
          DM: string | null
          Facebook_link: string | null
          Facebook_name: string | null
          id: string
          Instagram_link: string | null
          Instagram_name: string | null
          Official_link: string | null
          Photo: string | null
          Pixiv_link: string | null
          Pixiv_name: string | null
          Plurk_link: string | null
          Plurk_name: string | null
          Store_link: string | null
          Tag: string | null
          Twitch_link: string | null
          Twitch_name: string | null
          Twitter_link: string | null
          Twitter_name: string | null
          Youtube_link: string | null
          Youtube_name: string | null
        }
        Insert: {
          Author?: string | null
          Baha_link?: string | null
          Baha_name?: string | null
          Booth_name?: string | null
          DAY01_location?: string | null
          DAY02_location?: string | null
          DAY03_location?: string | null
          DM?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          id?: string
          Instagram_link?: string | null
          Instagram_name?: string | null
          Official_link?: string | null
          Photo?: string | null
          Pixiv_link?: string | null
          Pixiv_name?: string | null
          Plurk_link?: string | null
          Plurk_name?: string | null
          Store_link?: string | null
          Tag?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          Youtube_link?: string | null
          Youtube_name?: string | null
        }
        Update: {
          Author?: string | null
          Baha_link?: string | null
          Baha_name?: string | null
          Booth_name?: string | null
          DAY01_location?: string | null
          DAY02_location?: string | null
          DAY03_location?: string | null
          DM?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          id?: string
          Instagram_link?: string | null
          Instagram_name?: string | null
          Official_link?: string | null
          Photo?: string | null
          Pixiv_link?: string | null
          Pixiv_name?: string | null
          Plurk_link?: string | null
          Plurk_name?: string | null
          Store_link?: string | null
          Tag?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          Youtube_link?: string | null
          Youtube_name?: string | null
        }
        Relationships: []
      }
      "FF42-Tag": {
        Row: {
          count: number | null
          index: number
          tag: string
        }
        Insert: {
          count?: number | null
          index?: number
          tag: string
        }
        Update: {
          count?: number | null
          index?: number
          tag?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      Link: "category" | "link" | "name"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
