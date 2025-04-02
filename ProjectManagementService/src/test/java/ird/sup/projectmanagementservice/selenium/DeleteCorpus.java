package ird.sup.projectmanagementservice.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class DeleteCorpus {
    public static void main(String[] args) {
        // 1. Configuration du driver Chrome
        System.setProperty("webdriver.chrome.driver", System.getenv("CHROME_DRIVER"));
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();

        // 2. Accès à l'application
        driver.get("http://localhost:4200/login");

        // 3. Connexion
        driver.findElement(By.id("email")).sendKeys("trabelsianis516@gmail.com");
        driver.findElement(By.id("password")).sendKeys("00000000");
        driver.findElement(By.id("loginButton")).click();

        // 4. Pause pour chargement
        pause(2000);

        // 5. Accès à la section "Corpus"
        driver.findElement(By.xpath("//a[contains(text(), 'Corpus')]")).click();

        // 6. Pause pour affichage de la liste
        pause(2000);

        // 7. Cliquer sur la première poubelle (suppression)
        driver.findElement(By.xpath("(//button[contains(@class,'btn') and .//fa-icon//*[name()='svg' and contains(@data-icon,'trash')]])[1]")).click();

        // 8. Pause pour affichage de la boîte de dialogue
        pause(1000);

        // 9. Cliquer sur le bouton "Yes, delete corpus"
        driver.findElement(By.xpath("//button[contains(@class,'swal2-confirm') and contains(text(),'Yes, delete corpus')]")).click();

        // 10. Pause pour finaliser la suppression
        pause(3000);

        // 11. Fermer le navigateur
        driver.quit();
    }

    private static void pause(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
