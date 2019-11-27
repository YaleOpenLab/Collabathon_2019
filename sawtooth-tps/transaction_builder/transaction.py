from flask import Flask, request
import cbor
from sawtooth_signing import create_context
from sawtooth_signing import CryptoFactory
import urllib.request
from urllib.error import HTTPError

app = Flask(__name__)

@app.route('/transaction', methods = ['POST'])
def transaction():
    # Obtains payload 
    payload = request.get_json()
    payload_bytes = cbor.dumps(payload)

    txn_header_bytes = TransactionHeader(
        family_name='emissions',
        family_version='1.0',
        #inputs/outputs = [private_key] works here too to generalise to the individual user
        inputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
        outputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
        signer_public_key=signer.get_public_key().as_hex(),
        batcher_public_key=signer.get_public_key().as_hex(),
        dependencies=[],
        payload_sha512=sha512(payload_bytes).hexdigest()
        ).SerializeToString()

    signature = signer.sign(txn_header_bytes)
    
    txn = Transaction(
    header=txn_header_bytes,
    header_signature=signature,
    payload= payload_bytes
    )

    txn_list_bytes = TransactionList(
    transactions=[txn1, txn2]
    ).SerializeToString()

    txn_bytes = txn.SerializeToString()

    txns = [txn]
    batch_header_bytes = BatchHeader(
    signer_public_key=signer.get_public_key().as_hex(),
    transaction_ids=[txn.header_signature for txn in txns],
    ).SerializeToString()
    
    batch_list_bytes = BatchList(batches=[batch]).SerializeToString()

    try:
        request = urllib.request.Request(
            'http://rest.api.domain/batches',
            batch_list_bytes,
            method='POST',
            headers={'Content-Type': 'application/octet-stream'})
        response = urllib.request.urlopen(request)

    except HTTPError as e:
        response = e.file

    return make_response(201)

if __name__ == '__main__':
    app.run(debug=True)
