from abc import ABC, abstractmethod
def _typhon_format(value):
    return "null" if value is None else str(value)
# Curated OO + control sample (no MySQL / no sibling vehicle imports)
x = 10
y = 20
print(_typhon_format(f"x={_typhon_format(x)} y={_typhon_format(y)}"))
for _typhon_b1_i in range(0, 2):
    print(_typhon_format(_typhon_b1_i))

if x < y:
    print(_typhon_format("lt"))
else:
    print(_typhon_format("ge"))

def mul(a, b):
    return a * b

print(_typhon_format(mul(3, 4)))
class Named(ABC):
    @abstractmethod
    def label(self):
        pass

class Point(Named):
    x = 0
    y = 0
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def label(self):
        return f"({_typhon_format(self.x)},{_typhon_format(self.y)})"

p = Point(1, 2)
print(_typhon_format(p.label()))
