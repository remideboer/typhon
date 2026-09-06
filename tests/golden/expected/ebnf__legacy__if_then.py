def _typhon_format(value):
    return "null" if value is None else str(value)
x = 1
if x > 0:
    print(_typhon_format("pos"))
else:
    print(_typhon_format("nonpos"))
