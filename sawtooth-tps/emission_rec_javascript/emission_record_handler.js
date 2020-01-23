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
        let desc = payload.desc.split('_')
        if (payload.action === 'create') {
            console.log('create')
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec !== undefined) {
                        throw new InvalidTransaction('Invalid Action: dRec already exists.')
                    }
                    let Allowed = isAllowed(payload.desc)

                    function isAllowed(str) {
                        return /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\,\.\-_\^\@\$\%\*\(\)\=\+\/]/.test(str);
                    }
                    if (!Allowed) {
                        throw new InvalidTransaction('Invalid Description: Only "Aa-Zz-_,.^@$%+/=" allowed in description.')
                    }
                    // data validation here
                    let createddRec = {
                        name: payload.name,
                        by: by,
                        verified: '',
                        data: payload.desc
                    }


                    return emreState.setdRec(payload.name, createddRec)
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
                    for (i = 0; i < dRec.verified.length; i++) {
                        if (by === dRec.verified[i][0]) {
                            veri = true
                        }
                    }
                    if (by !== dRec.by && !veri) {
                        dRec.verified.push([by, 0])
                    }

                    return emreState.setdRec(payload.name, dRec)
                })
        } else if (payload.action === 'test') {
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Test requires an existing dRec.'
                        )
                    }
                    let veri = false
                    for (i = 0; i < dRec.verified.length; i++) {
                        if (by === dRec.verified[i][0]) {
                            veri = true
                        }
                    }
                    if (by !== dRec.by && !veri) {

                        dRec.verified.push([by, payload.desc.substr(0, 70)])
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
                    for (i = 0; i < dRec.verified.length; i++) {
                        if (by === dRec.verified[i][0]) {
                            veri = true
                        }
                    }
                    if (by !== dRec.by && !veri) {

                        dRec.verified.push([by, payload.desc.substr(0, 70)])
                    }

                    return emreState.setdRec(payload.name, dRec)
                })
        } else if (payload.action === 'delete') {
            return emreState.getdRec(payload.name)
                .then((dRec) => {
                    if (dRec === undefined) {
                        throw new InvalidTransaction(
                            `No dRec exists with name ${payload.name}: unable to delete`)
                    } else if (by == dRec.by) {
                        return emreState.deletedRec(payload.name)
                    } else {
                        arr = drec.verified,
                            index = null
                        for (i = 0; i < arr.length; i++) {
                            if (arr[i][0] == by) {
                                index = i
                                break;
                            }
                        }
                        if (index > -1) {
                            dRec.verified.splice(index, 1)
                            return emreState.setdRec(payload.name, dRec)
                        } else {
                            throw new InvalidTransaction(
                                `You don't have permission to do that.`)
                        }
                    }
                })
        } else {
            throw new InvalidTransaction(
                `Action must be create, delete, or veri not ${payload.action}`
            )
        }
    }
}

module.exports = EMREHandler
