const toCode = (str) =>
    str?.toLowerCase().trim().replaceAll(/\s/g, '_').replaceAll('/', '_').replaceAll("'", '').replace(/_+/g, '_');

module.exports = {
    toCode
}