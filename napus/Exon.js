/* Exon Class
 * Constructor Params:
 *  newStart - int
 *  newEnd   - int
*/
function Exon(newStart, newEnd, newParent, newId) {
  this.start = newStart;  // int
  this.end = newEnd;    // int
  this.parent = newParent;
  this.id = newId;
  this.x1 = 0;      // float
  this.x2 = 0;      // float
  this.left;
  this.top;
  this.exonWidth;
  this.h;
}
/* setDrawParams(left, top, w, h)
 *  -> sets the x (left) and y (top) coordinates as well as the 
 *     width (w) and height (h) of the gene for drawChromosome()
 *  -> Params: left   - leftmost point
 *       top    - topmost point
 *       w      - width of the chromosome
 *       h      - height of the chromosome
 *       gStart - start of the gene???
 *       max    - maximum somthing???
 *  -> Returns: nothing - void funct
 *
*/
Exon.prototype.setDrawParams = function(left, top, w, h, gStart, max) {
  // calculate x position within bounding rect
  this.x1 = ((this.start - gStart) / max) * w;
  this.x2 = ((this.end - gStart) / max) * w;
  this.h = h;
  this.exonWidth = this.x2 - this.x1;
  this.left = left;
  this.top = top;
};

/* drawExon()
 * returns: nothing - void funct
*/
Exon.prototype.drawExon = function() {
  fill(255,4,0);
  //fill(100, 200, 0);
  noStroke();
  rect(this.left + this.x1, this.top, this.exonWidth, this.h);
};

Exon.prototype.zoom = function(y,min, max, gStart, gEnd) {
  var exStart = map(this.start, min, max, gStart, gEnd);
  var exEnd = map(this.end, min, max, gStart, gEnd);
  var exWidth = exEnd - exStart;
  fill(255,0,0);
  rect(exStart, y + 100, exWidth, 50);
};

