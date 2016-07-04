var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Shape = (function () {
    function Shape(startPoint, size) {
        this.startPoint = startPoint;
        this.size = size;
        this.myStartPoint = startPoint;
        this.mySize = size;
    }
    Shape.prototype.drawOnCanvas = function (tansformer, canvas) {
    };
    return Shape;
}());
var Rectangle = (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle() {
        _super.apply(this, arguments);
    }
    Rectangle.prototype.drawOnCanvas = function (tansformer, canvas) {
        var translatedPoint = tansformer.translateUpperLeft(this.myStartPoint, this.mySize);
        var translatedSize = tansformer.translateSize(this.mySize);
        var context = canvas.getContext("2d");
        window.console.log(translatedPoint.x);
        window.console.log(translatedPoint.y);
        window.console.log(translatedSize.width);
        window.console.log(translatedSize.height);
        context.rect(translatedPoint.x, translatedPoint.y, translatedSize.width, translatedSize.height);
        context.stroke();
    };
    return Rectangle;
}(Shape));
var Transformer = (function () {
    function Transformer(size) {
        this.canvasSize = size;
    }
    Transformer.prototype.translatePoint = function (p) {
        var x = (1 - p.x) * this.canvasSize.width;
        var y = p.y * this.canvasSize.height;
        return p;
    };
    Transformer.prototype.translateUpperLeft = function (p, s) {
        var x = p.x * this.canvasSize.width;
        var y = (1 - p.y - s.height) * this.canvasSize.height;
        return { x: x, y: y };
    };
    Transformer.prototype.translateSize = function (s) {
        var w = this.canvasSize.width * s.width;
        var h = this.canvasSize.height * s.height;
        window.console.log("Width wordt " + w);
        return { width: w, height: h };
    };
    return Transformer;
}());
var DrawArea = (function () {
    function DrawArea(width, height, canvas) {
        this.width = width;
        this.height = height;
        this.shapes = [];
        this.myCanvas = null;
        this.mySize = { width: width, height: height };
        this.myCanvas = canvas;
    }
    DrawArea.prototype.addShape = function (shape) {
        this.shapes.push(shape);
    };
    DrawArea.prototype.drawOnCanvas = function () {
        var simpleTransformer = new Transformer(this.mySize);
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.drawOnCanvas(simpleTransformer, this.myCanvas);
        }
    };
    return DrawArea;
}());
var r1 = new Rectangle({ x: 0, y: 0 }, { width: 1, height: 1 });
var r2 = new Rectangle({ x: 0, y: 0 }, { width: 0.5, height: 0.5 });
var r3 = new Rectangle({ x: 0.75, y: 0.75 }, { width: 0.1, height: 0.1 });
var canvas1 = document.getElementById("tekenvlak1");
var canvas2 = document.getElementById("tekenvlak2");
var drawArea1 = new DrawArea(300, 300, canvas1);
var drawArea2 = new DrawArea(150, 150, canvas2);
drawArea1.addShape(r1);
drawArea1.addShape(r2);
drawArea1.addShape(r3);
drawArea1.drawOnCanvas();
drawArea2.addShape(r1);
drawArea2.addShape(r2);
drawArea2.addShape(r3);
drawArea2.drawOnCanvas();
