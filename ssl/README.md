The SSL files in this directory ARE FOR LOCAL DEVELOPMENT ONLY!!  DO NOT USE
THESE IN PRODUCTION SYSTEMS!!!

The NodeJS fit-note-frontend service is configured to work over SSL, and also
to require clients to use valid SSL certificates.  The certs in this dir are
used for both the server and client side of the connection, the files involved
are as follows:

 * 192.168.105.5.cert.pem - the server public key (X509)
 * 192.168.105.5.key.pem - the server private key
 * ca-chain.cert.pem - a joined intermedate file of the issuing authority
 * ca-inter.cert.pem - just the issuing authority intermediate
 * ca-root.cert.pem - just the issuing authority root
 * fnfe-client.cert.pem - the client public key (X509)
 * fnfe-client.key.pem - the client private key
 * browser.p12 - the client certificate to install in the browser for local development (password: `fitnote`)

All certs are issued from a private certificate authority, which itself was
generate from these scripts:

 https://gitlab.itsshared.net/SecureComms/devops/tree/master/ca

To connect to the service using curl, you'll need a command like the following
(adjust path related parts of the command accordingly):

 curl -k --cacert ./ca-chain.cert.pem \
    --key ./fnfe-client.key.pem \
    --cert ./fnfe-client.cert.pem \
    https://192.168.105.5:3000/index

