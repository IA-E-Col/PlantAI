package ird.sup.projectmanagementservice.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    // CORS configuration is handled by SecurityConfiguration.java
    // This class is kept for WebMvc configuration only
}
