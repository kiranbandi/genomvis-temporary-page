var reader; // reads in bnapus gene (.gff3)
var oneLine; // string
var keepReading; // boolean
var odd; // boolean
var chromosomes; // HashMap
var cList; // Chromosome[]
var cGene; // Gene
var place; // Place in gff3 file (# == line in )
var screenWidth; // screenWidth in pixels
var screenHeight; // screenHeight in pixels
var currentChrom; // is set to currently selected chromosome
var curChromNum; // keeps track of which chromosome is currently selected
var prevGene; // keeps track of which gene was previously selected
var message2; // boolean, starts false -> "Select section of..." not yet drawn
var regionGenes; // array that holds genes currently selected on the zoomed in chrom
var processed; // boolean, starts false, set to true when .gff3 completely loaded

// click-drag selection vars
var zoomPressed = false;
var initialX = undefined; // initial x coord when mouse pressed
var initialY = undefined; // initial y coord when mouse pressed
var curWidth; // current width of the cursor
var curStart; // x-coord of where the cursor "starts"
var endX; // x-coord of active end of the cursor (one being moved by user)

// local storage variables
var bSupportsLocal; // True = localStorage supported by brwsr, false otherwise
var key; // string, string associated with data stored in LS
var value;

// input for restricting RW displayed to user
var rwSelect;


function preload() {
    processed = false;
    reader = loadStrings("./Bnapus_genes_v3.1.gff3", function() {
        processed = true;
    });
}

function setup() {

    bSupportsLocal = (('localStorage' in window) && window['localStorage'] !== null);
    if (!bSupportsLocal) {
        var alert1 = "Sorry, your browser does not support local storage.";
        var alert2 = "Please update your browser."
        alert(alert1 + "\n" + alert2);
    }

    console.log("Start of setup()" + (millis() / 1000));
    screenWidth = windowWidth;
    screenHeight = 1000;
    console.log("screenWidth: " + screenWidth + "\nscreenHeight: " + screenHeight);

    // Setting up the canvas 
    // These are all a part of the p5js lib
    createCanvas(screenWidth, screenHeight);
    background(0);
    noStroke();
    textSize(18);
    textAlign(LEFT, CENTER);

    // initializing global vars
    regionGenes = [];
    chromosomes = new HashMap();
    cList = [];
    oneLine = "";
    place = 0; // Set as first position in the array
    keepReading = true;
    odd = true;
    curChromNum = -1;
    message2 = false;

    // declaring & initializing some vars only used in setup()
    var total = 0;
    var fraction = 0;
    var blockWidth = 0;
    var cLeft = 15;
    var cTop = 50;

    stroke(100);
    noFill();
    rect(7, 7, screenWidth - 15, cTop + 215);
    noStroke();
    fill(255);
    text("Choose a chromosome: ", 30, 30);

    // this loop is equivalent to -> 'cList = newChromosome[19]'
    for (var i = 0; i < 19; i++) {
        cList.push(new Chromosome());
    }

    // Keep reading the genome data if we havent reached the end/scaffolds
    while (keepReading) {
        readGenome();
    }

    // Adds together the maxPositions of each chromosome
    if (cList[0] !== undefined) {
        for (var i = 0; i < cList.length; i++) {
            if (cList[i].maxPosition !== undefined) {
                total += cList[i].maxPosition;
            }
        }

        console.log("total: " + total);
        // Draws the condensed chromosomes over two rows
        for (var i = 0; i < cList.length; i++) {
            if (cList[i].maxPosition !== undefined) {
                fraction = cList[i].maxPosition / total;
                blockWidth = fraction * ((screenWidth - 30) * 2);
                if ((cLeft + blockWidth) > screenWidth) {
                    cLeft = 15;
                    cTop += 110;
                }

                if (bSupportsLocal) {
                    // Check to see if there's something in local storage.
                    if (window.localStorage.length !== 0) {
                        key = "chrom" + i;

                        // Check to see if there is a value stored at the key
                        if (window.localStorage.getItem(key) !== null) {
                            value = window.localStorage.getItem(key);
                            value = JSON.parse(value);
                            cList[i].areaRead = value;
                        }
                    }
                }

                // Set the draw parameters for each chromosome
                cList[i].setZoomDrawParams(15, 335, screenWidth - 30, 100);
                cList[i].setCondDrawParams(cLeft, cTop, blockWidth - 5, 100);
                cList[i].renderChrom();
                cList[i].renderWear();

                // draw consdensed chroms using array of images
                image(cList[i].rendCondChrom, cLeft, cTop);
                image(cList[i].rendCondRW, cLeft + 1, cTop + 43);

                cLeft += blockWidth;
            }
        }
        // Save p5.renderer object as image
        // save(cList[0].rendZoomChrom, 'chrom1.jpg');
        rwSelect = createSelect();
        rwSelect.position(screenWidth - 225, 290);
        rwSelect.option('All');
        rwSelect.option('Minute (60 Seconds)');
        rwSelect.option('Hour (60 Minutes)');
        rwSelect.option('Day (24 Hours)');
        rwSelect.option('Week (7 Days)');
        rwSelect.option('Month (31/30/28 Days)');
        rwSelect.changed(rwSelectEvent);
    }
    console.log("End of setup()" + millis() / 1000);
}

function readGenome() {
    var geneFound = false;

    while (!geneFound) {
        try {
            oneLine = reader[place];
        } catch (err) {
            console.log(err.stack);
            console.log("setting to null***  " + place);
            oneLine = null;
        }
        if (oneLine === undefined || oneLine === null) {
            // stop reading because of an error or file is empty
            // or it's the end of the file
            keepReading = false;
            console.log("Read Error or EOF, on line : " + place);
            return;
        } else {
            var pieces = oneLine.split(/\t/); // Split line, delimiter = TAB
            var type = pieces[2]; // 3rd column = type (gene, cds, mrna, etc.)

            if (type === "gene") {
                geneFound = true;

                if (pieces[0].charAt(0) === 'S') {
                    keepReading = false;
                    console.log("Reached Scaffold on line : " + place);
                    return;
                }

                var n = int(pieces[0].substring(1));
                var altName;

                if (n <= 10) {
                    altName = "A" + n;
                } else {
                    altName = "C" + (n - 10);
                }

                // Initialize new Gene object 
                var g = new Gene(floor(pieces[3]), floor(pieces[4]), pieces[8].split('=')[2], odd);
                cGene = g;
                // Check to see if the chrom. this gene belongs to is already in the hashmap
                if (chromosomes.has(pieces[0])) {
                    // if it is add it to the existing chrom
                    chromosomes.get(pieces[0]).addGene(g);
                } else {
                    // if not initialize new Chromosome obj. and add gene
                    var c = new Chromosome(n, pieces[0], altName);
                    c.addGene(g);
                    chromosomes.set(pieces[0], c);
                    cList[n - 1] = c;
                }
                odd = !odd;
            } else if (type === "mRNA") {
                var parent = pieces[8].split('Parent=')[1];
                var name = pieces[8].split('Name=')[1].split(';')[0];
                cGene.mrnas.push(new MRNA(int(pieces[3]), int(pieces[4]), name, parent));

            } else if (type === "CDS") {
                var parent = pieces[8].split('=')[2].split(';')[0];
                var id = pieces[8].split('ID=')[1].split(';')[0];
                cGene.cdss.push(new CDS(int(pieces[3]), int(pieces[4]), parent, id));

            } else if (type === "ex") {
                var parent = pieces[8].split('=')[2].split(';')[0];
                var id = pieces[8].split('ID=')[1].split(';')[0];
                cGene.exons.push(new Exon(int(pieces[3]), int(pieces[4]), parent, id));
            }
        }
        place += 1;
    }
}

function keyPressed() {
    keepReading = !keepReading;
    if (key === "c") {
        console.log("Still need to make a clearRW()");
    }
}

function mouseClicked() {
    for (var i = 0; i < cList.length; i++) {

        // Checks to see if mouse clicked on condensed chromosome
        if (cList[i].isHit(mouseX, mouseY) === "condensed") {
            console.log("Chrom[" + i + "] = pressed");

            if (i !== curChromNum) {
                fill(0);
                rect(7, 420, screenWidth - 15, 750);

                if (cList[curChromNum] !== undefined) {
                    // Checks to see if any new read wear was added
                    // If true, then render new read wear
                    if (cList[curChromNum].rendRW === true) {
                        cList[curChromNum].renderWear();
                    }
                }

                curChromNum = i;
                currentChrom = cList[i];

                // displays zoomed in chromosome with read wear
                image(currentChrom.rendZoomRW,
                    currentChrom.zoomedIn.left,
                    currentChrom.zoomedIn.top + currentChrom.zoomedIn.height + 1);
                image(currentChrom.rendZoomChrom, 15, 335);

                fill(255);
                noStroke();
                textSize(18);
                if (message2 === false) {
                    text("Select section of chromosome to view more closely: ", 30, 310);
                    message2 = true;
                }
            }
            return true;
        }

        // if the zoomed in chrom is clicked on
        if (currentChrom !== undefined &&
            currentChrom.isHit(initialX, initialY) === "zoomedIn") {
            regionGenes = currentChrom.multiGeneZoom(15, 450, screenWidth - 15, 100, curWidth, curStart);

            // ruler marks
            var incr = currentChrom.zoomedIn.width / 12;
            for (var lPos = 1; lPos <= 11; lPos++) {
                stroke(255);
                if (lPos % 2 === 0) {
                    strokeWeight(3);
                    line(currentChrom.zoomedIn.left + (incr * lPos), 602,
                        currentChrom.zoomedIn.left + (incr * lPos), 615);
                } else {
                    strokeWeight(2);
                    line(currentChrom.zoomedIn.left + (incr * lPos), 602,
                        currentChrom.zoomedIn.left + (incr * lPos), 610);
                }
                strokeWeight(1);
                noStroke();
            }
            return true;
        }
        if (regionGenes !== undefined) {
            for (var z = 0; z < regionGenes.length; z++) {
                if (regionGenes[z].isHit(mouseX, mouseY)) {
                    regionGenes[z].fullScreenZoom(15, 825, screenWidth - 30);
                }
            }
        }
    }
    return false;
}

// drawRectangle() - draws the "active cursor" (purple)
function drawRectangle() {
    stroke(136, 11, 140);
    strokeWeight(2);
    noFill();

    var offset = 0;
    var cursorWidth = mouseX - initialX;
    if (cursorWidth >= 0) {
        offset = 4.5;
        if (cursorWidth < 10) {
            cursorWidth = 10;
        }
    } else if (cursorWidth < 0) {
        offset = -5.5;
        if (cursorWidth > -10) {
            cursorWidth = -10;
        }
    }

    if (mouseX < currentChrom.zoomedIn.left) {
        endX = currentChrom.zoomedIn.left;
        cursorWidth = endX - initialX + offset;
    }
    if (mouseX > currentChrom.zoomedIn.left + currentChrom.zoomedIn.width) {
        endX = currentChrom.zoomedIn.left + currentChrom.zoomedIn.width;
        cursorWidth = endX - initialX + offset;
    }

    curWidth = cursorWidth;
    curStart = initialX - offset;
    if (curStart < currentChrom.zoomedIn.left) {
        curStart = currentChrom.zoomedIn.left;
    }
    if (curStart + curWidth > currentChrom.zoomedIn.left + currentChrom.zoomedIn.width) {
        endX = currentChrom.zoomedIn.left + currentChrom.zoomedIn.width;
        curStart = curStart - ((curStart + curWidth) - endX);
    }
    rect(curStart, 385, curWidth, 50);
    noStroke();
}

function draw() {
    if (mouseIsPressed && curChromNum !== -1) {
        if (zoomPressed === true) {
            fill(0);
            rect(0, 335, screenWidth, 101);
            image(cList[curChromNum].rendZoomChrom, 15, 335);
            drawRectangle();
        }
    }
}