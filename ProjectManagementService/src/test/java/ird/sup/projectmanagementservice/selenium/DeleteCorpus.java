package ird.sup.projectmanagementservice.selenium;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class DeleteCorpus {
    public static void main(String[] args) {
        // 1. Configurer le driver Firefox
        System.setProperty("webdriver.gecko.driver", "C:\\Program Files\\geckodriver.exe");

        FirefoxOptions options = new FirefoxOptions();
        options.setBinary("C:\\Program Files\\Mozilla Firefox\\firefox.exe");

        WebDriver driver = new FirefoxDriver(options);
        driver.manage().window().maximize();
        driver.get("http://localhost:4200/login");

        // 2. Connexion
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement emailInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("username")));
        emailInput.sendKeys("trabelsianis516@gmail.com");
        driver.findElement(By.id("password")).sendKeys("00000000");
        driver.findElement(By.xpath("//button[text()='Login']")).click();

        // 3. Accès à "Corpus"
        pause(2000);
        WebElement corpusLink = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//a[span[text()='Corpus']]")));
        corpusLink.click();

        // 4. Pause pour affichage de la liste
        pause(2000);

        // 5. Cliquer sur la première poubelle (suppression du premier corpus)
        WebElement deleteIcon = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("(//button[contains(@class,'btn') and .//fa-icon//*[name()='svg' and contains(@data-icon,'trash')]])[1]")));
        deleteIcon.click();

        // 6. Attendre le bouton de confirmation
        pause(1000);
        WebElement confirmDelete = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//button[contains(@class,'swal2-confirm') and contains(text(),'Yes, delete corpus')]")));
        confirmDelete.click();

        // 7. Pause pour finaliser
        pause(3000);

        // 8. Fermer le navigateur
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
