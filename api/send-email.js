const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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

  try {
    // 1. Enviar email para o ADMIN (Você)
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Email de envio (padrão teste ou seu domínio)
      to: ['leonardoarpini@gmail.com'], // Seu email real
      reply_to: email,
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📧 Nova Mensagem de ${name}</h2>
            </div>
            <div class="content">
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
            </div>
          </div>
        </body>
        </html>
      `
    });

    // 2. Enviar email de CONFIRMAÇÃO para o USUÁRIO
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [email],
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
            .button { display: inline-block; padding: 12px 30px; background: #00ff88; color: #0d0d0d; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; font-family: Arial, sans-serif; }
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
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Emails enviados com sucesso'
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Erro ao enviar email'
    });
  }
};
