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




// Achieve the following co-ordinate system
// 
// xmin             xmax 
// +----------------+ ymax
// |    ^           |
// | +y |           |
// |    |           |
// |    +-------->  |
// |          +x    |
// +----------------+ ymin
//
// The coordinate system is achieved by reflect y axis, translate tx = -xmin, ty = -ymin                
function Canvas(container, xmin, xmax, ymin, ymax) {

    this.svgE = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svgE.setAttribute('version', '1.1');
    this.svgE.setAttribute('width', parseInt(xmax - xmin));
    this.svgE.setAttribute('height', parseInt(ymax - ymin));

    this.canvas = this.svgE.ownerDocument.createElementNS('http://www.w3.org/2000/svg','g');                
    this.canvas.setAttribute('transform', "matrix(1,0,0,-1," + parseInt(xmin*-1) + "," + parseInt(ymax) + ")");

    this.svgE.appendChild(this.canvas);
    container.appendChild(this.svgE);                
}

Canvas.prototype.clear = function() {                
    while (this.canvas.firstChild) {
        this.canvas.removeChild(this.canvas.firstChild);
    }
}

Canvas.prototype.drawSurfaces = function(surfaceArray) {

    for(var j = 0; j < surfaceArray.length; j++) {
        var face = surfaceArray[j];
        var pathNode = this.svgE.ownerDocument.createElementNS('http://www.w3.org/2000/svg','path');                    
        Canvas.drawFace(pathNode, face);

        /*
        // TODO code for unit testing
        if(pathNode.addEventListener) {
            myconsole.log("Event listener supported");
        } else {
            myconsole.error("Event listener not supported");
        }
            */

        pathNode.refFace = face;

        pathNode.addEventListener("click", face.onclick);

        this.canvas.appendChild(pathNode);

    }
}

Canvas.prototype.drawMesh = function(mesh) {

    var surfaceArray = Canvas.getVisibleSurfaces(mesh);

    this.drawSurfaces(surfaceArray);

}


Canvas.drawFace = function (node, face) { 

    //node.setAttribute("visibility",visibile);

    var va = face.getVertexArray();
    var ll = va.length;
    var ss="M "+va[0].x+" "+va[0].y+" ";    // moveto x[0], y[0]
    for (var i=1; i<ll; i++) { 
        ss+="L "+va[i].x+" "+va[i].y+" ";   // lineto x[i], y[i]
    }
    ss+="Z";                               // closepath
    node.setAttribute("d", ss);

    var color = face.opacity_?face.faceColor_:"none";
    node.setAttribute("fill", color);                
    node.setAttribute("stroke", face.edgeColor_);
    node.setAttribute("stroke-width", face.edgeWeight_);
}


Canvas.getVisibleSurfaces = function(mesh) {

    var faces = mesh.getFaceArray();

    faces.sort(function(a,b){
        return (a.lowerBound.z - b.lowerBound.z);
    });

    return faces;
}




// TODO delete
function drawShape(aShape, visibile, xarr, yarr, fillColor, strokeColor, strokeWeight)
{ 

    var llx = xarr.length;
    var lly = yarr.length;

    if(llx != lly) {
        alert("Error ll != lly");
    }

    // set path visibility
    aShape.setAttribute("visibility",visibile);

    // draw the path
    var ss="M "+parseInt(xarr[0])+" "+parseInt(yarr[0])+" ";    // moveto x[0], y[0]
    for (var i=1; i<llx; i++) { 
        ss+="L "+parseInt(xarr[i])+" "+parseInt(yarr[i])+" ";   // lineto x[i], y[i]
    }
    ss+="Z";                                                    // closepath
    aShape.setAttribute("d", ss);

    fillColor = fillColor?fillColor:"none";
    aShape.setAttribute("fill", fillColor);

    strokeColor = strokeColor?strokeColor:"none";                
    aShape.setAttribute("stroke", strokeColor);
    aShape.setAttribute("stroke-width", parseInt(strokeWeight));
}