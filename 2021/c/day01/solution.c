#include <stdio.h>
#include <stdlib.h>
#include "../shared/dynarray.h"

int* parse_measurements(char* filename) {
    FILE* file = fopen(filename, "r");

    if (file == NULL) {
        perror(filename);
        exit(EXIT_FAILURE);
    }

    int* measurements = dynarray_create(int);
    int measurement;

    do {
        fscanf(file, "%d", &measurement);
        dynarray_push(measurements, measurement);
    } while (!feof(file));

    fclose(file);

    return measurements;
}

int part1(int* measurements) {
    int increased = 0;

    for (int i = 0, j = 1; i < dynarray_length(measurements) - 1; i++, j++) {
        if (measurements[j] > measurements[i]) {
            increased++;
        }
    }

    return increased;
}

int part2(int* measurements) {
    int increased = 0;

    for (int i = 0, j = 1; i < dynarray_length(measurements) - 3; i++, j++) {
        int window_1 = measurements[i] + measurements[i + 1] + measurements[i + 2];
        int window_2 = measurements[j] + measurements[j + 1] + measurements[j + 2];
        if (window_2 > window_1) {
            increased++;
        }
    }

    return increased;
}

int main(int argc, char *argv[]) {
    int* measurements = parse_measurements("input.txt");

    printf("Part 1: %d\n", part1(measurements));
    printf("Part 2: %d\n", part2(measurements));

    dynarray_destroy(measurements);

    return EXIT_SUCCESS;
}
