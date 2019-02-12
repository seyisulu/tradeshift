import React from 'react'
import Graph from 'react-graph-vis';

export default function EmployeeTree (graph) {
  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: "#000000"
    }
  };
  const events = {
    select: function(event) {
      var { nodes, edges } = event;
      console.group('Clicked!');
      console.info('Nodes:', nodes);
      console.info('Edges:', edges);
      console.groupEnd();
    }
  };

  return (
    <Graph
      className={'Graph'}
      graph={graph}
      options={options}
      events={events}
      style={{height:'800px', border:'2px dashed lavender'}}
    />
  );
}
