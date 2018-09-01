#include <stdio.h>
#include <string.h>

void foo(short *buf)
{
    short pippo[11];
    
    int i;
    for(i = 0; i < 10; ++i) {
        pippo[i] = buf[i] - '0';
    }
    
    pippo[10] = 0;
    
}

int main(int argc, char ** argv) {
    char buf[40];
    strncpy(buf, argv[1], 40);
    foo((short*)buf);
}
