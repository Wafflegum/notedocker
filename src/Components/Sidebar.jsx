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
		setEditor(newNote)
		localStorage.setItem('notes', JSON.stringify(updatedData))
	}

	return (
		<div className="sidebar-container">
			<div id="sidebarHeader">
				<h2>NoteDocker</h2>
			</div>
			<div id="sidebarContent">
				<div className="notes-container">
					{data
						? data.map((notedock, i) => {
								return (
									<button className="note" onClick={() => handleOpenNote(notedock.id)} key={i}>
										<div className="note-icon"></div>
										<div className="note-name">{notedock.header}</div>
									</button>
								)
						  })
						: ''}
				</div>
				<div id="sidebarButtons">
					<button className="sidebar-btn" id="addNote" onClick={handleNoteCreation}>
						New Note
					</button>
					<button className="sidebar-btn" id="addFolder">
						New Folder
					</button>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
