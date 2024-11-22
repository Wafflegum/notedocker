import { useEffect, useState } from 'react'
import '../css/components/Sidebar.css'
import { nanoid } from 'nanoid'

const Sidebar = ({ notes, setEditor }) => {
	const [data, setData] = useState(notes)

	useEffect(() => {
		setData(notes)
	}, [notes])

	function handleOpenNote(id) {
		const clickedEditor = data.find((note) => note.id === id)
		setEditor(clickedEditor)
	}

	function handleNoteCreation() {
		const newNote = { header: 'Untitled', id: nanoid(6), time: new Date().getTime(), blocks: [] }

		const currentData = Array.isArray(data) ? data : []

		const updatedData = [newNote, ...currentData]
		setData(updatedData)
		localStorage.setItem('notes', JSON.stringify(updatedData))

		setEditor(newNote)
	}

	return (
		<div className="sidebar-container">
			<div id="sidebarHeader">
				<h2>NoteDocker</h2>
			</div>
			<div id="sidebarContent">
				{notes
					? notes.map((notedock, i) => {
							return (
								<button className="note" onClick={() => handleOpenNote(notedock.id)} key={i}>
									{notedock.header}
								</button>
							)
					  })
					: ''}
				<div id="sidebar-buttons">
					<button id="addNote" onClick={handleNoteCreation}>
						New Note
					</button>
					<button id="addFolder">New Folder</button>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
