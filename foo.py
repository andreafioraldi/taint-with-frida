import frida

import time
import os

def wait_polling(pid):
    try:
        while True:
            try:
                os.kill(pid, 0) #signal 0 does nothing
            except OSError:
                return
            time.sleep(1)
    except KeyboardInterrupt:
        exit(1337)

with open("foo_compiled.js") as f:
    code = f.read()

pid = frida.spawn(["./bin/foo"])
session = frida.attach(pid)
session.enable_jit()

script = session.create_script(code)
script.load()

frida.resume(pid)

wait_polling(pid)


