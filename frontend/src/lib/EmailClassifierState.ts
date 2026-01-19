import type { ClassificationResult } from "../types/email";

export class EmailClassifierState {
  private _loading = false;
  private _error: string | null = null;
  private _result: ClassificationResult | null = null;

  get loading() { return this._loading; }
  get error() { return this._error; }
  get result() { return this._result; }

  startLoading() {
    this._loading = true;
    this._error = null;
    this._result = null;
    console.log("[EmailClassifier] Iniciando classificação...");
  }

  setSuccess(result: ClassificationResult) {
    this._loading = false;
    this._result = result;
    this._error = null;
    console.log("[EmailClassifier] Classificação concluída:", result.category);
  }

  setRateLimitExceeded() {
    this._loading = false;
    this._error = "Limite de requisições atingido (1/min, 10/hora). Aguarde...";
    console.warn("[EmailClassifier] Rate limit excedido (429)");
  }

  setGenericError() {
    this._loading = false;
    this._error = "Erro ao classificar e-mail. Tente novamente.";
    console.error("[EmailClassifier] Erro genérico na classificação");
  }

  clear() {
    this._loading = false;
    this._error = null;
    this._result = null;
  }
}
