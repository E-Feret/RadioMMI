import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

// On récupère la clé Resend depuis les variables d'environnement (.env.local)
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function POST(req: Request) {
    try {
        // Validation basique pour voir si la clé existe
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: "La clé API Resend n'est pas configurée dans .env.local" }, { status: 400 });
        }

        const { subject, htmlContent, senderEmail } = await req.json();

        if (!subject || !htmlContent || !senderEmail) {
            return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
        }

        // 1. Récupération des abonnés actifs via Supabase
        const { data: subscribers, error: dbError } = await supabase
            .from('newsletter')
            .select('email')
            .eq('status', 'Actif');

        if (dbError || !subscribers || subscribers.length === 0) {
            return NextResponse.json({ error: "Aucun abonné actif trouvé." }, { status: 400 });
        }

        const emails = subscribers.map(sub => sub.email);

        // 2. Découpage en lots de 50 emails pour respecter les limites (BCC)
        const chunkSize = 50;
        const batches = [];
        for (let i = 0; i < emails.length; i += chunkSize) {
            batches.push(emails.slice(i, i + chunkSize));
        }

        // 3. Wrapper HTML élégant aux couleurs de la DA (Dark/Orange)
        const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', Helvetica, Arial, sans-serif; color: #ffffff;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; width: 100%;">
                <tr>
                    <td align="center" style="padding: 40px 20px;">
                        <!-- Conteneur Principal -->
                        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 20px; border: 1px solid #333333; overflow: hidden; width: 100%;">
                            
                            <!-- En-tête / Logo -->
                            <tr>
                                <td align="center" style="padding: 30px 20px; background-color: #141414; border-bottom: 2px solid #ff6600;">
                                    <h1 style="margin: 0; font-family: 'Arial Black', sans-serif; color: #ff6600; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">RADIO MMI</h1>
                                </td>
                            </tr>
                            
                            <!-- Contenu Corps du mail (celui tapé par l'admin) -->
                            <tr>
                                <td style="padding: 40px 30px; line-height: 1.8; font-size: 16px; color: #e5e5e5;">
                                    ${htmlContent}
                                </td>
                            </tr>
                            
                            <!-- Pied de page -->
                            <tr>
                                <td align="center" style="padding: 30px 20px; background-color: #141414; border-top: 1px solid #333333;">
                                    <p style="margin: 0; font-size: 12px; color: #666666; font-weight: bold;">
                                        &copy; ${new Date().getFullYear()} Radio MMI. Tous droits réservés.
                                    </p>
                                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #444444;">
                                        Cet e-mail a été envoyé car vous êtes inscrit(e) à notre newsletter.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `;

        // 4. Envoi via l'API Resend
        for (const batch of batches) {
            const { error: sendError } = await resend.emails.send({
                from: `Radio MMI <${senderEmail}>`, // Exemple: onboarding@resend.dev ou ne-pas-repondre@radio.fr si domaine vérifié
                to: [senderEmail], // Envoi principal à soi-même ou adresse bot
                bcc: batch,        // Copie cachée sécuritaire pour les abonnés
                subject: subject,
                html: emailTemplate,
            });

            if (sendError) {
                console.error("Erreur Resend:", sendError);
                return NextResponse.json({ error: sendError.message }, { status: 400 });
            }
        }

        return NextResponse.json({ message: "La newsletter a bien été expédiée !" }, { status: 200 });
    } catch (error) {
        console.error("Erreur système envoi newsletter:", error);
        return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
    }
}
