"use client";
import React, { DragEvent, ElementType } from "react";
import { BiMessageRoundedDetail, BiQuestionMark } from "react-icons/bi";

// Node icons
const NODE_TYPE_ICONS: Record<string, ElementType> = {
  text: BiMessageRoundedDetail,
  default: BiQuestionMark,
};

// Node type definitions
const NODE_TYPES = [
  {
    type: "text",
    label: "Message",
  },
  // Add more node types here in the future
];

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData("application/reactflow", nodeType);
  event.dataTransfer.effectAllowed = "move";
};

const NodesPanel = () => {
  return (
    <div className="p-4 bg-white h-full w-[25%] border-l border-gray-400">
      <div className="grid grid-cols-2 gap-4">
        {NODE_TYPES.map((node) => {
          const Icon = NODE_TYPE_ICONS[node.type] || NODE_TYPE_ICONS.default;
          return (
            <div
              key={node.type}
              className="mb-4 p-4 bg-white border border-[#858AB1] rounded-lg shadow cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center space-y-2"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
            >
              <Icon className="text-[#858AB1] text-3xl" />
              <div className="font-medium text-[#858AB1] text-sm">
                {node.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodesPanel;
