import frida

with open("foo_compiled.js") as f:
    code = f.read()

pid = frida.spawn(["./bin/foo", "A"*30])
session = frida.attach(pid)
session.enable_jit()

script = session.create_script(code)
script.load()

frida.resume(pid)

raw_input()
