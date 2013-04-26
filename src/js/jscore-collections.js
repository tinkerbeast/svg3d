// c0re is a set of general utilities for JavaScript programs.
// Copyright (C) 2011  Rishin Goswami
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



function show_all_fields(obj) {
    var fields = [];
    
    for (var m in obj) {
        fields.push("\n{" + typeof obj[m] + "} " + m + " : " + obj[m]);
    }
    return "\n{" + typeof obj + "} : {\n" + fields.join(",") + "\n}";
}






var collections = {};


/******************************************************************************/
/* Collection */
/******************************************************************************/

/** @interface */
collections.Collection = function() {};

collections.Collection.prototype.size = function() {};
collections.Collection.prototype.isEmpty = function() {};
collections.Collection.prototype.contains = function(element) {};
collections.Collection.prototype.add = function(element) {};
collections.Collection.prototype.remove = function(element) {};
collections.Collection.prototype.containsAll = function(collection) {};
collections.Collection.prototype.addAll = function(collection) {};
collections.Collection.prototype.removeAll = function(collection) {};
collections.Collection.prototype.retainAll = function(collection) {};
collections.Collection.prototype.clear = function() {};
collections.Collection.prototype.toArray = function() {};

/******************************************************************************/
/* Set */
/******************************************************************************/

collections.Set = function() {};
collections.Set.prototype = new collections.Collection();

collections.Set.prototype.iterator = function() {};

/******************************************************************************/
/* AssociativeSet */
/******************************************************************************/

collections.AssociativeSet = function() {
    this.set_ = new Object();
    this.size_ = 0;
};

//collections.AssociativeSet.prototype = new collections.Set();

// WHY???????????????????????????????????????????????????????????
// Why does prototype treat them as class objects?
// Because these were initialized in the global context. We never re-allocated
// them inside the class constructor instance - This is NOT Java / C++ - Variables
// are not in class scope

//collections.AssociativeSet.prototype.set_ = new Object();

//collections.AssociativeSet.prototype.size_ = 0;

collections.AssociativeSet.prototype.size = function() {
    return this.size_;
};

collections.AssociativeSet.prototype.isEmpty = function() {
    return (this.size_ == 0);
};

collections.AssociativeSet.prototype.contains = function(element) {
    return (element in this.set_);
};

collections.AssociativeSet.prototype.add = function(element) {
    if (!(element in this.set_)) {
        this.set_[element] = element;
        this.size_++;
    }
};

collections.AssociativeSet.prototype.remove = function(element) {
    if (element in this.set_) {
        delete this.set_[element];
        this.size_--;
    }
};

collections.AssociativeSet.prototype.iterator = function() {
    return this.set_;
};



/******************************************************************************/
/* List */
/******************************************************************************/

collections.List = function() {};
collections.List.prototype = new collections.Collection();

collections.CircularLinkedList = function() {
    this.length = 0;
    this.first = null;
    this.last = null;
};


/******************************************************************************/
/* CircularLinkedList */
/******************************************************************************/

//collections.CircularLinkedList.prototype = new List();

collections.CircularLinkedList.prototype.append = function(node) {
    if (this.first === null) {
        node.prev = node;
        node.next = node;
        this.first = node;
        this.last = node;
    } else {
        node.prev = this.last;
        node.next = this.first;
        this.first.prev = node;
        this.last.next = node;
        this.last = node;
    }
    this.length++;
};

collections.CircularLinkedList.prototype.insertAfter = function(node, newNode) {
    newNode.prev = node;
    newNode.next = node.next;
    node.next.prev = newNode;
    node.next = newNode;
    if (newNode.prev == this.last) {
        this.last = newNode;
    }
    this.length++;
};

collections.CircularLinkedList.prototype.insertBefore = function(node, newNode) {
    newNode.next = node;
    newNode.prev = node.prev;
    node.prev.next = newNode;
    node.prev = newNode;
    if (newNode.next == this.first) {
        this.first = newNode;
    }
    this.length++;
};

collections.CircularLinkedList.prototype.remove = function(node) {
    if (this.length > 1) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        if (node == this.first) {
            this.first = node.next;
        }
        if (node == this.last) {
            this.last = node.prev;
        }
    } else {
        this.first = null;
        this.last = null;
    }
    node.prev = null;
    node.next = null;
    this.length--;
};

