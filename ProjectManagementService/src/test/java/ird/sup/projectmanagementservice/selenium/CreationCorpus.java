package ird.sup.projectmanagementservice.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.io.File;

public class CreationCorpus {
    public static void main(String[] args) {
        // 1. Configurer le driver Chrome
        System.setProperty("webdriver.chrome.driver", System.getenv("CHROME_DRIVER"));

        // 2. Lancer le navigateur
        WebDriver driver = new ChromeDriver();
        driver.get("http://localhost:4200/login");
        driver.manage().window().maximize();

        // 3. Connexion
        driver.findElement(By.id("email")).sendKeys("trabelsianis516@gmail.com");
        driver.findElement(By.id("password")).sendKeys("00000000");
        driver.findElement(By.id("loginButton")).click();

        // 4. Pause pour que la page se charge
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 5. Cliquer sur "Corpus" dans la sidebar
        driver.findElement(By.xpath("//a[contains(text(), 'Corpus')]")).click();

        // 6. Cliquer sur "Create"
        try {
            Thread.sleep(1000); // attendre le chargement du tableau
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        driver.findElement(By.xpath("//button[contains(text(), 'Create')]")).click();

        // 7. Remplir les champs : corpus name, description
        try {
            Thread.sleep(1000); // attendre l'ouverture du modal
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        driver.findElement(By.xpath("//input[@placeholder='Collection Name']")).sendKeys("copustest");
        driver.findElement(By.xpath("//textarea[@placeholder='Enter collection description']")).sendKeys("testdans");

        // 8. Upload du fichier
        File fichier = new File("D:\\anis\\sup_galilee\\info2\\gestion_projet\\apres postegresl\\PlantAI\\recolnat_collection_1000.csv");
        WebElement inputUpload = driver.findElement(By.xpath("//input[@type='file']"));
        inputUpload.sendKeys(fichier.getAbsolutePath());

        // 9. Cliquer sur "Create Corpus"
        driver.findElement(By.xpath("//button[contains(text(), 'Create Corpus')]")).click();

        // 10. Pause pour voir le résultat
        try {
            Thread.sleep(4000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 11. Fermer le navigateur
        driver.quit();
    }
}
