# 📧 Sistema de Contato - Bruno Arpini Portfolio

Sistema completo de envio de emails usando Vercel Serverless Functions e modal interativo.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração Atual (Gmail)](#configuração-atual-gmail)
- [Migração para Email Profissional](#migração-para-email-profissional)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema de contato possui:
- ✅ Modal popup elegante
- ✅ Envio de emails via API serverless
- ✅ Traduções PT/EN
- ✅ Feedback visual (loading, sucesso, erro)
- ✅ Validação de campos
- ✅ Design responsivo

---

## 📧 Configuração Atual (Gmail)

### **Variáveis de Ambiente na Vercel**

| Nome | Descrição |
|------|-----------|
| `EMAIL_USER` | Seu email do Gmail |
| `EMAIL_PASS` | Senha de app do Gmail (16 caracteres) |

### **Como Gerar Senha de App do Gmail**

1. Acesse https://myaccount.google.com/security
2. Ative **"Verificação em duas etapas"**
3. Vá em **"Senhas de app"**
4. Selecione **Email** → **Outro**
5. Copie a senha de 16 caracteres (sem espaços)
6. Cole em `EMAIL_PASS` na Vercel

### **Arquivos**

- `api/send-email.js` - Função serverless (Gmail)
- `script.js` - Lógica do formulário
- `index.html` - Modal de contato

---

## 🚀 Migração para Email Profissional

Quando você tiver um email profissional (`contato@brunoarpini.com`):

### **1. Obter Configurações SMTP**

#### **Localweb:**
```
Host: smtp.localweb.com.br
Porta: 587
Usuário: contato@seudominio.com.br
Senha: senha normal do email
```

#### **Hostinger:**
```
Host: smtp.hostinger.com
Porta: 587
Usuário: contato@seudominio.com
Senha: senha normal do email
```

#### **Titan Email:**
```
Host: smtp.titan.email
Porta: 587
Usuário: contato@seudominio.com
Senha: senha normal do email
```

### **2. Substituir Arquivo da API**

Renomeie os arquivos:
```bash
# Backup do atual
mv api/send-email.js api/send-email-gmail-backup.js

# Ativar versão profissional
mv api/send-email-professional.js api/send-email.js
```

### **3. Atualizar Variáveis na Vercel**

Adicione 4 variáveis (marque Production, Preview e Development):

| Nome | Valor | Exemplo |
|------|-------|---------|
| `SMTP_HOST` | Servidor SMTP | `smtp.localweb.com.br` |
| `SMTP_PORT` | Porta | `587` |
| `EMAIL_USER` | Email profissional | `contato@brunoarpini.com` |
| `EMAIL_PASS` | Senha do email | `suaSenha123` |

### **4. Deploy**

```bash
git add .
git commit -m "Migrar para email profissional"
git push
```

### **5. Testar**

1. Acesse o site
2. Preencha o formulário
3. Verifique se recebeu o email

---

## 📁 Estrutura de Arquivos

```
curriculo - buique/
├── api/
│   ├── send-email.js              # Versão atual (Gmail)
│   └── send-email-professional.js # Versão para email profissional
├── index.html                     # Modal de contato
├── script.js                      # Lógica do formulário
├── style.css                      # Estilos do modal
├── package.json                   # Dependências (nodemailer)
└── README.md                      # Este arquivo
```

---

## 🔧 Troubleshooting

### **Erro 500 - Server Error**

**Causa:** Variáveis de ambiente não configuradas ou incorretas

**Solução:**
1. Verifique se as variáveis estão na Vercel
2. Confirme que a senha de app está sem espaços
3. Faça redeploy após adicionar variáveis

### **Erro 404 - Not Found**

**Causa:** Pasta `api/` não está no lugar certo

**Solução:**
- A pasta `api/` deve estar na raiz do projeto
- Verifique se o arquivo é `send-email.js` (não `.txt` ou outro)

### **Email não chega**

**Solução:**
1. Verifique a pasta SPAM
2. Confirme o email de destino em `api/send-email.js` (linha 54)
3. Veja os logs na Vercel Dashboard

### **Connection timeout (Email profissional)**

**Solução:**
1. Verifique se `SMTP_HOST` está correto
2. Tente trocar a porta: `587` ↔ `465`
3. Se usar porta `465`, altere `secure: true` no código

### **Authentication failed (Email profissional)**

**Solução:**
1. Confirme usuário e senha
2. Verifique se o email está ativo
3. Alguns provedores exigem "Permitir SMTP" no painel

---

## 📊 Comparação: Gmail vs Email Profissional

| Recurso | Gmail | Email Profissional |
|---------|-------|-------------------|
| **Profissionalismo** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Facilidade** | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Senha de App** | ✅ Necessário | ❌ Não precisa |
| **Custo** | Grátis | Pago (~R$10-30/mês) |
| **Personalização** | Baixa | Alta |

---

## 🎯 Como Funciona

1. **Usuário preenche formulário** → Nome, email, assunto, mensagem
2. **JavaScript envia dados** → POST para `/api/send-email`
3. **Vercel Function processa** → Valida dados
4. **Nodemailer envia email** → Via SMTP (Gmail ou profissional)
5. **Resposta retorna** → Sucesso ou erro
6. **Modal mostra feedback** → "✅ Enviado!" ou "❌ Erro!"

---

## 📝 Limites Gratuitos da Vercel

- ✅ **100GB** de bandwidth/mês
- ✅ **100** execuções de função/dia (plano Hobby)
- ✅ **10 segundos** de timeout por função
- ✅ **Ilimitado** número de funções

---

## 🔒 Segurança

A API inclui:
- ✅ Validação de campos obrigatórios
- ✅ Validação de formato de email
- ✅ Proteção contra métodos não permitidos (apenas POST)
- ✅ CORS configurado
- ✅ Variáveis de ambiente protegidas
- ✅ Sanitização de HTML no email

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs na Vercel Dashboard
2. Consulte a seção [Troubleshooting](#troubleshooting)
3. Verifique o console do navegador (F12)

---

## ✅ Checklist de Migração (Email Profissional)

Quando for migrar para email profissional:

- [ ] Obtive as configurações SMTP do provedor
- [ ] Substituí o arquivo `send-email.js`
- [ ] Atualizei as 4 variáveis na Vercel
- [ ] Fiz deploy/redeploy
- [ ] Testei o formulário
- [ ] Recebi o email de teste
- [ ] Respondi o email de teste (verificar reply-to)

---

**Desenvolvido por:** Leonardo Laia Arpini  
**Última atualização:** Novembro 2025
