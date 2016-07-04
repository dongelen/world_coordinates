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
    Rectangle.prototype.drawOnCanvas = function (transformer, canvas) {
        var context = canvas.getContext("2d");
        context.beginPath();
        var leftBottom = transformer.translatePoint({ x: this.myStartPoint.x, y: this.myStartPoint.y });
        var rightBottom = transformer.translatePoint({ x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y });
        var rightTop = transformer.translatePoint({ x: this.myStartPoint.x + this.mySize.width, y: this.myStartPoint.y + this.mySize.height });
        var leftTop = transformer.translatePoint({ x: this.myStartPoint.x, y: this.myStartPoint.y + this.mySize.height });
        context.moveTo(leftBottom.x, leftBottom.y);
        context.lineTo(rightBottom.x, rightBottom.y);
        context.lineTo(rightTop.x, rightTop.y);
        context.lineTo(leftTop.x, leftTop.y);
        context.closePath();
        // context.fill();
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
        context.strokeStyle = '#003300';
        context.stroke();
    };
    return Circle;
}(Shape));
var Transformer = (function () {
    function Transformer() {
        this.canvasSize = null;
    }
    Transformer.prototype.translatePoint = function (p) {
        var x = p.x * this.canvasSize.width;
        var y = (1 - p.y) * this.canvasSize.height;
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
    HorizontalMirrorTransformer.prototype.translatePoint = function (p) {
        var x = (1 - p.x) * this.canvasSize.width;
        var y = (1 - p.y) * this.canvasSize.height;
        return { x: x, y: y };
    };
    HorizontalMirrorTransformer.prototype.translateCenterPoint = function (p, s) {
        var x = (1 - p.x - 0.5 * s.width) * this.canvasSize.width;
        var y = (1 - p.y - s.height / 2) * this.canvasSize.height;
        return { x: x, y: y };
    };
    return HorizontalMirrorTransformer;
}(Transformer));
var RotateTransformer = (function (_super) {
    __extends(RotateTransformer, _super);
    function RotateTransformer(angleInDeg) {
        if (angleInDeg === void 0) { angleInDeg = 10; }
        _super.call(this);
        this.angleInDeg = angleInDeg;
        this.angleToRotateInDeg = 10;
        this.angleToRotateInDeg = angleInDeg;
    }
    // Hoek uitrekenen tot boven scharnierpunt
    // Lengte uitrekenen
    // Nieuw punt uitrekenen aan de hand daarvan
    RotateTransformer.prototype.translatePoint = function (p) {
        var upperLeft = { x: -0.01, y: 1.01 };
        var sideA = upperLeft.y - p.y;
        var sideB = upperLeft.x + p.x;
        var sideC = Math.sqrt(sideA * sideA + sideB * sideB);
        var differenceInRad = this.angleToRotateInDeg / 180 * Math.PI;
        var angleInRad = Math.atan(sideA / sideB);
        var angleToRotateInRad = angleInRad + differenceInRad;
        var sideANew = upperLeft.x + Math.cos(angleToRotateInRad) * sideC;
        var sideBNew = upperLeft.y - Math.sin(angleToRotateInRad) * sideC;
        window.console.log({ sideC: sideC, x: sideANew, y: sideBNew });
        return _super.prototype.translatePoint.call(this, { x: sideANew, y: sideBNew });
    };
    return RotateTransformer;
}(Transformer));
var DrawArea = (function () {
    function DrawArea(canvas, transformer) {
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
var r1 = new Rectangle({ x: 0.5, y: 0.5 }, { width: 0.2, height: 0.2 });
var r2 = new Rectangle({ x: 0.3, y: 0.5 }, { width: 0.2, height: 0.2 });
var r3 = new Rectangle({ x: 0.3, y: 0.8 }, { width: 0.2, height: 0.2 });
var r4 = new Rectangle({ x: 0.5, y: 0.8 }, { width: 0.2, height: 0.2 });
var r5 = new Rectangle({ x: 0.5, y: 0.9 }, { width: 0.2, height: 0.2 });
var c1 = new Circle({ x: 0.1, y: 0.1 }, { width: 0.1, height: 0.1 });
var canvas1 = document.getElementById("tekenvlak1");
var canvas2 = document.getElementById("tekenvlak2");
var canvas3 = document.getElementById("tekenvlak3");
var drawArea1 = new DrawArea(canvas1, new RotateTransformer());
var drawArea2 = new DrawArea(canvas2, new Transformer());
var drawArea3 = new DrawArea(canvas2, new RotateTransformer(-10));
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
