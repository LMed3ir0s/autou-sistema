export interface ClassificationResult {
  category: string;           // "produtivo" | "improdutivo" (backend DTO)
  confidence: number;         // 0.0 - 1.0
  suggested_reply: string;    // Resposta IA
  model_name: string;         // "gpt-4o-mini"
  audit_log?: string;         // Opcional log
}

export interface ClassifyRequest {
  email_content: string;      // Para JSON POST
  text?: string;              // FormData
  file?: File;                // Upload
}
