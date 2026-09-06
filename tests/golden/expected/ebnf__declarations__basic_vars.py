def _typhon_format(value):
    return "null" if value is None else str(value)
x = 10
y = 2.5
z = 30
MAX = 100
fixed = 1 + 2
print(_typhon_format(x))
print(_typhon_format(y))
print(_typhon_format(z))
print(_typhon_format(MAX))
print(_typhon_format(fixed))
