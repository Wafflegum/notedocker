import React, { useEffect, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import Delimiter from '@coolbytes/editorjs-delimiter'

import '../css/Components/Editor.css'
import { nanoid } from 'nanoid'

let editorInstance

const tools = {
	header: {
		class: Header,
		inlineToolbar: ['link'],
		config: {
			levels: [2, 3, 4],
			defaultLevel: 3,
		},
	},
	list: {
		class: List,
		inlineToolbar: true,
	},
	table: {
		class: Table,
		inlineToolbar: ['link'],
	},
	delimiter: Delimiter,
}

function debounce(func, delay) {
	let timeout
	return () => {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(), delay)
	}
}

const Editor = ({ notes, setNotes }) => {
	const [header, setHeader] = useState(notes.header ? notes.header : '')
	const [id, setId] = useState(notes.id ? notes.id : nanoid(6))

	function initEditor() {
		if (!editorInstance) {
			editorInstance = new EditorJS({
				holder: 'editorjs',
				tools: tools,
				data: notes,
				autofocus: true,
				onReady: () => {
					console.log('EditorJS is now ready')
				},
				onChange: debounce(() => {
					editorInstance
						.save()
						.then((output) => {
							const finalOutput = {
								header: document.getElementById('noteHeader').value,
								id: id,
								...output,
							}
							const oldData = JSON.parse(localStorage.getItem('notes'))
								? JSON.parse(localStorage.getItem('notes'))
								: []

							const existingNotedock = oldData.find((data) => data.id === id)

							console.log(existingNotedock)

							let data = []

							if (existingNotedock) {
								// Update existing note
								data = oldData.map((note) => (note.id === id ? { ...finalOutput } : note))
							} else {
								// Add new note
								data = [finalOutput, ...oldData]
							}

							localStorage.setItem('notes', JSON.stringify(data))
							setNotes(data)
						})
						.catch((error) => {
							console.warn('Saving failed: ', error)
						})
				}, 300),
			})
		}
	}
	useEffect(() => {
		initEditor()
		setHeader(notes ? notes.header : '')

		return () => {
			if (editorInstance && typeof editorInstance.destroy === 'function') {
				editorInstance.destroy()
				editorInstance = null
			} else {
				console.warn('Editor instance does not have a destroy method.')
			}
		}
	}, [notes])

	async function saveNotes() {
		// Check if editor instance exists and is ready
		if (!editorInstance) {
			console.log('Editor not ready yet')
			return
		}

		try {
			const output = await editorInstance.save()
			const finalOutput = { header: header, id: id, ...output }
			const oldData = JSON.parse(localStorage.getItem('notes')) || []
			const existingNotedock = oldData.find((data) => data.id === id)
			let data = []

			if (existingNotedock) {
				// Update existing note
				data = oldData.map((note) => (note.id === id ? { ...note, header, ...output } : note))
			} else {
				// Add new note
				data = [finalOutput, ...oldData]
			}

			localStorage.setItem('notes', JSON.stringify(data))
			setNotes(data)
		} catch (error) {
			console.warn('Saving failed: ', error)
		}
	}

	useEffect(() => {
		if (editorInstance) saveNotes()
	}, [header])

	function handleHeaderInput(event) {
		setHeader(event.target.value)
		saveNotes()
	}

	return (
		<div className="editor-container">
			<input className="note-header" id="noteHeader" value={header} onChange={handleHeaderInput} />
			<div id="editorjs"></div>
		</div>
	)
}

export default Editor
