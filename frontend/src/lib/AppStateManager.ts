export class AppStateManager {
  private _showWelcome = true;

  get showWelcome() { return this._showWelcome; }

  startApp() {
    console.log("🚀 [AppState] Iniciando aplicação principal");
    this._showWelcome = false;
  }

  resetToWelcome() {
    console.log("🔄 [AppState] Resetando para tela de boas-vindas");
    this._showWelcome = true;
  }
}
