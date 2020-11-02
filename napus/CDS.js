/* CDS Class
 * Constructor Params:
 * 	newStart - int
 *	newEnd   - int
*/
function CDS(newStart, newEnd, newParent, newId) {
	this.start = newStart;	// int
	this.end = newEnd;		// int
	this.parent = newParent;
	this.id = newId;
	this.x1 = 0.0;			// float
	this.x2 = 0.0;			// float
	this.left;
	this.top;
	this.cdsWidth;
	this.h;
}

/* setDrawParams(left, top, w, h)
 *  -> sets the x (left) and y (top) coordinates as well as the 
 *     width (w) and height (h) of the gene for drawChromosome()
 *  -> Params: left   - leftmost point
 *		   top    - topmost point
 *		   w      - width of the chromosome
 *		   h      - height of the chromosome
 *		   gStart - start of the gene???
 *		   max    - maximum somthing???
 *  -> Returns: nothing - void funct
*/
CDS.prototype.setDrawParams = function(left, top, w, h, gStart, max) {
	// calculate x position within bounding rect
	this.x1 = ((this.start - gStart) / max) * w;
	this.x2 = ((this.end - gStart) / max) * w;
	this.h = h;
	this.cdsWidth = this.x2 - this.x1;
	this.left = left;
	this.top = top;
};

/* drawCDS()
 *  -> Returns: nothing - void funct
*/
CDS.prototype.drawCDS = function() {
	// calculate x position within bounding rect
	fill(247,255,0,70);
	//fill(0,255,255);
	noStroke();
	rect(this.left + this.x1, this.top, this.cdsWidth, this.h);
};


CDS.prototype.zoom = function(y,min, max, gStart, gEnd) {
  var cStart = map(this.start, min, max, gStart, gEnd);
  var cEnd = map(this.end, min, max, gStart, gEnd);
  var cWidth = cEnd - cStart;
  fill(247,255,0,70);
  rect(cStart, y + 100, cWidth, 50);
};