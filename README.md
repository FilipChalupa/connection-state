# Connection state [![npm](https://img.shields.io/npm/v/connection-state.svg)](https://www.npmjs.com/package/connection-state) ![npm type definitions](https://img.shields.io/npm/types/connection-state.svg)

Detect online and offline network state.

You can see it in action here [filipchalupa.cz/connection-state](https://filipchalupa.cz/connection-state/). Try to disconnect your device from the internet after loading the page.

## Installation

```bash
npm install connection-state
```

## Usage

```js
import { connectionState } from 'connection-state'

const connection = connectionState()

console.log(`You are ${connection.getState()}.`)
// connection.getState() returns 'online' or 'offline'

connection.addListener((state) => {
	console.log(`Your connection state has changed. You are now ${state}.`)
})
// state is 'online' or 'offline'
```

### Endpoints

You can specify endpoints to check if you are online. The library will try to fetch the endpoints. If it succeeds, you are online. If it fails, you are offline.

```js
const connection = connectionState({
	endpoints: ['https://www.google.com'],
})
```

## Development

- Install dependencies: `npm ci`
- Run: `npm run dev`
