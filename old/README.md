These are individual transaction processors. Transaction processors can be written in any language.

The transaction builders/signers can also be built in any language.

[The SDK instructions are here](https://sawtooth.hyperledger.org/docs/core/releases/1.1/app_developers_guide/using_the_sdks.html)

The Goal here is to build an identity graph around accounts(who controls a certain keypair) as well as a few records they can create.
We'll also use the ISO3166 standard to build national accounts that data should roll up into.
The Climate Ledger should contain the cryptographic signatures to verify where data comes from. To keep the platform open we'll initially be allowing people to submit SCHEMAS, DATA (of SCHEMA type), ALGORITHMS, and DAPPS.
