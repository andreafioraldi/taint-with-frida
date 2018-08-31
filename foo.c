#include <stdio.h>
#include <string.h>

void foo(char *buf)
{
    char pippo[20];
    
    int i;
    for(i = 0; i < 20; ++i) {
        pippo[i] = buf[i] - '0';
    }
    
    pippo[19] = 0;
    
}

int main(int argc, char ** argv) {
    char buf[40];
    strncpy(buf, argv[1], 40);
    foo(buf);
}
