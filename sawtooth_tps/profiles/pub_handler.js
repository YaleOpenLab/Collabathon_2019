'use strict'

const PubPayload = require('./pub_payload')

const { PUB_NAMESPACE, PUB_FAMILY, PubState } = require('./pub_state')

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const _appToStr = (name, pub, by) => {
    let out = ''
    out += `Name: ${name}\n`
    out += `pubKey: ${pub}\n`
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


class PUBHandler extends TransactionHandler {
    constructor() {
        super(PUB_FAMILY, ['1.0'], [PUB_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = PubPayload.fromBytes(transactionProcessRequest.payload)
        let pubState = new PubState(context)
        let header = transactionProcessRequest.header
        let by = header.signerPublicKey

        if (payload.action === 'create') { //create your profile... there is no delete
            return pubState.getprofile(by)
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
                    let cc = parseInt(JSON.parse(payload.f1).cc) || 0,
                        cca = []
                    if (JSON.parse(payload.f1).cca.length > 0) {
                        cca = JSON.parse(payload.f1).cca //no validation here yet
                    }
                    if (type === 'g' && parseInt(JSON.parse(payload.f1).cc) > 0) {
                        cca = []
                    }
                    let email = JSON.parse(payload.f1).email,
                        phone = JSON.parse(payload.f1).phone,
                        website = JSON.parse(payload.f1).website,
                        label = JSON.parse(payload.f1).name
                    if (typeof label != 'string' || !isAllowed(label) || label.length > 64) {
                        throw new InvalidTransaction('Invalid Name: Must be a string, no quotes or apostrophies')
                    }
                    if (typeof phone != 'string' || !isAllowed(phone) || phone.length > 20) {
                        phone = ''
                    }
                    if (typeof email != 'string' || !isAllowed(email) || email.length > 64) {
                        email = ''
                    }
                    if (typeof website != 'string' || !isAllowed(website) || website.length > 64) {
                        website = ''
                    }
                    //some rejecting validation?

                    let createdprofile = {
                        n: by, //name / address
                        l: label, //name
                        t: type, //g: gov, c: corporation, a: automaton/IoT, i: individual/other
                        e: email,
                        q: JSON.stringify([]), //requested endorsements
                        r: JSON.stringify([]), //recieved endorsements
                        
                        b: 0 //balance ... need to do dual requests to complete integrationSW
                    }

                    _display(`Stakeholder ${by.toString().substring(0, 6)} created profile ${by}`)

                    return pubState.setprofile(payload.by, createdprofile)
                })
        } else if (payload.action === 'req') { //request a pubkey endorsement
            return pubState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    if (profile.by === by && profile.endreq.length < 3) {
                        return pubState.getprofile(payload.f1)
                            .then((other) => {
                                if (other === undefined) {
                                    throw new InvalidTransaction(
                                        'Invalid Action: Requires an existing pubKey.'
                                    )
                                }
                                profile.endreq.push(payload.f1)
                                return pubState.setprofile(payload.name, profile)
                            })

                        profile.endreq.push(payload.f1)
                    }
                    return pubState.setprofile(payload.name, profile)
                })
        } else if (payload.action === 'del_req') { //remove a public key endorsement request
            return pubState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    for (i = 0; i < profile.q.length; i++) {
                        if (payload.f1 === profile.q[i]) {
                            profile.q.splice(i, 1)
                        }
                    }
                    return pubState.setprofile(payload.name, profile)
                })
        } else if (payload.action === 'update') { //update contact strings
            return pubState.getprofile(by)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Requires an existing profile.'
                        )
                    }
                    switch (payload.f1) {
                        case 'email':
                            if (typeof payload.f2 === 'string' || isAllowed(payload.f2) || payload.f2.length <= 64) {
                                profile.e = payload.f2
                            }
                            break;
                        case 'phone':
                            if (typeof payload.f2 === 'string' || isAllowed(payload.f2) || payload.f2.length <= 20) {
                                profile.p = payload.f2
                            }
                            break;
                        case 'website':
                            if (typeof payload.f2 === 'string' || isAllowed(payload.f2) || payload.f2.length <= 64) {
                                profile.w = payload.f2
                            }
                            break;
                        default:
                            throw new InvalidTransaction(
                                'Invalid Action: Invalid item to update.'
                            )

                    }
                    return pubState.setprofile(payload.name, profile)
                })
        } else if (payload.action === 'veri') { //add your pubkey to a requested endorsement
            return pubState.getprofile(payload.f1)
                .then((profile) => {
                    if (profile === undefined) {
                        throw new InvalidTransaction(
                            'Invalid Action: Verify requires an existing profile.'
                        )
                    }
                    let req = false,
                        veri = false,
                        ind = 0
                    for (i = 0; i < profile.q.length; i++) {
                        if (by === profile.q[i]) {
                            ind = i
                            req = true
                        }
                    }
                    if (req) {
                        for (i = 0; i < profile.r.length; i++) {
                            if (by === profile.r[i]) {
                                veri = true
                            }
                        }
                    }
                    if (req && !veri) {
                        profile.r.push(by)
                        profile.q.splice(ind, 1)
                    }

                    let byString = by.toString().substring(0, 6)

                    _display(
                        `Stakeholder ${byString} has verified: ${profile.lab}\n\n` +
                        _appToStr(
                            profile.l,
                            profile.n,
                            byString
                        )
                    )

                    return pubState.setprofile(payload.name, profile)
                })
        } else {
            throw new InvalidTransaction(
                `Action: ${payload.action} is not supported`
            )
        }
    }
}

module.exports = PUBHandler

function isAllowed(str) {
    return /[ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\:\,\.\-_\@\$\%\*\(\)\=\+\/]/.test(str);
}
