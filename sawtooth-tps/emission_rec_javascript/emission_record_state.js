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
//const stringify = require('json-stable-stringify')
const crypto = require('crypto')

class EmReState {
    constructor(context) {
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getdRec(name) {
        console.log('get', { name })
        return this._loaddRecs(name).then((dRecs) => dRecs.get(name))
    }

    setdRec(name, dRec) {
        console.log('set', { name, dRec })
        let address = _makeEmReAddress(name)

        return this._loaddRecs(name).then((dRecs) => {
            dRecs.set(name, dRec)
            return dRecs
        }).then((dRecs) => {
            let data = _serialize(dRecs)

            this.addressCache.set(address, data)
            let entries = {
                [address]: data
            }
            return this.context.setState(entries, this.timeout)
        })
    }

    deletedRec(name) {
        console.log('del', { name })
        let address = _makeEmReAddress(name)
        return this._loaddRecs(name).then((dRecs) => {
            dRecs.delete(name)

            if (dRecs.size === 0) {
                this.addressCache.set(address, null)
                return this.context.deleteState([address], this.timeout)
            } else {
                let data = _serialize(dRecs)
                this.addressCache.set(address, data)
                let entries = {
                    [address]: data
                }
                return this.context.setState(entries, this.timeout)
            }
        })
    }

    _loaddRecs(name) {
        console.log('load', { name })
        let address = _makeEmReAddress(name)
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
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const EMRE_FAMILY = 'emre'

const EMRE_NAMESPACE = _hash(EMRE_FAMILY).substring(0, 6)

const _makeEmReAddress = (x) => EMRE_NAMESPACE + _hash(x)

module.exports = {
    EMRE_NAMESPACE,
    EMRE_FAMILY,
    EmReState
}

const _deserialize = (data) => {
    let dRecsIterable = data.split('|').map(y => y.split(',').map(x => [x[0], { name: x[0], by: x[1], verified: x[2], data: x[3] }]))
    return new Map(dRecsIterable)
}

const _serialize = (dRecs) => {
    let dRecStrs = []
    for (let namedRec of dRecs) {
        let name = namedRec[0]
        let dRec = namedRec[1]
        dRecStrs.push([name, dRec.by, dRec.verified, dRec.data].join(','))
    }

    return Buffer.from(dRecStrs.join('|'))
}
