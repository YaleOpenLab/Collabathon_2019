

'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
class EmRePayload {
    constructor(name, action, desc) {
        this.name = name
        this.action = action
        this.desc = desc
    }

    static fromBytes(payload) {
        payload = payload.toString().split(',')
        if (payload.length === 3) {
            let emrePayload = new EmRePayload(payload[0], payload[1], payload[2])
            if (!emrePayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (emrePayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (!emrePayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return emrePayload
        } else {
            throw new InvalidTransaction(`${payload.length} Invalid payload serialization`)
        }

    }
}

module.exports = EmRePayload
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class EmRePayload {
    constructor(name, action, desc, addr) {
        this.name = name
        this.action = action
        this.desc = desc
        this.addr = addr
    }

    static fromBytes(payload) {
        payload = payload.toString().split(/,(?=(?:[^"]"[^"]")[^"]$)/gm)
        if (payload.length === 4) {
            let emrePayload = new EmRePayload(payload[0], payload[1], payload[2], payload[3])
            if (!emrePayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (emrePayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (!emrePayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return emrePayload
        } else if (payload.length === 2) {
            let emrePayload = new EmRePayload(payload[0], payload[1])
            if (!emrePayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (emrePayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (emrePayload.action !== 'verify' || emrePayload.action !== 'fix') {
                throw new InvalidTransaction('Invalid action or data')
            }
            return emrePayload
        } else if (payload.length === 3) {
            let emrePayload = new EmRePayload(payload[0], payload[1], payload[2])
            if (!emrePayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (emrePayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (emrePayload.action !== 'fix') {
                throw new InvalidTransaction('Invalid action or data')
            }
            return emrePayload
        } else {
            throw new InvalidTransaction('Invalid payload serialization')
        }
    }
}

module.exports = EmRePayload
