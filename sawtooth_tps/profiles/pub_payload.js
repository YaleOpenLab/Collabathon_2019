'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class PubPayload {
    constructor(name, action, f1, f2) {
        this.name = name
        this.action = action
        this.f1 = f1
        this.f2 = f2
    }

    static fromBytes(payload) {
        payload = payload.toString().split(/(?!\B"[^"]*),(?![^"]*"\B)/g) //good? need regex to ignore , inside ""
        if (payload.length === 4) {
            let pubPayload = new PubPayload(payload[0], payload[1], payload[2], payload[3])
            if (!pubPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (pubPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }
            if (pubPayload.f2.indexOf('|') !== -1) { //will store public key address of interactable actions
                throw new InvalidTransaction('Name or To cannot contain "|"')
            }
            if (!pubPayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return pubPayload
        } else if (payload.length === 3) {
            let pubPayload = new PubPayload(payload[0], payload[1], payload[2])
            if (!pubPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (pubPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (!pubPayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return pubPayload
        } else if (payload.length === 2) {
            let pubPayload = new PubPayload(payload[0], payload[1])
            if (!pubPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (pubPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (pubPayload.action !== 'veri') {
                throw new InvalidTransaction('Invalid action or data')
            }
            return pubPayload
        } else {
            throw new InvalidTransaction('Invalid payload serialization')
        }
    }
}

module.exports = PubPayload
