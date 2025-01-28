package ird.sup.projectmanagementservice.DAO;

import ird.sup.projectmanagementservice.Entities.Specimen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecimenRepository extends JpaRepository<Specimen, Long> {

    // rendre generique pour tous les champs

    @Query("select distinct pays from Specimen ")
    public List<String> findChampPays();

    @Query("select distinct codePays from Specimen ")
    public List<String> findChampCodePays();

    @Query("select distinct enregistrePar from Specimen ")
    public List<String> findChampEnregistrePar();

    @Query("select distinct lieu from Specimen ")
    public List<String> findChampLieu();

    @Query("select distinct ville from Specimen ")
    public List<String> findChampVille();

    @Query("select distinct departement from Specimen ")
    public List<String> findChampDepartement();

    @Query("select distinct nomScientifique from Specimen ")
    public List<String> findChampNomScientifique();

    @Query("select distinct nomScientifiqueAuteur from Specimen ")
    public List<String> findChampNomScientifiqueAuteur();

    @Query("select distinct famille from Specimen ")
    public List<String> findChampFamille();

    @Query("select distinct epitheteSpecifique from Specimen ")
    public List<String> findChampEpitheteSpecifique();

    @Query("select distinct genre from Specimen ")
    public List<String> findChampGenre();

    @Query("select distinct catalogueCode from Specimen ")
    public List<String> findChampCatalogueCode();

    @Query("select distinct identificationRemarques from Specimen ")
    public List<String> findChampIdentification();

    @Query("select distinct collectionCode from Specimen ")
    public List<String> findChampCollectionCode();

    @Query("select distinct codeInstitution from Specimen ")
    public List<String> findChampCodeInstitution();

    @Query("select distinct baseDEnregistrement from Specimen ")
    public List<String> findChampBaseDEnregistrement();

    @Query("SELECT s FROM Specimen s " +
            "WHERE (:pays IS NULL OR s.pays IN :pays) " +
            "AND (:genre IS NULL OR s.genre IN :genre) " +
            "AND (:enregistrePar IS NULL OR s.enregistrePar IN :enregistrePar) " +
            "AND (:famille IS NULL OR s.famille IN :famille) " +
            "AND (:epitheteSpecifique IS NULL OR s.epitheteSpecifique IN :epitheteSpecifique) " +
            "AND (:nomScientifique IS NULL OR s.nomScientifique IN :nomScientifique) " +
            "AND (:nomScientifiqueAuteur IS NULL OR s.nomScientifiqueAuteur IN :nomScientifiqueAuteur) " +
            "AND (:ville IS NULL OR s.ville IN :ville) " +
            "AND (:departement IS NULL OR s.departement IN :departement) " +
            "AND (:lieu IS NULL OR s.lieu IN :lieu)")
    List<Specimen> findByMultipleCriteria(
            @Param("pays") List<String> pays,
            @Param("genre") List<String> genre,
            @Param("enregistrePar") List<String> enregistrePar,
            @Param("famille") List<String> famille,
            @Param("epitheteSpecifique") List<String> epitheteSpecifique,
            @Param("nomScientifique") List<String> nomScientifique,
            @Param("nomScientifiqueAuteur") List<String> nomScientifiqueAuteur,
            @Param("ville") List<String> ville,
            @Param("departement") List<String> departement,
            @Param("lieu") List<String> lieu);

    List<Specimen> findByPaysInOrGenreInOrEnregistreParInOrFamilleInOrEpitheteSpecifiqueInOrNomScientifiqueInOrNomScientifiqueAuteurInOrVilleInOrDepartementInOrLieuIn(
            List<String> pays, List<String> genre, List<String> enregistrePar, List<String> famille,
            List<String> epitheteSpecifique, List<String> nomScientifique, List<String> nomScientifiqueAuteur,
            List<String> Ville, List<String> Departement, List<String> Lieu);

    // List<Specimen>
    // findByPaysInAndGenreInAndEnregistreParInAndFamilleInAndEpitheteSpecifiqueInAndNomScientifiqueIn(List<String>
    // pays, List<String> genre,List<String> enregistrePar,List<String> famille,
    // List<String> epitheteSpecifique,List<String> nomScientifique);

    List<Specimen> findByPaysInOrGenreIn(List<String> pays, List<String> genre);
}
