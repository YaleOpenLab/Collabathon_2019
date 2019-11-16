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

const crypto = require('crypto');
const stringify = require('json-stable-stringify');

class AccountState {
    constructor(context) {
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getprofile(name) {
        return this._loadprofiles(name).then((profiles) => profiles.get(name)) //get?
    }

    setprofile(name, profile) {
        let address = _makeAccountAddress(name)

        return this._loadprofiless(name).then((profiles) => {
            profiles.set(name, profile)
            return profiles
        }).then((profiles) => {
            let data = _serialize(profiles)

            this.addressCache.set(address, data)
            let entries = {
                [address]: data
            }
            return this.context.setState(entries, this.timeout)
        })
    }

    _loadprofiles(name) {
        let address = _makeAccountAddress(name)
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

const ACCOUNT_FAMILY = 'account'

const ACCOUNT_NAMESPACE = _hash(ACCOUNT_FAMILY).substring(0, 6)

const _makeAccountAddress = (x) => ACCOUNT_NAMESPACE + _hash(x)

module.exports = {
        ACCOUNT_NAMESPACE,
        ACCOUNT_FAMILY,
        AccountState
    }
    
const _deserialize = (data) => {
    let profilesIterable = data.split('|').map(x => x.split(/,(?=(?:[^"]"[^"]")[^"]$)/gm))
        .map(x => [x[0], {
            by: x[0],
            label: x[1],
            type: x[2],
            email: x[3],
            location: x[4],
            endorsements_requested: JSON.parse(x[5]),
            endorsements: JSON.parse(x[6])
        }])
    return new Map(profilesIterable)
}

const _serialize = (profiles) => {
    let profileStrs = []
    for (let profileret of profiles) {
        let by = profileret[0]
        let profile = profileret[1]
        profileStrs.push([
            by,
            profile.label,
            profile.type,
            profile.email,
            profile.location,
            stringify(profile.endorsements_requested),
            stringify(profile.endorsements)
        ].join(','))
    }

    return Buffer.from(profileStrs.join('|'))
}
