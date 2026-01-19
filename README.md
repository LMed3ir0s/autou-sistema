# 📧 AutoU-sistema

Sistema desenvolvido para automatizar a classificação entre Produtivo e Improdutivo e gerar respostas automáticas de acordo com o teor de cada e-mail recebido.

`Fluxo: Frontend → API → OpenAI → API → Frontend.`

---

### Stack :

- Backend :
    - Python + FastAPI
    - Endpoint: `POST /api/v1/email/classify`
    - Integração com OpenAI (classificação + resposta)
        
- Frontend :
    - React + TypeScript (Vite)
    - TailwindCSS + shadcn/ui

---

### Execução local :

1) Backend

Abra um terminal na pasta `backend/` ative a .venv e após instalar as dependências :



```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

2) Frontend

Abra outro terminal na pasta frontend/ :
```bash
npm install
npm run dev
```

3) Abra no navegador (porta padrão do Vite):

```bash
http://localhost:5173
```

4) E-mail exemplo para uso do campo de texto:

```bash Exemplo de e-mail (produtivo)
Assunto: Reunião de alinhamento do projeto

Olá, equipe.

Precisamos agendar uma reunião rápida (30 minutos) para alinhar as próximas entregas do projeto AutoU. Por favor, confirmem disponibilidade amanhã entre 14:00 e 16:00.

Pontos:

Revisar pendências do sprint atual.

Definir prioridades da próxima semana.

Identificar bloqueios (infra, acesso, API).

Obrigado.
```

---

### Endpoints :

API : http://127.0.0.1:8000

Swagger : http://127.0.0.1:8000/docs

Classificação (POST): http://127.0.0.1:8000/api/v1/email/classify

Frontend : http://localhost:5173
