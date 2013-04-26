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


// require('jasmine.js')
// require('svg3d-mesh.js')

// Mesh.Vertex
// ===========

describe("Mesh.Vertex", function() {
    
    var vertex;
                   
    // Test the constructor
    // --------------------
    it("must create vertex: [10,20,30]", function() {
        vertex = new Mesh.Vertex(10, 20, 30);

        expect(vertex.x).toBe(10);
        expect(vertex.y).toBe(20);
        expect(vertex.z).toBe(30);
    });
    
    // Transform translate
    // -------------------
    it("must translate [10,20,30] to [10,30,20] under (0,10,-10) translation", function() {
        vertex.transform([1,0,0,0, 0,1,0,10, 0,0,1,-10]);

        expect(vertex.x).toBe(10);
        expect(vertex.y).toBe(30);
        expect(vertex.z).toBe(20);
    });
    
    // RotateZ(PI/2)
    // -------------
    // octave> V = [10; 30; 20]
    // octave> RotZ90 = [cos(pi/2),-sin(pi/2),0;sin(pi/2),cos(pi/2),0;0,0,1]
    // octave> RotZ90 * V
    // ans =
    //  -30.000
    //   10.000
    //   20.000
    it("[10,30,20] -> RotateZ(PI/2) -> [-30,10,20]", function() {
        var zrot = Math.PI/2;
        vertex.transform([
            Math.cos(zrot),-Math.sin(zrot), 0, 0,  
            Math.sin(zrot),  Math.cos(zrot), 0, 0,  
            0,               0,              1, 0]);

        expect(vertex.x).toBeCloseTo(-30);
        expect(vertex.y).toBeCloseTo(10);
        expect(vertex.z).toBeCloseTo(20);
    });



    
    // RotateX(PI/4)
    // -------------                
    // octave> V = [-30; 10; 20]
    // octave> RotX45 = [1,0,0; 0,cos(pi/4),-sin(pi/4);0 sin(pi/4),cos(pi/4)]
    // octave:18> RotX45 * V
    // ans =
    //  -30.0000
    //   -7.0711
    //   21.2132                
    it("[-30,10,20] -> RotateX(PI/4) -> [-30.0000,-7.0711,21.2132]", function() {
        var xrot = Math.PI/4;                    
        vertex.transform([
            1,0,0,0,  
            0,Math.cos(xrot),-Math.sin(xrot),0,
            0,Math.sin(xrot),Math.cos(xrot),0]);

        expect(vertex.x).toBeCloseTo(-30.0000);
        expect(vertex.y).toBeCloseTo(-7.0711);
        expect(vertex.z).toBeCloseTo(21.2132);
    });
                    
    // Mesh.Vertex.asVertexArray
    // -------------------------
    it("vertex[]: [0,1,2;  3,4,5;  6,7,8]", function() {
        var vertexData = [0,1,2, 3,4,5, 6,7,8];
        var vertexArray = Mesh.Vertex.asVertexArray(vertexData);
        
        expect(vertexArray.length).toBe(3);

        for(var i = 0; i <  vertexArray.length; i++) {
            expect(vertexArray[i].x).toBe(i*3+0);
            expect(vertexArray[i].y).toBe(i*3+1);
            expect(vertexArray[i].z).toBe(i*3+2);
        }                    
    });
    
// Mesh.Vertex.toString
// TODO
    

});


// Mesh.Normal
// ===========

describe("Mesh.Normal", function() {
     
    var normal;
                   
    // Test the constructor
    // -------------------- TODO
    it("normal: [0,0,10] -> [0,0,1]", function() {
        normal = new Mesh.Normal(0, 0, 10);
        
        expect(normal.x).toBeCloseTo(0);
        expect(normal.y).toBeCloseTo(0);
        expect(normal.z).toBeCloseTo(1);
    });
    
    
    
    it("[0,0,1] -> RotateX(PI/2) -> [0,-1,0]", function() {
        
        var renormal = new Mesh.Normal(0, -1, 0);
        
        // Transform the normal
        var xrot = Math.PI/2;                    
        normal.transform([
            1,0,0,0,  
            0,Math.cos(xrot),-Math.sin(xrot),0,
            0,Math.sin(xrot),Math.cos(xrot),0]);
        
        // Check re-calculated normal                    
        expect(normal.x).toBeCloseTo(renormal.x);
        expect(normal.y).toBeCloseTo(renormal.y);
        expect(normal.z).toBeCloseTo(renormal.z);
    });
    
    
    it("[0,-1,0] -> RotateZ(PI/2) -> [1,0,0]", function() {
        
        var renormal = new Mesh.Normal(1, 0, 0);
        
        // Transform the normal
        var zrot = Math.PI/2;
        normal.transform([
            Math.cos(zrot),-Math.sin(zrot), 0, 0,  
            Math.sin(zrot),  Math.cos(zrot), 0, 0,  
            0,               0,              1, 0]);

        // Check re-calculated normal                    
        expect(normal.x).toBeCloseTo(renormal.x);
        expect(normal.y).toBeCloseTo(renormal.y);
        expect(normal.z).toBeCloseTo(renormal.z);
    });
    
    
    it("[1,0,0] -> RotateY(PI/2) -> [0,0,-1]", function() {
        
        var renormal = new Mesh.Normal(0,0,-1);
        
        // Transform the normal
        var yrot = Math.PI/2;
        normal.transform([
            Math.cos(yrot), 0, Math.sin(yrot), 0,  
            0,              1, 0,              0,
            -Math.sin(yrot), 0, Math.cos(yrot), 0
            ]);
        
        // Check re-calculated normal                    
        expect(normal.x).toBeCloseTo(renormal.x);
        expect(normal.y).toBeCloseTo(renormal.y);
        expect(normal.z).toBeCloseTo(renormal.z);
    });

    


});


// Mesh.Face
// =========

describe("Mesh.Face", function() {
    
    var square;               
    
                   
    // Test the constructor
    // --------------------
    it("face: [0,0,0; 10,0,0; 10,10,0; 0,10,0]", function() {
        
        square = new Mesh.Face(Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,10,0, 0,10,0]), "#ffffff", 1, "#000000", 1);

        expect(square.vertexArray_.toString()).toBe("[0,0,0],[10,0,0],[10,10,0],[0,10,0]")
        expect(square.faceColor_).toBe("#ffffff");
        expect(square.opacity_).toBeCloseTo(1);
        expect(square.edgeColor_).toBe("#000000");
        expect(square.edgeWeight_).toBe(1);
        
        
        var renormal = new Mesh.Normal(0, 0, 1);
        expect(square.normal.x).toBeCloseTo(renormal.x);
        expect(square.normal.y).toBeCloseTo(renormal.y);
        expect(square.normal.z).toBeCloseTo(renormal.z);
        
        var ubound = new Mesh.Vertex(10, 10, 0);
        expect(square.upperBound.x).toBeCloseTo(ubound.x);
        expect(square.upperBound.y).toBeCloseTo(ubound.y);
        expect(square.upperBound.z).toBeCloseTo(ubound.z);                    
        var lbound = new Mesh.Vertex(0, 0, 0);
        expect(square.lowerBound.x).toBeCloseTo(lbound.x);
        expect(square.lowerBound.y).toBeCloseTo(lbound.y);
        expect(square.lowerBound.z).toBeCloseTo(lbound.z);
        
    });
    
    
    
    
    
    // RotateX(PI/2)
    // -------------                
    it("[0,0,0; 10,0,0; 10,10,0; 0,10,0] -> RotateX(PI/2) -> [0,0,0; 10,0,0; 10,0,10; 0,0,10]", function() {
        
        // Calculated output vertices
        var squareTransformedVertices = Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,0,10, 0,0,10]);
        
        // Transform vertices
        var xrot = Math.PI/2;
        var l = square.vertexArray_.length;
        for(var i = 0 ; i < l ; i++) {
            square.vertexArray_[i].transform([
                1,0,0,0,  
                0,Math.cos(xrot),-Math.sin(xrot),0,
                0,Math.sin(xrot),Math.cos(xrot),0]);
        }

        // Check vertices
        for(var i = 0 ; i < l ; i++) {
            expect(square.vertexArray_[i].x).toBeCloseTo(squareTransformedVertices[i].x);
            expect(square.vertexArray_[i].y).toBeCloseTo(squareTransformedVertices[i].y);
            expect(square.vertexArray_[i].z).toBeCloseTo(squareTransformedVertices[i].z);
        }
        
        // Check re-calculated normal
        square.calculateNormal();
        var renormal = new Mesh.Normal(0, -1, 0);
        expect(square.normal.x).toBeCloseTo(renormal.x);
        expect(square.normal.y).toBeCloseTo(renormal.y);
        expect(square.normal.z).toBeCloseTo(renormal.z);
        
        
        square.calculateBounds();                    
        var ubound = new Mesh.Vertex(10, 0, 10);
        expect(square.upperBound.x).toBeCloseTo(ubound.x);
        expect(square.upperBound.y).toBeCloseTo(ubound.y);
        expect(square.upperBound.z).toBeCloseTo(ubound.z);                    
        var lbound = new Mesh.Vertex(0, 0, 0);
        expect(square.lowerBound.x).toBeCloseTo(lbound.x);
        expect(square.lowerBound.y).toBeCloseTo(lbound.y);
        expect(square.lowerBound.z).toBeCloseTo(lbound.z);
    });

});


// Mesh
// ====

describe("Mesh", function() {
    
    var squareMesh;
    var faceId;
    
                   
    // Test the constructor
    // --------------------
    it("mesh: {[0,0,0; 10,0,0; 10,10,0; 0,10,0]}", function() {
                                                
        squareMesh = new Mesh();
        faceId = squareMesh.addFace(Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,10,0, 0,10,0]), "#ffffff", 1, "#000000", 1);
        
    });
    
    
    
    
    
    // RotateX(PI/2)
    // -------------                
    it("[0,0,0; 10,0,0; 10,10,0; 0,10,0] -> RotateX(PI/2) -> [0,0,0; 10,0,0; 10,0,10; 0,0,10]", function() {
        
        // Calculated output vertices and normal
        var transformedVertices = Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,0,10, 0,0,10]);
        var renormal = new Mesh.Normal(0, -1, 0);
        
        
        //alert(show_all_fields(squareMesh.vertexSet_.iterator()));
                            
        
        // Transform vertices
        var xrot = Math.PI/2;                    
        squareMesh.transform([
            1,0,0,0,  
            0,Math.cos(xrot),-Math.sin(xrot),0,
            0,Math.sin(xrot),Math.cos(xrot),0]);
        
        
        
        var square = squareMesh.faceList_[faceId];
                            

        // Check vertices
        var l = transformedVertices.length;
        for(var i = 0 ; i < l ; i++) {
            expect(square.vertexArray_[i].x).toBeCloseTo(transformedVertices[i].x);
            expect(square.vertexArray_[i].y).toBeCloseTo(transformedVertices[i].y);
            expect(square.vertexArray_[i].z).toBeCloseTo(transformedVertices[i].z);
        }
        
        // Check normal                    
        expect(square.normal.x).toBeCloseTo(renormal.x);
        expect(square.normal.y).toBeCloseTo(renormal.y);
        expect(square.normal.z).toBeCloseTo(renormal.z);
    });
    
    
   

});

// Mesh.bspGetIntersection
// =======================

// TODO: Possible test cases are a combination of - Create all possible test cases

// TODO: test case generator

// Component               | Priority | Function                               | Conditions
// Mesh.bspGetIntersection | Must     | [have_common_points_of_intersection,   |
//                         |          | nothave_common_points_of_intersection] | [[perpendicular_plane, same_plane, parallel_plane, anyangle_plane],
//                         |          |                                        |  [intersecting_ploy, nonintersecting_poly],
//                         |          |                                        |  [touching_edge, common_edge, multicommon_edge, notouch_edge],
//                         |          |                                        |  [onrotation_intersect, onrotation_same, onrotation_nointersect],
//                         |          |                                        |  [has_zero_vertex, nothas_zero_vertex]]
//                         |          |                                        |  [has_xy/xz/yz_plane, nothas_xy/xz/yz_plane]]


// TODO tescase where edge is  not common, but  two points are


describe("Mesh.bspGetIntersection", function() {
    
    it("MustNot Have common points of intersection with a common edge at 0,0,0", function() {
         
        // face1 = square on x-y plane
        // face2 = square on x-z plane
        // common edge = [0,0,0, 10,0,0]
        var face1 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,10,0, 0,10,0]), "#ffffff", 1, "#000000", 1);                    
        var face2 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,0,10, 0,0,10]), "#ffffff", 1, "#000000", 1);
                            
        var intersect = Mesh.bspGetIntersection(face1, face2);
        
        expect(intersect.length).toBe(0);
        
        console.log("***");
         
    });                
    
    
    it("\
Must have_common_points_of_intersection when [\n\
perpendicular_plane, \n\
intersecting_poly, \n\
touching_edge, \n\
...]", function() {
         
        // face1 = square on x-y plane
        // face2 = square on x-z plane
        // touching_edge = [1,1,1, 10,1,1]
        var face1 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,-10,0, 10,-10,0, 10,10,0, 0,10,0]), "#ffffff", 1, "#000000", 1);
        var face2 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,0,0, 10,0,0, 10,0,10, 0,0,10]), "#ffffff", 1, "#000000", 1);
                            
        var intersect = Mesh.bspGetIntersection(face1, face2);
        
        expect(intersect.length).toBe(0);
        
        console.log("***");                     
    });
    
    
                    
    it("\
Must have_common_points_of_intersection when [\n\
perpendicular_plane, \n\
nonintersecting_poly, \n\
notouching_edge, \n\
...]", function() {
         
        // face1 = square on x-y plane
        // face2 = square on x-z plane with y offset 10
        var face1 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,-10,0, 10,-10,0, 10,10,0, 0,10,0]), "#ffffff", 1, "#000000", 1);
        var face2 = new Mesh.Face(Mesh.Vertex.asVertexArray([0,10,0, 10,10,0, 10,0,10, 0,10,10]), "#ffffff", 1, "#000000", 1);
                            
        var intersect = Mesh.bspGetIntersection(face1, face2);
        
        expect(intersect.length).toBe(0);
        
        console.log("***");
    });

});


