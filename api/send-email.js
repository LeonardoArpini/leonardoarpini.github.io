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
            to: 'mrbeerlol@gmail.com', // Email de destino
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

        // Enviar email
        await transporter.sendMail(mailOptions);

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
