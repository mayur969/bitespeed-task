"use client"

import React, { useCallback, useRef, useState, DragEvent, useEffect } from 'react';
import ReactFlow, { Background, Controls, addEdge, Node, Edge, Connection, NodeMouseHandler, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import NodesPanel from './NodesPanel';
import SettingsPanel from './SettingsPanel';
import TextNode from './nodes/TextNode';
import { useFlowStore } from '../store/flowStore';
import { toast } from 'react-hot-toast';

// Helper function to detect cycles in a directed graph
function hasCycle(nodes: Node[], edges: Edge[]) {
  const adj: Record<string, string[]> = {};
  nodes.forEach(node => { adj[node.id] = []; });
  edges.forEach(edge => {
    if (edge.source && edge.target) {
      adj[edge.source].push(edge.target);
    }
  });
  const visited: Record<string, boolean> = {};
  const recStack: Record<string, boolean> = {};
  function dfs(nodeId: string): boolean {
    if (!visited[nodeId]) {
      visited[nodeId] = true;
      recStack[nodeId] = true;
      for (const neighbor of adj[nodeId]) {
        if (!visited[neighbor] && dfs(neighbor)) return true;
        else if (recStack[neighbor]) return true;
      }
    }
    recStack[nodeId] = false;
    return false;
  }
  return nodes.some(node => dfs(node.id));
}

const nodeId = () => `${+new Date()}-${Math.floor(Math.random() * 1000)}`;

// Register custom node types
const nodeTypes = {
  text: TextNode,
};

const FlowBuilder = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    selectedNode,
    setSelectedNode,
    incrementMessageNodeCount,
    deleteEdge,
    selectedEdge,
    setSelectedEdge,
  } = useFlowStore();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  // Handles connecting nodes
  const onConnect = useCallback((params: Edge | Connection) => {
    // Only allow one outgoing edge per source node
    if (edges.some(edge => edge.source === params.source)) {
      toast.error('Only one outgoing edge is allowed from a node.');
      return;
    }
    const newEdges = addEdge(params, edges);
    // Check for cycles
    if (hasCycle(nodes, newEdges)) {
      toast.error('Cannot create a loop in the flow.');
      return;
    }
    setEdges(newEdges);
  }, [setEdges, edges, nodes]);

  // Handles node selection
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, [setSelectedNode]);

  // Handles clicking on canvas to deselect node
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  // Handles edge click (delete edge)
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  }, [setSelectedEdge]);

  // Drag and drop logic
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      switch (type) {
        case 'text': {
          const newCount = incrementMessageNodeCount();
          const newNode: Node = {
            id: nodeId(),
            type: 'text',
            position,
            data: { label: 'Send Message', description: `Text Message ${newCount}` },
          };
          setNodes([...nodes, newNode]);
          break;
        }
        // Add more cases for other node types as needed
        default:
          // handle other node types if needed
          break;
      }
    },
    [reactFlowInstance, setNodes, nodes, incrementMessageNodeCount]
  );

  // Delete selected edge on Delete/Backspace key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedEdge) {
        deleteEdge(selectedEdge.id);
        setSelectedEdge(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdge, deleteEdge, setSelectedEdge]);

  return (
    <div className="flex w-full h-full bg-white">
      {/* Flow Area */}
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          onEdgeClick={onEdgeClick}
          fitView
        >
          <Controls />
          <Background color='white'/>
        </ReactFlow>
      </div>
      {/* Right Panel: NodesPanel or SettingsPanel */}
      {selectedNode ? (
        <SettingsPanel />
      ) : (
        <NodesPanel />
      )}
    </div>
  );
};

export default FlowBuilder; 