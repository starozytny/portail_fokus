const Sanitaze = require('@commonFunctions/sanitaze')

function search(type, dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    search = Sanitaze.removeAccents(search);
    newData = dataImmuable.filter(function(v) {
        return switchFunction(type, search, v);
    })

    return newData;
}

function searchStartWith (value, search){
    let val = value.toLowerCase();
    val = Sanitaze.removeAccents(val);
    return val.startsWith(search)
}

function searchContainsWith (value, search){
    let val = value.toLowerCase();
    val = Sanitaze.removeAccents(val);
    return val.search(search) !== -1
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(searchContainsWith(v.username, search)
                || searchStartWith(v.email, search)
                || searchContainsWith(v.firstname, search)
                || searchContainsWith(v.lastname, search)
            ){
                return v;
            }
            break;
        case "fokus_user":
            if(searchContainsWith(v.username, search)
                || searchStartWith(v.email, search)
                || searchContainsWith(v.firstName, search)
                || searchContainsWith(v.lastName, search)
                || searchContainsWith(v.societyName, search)
                || searchStartWith(v.societyCode, search)
            ){
                return v;
            }
            break;
        case "fokus_inventory":
            if((v.property && v.property.addr1 && searchContainsWith(v.property.addr1, search))
                || (v.uid && searchStartWith(v.uid + "", search))
                || (v.property && v.property.addr2 && searchContainsWith(v.property.addr2, search))
                || (v.property && v.property.addr3 && searchContainsWith(v.property.addr3, search))
                || (v.property && v.property.zipcode && searchContainsWith(v.property.zipcode, search))
                || (v.property && v.property.city && searchContainsWith(v.property.city, search))
                || (v.property && v.property.reference && searchStartWith(v.property.reference + "", search))
                || (v.tenants && searchStartWith(v.tenants, search))
                || (v.property && v.property.owner && searchContainsWith(v.property.owner, search))
            ){
                return v;
            }

            let findT = false;
            if(v.tenantsData){
                v.tenantsData.forEach(t => {
                    if(t.lastName && searchStartWith(t.lastName, search)
                        || t.firstName && searchStartWith(t.firstName, search)
                    ){
                        findT = true;
                    }
                })
            }

            if(findT){
                return v;
            }

            break;
        case "fokus_property":
            if((v.addr1 &&searchContainsWith(v.addr1, search))
                || (v.uid &&searchStartWith(v.uid + "", search))
                || (v.lastInventoryUid &&searchStartWith(v.lastInventoryUid + "", search))
                || (v.addr2 &&searchContainsWith(v.addr2, search))
                || (v.addr3 &&searchContainsWith(v.addr3, search))
                || (v.zipcode &&searchContainsWith(v.zipcode, search))
                || (v.city &&searchContainsWith(v.city, search))
                || (v.reference &&searchStartWith(v.reference + "", search))
                || (v.currentTenant &&searchContainsWith(v.currentTenant, search))
                || (v.owner &&searchContainsWith(v.owner, search))
            ){
                return v;
            }
            break;
        case "fokus_tenant":
            if((v.addr1 && searchContainsWith(v.addr1, search))
                || (v.addr2 && searchContainsWith(v.addr2, search))
                || (v.addr3 && searchContainsWith(v.addr3, search))
                || (v.zipcode && searchContainsWith(v.zipcode, search))
                || (v.city && searchContainsWith(v.city, search))
                || (v.reference && searchContainsWith(v.reference + "", search))
                || (v.lastName && searchContainsWith(v.lastName, search))
                || (v.firstName && searchContainsWith(v.firstName, search))
                || (v.phone && searchContainsWith(v.phone, search))
                || (v.email && searchContainsWith(v.email, search))
            ){
                return v;
            }
            break;
        case "administration_clients":
            if(searchContainsWith(v.name, search)
                || searchStartWith(v.numSociety, search)
            ){
                return v;
            }
            break;
        case "society":
            if(searchContainsWith(v.name, search)
                || searchContainsWith(v.code, search)
            ){
                return v;
            }
            break;
        case "name":
        case "contact":
        case "changelog":
            if(searchContainsWith(v.name, search)){
                return v;
            }
            break;
        default:
            break;
    }
}

function selectSearch (value, itemValue) {
    let search = value !== "" ? value.toLowerCase() : "";
    search = Sanitaze.removeAccents(search);

    let label = itemValue.toLowerCase();
    label = Sanitaze.removeAccents(label);

    return label.includes(search) ? 1 : 2;
}

module.exports = {
    search,
    selectSearch,
}
