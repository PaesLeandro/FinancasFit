# 💰 Orçamento Pessoal - Sistema de Controle Financeiro

## ✨ Melhorias Implementadas

### 1. 💳 Gerenciamento de Cartões Aprimorado
- ✅ **Modal de Gerenciamento Completo**: Novo modal "Gerenciar Cartões" com interface intuitiva
- ✅ **Editar Cartões**: Botão "Editar" para alterar nome, bandeira, vencimento e fechamento
- ✅ **Excluir Cartões**: Botão "Excluir" com confirmação de segurança
- ✅ **Lista Visual**: Cards organizados com informações completas de cada cartão
- ✅ **Design Responsivo**: Layout adaptável para dispositivos móveis

### 2. 🎨 Cor do Rodapé no Modo Normal
- ✅ **Visibilidade Melhorada**: Rodapé com fundo semi-transparente e blur
- ✅ **Contraste Adequado**: Texto escuro (#2d3748) sobre fundo claro
- ✅ **Efeito Glassmorphism**: Visual moderno com backdrop-filter
- ✅ **Modo Dark**: Cores adaptadas automaticamente

### 3. 📏 Altura dos Campos Responsivos
- ✅ **Altura Mínima**: 42px em todos os inputs e selects
- ✅ **Line-height**: 1.6 para melhor legibilidade
- ✅ **Padding Ajustado**: 0.65rem vertical para texto completo visível
- ✅ **Sem Corte de Texto**: Palavras não são mais cortadas pela metade
- ✅ **Font-size 16px no Mobile**: Evita zoom automático no iOS

### 4. 📱 Responsividade Completa
#### Desktop (>992px)
- Layout em 2 colunas
- Cards com efeitos hover
- Gráficos em tamanho otimizado

#### Tablet (768px - 992px)
- Layout adaptativo
- Botões redimensionados
- Espaçamento otimizado

#### Mobile (<768px)
- Layout vertical (1 coluna)
- Cards de cartões em coluna
- Botões de ação em linha completa
- Tabelas com scroll horizontal
- Footer compacto

#### Mobile Pequeno (<576px)
- Títulos reduzidos
- Fonte 16px para evitar zoom
- Botões menores mas ainda clicáveis
- Padding reduzido mantendo usabilidade

## 🚀 Funcionalidades Principais

### Gestão de Cartões
- Cadastro com nome, bandeira, vencimento e fechamento
- Edição completa de cartões existentes
- Exclusão com confirmação
- Lista visual organizada

### Lançamento de Despesas
- Cadastro com data, categoria, descrição e valor
- Suporte a compras parceladas (até 48x)
- Vinculação com cartões de crédito
- Cálculo automático de vencimento

### Consulta e Relatórios
- Filtros por ano, mês, categoria e descrição
- Exportação em PDF agrupado por cartão
- Gráfico de distribuição por categoria
- Resumo com totais

### Visual e UX
- Tema claro/escuro com botão toggle
- Animações suaves
- Mensagens de feedback
- Desfazer exclusão de despesas

## 📦 Estrutura de Arquivos

```
orcamento-pessoal/
├── index.html          # Página principal (cadastro)
├── consulta.html       # Página de consulta
├── app.js             # Lógica JavaScript
└── css/
    └── custom.css     # Estilos personalizados
```

## 🔧 Como Usar

1. **Configuração Inicial**
   - Abra `index.html` no navegador
   - Clique em "Gerenciar" para cadastrar seus cartões

2. **Cadastrar Cartão**
   - Preencha nome, bandeira, dia de vencimento e fechamento
   - Clique em "Adicionar Cartão"

3. **Gerenciar Cartões**
   - Use "Editar" para alterar dados do cartão
   - Use "Excluir" para remover (com confirmação)

4. **Lançar Despesa**
   - Clique em "Lançar Despesa"
   - Preencha os dados
   - Marque "Parcelado" se necessário
   - Selecione o cartão (opcional)

5. **Consultar**
   - Acesse "Consulta" no menu
   - Use os filtros para buscar
   - Exporte em PDF se desejar

## 🌐 Compatibilidade

- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)
- ✅ Tablets

## 💾 Armazenamento

Todos os dados são salvos localmente no navegador (localStorage).
Não há envio de dados para servidores externos.

## 🎯 Pronto para Upload

Todos os arquivos estão prontos para fazer upload em:
- Hospedagem estática (GitHub Pages, Netlify, Vercel)
- Servidor web tradicional
- Teste local (basta abrir index.html)

---

**Desenvolvido por Paes_Tech Sistemas**
