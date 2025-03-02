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
import java.util.Optional;

import static org.springframework.http.HttpHeaders.*;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    // Injection du repository utilisateur pour charger les utilisateurs depuis la base
    private final IUserRepository repository;

    /**
     * Bean pour le UserDetailsService.
     * Ce service est utilisé par Spring Security pour charger un utilisateur par son email.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> Optional.ofNullable(repository.findByEmail(username))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    /**
     * Bean pour l'AuthenticationProvider.
     * Utilise un DaoAuthenticationProvider qui s'appuie sur le UserDetailsService et un PasswordEncoder (BCrypt).
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
     * Récupéré à partir de la configuration d'authentification de Spring.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    /**
     * Bean pour le filtrage CORS.
     * Autorise les requêtes provenant de "http://localhost:4200" avec les en-têtes et méthodes spécifiés.
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        config.setAllowedHeaders(Arrays.asList(ORIGIN, CONTENT_TYPE, ACCEPT, AUTHORIZATION));
        config.setAllowedMethods(Arrays.asList(GET.name(), POST.name(), DELETE.name(), PUT.name(), PATCH.name()));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    /**
     * Bean pour le PasswordEncoder.
     * Utilise BCryptPasswordEncoder pour encoder les mots de passe de manière sécurisée.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
