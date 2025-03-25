package ird.sup.projectmanagementservice.email;

import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_MIXED;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailService {

    // Injection du service JavaMailSender pour envoyer des emails.
    private final JavaMailSender mailSender;
    
    // Injection du moteur de template Thymeleaf pour générer le contenu des emails.
    private final SpringTemplateEngine templateEngine;

    /**
     * Méthode asynchrone pour envoyer un email d'activation ou de confirmation.
     *
     * @param to               L'adresse email du destinataire.
     * @param username         Le nom d'utilisateur à afficher dans l'email.
     * @param emailTemplate    Le template d'email à utiliser (de type EmailTemplateName).
     *                         S'il est null, le template par défaut "confirm-email" sera utilisé.
     * @param confirmationUrl  L'URL de confirmation à inclure dans l'email.
     * @param activationCode   Le code d'activation à inclure dans l'email.
     * @param subject          Le sujet de l'email.
     * @throws MessagingException Si une erreur survient lors de la création ou de l'envoi de l'email.
     */
    @Async
    public void sendEmail(
            String to,
            String username,
            EmailTemplateName emailTemplate,
            String confirmationUrl,
            String activationCode,
            String subject
    ) throws MessagingException {
        // Détermination du nom du template à utiliser.
        // Si aucun template n'est fourni, le template "confirm-email" sera utilisé par défaut.
        String templateName = (emailTemplate == null) ? "confirm-email" : emailTemplate.name();

        // Création d'un objet MimeMessage pour construire le message email.
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        
        // MimeMessageHelper facilite la création d'un message multipart avec l'encodage UTF-8.
        MimeMessageHelper helper = new MimeMessageHelper(
                mimeMessage,
                MULTIPART_MODE_MIXED,
                UTF_8.name()
        );

        // Préparation des variables à injecter dans le template Thymeleaf.
        Map<String, Object> properties = new HashMap<>();
        properties.put("username", username);
        properties.put("confirmationUrl", confirmationUrl);
        properties.put("activation_code", activationCode);

        // Création du contexte Thymeleaf et assignation des variables.
        Context context = new Context();
        context.setVariables(properties);

        // Configuration de l'email : expéditeur, destinataire et sujet.
        helper.setFrom("ird.recherche.developpement@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);

        // Traitement du template pour générer le contenu HTML de l'email.
        String template = templateEngine.process(templateName, context);
        helper.setText(template, true); // 'true' indique que le contenu est en HTML.

        // Journalisation pour le debug.
        log.info("Email envoyé à {}", to);
        
        // Envoi de l'email.
        mailSender.send(mimeMessage);
    }
}
