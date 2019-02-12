function get (struct, prop) {
  return struct._fields[struct._fieldLookup[prop]];
}

function getId ({ identity }) {
  return `${identity.low}-${identity.high}`;
}

export function extract ({ records }) {
  const [ data ] = records;
  const rawNodes = get(data, 'nodes');
  const rawEdges = get(data, 'paths');
  const nodes = rawNodes.map(n => ({
    id: getId(n),
    eid: n.properties.eid,
    label: n.properties.name,
  }));
  const edges = rawEdges.map(p => ({
    from: getId({identity: p.start}),
    to: getId({identity: p.end}),
  }));
  return {nodes, edges};
}
