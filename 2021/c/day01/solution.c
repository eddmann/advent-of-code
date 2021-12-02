#include <stdlib.h>
#include "../shared/dynarray.h"
#include "../shared/input.h"

int* parse_measurements(char* input) {
    int* measurements = dynarray_create(int);
    
    int measurement, offset, read;
    while (sscanf(input + offset, "%d%n", &measurement, &read)) {
        dynarray_push(measurements, measurement);
        offset += read;
    }

    return measurements;
}

int part1(int* measurements) {
    int increased = 0;

    for (int i = 0, j = 1; i < dynarray_length(measurements) - 1; i++, j++) {
        if (measurements[j] > measurements[i]) {
            increased += 1;
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
            increased += 1;
        }
    }

    return increased;
}

int main(int argc, char *argv[]) {
    char* input = read_input_or_exit("input.txt");
    int* measurements = parse_measurements(input);

    printf("Part 1: %d\n", part1(measurements));
    printf("Part 2: %d\n", part2(measurements));

    dynarray_destroy(measurements);
    free(input);

    return EXIT_SUCCESS;
}
