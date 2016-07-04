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

    drawOnCanvas (tansformer : Transformer, canvas : HTMLCanvasElement) {
        let translatedPoint = tansformer.translateUpperLeft (this.myStartPoint, this.mySize);
        let translatedSize = tansformer.translateSize (this.mySize);


        let context = canvas.getContext ("2d");

        window.console.log (translatedPoint.x);
        window.console.log (translatedPoint.y);
        window.console.log (translatedSize.width);
        window.console.log (translatedSize.height);
        
        context.rect (translatedPoint.x, translatedPoint.y, 
            translatedSize.width,  translatedSize.height);

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
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    }    
}


class Transformer {
    public canvasSize : Size = null

    translateUpperLeft(p : Point, s : Size) : Point {
        let x = p.x * this.canvasSize.width;
        let y = (1 - p.y - s.height) * this.canvasSize.height;
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
    translateUpperLeft(p : Point, s : Size) : Point {
        let x = (1-p.x - s.width) * this.canvasSize.width;
        let y = (1 - p.y - s.height) * this.canvasSize.height;
        return {x: x, y: y};
    } 

    translateCenterPoint(p : Point, s : Size) : Point {
        let x = (1-p.x - 0.5 * s.width)* this.canvasSize.width;
        let y = (1 - p.y - s.height/2) * this.canvasSize.height;
        return {x: x, y: y};
    } 
}

class DrawArea {
    private shapes : Shape[] = [];
    private myCanvas : HTMLCanvasElement = null;
    private myTransformer : Transformer; 

    constructor (canvas : HTMLCanvasElement, transformer : Transformer = new Transformer()) {
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



let r1 = new Rectangle({x:0, y:0}, {width:1, height:1})
let r2 = new Rectangle({x:0, y:0}, {width:0.5, height:0.5})

let r3 = new Rectangle({x:0.75, y:0.75}, {width:0.1, height:0.1})

let c1 = new Circle ({x:0.5, y:0.5}, {width:0.1, height:0.1});

let canvas1 = document.getElementById("tekenvlak1")
let canvas2 = document.getElementById("tekenvlak2")

let drawArea1 = new DrawArea (<HTMLCanvasElement> canvas1);
let drawArea2 = new DrawArea (<HTMLCanvasElement> canvas2, new HorizontalMirrorTransformer());

drawArea1.addShape(r1);
drawArea1.addShape(r2);
drawArea1.addShape(r3);

drawArea1.addShape(c1);

drawArea1.drawOnCanvas();

// Mirror ding

drawArea2.addShape(r1);
drawArea2.addShape(r2);
drawArea2.addShape(r3);

drawArea2.addShape(c1);
drawArea2.drawOnCanvas();

