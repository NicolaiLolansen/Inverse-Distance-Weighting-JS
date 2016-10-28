/*IDW JS 
Author: Nicolai Mogensen

Input: bbox ({xmin: xmax: ymin: ymax: }),
       dim (Power of 2, like 16, 32, 64 etc.),
       list of known points ([{x: y: val:}, {x: y: val: }],
       A power function: p
       A Canvas ID: canvasID
       
       Initializes like this:
       var IDW = new IDW(bbox,dim,points,type);
       IDW.calculateMatrix();
       
Output: Canvas appended to body with grayscale Image of the IDW 
       */


function IDW(bbox, dim, points,p,canvasID) {
    this.bbox = bbox;
    this.dim = dim;
    this.points = points;
    this.p = p;
    this.canvasID = canvasID;

    this.calculateMatrix = function () {
        for (var i = 0; i < this.points.length; i++) {
            canvPoint = toCanvas(this.points[i].x, this.points[i].y);
            this.points[i] = { x: canvPoint.x, y: canvPoint.y, val: this.points[i].val };
        }

        var matrix = []
        for (var i = 0; i < this.dim; i++) {
            matrix[i] = [];
            for (var j = 0; j < this.dim; j++) {
                var val = calcVal({ x: i, y: j, val: 0 }, this.points, this.p);
                matrix[i].push(val);
            }
        }



        var canvas = document.createElement("canvas");
        canvas.id = canvasID;
        canvas.width = this.dim;
        canvas.height = this.dim;


        var ctx = canvas.getContext("2d");
        var imgData = ctx.createImageData(this.dim, this.dim);
        var y = -1;
        for (var i = imgData.data.length; i > 0; i -= 4) {
            x = i / 4 % dim;
            if (x == 0) {
                y++;
            }
            imgData.data[i + 0] = matrix[x][y];
            imgData.data[i + 1] = matrix[x][y];
            imgData.data[i + 2] = matrix[x][y];
            imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        document.body.appendChild(canvas);

        function calcVal(v, points,p) {
            var top = 0;
            var bot = 0;

            for (var i = 0; i < points.length; i++) {
                dist = calcDist(v, points[i]);
                top += points[i].val / Math.pow(dist, p);
                bot += 1 / Math.pow(dist, p);
            }
            if (bot == 0) { //When the distance between point and sensor is 0 (the point IS the sensor) Gives black spots, so fix this   
                return top;
            } else {
                return (top / bot);
            }
        }

        function calcDist(p, q) {
            return (Math.sqrt( Math.pow((q.x-p.x),2) + Math.pow((p.y-q.y),2)));
        }
        
        //Translates UTM32 Coordinate (or any other coordinate system) to local canvas space

        function toCanvas (x, y) {
            var xmin = bbox.xmin;
            var ymin = bbox.ymin;
            var xmax = bbox.xmax;
            var ymax = bbox.ymax;

            var widthP = dim;
            var heightP = dim;

            var widthM = xmax - xmin;
            var heightM = ymax - ymin;
            
            var factorX = widthP / widthM;
            var factorY = heightP / heightM;

            var ptx = widthP - ((xmax - x) * factorX);
            var pty = heightP - ((ymax - y) * factorY);

            return { x: ptx, y: pty }
        }

        return matrix
    }
}
       
