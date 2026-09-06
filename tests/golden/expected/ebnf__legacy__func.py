def _typhon_format(value):
    return "null" if value is None else str(value)
def greet(name):
    print(_typhon_format(name))
greet("hi")
