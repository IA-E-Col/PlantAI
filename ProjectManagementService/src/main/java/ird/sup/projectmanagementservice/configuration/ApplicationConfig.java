package ird.sup.projectmanagementservice.configuration;

import ird.sup.projectmanagementservice.DAO.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    // Injection du repository utilisateur pour charger les utilisateurs depuis la base
    private final IUserRepository repository;

    /**
     * Bean pour le UserDetailsService.
     * Ce service est utilisé par Spring Security pour charger un utilisateur en fonction de son email.
     * Ici, la méthode recherche l'utilisateur via l'email et lève une exception si aucun utilisateur n'est trouvé.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    /**
     * Bean pour l'AuthenticationProvider.
     * Il utilise un DaoAuthenticationProvider qui s'appuie sur le UserDetailsService pour récupérer les détails de l'utilisateur
     * et sur le PasswordEncoder pour comparer les mots de passe.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Bean pour l'AuthenticationManager.
     * Ce bean est récupéré à partir de la configuration d'authentification de Spring (AuthenticationConfiguration)
     * et permet de gérer le processus d'authentification dans l'application.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    /**
     * Bean pour le filtrage CORS.
     * Il configure les règles CORS de l'application pour autoriser les requêtes provenant de l'origine spécifiée.
     * Ici, l'origine autorisée est "http://localhost:4200", qui est typiquement l'URL de votre application Angular.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        // Autorise l'origine spécifiée
        config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        // Autorise les en-têtes nécessaires
        config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
        // Autorise les méthodes HTTP indiquées
        config.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT", "PATCH"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    
    /**
     * Bean pour le PasswordEncoder.
     * Ce bean utilise BCrypt pour encoder les mots de passe, ce qui permet de stocker et vérifier les mots de passe de manière sécurisée.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
