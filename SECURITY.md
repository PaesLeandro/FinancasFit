# 🔒 Política de Segurança

## Relatar Vulnerabilidades

Se encontrar uma vulnerabilidade de segurança, **NÃO** a publique publicamente.

Por favor, envie um email para: `seu_email@exemplo.com` com detalhes:

- Tipo de vulnerabilidade
- Localização no código
- Potencial impacto
- Sugestão de correção (se tiver)

## Boas Práticas de Uso Seguro

### Para Usuários

1. ✅ Use uma **senha mestra forte** (mínimo 12 caracteres, com números e símbolos)
2. ✅ **Nunca compartilhe** sua senha mestra
3. ✅ Faça **backup periódico** dos seus dados
4. ✅ Use em **HTTPS apenas** (se fazer deploy online)
5. ✅ Limpe o histórico do navegador regularmente
6. ✅ **Não deixe aberto** em computador compartilhado

### Para Desenvolvedores

1. ✅ Não commit `.env` ou dados sensíveis
2. ✅ Use `npm audit` antes de adicionar dependências
3. ✅ Revise regularmente as permissões de arquivo
4. ✅ Atualize bibliotecas de terceiros frequentemente
5. ✅ Teste a criptografia com dados fictícios antes

## Proteção de Dados

- 🔐 Os dados são armazenados **apenas no seu computador** (localStorage)
- 🔐 Nenhum dado é enviado para servidores
- 🔐 A criptografia é local, no navegador
- 🔐 Você é o único com acesso à sua senha

## Segurança da Aplicação

| Aspecto                | Implementação                  |
| ---------------------- | ------------------------------ |
| **Criptografia**       | AES-256-GCM com autenticação   |
| **Derivação Chave**    | PBKDF2-SHA256, 100k iterações  |
| **Vetores Aleatórios** | IV único para cada encriptação |
| **Auto-logout**        | 15 minutos de inatividade      |
| **Validação**          | Entrada sanitizada contra XSS  |

## Descoberta Responsável

Agradecemos por ajudar a manter este projeto seguro!

**Prazo de resposta**: Respondemos dentro de 48 horas
**Reconhecimento**: Menciona o pesquisador na seção "Agradecimentos"

---

_Última atualização: 17 de fevereiro de 2026_
