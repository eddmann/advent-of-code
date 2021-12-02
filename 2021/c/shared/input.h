#include <stdio.h>
#include <stdlib.h>

#define ONE_GB_IN_KB 1073741824

#define FILE_OK 0
#define FILE_NOT_FOUND 1
#define FILE_TOO_LARGE 2
#define FILE_READ_ERROR 3

char *read_input(const char *filename, int *err, size_t *filesize) {
  FILE *file = fopen(filename, "rb");

  if (!file) {
    *err = FILE_NOT_FOUND;
    return NULL;
  }

  fseek(file, 0, SEEK_END);
  size_t length = ftell(file);
  fseek(file, 0, SEEK_SET);

  if (length > ONE_GB_IN_KB) {
    *err = FILE_TOO_LARGE;
    return NULL;
  }

  char *buffer = (char *)malloc(length + 1);

  if (length) {
    size_t read = fread(buffer, 1, length, file);

    if (length != read) {
      free(buffer);
      *err = FILE_READ_ERROR;
      return NULL;
    }
  }

  fclose(file);

  *err = FILE_OK;
  buffer[length] = '\0';
  *filesize = length;

  return buffer;
}

char *read_input_or_exit(const char *filename) {
  int err;
  size_t filesize;
  char *input = read_input(filename, &err, &filesize);

  if (err == FILE_OK) {
    return input;
  }

  switch (err) {
  case FILE_NOT_FOUND:
    printf("[ERROR] File not found\n");
    break;
  case FILE_TOO_LARGE:
    printf("[ERROR] File is larger than 1GB\n");
    break;
  case FILE_READ_ERROR:
    printf("[ERROR] Failed to read file\n");
    break;
  }

  exit(1);
}
