import { listenable } from 'custom-listenable'

export type ConnectionState = 'online' | 'offline'
export type ConnectionOptions = {
	endpoints?: string[]
}

export const connectionState = (options: ConnectionOptions = {}) => {
	const listener = listenable<ConnectionState>()
	const { endpoints = [] } = options

	if (endpoints.length > 0) {
		// @TODO: when navigator.onLine === true, check these endpoints
		throw new Error('Endpoints are not supported yet')
	}

	const getState = () => {
		if (navigator.onLine) {
			return 'online'
		}
		return 'offline'
	}

	const handleStatusChange = () => {
		listener.emit(getState())
	}

	window.addEventListener('offline', handleStatusChange)
	window.addEventListener('online', handleStatusChange)

	return {
		addListener: listener.addListener,
		removeListener: listener.removeListener,
		getState,
	}
}
