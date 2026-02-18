# 📜 Histórico de Mudanças (Changelog)

Todas as mudanças importantes do projeto estão documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/).

---

## [1.0.0] - 2026-01-XX (Versão Atual)

### ✨ Adicionado

- 🔐 **Criptografia AES-256-GCM** com PBKDF2 (100k iterações)
- 🔑 **Autenticação com senha**: Primeira vez cria senha, próximas vezes faz login
- ⏱️ **Auto-logout**: 15 minutos de inatividade
- 📱 **OCR via Tesseract.js**: Importação de faturas em PDF com reconhecimento automático
- 📊 **Gráficos e relatórios**: Visualização de despesas por categoria e período
- 💾 **Exportação**: PDF e CSV
- 🎨 **Interface responsive**: Funciona em desktop, tablet e mobile
- 📝 **Parcelamento**: Suporte para despesas em várias parcelas
- 🔄 **Ciclo de cartão**: Reconhecimento automático de data de fechamento
- 📄 **Documentação**: README, SECURITY.md, CONTRIBUTING.md

### 🔧 Alterado

- ✅ Convertidas funções para async/await
- ✅ Substitutos onclick por event listeners (addEventListener)
- ✅ Migração automática de dados não criptografados
- ✅ Menus de seleção agora com ícones

### 🐛 Corrigido

- ✅ Botão de cadastro congelava a interface
- ✅ Cálculo de vencimento com lógica de data de fechamento
- ✅ Exportação de despesas selecionadas via checkbox

### 🛡️ Segurança

- Dados criptografados antes de salvar no localStorage
- Senha não armazenada (apenas hash com salt)
- IV aleatório para cada criptografia (previne pattern matching)
- Headers de copyright + licença em todos os arquivos

### 📚 Documentação

- ✅ README.md com instruções de uso
- ✅ SECURITY.md com especificações técnicas
- ✅ CONTRIBUTING.md com diretrizes de contribuição
- ✅ Este CHANGELOG com histórico completo

---

## [0.9.0] - 2025-12-XX (Beta)

### ✨ Adicionado

- Formulário de cadastro de despesas
- Listagem e filtragem de despesas
- Exclusão de despesas individuais
- Cálculo automático de vencimento

### 🔧 Alterado

- Interface CSS com Bootstrap 4
- Validação de formulários

### 🐛 Corrigido

- Erros de validação

---

## [0.8.0] - 2025-11-XX (Protótipo Inicial)

### ✨ Adicionado

- Estrutura básica HTML/CSS/JS
- localStorage para persistência
- Listagem de despesas

---

## 🚀 Planejado (Próximas Versões)

### [1.1.0] - 2026-02-XX

- [ ] Backup automático para nuvem (criptografado)
- [ ] Sincronização entre dispositivos
- [ ] Importação de extrato bancário
- [ ] Alertas de limite de gastos
- [ ] Dark mode

### [1.2.0] - 2026-03-XX

- [ ] Aplicativo mobile (React Native)
- [ ] Dashboard com previsão de gastos
- [ ] Orçamento mensal vs. Gasto real
- [ ] Categorias personalizadas
- [ ] Recorrências automáticas

### [2.0.0] - 2026-06-XX

- [ ] Backend servidor (Node.js)
- [ ] Autenticação multi-factor
- [ ] Compartilhamento de orçamento familiar
- [ ] Integração com APIs bancárias
- [ ] Análise de gastos com IA

---

## 📋 Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/lang/pt-BR/):

- **MAJOR.MINOR.PATCH** (Ex: 1.0.0)
- **MAJOR**: Mudanças incompatíveis
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

---

## 📌 Notas Importantes

### Criptografia (v1.0.0)

- Algoritmo: AES-256-GCM (128-bit authentication tag)
- Key derivation: PBKDF2-SHA256 (100.000 iterações)
- IV: 12 bytes aleatórios por criptografia
- Dados armazenados: [IV + Ciphertext + AuthTag] em base64

### Compatibilidade

- ✅ Chrome 60+
- ✅ Firefox 57+
- ✅ Safari 11+
- ✅ Edge 79+
- ⚠️ IE 11: Não suportado (sem Web Crypto API)

### Performance

- Criptografia: ~50-100ms por operação
- Carregamento: ~200ms em conexão 3G
- Memória: ~5-10MB dependendo de dados

---

## 🙏 Contribuidores

- **Criador**: Paes_Tech
- **Agradecimentos especiais**: Comunidade open-source

---

## 📞 Contato e Suporte

- **Issues**: GitHub Issues
- **Email**: seu_email@exemplo.com
- **Chat**: Discord (link privado)

---

Última atualização: 2026-01-XX
