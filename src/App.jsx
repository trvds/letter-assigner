import { useState, useRef } from 'react';

const NameLetterAssigner = () => {
  const [names, setNames] = useState([]);
  const [currentName, setCurrentName] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentName.trim()) {
      setNames(prev => [...prev, { id: Date.now(), name: currentName.trim() }]);
      setCurrentName('');
    }
  };

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newNames = [...names];
    const [draggedItem] = newNames.splice(draggedIndex, 1);
    newNames.splice(dropIndex, 0, draggedItem);
    setNames(newNames);
    setDraggedIndex(null);
  };

  const assignLetters = (nameIndex, totalNames) => {
    if (totalNames === 0) return '';
    return alphabet.filter((_, index) => index % totalNames === nameIndex).join(' ');
  };

  const handleCopy = () => {
    const text = names
      .map((nameObj, index) => `${nameObj.name} - ${assignLetters(index, names.length)}`)
      .join('\n');
    textAreaRef.current.value = text;
    textAreaRef.current.select();
    document.execCommand('copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 flex flex-col min-h-screen">
      <div className="w-96 mx-auto bg-white rounded-lg shadow-lg flex-grow">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Letter Assigner</h2>
          {names.length > 0 && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 flex items-center gap-2"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
              placeholder="Enter a name"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button 
              onClick={handleSubmit}
              disabled={!currentName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Name
            </button>
          </div>

          <div className="space-y-2">
            {names.length > 0 ? (
              names.map((nameObj, index) => (
                <div
                  key={nameObj.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center justify-between bg-gray-50 p-3 rounded group 
                    ${draggedIndex === index ? 'opacity-50' : ''} 
                    cursor-move hover:bg-gray-100`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-gray-400">⋮⋮</span>
                    <div className="flex-1"> {/* Set a fixed width here */}
                      <span className="font-medium">{nameObj.name}</span>
                      <span className="mx-2">-</span>
                      <span className="text-blue-600">{assignLetters(index, names.length)}</span>
                    </div>
                    <button
                      onClick={() => setNames(names.filter(n => n.id !== nameObj.id))}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                Add some names to get started!
              </p>
            )}
          </div>

          <textarea
            ref={textAreaRef}
            className="sr-only"
            tabIndex="-1"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default NameLetterAssigner;