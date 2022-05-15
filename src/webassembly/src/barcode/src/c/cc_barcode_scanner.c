#include <zbar.h>
#include "cc_barcode_utils.h"
#include "cc_barcode_image.h"

/**
 * This is the main method to comunicate frontend with webassembly.
 * The image will be used to send ImageData (main data) from the frontend to webassembly.
 * @param zbar_image_t *image - The image pointer. This param is created across the cc_zbar_image_create. on the frontend.
 * @param char *result - The result pointer that will be updated with the barcode result.
 * @param int ignore_pix - Whether the barcode for pix should be ignored. Case 0 should be considered.
 * @returns int - Default return successfully of C.
 */
EXPORT int cc_zbar_image_scanner_scan_and_maybe_apply_check_digit(zbar_image_t *image, char *result, int ignore_pix)
{
	zbar_image_scanner_t *scanner = zbar_image_scanner_create();
	zbar_scan_image(scanner, image);

	const zbar_symbol_t *symbol = zbar_image_first_symbol(image);
	char barcode_no_check_digits[44] = "\0";

	for (; symbol; symbol = zbar_symbol_next(symbol))
	{
		const char *barcode = zbar_symbol_get_data(symbol);
		int is_from_pix = check_if_barcode_is_from_pix(barcode);
		if (ignore_pix == 1 || is_from_pix == 1) {
			strcat(barcode_no_check_digits, barcode);
			break;
		}
	}

	zbar_image_destroy(image);
	zbar_image_scanner_destroy(scanner);

	cc_apply_maybe_check_digit_to_barcode(barcode_no_check_digits, result, strlen(barcode_no_check_digits));
	return 0;
}