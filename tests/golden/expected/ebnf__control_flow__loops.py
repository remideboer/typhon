from array import array
def _typhon_format(value):
    return "null" if value is None else str(value)
for _typhon_b1_i in range(0, 3):
    print(_typhon_format(_typhon_b1_i))
counter = 0
while counter < 3:
    print(_typhon_format(counter))
    counter += 1
items = array('i', [10, 20])
for _typhon_b2_n in items:
    print(_typhon_format(_typhon_b2_n))
