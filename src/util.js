const toFormat = (amount) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&.").replace('.00', '');
}

const toCapitalize = (value) => {
    return value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

const withoutDiscount = ({price, discount}) => {
    if(discount>0) {
        const priceDiscount = toFixed(((price * discount) / 100), 0);
        return price + priceDiscount;
    }
    return 0;
}

function getCart() {
    const list = JSON.parse(getItem(STORAGE_NAME));
    return list;
}

function getProductCountFromCart() {
    const list = JSON.parse(getItem(STORAGE_NAME));
    
    if (list && list.length>0) { 
        const total = list.reduce((accumulator, current)=>accumulator+parseInt(current.amount), 0);
        return total;
    }
    return 0;
}

function addToCart(product) {
    var amount = 1;
    const list = JSON.parse(getItem(STORAGE_NAME));
    const index = list.findIndex(element => element.id == product.id);
    if (list && list.length > 0 && index > -1) {
        const amount = list[index].amount + 1;
        list[index].amount = amount;
        updateItem(STORAGE_NAME, list)
    } else {
        addToList(STORAGE_NAME, { ...product, amount })
    }
}

function removeProductFromCart(product) {
    const list = JSON.parse(getItem(STORAGE_NAME));
    const index = list.findIndex(element => element.id == product.id);
    if (list && list.length > 0 && index > -1) {
        list[index].amount = 0;
        updateItem(STORAGE_NAME, list)
    }
}

function addOrRemoveProductFromCart(product, operation) {
    const list = JSON.parse(getItem(STORAGE_NAME));
    const index = list.findIndex(element => element.id == product.id);
    if (list && list.length > 0 && index > -1) {
        if (operation === '-') {
            const amount = list[index].amount - 1;
            if (amount <= 0) {
                list[index].amount = 0;
                updateItem(STORAGE_NAME, list)
                return 'MIN_VALUE';
            } else {
                list[index].amount = amount;
                updateItem(STORAGE_NAME, list)
                return;
            }
        } else if (operation === '+') {
            const amount = list[index].amount + 1;
            if (amount > MAX_STOCK) {
                list[index].amount = MAX_STOCK;
                updateItem(STORAGE_NAME, list)
                return 'MAX_VALUE';
            } else {
                list[index].amount = amount;
                updateItem(STORAGE_NAME, list)
                return;
            }
        }
    }
    return;
}

function getQuantity(product) {
    const list = JSON.parse(getItem(STORAGE_NAME));
    const index = list.findIndex(element => element.id == product.id);
    if (list && list.length > 0 && index > -1) {
        return list[index].amount;
    } else {
        return 0;
    }
}