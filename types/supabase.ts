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
      author: {
        Row: {
          description: string | null
          discord_name: string | null
          github_link: string | null
          github_name: string | null
          name: string
          title: string
          twitter_link: string | null
          twitter_name: string | null
        }
        Insert: {
          description?: string | null
          discord_name?: string | null
          github_link?: string | null
          github_name?: string | null
          name: string
          title: string
          twitter_link?: string | null
          twitter_name?: string | null
        }
        Update: {
          description?: string | null
          discord_name?: string | null
          github_link?: string | null
          github_name?: string | null
          name?: string
          title?: string
          twitter_link?: string | null
          twitter_name?: string | null
        }
        Relationships: []
      }
      FF42: {
        Row: {
          author_name: string | null
          baha_link: string | null
          baha_name: string | null
          DAY01_location: string | null
          DAY02_location: string | null
          DAY03_location: string | null
          DM: string | null
          doujin_name: string | null
          Facebook_link: string | null
          Facebook_name: string | null
          id: string
          Instagram_link: string | null
          Instagram_name: string | null
          other_website: string | null
          photo: string | null
          PIXIV_link: string | null
          PIXIV_name: string | null
          plurk_link: string | null
          plurk_name: string | null
          store_link: string | null
          tag: string | null
          Twitch_link: string | null
          Twitch_name: string | null
          Twitter_link: string | null
          Twitter_name: string | null
          YouTube_link: string | null
          YouTube_name: string | null
        }
        Insert: {
          author_name?: string | null
          baha_link?: string | null
          baha_name?: string | null
          DAY01_location?: string | null
          DAY02_location?: string | null
          DAY03_location?: string | null
          DM?: string | null
          doujin_name?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          id?: string
          Instagram_link?: string | null
          Instagram_name?: string | null
          other_website?: string | null
          photo?: string | null
          PIXIV_link?: string | null
          PIXIV_name?: string | null
          plurk_link?: string | null
          plurk_name?: string | null
          store_link?: string | null
          tag?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          YouTube_link?: string | null
          YouTube_name?: string | null
        }
        Update: {
          author_name?: string | null
          baha_link?: string | null
          baha_name?: string | null
          DAY01_location?: string | null
          DAY02_location?: string | null
          DAY03_location?: string | null
          DM?: string | null
          doujin_name?: string | null
          Facebook_link?: string | null
          Facebook_name?: string | null
          id?: string
          Instagram_link?: string | null
          Instagram_name?: string | null
          other_website?: string | null
          photo?: string | null
          PIXIV_link?: string | null
          PIXIV_name?: string | null
          plurk_link?: string | null
          plurk_name?: string | null
          store_link?: string | null
          tag?: string | null
          Twitch_link?: string | null
          Twitch_name?: string | null
          Twitter_link?: string | null
          Twitter_name?: string | null
          YouTube_link?: string | null
          YouTube_name?: string | null
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
