# 📧 AutoU-sistema

Sistema desenvolvido para automatizar a classificação entre Produtivo e Improdutivo e gerar respostas automáticas de acordo com o teor de cada e-mail recebido.

`Fluxo: Frontend → API → OpenAI → API → Frontend.`

---

### Stack :

- Backend :
    - Python + FastAPI com um único endpoint **`POST /classify`**.
    - Cliente oficial OpenAI API fazendo:
        - Classificação: Produtivo vs Improdutivo.
        - Geração de resposta automática.
- Frontend :
    - React + TypeScript.
    - TailwindCSS + shadcn