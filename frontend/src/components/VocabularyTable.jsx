import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaSortAmountDown, FaFilter, FaTrash } from 'react-icons/fa';
import WordCreateModal from './WordCreateModal';
import { wordStore } from '../store/wordStore';
import { toast } from "react-hot-toast";

const VocabularyTable = () => {
  const {
    words,
    isLoading,
    setWords,
    updateWord,
    deleteWord,
    toggleFavorite
  } = wordStore();

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [edited, setEdited] = useState({});

  console.log(words)
  // Handle word deletion
  const handleDelete = async (wordId) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      try {
        await deleteWord(wordId);
        toast.success('Word deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete word');
      }
    }
  };

  // Handle word update
  const handleSave = async (index) => {
    const wordToUpdate = words[index];
    try {
      console.log('Updating word:', wordToUpdate._id, edited);
      await updateWord(wordToUpdate._id, edited);
      setEditIndex(null);
      toast.success('Word updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update word');
    }
  };

  // Setup edit mode
  const handleEdit = (index) => {
    setEditIndex(index);
    setEdited({ ...words[index] });
  };

  // Handle field changes during edit
  const handleChange = (e) => {
    setEdited({ ...edited, [e.target.name]: e.target.value });
  };

  // Toggle favorite status
  const handleFavorite = async (wordId, currentStatus) => {
    try {
      console.log('Toggling favorite for word:', wordId, currentStatus);
      await toggleFavorite(wordId, !currentStatus);
    } catch (error) {
      toast.error(error.message || 'Failed to update favorite status');
    }
  };

  // Textarea auto-resize helper
  const handleTextareaResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (editIndex !== null) {
      const definitionTextarea = document.querySelector(`textarea[name="definition"][data-index="${editIndex}"]`);
      const exampleTextarea = document.querySelector(`textarea[name="example"][data-index="${editIndex}"]`);

      if (definitionTextarea) handleTextareaResize(definitionTextarea);
      if (exampleTextarea) handleTextareaResize(exampleTextarea);
    }
  }, [editIndex]);

  // Helper for level display
  const getLevelLabel = (level) => {
    switch (level) {
      case 'Easy': return 'E';
      case 'Medium': return 'M';
      case 'Hard': return 'H';
      default: return '';
    }
  };


  return (
    <div className="p-6 bg-base-200 min-h-screen text-sm">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className='btn btn-primary btn-sm'
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : '+ Add New Word'}
        </button>

        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline btn-success" disabled={isLoading}>
            <FaSortAmountDown />
          </button>
          <button className="btn btn-sm btn-outline btn-info" disabled={isLoading}>
            <FaFilter />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <div className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] bg-neutral text-neutral-content p-2 font-semibold text-left text-sm">
          <div>#</div>
          <div className="flex items-center gap-1">Word</div>
          <div>Definition</div>
          <div className="text-center">Level</div>
          <div className="text-center">Status</div>
          <div>Example</div>
          <div>Actions</div>
        </div>

        {words.map((word, index) => (
          <div key={index} className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] items-center border-b border-base-300 p-2">
            <div>{index + 1}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(word._id, !word.favorite);
                }}
                disabled={isLoading}
              >
                {word.favorite ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
              </button>
              {editIndex === index ? (
                <textarea
                  type="text"
                  name="word"
                  value={edited.word}
                  onChange={handleChange}
                  onInput={(e) => handleTextareaResize(e.target)}
                  className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
                  disabled={isLoading}
                />
              ) : (
                <span className="break-words">{word.word}</span>
              )}
            </div>
            <div>
              {editIndex === index ? (
                <textarea
                  name="definition"
                  value={edited.definition}
                  onChange={handleChange}
                  onInput={(e) => handleTextareaResize(e.target)}
                  data-index={index}
                  className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
                  style={{ minHeight: '40px' }}
                  disabled={isLoading}
                />
              ) : (
                <span className="break-words whitespace-pre-line">{word.definition}</span>
              )}
            </div>
            <div className="text-center">
              {editIndex === index ? (
                <select
                  name="level"
                  value={edited.level}
                  onChange={handleChange}
                  className="select select-sm select-bordered w-full"
                  disabled={isLoading}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              ) : (
                <span className="tooltip" data-tip={word.level}>
                  <span
                    className={`font-bold ${word.level === 'Easy'
                        ? 'text-green-500'
                        : word.level === 'Medium'
                          ? 'text-yellow-400'
                          : 'text-red-500'
                      }`}
                  >
                    {getLevelLabel(word.level)}
                  </span>
                </span>
              )}
            </div>
            <div className="text-center font-semibold">
              {editIndex === index ? (
                <select
                  name="status"
                  value={edited.status}
                  onChange={handleChange}
                  className="select select-sm select-bordered w-full"
                  disabled={isLoading}
                >
                  <option value="Remembered">Remembered</option>
                  <option value="Not remembered">Not remembered</option>
                </select>
              ) : (
                <span
                  className={word.status === 'Remembered' ? 'text-green-500' : 'text-red-500'}
                >
                  {word.status}
                </span>
              )}
            </div>
            <div>
              {editIndex === index ? (
                <textarea
                  name="example"
                  value={edited.example}
                  onChange={handleChange}
                  onInput={(e) => handleTextareaResize(e.target)}
                  data-index={index}
                  className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
                  style={{ minHeight: '40px' }}
                  disabled={isLoading}
                />
              ) : (
                <span className="whitespace-pre-line">{word.example}</span>
              )}
            </div>
            <div className="flex justify-end gap-1">
              {editIndex === index ? (
                <button
                  onClick={() => handleSave(index)}
                  className="btn btn-xs btn-success"
                  disabled={isLoading}
                >
                  {isLoading ? '...' : '💾Save'}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(index)}
                    className="btn btn-xs btn-ghost"
                    disabled={isLoading}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(word._id)}
                    className="btn btn-xs btn-ghost text-error"
                    disabled={isLoading}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <WordCreateModal
          onClose={() => setShowModal(false)}
          onWordCreated={(newWord) => setWords([...words, newWord])}
        />
      )}
    </div>
  );
};

export default VocabularyTable;

