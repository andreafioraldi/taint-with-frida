import frida

test = "A"*100
found = None

def on_message(message, data):
    global found
    if found == None:
        found = test

with open("taint.js") as f:
    code = f.read()
code += "\n"
with open("bof.js") as f:
    code += f.read()

for i in xrange(10,100):
    if found:
        break
    
    test = "A"*i
    
    pid = frida.spawn(["./bin/bof", test])
    session = frida.attach(pid)
    session.enable_jit()
    
    script = session.create_script(code)
    script.on('message', on_message)
    script.load()

    frida.resume(pid)

import time
time.sleep(1)
print "input to generate the crash:", found
