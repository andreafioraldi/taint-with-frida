import frida

test = "A"*100
found = None

def on_message(message, data):
    #print message
    if message["type"] != "send": return
    
    global found
    if found == None:
        found = test

with open("bof_compiled.js") as f:
    code = f.read()

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
