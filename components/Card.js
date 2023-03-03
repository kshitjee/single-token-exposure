import React from "react";

export default function Card(props) {
  const {
    title,
    address,
    tradingVolume24h,
    APY,
    impermanentLoss,
    onPairSelected,
  } = props;

  function handlePairSelected() {
    onPairSelected(title, address, tradingVolume24h, APY, impermanentLoss);
  }

  return (
    <div className="bg-blue p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden hover:bg-blue-50 transition-colors duration-300">
        <div className="px-6 py-4">
          <h2 className="text-lg font-medium text-gray-800">{title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">Address:</span>
            <span className="text-sm text-gray-800 break-all">{address}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">{tradingVolume24h}:</span>
            <span className="text-sm text-gray-800">{tradingVolume24h}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-medium">APY:</span>
            <span className="text-sm text-gray-800">{APY}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 font-medium">{impermanentLoss}:</span>
            <span className="text-sm text-gray-800">{impermanentLoss}</span>
          </div>
          <button className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-4 hover:bg-indigo-600" onClick={handlePairSelected}>
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
