import java.util.Scanner;

/**
 * RETO I
 * La abuela tiene un horno nuevo que muestra la temperatura en °C,
 * pero la receta pide precalentarlo a 350 °F.
 * Este programa convierte grados Fahrenheit a grados Centígrados
 * usando la formula: °C = (°F - 32) / 1.8
 */
public class RetoI {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=====================================");
        System.out.println("   RETO I - Ayudemos a la abuela");
        System.out.println("=====================================");
        System.out.println("La receta pide precalentar el horno a 350 F.");
        System.out.print("Ingresa la temperatura en Fahrenheit (F): ");

        double fahrenheit = scanner.nextDouble();

        // Aplicamos la formula: C = (F - 32) / 1.8
        double centigrados = (fahrenheit - 32) / 1.8;

        System.out.println("-------------------------------------");
        System.out.printf("%.1f F equivalen a %.2f C%n", fahrenheit, centigrados);
        System.out.println("Ya puedes colocar la temperatura correcta");
        System.out.println("en el horno de la abuela. Buena suerte con la torta!");
        System.out.println("=====================================");

        scanner.close();
    }
}
