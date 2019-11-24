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
const stringify = require('json-stable-stringify')
const crypto = require('crypto')

class pRecState {
    constructor(context) {
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getpRec(name) {
        return this._loadpRecs(name).then((pRecs) => pRecs.get(name))
    }

    setpRec(name, pRec) {
        let address = _makepRecAddress(name)

        return this._loadpRecss(name).then((pRecs) => {
            pRecs.set(name, pRec)
            return pRecs
        }).then((pRecs) => {
            let data = _serialize(pRecs)

            this.addressCache.set(address, data)
            let entries = {
                [address]: data
            }
            return this.context.setState(entries, this.timeout)
        })
    }

    deletepRec(name) {
        let address = _makepRecAddress(name)
        return this._loadpRecs(name).then((pRecs) => {
            pRecs.delete(name)

            if (pRecs.size === 0) {
                this.addressCache.set(address, null)
                return this.context.deleteState([address], this.timeout)
            } else {
                let data = _serialize(pRecs)
                this.addressCache.set(address, data)
                let entries = {
                    [address]: data
                }
                return this.context.setState(entries, this.timeout)
            }
        })
    }

    _loadpRecs(name) {
        let address = _makepRecAddress(name)
        if (this.addressCache.has(address)) {
            if (this.addressCache.get(address) === null) {
                return Promise.resolve(new Map([]))
            } else {
                return Promise.resolve(_deserialize(this.addressCache.get(address)))
            }
        } else {
            return this.context.getState([address], this.timeout)
                .then((addressValues) => {
                    if (!addressValues[address].toString()) {
                        this.addressCache.set(address, null)
                        return new Map([])
                    } else {
                        let data = addressValues[address].toString()
                        this.addressCache.set(address, data)
                        return _deserialize(data)
                    }
                })
        }
    }
}

const _hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 62)

const PREC_FAMILY = 'p'

const PREC_NAMESPACE = 'p000000'

const _makepRecAddress = (x) => PREC_NAMESPACE + _hash(x)

module.exports = {
    PREC_NAMESPACE,
    PREC_FAMILY,
    pRecState,
    _makepRecAddress
}

const _deserialize = (data) => {
    let pRecsIterable = data.split('|').map(x => x.split(/,(?=(?:[^"]"[^"]")[^"]$)/gm))
        .map(x => [
            _hash(x[1] + x[2]),
            {
                addr: x[0],
                uid: x[1],
                name_space: x[2],
                meta_score: x[3],
                price: x[4],
                method: x[5],
                meta_scores: JSON.parse(x[6]),
                verifications: JSON.parse(x[7]),
                by
            }
        ])
    return new Map(pRecsIterable)
}

const _serialize = (precs) => {
    let precStrs = []
    for (let precret of precs) {
        let addr = precret[0]
        let prec = precret[1]
        precStrs.push([
            addr,
            prec.uid,
            prec.name_space,
            prec.meta_score,
            prec.price,
            prec.method,
            stringify(prec.meta_scores),
            stringify(prec.verifications),
            prec.by
        ].join(','))
    }

    return Buffer.from(precStrs.join('|'))
}