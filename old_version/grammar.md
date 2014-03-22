## JSON grammar ##

    Json     :=  Object  |  Array

    Value    :=  'false'  |  'null'  |  'true'  |  
                  Object  |  Array   |  Number  |  
                  String
 
    Object   :=  '{'  sepBy0(KeyVal, ',')  '}'
    
    KeyVal   :=  String  ':'  Value
 
    Array    :=  '['  sepBy0(Value, ',')  ']'
 
    Number   :=  '-'{?}  int  frac{?}  exp{?}
      int    :=  /(0|[1-9][0-9]*)/
      frac   :=  /\.[0-9]+/
      exp    :=  /[eE][-+]?[0-9]+/
 
    String   :=  '"'  ( Char  |  Escape  |  Unicode ){*}  '"'

    Char     :=  not1( '\\'  |  '"'  |  \u0000-\u001F )

    Escape   :=  /\\["\\/bfnrt]/                             <-- that's 8 characters

    Unicode  :=  /\\u[0-9a-eA-E]{4}/
