import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';
import { Plus, Trash2 } from 'lucide-react';
import { MAIN_CIRCLE_SIZE, PLUS_BUTTON_SIZE } from './constants';

const Circle = React.forwardRef(({ circle, index, handleDragStart, handleDrag, handleDragStop, addNewCircle, onDeleteCircle }, ref) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef(null);
  const isAppSelected = circle.name && !circle.isFirstCircle;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (isAppSelected) {
      const rect = e.currentTarget.getBoundingClientRect();
      setContextMenuPosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
      setShowContextMenu(true);
    }
  };

  const handleDeleteModule = () => {
    if (typeof onDeleteCircle === 'function') {
      onDeleteCircle(index);
    } else {
      console.error('onDeleteCircle is not a function');
    }
    setShowContextMenu(false);
  };

  return (
    <Draggable
      onStart={handleDragStart}
      onDrag={(e, data) => handleDrag(index, e, data)}
      onStop={(e, data) => handleDragStop(index, e, data)}
      position={{x: circle.x, y: circle.y}}
    >
      <div className="absolute circle-container flex flex-col items-center" onContextMenu={handleContextMenu}>
        <div
          ref={ref}
          className={`
            w-24 h-24 rounded-full flex items-center justify-center text-white
            transition-colors cursor-move relative
            shadow-[0_20px_18px_rgba(0,0,0,0.15),inset_0_-30px_30px_-30px_rgba(255,255,255,1),inset_0_30px_30px_-30px_rgba(255,255,255,1)]
          `}
          style={{ backgroundColor: circle.color }}
        >
          {React.cloneElement(circle.icon, { size: 40, color: 'white' })}
          {circle.showPlusButton && (
            <button
              className="absolute flex items-center justify-center text-white cursor-pointer z-10 shadow-[0_4px_15px_rgba(0,0,0,0.2),inset_0_-10px_10px_-10px_rgba(255,255,255,1),inset_0_10px_10px_-10px_rgba(255,255,255,1)]"
              style={{
                width: `${PLUS_BUTTON_SIZE}px`,
                height: `${PLUS_BUTTON_SIZE}px`,
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                right: `-${PLUS_BUTTON_SIZE / 2}px`,
                bottom: `-${PLUS_BUTTON_SIZE / 2}px`,
              }}
              onClick={() => addNewCircle(index)}
            >
              <Plus size={20} />
            </button>
          )}
        </div>
        <div className="mt-2 text-center">
          <div className="font-bold text-sm">
            {isAppSelected ? circle.name : (circle.label || '새 작업')}
          </div>
          {circle.subLabel && <div className="text-xs text-gray-600">{circle.subLabel}</div>}
        </div>
        {showContextMenu && (
          <div
            ref={contextMenuRef}
            className="absolute bg-white shadow-md rounded-md py-1 z-50"
            style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          >
            <button
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full"
              onClick={handleDeleteModule}
            >
              <Trash2 size={16} className="mr-2" />
              모듈 삭제
            </button>
          </div>
        )}
      </div>
    </Draggable>
  );
});

export default Circle;
