export function remove<T>(arrayOfT: T[], item:T){
    const ndx = arrayOfT.indexOf(item)
    if (ndx >= 0){
        arrayOfT.splice(ndx, 1)
    }
}
export function removeWhere<T>(arrayOfT: Array<T>, predicate: (item: T, index?: number) => boolean){
    let ndx = arrayOfT.findIndex(predicate)
    while(ndx >= 0){
        arrayOfT.splice(ndx, 1)
        ndx = arrayOfT.findIndex(predicate)
    }
}