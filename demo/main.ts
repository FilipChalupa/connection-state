import { connectionState } from '../src'
import './global.css'

const output = document.querySelector('output')
if (!output) {
	throw new Error('No output element found')
}

const log = (message: string) => {
	const now = new Date()
	output.innerHTML =
		`<div>[<time>${now.toLocaleTimeString()}</time>] ${message}</div>` +
		output.innerHTML
}

const connection = connectionState()

log(`Initial state is ${connection.getState()}`)

connection.addListener((state) => {
	log(`State has changed to ${state}`)
})
