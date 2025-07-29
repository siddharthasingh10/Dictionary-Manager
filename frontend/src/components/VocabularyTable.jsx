

// VocabularyTable.js
import React, { useState, useEffect, useMemo } from 'react';
import { FaStar, FaRegStar, FaTrash, FaSort, FaPlus } from 'react-icons/fa';
import { wordStore } from '../store/wordStore';
import { userAuthStore } from '../store/userAuthStore';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const VocabularyTable = ({ workspace }) => {
  const { authUser } = userAuthStore();
  const {
    words,
    updateWord,
    deleteWord,
    toggleFavorite
  } = wordStore();

  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('word');
  const [sortDir, setSortDir] = useState('asc');
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [page, setPage] = useState(1);
  const [localWords, setLocalWords] = useState([]);
  

  useEffect(() => {
    setLocalWords(words);
  }, [words]);

  const filteredWords = useMemo(() => {
    const filtered = localWords.filter(word => {
      return (
        word.word.toLowerCase().includes(search.toLowerCase()) ||
        word.definition.toLowerCase().includes(search.toLowerCase()) ||
        word.example.toLowerCase().includes(search.toLowerCase()) ||
        word.level.toLowerCase().includes(search.toLowerCase()) ||
        word.status.toLowerCase().includes(search.toLowerCase())
      );
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField] || '';
      let bVal = b[sortField] || '';

      if (sortField === 'status') {
        const statusOrder = { 'Remembered': 1, 'Not remembered': 0 };
        aVal = statusOrder[aVal] ?? 0;
        bVal = statusOrder[bVal] ?? 0;
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }

      if (sortDir === 'desc') [aVal, bVal] = [bVal, aVal];
      return aVal.localeCompare(bVal);
    });

    return filtered;
  }, [localWords, search, sortField, sortDir]);

  const paginatedWords = filteredWords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const startEdit = (id, field, value) => {
    setEditing(`${id}-${field}`);
    setEditValue(value);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditValue('');
  };

  const saveEdit = async (id, field) => {
    try {
      await updateWord(id, { [field]: editValue });
      setEditing(null);
      toast.success('Word updated');
    } catch (e) {
      toast.error('Update failed');
    }
  };

  const handleKeyDown = (e, id, field) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      saveEdit(id, field);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this word?')) {
      try {
        await deleteWord(id);
        toast.success('Deleted');
      } catch (e) {
        toast.error('Failed to delete');
      }
    }
  };

  const toggleFav = async (id, current) => {
    try {
      await toggleFavorite(id, !current);
    } catch (e) {
      toast.error('Failed to toggle favorite');
    }
  };

  const handleAddWord = () => {
    const newWord = {
      _id: `new-${Date.now()}`,
      word: '',
      definition: '',
      level: 'Medium',
      status: 'Not remembered',
      example: '',
      favorite: false
    };
    setLocalWords([newWord, ...localWords]);
    setEditing(`${newWord._id}-word`);
    setEditValue('');
    setPage(1);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center gap-2">
        <input
          type="text"
          placeholder="Search words..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        {workspace.author._id === authUser._id && (
          <button onClick={handleAddWord} className="btn btn-primary btn-sm flex items-center gap-2">
            <FaPlus /> Add Word
          </button>
        )}
      </div>

      <div className="grid grid-cols-[40px_150px_200px_120px_140px_1fr_100px] bg-base-200 font-bold p-2 rounded">
        <div>#</div>
        <div onClick={() => handleSort('word')} className="cursor-pointer flex items-center gap-1">
          Word <FaSort />
        </div>
        <div onClick={() => handleSort('definition')} className="cursor-pointer flex items-center gap-1">
          Definition <FaSort />
        </div>
        <div onClick={() => handleSort('level')} className="cursor-pointer text-center flex items-center justify-center gap-1">
          Level <FaSort />
        </div>
        <div onClick={() => handleSort('status')} className="cursor-pointer text-center flex items-center justify-center gap-1">
          Status <FaSort />
        </div>
        <div>Example</div>
        <div className="text-right">Actions</div>
      </div>

      {paginatedWords.map((word, index) => (
        <div key={word._id} className="grid grid-cols-[30px_160px_200px_120px_140px_1fr_100px] items-start p-2 border-b border-base-300 gap-y-1">
          <div>{(page - 1) * ITEMS_PER_PAGE + index + 1}</div>

          {/* Word */}
          <div className="flex items-start gap-2">
            <button onClick={() => toggleFav(word._id, word.favorite)}>
              {word.favorite ?   <FaRegStar />:<FaStar className="text-warning" />}
            </button>
            {editing === `${word._id}-word` ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(word._id, 'word')}
                onKeyDown={(e) => handleKeyDown(e, word._id, 'word')}
                className="input input-sm input-bordered w-full"
                autoFocus
              />
            ) : (
              <div onClick={() => startEdit(word._id, 'word', word.word)} className="cursor-pointer">
                {word.word || <span className="italic text-gray-500">Click to edit</span>}
              </div>
            )}
          </div>

          {/* Definition */}
          <div>
            {editing === `${word._id}-definition` ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(word._id, 'definition')}
                onKeyDown={(e) => handleKeyDown(e, word._id, 'definition')}
                className="input input-sm input-bordered w-full"
                autoFocus
              />
            ) : (
              <div onClick={() => startEdit(word._id, 'definition', word.definition)} className="cursor-pointer">
                {word.definition || <span className="italic text-gray-500">Click to edit</span>}
              </div>
            )}
          </div>

          {/* Level */}
          <div className="text-center">
            {editing === `${word._id}-level` ? (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(word._id, 'level')}
                onKeyDown={(e) => handleKeyDown(e, word._id, 'level')}
                className="select select-sm select-bordered"
                autoFocus
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            ) : (
              <div onClick={() => startEdit(word._id, 'level', word.level)} className="cursor-pointer">
                {word.level}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="text-center">
            {editing === `${word._id}-status` ? (
              <select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(word._id, 'status')}
                onKeyDown={(e) => handleKeyDown(e, word._id, 'status')}
                className="select select-sm select-bordered"
                autoFocus
              >
                <option>Remembered</option>
                <option>Not remembered</option>
              </select>
            ) : (
              <div onClick={() => startEdit(word._id, 'status', word.status)} className="cursor-pointer">
                {word.status}
              </div>
            )}
          </div>

          {/* Example */}
          <div>
            {editing === `${word._id}-example` ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(word._id, 'example')}
                onKeyDown={(e) => handleKeyDown(e, word._id, 'example')}
                className="input input-sm input-bordered w-full"
                autoFocus
              />
            ) : (
              <div onClick={() => startEdit(word._id, 'example', word.example)} className="cursor-pointer">
                {word.example || <span className="italic text-gray-500">Click to edit</span>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center">
            {workspace.author._id === authUser._id && (
              <button onClick={() => handleDelete(word._id)} className="btn btn-xs btn-error">
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <div className="join">
          {Array.from({ length: Math.ceil(filteredWords.length / ITEMS_PER_PAGE) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`join-item btn btn-sm ${page === i + 1 ? 'btn-active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabularyTable;
