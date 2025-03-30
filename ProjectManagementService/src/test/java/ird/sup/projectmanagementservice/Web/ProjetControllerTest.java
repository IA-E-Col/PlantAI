package ird.sup.projectmanagementservice.Web;

import ird.sup.projectmanagementservice.DAO.CollectionRepository;
import ird.sup.projectmanagementservice.DAO.ModeleRepository;
import ird.sup.projectmanagementservice.DAO.ProjetRepository;
import ird.sup.projectmanagementservice.DAO.SpecimenRepository;
import ird.sup.projectmanagementservice.DAO.UserRepository;
import ird.sup.projectmanagementservice.DTO.UserWithExpertiseDTO;
import ird.sup.projectmanagementservice.Entities.Projet;
import ird.sup.projectmanagementservice.Entities.User;
import ird.sup.projectmanagementservice.Services.CollectionService; // <-- On l'importe pour le mock
import ird.sup.projectmanagementservice.Services.DatasetService;
import ird.sup.projectmanagementservice.Services.ProjetService;
import ird.sup.projectmanagementservice.Services.SpecimenService;
import ird.sup.projectmanagementservice.Services.UserService;
// [OPTIONNEL] import ird.sup.projectmanagementservice.configuration.JwtService; // <-- Si vous avez besoin de le mocker
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Classe de test pour {@link ProjetController}.
 */
@WebMvcTest(controllers = ProjetController.class)
public class ProjetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Mock du CollectionService pour satisfaire l’@Autowired
    // dans ProjectManagementServiceApplication (si votre application l’exige)
    @MockBean
    private CollectionService cS;

    // [OPTIONNEL] mockez JwtService, si votre application le requiert
    // @MockBean
    // private JwtService jwtService;

    // Services utilisés par ProjetController
    @MockBean
    private ProjetService projetService;

    @MockBean
    private UserService userService;

    @MockBean
    private DatasetService datasetService;

    @MockBean
    private SpecimenService specimenService;

    // Mocks ajoutés pour satisfaire d’autres dépendances
    @MockBean
    private UserRepository ur;
    @MockBean
    private ProjetRepository pr;
    @MockBean
    private ModeleRepository mr;
    @MockBean
    private SpecimenRepository sr;
    @MockBean
    private CollectionRepository cr;

    /**
     * Test: Récupération d’un projet par son ID (cas: projet trouvé)
     */
    @Test
    void testFindProjetById_OK() throws Exception {
        System.out.println("➡️ testFindProjetById_OK: Start");

        Projet projet = new Projet();
        projet.setId(1L);
        projet.setNomProjet("Projet Test");

        // Définir le comportement mocké
        Mockito.when(projetService.findProjetbyId(1L)).thenReturn(projet);

        mockMvc.perform(get("/api/projets/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nom", is("Projet Test")));

        System.out.println("✅ testFindProjetById_OK: Passed");
    }

    /**
     * Test: Récupération d’un projet par son ID (cas: projet introuvable)
     */
    @Test
    void testFindProjetById_NotFound() throws Exception {
        System.out.println("➡️ testFindProjetById_NotFound: Start");

        // On simule le fait qu’aucun projet ne soit trouvé pour l’ID 999
        Mockito.when(projetService.findProjetbyId(999L)).thenReturn(null);

        mockMvc.perform(get("/api/projets/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        System.out.println("✅ testFindProjetById_NotFound: Passed");
    }

    /**
     * Test: liste de tous les projets
     */
    @Test
    void testGetProjetsList_OK() throws Exception {
        System.out.println("➡️ testGetProjetsList_OK: Start");

        Projet projet = new Projet();
        projet.setId(1L);
        projet.setNomProjet("Projet A");

        Mockito.when(projetService.getProjets())
               .thenReturn(Collections.singletonList(projet));

        mockMvc.perform(get("/api/projets/list")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].nom", is("Projet A")));

        System.out.println("✅ testGetProjetsList_OK: Passed");
    }

    /**
     * Test: liste des collaborateurs d’un projet
     */
    @Test
    void testGetCollaborateurs_OK() throws Exception {
        System.out.println("➡️ testGetCollaborateurs_OK: Start");

        UserWithExpertiseDTO dto = new UserWithExpertiseDTO();
        dto.setId(42L);
        dto.setNom("Collab A");

        Mockito.when(projetService.getCollaborateurs(1L))
               .thenReturn(Collections.singletonList(dto));

        mockMvc.perform(get("/api/projets/1/collaborateurs")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(42)))
                .andExpect(jsonPath("$[0].nom", is("Collab A")));

        System.out.println("✅ testGetCollaborateurs_OK: Passed");
    }

    /**
     * Test: récupération du créateur d’un projet (cas OK)
     */
    @Test
    void testGetCreateur_OK() throws Exception {
        System.out.println("➡️ testGetCreateur_OK: Start");

        User user = new User();
        user.setId(10L);
        user.setNom("Createur");

        Mockito.when(projetService.getCreateur(1L)).thenReturn(user);

        mockMvc.perform(get("/api/projets/1/createur")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(10)))
                .andExpect(jsonPath("$.nom", is("Createur")));

        System.out.println("✅ testGetCreateur_OK: Passed");
    }

    /**
     * Test: récupération du créateur d’un projet (cas introuvable)
     */
    @Test
    void testGetCreateur_NotFound() throws Exception {
        System.out.println("➡️ testGetCreateur_NotFound: Start");

        Mockito.when(projetService.getCreateur(2L)).thenReturn(null);

        mockMvc.perform(get("/api/projets/2/createur")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        System.out.println("✅ testGetCreateur_NotFound: Passed");
    }

}
