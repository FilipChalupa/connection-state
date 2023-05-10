import { connectionState } from '../src'
import './global.css'

const output = document.querySelector('output')
if (!output) {
	throw new Error('No output element found')
}

const connection = connectionState()

output.textContent = `Initial state: ${connection.getState()}`

connection.addListener((state) => {
	output.textContent = `Updated state: ${state}`
})
