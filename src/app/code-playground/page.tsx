"use client";
import { useState } from 'react';

export default function CodePlayground() {
  const [code, setCode] = useState('// Write your code here...');
  const [output, setOutput] = useState('');

  const runCode = () => {
    try {
      // Only for JS/TS demo. In production, use a sandboxed backend!
      // eslint-disable-next-line no-eval
      // @ts-ignore
      const result = eval(code);
      setOutput(String(result));
    } catch (e) {
      setOutput('Error: ' + (e as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-indigo-100 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Code Playground</h1>
        <textarea
          className="w-full h-40 border rounded p-2 font-mono text-black bg-gray-50 mb-4"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <div className="flex gap-4 mb-4">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded font-bold shadow hover:bg-indigo-700" onClick={runCode}>Run</button>
          <button className="bg-gray-300 text-black px-6 py-2 rounded font-bold shadow hover:bg-gray-400" onClick={() => setCode('')}>Clear</button>
        </div>
        <div className="bg-gray-100 rounded p-4 min-h-[40px] text-black">
          <strong>Output:</strong> {output}
        </div>
      </div>
    </div>
  );
}
