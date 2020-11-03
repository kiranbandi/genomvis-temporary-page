/* MRNA Class
 * Constructor Params:
 *  newStart - int
 *  newEnd   - int
*/
function MRNA(newStart, newEnd, newName, newParent) {
  this.name = newName;
  this.start = newStart;
  this.end = newEnd;
  this.parent = newParent;
  this.x1 = 0.0;
  this.x2 = 0.0;
  this.left;
  this.top;
  this.mrnaWidth;
  this.h;
}

/* setDrawParams(left, top, w, h)
 *  -> sets the x (left) and y (top) coordinates as well as the 
 *     width (w) and height (h) of the gene for drawChromosome()
 *  -> Params:  left   - leftmost point
 *              top    - topmost point
 *              w      - width of the chromosome
 *              h      - height of the chromosome
 *              gStart - start of the gene???
 *              max    - maximum somthing???
 *  -> Returns: nothing - void funct
*/
MRNA.prototype.setDrawParams = function(left, top, w, h, gStart, max) {
  // calculate x position within bounding rect
  this.x1 = ((this.start - gStart) / max) * w;
  this.x2 = ((this.end - gStart) / max) * w;
  this.h = h;
  this.mrnaWidth = this.x2 - this.x1;
  this.left = left;
  this.top = top;
};

/* drawMRNA()
 *  -> Returns: nothing - void funct
*/
MRNA.prototype.drawMRNA = function() {
  // calculate the x position within the bounding rect
  //fill(255);
  //textSize(12);
  //noStroke();
  //text(this.name, this.left + (this.mrnaWidth/2 - 55), this.top - 20);
  stroke(255);
  // marker lines on mrna zoom
  //line(this.left + this.x1, this.top, this.left + this.x1, this.top - 10);
  //line(this.left + (this.mrnaWidth - 1), this.top, this.left + (this.mrnaWidth - 1), this.top - 10);
  
  // lines to name
  //stroke(255, 255, 255, 75);
  //line(this.left + this.x1, this.top - 10, (this.left + (this.mrnaWidth/2 - 57)), (this.top - 45));
  //line(this.left + (this.mrnaWidth - 1), this.top - 10,(this.left + (this.mrnaWidth/2 + 57)), (this.top - 45));
  fill(0,255,0);
  textSize(18);
  //fill(9, 0, 255);
  noStroke();
  rect(this.left + this.x1, this.top, this.mrnaWidth, this.h);
};

