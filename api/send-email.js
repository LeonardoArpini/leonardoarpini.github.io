const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  const { name, email, subject, message, lang = 'pt' } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Todos os campos são obrigatórios'
    });
  }

  // Traduções
  const t = {
    pt: {
      subject: 'Recebi sua mensagem! - Bruno Arpini',
      title: 'Mensagem Recebida!',
      greeting: 'Olá',
      intro: 'Obrigado pelo contato! Recebi sua mensagem com sucesso e analisarei sua solicitação o mais breve possível.',
      summary: 'Resumo da sua mensagem:',
      connect: 'Conecte-se comigo nas redes científicas:',
      button: 'Acessar Currículo Lattes',
      footer_role: 'Ph.D. in Chemistry | Postdoctoral Researcher',
      footer_note: 'Este é um email automático.<br>Por favor, não responda a esta mensagem.'
    },
    en: {
      subject: 'Message Received! - Bruno Arpini',
      title: 'Message Received!',
      greeting: 'Hello',
      intro: 'Thank you for contacting me! I have received your message successfully and will review your request as soon as possible.',
      summary: 'Message summary:',
      connect: 'Connect with me on scientific networks:',
      button: 'View Lattes Curriculum',
      footer_role: 'Ph.D. in Chemistry | Postdoctoral Researcher',
      footer_note: 'This is an automated email.<br>Please do not reply to this message.'
    }
  };

  const text = t[lang] || t.pt; // Fallback para PT

  // Styles shared between emails
  const styles = {
    body: "font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #e0e0e0; background-color: #0d0d0d; margin: 0; padding: 0;",
    container: "max-width: 600px; margin: 20px auto; background-color: #1a1a1a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); border: 1px solid #2a2a2a;",
    header: "background: linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%); padding: 30px 20px; text-align: center; border-bottom: 2px solid #00ff88;",
    headerTitle: "color: #00ff88; margin: 15px 0 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;",
    logo: "width: 60px; height: 60px; filter: drop-shadow(0 0 5px rgba(0,255,136,0.3)); display: inline-block;",
    content: "padding: 40px 30px; position: relative;",
    label: "font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #00d4ff; margin-bottom: 8px; font-weight: 700; display: flex; align-items: center;",
    value: "background-color: #252525; border-left: 3px solid #00ff88; padding: 15px; border-radius: 0 4px 4px 0; margin-bottom: 25px; color: #ffffff; box-shadow: inset 0 0 10px rgba(0,0,0,0.2);",
    messageBox: "background-color: #252525; border: 1px solid #3a3a3a; padding: 20px; border-radius: 4px; color: #e0e0e0; position: relative;",
    button: "display: inline-block; padding: 14px 28px; background: linear-gradient(90deg, #00ff88 0%, #00d4ff 100%); color: #0d0d0d; text-decoration: none; border-radius: 50px; font-weight: 800; margin-top: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);",
    footer: "text-align: center; padding: 30px 20px; background-color: #0a0a0a; color: #666; font-size: 12px; border-top: 1px solid #2a2a2a;",
    highlight: "color: #00ff88; font-weight: bold;",
    molecule: "display: inline-block; width: 6px; height: 6px; background-color: #00d4ff; border-radius: 50%; margin-right: 8px; box-shadow: 0 0 5px #00d4ff;"
  };

  // URL base para a logo
  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://brunoarpini.vercel.app';

  const logoUrl = `${baseUrl}/logo-email.png`;

  try {
    // 1. Enviar email para o ADMIN (Você) - Sempre em PT (ou fixo)
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: [process.env.EMAIL_ADMIN],
      reply_to: email,
      subject: `[Portfolio] Novo contato: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="${styles.body}">
          <div style="${styles.container}">
            <div style="${styles.header}">
              <img src="${logoUrl}" alt="Bruno Arpini" style="${styles.logo}">
              <h1 style="${styles.headerTitle}">Nova Mensagem Recebida</h1>
            </div>
            
            <div style="${styles.content}">
              <div style="${styles.label}"><span style="${styles.molecule}"></span> Remetente</div>
              <div style="${styles.value}">
                <strong>${name}</strong> (${email})
              </div>

              <div style="${styles.label}"><span style="${styles.molecule}"></span> Assunto</div>
              <div style="${styles.value}">
                ${subject}
              </div>

              <div style="${styles.label}"><span style="${styles.molecule}"></span> Mensagem</div>
              <div style="${styles.messageBox}">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>

            <div style="${styles.footer}">
              <p>Email enviado através do seu Portfolio Profissional.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    // 2. Enviar email de CONFIRMAÇÃO para o USUÁRIO (No idioma dele)
    await resend.emails.send({
      from: 'Bruno Arpini <onboarding@resend.dev>',
      to: [email],
      reply_to: [process.env.EMAIL_REPLAY],
      subject: text.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="${styles.body}">
          <div style="${styles.container}">
            <div style="${styles.header}">
              <img src="${logoUrl}" alt="Bruno Arpini" style="${styles.logo}">
              <h1 style="${styles.headerTitle}">${text.title}</h1>
            </div>
            
            <div style="${styles.content}">
              <p style="margin-bottom: 20px; font-size: 16px;">${text.greeting} <strong>${name}</strong>,</p>
              
              <p style="margin-bottom: 20px; line-height: 1.6;">
                ${text.intro}
              </p>
              
              <div style="${styles.label} margin-top: 30px;"><span style="${styles.molecule}"></span> ${text.summary}</div>
              <div style="${styles.value}">
                <strong style="color: #00d4ff;">${subject}</strong>
              </div>

              <p style="margin-top: 30px; text-align: center; color: #999;">
                ${text.connect}
              </p>
              
              <div style="text-align: center;">
                <a href="http://lattes.cnpq.br/1022964934574626" style="${styles.button}">
                  ${text.button}
                </a>
              </div>
            </div>

            <div style="${styles.footer}">
              <p style="color: #00ff88; font-weight: bold; font-size: 14px; margin-bottom: 5px;">Bruno Henrique Arpini</p>
              <p>${text.footer_role}</p>
              <div style="margin-top: 15px; border-top: 1px solid #252525; padding-top: 15px;">
                <p style="opacity: 0.5;">
                  ${text.footer_note}
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
