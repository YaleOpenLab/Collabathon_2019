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

const AccountPayload = require('./account_payload')

const { ACCOUNT_NAMESPACE, ACCOUNT_FAMILY, AccountState } = require('./account_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _appToStr = (name, account, by) => {
    let out = ''
    out += `Name: ${name}\n`
    out += `accountKey: ${account}\n`
    out += `Endorsement: ${by}\n`
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


class ACCOUNTHandler extends TransactionHandler {
    constructor() {
        super(ACCOUNT_FAMILY, ['1.0'], [ACCOUNT_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = AccountPayload.fromBytes(transactionProcessRequest.payload)
        let accountState = new AccountState(context)
        let header = transactionProcessRequest.header
        let by = header.signerPublicKey

        if (payload.action === 'create') { //create your profile... there is no delete
            return accountState.getprofile(by)
                .then((profile) => {
                    if (profile !== undefined) {
                        throw new InvalidTransaction('Invalid Action: profile already exists.')
                    }
                    let type = JSON.parse(payload.f1).type //include asset types?
                    if (type === 'g') {
                        // actor with a country code / gov
                    } else if (type === 'c') {
                        // corporation or edu
                    } else if (type === 'a') {
                        //autonomus process such as IoT or Servers
                    } else {
                        type = 'i' //individual
                    }
                    let email = JSON.parse(payload.f1).email,
                        label = JSON.parse(payload.f1).name,
                        location = JSON.parse(payload.f1).location
                    if (typeof label != 'string' || !isAllowed(label) || label.length > 64) {
                        throw new InvalidTransaction('Invalid Name: Must be a string, no quotes or apostrophies')
                    }
                    if (typeof email != 'string' || !isAllowed(email) || email.length > 64) {
                        email = ''
                    }
                    //some rejecting validation?

                    let createdprofile = {
                        by: by, //name / address
                        label: label, //name
                        type: type, //g: gov, c: corporation, a: automaton/IoT, i: individual/other
                        email: email,
                        location: location,
                        endorsements_requested: [], //requested endorsements
                        endorsements: [], //recieved endorsements

                        //bal: 0 //balance ... need to do dual requests to complete integrationSW
                    }

                    _display(`Stakeholder ${by.toString().substring(0, 6)} created profile ${by}`)

                    return accountState.setprofile(by, createdprofile)
                })
        } else if (payload.action === 'req') { //request a accountkey endorsement
            return accountState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    if (profile.by === by && profile.endorsements_requested.length < 3) {
                        return accountState.getprofile(payload.f1)
                            .then((other) => {
                                if (other === undefined) {
                                    throw new InvalidTransaction(
                                        'Invalid Action: Requires an existing accountKey.'
                                    )
                                }
                                profile.endorsements_requested.push(payload.f1) //check if key is a valid profile?
                                return accountState.setprofile(by, profile)
                            })
                    }
                    return accountState.setprofile(by, profile)
                })
        } else if (payload.action === 'del_req') { //remove a accountlic key endorsement request
            return accountState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    for (i = 0; i < profile.endorsements_requested.length; i++) {
                        if (payload.f1 === profile.endorsements_requested[i]) {
                            profile.endorsements_requested.splice(i, 1)
                        }
                    }
                    return accountState.setprofile(by, profile)
                })
        } else if (payload.action === 'update') { //update contact strings
            return accountState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    switch (payload.f1) {
                        case 'email':
                            if (typeof payload.f2 === 'string' || isAllowed(payload.f2) || payload.f2.length <= 64) {
                                profile.email = payload.f2
                            }
                            break;
                        case 'location':
                            if (typeof payload.f2 === 'string' || isAllowed(payload.f2) || payload.f2.length <= 64) {
                                profile.location = payload.f2
                            }
                            break;
                        default:
                            throw new InvalidTransaction(
                                'Invalid Action: Invalid item to update.'
                            )

                    }
                    return accountState.setprofile(by, profile)
                })
        } else if (payload.action === 'veri') { //add your accountkey to a requested endorsement
            return accountState.getprofile(payload.f1)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Verify requires an existing profile.'
                        )
                    }
                    let req = false,
                        veri = false,
                        ind = 0
                    for (i = 0; i < profile.endorsements_requested.length; i++) {
                        if (by === profile.endorsements_requested[i]) {
                            ind = i
                            req = true
                        }
                    }
                    if (req) {
                        for (i = 0; i < profile.endorsements.length; i++) {
                            if (by === profile.endorsements[i]) {
                                veri = true
                            }
                        }
                    }
                    if (req && !veri) {
                        profile.endorsements.push(by)
                        profile.endorsements_requested.splice(ind, 1)
                    }

                    return accountState.setprofile(payload.f1, profile)
                })
        } else {
            throw new InvalidTransaction(
                `Action: ${payload.action} is not supported`
            )
        }
    }
}

module.exports = ACCOUNTHandler

function isAllowed(str) {
    return /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\:\,\.\-_\@\$\%\*\(\)\=\+\/]/.test(str);
}