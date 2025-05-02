


import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaSortAmountDown, FaFilter } from 'react-icons/fa';

const VocabularyTable = () => {
  const [data, setData] = useState([
    {
      word: 'Abate hugnuerigho nerigjohejrig',
      meaning: 'To become less intense or widespread',
      level: 'E',
      status: 'Remembered',
      example: 'The storm suddenly abated.',
      starred: true,
    },
    {
      word: 'Belligerent',
      meaning: 'Hostile and aggressive',
      level: 'M',
      status: 'Not remembered',
      example: 'He was belligerent when someone cut him off.',
      starred: false,
    },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [edited, setEdited] = useState({});
  const [sortBy, setSortBy] = useState(null);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEdited(data[index]);
  };

  const handleSave = (index) => {
    const newData = [...data];
    newData[index] = edited;
    setData(newData);
    setEditIndex(null);
  };

  const handleChange = (e) => {
    setEdited({ ...edited, [e.target.name]: e.target.value });
  };

  const toggleStar = (index) => {
    const newData = [...data];
    newData[index].starred = !newData[index].starred;
    setData(newData);
  };

  const getLevelLabel = (letter) => {
    switch (letter) {
      case 'E': return 'Easy';
      case 'M': return 'Medium';
      case 'H': return 'Hard';
      default: return '';
    }
  };

  // Handle textarea resize on input change and initial render
  const handleTextareaResize = (textarea) => {
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Effect to resize textareas when editing starts
  useEffect(() => {
    if (editIndex !== null) {
      const meaningTextarea = document.querySelector(`textarea[name="meaning"][data-index="${editIndex}"]`);
      const exampleTextarea = document.querySelector(`textarea[name="example"][data-index="${editIndex}"]`);
      
      if (meaningTextarea) handleTextareaResize(meaningTextarea);
      if (exampleTextarea) handleTextareaResize(exampleTextarea);
    }
  }, [editIndex]);

  return (
    <div className="p-6 bg-base-200 min-h-screen text-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📚 Vocabulary Table</h1>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline btn-success">
            <FaSortAmountDown />
          </button>
          <button className="btn btn-sm btn-outline btn-info">
            <FaFilter />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <div className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_40px] bg-neutral text-neutral-content p-2 font-semibold text-left text-sm">
          <div>#</div>
          <div className="flex items-center gap-1">Word</div>
          <div>Meaning</div>
          <div className="text-center">Level</div>
          <div className="text-center">Status</div>
          <div>Example</div>
          <div></div>
        </div>

        {data.map((word, index) => (
          <div key={index} className=" grid grid-cols-[40px_180px_250px_100px_160px_1fr_40px] items-center border-b border-base-300  p-2">
            <div>{index + 1}</div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleStar(index)}>
                {word.starred ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
              </button>
              {editIndex === index ? (
                <textarea
                  type="text"
                  name="word"
                  value={edited.word}
                  onChange={handleChange}
                  onInput={(e) => handleTextareaResize(e.target)}
                  // className="input input-sm input-bordered w-full"
                   className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
                />
              ) : (
                <span className="break-words">{word.word}</span>
              )}
            </div>
            <div>
              {editIndex === index ? (
                <textarea
                  name="meaning"
                  value={edited.meaning}
                  onChange={handleChange}
                  onInput={(e) => handleTextareaResize(e.target)}
                  data-index={index}
                  className="textarea textarea-sm textarea-bordered w-full resize-none overflow-hidden"
                  style={{ minHeight: '40px' }}
                />
              ) : (
                <span className="break-words whitespace-pre-line">{word.meaning}</span>
              )}
            </div>
            <div className="text-center">
              {editIndex === index ? (
                <select
                  name="level"
                  value={edited.level}
                  onChange={handleChange}
                  className="select select-sm select-bordered w-full"
                >
                  <option value="E">Easy</option>
                  <option value="M">Medium</option>
                  <option value="H">Hard</option>
                </select>
              ) : (
                <span className="tooltip" data-tip={getLevelLabel(word.level)}>
                  <span
                    className={`font-bold ${
                      word.level === 'E'
                        ? 'text-green-500'
                        : word.level === 'M'
                        ? 'text-yellow-400'
                        : 'text-red-500'
                    }`}
                  >
                    {word.level}
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
                >
                  <option value="Remembered">Remembered</option>
                  <option value="Not remembered">Not remembered</option>
                  <option value="Learning">Learning</option>
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
                />
              ) : (
                <span className="whitespace-pre-line">{word.example}</span>
              )}
            </div>
            <div className="text-right">
              {editIndex === index ? (
                <button
                  onClick={() => handleSave(index)}
                  className="btn btn-xs btn-success"
                >
                  💾
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(index)}
                  className="btn btn-xs btn-ghost"
                >
                  ✏️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyTable;

// import React, { useState, useEffect } from 'react';
// import { FaStar, FaRegStar, FaSortAmountDown, FaFilter } from 'react-icons/fa';

// const VocabularyTable = () => {
//   const [data, setData] = useState([
//     {
//       word: 'Abate hugnuerigho nerigjohejrig',
//       meaning: 'To become less intense or widespread',
//       level: 'E',
//       status: 'Remembered',
//       example: 'The storm suddenly abated.',
//       starred: true,
//     },
//     {
//       word: 'Belligerent',
//       meaning: 'Hostile and aggressive',
//       level: 'M',
//       status: 'Not remembered',
//       example: 'He was belligerent when someone cut him off.',
//       starred: false,
//     },
//   ]);

//   const [editIndex, setEditIndex] = useState(null);
//   const [edited, setEdited] = useState({});
//   const [sortBy, setSortBy] = useState(null);

//   const handleEdit = (index) => {
//     setEditIndex(index);
//     setEdited(data[index]);
//   };

//   const handleSave = (index) => {
//     const newData = [...data];
//     newData[index] = edited;
//     setData(newData);
//     setEditIndex(null);
//   };

//   const handleChange = (e) => {
//     setEdited({ ...edited, [e.target.name]: e.target.value });
//   };

//   const toggleStar = (index) => {
//     const newData = [...data];
//     newData[index].starred = !newData[index].starred;
//     setData(newData);
//   };

//   const getLevelLabel = (letter) => {
//     switch (letter) {
//       case 'E': return 'Easy';
//       case 'M': return 'Medium';
//       case 'H': return 'Hard';
//       default: return '';
//     }
//   };

//   // Handle textarea resize on input change
//   const handleResize = (e) => {
//     e.target.style.height = 'auto';  // Reset height to auto to adjust it for new content
//     e.target.style.height = `${e.target.scrollHeight}px`;  // Set height based on content
//   };

//   return (
//     <div className="p-6 bg-base-200 min-h-screen text-sm">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">📚 Vocabulary Table</h1>
//         <div className="flex gap-2">
//           <button className="btn btn-sm btn-outline btn-success">
//             <FaSortAmountDown />
//           </button>
//           <button className="btn btn-sm btn-outline btn-info">
//             <FaFilter />
//           </button>
//         </div>
//       </div>

//       <div className="overflow-x-auto rounded-lg shadow-lg">
//         <div className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_40px] bg-neutral text-neutral-content p-2 font-semibold text-left text-sm">
//           <div>#</div>
//           <div className="flex items-center gap-1">Word</div>
//           <div>Meaning</div>
//           <div className="text-center">Level</div>
//           <div className="text-center">Status</div>
//           <div>Example</div>
//           <div></div>
//         </div>

//         {data.map((word, index) => (
//           <div key={index} className="grid grid-cols-[40px_180px_250px_100px_160px_1fr_40px] items-center border-b border-base-300 p-2">
//             <div>{index + 1}</div>
//             <div className="flex items-center gap-2">
//               <button onClick={() => toggleStar(index)}>
//                 {word.starred ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
//               </button>
//               {editIndex === index ? (
//                 <input
//                   type="text"
//                   name="word"
//                   value={edited.word}
//                   onChange={handleChange}
//                   className="input input-sm input-bordered w-full"
//                 />
//               ) : (
//                 <span className="break-words">{word.word}</span>
//               )}
//             </div>
//             <div>
//               {editIndex === index ? (
//                 <textarea
//                   name="meaning"
//                   value={edited.meaning}
//                   onChange={handleChange}
//                   onInput={handleResize}  // Call resize function on input
//                   className="textarea textarea-sm textarea-bordered w-full resize-none"
//                   rows={1}  // This ensures it starts with a single row, and it expands based on content
//                 />
//               ) : (
//                 <span className="break-words">{word.meaning}</span>
//               )}
//             </div>
//             <div className="text-center">
//               {editIndex === index ? (
//                 <select
//                   name="level"
//                   value={edited.level}
//                   onChange={handleChange}
//                   className="select select-sm select-bordered w-full"
//                 >
//                   <option value="E">Easy</option>
//                   <option value="M">Medium</option>
//                   <option value="H">Hard</option>
//                 </select>
//               ) : (
//                 <span className="tooltip" data-tip={getLevelLabel(word.level)}>
//                   <span
//                     className={`font-bold ${
//                       word.level === 'E'
//                         ? 'text-green-500'
//                         : word.level === 'M'
//                         ? 'text-yellow-400'
//                         : 'text-red-500'
//                     }`}
//                   >
//                     {word.level}
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
//                 >
//                   <option value="Remembered">Remembered</option>
//                   <option value="Not remembered">Not remembered</option>
//                   <option value="Learning">Learning</option>
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
//                   onInput={handleResize}  // Call resize function on input
//                   className="textarea textarea-sm textarea-bordered w-full resize-none"
//                   rows={1}
//                 />
//               ) : (
//                 <span>{word.example}</span>
//               )}
//             </div>
//             <div className="text-right">
//               {editIndex === index ? (
//                 <button
//                   onClick={() => handleSave(index)}
//                   className="btn btn-xs btn-success"
//                 >
//                   💾
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => handleEdit(index)}
//                   className="btn btn-xs btn-ghost"
//                 >
//                   ✏️
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VocabularyTable;
