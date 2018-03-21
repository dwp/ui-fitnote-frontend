// Sanitise the NINO by first passing through this function, which will strip out space and dashes, then convert to uppercase.
exports.sanitiseNino = function sanitiseNino(nino) {
    return nino.toUpperCase().replace(/[\s|\-]/g, '');
};
