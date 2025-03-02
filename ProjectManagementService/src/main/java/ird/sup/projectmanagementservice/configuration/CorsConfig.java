package ird.sup.projectmanagementservice.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Classe de configuration CORS pour l'application.
 * 
 * Cette classe implémente l'interface WebMvcConfigurer afin de configurer les règles CORS.
 * CORS (Cross-Origin Resource Sharing) permet de contrôler les requêtes provenant d'origines différentes.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Configure les mappings CORS pour l'application.
     *
     * @param registry le registre utilisé pour ajouter des configurations CORS.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // On applique la configuration CORS à toutes les URL ("/**")
        registry.addMapping("/**")
                // allowedOriginPatterns("*") autorise toutes les origines.
                // Vous pouvez remplacer "*" par une origine spécifique, par exemple "http://localhost:4200"
                .allowedOriginPatterns("*")
                // Autorise les méthodes HTTP GET, POST, PUT, DELETE et OPTIONS
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // Autorise tous les en-têtes HTTP
                .allowedHeaders("*");
    }
}
