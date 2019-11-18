/**
 * Copyright 2017-2018 Intel Corporation
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

const DluxPayload = require('./dlux_payload')

const { DLUX_NAMESPACE, DLUX_FAMILY, DluxState } = require('./dlux_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _appToStr = (name, by, addr, veri, desc) => {
    let out = ''
    out += `dApp: ${name}\n`
    out += `description: ${desc}\n`
    out += `by: ${by}\n`
    out += `IPFS Address: ${addr}\n`
    for (i = 0; i < veri.length; i++) {
        out += `endorsed by: ${veri[i]}\n`
    }
    return out
}

const _display = msg => {
    let n = msg.search('\n')
    let length = 0

    if (n !== -1) {
        msg = msg.split('\n')
        for (let i = 0; i < msg.length; i++) {
            if (msg[i].length > length) {
                length = msg[i].length
            }
        }
    } else {
        length = msg.length
        msg = [msg]
    }

    console.log('+' + '-'.repeat(length + 2) + '+')
    for (let i = 0; i < msg.length; i++) {
        let len = length - msg[i].length

        if (len % 2 === 1) {
            console.log(
                '+ ' +
                ' '.repeat(Math.floor(len / 2)) +
                msg[i] +
                ' '.repeat(Math.floor(len / 2 + 1)) +
                ' +'
            )
        } else {
            console.log(
                '+ ' +
                ' '.repeat(Math.floor(len / 2)) +
                msg[i] +
                ' '.repeat(Math.floor(len / 2)) +
                ' +'
            )
        }
    }
    console.log('+' + '-'.repeat(length + 2) + '+')
}


class DLUXHandler extends TransactionHandler {
    constructor() {
        super(DLUX_FAMILY, ['1.0'], [DLUX_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = DluxPayload.fromBytes(transactionProcessRequest.payload)
        let dluxState = new DluxState(context)
        let header = transactionProcessRequest.header
        let by = header.signerPublicKey

        if (payload.action === 'create') {
            return dluxState.getGame(payload.name)
                .then((dApp) => {
                    if (dApp !== undefined) {
                        throw new InvalidTransaction('Invalid Action: dApp already exists.')
                    }
                    let Allowed = isAllowed(payload.desc)

                    function isAllowed(str) {
                        return /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\,\.\-_\@\$\%\*\(\)\=\+\/]/.test(str);
                    }
                    if (!Allowed) {
                        throw new InvalidTransaction('Invalid Description: Only "Aa-Zz-_,.@$%+/=" allowed in description.')
                    }
                    let createddApp = {
                        name: payload.addr,
                        desc: payload.desc,
                        addr: payload.addr,
                        by: by,
                        veri: [],
                        challenge: []
                    }

                    _display(`Stakeholder ${by.toString().substring(0, 6)} created dApp ${payload.name}`)

                    return dluxState.setdApp(payload.name, createddApp)
                })
        } else if (payload.action === 'veri') {
            return dluxState.getdApp(payload.name)
                .then((dApp) => {
                    if (dApp === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Verify requires an existing dApp.'
                        )
                    }
                    let veri = false
                    for (i = 0; i < dApp.veri.length; i++) {
                        if (by === dApp.veri[i]) {
                            veri = true
                        }
                    }
                    if (by !== dApp.by && !veri) {
                        dApp.veri.push(by)
                    }

                    let byString = by.toString().substring(0, 6)

                    _display(
                        `Stakeholder ${byString} has verified: ${payload.name}\n\n` +
                        _appToStr(
                            dApp.name,
                            dApp.by,
                            dApp.addr,
                            dApp.veri,
                            dApp.desc
                        )
                    )

                    return dluxState.setGame(payload.name, dApp)
                })
        } else if (payload.action === 'delete') {
            return dluxState.getdApp(payload.name)
                .then((dApp) => {
                    if (dApp === undefined) {
                        throw new InvalidTransaction(
                            `No dApp exists with name ${payload.name}: unable to delete`)
                    } else if (by !== dApp.by) {
                        throw new InvalidTransaction(
                            `This dApp was created by ${dApp.by}: unable to delete`)
                    }
                    return dluxState.deletedApp(payload.name)
                })
        } else {
            throw new InvalidTransaction(
                `Action must be create, delete, or veri not ${payload.action}`
            )
        }
    }
}

module.exports = DLUXHandler