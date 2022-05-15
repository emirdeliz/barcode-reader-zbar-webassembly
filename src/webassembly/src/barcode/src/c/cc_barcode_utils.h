#include "cc_utils.h"

/**
 * This method calc the check digits for mod 10.
 * @param char[] barcode_segment - Barcode block with 11 digits.
 * @returns int - check digit.
 */
int cc_get_check_digit_mod_10(char barcode_segment[])
{
	int j = 0;
	int mult = 2;
	int sum = 0;
	int s[100] = {};

	int barcode_segment_as_length = 11;
	int *barcode_segment_as_int_array = cc_char_array_to_int_array(barcode_segment);

	for (int i = barcode_segment_as_length - 1; i >= 0; i--)
	{
		int barcode_segment_as_int = barcode_segment_as_int_array[i];
		int calc_mult = (mult * barcode_segment_as_int);
		int calc_mult_as_num_digits = cc_count_num_digits_int(calc_mult);
		char *calc_mult_as_string = cc_int_to_string_11(calc_mult);

		s[j++] = calc_mult_as_string[0] - '0';
		if (calc_mult_as_num_digits > 1)
		{
			s[j++] = calc_mult_as_string[1] - '0';
		}

		if (--mult < 1)
		{
			mult = 2;
		}
	}

	for (int i = 0; i < j; i += 1)
	{
		sum += s[i];
	}

	sum = sum % 10;
	if (sum != 0)
	{
		sum = 10 - sum;
	}
	return sum;
}

/**
 * This method calc the check digits for mod 11.
 * @param char[] barcode_segment - Barcode block with 11 digits.
 * @returns int - check digit.
 */
int cc_get_check_digit_mod_11(char barcode_segment[])
{
	int sum = 0;
	int weight = 2;
	int base = 9;

	int barcode_segment_as_length = 11;
	for (int i = barcode_segment_as_length - 1; i >= 0; i--)
	{
		int barcode_segment_as_int = barcode_segment[i] - '0';
		sum = sum + barcode_segment_as_int * weight;
		if (weight < base)
		{
			weight++;
		}
		else
		{
			weight = 2;
		}
	}

	int dac = sum % 11;
	if (dac == 0 || dac == 1)
	{
		return 0;
	}

	if (dac == 10)
	{
		return 1;
	}

	return (11 - dac);
}

/**
 * This method calc the check digits for the mod10 and mod11.
 * @param char[] segment - Barcode block with 11 digits.
 * @returns int mod - check digit.
 */
EXPORT int cc_calc_check_digit(char segment[], int mod)
{
	if (mod == 10)
	{
		return cc_get_check_digit_mod_10(segment);
	}
	else if (mod == 11)
	{
		return cc_get_check_digit_mod_11(segment);
	}
	return 0;
}

/**
 * This method returns the barcode mod. For this calc, the third digit is used.
 * When the third digit is 6 or 7, the mod is 10. When the third digit is 8 or 9, the mod is 11.
 * @param ref_number - The third barcode digit .
 * @returns int - mod value.
 */
EXPORT int cc_get_mod(int ref_number)
{
	switch (ref_number)
	{
	case 6:
	case 7:
		return 10;
	case 8:
	case 9:
		return 11;
	default:
		return 0;
	}
}

/**
 * This method calc all check digits for the barcode.
 * @param char * barcode_char_array - Barcode with 44 digits.
 * @param int barcode_length - Barcode length.
 * @returns char* - Char pointer with the barcode and check digits.
 * @void - No return value.
 */
void cc_apply_check_digit(
		char barcode_char_array[],
		char target[],
		int barcode_length)
{
	int segment_length = 11;
	int check_digit_length = 4;
	int mod = cc_get_mod(barcode_char_array[2] - '0');
	memset(target, '\0', strlen(target));

	for (int i = 0; i <= check_digit_length - 1; i += 1)
	{
		int start_index = i * segment_length;
		int end_index = segment_length;

		char segment[11] = "\0";
		cc_substring(barcode_char_array, start_index, end_index, segment);

		int check_digit = cc_calc_check_digit(segment, mod);
		char check_digit_as_char_array[2] = "\0";
		check_digit_as_char_array[0] = check_digit + '0';

		strcat(target, segment);
		strcat(target, check_digit_as_char_array);
	}
}

/**
 * This method checks if the barcode is from insurance like gps, darf and etc.
 * For this calc, the first digit is used. When is equal to 8 return 0.
 * @param char* barcode_char_array - Barcode with 44 digits.
 * @returns char - Result as 0 for true and 1 for false.
 */
EXPORT int cc_check_if_barcode_is_from_insurance(char *barcode_char_array)
{
	int digit_type_barcode = barcode_char_array[0] - '0';
	return digit_type_barcode == 8 ? 0 : 1;
}

/**
 * This method apply the check digit if the barcode is from insurance.
 * For this calc, the first digit is used. When is equal to 8 return 0.
 * @param char[] barcode - Barcode as char array no check digit.
 * @param char[] target - Barcode as char array to receive the result.
 * @param int barcode_length - Probable the value is 44.
 * @void - No return value.
 */
void cc_apply_maybe_check_digit_to_barcode(char barcode[], char target[], int barcode_length)
{
	memset(target, '\0', strlen(target));
	int is_barcode_from_insurance = cc_check_if_barcode_is_from_insurance(barcode);
	if (is_barcode_from_insurance == 0)
	{
		cc_apply_check_digit(barcode, target, barcode_length);
	}
	else
	{
		strcpy(target, barcode);
	}
}

/**
 * This method check if barcode is from pix.
 * @param const char* barcode - Barcode as char array.
 * @returns char - Result as 0 for true and 1 for false.
 */
int check_if_barcode_is_from_pix(const char *barcode)
{
	int barcode_length = 44;
	return strlen(barcode) > barcode_length ? 0 : 1;
}