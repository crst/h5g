H5G
---
An attempt to write a DSL to generate HTML in JavaScript.


Examples:

```javascript
div({'id': 'content', 'class': 'main content'})
  .h1('The Caption').x()
  .content('Some text.')
  .hr()
  .content('Some more text with an ')
  .i({'class': 'emphasize'}, 'important word').x()
  .content(' and even more text.')
.x()

document.writeln(h);
```

```javascript
table()
  .tr().th('A').x().th('B').x().x()
  for (var i = 1; i <= 5; i++) {
    h.tr({'class': i % 2 ? 'odd' : 'even'}).td('' + i).x().td('' + i * 2).x().x()
  }
h.x()
 
document.writeln(h);
```
