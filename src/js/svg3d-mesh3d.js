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


// TODO: document
Mesh3D.globalId = 0;
Mesh3D.vertexAccessor = {
    stride: 3,
    name: ['x', 'y', 'z']
};

Mesh3D.normalAccessor = {
    stride: 3,
    name: ['i', 'j', 'k']    
};


// TODO: document
Mesh3D.prototype.id_;

Mesh3D.prototype.vertices_;

Mesh3D.prototype.normals_;

Mesh3D.prototype.polylist_;


function Mesh3D(vertices, normals, polylist) {
    this.id_ = Mesh3D.globalId++;
    this.vertices_ = vertices;
    this.normals_ = normals;
    this.polylist_ = polylist;
};


Mesh3D.prototype.rotate =function() {
    
    };

