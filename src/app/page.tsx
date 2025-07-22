"use client";
import FlowBuilder from "../components/FlowBuilder";
import { useFlowStore } from "../store/flowStore";
import { toast } from "react-hot-toast";

export default function Home() {
  const { nodes, edges } = useFlowStore();

  // Save handler with validation
  const handleSave = () => {
    if (nodes.length > 1) {
      // Find nodes with no incoming edge (no edge.target === node.id)
      const nodesWithNoIncoming = nodes.filter(
        (node) => !edges.some((edge) => edge.target === node.id)
      );
      if (nodesWithNoIncoming.length > 1) {
        toast.error("More than one node has no incoming connection.\nCannot save flow.");
        return;
      }
    }
    toast.success("Flow saved!");
  };

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Topbar with Save button */}
      <div className="w-full flex justify-end items-center py-2 border-b border-gray-200 bg-[#F3F3F3]">
        <div className="w-[25%] flex justify-center">
          <button
            className="border border-[#858AB1] bg-white px-8 py-2 rounded-xl text-base text-[#858AB1] hover:bg-[#e6eaf8] transition"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
      {/* FlowBuilder below the topbar */}
      <div className="flex-1 min-h-0">
        <FlowBuilder />
      </div>
    </div>
  );
}
