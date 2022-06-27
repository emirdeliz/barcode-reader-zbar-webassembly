#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

/**
 * The EMSCRIPTEN_KEEPALIVE setting is used by emscripten to know which methods will be exported.
 * These methods can be used in the JS call. is just a shortcut for the EMSCRIPTEN_KEEPALIVE variable.
 */
#define EXPORT EMSCRIPTEN_KEEPALIVE

/**
 * This method convert the value int to string (char[]).
 * @param int number - The number to convert.
 * @param int string_length - The length of the number.
 * @returns char* - The char[] result.
 */
char *c_int_to_string(int number, int string_length)
{
	char * target = (char *)malloc(sizeof(char) * (string_length + 1));
	sprintf(target, "%d", number);
	return target;
}

/**
 * This method convert the value int to string (char[]) with 11 digits.
 * @param int number - The number to convert.
 * @returns char* - The char[] result.
 */
char *c_int_to_string_11(int number)
{
	int string_length = 11;
	return c_int_to_string(number, string_length);
}

/**
 * This method convert the value char[] to int[].
 * @param char_array - The char[] to convert.
 * @returns int* - The int* result.
 */
int * c_char_array_to_int_array(char char_array[])
{
	int length = strlen(char_array);
	int * result = (int *)malloc(length * sizeof(int));
	for (int i = 0; i < length; i++)
	{
		result[i] = char_array[i] - '0';
	}
	return result;
}

/**
 * This method get the substring(char[]) of string(char[]).
 * @param char* source - The source string (char[]).
 * @param int start - The start index.
 * @param int end - The end index.
 * @param char[] target - The target(char[]) to receive the result.
 */
void c_substring(char *source, int start, int end, char target[])
{
	memset(target, '\0', strlen(target));
	strncpy(target, source + start, end);
}

/**
 * This method allocates the memory for the char matrix(char[][]).
 * @param int num_rows - The rows number on matrix.
 * @param int num_cols - The cols number on matrix.
 * @returns char** - The char matrix(char[][]).
 */
char **c_allocate_char_matrix(int num_rows, int num_cols)
{
	char **matrix = (char **)malloc(num_rows * sizeof(char *));

	for (int row = 0; row < num_rows; row++)
	{
		matrix[row] = (char *)malloc(num_cols * sizeof(char));
		for (int col = 0; col < num_cols; col++)
		{
			matrix[row][col] = '\0';
		}
	}
	return matrix;
}

/**
 * This method split the string(char[]) by numbers of digits.
 * @param char* array_char - The string(char[]) to split.
 * @param int str_length - The length of the string.
 * @param int segment_length - The length of the segment.
 * @returns char** - The matrix(char[][]) result.
 */
char **c_split_string_by_segment_length(char *array_char, int str_length, int segment_length)
{
	int segments_length = str_length / segment_length;
	char **segments = c_allocate_char_matrix(segments_length, segment_length);

	for (int i = 0; i < segments_length - 1; i += 1)
	{
		int start_index = i * segment_length;
		int end_index = 11;
		
		char segment[11];
		c_substring(array_char, start_index, end_index, segment);

		for (int j = 0; j < segment_length; j += 1)
		{
			segments[i][j] = segment[j] + '\0';
		}
	}
	return segments;
}

/**
 * This method count the numbers of digits on the int value.
 * @param int number - The value to be counted
 * @returns int - The numbers of digits.
 */
int c_count_num_digits_int(int number)
{
	int result = 0;
	while (number != 0)
	{
		number /= 10;
		result++;
	}
	return result;
}