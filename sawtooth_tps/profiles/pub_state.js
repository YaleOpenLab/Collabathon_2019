'use strict'

const crypto = require('crypto')

class PubState {
    constructor(context) {
        this.context = context
        this.addressCache = new Map([])
        this.timeout = 500 // Timeout in milliseconds
    }

    getprofile(name) {
        return this._loadprofiles(name).then((profiles) => profiles.get(name)) //get?
    }

    setprofile(name, profile) {
        let address = _makePubAddress(name)

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
        let address = _makePubAddress(name)
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

const PUB_FAMILY = 'pub'

const PUB_NAMESPACE = _hash(PUB_FAMILY).substring(0, 6)

const _makePubAddress = (x) => PUB_NAMESPACE + _hash(x)

module.exports = {
    PUB_NAMESPACE,
    PUB_FAMILY,
    PubState
}

const _deserialize = (data) => {
    let profilesIterable = data.split('|').map(x => x.split(/,(?=(?:[^"]"[^"]")[^"]$)/gm))
        .map(x => [x[0], { n: x[0], l: x[1], t: x[2], c: x[3], d: JSON.parse(x[4]), e: x[5], p: x[6], w: x[7], q: JSON.parse(x[8]), r: JSON.parse(x[9]), b: x[10] }])
    return new Map(profilesIterable)
}

const _serialize = (profiles) => {
    let profileStrs = []
    for (let profileret of profiles) {
        let name = profileret[0]
        let profile = profileret[1]
        profileStrs.push([name, profile.l, profile.t, profile.c, JSON.stringify(profile.d), profile.e, profile.p, profile.w, JSON.stringify(profile.q), JSON.stringify(profile.r), parseInt(profile.b)].join(','))
    }

    profileStrs.sort()

    return Buffer.from(profileStrs.join('|'))
}
