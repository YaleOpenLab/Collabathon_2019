############################################################################################################################################################################################################################################################################################################################################################

from sawtooth_signing import create_context
from sawtooth_signing import CryptoFactory
import urllib.request
from urllib.error import HTTPError
import cbor
from hashlib import sha512
from sawtooth_sdk.protobuf.transaction_pb2 import TransactionHeader
from sawtooth_sdk.protobuf.transaction_pb2 import Transaction
from sawtooth_sdk.protobuf.transaction_pb2  import TransactionList
from sawtooth_sdk.protobuf.batch_pb2 import BatchHeader
from sawtooth_sdk.protobuf.batch_pb2 import BatchList
############################################################################################################################################################################################################################################################################################################################################################

#create a new signer and private key
context = create_context('secp256k1') #standard chosen for signing
private_key = context.new_random_private_key() #must be kept secret and secure! No way to recover if lost and anyone with this can sign transactions as the original issuant. 
signer = CryptoFactory(context).new_signer(private_key)

############################################################################################################################################################################################################################################################################################################################################################

#Encoding Payload

#obtain payload from postgres - replace example contents with contents from DB
# POSTGRES QUERY CODE HERE
#
#
#
#

payload = {
    "emissionid": 1279,
	"mmtco2e": 533.2827127000,
    "gas": "Aggregate GHGs",
    "sector": "Total GHG emissions without LULUCF",
    "last_reported_year": 2015,
    "last_reported_mmtco2e": 533.2827127000,
    "country": "AUS",
    "datasource": "UNFCCC"
}

payload_bytes = cbor.dumps(payload)
print("Encoded Payload Successfully")

############################################################################################################################################################################################################################################################################################################################################################

#Building transactions
txn_header_bytes = TransactionHeader(
    family_name='emissions',
    family_version='1.0',
    #inputs/outputs = [private_key] works here too to generalise to the individual user
    inputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    outputs=['1cf1266e282c41be5e4254d8820772c5518a2c5a8c0c7f7eda19594a7eb539453e1ed7'],
    signer_public_key=signer.get_public_key().as_hex(),
    # In this example, we're signing the batch with the same private key,
    # but the batch can be signed by another party, in which case, the
    # public key will need to be associated with that key.
    batcher_public_key=signer.get_public_key().as_hex(),
    # In this example, there are no dependencies.  This list should include
    # a previous transaction header signatures that must be applied for
    # this transaction to successfully commit.
    # For example,
    # dependencies=['540a6803971d1880ec73a96cb97815a95d374cbad5d865925e5aa0432fcf1931539afe10310c122c5eaae15df61236079abbf4f258889359c4d175516934484a'],
    dependencies=[],
    payload_sha512=sha512(payload_bytes).hexdigest()
).SerializeToString()

#Remember that a batcher public_key is the hex public key matching the private key that will later be used to sign a Transaction’s Batch, and dependencies are the header signatures of Transactions that must be committed before this one (see TransactionHeaders in Transactions and Batches).
#The inputs and outputs are the state addresses a Transaction is allowed to read from or write to. With the Transaction above, we referenced the specific address where the value of 'foo' is stored. Whenever possible, specific addresses should be used, as this will allow the validator to schedule transaction processing more efficiently.
#Note that the methods for assigning and validating addresses are entirely up to the Transaction Processor. In the case of IntegerKey, there are specific rules to generate valid addresses, which must be followed or Transactions will be rejected. You will need to follow the addressing rules for whichever Transaction Family you are working with.

############################################################################################################################################################################################################################################################################################################################################################
#Create Transactions
signature = signer.sign(txn_header_bytes)

txn = Transaction(
    header=txn_header_bytes,
    header_signature=signature,
    payload= payload_bytes
)

############################################################################################################################################################################################################################################################################################################################################################
# if multiple Transactions

# txn_list_bytes = TransactionList(
#     transactions=[txn1, txn2]
# ).SerializeToString()

# txn_bytes = txn.SerializeToString()

###########################################################################################################################################################################################################################################################################################################################################################
# Create Batch header
# Once one or more transactions ready they must be wrapped in a batch
# BatchHeader needs only the public key of the signer and the list of Transaction IDs, in the same order they are listed in the Batch.


txns = [txn]

batch_header_bytes = BatchHeader(
    signer_public_key=signer.get_public_key().as_hex(),
    transaction_ids=[txn.header_signature for txn in txns],
).SerializeToString()
###########################################################################################################################################################################################################################################################################################################################################################
#Encode batche(es) in a BatchList
#In order to submit Batches to the validator, they must be collected into a BatchList. Multiple batches can be submitted in one BatchList, though the Batches themselves don’t necessarily need to depend on each other. Unlike Batches, a BatchList is not atomic. Batches from other clients may be interleaved with yours.

batch_list_bytes = BatchList(batches=[batch]).SerializeToString()

###########################################################################################################################################################################################################################################################################################################################################################
#Submit batch to validator via REST API

try:
    request = urllib.request.Request(
        'http://rest.api.domain/batches',
        batch_list_bytes,
        method='POST',
        headers={'Content-Type': 'application/octet-stream'})
    response = urllib.request.urlopen(request)

except HTTPError as e:
    response = e.file


    
