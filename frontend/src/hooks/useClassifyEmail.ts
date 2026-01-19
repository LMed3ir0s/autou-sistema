// src/hooks/useClassifyEmail.ts
import { useState, useCallback } from "react";
import { classifyEmail } from "@/lib/api";
import type { ClassificationResult } from "@/types/email";

type ClassifyInput = string | FormData;

function isFormData(v: unknown): v is FormData {
  return typeof FormData !== "undefined" && v instanceof FormData;
}

export const useClassifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const clear = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  const classify = useCallback(async (input: ClassifyInput): Promise<void> => {
    setError(null);
    setResult(null);

    if (isFormData(input)) {
      const hasFile = input.get("file") instanceof File;
      const text = input.get("text");
      const hasText = typeof text === "string" && text.trim().length > 0;

      if (!hasFile && !hasText) {
        setError("Envie um arquivo (PDF/TXT) ou preencha o texto.");
        return;
      }
    } else {
      if (!input.trim()) {
        setError("Preencha o texto do e-mail.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await classifyEmail(input);
      setResult(response.data);
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setError("Limite de requisições atingido (1/min, 10/hora). Aguarde...");
      } else {
        setError("Erro ao classificar e-mail. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { classify, loading, error, result, clear };
};
