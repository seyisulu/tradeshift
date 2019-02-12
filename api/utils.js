function get (struct, prop) {
  return struct._fields[struct._fieldLookup[prop]];
}

function getId ({ identity }) {
  return `${identity.low}-${identity.high}`;
}

function extract ({ records }) {
  let root = '';
  const [ data ] = records;
  const rawNodes = get(data, 'nodes');
  const rawEdges = get(data, 'paths');
  // Maps node IDs to their EID
  const nodeMap = rawNodes.reduce((acc, node) => {
    if (node.properties.name === 'Root') {
      root = node.properties.eid;
    }
    acc[getId(node)] = node.properties.eid;
    return acc;
  }, {});
  // Maps node EIDs to their bosses.
  const bossMap = rawEdges.reduce((acc, edge) => {
    acc[nodeMap[getId({identity: edge.start})]] =
      nodeMap[getId({identity: edge.end})];
    return acc;
  }, {});

  const nodes = rawNodes.map(node => ({
    id: getId(node),
    eid: node.properties.eid,
    boss: bossMap[node.properties.eid],
    root: root,
    label: node.properties.name,
  }));

  const edges = rawEdges.map(edge => ({
    from: getId({identity: edge.start}),
    to: getId({identity: edge.end}),
  }));
  return {nodes, edges};
}

module.exports = {extract};
