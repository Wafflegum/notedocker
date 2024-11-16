import { useState } from 'react'
import '../css/App.css'
import Sidebar from '../components/Sidebar'
import Editor from '../components/Editor'

function App() {
	return (
		<>
			<main>
				<Sidebar />
				<Editor />
			</main>
		</>
	)
}

export default App
