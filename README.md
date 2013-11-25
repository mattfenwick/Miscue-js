WhyIsMyJsonBorked
=================

Try it out [here](http://mattfenwick.github.io/WhyIsMyJsonBorked/).

The parsing runs in two phases:

 1. concrete syntax parsing -- recognizes the tree structure
    of the JSON text.  Any error in this phase is fatal, since
    the structure of the tree can no longer be simply and 
    reliably determined.

 2. abstract syntax tree construction -- checks for problems
    that do not affect the tree structure while building an
    abstract representation

Some of the errors reported in phase 1:

 - unclosed strings/arrays/objects
 - missing separators -- `:` or `,`
 - object keys are strings

Some of the errors/warnings reported in phase 2:

 - leading 0's in integer portion of number (unless the number is `0`)
 - number overflow/underflow
 - duplicate keys in objects
 - illegal control characters in strings
 - valid escape sequences
