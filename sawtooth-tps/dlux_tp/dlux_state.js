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

const crypto = require('crypto')

class DluxState {
    constructor(context) {
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getdApp(name) {
        return this._loaddApps(name).then((dApps) => dApps.get(name))
    }

    setdApp(name, dApp) {
        let address = _makeDluxAddress(name)

        return this._loaddAppss(name).then((dApps) => {
            dApps.set(name, dApp)
            return dApps
        }).then((dApps) => {
            let data = _serialize(dApps)

            this.addressCache.set(address, data)
            let entries = {
                [address]: data
            }
            return this.context.setState(entries, this.timeout)
        })
    }

    deletedApp(name) {
        let address = _makeDluxAddress(name)
        return this._loaddApps(name).then((dApps) => {
            dApps.delete(name)

            if (dApps.size === 0) {
                this.addressCache.set(address, null)
                return this.context.deleteState([address], this.timeout)
            } else {
                let data = _serialize(dApps)
                this.addressCache.set(address, data)
                let entries = {
                    [address]: data
                }
                return this.context.setState(entries, this.timeout)
            }
        })
    }

    _loaddApps(name) {
        let address = _makeDluxAddress(name)
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

const DLUX_FAMILY = 'dlux'

const DLUX_NAMESPACE = 'dlux'

const _makeDluxAddress = (x) => DLUX_NAMESPACE + '0000' + _hash(x)

module.exports = {
    DLUX_NAMESPACE,
    DLUX_FAMILY,
    DluxState
}

const _deserialize = (data) => {
    let dAppsIterable = data.split('|').map(x => x.split(/,(?=(?:[^"]"[^"]")[^"]$)/gm))
        .map(x => [x[0], {
            name: x[0],
            by: x[1],
            desc: x[2],
            veri: JSON.parse(x[3]),
            chal: JSON.parse(x[4])
        }]) //because these intend to be executables
    return new Map(dAppsIterable)
}

// what does this do,   DB > DLT  , from SAWTOOTH (OPEN CLIMATE LEDGER) to Postrgre SQL (CLIMATE DB)
const _serialize = (dApps) => {
    let dAppStrs = []
    for (let namedApp of dApps) {
        let name = namedApp[0]
        let dApp = namedApp[1]
        dAppStrs.push([name, dApp.by, dApp.desc, stringify(dApp.veri), stringify(dApp.chal)].join(','))
    }


    return Buffer.from(dAppStrs.join('|'))
}