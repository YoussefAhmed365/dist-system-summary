import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const searchEngineSnippet = `// 1. User Interface (Presentation Layer)
function SearchBox() {
  return <input type="text" placeholder="Search..." onChange={handleSearch} />;
}

// 2. Processing Level (Business Logic Layer)
async function handleSearch(query) {
  const validatedQuery = applyValidationRules(query);
  const results = await executeSearchAlgorithm(validatedQuery);
  return formatResultsForUser(results);
}

// 3. Data Level (Persistence Layer)
async function executeSearchAlgorithm(query) {
  // Database or File System housing the actual records
  return db.query('SELECT * FROM web_pages WHERE content LIKE ?', [query]);
}`;

const rpcSnippet = `// Client Machine
function clientApp() {
  // Transparently calling remote procedure
  const result = remoteMathService.add(5, 10); 
  console.log("Result from remote server:", result);
}

// Client Stub (Auto-generated)
function add(a, b) {
  const message = marshal({ method: "add", args: [a, b] });
  return network.sendAndWait(serverAddress, message);
}

// Server Machine
// Server Stub
function receiveMessage(message) {
  const request = unmarshal(message);
  if (request.method === "add") {
     const res = actualServerProcess.add(...request.args);
     network.send(clientAddress, marshal(res));
  }
}

// Server Process
const actualServerProcess = {
  add: (a, b) => a + b
};`;

export function SnippetBlock({ id }: { id: string; key?: React.key }) {
  const code = id === 'search-engine-app' ? searchEngineSnippet : id === 'rpc-code' ? rpcSnippet : '';

  if (!code) return null;

  return (
    <div className="my-6 rounded-2xl overflow-hidden shadow-sm border border-[#E0D8C3]" dir="ltr">
      <div className="bg-[#2d2d2d] px-4 py-2 text-xs font-mono text-gray-400 border-b border-gray-700 uppercase tracking-widest">
        {id === 'search-engine-app' ? 'Three-Tier Search Engine App' : 'RPC Implementation Flow'}
      </div>
      <SyntaxHighlighter language="javascript" style={vscDarkPlus} customStyle={{ margin: 0, padding: '1.5rem', fontSize: '0.875rem' }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
