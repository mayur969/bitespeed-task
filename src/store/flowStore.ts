import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  messageNodeCount: number;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setSelectedNode: (node: Node | null) => void;
  setSelectedEdge: (edge: Edge | null) => void;
  incrementMessageNodeCount: () => number;
  decrementMessageNodeCount: () => number;
  deleteEdge: (edgeId: string) => void;
  updateNodeData: (nodeId: string, data: NodeData) => void;
}

interface NodeData {
  label: string;
  description: string;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  messageNodeCount: 0,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  onNodesChange: (changes) => {
    // Decrement messageNodeCount for each deleted text node
    const prevNodes = get().nodes;
    let shouldClearSelectedNode = false;
    changes.forEach(change => {
      if (change.type === 'remove') {
        const node = prevNodes.find(n => n.id === change.id);
        if (node && node.type === 'text') {
          get().decrementMessageNodeCount();
        }
        const selectedNode = get().selectedNode;
        if (selectedNode && selectedNode.id === change.id) {
          shouldClearSelectedNode = true;
        }
      }
    });
    set({
      nodes: applyNodeChanges(changes, get().nodes),
      ...(shouldClearSelectedNode ? { selectedNode: null } : {})
    });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  setSelectedNode: (node) => set({ selectedNode: node }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge }),
  incrementMessageNodeCount: () => {
    const newCount = get().messageNodeCount + 1;
    set({ messageNodeCount: newCount });
    return newCount;
  },
  decrementMessageNodeCount: () => {
    const newCount = Math.max(0, get().messageNodeCount - 1);
    set({ messageNodeCount: newCount });
    return newCount;
  },
  deleteEdge: (edgeId: string) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },
  updateNodeData: (nodeId: string, data: NodeData) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );
      let updatedSelectedNode = state.selectedNode;
      if (state.selectedNode && state.selectedNode.id === nodeId) {
        updatedSelectedNode = { ...state.selectedNode, data: { ...state.selectedNode.data, ...data } } as Node;
      }
      return {
        nodes: updatedNodes,
        selectedNode: updatedSelectedNode,
      };
    });
  },
})); 