import unittest
from ANTIKEYLIST_key_generation import generate_key, approved_chars
from ANTIKEYLIST_input_validation import validate_input


class ExampleTests(unittest.TestCase):
    def test_generation(self):
        for size in [1, 10, 12, 64]:
            code = generate_key(size)
            self.assertEqual(len(code), size)
            self.assertTrue(validate_input(code))

    def test_invalid_lengths(self):
        for size in [0, -1, 1.5, '12', True, None]:
            with self.assertRaises(ValueError):
                generate_key(size)

    def test_validation(self):
        self.assertTrue(validate_input(approved_chars))
        self.assertTrue(validate_input('Cc9g'))
        for sample in ['', None, 123, 'A0A', '7 I', 'A\n', 'A💗']:
            self.assertFalse(validate_input(sample))


if __name__ == '__main__':
    unittest.main()
