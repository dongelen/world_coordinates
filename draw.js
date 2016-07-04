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
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        _super.apply(this, arguments);
    }
    Circle.prototype.drawOnCanvas = function (tansformer, canvas) {
        var translatedPoint = tansformer.translateCenterPoint(this.myStartPoint, this.mySize);
        var translatedSize = tansformer.translateSize(this.mySize);
        var context = canvas.getContext("2d");
        context.beginPath();
        context.arc(translatedPoint.x, translatedPoint.y, translatedSize.width / 2, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
    };
    return Circle;
}(Shape));
var Transformer = (function () {
    function Transformer() {
        this.canvasSize = null;
    }
    Transformer.prototype.translateUpperLeft = function (p, s) {
        var x = p.x * this.canvasSize.width;
        var y = (1 - p.y - s.height) * this.canvasSize.height;
        return { x: x, y: y };
    };
    Transformer.prototype.translateCenterPoint = function (p, s) {
        var x = (p.x + 0.5 * s.width) * this.canvasSize.width;
        var y = (1 - p.y - s.height / 2) * this.canvasSize.height;
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
var HorizontalMirrorTransformer = (function (_super) {
    __extends(HorizontalMirrorTransformer, _super);
    function HorizontalMirrorTransformer() {
        _super.apply(this, arguments);
    }
    HorizontalMirrorTransformer.prototype.translateUpperLeft = function (p, s) {
        var x = (1 - p.x - s.width) * this.canvasSize.width;
        var y = (1 - p.y - s.height) * this.canvasSize.height;
        return { x: x, y: y };
    };
    HorizontalMirrorTransformer.prototype.translateCenterPoint = function (p, s) {
        var x = (1 - p.x - 0.5 * s.width) * this.canvasSize.width;
        var y = (1 - p.y - s.height / 2) * this.canvasSize.height;
        return { x: x, y: y };
    };
    return HorizontalMirrorTransformer;
}(Transformer));
var DrawArea = (function () {
    function DrawArea(canvas, transformer) {
        if (transformer === void 0) { transformer = new Transformer(); }
        this.shapes = [];
        this.myCanvas = null;
        this.myCanvas = canvas;
        transformer.canvasSize = { width: canvas.width, height: canvas.height };
        this.myTransformer = transformer;
    }
    DrawArea.prototype.addShape = function (shape) {
        this.shapes.push(shape);
    };
    DrawArea.prototype.drawOnCanvas = function () {
        for (var _i = 0, _a = this.shapes; _i < _a.length; _i++) {
            var shape = _a[_i];
            shape.drawOnCanvas(this.myTransformer, this.myCanvas);
        }
    };
    return DrawArea;
}());
var r1 = new Rectangle({ x: 0, y: 0 }, { width: 1, height: 1 });
var r2 = new Rectangle({ x: 0, y: 0 }, { width: 0.5, height: 0.5 });
var r3 = new Rectangle({ x: 0.75, y: 0.75 }, { width: 0.1, height: 0.1 });
var c1 = new Circle({ x: 0.5, y: 0.5 }, { width: 0.1, height: 0.1 });
var canvas1 = document.getElementById("tekenvlak1");
var canvas2 = document.getElementById("tekenvlak2");
var drawArea1 = new DrawArea(canvas1);
var drawArea2 = new DrawArea(canvas2, new HorizontalMirrorTransformer());
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
