#include <stdio.h>

char *my_strcpy(char *d, const char *s)
{
   char *saved = d;
   while (*s)
   {
       *d++ = *s++;
   }
   *d = 0;
   return saved;
}

size_t my_strlen(const char *s)
{
   size_t c = 0;
   while (*s)
   {
       ++c;
       s++;
   }
   return c;
}

int main(int argc, char** argv) {
    char buf[0x32];
    my_strcpy(buf, argv[1]);
    printf("input len is %lu\n", my_strlen(buf));
}
