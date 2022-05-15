#include <zbar.h>

/**
 * This method creates a new instance of Image on zbar.
 * The image will be used to send ImageData (main data) from the frontend to webassembly.
 * @param uint32_t width - The image width of frontend (Canvas ImageData).
 * @param uint32_t height - The image height of frontend (Canvas ImageData).
 * @param void *data - The image data (Attribute data of canvas).
 * @param uint32_t length - The image length (width * height).
 * @param uint32_t sequence_num - The sequence number of the image (always 0).
 * @returns zbar_image_t* - ZBarImage pointer.
 */
EXPORT zbar_image_t *cc_zbar_image_create(uint32_t width,
																					uint32_t height,
																					uint32_t format,
																					void *data,
																					uint32_t length,
																					uint32_t sequence_num)
{
	zbar_image_t *image = zbar_image_create();
	zbar_image_set_size(image, width, height);
	zbar_image_set_format(image, format);
	zbar_image_set_data(image, data, length, zbar_image_free_data);
	zbar_image_set_sequence(image, sequence_num);
	return image;
}