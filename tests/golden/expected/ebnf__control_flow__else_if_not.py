def _typhon_format(value):
    return "null" if value is None else str(value)
x = 1
if not (x == 0):
    print(_typhon_format("nz"))
elif not (x > 10):
    print(_typhon_format("small"))
else:
    print(_typhon_format("other"))
