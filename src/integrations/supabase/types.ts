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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      code_redemptions: {
        Row: {
          code_id: string | null
          id: string
          redeemed_at: string | null
          tryons_credited: number | null
          user_id: string | null
        }
        Insert: {
          code_id?: string | null
          id?: string
          redeemed_at?: string | null
          tryons_credited?: number | null
          user_id?: string | null
        }
        Update: {
          code_id?: string | null
          id?: string
          redeemed_at?: string | null
          tryons_credited?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "code_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      hall_of_fame: {
        Row: {
          created_at: string | null
          final_score: number | null
          full_name: string | null
          id: string
          instagram_id: string | null
          photo_url: string | null
          submission_id: string | null
          tryons_credited: number | null
          user_id: string | null
          week_number: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          final_score?: number | null
          full_name?: string | null
          id?: string
          instagram_id?: string | null
          photo_url?: string | null
          submission_id?: string | null
          tryons_credited?: number | null
          user_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          final_score?: number | null
          full_name?: string | null
          id?: string
          instagram_id?: string | null
          photo_url?: string | null
          submission_id?: string | null
          tryons_credited?: number | null
          user_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "hall_of_fame_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "outfit_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hall_of_fame_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          channel: string | null
          created_at: string | null
          id: string
          recipient_id: string | null
          recipient_type: string | null
          status: string | null
          type: string | null
        }
        Insert: {
          channel?: string | null
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          recipient_type?: string | null
          status?: string | null
          type?: string | null
        }
        Update: {
          channel?: string | null
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          recipient_type?: string | null
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
      outfit_submissions: {
        Row: {
          ai_score: number | null
          caption: string | null
          community_votes: number | null
          created_at: string | null
          creativity_score: number | null
          id: string
          impression_score: number | null
          instagram_id: string | null
          is_winner: boolean | null
          photo_url: string | null
          style_score: number | null
          submission_type: string | null
          total_score: number | null
          trend_score: number | null
          user_id: string | null
          week_number: number | null
          year: number | null
        }
        Insert: {
          ai_score?: number | null
          caption?: string | null
          community_votes?: number | null
          created_at?: string | null
          creativity_score?: number | null
          id?: string
          impression_score?: number | null
          instagram_id?: string | null
          is_winner?: boolean | null
          photo_url?: string | null
          style_score?: number | null
          submission_type?: string | null
          total_score?: number | null
          trend_score?: number | null
          user_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Update: {
          ai_score?: number | null
          caption?: string | null
          community_votes?: number | null
          created_at?: string | null
          creativity_score?: number | null
          id?: string
          impression_score?: number | null
          instagram_id?: string | null
          is_winner?: boolean | null
          photo_url?: string | null
          style_score?: number | null
          submission_type?: string | null
          total_score?: number | null
          trend_score?: number | null
          user_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "outfit_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          gateway: string | null
          gateway_payment_id: string | null
          id: string
          payment_type: string | null
          status: string | null
          tryons_credited: number | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          payment_type?: string | null
          status?: string | null
          tryons_credited?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          payment_type?: string | null
          status?: string | null
          tryons_credited?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          price_bhd: number | null
          price_eur: number | null
          price_inr: number | null
          price_kwd: number | null
          price_usd: number | null
          tryon_limit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price_bhd?: number | null
          price_eur?: number | null
          price_inr?: number | null
          price_kwd?: number | null
          price_usd?: number | null
          tryon_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          price_bhd?: number | null
          price_eur?: number | null
          price_inr?: number | null
          price_kwd?: number | null
          price_usd?: number | null
          tryon_limit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          type: string | null
          used_count: number | null
          value: number | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type?: string | null
          used_count?: number | null
          value?: number | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type?: string | null
          used_count?: number | null
          value?: number | null
        }
        Relationships: []
      }
      tryon_sessions: {
        Row: {
          created_at: string | null
          id: string
          outfit_image_url: string | null
          person_image_url: string | null
          result_image_url: string | null
          source: string | null
          status: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          outfit_image_url?: string | null
          person_image_url?: string | null
          result_image_url?: string | null
          source?: string | null
          status?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          outfit_image_url?: string | null
          person_image_url?: string | null
          result_image_url?: string | null
          source?: string | null
          status?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tryon_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tryon_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          instagram_id: string | null
          is_active: boolean | null
          plan: string | null
          total_tryons_used: number | null
          tryon_count: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_id?: string | null
          is_active?: boolean | null
          plan?: string | null
          total_tryons_used?: number | null
          tryon_count?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_id?: string | null
          is_active?: boolean | null
          plan?: string | null
          total_tryons_used?: number | null
          tryon_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_customers: {
        Row: {
          first_visit: string | null
          id: string
          last_visit: string | null
          tryons_used: number | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          first_visit?: string | null
          id?: string
          last_visit?: string | null
          tryons_used?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          first_visit?: string | null
          id?: string
          last_visit?: string | null
          tryons_used?: number | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_customers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          country: string | null
          created_at: string | null
          currency: string | null
          email: string | null
          id: string
          monthly_pool: number | null
          owner_name: string | null
          per_customer_limit: number | null
          phone: string | null
          plan_price: number | null
          pool_used: number | null
          status: string | null
          store_name: string | null
          subdomain: string | null
          updated_at: string | null
          warning_sent: boolean | null
          website: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          monthly_pool?: number | null
          owner_name?: string | null
          per_customer_limit?: number | null
          phone?: string | null
          plan_price?: number | null
          pool_used?: number | null
          status?: string | null
          store_name?: string | null
          subdomain?: string | null
          updated_at?: string | null
          warning_sent?: boolean | null
          website?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          currency?: string | null
          email?: string | null
          id?: string
          monthly_pool?: number | null
          owner_name?: string | null
          per_customer_limit?: number | null
          phone?: string | null
          plan_price?: number | null
          pool_used?: number | null
          status?: string | null
          store_name?: string | null
          subdomain?: string | null
          updated_at?: string | null
          warning_sent?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string | null
          id: string
          submission_id: string | null
          voter_id: string | null
          week_number: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          submission_id?: string | null
          voter_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          submission_id?: string | null
          voter_id?: string | null
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "outfit_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "users"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
