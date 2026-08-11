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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      conect_logs: {
        Row: {
          id: number
          latencia_ms: number | null
          pivo_id: string | null
          status_conexao: boolean
          timestamp: string | null
        }
        Insert: {
          id?: number
          latencia_ms?: number | null
          pivo_id?: string | null
          status_conexao: boolean
          timestamp?: string | null
        }
        Update: {
          id?: number
          latencia_ms?: number | null
          pivo_id?: string | null
          status_conexao?: boolean
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conect_logs_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conect_logs_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
        ]
      }
      cronograma_passos: {
        Row: {
          angulo_final: number
          angulo_inicial: number
          created_at: string | null
          cronograma_id: string
          direcao: string
          id: string
          irrigacao: boolean
          lamina: number
          nome: string
          ordem: number
          pivo_id: string
          preset_origem_id: string | null
          status_passo: Database["public"]["Enums"]["status_execucao"] | null
        }
        Insert: {
          angulo_final: number
          angulo_inicial: number
          created_at?: string | null
          cronograma_id: string
          direcao: string
          id?: string
          irrigacao?: boolean
          lamina: number
          nome: string
          ordem?: number
          pivo_id: string
          preset_origem_id?: string | null
          status_passo?: Database["public"]["Enums"]["status_execucao"] | null
        }
        Update: {
          angulo_final?: number
          angulo_inicial?: number
          created_at?: string | null
          cronograma_id?: string
          direcao?: string
          id?: string
          irrigacao?: boolean
          lamina?: number
          nome?: string
          ordem?: number
          pivo_id?: string
          preset_origem_id?: string | null
          status_passo?: Database["public"]["Enums"]["status_execucao"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cronograma_passos_cronograma_id_fkey"
            columns: ["cronograma_id"]
            isOneToOne: false
            referencedRelation: "cronogramas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cronograma_passos_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cronograma_passos_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cronograma_passos_preset_origem_id_fkey"
            columns: ["preset_origem_id"]
            isOneToOne: false
            referencedRelation: "presets"
            referencedColumns: ["id"]
          },
        ]
      }
      cronogramas: {
        Row: {
          created_at: string | null
          criado_por: string
          horario_inicio: string
          id: string
          is_ativo: boolean | null
          nome: string
          pivo_id: string
          status_final: Database["public"]["Enums"]["status_execucao"] | null
        }
        Insert: {
          created_at?: string | null
          criado_por: string
          horario_inicio: string
          id?: string
          is_ativo?: boolean | null
          nome: string
          pivo_id: string
          status_final?: Database["public"]["Enums"]["status_execucao"] | null
        }
        Update: {
          created_at?: string | null
          criado_por?: string
          horario_inicio?: string
          id?: string
          is_ativo?: boolean | null
          nome?: string
          pivo_id?: string
          status_final?: Database["public"]["Enums"]["status_execucao"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cronogramas_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cronogramas_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cronogramas_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          codigo: string | null
          cronograma_id: string | null
          cronograma_passo_id: string | null
          id: string
          operador_id: string | null
          pivo_id: string | null
          timestamp: string | null
          tipo_evento: string
        }
        Insert: {
          codigo?: string | null
          cronograma_id?: string | null
          cronograma_passo_id?: string | null
          id?: string
          operador_id?: string | null
          pivo_id?: string | null
          timestamp?: string | null
          tipo_evento: string
        }
        Update: {
          codigo?: string | null
          cronograma_id?: string | null
          cronograma_passo_id?: string | null
          id?: string
          operador_id?: string | null
          pivo_id?: string | null
          timestamp?: string | null
          tipo_evento?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_cronograma_passo_id_fkey"
            columns: ["cronograma_passo_id"]
            isOneToOne: false
            referencedRelation: "cronograma_passos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logs_operador_id_fkey"
            columns: ["operador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logs_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_logs_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
        ]
      }
      fazendas: {
        Row: {
          area_total: number | null
          cidade: string | null
          codigo_identificacao: string
          coordenadas: unknown
          cultura: string[] | null
          endereco: string | null
          estado: string | null
          id: string
          nome_fazenda: string
          proprietario_id: string | null
        }
        Insert: {
          area_total?: number | null
          cidade?: string | null
          codigo_identificacao: string
          coordenadas?: unknown
          cultura?: string[] | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_fazenda: string
          proprietario_id?: string | null
        }
        Update: {
          area_total?: number | null
          cidade?: string | null
          codigo_identificacao?: string
          coordenadas?: unknown
          cultura?: string[] | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome_fazenda?: string
          proprietario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fazendas_proprietario_id_fkey"
            columns: ["proprietario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pivo_operadores: {
        Row: {
          pivo_id: string
          usuario_id: string
        }
        Insert: {
          pivo_id: string
          usuario_id: string
        }
        Update: {
          pivo_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pivo_operadores_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pivo_operadores_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pivo_operadores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pivo_status: {
        Row: {
          angulo_atual: number | null
          direcao_atual: string | null
          lamina_atual: number | null
          pivo_id: string
          pressao: number | null
          sinal_rede: number | null
          status_operacional: string | null
          tensao: number | null
          ultima_atualizacao: string | null
        }
        Insert: {
          angulo_atual?: number | null
          direcao_atual?: string | null
          lamina_atual?: number | null
          pivo_id: string
          pressao?: number | null
          sinal_rede?: number | null
          status_operacional?: string | null
          tensao?: number | null
          ultima_atualizacao?: string | null
        }
        Update: {
          angulo_atual?: number | null
          direcao_atual?: string | null
          lamina_atual?: number | null
          pivo_id?: string
          pressao?: number | null
          sinal_rede?: number | null
          status_operacional?: string | null
          tensao?: number | null
          ultima_atualizacao?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pivo_status_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: true
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pivo_status_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: true
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
        ]
      }
      pivos: {
        Row: {
          codigo_serie: string
          coordenadas: unknown
          delta_device_id: string | null
          fazenda_id: string | null
          id: string
          marca: string | null
          modelo: string | null
          nome_pivo: string
          raio: number | null
          vazao: number | null
        }
        Insert: {
          codigo_serie: string
          coordenadas?: unknown
          delta_device_id?: string | null
          fazenda_id?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome_pivo: string
          raio?: number | null
          vazao?: number | null
        }
        Update: {
          codigo_serie?: string
          coordenadas?: unknown
          delta_device_id?: string | null
          fazenda_id?: string | null
          id?: string
          marca?: string | null
          modelo?: string | null
          nome_pivo?: string
          raio?: number | null
          vazao?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pivos_fazenda_id_fkey"
            columns: ["fazenda_id"]
            isOneToOne: false
            referencedRelation: "fazendas"
            referencedColumns: ["id"]
          },
        ]
      }
      presets: {
        Row: {
          angulo_final: number
          angulo_inicial: number
          created_at: string | null
          criado_por: string
          direcao: string
          id: string
          irrigacao: boolean
          lamina: number
          nome: string
          pivo_id: string
        }
        Insert: {
          angulo_final: number
          angulo_inicial: number
          created_at?: string | null
          criado_por: string
          direcao: string
          id?: string
          irrigacao?: boolean
          lamina: number
          nome: string
          pivo_id: string
        }
        Update: {
          angulo_final?: number
          angulo_inicial?: number
          created_at?: string | null
          criado_por?: string
          direcao?: string
          id?: string
          irrigacao?: boolean
          lamina?: number
          nome?: string
          pivo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "presets_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presets_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "pivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "presets_pivo_id_fkey"
            columns: ["pivo_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_pivos"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          cargo: Database["public"]["Enums"]["cargo_enum"]
          cpf_cnpj: string
          created_at: string | null
          email: string
          id: string
          nome: string
          senha_token: string
          telefone: string | null
        }
        Insert: {
          cargo: Database["public"]["Enums"]["cargo_enum"]
          cpf_cnpj: string
          created_at?: string | null
          email: string
          id?: string
          nome: string
          senha_token: string
          telefone?: string | null
        }
        Update: {
          cargo?: Database["public"]["Enums"]["cargo_enum"]
          cpf_cnpj?: string
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          senha_token?: string
          telefone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      vw_dashboard_pivos: {
        Row: {
          angulo_atual: number | null
          angulo_final: number | null
          angulo_inicio: number | null
          codigo_serie: string | null
          direcao_atual: string | null
          fazenda_id: string | null
          id: string | null
          lamina: number | null
          lamina_atual: number | null
          marca: string | null
          modelo: string | null
          nome_pivo: string | null
          pressao: number | null
          status_operacional: string | null
          tensao: number | null
          ultima_atualizacao: string | null
          water_on: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pivos_fazenda_id_fkey"
            columns: ["fazenda_id"]
            isOneToOne: false
            referencedRelation: "fazendas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      cargo_enum: "Administrador" | "Operador" | "Cliente"
      status_cronograma_enum:
        | "aguardando"
        | "executando"
        | "concluido"
        | "falha"
        | "cancelado"
        | "interrompido"
      status_execucao:
        | "aguardando"
        | "executando"
        | "concluido"
        | "falha"
        | "cancelado"
        | "interrompido"
      tipo_evento_enum:
        | "comando"
        | "sensor"
        | "pausa_manual"
        | "pausa_automatica"
        | "erro"
        | "alerta"
        | "conclusao"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cargo_enum: ["Administrador", "Operador", "Cliente"],
      status_cronograma_enum: [
        "aguardando",
        "executando",
        "concluido",
        "falha",
        "cancelado",
        "interrompido",
      ],
      status_execucao: [
        "aguardando",
        "executando",
        "concluido",
        "falha",
        "cancelado",
        "interrompido",
      ],
      tipo_evento_enum: [
        "comando",
        "sensor",
        "pausa_manual",
        "pausa_automatica",
        "erro",
        "alerta",
        "conclusao",
      ],
    },
  },
} as const
