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

const EmRePayload = require('./emission_record_payload')

const { EMRE_NAMESPACE, EMRE_FAMILY, EmReState } = require('./emission_record_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')


class EMREHandler extends TransactionHandler {
    constructor() {
        super(EMRE_FAMILY, ['1.0'], [EMRE_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        console.log('apply')
        let payload = EmRePayload.fromBytes(transactionProcessRequest.payload)
        let emreState = new EmReState(context)
        let header = transactionProcessRequest.header
        let by = header.signerPublicKey
        let desc = payload.desc.split('_') //array containing record, this should do some validation but for now i'm content storing the string directly
        let Allowed = isAllowed(payload.desc)

        function isAllowed(str) {
            return /[0-9a-zA-Z\+\=\-\*\^\%\.\_\@]/.test(str);
        }
        if (!Allowed) {
            throw new InvalidTransaction('Invalid Description: Only "0-9Aa-Zz-_.^@%+/=" allowed in description.')
        }
        if (payload.action === 'create') {
            console.log('create')
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec !== undefined) {
                        let createddRec = {
                            name: payload.name,
                            by: by,
                            verified: '',
                            data: payload.desc
                        }
                        return emreState.setdRec(payload.name, createddRec)
                        //throw new InvalidTransaction('Invalid Action: Emission Record exists.')
                    } else {

                        // data validation here
                        let createddRec = {
                            name: payload.name,
                            by: by,
                            verified: '',
                            data: payload.desc
                        }

                        console.log({ createddRec })
                        return emreState.setdRec(payload.name, createddRec)
                    }
                })
        } else if (payload.action === 'verify') {
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Verify requires an existing dRec.'
                        )
                    }
                    let veri = false
                    let arr = dRec.verified.split('|')
                    for (i = 0; i < arr.length; i++) {
                        if (by === arr[i].split('-')[0]) {
                            veri = true
                        }
                    }
                    if (by !== dRec.by && !veri) {
                        dRec.verified + `|${by}-0`
                    }

                    return emreState.setdRec(payload.name, dRec)
                })
        } else if (payload.action === 'fix') {
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Fix requires an existing dRec.'
                        )
                    }
                    let veri = false
                    let arr = dRec.verified.split('|')
                    for (i = 0; i < arr.length; i++) {
                        if (by === arr[i].split('-')[0]) {
                            veri = true
                        }
                    }
                    if (by !== dRec.by && veri === false) {

                        dRec.verified + `|${by}-${payload.desc.substr(0, 46)}`
                    } else {
                        //handle updates
                    }

                    return emreState.setdRec(payload.name, dRec)
                })
        } else {
            throw new InvalidTransaction(
                `Action must be create, verify, or fix not ${payload.action}`
            )
        }
    }
}

module.exports = EMREHandler
