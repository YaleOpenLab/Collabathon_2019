/**
 * Copyright 2018 Intel Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ------------------------------------------------------------------------------
 */

'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

class AccountPayload {
    constructor(name, action, f1, f2) {
        this.name = name
        this.action = action
        this.f1 = f1
        this.f2 = f2
    }

    static fromBytes(payload) {
        payload = payload.toString().split(/(?!\B"[^"]*),(?![^"]*"\B)/g) //good? need regex to ignore , inside ""
        if (payload.length === 4) {
            let accountPayload = new AccountPayload(payload[0], payload[1], payload[2], payload[3])
            if (!accountPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (accountPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }
            if (accountPayload.f2.indexOf('|') !== -1) { //will store accountlic key address of interactable actions
                throw new InvalidTransaction('Name or To cannot contain "|"')
            }
            if (!accountPayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return accountPayload
        } else if (payload.length === 3) {
            let accountPayload = new AccountPayload(payload[0], payload[1], payload[2])
            if (!accountPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (accountPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (!accountPayload.action) {
                throw new InvalidTransaction('Action is required')
            }
            return accountPayload
        } else if (payload.length === 2) {
            let accountPayload = new AccountPayload(payload[0], payload[1])
            if (!accountPayload.name) {
                throw new InvalidTransaction('Name is required')
            }
            if (accountPayload.name.indexOf('|') !== -1) {
                throw new InvalidTransaction('Name cannot contain "|"')
            }

            if (accountPayload.action !== 'veri') {
                throw new InvalidTransaction('Invalid action or data')
            }
            return accountPayload
        } else {
            throw new InvalidTransaction('Invalid payload serialization')
        }
    }
}

module.exports = AccountPayload