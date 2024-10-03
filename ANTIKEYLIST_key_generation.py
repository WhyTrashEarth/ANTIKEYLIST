import random

# Define the approved characters that are safe and not easily confused
approved_chars = "3479ACDEFGHJKMNPQRTUVWXYacdefghjkmnpqrtuvwy@#$%^&*_+="

# Function to generate a key with a customizable length
def generate_key(length=10):
    """
    Generates a random key using approved characters.

    Parameters:
    length (int): Length of the generated key (default is 10)

    Returns:
    str: A random string of the specified length using only approved characters
    """
    if length <= 0:
        raise ValueError("Length must be a positive integer.")
    return ''.join(random.choice(approved_chars) for _ in range(length))

# Main function for running the script
if __name__ == "__main__":
    try:
        # Generate a 12-character key as an example
        key = generate_key(12)
        print(f"Generated Key: {key}")
    except ValueError as e:
        print(f"Error: {e}")
