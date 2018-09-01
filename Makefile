all: foo bof

foo:
	frida-compile foo.js -o foo_compiled.js

bof:
	frida-compile bof.js -o bof_compiled.js

