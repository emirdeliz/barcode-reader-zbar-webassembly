#include <stdio.h>
#include "c_barcode_utils.h"

int barcode_length = 44;

/**
 * This method runs the simple test for the barcode reader.
 * @param char[] barcode - Barcode with 44 digits.
 * @param int mod - The barcode mod (10 or 11).
 * @void - No return value.
 */
void run(char barcode[], int mod)
{
	char result_mod[49] = {};
	c_apply_maybe_check_digit_to_barcode(barcode, result_mod, barcode_length);
	printf("Mod %d: '%s'\n\n", mod, result_mod);
}

int main()
{
	/**
	 * Test 1 for mod 10.
	 * @result barcode - 83630000000-4 86170162000-2 00101020217-2 67028153602-9.
	 */
	char barcode_mod_10_1[] = {
		'8', '3', '6', '3', '0', '0', '0', '0', '0', '0', '0', 
		'8', '6', '1', '7', '0', '1', '6', '2', '0', '0', '0', 
		'0', '0', '1', '0', '1', '0', '2', '0', '2', '1', '7', 
		'6', '7', '0', '2', '8', '1', '5', '3', '6', '0', '2'
	};

	/**
	 * Test 2 for mod 10.
	 * @result barcode - 85630000002-8 98699912310-2 12222102325-4 88525010000-9.
	 */
	char barcode_mod_10_2[] = {
		'8', '5', '6', '3', '0', '0', '0', '0', '0', '0', '2', 
		'9', '8', '6', '9', '9', '9', '1', '2', '3', '1', '0', 
		'1', '2', '2', '2', '2', '1', '0', '2', '3', '2', '5', 
		'8', '8', '5', '2', '5', '0', '1', '0', '0', '0', '0'
	};

	/**
	 * Test 1 for mod 11.
	 * @result barcode - 23793.38128 60068.823438 40000.063301 3 87570000002000.
	 */
	char barcode_mod_11_1[] = {
			'2', '3', '7', '9', '3', '3', '8', '1', '2', '8', 
			'6', '0', '0', '6', '8', '8', '2', '3', '4', '3', '8', 
			'4', '0', '0', '0', '0', '0', '6', '3', '3', '0', '1', '3', 
			'8', '7', '5', '7', '0', '0', '0', '0', '0', '0', '2', '0', '0', '0'
	};

	/**
	 * Test 2 for mod 11.
	 * @result barcode - 23793.38128 60004.220509 69000.050802 7 89810000005105.
	 */
	char barcode_mod_11_2[] = {
		'2', '3', '7', '9', '3', '3', '8', '1', '2', '8', 
		'6', '0', '0', '0', '4', '2', '2', '0', '5', '0', '9', 
		'6', '9', '0', '0', '0', '0', '5', '0', '8', '0', '2', '7', 
		'8', '9', '8', '1', '0', '0', '0', '0', '0', '0', '5', '1', '0', '5'
	};

	run(barcode_mod_10_1, 10);
	run(barcode_mod_10_2, 10);
	run(barcode_mod_11_1, 11);
	run(barcode_mod_11_2, 11);

	return 0;
}
