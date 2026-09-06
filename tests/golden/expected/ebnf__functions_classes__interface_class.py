from abc import ABC, abstractmethod
def _typhon_format(value):
    return "null" if value is None else str(value)
class Startable(ABC):
    @abstractmethod
    def start(self):
        pass

class Car(Startable):
    name = ''
    def __init__(self, name=''):
        self.name = name

    def start(self):
        print(_typhon_format(f"{_typhon_format(self.name)} start"))

c = Car("Dacia")
c.start()
s = c
s.start()
