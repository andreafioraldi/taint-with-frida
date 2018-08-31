import frida

with open("taint.js") as f:
    code = f.read()

pid = frida.spawn(["./foo", "4"])

session = frida.attach(pid)

script = session.create_script(code)

script.load()

frida.resume(pid)

raw_input()
