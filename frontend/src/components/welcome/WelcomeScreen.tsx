import { useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WelcomeAnalytics } from "@/lib/analytics";

interface WelcomeScreenProps {
  onStart: () => void;
}

const BACKGROUND_GRADIENT = "min-h-screen bg-gradient-to-b from-slate-900 via-slate-900/50 to-slate-950 flex items-center justify-center p-4";

const CARD_STYLES = "max-w-md w-full p-6 space-y-4 bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 shadow-2xl";

export const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  const handleStart = useCallback(() => {
    WelcomeAnalytics.trackWelcomeStart();
    onStart();
  }, [onStart]);

  return (
    <div className={BACKGROUND_GRADIENT}>
      <Card className={CARD_STYLES}>
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
            AutoU
          </CardTitle>
          <CardDescription className="text-lg text-slate-300 leading-relaxed">
            Classifique e-mails e gere respostas automáticas com IA avançada
          </CardDescription>
          <p className="text-xs text-slate-500">
            Limite seguro: 1/min • 10/hora
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          <Button
            ref={buttonRef}
            className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 group"
            onClick={handleStart}
            aria-label="Iniciar AutoU Email Classifier"
          >
            <span className="group-hover:translate-x-1 transition-transform duration-300">
              🚀 Começar
            </span>
          </Button>
        </CardContent>

        <div className="text-center text-xs text-slate-500 pt-4">
          AutoU Email Classifier • {new Date().getFullYear()}
        </div>
      </Card>
    </div>
  );
};
