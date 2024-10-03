import java.util.Scanner;

public class ANTIKEYLISTInputValidation {

    // Define the approved characters for validation
    private static final String approvedChars = "3479ACDEFGHJKMNPQRTUVWXYacdefghjkmnpqrtuvwy@#$%^&*_+=";

    // Function to validate input based on the approved characters
    public static boolean validateInput(String userInput) {
        for (int i = 0; i < userInput.length(); i++) {
            if (approvedChars.indexOf(userInput.charAt(i)) == -1) {
                return false;  // Invalid character found
            }
        }
        return true;  // All characters are valid
    }

    // Main method to test input validation
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter a string to validate: ");
        String userInput = scanner.nextLine();

        // Validate user input
        if (validateInput(userInput)) {
            System.out.println("Input is valid.");
        } else {
            System.out.println("Input contains invalid characters.");
        }

        scanner.close();
    }
}
