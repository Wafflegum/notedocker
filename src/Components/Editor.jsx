import React, { useEffect } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import Delimiter from '@coolbytes/editorjs-delimiter'

import '../css/Components/Editor.css'

let editorInstance

const tools = {
	header: {
		class: Header,
		inlineToolbar: ['link'],
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

function initEditor() {
	if (!editorInstance) {
		editorInstance = new EditorJS({
			holder: 'editorjs',
			tools: tools,
			data: {},
			autofocus: true,
			onReady: () => {
				console.log('EditorJS is now ready')
			},
		})
	}
}

const Editor = () => {
	useEffect(() => {
		initEditor()

		return () => {
			if (editorInstance && typeof editorInstance.destroy === 'function') {
				editorInstance.destroy()
				editorInstance = null
			} else {
				console.warn('Editor instance does not have a destroy method.')
			}
		}
	}, [])

	return (
		// <div className="editor-container">
		<div id="editorjs"></div>
		// </div>
	)
}

export default Editor
