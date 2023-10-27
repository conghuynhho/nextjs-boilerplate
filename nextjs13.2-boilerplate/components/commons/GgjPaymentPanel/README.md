# Business rules
```
on sale
  normal price
    with paid opt
      no adding paid opt
      adding paid opt
    without paid opt
    limit
    with paid opt + limit
  discount
    long price
    normal price
    with paid opt
      no adding paid opt
      adding paid opt
    without paid opt
    limit
    with paid opt + limit
pause sale
  normal price
  discount
  
Add to cart validation cases:
https://github.com/gogojungle/api.gogojungle.co.jp/blob/master/packages/skijan/src/modules/payment/README.md#1-add-to-cart----step-1
```
