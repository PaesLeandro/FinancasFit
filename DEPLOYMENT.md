# 🚀 Guia de Deployment

Este documento descreve como desploiar o Orçamento Pessoal em diferentes plataformas.

---

## 📋 Pré-requisitos

- Navegador moderno (Chrome 60+, Firefox 57+, Safari 11+, Edge 79+)
- HTTPS obrigatório (Web Crypto API requer contexto seguro)
- Sem dependências externas (backend-free)

---

## 🏠 Deployment Local (Desenvolvimento)

### Opção 1: Abrir diretamente (NÃO RECOMENDADO)

```bash
# Não funciona - apenas abrir o arquivo HTML
# Erro: "Web Crypto API requer HTTPS ou localhost"
```

### Opção 2: Python HTTP Server ✅

```bash
cd c:\Users\lmp-8\Downloads\orcamento-pessoal-atualizado

# Python 3:
python -m http.server 8000

# Acesse: http://localhost:8000/index.html
```

### Opção 3: Node.js http-server ✅

```bash
npm install -g http-server
http-server

# Acesse: http://localhost:8080
```

### Opção 4: VSCode Live Server ✅

1. Instale extensão "Live Server"
2. Clique direito em `index.html`
3. Selecione "Open with Live Server"
4. Navegador abrirá automaticamente

---

## ☁️ Deployment Cloud (Produção)

### 📦 Opção 1: GitHub Pages (RECOMENDADO - Gratuito)

**Passo 1**: Crie repositório público

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/orcamento-pessoal.git
git branch -M main
git push -u origin main
```

**Passo 2**: Configure GitHub Pages

1. Vá para Settings > Pages
2. Source: `main` branch
3. Folder: `/ (root)`
4. Clique "Save"

**Passo 3**: Ative HTTPS

1. Aguarde ~5 minutos
2. Marque "Enforce HTTPS"

**URL**: `https://seu-usuario.github.io/orcamento-pessoal/`

**Vantagens**:

- ✅ Gratuito
- ✅ HTTPS automático
- ✅ Sem backend necessário
- ✅ Controle de versão integrado

**Desvantagens**:

- ❌ Repositório público (proteja dados sensíveis!)
- ❌ Limite 1GB de storage

---

### 📦 Opção 2: Netlify (Gratuito - Fácil)

**Passo 1**: Envie ao GitHub
(Mesmos passos que GitHub Pages)

**Passo 2**: Configure no Netlify

1. Acesse https://netlify.com
2. Clique "New site from Git"
3. Selecione repositório GitHub
4. Deploy key: Deixe vazio (root)
5. Clique "Deploy"

**URL**: `https://seu-projeto.netlify.app/`

**Vantagens**:

- ✅ HTTPS automático
- ✅ Melhor performance (CDN global)
- ✅ Preview automático de branches

---

### 📦 Opção 3: Vercel (Gratuito)

**Passo 1**: Conecte GitHub

1. Vá para https://vercel.com
2. Clique "New Project"
3. Selecione repositório GitHub

**Passo 2**: Configure

- Framework: "Other" (Static)
- Root directory: `./`
- Deploy!

**URL**: `https://seu-projeto.vercel.app/`

---

### 📦 Opção 4: Servidor Próprio (VPS)

**Com Nginx:**

```bash
# 1. Copie arquivos para servidor
scp -r ./* root@seu-servidor:/var/www/orcamento/

# 2. Configure Nginx
sudo nano /etc/nginx/sites-available/orcamento

# Conteúdo:
server {
    listen 443 ssl http2;
    server_name seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    root /var/www/orcamento;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    # Headers de segurança
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# 3. Ative site
sudo ln -s /etc/nginx/sites-available/orcamento /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. HTTPS com Let's Encrypt
sudo certbot certonly --webroot -w /var/www/orcamento -d seu-dominio.com
```

---

## 🔐 Checklist de Segurança Produção

- ✅ **HTTPS obrigatório**: Certificado SSL válido
- ✅ **Headers de segurança**:
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  ```
- ✅ **CSP (Content Security Policy)**:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  ```
- ✅ **Sem DADOS CONFIDENCIAIS em git**: Use `.gitignore`
- ✅ **.env não criptografado**: Nunca commitar credenciais
- ✅ **Backups regulares**: localStorage é local-only
- ✅ **Monitoramento**: Configure alertas se deploy quebrar

---

## 🔂 CI/CD Pipeline (GitHub Actions)

Crie `.github/workflows/test.yml`:

```yaml
name: Test & Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Validar HTML
        run: npm install -g html-validate && html-validate *.html

      - name: Validar CSS
        run: npm install -g stylelint && stylelint css/*.css

      - name: Validar JavaScript
        run: npm install -g eslint && eslint app.js --max-warnings=0

      - name: Deploy to GitHub Pages
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## 🔍 Teste Pós-Deploy

### 1. Verificar Carregamento

```bash
curl -H "User-Agent: Mozilla/5.0" https://seu-dominio.com
# Deve retornar HTML sem erros
```

### 2. Verificar HTTPS

```bash
curl -I https://seu-dominio.com
# Deve ter Status: 200
# Headers: Strict-Transport-Security, X-Content-Type-Options
```

### 3. Verificar Web Crypto API

- Abra DevTools (F12)
- Console: `crypto.subtle` deve existir
- Teste: Navegue para index.html → modal de senha deve aparecer

### 4. Verificar Performance

- Lighthouse (Chrome DevTools > Lighthouse)
- Target: Performance > 90, Security > 95

### 5. Teste Funcional

- [ ] Senha modal aparece
- [ ] Criar senha funciona
- [ ] Dados persitem após reload
- [ ] Logout após 15 min inativo
- [ ] Exportação PDF/CSV funciona

---

## 📊 Monitoramento Produção

### Google Analytics

```html
<!-- Adicione em index.html e consulta.html antes de </body> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_ID");
</script>
```

### Sentry (Rastreamento de Erros)

```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
    tracesSampleRate: 0.1,
  });
</script>
```

---

## 🚨 Troubleshooting

### "Web Crypto API não disponível"

- ✅ Use HTTPS (não HTTP)
- ✅ Use navegador moderno
- ✅ Ative JavaScript

### "Modal de senha não aparece"

- ✅ Verifique console (F12) para erros
- ✅ Confirme que app.js foi carregado
- ✅ Limpe cache (Ctrl+F5)

### "Dados desaparecem após reload"

- ✅ localStorage pode estar desabilitado
- ✅ Verifique espaço disponível (5MB limite)
- ✅ Teste em modo "Navegação Privada" para comparar

### "Exportação PDF não funciona"

- ✅ Desabilite popup blockers
- ✅ Verifique se jsPDF carregou (inspect jsPDF global)
- ✅ Teste com dados menores primeiro

---

## 📈 Performance Optimization

### Cache Strategy

```javascript
// Adicione em app.js para cache de versão
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
```

### Lazy Loading

```html
<!-- Carregue PDF.js e Tesseract.js sob demanda -->
<script>
  document.getElementById("importPDF").addEventListener("click", () => {
    if (!window.pdfjsLib) {
      loadScript("https://cdn.example.com/pdf.min.js");
    }
  });
</script>
```

---

## ✅ Checklist Final

- [ ] HTTPS funcionando
- [ ] Modal de senha aparece
- [ ] Dados criptografados no localStorage
- [ ] Botões respondem sem congelar
- [ ] Exportação PDF/CSV funciona
- [ ] Mobile responsivo
- [ ] Lighthouse score > 90
- [ ] Sem erros em console (F12)
- [ ] Backup local configurado
- [ ] Monitoramento ativo

---

**Sucesso no deployment! 🎉**

Para dúvidas: seu_email@exemplo.com
