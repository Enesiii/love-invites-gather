export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      event_photos: {
        Row: {
          created_at: string
          id: string
          invitation_id: string
          path: string
          show_in_gallery: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          invitation_id: string
          path: string
          show_in_gallery?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          invitation_id?: string
          path?: string
          show_in_gallery?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "event_photos_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          address: string | null
          closed_at: string | null
          cover_path: string | null
          cover_pos_x: number
          cover_pos_y: number
          cover_zoom: number
          created_at: string
          event_date: string
          event_time: string
          expected_guests: number | null
          id: string
          manage_token: string
          message: string | null
          owner_id: string | null
          partner_one: string
          partner_two: string
          theme: string
          venue: string
        }
        Insert: {
          address?: string | null
          closed_at?: string | null
          cover_path?: string | null
          cover_pos_x?: number
          cover_pos_y?: number
          cover_zoom?: number
          created_at?: string
          event_date: string
          event_time?: string
          expected_guests?: number | null
          id?: string
          manage_token?: string
          message?: string | null
          owner_id?: string | null
          partner_one: string
          partner_two: string
          theme?: string
          venue: string
        }
        Update: {
          address?: string | null
          closed_at?: string | null
          cover_path?: string | null
          cover_pos_x?: number
          cover_pos_y?: number
          cover_zoom?: number
          created_at?: string
          event_date?: string
          event_time?: string
          expected_guests?: number | null
          id?: string
          manage_token?: string
          message?: string | null
          owner_id?: string | null
          partner_one?: string
          partner_two?: string
          theme?: string
          venue?: string
        }
        Relationships: []
      }
      order_requests: {
        Row: {
          contact_email: string | null
          contact_phone: string
          created_at: string
          id: string
          notes: string | null
          partner_one: string
          partner_two: string
          status: string
          style: string
          wedding_date: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone: string
          created_at?: string
          id?: string
          notes?: string | null
          partner_one: string
          partner_two: string
          status?: string
          style: string
          wedding_date: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string
          created_at?: string
          id?: string
          notes?: string | null
          partner_one?: string
          partner_two?: string
          status?: string
          style?: string
          wedding_date?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          approval: string
          attending: boolean
          created_at: string
          guest_count: number
          guest_name: string
          id: string
          invitation_id: string
          note: string | null
        }
        Insert: {
          approval?: string
          attending: boolean
          created_at?: string
          guest_count?: number
          guest_name: string
          id?: string
          invitation_id: string
          note?: string | null
        }
        Update: {
          approval?: string
          attending?: boolean
          created_at?: string
          guest_count?: number
          guest_name?: string
          id?: string
          invitation_id?: string
          note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_invitation_id_fkey"
            columns: ["invitation_id"]
            isOneToOne: false
            referencedRelation: "invitations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
