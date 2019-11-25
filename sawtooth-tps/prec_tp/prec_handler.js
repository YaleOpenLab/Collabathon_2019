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

const pRecPayload = require('./prec_payload')

const { PREC_NAMESPACE, PREC_FAMILY, pRecState, _makepRecAddress } = require('./prec_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')


class PRECHandler extends TransactionHandler {
    constructor() {
        super(PREC_FAMILY, ['1.0'], [PREC_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = pRecPayload.fromBytes(transactionProcessRequest.payload)
        let precState = new pRecState(context)
        let header = transactionProcessRequest.header
        let by = header.signerPublicKey
        let methodsAddress = `p000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`.substring(0, 70)
        return precState.getpRec(methodsAddress)
            .then((methods) => {
                //methods.
                if (payload.action === 'create') {
                    return precState.getpRec(_makepRecAddress(`${payload.desc.ns}${payload.desc.uid}`))
                        .then((pRec) => {
                            if (pRec !== undefined) {
                                // test if pRec method, or meta scores have changes and increment a record for them in the p0000000 name space
                                // or add to verifications
                            } else {
                                let Allowed = isAllowed(payload.desc)

                                function isAllowed(str) {
                                    return /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\,\.\-_\^\@\$\%\*\(\)\=\+\/]/.test(str);
                                }
                                let createdpRec = {
                                    addr: _makepRecAddress(`${payload.desc.ns}${payload.desc.uid}`),
                                    uid: payload.desc.uid,
                                    name_space: payload.desc.ns,
                                    meta_score: 0,
                                    price: 0,
                                    method: payload.desc.me, //more validation
                                    meta_scores: payload.desc.ms, //ensure these values exist
                                    verifications: [],
                                    by
                                }
                                if (createdpRec.method)
                                    if (!Allowed) {
                                        throw new InvalidTransaction('Invalid Description: Only "Aa-Zz-_,.^@$%+/=" allowed in description.')
                                    }


                                return precState.setpRec(payload.name, createdpRec)
                            }
                        })
                } else if (payload.action === 'settle') {
                    return precState.getpRec(_makepRecAddress(`${payload.desc.ns}${payload.desc.uid}`))
                        .then((pRec) => {

                        })
                } else if (payload.action === 'defer') {
                    return precState.getpRec(_makepRecAddress(`${payload.desc.ns}${payload.desc.uid}`)) 
                    //return precState.setpRec(payload.name, createdpRec)
                        .then((pRec) => {

                        })
                } else {
                    throw new InvalidTransaction(
                        `Action must be create not ${payload.action}`
                    )
                }
            })
    }
}

module.exports = PRECHandler
