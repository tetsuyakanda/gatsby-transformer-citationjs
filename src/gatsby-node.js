import regeneratorRuntime from "regenerator-runtime";

import Cite from "citation-js"

function format(entry) {
  delete entry['_graph']
  return entry
}

async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }) {

  // file type check
  if (node.extension !== `bib`) {
    return
  };

  const { createNode, createParentChildLink } = actions

  const content = await loadNodeContent(node)
  const parsedContent = new Cite(content).data

  parsedContent.map(format)
    .map((d) => {
      return {
        ...d,
        id: createNodeId(`${node.id} ${d.id} >>> Citation`),
        children: [],
        parent: node.id,
        internal: {
          contentDigest: createContentDigest(d),
          type: `Citation`,
        },
      }
    }).forEach((data) =>{
      createNode(data)
      createParentChildLink({parent: node, child: data})
    })
}

exports.onCreateNode = onCreateNode