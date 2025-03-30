package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.Services.AnnotationModeleService;
import ird.sup.projectmanagementservice.config.TestConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AnnotationModeleController.class)
@Import(TestConfig.class)
public class AnnotationModeleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AnnotationModeleService annotationModeleService;

    @Test
    public void testGetAllClasses() throws Exception {
        // simule une réponse vide de service pour éviter NullPointerException
        when(annotationModeleService.getAllClasses()).thenReturn(java.util.Collections.emptyList());

        mockMvc.perform(get("/api/annotationModele/getAllClasse")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }
}
