Miscue-js
=================

Miscue-js provides a free, easy-to-use JSON validation service.

It is committed to providing complete
and accurate reporting of errors and warnings.

This is an open source project under the MIT license.


## Getting started ##

[Try me out](http://mattfenwick.github.io/Miscue-js/)! 
(requires JavaScript)


## Motivation and Design ##

My main goal in building this application is a JSON validator which:

 - reports all errors -- or as many as possible in case of malformed input
 - reports as much relevant information about the errors as possible, 
   especially the cause and the location

Since the what (i.e. what input triggers an error) and the
how (i.e. what information is reported with an error) of
JSON error-reporting is not specified in [RFC 4627](http://www.ietf.org/rfc/rfc4627.txt), 
I came up with my own definition.  There are three main pieces: 

 - **syntax errors** -- derived from inspecting [the grammar](grammar.md).
   Some examples include (not an exhaustive list):
 
   - unclosed strings, arrays, and objects
   - leading `0`s in numbers
   - invalid character escapes such as `\q` in strings
   - control characters (0 - 31) in strings
   - missing/extra separators (`:` and `,`)

   Since the parser is LL, the first syntax error stops parsing.

 - **semantic errors** -- legal according to RFC 4627, but troublesome
   in practice:

   - duplicate keys in objects
   - number overflow
   - number underflow 
   
   All semantic errors are reported on a single pass.

 - **location reporting** -- reports a stack trace of all the pending rules
   when the error is detected.  For example, parsing this malformed snippet:
    
        { 
          "abc": "
    
   yields an error report something like this:

        Parse error trace:
          json at line 1, column 1
          object at line 1, column 1
          key/value pair at line 2, column 3
          string at line 2, column 10
          double-quote at line 2, column 11
    
   Each pending rule includes its location to help you quickly track down
   the problem.
          
## Contributions ##

Feedback of any kind is [welcome](https://github.com/mattfenwick/Miscue-js/issues)!
