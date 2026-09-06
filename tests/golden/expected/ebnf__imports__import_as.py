def _typhon_format(value):
    return "null" if value is None else str(value)
import tkinter as tk
print(_typhon_format(tk))
