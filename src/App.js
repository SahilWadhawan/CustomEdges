import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Handle,
} from 'react-flow-renderer';

const initialNodes = [
  {
    id: 'factTable',
    data: {
      label: (
        <div>
          <strong>Revenue</strong>
          <div>Dealer_ID</div>
          <div>Model_ID</div>
          <div>Branch_ID</div>
          <div>Date_ID</div>
          <div>Units_Sold</div>
          <div>Revenue</div>
          <Handle type="source" position="top" id="top" />
          <Handle type="source" position="bottom" id="bottom" />
          <Handle type="source" position="left" id="left" />
          <Handle type="source" position="right" id="right" />
        </div>
      ),
    },
    position: { x: 400, y: 250 },
  },
  {
    id: 'dealerTable',
    data: {
      label: (
        <div>
          <strong>Dealer</strong>
          <div>Dealer_ID</div>
          <div>Location_ID</div>
          <div>Country_ID</div>
          <div>Dealer_NM</div>
          <div>Dealer_CNTCT</div>
          <Handle type="target" position="top" id="top" />
          <Handle type="target" position="bottom" id="bottom" />
          <Handle type="target" position="left" id="left" />
          <Handle type="target" position="right" id="right" />
        </div>
      ),
    },
    position: { x: 100, y: 50 },
  },
  {
    id: 'branchDimTable',
    data: {
      label: (
        <div>
          <strong>Branch Dim</strong>
          <div>Branch_ID</div>
          <div>Name</div>
          <div>Address</div>
          <div>Country</div>
          <Handle type="target" position="top" id="top" />
          <Handle type="target" position="bottom" id="bottom" />
          <Handle type="target" position="left" id="left" />
          <Handle type="target" position="right" id="right" />
        </div>
      ),
    },
    position: { x: 100, y: 450 },
  },
  {
    id: 'dateDimTable',
    data: {
      label: (
        <div>
          <strong>Date Dim</strong>
          <div>Date_ID</div>
          <div>Year</div>
          <div>Month</div>
          <div>Quarter</div>
          <div>Date</div>
          <Handle type="target" position="top" id="top" />
          <Handle type="target" position="bottom" id="bottom" />
          <Handle type="target" position="left" id="left" />
          <Handle type="target" position="right" id="right" />
        </div>
      ),
    },
    position: { x: 700, y: 50 },
  },
  {
    id: 'productTable',
    data: {
      label: (
        <div>
          <strong>Product</strong>
          <div>Product_ID</div>
          <div>Product_Name</div>
          <div>Model_ID</div>
          <div>Variant_ID</div>
          <Handle type="target" position="top" id="top" />
          <Handle type="target" position="bottom" id="bottom" />
          <Handle type="target" position="left" id="left" />
          <Handle type="target" position="right" id="right" />
        </div>
      ),
    },
    position: { x: 700, y: 450 },
  },
];

const initialEdges = [
  { id: 'e1', source: 'factTable', target: 'dealerTable', type: 'smoothstep' },
  { id: 'e2', source: 'factTable', target: 'branchDimTable', type: 'smoothstep' },
  { id: 'e3', source: 'factTable', target: 'dateDimTable', type: 'smoothstep' },
  { id: 'e4', source: 'factTable', target: 'productTable', type: 'smoothstep' },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeLines, setNewNodeLines] = useState(['']);
  const [newNodePosition, setNewNodePosition] = useState({ x: 0, y: 0 });
  const [nextId, setNextId] = useState(1); 

  // Function to add new edges
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Function to handle adding lines for the custom node
  const handleLineChange = (index, value) => {
    const lines = [...newNodeLines];
    lines[index] = value;
    setNewNodeLines(lines);
  };

  const addNode = () => {
    if (newNodeLabel) {
      const newNode = {
        id: `customNode-${nextId}`, 
        data: {
          label: (
            <div>
              <strong>{newNodeLabel}</strong>
              {newNodeLines.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
              <Handle type="source" position="top" id="sourceTop" />
              <Handle type="source" position="bottom" id="sourceBottom" />
              <Handle type="source" position="left" id="sourceLeft" />
              <Handle type="source" position="right" id="sourceRight" />
            </div>
          ),
        },
        position: newNodePosition,
      };

      setNodes((nds) => [...nds, newNode]);
      setNextId((prev) => prev + 1); // Increment ID for the next node
      setNewNodeLabel(''); // Reset label
      setNewNodeLines(['']); // Reset lines
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ padding: '10px', background: '#fff', zIndex: 10 }}>
        <h3>Add a Custom Node</h3>
        <input
          type="text"
          value={newNodeLabel}
          onChange={(e) => setNewNodeLabel(e.target.value)}
          placeholder="Node label"
        />
        {newNodeLines.map((line, index) => (
          <input
            key={index}
            type="text"
            value={line}
            onChange={(e) => handleLineChange(index, e.target.value)}
            placeholder={`Line ${index + 1}`}
          />
        ))}
        <button onClick={() => setNewNodeLines([...newNodeLines, ''])}>
          Add Line
        </button>
        <input
          type="number"
          value={newNodePosition.x}
          onChange={(e) => setNewNodePosition({ ...newNodePosition, x: parseInt(e.target.value) })}
          placeholder="X position"
        />
        <input
          type="number"
          value={newNodePosition.y}
          onChange={(e) => setNewNodePosition({ ...newNodePosition, y: parseInt(e.target.value) })}
          placeholder="Y position"
        />
        <button onClick={addNode}>Add Node</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}

export default App;