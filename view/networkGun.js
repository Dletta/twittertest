/* store methods to modify and build network from gun database */



var graphVis = function (root) {
  this.root = root,
  this.nodes = [],
  this.edges = [],
  this.open = [root],
  this.closed = [],
  this.child = [],
  this.setup = function(){
    var item = this.open.shift()
    console.log(`finding children for ${item}`)
    gun.get(item).map().once((val, key)=>{
      if(key != 'type') {
        console.log(key, val);
        this.child.push(key)
      }
    })
    this.current = item
  },
  this.processChild = function() {
    var root = this.current
    for(let i=0;i<this.child.length;i++){
      if(this.closed.indexOf(this.child[i]) != -1){
        continue
      }

      if(this.open.indexOf(this.child[i] == -1)){
        this.edges.push({from:root, to:this.child[i]})
        this.open.push(this.child[i])
        console.log(`Got ${this.child[i]}, added to openNodes`);
        console.log(`new Edge:  ${this.edges}`);
      }

    }
  },
  this.findChildNodes = function(){
    var item = this.open.shift()
    this.current = item
    console.log(`finding children for ${item}`)
    gun.get(this.root).get(item).get('linked').map().get('data').once((val, key)=>{
      if(key != 'type') {
        console.log(key, val);
        this.child.push(key)
      }
    })
  }
}

var timeGraph = new graphVis('time')
timeGraph.setup()


/* function getGraph
* Get the Graph from a specific root nodes
* Create nodes and edges based on the root node
* Graph Breadth First Search
*/

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
