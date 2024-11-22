import { useEffect, useState } from 'react'
import '../css/App.css'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'

function App() {
	const [notes, setNotes] = useState(JSON.parse(localStorage.getItem('notes')) || [])
	const [editor, setEditor] = useState(notes[0] || {})

	return (
		<>
			<main>
				<Sidebar notes={notes} setEditor={setEditor} />
				<Editor notes={editor} setNotes={setNotes} />
			</main>
		</>
	)
}

export default App
