import { connectionStatus } from '../src/connectionStatus'
import './global.css'

const output = document.querySelector('output')
if (!output) {
	throw new Error('No output element found')
}

const status = connectionStatus()

output.textContent = `Initial status: ${status.getStatus()}`

status.addListener((status) => {
	output.textContent = `Updated status: ${status}`
})
