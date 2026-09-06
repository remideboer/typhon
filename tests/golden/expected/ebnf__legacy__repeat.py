def _typhon_format(value):
    return "null" if value is None else str(value)
for _ in range(3):
    print(_typhon_format("hi"))
