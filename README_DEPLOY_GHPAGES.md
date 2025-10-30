Deploy temporário no GitHub Pages

Pré‑requisitos
- Conta no GitHub e Git configurado (git --version)

Passo a passo
1) Inicialize o repositório (se ainda não for um repo Git):
   git init
   git add .
   git commit -m "init: ludikids pwa"
   git branch -M main

2) Crie um repositório vazio no GitHub (via web) e copie a URL.

3) Aponte o remoto e envie:
   git remote add origin https://github.com/<usuario>/<repositorio>.git
   git push -u origin main

O que já está pronto neste projeto
- Workflow em .github/workflows/deploy.yml que:
  - Faz build com Node 20
  - Publica automaticamente o conteúdo de dist no GitHub Pages
- Vite configurado com base dinâmica para subpasta do Pages
  (usa GITHUB_REPOSITORY; também respeita VITE_BASE_PATH se quiser forçar)
- BrowserRouter com basename={import.meta.env.BASE_URL}
- PWA com start_url e scope relativos (.)

Após o push
- Vá em Settings → Pages do repositório e verifique a publicação
- A URL ficará no formato: https://<usuario>.github.io/<repositorio>/

Variáveis opcionais
- Se quiser forçar um base específico:
  echo VITE_BASE_PATH=/minha-base/ > .env

Observações
- Chat em tempo real (WebSocket) exige um servidor público; o Pages é apenas estático.

Painel administrativo
- As credenciais padrão são:
  - Usuário: `administrativo@ludikids.com`
  - Senha: `Jv22019198@`
- Depois de fazer login, acesse `https://<usuario>.github.io/<repositorio>/admin` para abrir o painel.

