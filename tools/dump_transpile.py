from pathlib import Path
from transpiler.transpiler import transpile
p = Path('examples/hello.typhon')
print('Transpiling', p)
text = p.read_text(encoding='utf-8')
print('\n--- Typhon source ---\n')
print(text)
print('\n--- Generated Python ---\n')
print(transpile(text))
