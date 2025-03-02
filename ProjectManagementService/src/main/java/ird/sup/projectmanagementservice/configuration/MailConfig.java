package ird.sup.projectmanagementservice.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Configuration pour l'envoi d'emails avec JavaMailSender.
 * 
 * Cette classe configure un bean JavaMailSender pour se connecter au serveur SMTP de Gmail.
 * Pour des raisons de sécurité, il est recommandé d'externaliser les informations sensibles
 * (comme le nom d'utilisateur et le mot de passe) dans le fichier application.properties.
 */
@Configuration
public class MailConfig {

    /**
     * Crée et configure un bean JavaMailSender pour envoyer des emails.
     *
     * @return un objet JavaMailSender configuré pour Gmail
     */
    @Bean
    public JavaMailSender javaMailSender() {
        // Création d'une instance de JavaMailSenderImpl
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        // Configuration du serveur SMTP de Gmail
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);

        // Configuration de l'authentification (à externaliser pour plus de sécurité)
        mailSender.setUsername("ird.recherche.developpement@gmail.com");
        mailSender.setPassword("vxiynkqzflogzzem");

        // Configuration des propriétés supplémentaires pour le protocole SMTP
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", "true"); // Active l'authentification SMTP
        props.put("mail.smtp.starttls.enable", "true"); // Active le protocole TLS pour sécuriser la connexion
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com"); // Fait confiance au serveur SMTP de Gmail

        return mailSender;
    }
}
