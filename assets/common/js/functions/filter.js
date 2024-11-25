function process(dataImmuable, filters, property) {
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                let push = false;
                switch (property){
                    case "bibli":
                        if(filter === 0){
                            if(el.isNative) push = true;
                        } else if(filter === 1){
                            if(el.isUsed) push = true;
                        } else {
                            if(!el.isNative && !el.isUsed) push = true;
                        }
                        break;
                    default:
                        if(filter === el[property]){
                            push = true;
                        }
                        break;
                }

                if(push){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }

            })
        })
    }

    return newData;
}

function filter (dataImmuable, filters, property) {
    return process(dataImmuable, filters, property);
}


module.exports = {
    filter
}
