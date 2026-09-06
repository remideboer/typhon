def _typhon_format(value):
    return "null" if value is None else str(value)
msg = "café"
print(_typhon_format(msg))
