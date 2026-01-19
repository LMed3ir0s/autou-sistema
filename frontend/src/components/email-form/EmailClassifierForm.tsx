import { useState, useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClassifyEmail } from "@/hooks/useClassifyEmail";

export function EmailClassifierForm() {
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { classify, loading, error, result, clear } = useClassifyEmail();

  const hasText = emailText.trim().length > 0;
  const hasFile = Boolean(file);

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      clear();
      setEmailText(value);

      // se digitou texto, remove arquivo
      if (value.trim().length > 0 && file) {
        setFile(null);
        resetFileInput();
      }
    },
    [file, resetFileInput, clear]
  );

  const handleFileUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] ?? null;
      clear();
      setFile(selectedFile);

      // se escolheu arquivo, limpa texto
      if (selectedFile) setEmailText("");
    },
    [clear]
  );

  const handleClassify = useCallback(async () => {
    if (loading) return;

    if (hasText) {
      await classify(emailText);
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      await classify(formData);
    }
  }, [loading, hasText, emailText, file, classify]);

  const handleClear = useCallback(() => {
    setEmailText("");
    setFile(null);
    resetFileInput();
    clear();
  }, [clear, resetFileInput]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="overflow-hidden shadow-xl ring-1 ring-border/50">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 p-10 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <CardTitle className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-foreground via-primary to-destructive bg-clip-text text-transparent drop-shadow-lg">
                Classificador IA
              </CardTitle>
            </div>
            <CardDescription className="text-xl lg:text-2xl max-w-2xl mx-auto opacity-90 leading-relaxed">
              Envie um texto ou um arquivo (TXT/PDF) para classificação.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="overflow-hidden shadow-2xl ring-2 ring-ring/20">
          <CardHeader className="bg-gradient-to-r from-muted/30 via-accent/20 to-primary/10 px-10 py-10">
            <CardTitle className="text-2xl lg:text-3xl font-bold text-foreground">
              📝 Inserir Conteúdo
            </CardTitle>
          </CardHeader>

          <CardContent className="p-10 pb-12 space-y-8">
            <div className="space-y-3">
              <Label htmlFor="email-text" className="text-xl font-semibold tracking-tight">
                Texto do E-mail
              </Label>

              <Textarea
                id="email-text"
                value={emailText}
                onChange={handleTextChange}
                placeholder="Cole aqui o conteúdo completo do e-mail..."
                className="min-h-[240px] resize-none font-mono text-base leading-relaxed p-6 ring-2 ring-border/50 focus-visible:ring-accent focus-visible:ring-offset-2 transition-all duration-200"
                rows={10}
                disabled={loading || hasFile}
              />

              {hasFile && (
                <p className="text-sm text-muted-foreground">
                  Texto desabilitado porque um arquivo foi selecionado.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Label className="text-xl font-semibold tracking-tight flex-1">
                  📎 Upload Arquivo
                </Label>
                <span className="text-sm text-muted-foreground">PDF ou TXT</span>
              </div>

              <Input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                disabled={loading || hasText}
              />

              {hasText && (
                <p className="text-sm text-muted-foreground">
                  Upload desabilitado porque existe texto preenchido.
                </p>
              )}

              {file && (
                <Badge variant="secondary" className="w-fit">
                  {file.name}
                </Badge>
              )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4 pt-2">
              <Button
                onClick={handleClassify}
                disabled={loading || (!hasText && !hasFile)}
                size="lg"
                className="h-16 text-xl font-bold flex-1"
              >
                {loading ? "Analisando..." : "🚀 Classificar"}
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={handleClear}
                className="h-16 px-10 text-lg border-2 font-semibold"
                disabled={loading}
              >
                🔄 Limpar Tudo
              </Button>
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="pt-10 border-t border-border/50 space-y-6">
                <Label className="text-2xl font-black tracking-tight block">
                  📊 Classificação Final
                </Label>

                <Card className="overflow-hidden shadow-2xl transition-all duration-500">
                  <CardContent className="p-8 bg-gradient-to-br from-accent/10 via-destructive/5 to-primary/10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl">
                          <span className="text-4xl">
                            {result.category?.toLowerCase() === "produtivo" ? "✅" : "❌"}
                          </span>
                        </div>

                        <div>
                          <Badge
                            variant={result.category?.toLowerCase() === "produtivo" ? "default" : "destructive"}
                            className="text-3xl px-8 py-4 font-bold tracking-wider shadow-2xl border-4"
                          >
                            {result.category?.toUpperCase()}
                          </Badge>

                          <p className="text-2xl font-black mt-2">
                            {(result.confidence ?? 0) >= 0.9 ? "Confiança Alta" : "Confiança Média"}
                          </p>

                          <p className="text-sm text-muted-foreground font-mono mt-1">
                            {((result.confidence ?? 0) * 100).toFixed(1)}% | {result.model_name ?? "N/A"}
                          </p>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="h-14 px-8 font-bold shadow-xl hover:shadow-2xl"
                        onClick={() => navigator.clipboard.writeText(result.audit_log ?? "")}
                        disabled={!result.audit_log}
                      >
                        📋 Copiar Log
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {result.suggested_reply && (
                  <Card className="shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        💬 Resposta Sugerida
                        <Badge variant="secondary" className="text-xs px-3 py-1">
                          Auto-gerada por IA
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="p-8 bg-gradient-to-r from-muted/20 to-accent/20 rounded-b-2xl">
                        <p className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                          {result.suggested_reply}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center pt-20 pb-12">
          <div className="text-muted-foreground/80 text-sm max-w-md mx-auto">
            <p>Desenvolvido por Lucas Medeiros</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
