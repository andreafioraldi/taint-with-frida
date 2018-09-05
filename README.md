# taint-with-frida

It's not a real tool, only a PoC with this limitations:

 + byte-level taint
 + flags register not tainted
 + support only a restricted subset of x86_64

## use cases

+ **foo**: a simple memory copy routine to test taint
+ **bof**: a simple fuzzer (not seriosuly) with detection of BOF checking if the return address is tainted
