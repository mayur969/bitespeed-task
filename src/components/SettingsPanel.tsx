"use client"
import React, { FunctionComponent } from 'react';
import { useFlowStore } from '../store/flowStore';
import { IoMdArrowRoundBack } from 'react-icons/io';

const SettingsPanel: FunctionComponent = () => {
  const selectedNode = useFlowStore((state) => state.selectedNode);
  const setSelectedNode = useFlowStore((state) => state.setSelectedNode);
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, {
        label: selectedNode.data.label,
        description: e.target.value,
      });
    }
  };
  return (
    <div className=" bg-white h-full w-[25%] border-l border-gray-400">
      {selectedNode ? (
        <>
          <div className="relative text-base text-black text-center border-b border-gray-400 p-3 flex items-center justify-center">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <IoMdArrowRoundBack className='text-xl cursor-pointer' onClick={() => setSelectedNode(null)} />
            </div>
            Message
          </div>
          <div className='px-3 py-8 border-b border-gray-400'>
            <label htmlFor="text" className="block text-gray-400 mb-2">Text</label>
            <textarea
              name="text"
              className="border border-gray-300 rounded px-3 py-2 w-full text-black focus:outline-none focus:ring-2 focus:ring-black-200"
              value={selectedNode?.data?.description || ''}
              onChange={handleDescriptionChange}
              rows={4}
            />
          </div>
        </>
      ) : (
        <div className="text-gray-500">Select a node to edit its settings.</div>
      )}
    </div>
  );
};

export default SettingsPanel; 