def _typhon_format(value):
    return "null" if value is None else str(value)
def add(a, b):
    return a + b
def greet(name):
    print(_typhon_format(name))
def secret():
    print(_typhon_format("priv"))
s = add(1, 2)
print(_typhon_format(s))
greet("hi")
secret()
