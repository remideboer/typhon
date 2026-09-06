# 2.12.2. Spoiler — Structuring code

`mathUtils.typhon`:

```typhon
package function int double(int n) {
    return n * 2
}
```

*Declaration only — runs when another file imports and calls it.*



`app.typhon` (same folder):

```typhon
import double from mathUtils

print(double(21))
```

*Needs the companion `.typhon` file from the same section; then prints the call result.*



---

[Previous: Spoiler — input](basics_spoilers_input.md) · [Next: Spoiler — files](basics_spoilers_files.md)
