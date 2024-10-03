# Define the approved characters that are safe and not easily confused
approved_chars = "3479ACDEFGHJKMNPQRTUVWXYacdefghjkmnpqrtuvwy@#$%^&*_+="

# Function to validate input based on the approved character set
def validate_input(user_input):
    """
    Validates that a given input contains only approved characters.

    Parameters:
    user_input (str): The input string to validate

    Returns:
    bool: True if the input is valid (contains only approved characters), False otherwise
    """
    if not user_input:  # Check if input is empty
        return False

    return all(char in approved_chars for char in user_input)

# Main function for testing input validation
if __name__ == "__main__":
    user_input = input("Enter a string to validate: ")

    # Validate user input
    if validate_input(user_input):
        print("Input is valid.")
    else:
        print("Input contains invalid characters.")
