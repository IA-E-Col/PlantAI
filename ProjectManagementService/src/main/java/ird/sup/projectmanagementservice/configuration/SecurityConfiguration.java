package ird.sup.projectmanagementservice.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    // Injection des dépendances nécessaires pour la configuration de la sécurité
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;

    /**
     * Définit le SecurityFilterChain, qui configure la sécurité HTTP de l'application.
     * 
     * La configuration inclut :
     * - La gestion CORS pour autoriser les requêtes provenant de n'importe quelle origine.
     * - La désactivation de CSRF (utile pour une API REST stateless).
     * - L'autorisation des requêtes vers les endpoints d'authentification (/api/v1/auth/**) sans authentification.
     * - L'exigence d'authentification pour toutes les autres requêtes.
     * - La configuration de la gestion des sessions en mode stateless.
     * - L'ajout d'un AuthenticationProvider personnalisé.
     * - L'insertion du JwtAuthenticationFilter avant le filtre UsernamePasswordAuthenticationFilter.
     * - La configuration du logout pour invalider le contexte de sécurité.
     *
     * @param http la configuration HttpSecurity à personnaliser.
     * @return le SecurityFilterChain construit.
     * @throws Exception en cas d'erreur de configuration.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Configuration CORS : autorise toutes les origines, méthodes et en-têtes
            .cors().configurationSource(request -> {
                CorsConfiguration corsConfig = new CorsConfiguration();
                corsConfig.addAllowedOrigin("*"); // Autorise toutes les origines
                corsConfig.addAllowedMethod("*"); // Autorise toutes les méthodes HTTP
                corsConfig.addAllowedHeader("*"); // Autorise tous les en-têtes
                return corsConfig;
            }).and()
            // Désactivation de CSRF, car l'API est stateless
            .csrf().disable()
            // Configuration des règles d'autorisation
            .authorizeHttpRequests()
                // Autorise toutes les requêtes vers les endpoints d'authentification
                .requestMatchers(new AntPathRequestMatcher("/api/v1/auth/**")).permitAll()
                // Exige que toutes les autres requêtes soient authentifiées
                .anyRequest().authenticated()
            .and()
            // Configure la gestion des sessions pour qu'elles soient stateless
            .sessionManagement()
                .sessionCreationPolicy(STATELESS)
            .and()
            // Ajoute l'AuthenticationProvider personnalisé pour la vérification des identifiants
            .authenticationProvider(authenticationProvider)
            // Ajoute le filtre JWT avant le filtre standard d'authentification
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            // Configure le logout
            .logout()
                .logoutUrl("/api/v1/auth/logout") // URL pour le logout
                .addLogoutHandler(logoutHandler)   // Gestionnaire de logout personnalisé
                // Nettoie le contexte de sécurité après le logout
                .logoutSuccessHandler((request, response, authentication) ->
                    SecurityContextHolder.clearContext()
                );

        // Retourne la configuration construite
        return http.build();
    }
}
