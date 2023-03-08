/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
height = window.innerHeight * 0.7,
margin = { top: 20, bottom: 50, left: 60, right: 40 };


/**
* LOAD DATA
* */
d3.json("/flare.json", d3.autotype).then(data => {
    console.log(data);

    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "lavender");
   
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
   
    // make hierarchy
    const root = d3
      .hierarchy(data) // children accessor
      .sum(d => d.value) // sets the 'value' of each level
      .sort((a, b) => b.value - a.value);
   
    // make treemap layout generator
    const tree = d3
      .treemap()
      .size([width, height])
      .padding(1)
      .round(true);
   
    // call our generator on our root hierarchy node
    tree(root); // creates our coordinates and dimensions based on the hierarchy and tiling algorithm
   
    // create g for each leaf
    const leaf = svg
      .selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);
   
    leaf
      .append("rect")
      .attr("fill", d => {
        const level1Ancestor = d.ancestors().find(d => d.depth === 1);
        return colorScale(level1Ancestor.data.name);
      })
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);



    // ============================================

    // // set default arrows on tool tips
    // tippy.setDefaults({
    //   "arrow": true
    // })

    // set the tooltip content
    leaf
      .attr("allowHTML", true)
      .attr("data-tippy-content", d => {

        let level1Ancestor = d.ancestors().find(d => d.depth === 1)
        let level2Ancestor = d.ancestors().find(d => d.depth === 2)
        let level3Ancestor = d.ancestors().find(d => d.depth === 3)

        let n1 = level1Ancestor ? level1Ancestor.data.name : "NA";
        let n2 = level2Ancestor ? level2Ancestor.data.name : "NA";
        let n3 = level3Ancestor ? level3Ancestor.data.name : "NA";

        let txt = `${n1} > ${n2} > ${n3}`

        return txt;
      })


    // call tippy on the dots
    tippy(leaf.nodes());
});
