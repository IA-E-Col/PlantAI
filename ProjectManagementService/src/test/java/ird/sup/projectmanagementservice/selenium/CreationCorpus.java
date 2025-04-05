package ird.sup.projectmanagementservice.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.File;
import java.time.Duration;

public class CreationCorpus {
    public static void main(String[] args) {
        // 1. Configurer le driver Firefox
        System.setProperty("webdriver.gecko.driver", "C:\\Program Files\\geckodriver.exe");

        FirefoxOptions options = new FirefoxOptions();
        options.setBinary("C:\\Program Files\\Mozilla Firefox\\firefox.exe");

        // 2. Lancer le navigateur
        WebDriver driver = new FirefoxDriver(options);
        driver.get("http://localhost:4200/login");
        driver.manage().window().maximize();

        // 3. Attendre et remplir le champ email
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
        emailInput.sendKeys("trabelsianis516@gmail.com");

        // 4. Remplir le mot de passe
        driver.findElement(By.id("password")).sendKeys("00000000");

        // 5. Cliquer sur le bouton Login
        driver.findElement(By.xpath("//button[text()='Login']")).click();

        // 6. Pause pour que la page se charge
        pause(2000);

        // 7. Cliquer sur "Corpus"
        WebElement corpusLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[span[text()='Corpus']]")));
        corpusLink.click();

        // 8. Pause pour le chargement de la page
        pause(1000);

        // 9. Cliquer sur "Create"
        WebElement createButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[text()=' Create ']")));
        createButton.click();

        // 10. Remplir les champs du formulaire
        pause(1000); // attendre que le modal s'affiche

        driver.findElement(By.id("Collection")).sendKeys("copustest");
        driver.findElement(By.id("description")).sendKeys("testdans");

        // 11. Upload fichier
        File fichier = new File("D:\\anis\\sup_galilee\\info2\\gestion_projet\\apres postegresl\\PlantAI\\recolnat_collection_1000.csv");
        WebElement inputUpload = driver.findElement(By.id("customFile"));
        inputUpload.sendKeys(fichier.getAbsolutePath());

        // 12. Cliquer sur "Create Corpus"
        WebElement createCorpusButton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(text(), 'Create Corpus')]")));
        createCorpusButton.click();

        // 13. Pause pour observer le résultat
        pause(10000);
   
        // 14. Fermer le navigateur
        driver.quit();
    }

    private static void pause(int millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
