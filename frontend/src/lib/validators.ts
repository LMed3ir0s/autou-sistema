export class EmailFormValidator {
  static isValid(formData: FormData): boolean {
    const hasText = formData.get("text")?.toString().trim().length! > 0;
    const hasFile = formData.get("file") instanceof File;
    return hasText || hasFile;
  }

  static getValidationError(formData: FormData): string | null {
    if (!this.isValid(formData)) {
      return "Digite um texto ou selecione um arquivo (.pdf/.txt)";
    }
    return null;
  }
}
