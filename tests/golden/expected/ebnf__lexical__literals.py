def _typhon_format(value):
    return "null" if value is None else str(value)
print(_typhon_format(42))
print(_typhon_format(True))
print(_typhon_format(False))
print(_typhon_format(None))
f = 3.14
c = 'A'
s = "hello"
print(_typhon_format(f))
print(_typhon_format(c))
print(_typhon_format(s))
