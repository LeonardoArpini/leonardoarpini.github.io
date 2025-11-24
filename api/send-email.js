// Vercel Serverless Function para envio de emails
// Endpoint: /api/send-email

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { name, email, subject, message } = req.body;

  // Validação básica
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Todos os campos são obrigatórios'
    });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido'
    });
  }

  try {
    // Configurar transportador de email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Configurar email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'lolmrbeer@gmail.com', // Email de destino
      replyTo: email, // Email do remetente para resposta
      subject: `[Contato Site] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); 
                     color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #00d4ff; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #00ff88; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 Nova Mensagem do Site</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Nome:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value">${email}</div>
              </div>
              <div class="field">
                <div class="label">📝 Assunto:</div>
                <div class="value">${subject}</div>
              </div>
              <div class="field">
                <div class="label">💬 Mensagem:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                <p>Enviado através do formulário de contato do site</p>
                <p>Bruno Henrique Arpini - Portfolio</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Nova mensagem do site

Nome: ${name}
Email: ${email}
Assunto: ${subject}

Mensagem:
${message}

---
Enviado através do formulário de contato do site
      `
    };

    // Email de confirmação para o usuário
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Email do usuário
      subject: 'Mensagem recebida - Bruno Arpini',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #00ff88 0%, #00d4ff 100%); 
                     color: white; padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .message-box { background: white; padding: 20px; border-radius: 5px; border-left: 3px solid #00ff88; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #00ff88; color: #0d0d0d; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px;">✅ Mensagem Recebida!</h1>
            </div>
            <div class="content">
              <p>Olá <strong>${name}</strong>,</p>
              
              <p>Obrigado por entrar em contato! Recebi sua mensagem e responderei o mais breve possível.</p>
              
              <div class="message-box">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Resumo da sua mensagem:</strong></p>
                <p style="margin: 10px 0 0 0;"><strong>Assunto:</strong> ${subject}</p>
              </div>
              
              <p>Geralmente respondo em até 24-48 horas. Se for urgente, você também pode me encontrar nas redes acadêmicas:</p>
              
              <p style="text-align: center;">
                <a href="http://lattes.cnpq.br/1022964934574626" class="button">📋 Currículo Lattes</a>
              </p>
              
              <div class="footer">
                <p><strong>Bruno Henrique Arpini</strong></p>
                <p>Ph.D. in Chemistry | Postdoctoral Researcher</p>
                <p style="font-size: 12px; color: #999; margin-top: 15px;">
                  Este é um email automático. Por favor, não responda a esta mensagem.
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Olá ${name},

Obrigado por entrar em contato! Recebi sua mensagem e responderei o mais breve possível.

Resumo da sua mensagem:
Assunto: ${subject}

Geralmente respondo em até 24-48 horas.

---
Bruno Henrique Arpini
Ph.D. in Chemistry | Postdoctoral Researcher

Este é um email automático. Por favor, não responda a esta mensagem.
      `
    };

    // Enviar ambos os emails
    await Promise.all([
      transporter.sendMail(mailOptions),           // Email para você
      transporter.sendMail(confirmationMailOptions) // Email de confirmação para o usuário
    ]);

    return res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao enviar email. Por favor, tente novamente.'
    });
  }
};
