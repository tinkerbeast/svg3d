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



////require('collections.js');
//require('sylvester.js');
//require('gl-matrix.js');


Mesh.prototype.id_;

var SVG3D_EPSILON = 0.000001;

/**
 * Set of vertices
 *
 * @type {Set.<Mesh.Vertex>}
 * @private
 */

// NOTE: static initialization!!!!!!!!!!!!!!
// This is faster for multiple meshes
Mesh.prototype.vertexSet_;// = new collections.AssociativeSet();


/**
 * Set of normals
 *
 * @type {Set.<Mesh.Normal>}
 * @private
 */
Mesh.prototype.normalSet_;

/**
 * Array of faces
 *
 * @type {Array.<Mesh.Face>}
 * @private
 */
Mesh.prototype.faceList_;


/**
 *
 * @constructor
 */
function Mesh() {
    this.id_ = Math.random();
    this.vertexSet_ = new collections.AssociativeSet();
    this.normalSet_ = new collections.AssociativeSet();
    this.faceList_ = new Array();
};


/**
 * Add a face to the current mesh. A face is closed polygon of vertices. A face
 * also has colour and texture associated with it. 
 *
 * @param {Array.<Mesh.Vertex>} vertexArray array of vertices defining the face.
 * @param {string} faceColor face color.
 * @param {number} opacity the opacity of the face.
 * @param {string} edgeColor edge color. 
 * @param {number} edgeWeight edge weight. 
 * @param {Function} onlick click event handler // TODO emphasize
 * 
 * @return the id of the added face
 */
Mesh.prototype.addFace = function(vertexArray, faceColor, opacity, edgeColor, edgeWeight, onclick) {
    
    // Add all the vertices to the set of vertices in the mesh
    var l = vertexArray.length;
    for (var i = 0; i < l; i++) {
        this.vertexSet_.add(vertexArray[i]);
    }
    
        
    // Create the face to the list of faces
    var face = new Mesh.Face(vertexArray, faceColor, opacity, edgeColor, edgeWeight);
    ////alert(show_all_fields(face.normal));
    this.normalSet_.add(face.normal);
    
    face.onclick = onclick;
    
    return (this.faceList_.push(face) - 1);
};

Mesh.prototype.getFaceArray = function() {
    return this.faceList_;
}

Mesh.prototype.calculateBsp = function() {
    
    };

Mesh.prototype.bspSplit = function(faceArr) {
    
    var rootFace = faceArr[0];
    
    for (var i = 1; i < faceArr.length; i++) {
        
        }
    
    
};

Mesh.bspGetIntersection = function(face1, face2) {
    
    // We have to find:
    // * The line of intersection of 2 planes 
    // * Then check that line against intersection with polygon edges
    // INSTEAD:
    // * Let's make the polygon edge into a third plane
    //   The plane will have two points from polygon edge and thrird is [0,0,0]
    // * Then find the point of intersection the three planes
    
    var ret = [];
        
    var face = face1.vertexArray_.length >= face2.vertexArray_.length ? face2 : face1;
    
    var length = face.vertexArray_.length;
    for (var i = 0; i < length; i++) {
        
        var v1 = face.vertexArray_[i];        
        var v2 = face.vertexArray_[(i + 1) % length];
        
        // To avoid creating an existing plane, / colliding with an existing point
        
        // WARNING: There's a rare case where the 3rd plane might be one of the existing planes 
        // OR
        // The 3rd vertex chosen might me the same as exisiting vertices
        // TODO: fix the rare cases
        // TODO: make more efficient
        var v3 = new Mesh.Vertex(Math.random(), Math.random(), Math.random());
        
        //console.log(v1 + "  " + v2 + "  " + v3);
        var vec_v1_v2 = vec3.clone([v2.x - v1.x, v2.y - v1.y, v2.z - v1.z]);
        var vec_v1_v3 = vec3.clone([v3.x - v1.x, v3.y - v1.y, v3.z - v3.z]);
        
        // TODO use Mesh.Face() instead
        var face3 = {};
        face3.eqn = [];
        vec3.cross(face3.eqn, vec_v1_v2, vec_v1_v3);
        face3.eqn[3] =  face3.eqn[0]*v1.x + face3.eqn[1]*v1.y + face3.eqn[2]*v1.z;

        //console.log(face1.eqn + "   " + face2.eqn + "   " + [a, b, c, d]);
        
        // Linear equation of three planes in matrix form inversed
        var matA = mat3.clone([            
            face1.eqn[0], face1.eqn[1], face1.eqn[2], 
            face2.eqn[0], face2.eqn[1], face2.eqn[2],
            face3.eqn[0], face3.eqn[1], face3.eqn[2]
            ]);
        
        //console.log(mat3.str(matA));
        
        var matAInv = mat3.invert(matA, matA);
        
        //console.log(matAInv);
        
        
        // NOTE: 3 points don't necessarily meet at one point:
        // Two planes (which are not parallel) might intersect with a 3rd plane
        // at parallel lines        
        if (matAInv) {
        
            // TODO 3rd component
            var px = matAInv[0] * face1.eqn[3] + matAInv[1] * face2.eqn[3]  + matAInv[2] * face3.eqn[3] ;
            var py = matAInv[3] * face1.eqn[3] + matAInv[4] * face2.eqn[3]  + matAInv[5] * face3.eqn[3] ;
            var pz = matAInv[6] * face1.eqn[3] + matAInv[7] * face2.eqn[3]  + matAInv[8] * face3.eqn[3] ;
            
            //console.log(v1 + " to " + v2 + " -> " + px + "," + py + "," + pz);
        
            if (isNaN(px) || isNaN(py) || isNaN(pz)) {
                // Do nothing
                console.log(v1 + " to " + v2 + " -> " + px + "," + py + "," + pz);
            }
            else {
                
                // Correct floating point errors
                var rpx = Math.round(px);
                var rpy = Math.round(py);
                var rpz = Math.round(pz);                
                px = (Math.abs(rpx-px) < SVG3D_EPSILON)? rpx: px;
                py = (Math.abs(rpy-py) < SVG3D_EPSILON)? rpy: py;
                pz = (Math.abs(rpz-pz) < SVG3D_EPSILON)? rpz: pz;
                
                var vec_v1_p = vec3.clone([px - v1.x, py - v1.y, pz - v1.z]);
                var dotProduct = vec3.dot(vec_v1_p, vec_v1_v2);
                var squareLength = vec3.squaredLength(vec_v1_v2);
                
                // Point is on the given edge
                // TODO > and >= might cause floating point errors
                if (dotProduct >= 0 && squareLength >= dotProduct) {
                    console.log(v1 + " to " + v2 + " -> " + px + "," + py + "," + pz);                
                    ret.push(new Mesh.Vertex(px, py, pz));
                } else {
                    console.log(v1 + " to " + v2 + " XXXXX " + px + "," + py + "," + pz + "  (" + squareLength + ">" + dotProduct + "?)");
                }
            }
           
        } else {
            // TODO check if planes are equivalent, otherwise error            
            console.log("?, ?, ?");
        //throw Error();
        }
    }
    
    return ret;
};

Mesh.prototype.bspGetIntersectionOld = function(face1, face2) {
    
    // GENIUS: intersection of two bounded planes is in fact intersection of three planes
    
    
    var cross = vec3.create();
    
    var a1 = face1.eqn[0];
    var b1 = face1.eqn[1];
    var c1 = face1.eqn[2];
    var d1 = face1.eqn[3];
    
    var a2 = face2.eqn[0];
    var b2 = face2.eqn[1];
    var c2 = face2.eqn[2];
    var d2 = face2.eqn[3];
    
    // The direction vector of line of intersection
    vec3.cross(cross, [a1, b1, c1], [a2, b2, c2]);
    
    // The point of intersection of two planes at z = 0
    var inv = mat3.create();
    mat3.invert(inv, [a1, b1, a2, b2]);
    var x0 = inv[0]*d1 + inv[1]*d2;
    var y0 = inv[2]*d1 + inv[3]*d2;
    var z0 = 0;
    
    // There is no solution (parallel planes)
    if (isNaN(x0) || isNaN(y0) || isNaN(z0)) {
        return null;
    }
    
    // Equation of line
    // x = x0 + a0.t,  y = y0 + b0.t,  z = c0 + c0.t
    var a0 = cross[0];
    var b0 = cross[1];
    var c0 = cross[2];
    
    for (var i = 0; i < face1.vertexArray_.length; i++) {
        var v1 = face1.vertexArray_[i];
        
    }
    
    
    
    
};

/**
 * Dump the current vertices
 */
Mesh.prototype.dump = function() {
    
    
    //console.log("### Vertexes ###");
    var vertexes = this.vertexSet_.iterator();
    var str = "";
    for (var v in vertexes) {        
        str += " " + vertexes[v].toString();
    }    
    console.log("vertices:" + str);
};



/**
 *
 * @param {Array.<number>} transformMatrix a linear array treated as the matrix
 *                                         {t[0], t[1], t[2],  t[3]}
 *                                         {t[4], t[5], t[6],  t[7]}
 *                                         {t[8], t[9], t[10], t[11]}
 *                                         {0,    0,    0,     1}
 */
Mesh.prototype.transform = function(transformMatrix) {
    
    //assert(transformMatrix.length == 12)
    
    
    // ### Transform all the vertices
    
    var vertexIterator = this.vertexSet_.iterator();
    for (var objKey in vertexIterator) {            
        vertexIterator[objKey].transform(transformMatrix); 
    }
    
    // ### Transform all the normals
        
    // Create the normal transformation matrix
    var T = Matrix.create([
        [transformMatrix[0], transformMatrix[1], transformMatrix[2]],
        [transformMatrix[4], transformMatrix[5], transformMatrix[6]],
        [transformMatrix[8], transformMatrix[9], transformMatrix[10]],
        ]);
        
    var R = T.inverse().transpose();
    var r = [].concat(R.elements[0], R.elements[1], R.elements[2]);
    
    // Transform all the normals
    var normalIterator = this.normalSet_.iterator();
    for (var objKey in normalIterator) {
        normalIterator[objKey].multiply(r);
    }
    
    // ### Recalculate bounds for each surface
    
    var l = this.faceList_.length;
    for(var i = 0; i < l; i++) {
        this.faceList_[i].calculateBounds();
    }
    
};










/******************************************************************************/
/* Mesh.Vertex ****************************************************************/
/******************************************************************************/


/**
 * Constructs a vertex in a mesh.
 *
 * @param {number} x vertex x position.
 * @param {number} y vertex y position.
 * @param {number} z vertex z position.
 */
Mesh.Vertex = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.type = "Mesh.Vertex";
};

/**
 * Override the `toString` method to correct equals operation.
 */
Mesh.Vertex.prototype.toString = function() {
    return "["+this.x+","+this.y+","+this.z+"]";
};

/**
 * Transform the vertex based on a transformation matrix
 * @param {Array.<number>} t a linear array treated as the following 
 *                           transformation matrix
 *                             {t[0], t[1], t[2],  t[3] }
 *                             {t[4], t[5], t[6],  t[7] }
 *                             {t[8], t[9], t[10], t[11]}
 *                             {0,    0,    0,     1    }
 */
Mesh.Vertex.prototype.transform = function(t) {
    var vx = this.x;
    var vy = this.y;
    var vz = this.z;
    
    this.x = t[3] + t[0]*vx + t[1]*vy + t[2]*vz;
    this.y = t[7] + t[4]*vx + t[5]*vy + t[6]*vz;
    this.z = t[11] + t[8]*vx + t[9]*vy + t[10]*vz;
};

/**
 * Constructs an array of vertices from  a series of numbers.
 *
 * @param Array.<number> rawData Array of numbers from which to create the vertices. 
 */
Mesh.Vertex.asVertexArray = function(rawData) {
    var l = rawData.length;
    if(l%3 !=0) {
        throw new Error("Mesh.Vertex.asVertexArray: rawData must contain elements in multiple of 3");
    }
    
    // add all the vertices to the set of vertices in the mesh
    var vertexArray = [];
    for (var i = 0; i < l; i+=3) {        
        vertexArray.push(new Mesh.Vertex(rawData[i], rawData[i+1], rawData[i+2]));
    }
    
    return vertexArray;
};







/******************************************************************************/
/* Mesh.Normal ****************************************************************/
/******************************************************************************/

/**
 * Constructs a unit normal vector from the given vector.
 *
 * @param {number} x vector x unit.
 * @param {number} y vector y unit.
 * @param {number} z vector z unit.
 */
Mesh.Normal = function(x, y, z) {    
    this.x = x;
    this.y = y;
    this.z = z;
    this.toUnitNormal();
    
    this.type = "Mesh.Normal";
};

/**
 * Convert the vector to a unit normal
 * 
 * @note mutable
 * @private 
 */
Mesh.Normal.prototype.toUnitNormal = function() {
    var modl = Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    this.x = this.x/modl;
    this.y = this.y/modl;
    this.z = this.z/modl;
};

/**
 * Override the `toString` method to create correct collisions.
 */
Mesh.Normal.prototype.toString = function() {
    return "["+this.x+","+this.y+","+this.z+"]";
};

/**
 * Transform the normal based on a transformation matrix
 * @param {Array.<number>} t a linear array treated as the following 
 *                           transformation matrix
 *                           {t[0], t[1], t[2],  t[3] }
 *                           {t[4], t[5], t[6],  t[7] }
 *                           {t[8], t[9], t[10], t[11]}
 *                           {0,    0,    0,     1    }
 */
Mesh.Normal.prototype.transform = function(t) {
    /*
    // If SxN = 0  :N is the normal to S
    // And If S' = TxS  :T transforms S to S'
    // Then
    // N' = Tran(Inv(T)) x N
    // Where S'x N' = 0 :N' is the normal to S'
    
    var determinant =  (t[0]*(t[5]*t[10]-t[9]*t[6]))-(t[1]*(t[4]*t[10]-t[6]*t[8]))+(t[2]*(t[4]*t[9]-t[5]*t[8]));
    var invdet = 1/determinant;
    var r = []; // The inverse transposed matrix
    r[0] =  (t[5]*t[10]-t[9]*t[6])*invdet;
    r[3] = -(t[4]*t[10]-t[6]*t[8])*invdet;    
    r[6] =  (t[4]*t[9]-t[8]*t[5])*invdet;    
    r[1] = -(t[1]*t[10]-t[2]*t[9])*invdet;
    r[4] =  (t[0]*t[10]-t[2]*t[8])*invdet;
    r[7] = -(t[0]*t[9]-t[8]*t[1])*invdet;    
    r[2] =  (t[1]*t[6]-t[2]*t[5])*invdet;    
    r[5] = -(t[0]*t[6]-t[4]*t[2])*invdet;    
    r[8] =  (t[0]*t[5]-t[4]*t[1])*invdet;
        
     */
    var T = Matrix.create([
        [t[0],t[1],t[2]],
        [t[4],t[5],t[6]],
        [t[8],t[9],t[10]],        
        ]);
        
            
    var R = T.inverse().transpose();
    var r = Array.concat(R.elements[0], R.elements[1], R.elements[2]);
        
    var nx = this.x;
    var ny = this.y;
    var nz = this.z;
    
    this.x = r[0]*nx + r[1]*ny + r[2]*nz;
    this.y = r[3]*nx + r[4]*ny + r[5]*nz;
    this.z = r[6]*nx + r[7]*ny + r[8]*nz;
    
    this.toUnitNormal();  
};

/**
 * @param {Array} m an array representing a 3x3 matrix
 */
Mesh.Normal.prototype.multiply = function(m) {
        
    var nx = this.x;
    var ny = this.y;
    var nz = this.z;
    
    this.x = m[0]*nx + m[1]*ny + m[2]*nz;
    this.y = m[3]*nx + m[4]*ny + m[5]*nz;
    this.z = m[6]*nx + m[7]*ny + m[8]*nz;
    
    this.toUnitNormal();  
};


/******************************************************************************/
/* Mesh.Face ******************************************************************/
/******************************************************************************/

/**
 * Constructs a surface in a mesh.
 *
 * @param {Array.<Mesh.Vertex>} vertexArray array of vertices defining the face.
 * @param {string} faceColor face color.
 * @param {string} edgeColor edge color.
 * @param {number} edgeWeight edge weight. 
 */
Mesh.Face = function(vertexArray, faceColor, opacity, edgeColor, edgeWeight) {
    
    //if(vertexArray.length < 3) {
    //    throw new Error("Mesh.Face: a surface must have a minimum of 3 points");
    //}
        
    this.vertexArray_ = vertexArray;
    this.faceColor_ = faceColor;
    this.opacity_ = opacity;
    this.edgeColor_ = edgeColor;
    this.edgeWeight_ = edgeWeight;
    
    this.upperBound = null;
    this.lowerBound = null;
    this.calculateBounds();
    
    this.normal = null;
    this.calculateNormal();
};

Mesh.Face.prototype.getVertexArray = function() {
    return this.vertexArray_;  
};

Mesh.Face.prototype.calculateBounds = function() {
    
    var maxX = Number.MIN_VALUE;
    var minX = Number.MAX_VALUE;
    var maxY = Number.MIN_VALUE;
    var minY = Number.MAX_VALUE;
    var maxZ = Number.MIN_VALUE;
    var minZ = Number.MAX_VALUE;
    
    var l = this.vertexArray_.length;
    for(var i = 0; i < l; i++) {
        if(maxX < this.vertexArray_[i].x) {
            maxX = this.vertexArray_[i].x;
        }
        if(maxY < this.vertexArray_[i].y) {
            maxY = this.vertexArray_[i].y;
        }
        if(maxZ < this.vertexArray_[i].z) {
            maxZ = this.vertexArray_[i].z;
        }
        if(minX > this.vertexArray_[i].x) {
            minX = this.vertexArray_[i].x;
        }
        if(minY > this.vertexArray_[i].y) {
            minY = this.vertexArray_[i].y;
        }
        if(minZ > this.vertexArray_[i].z) {
            minZ = this.vertexArray_[i].z;
        }
    }
    
    delete this.upperBound;
    delete this.lowerBound;
    
    this.upperBound = new Mesh.Vertex(maxX, maxY, maxZ);
    this.lowerBound = new Mesh.Vertex(minX, minY, minZ);
    
};

Mesh.Face.prototype.calculateNormal = function() {    
    
    // ERROR: other than first 3 no other vertices are used calculating the plane
    var v1 = this.vertexArray_[0];
    var v2 = this.vertexArray_[1];
    var v3 = this.vertexArray_[2];
    
    // Equation of plane: ax+ by + cz + d = 0
    var a =  v1.y*(v2.z - v3.z) + v2.y*(v3.z - v1.z) + v3.y*(v1.z - v2.z);
    var b =  v1.z*(v2.x - v3.x) + v2.z*(v3.x - v1.x) + v3.z*(v1.x - v2.x);
    var c =  v1.x*(v2.y - v3.y) + v2.x*(v3.y - v1.y) + v3.x*(v1.y - v2.y);
    var d =  a*v1.x + b*v1.y + c*v1.z;
    
    delete this.normal;
    
    this.eqn = [a, b, c, d];
    
    this.normal = new Mesh.Normal(a,b,c);    
};


Mesh.Face.prototype.toString = function() {
    
    /*
    var str = "[";
    
    var l = this.vertexArray_.length;
    for(var i = 0; i < l - 1; i++) {        
        str += this.vertexArray_[i].toString();
        str += ", "
    }
    str += this.vertexArray_[i].toString();
    str += "]";
     */
   
    var str = "{lower:" + this.lowerBound;
    str += ", ";
    str += "upper:" + this.upperBound;
    str += "}";

    return str;
};


