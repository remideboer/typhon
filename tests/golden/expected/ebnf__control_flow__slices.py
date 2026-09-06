from array import array
def _typhon_format(value):
    return "null" if value is None else str(value)
arr = array('i', [1, 2, 3, 4, 5, 6, 7])
print(_typhon_format(arr[1:(5) + 1]))
print(_typhon_format(arr[1:(6) + 1:2]))
