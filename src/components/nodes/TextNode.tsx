import React, { FunctionComponent } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { NodeResizer } from "@reactflow/node-resizer";
import "@reactflow/node-resizer/dist/style.css";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { FaWhatsapp } from "react-icons/fa";

// Custom TextNode for chatbot message
const TextNode: FunctionComponent<NodeProps> = ({ data, selected }) => {
  return (
    <div className="rounded-md shadow-md min-w-[220px] max-w-[360px] bg-white relative">
      {/* Node Resizer only visible when node is selected */}
      <NodeResizer
        color="#858AB1"
        isVisible={selected}
        minWidth={120}
        minHeight={60}
      />

      {/* Target handle (can have multiple incoming edges) */}
      <Handle type="target" position={Position.Left} />
      <div className="text-gray-900 font-bold flex justify-between items-center bg-[#B3F0E4] px-3 py-1 rounded-t-md whitespace-pre-line">
        <div className="flex items-center gap-1">
          <BiMessageRoundedDetail />
          {data.label}
        </div>
        <div className="p-1 bg-white rounded-full">
          <FaWhatsapp className="text-[#56BF6E] text-sm" />
        </div>
      </div>
      <div className="text-gray-900 bg-white p-2 min-h-[50px] rounded-b-md text-base whitespace-pre-line">
        {data.description}
      </div>
      {/* Source handle (only one outgoing edge allowed) */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default TextNode;
