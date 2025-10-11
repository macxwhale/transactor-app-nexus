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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      api_configurations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          app_id: string
          app_secret: string
          bearer_token: string | null
          business_short_code: string
          callback_url: string | null
          command_id: string | null
          consumer_key: string
          consumer_secret: string
          created_at: string | null
          environment: string
          id: string
          initiator_name: string | null
          initiator_password: string | null
          is_active: boolean | null
          name: string
          originator_conversation_id: string | null
          party_a: string
          party_b: string
          passkey: string
          queue_timeout_url: string | null
          result_url: string | null
          security_credential: string | null
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          app_id: string
          app_secret: string
          bearer_token?: string | null
          business_short_code: string
          callback_url?: string | null
          command_id?: string | null
          consumer_key: string
          consumer_secret: string
          created_at?: string | null
          environment?: string
          id?: string
          initiator_name?: string | null
          initiator_password?: string | null
          is_active?: boolean | null
          name: string
          originator_conversation_id?: string | null
          party_a: string
          party_b: string
          passkey: string
          queue_timeout_url?: string | null
          result_url?: string | null
          security_credential?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Update: {
          app_id?: string
          app_secret?: string
          bearer_token?: string | null
          business_short_code?: string
          callback_url?: string | null
          command_id?: string | null
          consumer_key?: string
          consumer_secret?: string
          created_at?: string | null
          environment?: string
          id?: string
          initiator_name?: string | null
          initiator_password?: string | null
          is_active?: boolean | null
          name?: string
          originator_conversation_id?: string | null
          party_a?: string
          party_b?: string
          passkey?: string
          queue_timeout_url?: string | null
          result_url?: string | null
          security_credential?: string | null
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      b2c_transactions: {
        Row: {
          amount: number
          app_id: string | null
          command_id: string
          conversation_id: string | null
          created_at: string | null
          id: string
          initiator_name: string
          occasion: string | null
          originator_conversation_id: string
          party_a: string
          party_b: string
          raw_callback: Json | null
          remarks: string | null
          result_code: number | null
          result_desc: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          app_id?: string | null
          command_id: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_name: string
          occasion?: string | null
          originator_conversation_id: string
          party_a: string
          party_b: string
          raw_callback?: Json | null
          remarks?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          app_id?: string | null
          command_id?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          initiator_name?: string
          occasion?: string | null
          originator_conversation_id?: string
          party_a?: string
          party_b?: string
          raw_callback?: Json | null
          remarks?: string | null
          result_code?: number | null
          result_desc?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          account_reference: string
          amount: number
          app_id: string
          application: string | null
          checkout_request_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          merchant_request_id: string | null
          mpesa_receipt_number: string | null
          narration: string | null
          party_a: string
          phone_number: string
          raw_callback: Json | null
          result_code: number | null
          result_desc: string | null
          status: string | null
          transaction_date: number | null
          transaction_desc: string
          updated_at: string | null
        }
        Insert: {
          account_reference?: string
          amount: number
          app_id: string
          application?: string | null
          checkout_request_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          narration?: string | null
          party_a: string
          phone_number: string
          raw_callback?: Json | null
          result_code?: number | null
          result_desc?: string | null
          status?: string | null
          transaction_date?: number | null
          transaction_desc?: string
          updated_at?: string | null
        }
        Update: {
          account_reference?: string
          amount?: number
          app_id?: string
          application?: string | null
          checkout_request_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          merchant_request_id?: string | null
          mpesa_receipt_number?: string | null
          narration?: string | null
          party_a?: string
          phone_number?: string
          raw_callback?: Json | null
          result_code?: number | null
          result_desc?: string | null
          status?: string | null
          transaction_date?: number | null
          transaction_desc?: string
          updated_at?: string | null
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
