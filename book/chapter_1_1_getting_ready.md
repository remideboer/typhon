# 1.1. Getting ready

Before you write programs, you need two things on your computer:

1. A **compiler** — here, the Typhon toolchain that turns `.typhon` text into
   Python and runs it.
2. An **editor** — [Cursor](https://cursor.com/) or [VS Code](https://code.visualstudio.com/)
   with the **Typhon Language Support** extension.

## Install the editor extension

1. Open this repository in Cursor or VS Code.
2. Install the Typhon extension (from the VSIX in `typhon-language/`, or via
   `python -m transpiler install extension` from the repo root).
3. Reload the window when prompted.

`.typhon` files should get syntax highlighting. The extension bundles the
transpiler so you can Run and see diagnostics without a separate global
install for day-to-day editing.

## Check the command line

Open a terminal in the repository root and run:

```shell
python -m transpiler --help
```

You should see Typhon commands (`run`, `transpile`, and others). If Python
cannot find the module, make sure your working directory is the
`python-transpiler` repo and that you are using the project’s Python
environment.

## Your first run

Create a file `hello.typhon` anywhere convenient (for example under a
personal scratch folder) with:

```typhon
print("Hello, world!")
```

Output:

```text
Hello, world!
```


Run it:

```shell
python -m transpiler run hello.typhon
```

You should see `Hello, world!` on the screen.

> Typhon runs **top-level** statements in the file from top to bottom. You do
> not need a special `main` function for a program to start — unlike C#
> or Java. We will meet functions soon; calling one is always explicit.

## If something fails

- **Unknown command / module** — confirm you are in the repo and Python
  can import `transpiler`.
- **Red squiggles in the editor** — read the message; early errors are
  usually missing braces, typos in keywords, or a type mismatch.
- **Extension not active** — check that the language mode for the file is
  `typhon` (see the status bar).

### Exercise

> Create `hello.typhon`, change the text inside the quotes to your own name,
> run it, and confirm the terminal shows exactly what you typed.

---

[Previous: Preface](preface.md) · [Next: Back to the basics](basics.md)
