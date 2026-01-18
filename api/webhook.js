const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
    // 1. Permitir apenas POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 2. Verificar se o webhook é autêntico (Segurança recomendada pela doc)
        // O segredo deve estar nas variáveis de ambiente da Vercel
        const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

        // Se o usuário ainda não configurou o segredo, avisamos (para facilitar o debug)
        if (!webhookSecret) {
            console.warn('RESEND_WEBHOOK_SECRET não configurado. Pulando verificação por enquanto.');
        } else {
            const headers = {
                'svix-id': req.headers['svix-id'],
                'svix-timestamp': req.headers['svix-timestamp'],
                'svix-signature': req.headers['svix-signature'],
            };

            // Verifica a assinatura
            // Nota: req.body já vem parseado na Vercel, então usamos JSON.stringify
            // Se der erro de validação, ele joga uma exceção
            resend.webhooks.verify({
                payload: JSON.stringify(req.body),
                headers,
                webhookSecret,
            });
        }

        // 3. Processar o evento
        const event = req.body;

        if (event.type === 'email.received') {
            const { from, to, subject } = event.data;

            console.log(`📩 Novo email recebido!`);
            console.log(`De: ${from}`);
            console.log(`Para: ${to}`);
            console.log(`Assunto: ${subject}`);

            // Aqui você poderia adicionar lógica extra (ex: salvar no banco, encaminhar via whatsapp, etc)
            // Por enquanto, apenas logamos para ver no painel da Vercel.

            return res.status(200).json({ received: true });
        }

        // Outros eventos
        return res.status(200).json({ received: false });

    } catch (error) {
        console.error('Webhook Error:', error.message);
        return res.status(400).json({ error: error.message });
    }
};
