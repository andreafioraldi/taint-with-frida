#include <stdio.h>
#include <string.h>

void foo(char *buf)
{
  char a;

  a = buf[0];
  a = buf[4];
  a = buf[8];
  a = buf[10];
  buf[5]  = 't';
  buf[10] = 'e';
  buf[20] = 's';
  buf[30] = 't';
}

int main(int argc, char ** argv) {
    char buf[40];
    strncpy(buf, argv[1], 40);
    foo(buf);
}
