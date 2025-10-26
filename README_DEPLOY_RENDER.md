Deploy gratuito do servidor de chat (Render)

1) Publique o código no GitHub (vide README_DEPLOY_GHPAGES.md)
2) Abra https://render.com → New + → Blueprint
3) Selecione o repositório e confirme o deploy com este arquivo render.yaml
   - Service: ludikids-chat (plan: Free)
   - Render define a URL pública: https://ludikids-chat-XXXX.onrender.com

4) Copie a URL pública e crie um secret no seu repositório GitHub:
   - Settings → Secrets → Actions → New repository secret
   - Name: VITE_WS_URL
   - Value: wss://ludikids-chat-XXXX.onrender.com

5) Faça um push (ou re‑execute o workflow Pages) para rebuildar o PWA.
   - O app (GitHub Pages) passará a usar o WebSocket externo.

Observações
- O Pages hospeda apenas front estático; o chat precisa de um backend (Render free é suficiente para testes).
- Se quiser restringir origens, no Render configure WS_ORIGINS com a URL do seu Pages (ex: https://usuario.github.io/repositorio).
- ADMIN_KEY é gerada automaticamente no Render (pode definir manualmente também).

