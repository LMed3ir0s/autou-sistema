export class WelcomeAnalytics {
  static trackWelcomeStart() {
    console.log("🎉 [Analytics] WelcomeScreen - Usuário iniciou app");
  }

  static trackWelcomeDismiss() {
    console.log("👋 [Analytics] WelcomeScreen - Tela de boas-vindas fechada");
  }
}
