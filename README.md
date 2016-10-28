# Inverse-Distance-Weighting-JS
Inverse Distance Weighting for JavaScript

Small JavaScript function that calculates an IDW and paints a grayscale canvas. 

The algorithm is explained here: https://en.wikipedia.org/wiki/Inverse_distance_weighting

Function IDW:
Takes a boundingbox, canvas dimensions, a list of points, a power factor and an id which will be assigned to the canvas created by the IDW function

How to use:
Include script in your HTML head 
```html
<!doctype html>
<html>
<head>

  <script scr="idwJS.js"></script>
  ...
</head>
</body>
</html>
```

```javascript
var idw = new IDW(bbox, dim, points, 2, "idw-canvas");
idw.calculateMatrix();
```

Used for calculating IDW in my Three.js project. Uses UTM32 coordinates from air quality sensors. You might need to change some things if you want to use it in your own project (add css, or append the canvas to something other than the body)
