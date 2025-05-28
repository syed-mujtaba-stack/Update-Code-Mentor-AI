"use client";
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function CustomQuizzesPage() {
  const { user, isLoaded } = useUser();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], correct: 0 }
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/custom-quizzes')
        .then(async res => { try { return await res.json(); } catch { return {}; } })
        .then(data => setQuizzes(data.quizzes || []));
    }
  }, [user]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const handleSaveQuiz = async () => {
    setSaving(true);
    await fetch('/api/custom-quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, questions }),
    });
    setTitle('');
    setQuestions([{ question: '', options: ['', '', '', ''], correct: 0 }]);
    setSaving(false);
    fetch('/api/custom-quizzes')
      .then(async res => { try { return await res.json(); } catch { return {}; } })
      .then(data => setQuizzes(data.quizzes || []));
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Create a Custom Quiz</h1>
        <input
          className="w-full border rounded p-2 mb-4 text-black"
          placeholder="Quiz Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        {questions.map((q, idx) => (
          <div key={idx} className="mb-4 p-3 bg-gray-50 rounded">
            <input
              className="w-full border rounded p-2 mb-2 text-black"
              placeholder={`Question ${idx + 1}`}
              value={q.question}
              onChange={e => {
                const newQs = [...questions];
                newQs[idx].question = e.target.value;
                setQuestions(newQs);
              }}
            />
            {q.options.map((opt, oidx) => (
              <div key={oidx} className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name={`correct-${idx}`}
                  checked={q.correct === oidx}
                  onChange={() => {
                    const newQs = [...questions];
                    newQs[idx].correct = oidx;
                    setQuestions(newQs);
                  }}
                />
                <input
                  className="flex-1 border rounded p-2 text-black"
                  placeholder={`Option ${oidx + 1}`}
                  value={opt}
                  onChange={e => {
                    const newQs = [...questions];
                    newQs[idx].options[oidx] = e.target.value;
                    setQuestions(newQs);
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        <button className="bg-gray-300 text-black px-4 py-2 rounded font-bold shadow hover:bg-gray-400 mr-2" onClick={handleAddQuestion}>Add Question</button>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold shadow hover:bg-indigo-700" onClick={handleSaveQuiz} disabled={saving}>{saving ? 'Saving...' : 'Save Quiz'}</button>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Your Custom Quizzes</h2>
        {quizzes.length === 0 && <p className="text-gray-500">No quizzes yet.</p>}
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="font-semibold text-indigo-700">{quiz.title}</h3>
            <ol className="list-decimal ml-5">
              {quiz.questions.map((q: any, qidx: number) => (
                <li key={qidx} className="mb-1">
                  {q.question} <span className="text-xs text-gray-400">(Correct: {q.options[q.correct]})</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
