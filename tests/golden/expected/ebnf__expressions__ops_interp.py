def _typhon_format(value):
    return "null" if value is None else str(value)
a = 3
b = 5
print(_typhon_format(a + b))
print(_typhon_format("sum: " + str(a) + str(b)))
print(_typhon_format(a > 1 and b < 10))
print(_typhon_format(a < 1 or b > 1))
print(_typhon_format(not (a == 0)))
f = 3.14
casted = int(f)
print(_typhon_format(casted))
print(_typhon_format(f"a is {_typhon_format(a)}"))
print(_typhon_format(f"{_typhon_format(a)} typed"))
print(_typhon_format(f"the # hash"))
