interface Point {
    x: number
    y: number
}

interface Size {
    width:number
    height:number
}

class Shape {
    protected myStartPoint : Point;
    protected mySize : Size;
    constructor (public startPoint: Point, public size: Size) {
        this.myStartPoint = startPoint;
        this.mySize = size;
    }

    drawOnCanvas (tansformer : Transformer, canvas : HTMLCanvasElement) {
        
    }
}

class Rectangle extends Shape {

    drawOnCanvas (transformer : Transformer, canvas : HTMLCanvasElement) {

        let context = canvas.getContext ("2d");

        context.beginPath();

        let leftBottom  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y});
        let rightBottom = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y});

        let rightTop = transformer.translatePoint ({x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y + this.mySize.height});
        let leftTop  = transformer.translatePoint ({x: this.myStartPoint.x, y: this.myStartPoint.y + this.mySize.height});

        context.moveTo(leftBottom.x, leftBottom.y);
        context.lineTo(rightBottom.x, rightBottom.y);
        context.lineTo(rightTop.x, rightTop.y);
        context.lineTo(leftTop.x, leftTop.y);
        context.closePath();
        // context.fill();

        context.stroke();
    }
}

class Circle extends Shape {
    drawOnCanvas (tansformer : Transformer, canvas : HTMLCanvasElement) {
        let translatedPoint = tansformer.translateCenterPoint (this.myStartPoint, this.mySize);
        let translatedSize = tansformer.translateSize (this.mySize);


        let context = canvas.getContext ("2d");

        
        context.beginPath();
        context.arc(translatedPoint.x, translatedPoint.y, translatedSize.width/2, 
            0, 2 * Math.PI, false);

        context.fillStyle = 'green';
        context.fill();
        context.strokeStyle = '#003300';
        context.stroke();
    }    
}


class Transformer {
    public canvasSize : Size = null

    translatePoint (p: Point){
        let x = p.x * this.canvasSize.width;
        let y = (1 - p.y) * this.canvasSize.height;
        return {x: x, y: y};        
    }


    translateCenterPoint(p : Point, s : Size) : Point {
        let x = (p.x + 0.5 * s.width)* this.canvasSize.width;
        let y = (1 - p.y - s.height/2) * this.canvasSize.height;
        return {x: x, y: y};
    } 

    translateSize (s : Size) : Size {
        let w = this.canvasSize.width * s.width;
        let h = this.canvasSize.height * s.height;

        window.console.log ("Width wordt " + w);
        return {width: w, height: h};
    }
}


class HorizontalMirrorTransformer extends Transformer{
    translatePoint(p : Point) : Point {
        let x = (1-p.x) * this.canvasSize.width;
        let y = (1 - p.y ) * this.canvasSize.height;
        return {x: x, y: y};
    } 

    translateCenterPoint(p : Point, s : Size) : Point {
        let x = (1-p.x - 0.5 * s.width)* this.canvasSize.width;
        let y = (1 - p.y - s.height/2) * this.canvasSize.height;
        return {x: x, y: y};
    } 
}

class RotateTransformer extends Transformer {
    public angleToRotateInDeg = 10;
    constructor (public angleInDeg=10) {
        super();
        this.angleToRotateInDeg = angleInDeg;
    }

    // Hoek uitrekenen tot boven scharnierpunt
    // Lengte uitrekenen
    // Nieuw punt uitrekenen aan de hand daarvan
    translatePoint(p : Point) : Point {
        let upperLeft : Point = {x: -0.01, y: 1.01}

        let sideA = upperLeft.y - p.y;
        let sideB = upperLeft.x + p.x ;
        let sideC = Math.sqrt (sideA * sideA + sideB * sideB);

        let differenceInRad = this.angleToRotateInDeg / 180 * Math.PI;
        let angleInRad = Math.atan (sideA / sideB);
        let angleToRotateInRad = angleInRad + differenceInRad;

        let sideANew = upperLeft.x + Math.cos (angleToRotateInRad) * sideC;
        let sideBNew = upperLeft.y - Math.sin (angleToRotateInRad) * sideC;
        
        window.console.log ({sideC:sideC, x:sideANew, y:sideBNew});
        return super.translatePoint({x: sideANew, y: sideBNew});
    } 


}


class DrawArea {
    private shapes : Shape[] = [];
    private myCanvas : HTMLCanvasElement = null;
    private myTransformer : Transformer; 

    constructor (canvas : HTMLCanvasElement, transformer : Transformer) {
       this.myCanvas = canvas;
       transformer.canvasSize = {width: canvas.width, height: canvas.height};
       
       this.myTransformer = transformer;       
    }

    addShape (shape : Shape) {
        this.shapes.push (shape);
    }

    drawOnCanvas () {
        for (let shape of this.shapes) {
            shape.drawOnCanvas (this.myTransformer, this.myCanvas);
        }
    }

}



let r1 = new Rectangle({x:0.5, y:0.5}, {width:0.2, height:0.2})
let r2 = new Rectangle({x:0.3, y:0.5}, {width:0.2, height:0.2})
let r3 = new Rectangle({x:0.3, y:0.8}, {width:0.2, height:0.2})
let r4 = new Rectangle({x:0.5, y:0.8}, {width:0.2, height:0.2})
let r5 = new Rectangle({x:0.5, y:0.9}, {width:0.2, height:0.2})
let c1 = new Circle({x:0.1, y:0.1}, {width:0.1, height:0.1});

let canvas1 = document.getElementById("tekenvlak1")

let canvas2 = document.getElementById("tekenvlak2")
let canvas3 = document.getElementById("tekenvlak3")

let drawArea1 = new DrawArea (<HTMLCanvasElement> canvas1, new RotateTransformer());
let drawArea2 = new DrawArea (<HTMLCanvasElement> canvas2, new Transformer());
let drawArea3 = new DrawArea (<HTMLCanvasElement> canvas2, new RotateTransformer(-10));

drawArea1.addShape(r1);
drawArea1.addShape(r2);
drawArea1.addShape(r3);
drawArea1.addShape(r4);
drawArea1.addShape(r5);
drawArea1.addShape(c1);

drawArea2.addShape(r1);
drawArea2.addShape(r2);

drawArea3.addShape(r1);
drawArea3.addShape(r2);

drawArea1.drawOnCanvas();
drawArea2.drawOnCanvas();
drawArea3.drawOnCanvas();
