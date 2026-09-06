def _typhon_format(value):
    return "null" if value is None else str(value)
# line comment only
print(_typhon_format(1))
print(_typhon_format(2))
