import { listenable } from 'custom-listenable'

export const connectionStatus = () => {
	const listener = listenable<ReturnType<typeof getStatus>>()

	const getStatus = () => {
		if (navigator.onLine) {
			return 'online'
		}
		return 'offline'
	}

	const handleStatusChange = () => {
		listener.emit(getStatus())
	}

	window.addEventListener('offline', handleStatusChange)
	window.addEventListener('online', handleStatusChange)

	return {
		addListener: listener.addListener,
		removeListener: listener.removeListener,
		getStatus,
	}
}
