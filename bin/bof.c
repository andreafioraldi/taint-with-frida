#include <stdio.h>
#include <string.h>

int main(int argc, char** argv) {
    char buf[0x32];
    strcpy(buf, argv[1]);
    printf("input len is %lu\n", strlen(buf));
}
