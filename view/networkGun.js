/* store methods to modify and build network from gun database */

/* function getGraph
* Get the Graph from a specific root nodes
* Create nodes and edges based on the root node
* Graph Breadth First Search
*/

var graphVis = function (root) {
  this.root = root,
  this.nodes = [],
  this.edges = [],
  this.open = [],
  this.closed = [],
  this.child = [],
  this.findChildNodes = function(item){
    var item = item
    console.log(`finding children for ${item.key}`)
    node.map().once((val, key)=>{
      var node = {}
      node.id = key
      node.val = val
      this.child.push(node)
    })
  }
}


function getGraph(root, nodes, edges){
  var openNodes = []
  nodes = []
  edges = []
  var closedNodes = []


  var root = root
  /* skipping edge to root */
  openNodes.push(root)
  while(openNodes.length >= 1) {
    console.log(`Starting with open Nodes: ${openNodes}`)
    item = openNodes.shift()
    console.log(`Item: ${item.id}`)
    /*skipping goal state check, since not checking for a specific item */
    var children = findChildNodes(item)
    console.log(`Found : ${children}`);
    for(let i=0;i<children.length;i++){
      if(closedNodes.indexOf(children[i]) != -1){
        continue
      }

      if(openNodes.indexOf(children[i] == -1)){
        edges.push({from:root.id, to:children[i].id})
        openNodes.push(children[i])
        console.log(`Got ${children[i]}, added to openNodes`);
        console.log(`new Edge:  ${edges}`);
      }
    }
    closedNodes.push(item)
  }
  nodes = closedNodes
}

function findChildNodes(node) {
  var node = node
  console.log(`finding children for ${node}`)
  var temp = []
  node.map().once((val, key)=>{
    var node = {}
    node.id = key
    node.val = val
    temp.push(node)
  })
  return temp
}
