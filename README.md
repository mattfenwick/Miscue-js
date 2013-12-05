WhyIsMyJsonBorked
=================

An open source JSON validator, committed to providing the most complete
and accurate reporting of errors and warnings.

## How do I get started? ##

This is a JavaScript application that runs in your 
web browser -- try it out [here](http://mattfenwick.github.io/WhyIsMyJsonBorked/)!

## How does it work? ##

There are two main phases:

 1. **parsing** -- recognizes the tree structure
    of the JSON text.  Since every parse error is fatal,
    parsing stops at the first error and gives an informative
    error report.

 2. **semantic checks** -- checks for duplicate keys,
    number overflow, and number underflow.  Reports every problem
    found in the JSON input.

## Why should I use this? ##

I designed and implemented this JSON validator because of two major
inadequacies in every other JSON validator I've used:  

 1. the error reports don't mention the actual problem
 2. not all problems are reported

These problems are addressed by:

 - a novel error reporting strategy that includes a trace of the 
   parsing progress which is dumped immediately upon detection of
   a syntax error
 - a second (semantic) pass, if parsing completes successfully, that
   checks for problems which are outside the scope of the JSON spec

## A short list of common JSON errors ##

Parse errors:

 - unclosed strings, arrays, and objects
 - leading `0`s in numbers
 - invalid character escapes such as `\q` in strings
 - control characters (0 - 31) in strings
 - missing/extra separators (`:` and `,`)

Semantic errors:

 - number overflow
 - number underflow 
 - duplicate keys in objects
