import { listenable } from 'custom-listenable'

export type ConnectionState = 'online' | 'offline'
export type ConnectionOptions = {
	endpoints?: string[]
	initialState?: ConnectionState
	retryInterval?: number
}

export const connectionState = (options: ConnectionOptions = {}) => {
	const listener = listenable<ConnectionState>()
	const {
		endpoints = [],
		initialState = 'online',
		retryInterval = 5000,
	} = options
	let endpointsCheckCounter = 0
	let endpointsCheckTimer: ReturnType<typeof setTimeout> | null = null
	let lastState: ConnectionState = initialState

	const areEndpointsReachable = async () => {
		const results = await Promise.all(
			endpoints.map(async (endpoint) => {
				try {
					const response = await fetch(endpoint, {
						method: 'HEAD',
						mode: 'no-cors',
					})
					return response.ok || response.type === 'opaque'
				} catch (error) {
					return false
				}
			}),
		)
		return results.every((result) => result)
	}

	const startEndpointsCheck = () => {
		if (endpointsCheckTimer !== null) {
			return
		}
		endpointsCheckLoop()
	}

	// @TODO: Rerun as soon as possible if window visibility changes to visible and focus acquired
	// @TODO: Don't check without listeners
	const endpointsCheckLoop = () => {
		endpointsCheckTimer = setTimeout(
			async () => {
				const reachable = await areEndpointsReachable()
				if (reachable) {
					if (lastState === 'offline') {
						lastState = 'online'
						emitState()
					}
				} else {
					if (lastState === 'online') {
						lastState = 'offline'
						emitState()
					}
				}
				endpointsCheckLoop()
			},
			endpointsCheckCounter === 0 ? 0 : retryInterval,
		)
		endpointsCheckCounter++
	}

	const stopEndpointsCheck = () => {
		if (endpointsCheckTimer) {
			clearTimeout(endpointsCheckTimer)
			endpointsCheckTimer = null
			endpointsCheckCounter = 0
		}
	}

	const getState = () => lastState
	const getNewState = () => (navigator.onLine ? 'online' : 'offline')

	const handleNewState = (newState: ConnectionState) => {
		if (newState === 'offline') {
			lastState = newState
			stopEndpointsCheck()
			emitState()
		} else if (newState === 'online') {
			startEndpointsCheck()
		}
	}

	const handleStateChange = () => {
		const newState = getNewState()

		if (newState !== lastState) {
			handleNewState(newState)
		}
	}

	const emitState = () => {
		listener.emit(getState())
	}

	if ('addEventListener' in globalThis) {
		globalThis.addEventListener('offline', handleStateChange)
		globalThis.addEventListener('online', handleStateChange)
		handleNewState(getNewState())
	}

	return {
		addListener: listener.addListener,
		removeListener: listener.removeListener,
		getState,
	}
}
