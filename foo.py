import frida

with open("taint.js") as f:
    code = f.read()
code += "\n"
with open("foo.js") as f:
    code += f.read()

pid = frida.spawn(["./bin/foo", "A"*30])
session = frida.attach(pid)
session.enable_jit()

script = session.create_script(code)
script.load()

frida.resume(pid)

raw_input()
