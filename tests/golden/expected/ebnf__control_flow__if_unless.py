def _typhon_format(value):
    return "null" if value is None else str(value)
x = 10
y = 20
if x < y:
    print(_typhon_format("lt"))
elif x == y:
    print(_typhon_format("eq"))
else:
    print(_typhon_format("gt"))
if not (x > 100):
    print(_typhon_format("unless"))
if not (x > 100):
    print(_typhon_format("ifnot"))
