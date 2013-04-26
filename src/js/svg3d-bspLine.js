// svg3d is a JavaScript library for rendering 3D-models in SVG.
// Copyright (C) 2013  Rishin Goswami
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

//require('gl-matrix.js');





var lines = [];
lines[0] = [0, 0, 2.5, 0];  // A
lines[1] = [0, 1, 0, -1];   // B
lines[2] = [4, 2, 2, -2];   // C
lines[3] = [-2, 2, 0.5, -3]; // D


// Max scaling in canvas
var CV = 100;
var CL = 30;

var baseColor = 0x10;
var meshArr = [];
var bsplineArr = [];

function bspline() {
};

bspline.prototype.root_ = null;

bspline.prototype.canv_ = null;

bspline.prototype.add  = function(lineArr) {
    this.root_ = lineArr[0];
    
    var splitted = this.split(lineArr);
    
    {
        var bsplineMesh = new Mesh3D();
        
        var l = lineArr[0];
        
        bsplineMesh.addFace(Mesh3D.Vertex.asVertexArray([ 
            l[0]*CL,l[1]*CL,0, 
            l[2]*CL,l[3]*CL,0, 
            l[0]*CL,l[1]*CL,100]), "#ffffff", 1, "#ff0000", 1);
        
        var color;
        baseColor += 0xf;
        color = "#" + baseColor.toString(16) + baseColor.toString(16) + "dd";
    
        for (var i = 0; i < splitted[0].length; i ++) {
            var l = splitted[0][i];            
            
            bsplineMesh.addFace(Mesh3D.Vertex.asVertexArray([ 
                l[0]*CL,l[1]*CL,0, 
                l[2]*CL,l[3]*CL,0, 
                l[0]*CL,l[1]*CL,100]), "#ffffff", 1, color, 1);
        }
        
        color = "#" + baseColor.toString(16) + "dd" + baseColor.toString(16);
        for (var i = 0; i < splitted[1].length; i ++) {
            var l = splitted[1][i];
            
            bsplineMesh.addFace(Mesh3D.Vertex.asVertexArray([ 
                l[0]*CL,l[1]*CL,0, 
                l[2]*CL,l[3]*CL,0, 
                l[0]*CL,l[1]*CL,100]), "#ffffff", 1, color, 1);
        }
        
        
        
        //console.log(bsplineMesh);
        meshArr.push(bsplineMesh);
        bsplineArr.push(splitted);
    }
    
    
    
    
    
    if (splitted[0].length > 0) {
        this.left_ = new bspline();
        this.left_.add(splitted[0]);
    } else {
        this.left_ = null;
    }
    
    if (splitted[1].length > 0) {
        this.right_ = new bspline();
        this.right_.add(splitted[1]);
    } else {
        this.right_ = null;
    }
    
};


bspline.prototype.split  = function(lineArr) {
    
    // HACK !!!  HACK !!!  HACK !!! 
    // Scaling to max so all lines intersect
    var line = [
    lineArr[0][0] * CV, lineArr[0][1] * CV,
    lineArr[0][2] * CV, lineArr[0][3] * CV
    ];
    
    
    
    var det_xyxy = mat2.determinant(line);
    var det_x1x1 = mat2.determinant([line[0], 1, line[2], 1]);
    var det_y1y1 = mat2.determinant([line[1], 1, line[3], 1]);
    
    var catA = [];
    var catB = [];
 
    
    for (var i = 1; i < lineArr.length; i++) {
        var l = lineArr[i];
        
        
        var detL_xyxy = mat2.determinant(l);
        var detL_x1x1 = mat2.determinant([l[0], 1, l[2], 1]);
        var detL_y1y1 = mat2.determinant([l[1], 1, l[3], 1]);
        
        var denominator = mat2.determinant([det_x1x1, det_y1y1, detL_x1x1, detL_y1y1]);
        var px = mat2.determinant([det_xyxy, det_x1x1, detL_xyxy, detL_x1x1]) / denominator;
        var py = mat2.determinant([det_xyxy, det_y1y1, detL_xyxy, detL_y1y1]) / denominator; 
        
        // Point on line and line facing normal
        if ((px > l[0] && px < l[2]) && (py > l[1] && py < l[3])) {
            catA.push([l[0], l[1], px, py]);
            catB.push([px, py, l[2], l[3]]);
        }
        // Point not on line
        else if ( ((px > l[0] && px > l[2]) || (px < l[0] && px < l[2]))  &&  ((py > l[1] && py > l[3]) || (py < l[1] && py < l[1])) ) {
            
        }
        // Point on line and line facing opposite to normal
        else {
            catB.push([l[0], l[1], px, py]);
            catA.push([px, py, l[2], l[3]]);
        }
        
        
    }
    
    //console.log([catA, catB]);
    
    return [catA, catB];
};

bspline.prototype.print = function(spacer) {
    
    console.log(spacer + this.root_ + "\n");    
    this.left_?this.left_.print(spacer + "  L:"):"null";
    this.right_?this.right_.print(spacer + "  R:"):"null";
};


//var mybspline = new bspline();


//mybspline.add(lines);


//mybspline.print("");

