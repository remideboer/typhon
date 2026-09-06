# T3 level C — conventional brief

## Situation

Team A owns `measures.typhon`. Team B owns `report.typhon` in the **same folder**.

Team B must:

- print a header via a function Team A exports  
- read a `global const` unit string (e.g. `"C"`) from Team A  

Team A also has an experimental helper that must remain file-private.

## Deliverable

Two `.typhon` files meeting the situation. Run `report.typhon` as the entry file.

## Done when

T3 success criteria hold; attempting to import the private helper fails on purpose.
