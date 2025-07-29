

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

// // VocabularyTable.js
// import React, { useState, useEffect, useMemo } from 'react';
// import { FaStar, FaRegStar, FaTrash, FaSort } from 'react-icons/fa';
// import { wordStore } from '../store/wordStore';
// import { userAuthStore } from '../store/userAuthStore';
// import { toast } from 'react-hot-toast';

// const ITEMS_PER_PAGE = 10;

// const VocabularyTable = ({ workspace }) => {
//   const { authUser } = userAuthStore();
//   const {
//     words,
//     updateWord,
//     deleteWord,
//     toggleFavorite
//   } = wordStore();

//   const [search, setSearch] = useState('');
//   const [sortField, setSortField] = useState('word');
//   const [sortDir, setSortDir] = useState('asc');
//   const [editing, setEditing] = useState(null);
//   const [editValue, setEditValue] = useState('');
//   const [page, setPage] = useState(1);

//   const filteredWords = useMemo(() => {
//     const filtered = words.filter(word => {
//       return (
//         word.word.toLowerCase().includes(search.toLowerCase()) ||
//         word.definition.toLowerCase().includes(search.toLowerCase()) ||
//         word.example.toLowerCase().includes(search.toLowerCase()) ||
//         word.level.toLowerCase().includes(search.toLowerCase()) ||
//         word.status.toLowerCase().includes(search.toLowerCase())
//       );
//     });

//     filtered.sort((a, b) => {
//       let aVal = a[sortField] || '';
//       let bVal = b[sortField] || '';
//       if (sortDir === 'desc') [aVal, bVal] = [bVal, aVal];
//       return aVal.localeCompare(bVal);
//     });

//     return filtered;
//   }, [words, search, sortField, sortDir]);

//   const paginatedWords = filteredWords.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

//   const handleSort = (field) => {
//     if (sortField === field) {
//       setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDir('asc');
//     }
//   };

//   const startEdit = (id, field, value) => {
//     setEditing(`${id}-${field}`);
//     setEditValue(value);
//   };

//   const cancelEdit = () => {
//     setEditing(null);
//     setEditValue('');
//   };

//   const saveEdit = async (id, field) => {
//     try {
//       await updateWord(id, { [field]: editValue });
//       setEditing(null);
//       toast.success('Word updated');
//     } catch (e) {
//       toast.error('Update failed');
//     }
//   };

//   const handleKeyDown = (e, id, field) => {
//     if (e.key === 'Enter' || e.key === 'Tab') {
//       e.preventDefault();
//       saveEdit(id, field);
//     } else if (e.key === 'Escape') {
//       cancelEdit();
//     }
//   };

//   const handleDelete = async (id) => {
//     if (confirm('Delete this word?')) {
//       try {
//         await deleteWord(id);
//         toast.success('Deleted');
//       } catch (e) {
//         toast.error('Failed to delete');
//       }
//     }
//   };

//   const toggleFav = async (id, current) => {
//     try {
//       await toggleFavorite(id, !current);
//     } catch (e) {
//       toast.error('Failed to toggle favorite');
//     }
//   };

//   return (
//     <div className="p-4 space-y-4">
//       <div className="flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search words..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="input input-bordered w-full max-w-xs"
//         />
//       </div>

//       <div className="grid grid-cols-[40px_150px_200px_120px_140px_1fr_100px] bg-base-200 font-bold p-2 rounded">
//         <div>#</div>
//         <div onClick={() => handleSort('word')} className="cursor-pointer flex items-center gap-1">
//           Word <FaSort />
//         </div>
//         <div onClick={() => handleSort('definition')} className="cursor-pointer flex items-center gap-1">
//           Definition <FaSort />
//         </div>
//         <div onClick={() => handleSort('level')} className="cursor-pointer text-center flex items-center justify-center gap-1">
//           Level <FaSort />
//         </div>
//         <div onClick={() => handleSort('status')} className="cursor-pointer text-center flex items-center justify-center gap-1">
//           Status <FaSort />
//         </div>
//         <div>Example</div>
//         <div className="text-right">Actions</div>
//       </div>

//       {paginatedWords.map((word, index) => (
//         <div key={word._id} className="grid grid-cols-[40px_150px_200px_120px_140px_1fr_100px] items-center p-2 border-b border-base-300">
//           <div>{(page - 1) * ITEMS_PER_PAGE + index + 1}</div>

//           {/* Word */}
//           <div className="flex items-center gap-2">
//             <button onClick={() => toggleFav(word._id, word.favorite)}>
//               {word.favorite ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
//             </button>
//             {editing === `${word._id}-word` ? (
//               <input
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onBlur={() => saveEdit(word._id, 'word')}
//                 onKeyDown={(e) => handleKeyDown(e, word._id, 'word')}
//                 className="input input-sm input-bordered w-full"
//                 autoFocus
//               />
//             ) : (
//               <div onClick={() => startEdit(word._id, 'word', word.word)} className="cursor-pointer">
//                 {word.word || <span className="italic text-gray-500">Click to edit</span>}
//               </div>
//             )}
//           </div>

//           {/* Definition */}
//           <div>
//             {editing === `${word._id}-definition` ? (
//               <input
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onBlur={() => saveEdit(word._id, 'definition')}
//                 onKeyDown={(e) => handleKeyDown(e, word._id, 'definition')}
//                 className="input input-sm input-bordered w-full"
//                 autoFocus
//               />
//             ) : (
//               <div onClick={() => startEdit(word._id, 'definition', word.definition)} className="cursor-pointer">
//                 {word.definition || <span className="italic text-gray-500">Click to edit</span>}
//               </div>
//             )}
//           </div>

//           {/* Level */}
//           <div className="text-center">
//             {editing === `${word._id}-level` ? (
//               <select
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onBlur={() => saveEdit(word._id, 'level')}
//                 onKeyDown={(e) => handleKeyDown(e, word._id, 'level')}
//                 className="select select-sm select-bordered"
//                 autoFocus
//               >
//                 <option>Easy</option>
//                 <option>Medium</option>
//                 <option>Hard</option>
//               </select>
//             ) : (
//               <div onClick={() => startEdit(word._id, 'level', word.level)} className="cursor-pointer">
//                 {word.level}
//               </div>
//             )}
//           </div>

//           {/* Status */}
//           <div className="text-center">
//             {editing === `${word._id}-status` ? (
//               <select
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onBlur={() => saveEdit(word._id, 'status')}
//                 onKeyDown={(e) => handleKeyDown(e, word._id, 'status')}
//                 className="select select-sm select-bordered"
//                 autoFocus
//               >
//                 <option>Remembered</option>
//                 <option>Not remembered</option>
//               </select>
//             ) : (
//               <div onClick={() => startEdit(word._id, 'status', word.status)} className="cursor-pointer">
//                 {word.status}
//               </div>
//             )}
//           </div>

//           {/* Example */}
//           <div>
//             {editing === `${word._id}-example` ? (
//               <input
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 onBlur={() => saveEdit(word._id, 'example')}
//                 onKeyDown={(e) => handleKeyDown(e, word._id, 'example')}
//                 className="input input-sm input-bordered w-full"
//                 autoFocus
//               />
//             ) : (
//               <div onClick={() => startEdit(word._id, 'example', word.example)} className="cursor-pointer">
//                 {word.example || <span className="italic text-gray-500">Click to edit</span>}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end">
//             {workspace.author._id === authUser._id && (
//               <button onClick={() => handleDelete(word._id)} className="btn btn-xs btn-error">
//                 <FaTrash />
//               </button>
//             )}
//           </div>
//         </div>
//       ))}

//       {/* Pagination */}
//       <div className="flex justify-center mt-4">
//         <div className="join">
//           {Array.from({ length: Math.ceil(filteredWords.length / ITEMS_PER_PAGE) }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => setPage(i + 1)}
//               className={`join-item btn btn-sm ${page === i + 1 ? 'btn-active' : ''}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VocabularyTable;



// import React, { useState, useEffect } from 'react';
// import { FaStar, FaRegStar, FaSortAmountDown, FaFilter, FaTrash } from 'react-icons/fa';
// import WordCreateModal from './WordCreateModal';
// import { wordStore } from '../store/wordStore';
// import { toast } from "react-hot-toast";
// import { userAuthStore } from '../store/userAuthStore';

// const VocabularyTable = ({workspace}) => {
//   const {authUser}=userAuthStore();
//   const {
//     words,
//     isLoading,
//     setWords,
//     updateWord,
//     deleteWord,
//     toggleFavorite
//   } = wordStore();

//   const [showModal, setShowModal] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [edited, setEdited] = useState({});

//   // console.log(words)
//   // Handle word deletion
//   const handleDelete = async (wordId) => {
//     if (window.confirm('Are you sure you want to delete this word?')) {
//       try {
//         await deleteWord(wordId);
//         toast.success('Word deleted successfully');
//       } catch (error) {
//         toast.error(error.message || 'Failed to delete word');
//       }
//     }
//   };

//   // Handle word update
//   const handleSave = async (index) => {
//     const wordToUpdate = words[index];
//     try {
//       console.log('Updating word:', wordToUpdate._id, edited);
//       await updateWord(wordToUpdate._id, edited);
//       setEditIndex(null);
//       toast.success('Word updated successfully');
//     } catch (error) {
//       toast.error(error.message || 'Failed to update word');
//     }
//   };

//   // Setup edit mode
//   const handleEdit = (index) => {
//     setEditIndex(index);
//     setEdited({ ...words[index] });
//   };

//   // Handle field changes during edit
//   const handleChange = (e) => {
//     setEdited({ ...edited, [e.target.name]: e.target.value });
//   };

//   // Toggle favorite status
//   const handleFavorite = async (wordId, currentStatus) => {
//     try {
//       console.log('Toggling favorite for word:', wordId, currentStatus);
//       await toggleFavorite(wordId, !currentStatus);
//     } catch (error) {
//       toast.error(error.message || 'Failed to update favorite status');
//     }
//   };

//   // Textarea auto-resize helper
//   const handleTextareaResize = (textarea) => {
//     if (textarea) {
//       textarea.style.height = 'auto';
//       textarea.style.height = `${textarea.scrollHeight}px`;
//     }
//   };

//   useEffect(() => {
//     if (editIndex !== null) {
//       const definitionTextarea = document.querySelector(`textarea[name="definition"][data-index="${editIndex}"]`);
//       const exampleTextarea = document.querySelector(`textarea[name="example"][data-index="${editIndex}"]`);

//       if (definitionTextarea) handleTextareaResize(definitionTextarea);
//       if (exampleTextarea) handleTextareaResize(exampleTextarea);
//     }
//   }, [editIndex]);

//   // Helper for level display
//   const getLevelLabel = (level) => {
//     switch (level) {
//       case 'Easy': return 'E';
//       case 'Medium': return 'M';
//       case 'Hard': return 'H';
//       default: return '';
//     }
//   };


//   return (
//     <div className="p-6 bg-base-200 min-h-screen text-sm">
//       <div className="flex justify-between items-center mb-4">
//       { workspace.author._id === authUser._id &&
//           <button
//           onClick={() => setShowModal(true)}
//           className='btn btn-primary btn-sm'
//           disabled={isLoading}
//         >
//           {isLoading ? 'Loading...' : '+ Add New Word'}
//         </button>
//       }
        

//         <div className="flex gap-2">
//           <button className="btn btn-sm btn-outline btn-success" disabled={isLoading}>
//             <FaSortAmountDown />
//           </button>
//           <button className="btn btn-sm btn-outline btn-info" disabled={isLoading}>
//             <FaFilter />
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg shadow-lg">
//         <div className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] bg-neutral text-neutral-content p-2 font-semibold text-left text-sm">
//           <div>#</div>
//           <div className="flex items-center gap-1">Word</div>
//           <div>Definition</div>
//           <div className="text-center">Level</div>
//           <div className="text-center">Status</div>
//           <div>Example</div>
//           <div>Actions</div>
//         </div>

//         {  words.length === 0 && (
//           <div className="flex items-center justify-center h-32 text-gray-500">
//             <p className="text-lg">No words found.</p>
//           </div>
//         )}
//         {
//           words.map((word, index) => (
//           <div key={index} className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_80px] items-center border-b border-base-300 p-2">
//             <div>{index + 1}</div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleFavorite(word._id, !word.favorite);
//                 }}
//                 disabled={isLoading}
//               >
//                 {word.favorite ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
//               </button>
//               {editIndex === index ? (
//                 <textarea
//                   type="text"
//                   name="word"
//                   value={edited.word}
//                   onChange={handleChange}
//                   onInput={(e) => handleTextareaResize(e.target)}
//                   className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
//                   disabled={isLoading}
//                 />
//               ) : (
//                 <span className="break-words">{word.word}</span>
//               )}
//             </div>
//             <div>
//               {editIndex === index ? (
//                 <textarea
//                   name="definition"
//                   value={edited.definition}
//                   onChange={handleChange}
//                   onInput={(e) => handleTextareaResize(e.target)}
//                   data-index={index}
//                   className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
//                   style={{ minHeight: '40px' }}
//                   disabled={isLoading}
//                 />
//               ) : (
//                 <span className="break-words whitespace-pre-line">{word.definition}</span>
//               )}
//             </div>
//             <div className="text-center">
//               {editIndex === index ? (
//                 <select
//                   name="level"
//                   value={edited.level}
//                   onChange={handleChange}
//                   className="select select-sm select-bordered w-full"
//                   disabled={isLoading}
//                 >
//                   <option value="Easy">Easy</option>
//                   <option value="Medium">Medium</option>
//                   <option value="Hard">Hard</option>
//                 </select>
//               ) : (
//                 <span className="tooltip" data-tip={word.level}>
//                   <span
//                     className={`font-bold ${word.level === 'Easy'
//                         ? 'text-green-500'
//                         : word.level === 'Medium'
//                           ? 'text-yellow-400'
//                           : 'text-red-500'
//                       }`}
//                   >
//                     {getLevelLabel(word.level)}
//                   </span>
//                 </span>
//               )}
//             </div>
//             <div className="text-center font-semibold">
//               {editIndex === index ? (
//                 <select
//                   name="status"
//                   value={edited.status}
//                   onChange={handleChange}
//                   className="select select-sm select-bordered w-full"
//                   disabled={isLoading}
//                 >
//                   <option value="Remembered">Remembered</option>
//                   <option value="Not remembered">Not remembered</option>
//                 </select>
//               ) : (
//                 <span
//                   className={word.status === 'Remembered' ? 'text-green-500' : 'text-red-500'}
//                 >
//                   {word.status}
//                 </span>
//               )}
//             </div>
//             <div>
//               {editIndex === index ? (
//                 <textarea
//                   name="example"
//                   value={edited.example}
//                   onChange={handleChange}
//                   onInput={(e) => handleTextareaResize(e.target)}
//                   data-index={index}
//                   className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
//                   style={{ minHeight: '40px' }}
//                   disabled={isLoading}
//                 />
//               ) : (
//                 <span className="whitespace-pre-line">{word.example}</span>
//               )}
//             </div>
//             <div className="flex justify-end gap-1">
//             {workspace.author._id === authUser._id ? (
//   editIndex === index ? (
//     <button
//       onClick={() => handleSave(index)}
//       className="btn btn-xs btn-success"
//       disabled={isLoading}
//     >
//       {isLoading ? '...' : '💾Save'}
//     </button>
//   ) : (
//     <>
//       <button
//         onClick={() => handleEdit(index)}
//         className="btn btn-xs btn-ghost"
//         disabled={isLoading}
//       >
//         ✏️
//       </button>
//       <button
//         onClick={() => handleDelete(word._id)}
//         className="btn btn-xs btn-ghost text-error"
//         disabled={isLoading}
//       >
//         <FaTrash />
//       </button>
//     </>
//   )
// ) : null}

//             </div>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <WordCreateModal
//           onClose={() => setShowModal(false)}
//           onWordCreated={(newWord) => setWords([...words, newWord])}
//         />
//       )}
//     </div>
//   );
// };

// export default VocabularyTable;

