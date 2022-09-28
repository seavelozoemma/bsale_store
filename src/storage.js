const addItem = (key, value) => {
    localStorage.setItem(key, value);
}

const removeItem = (key) => {
    localStorage.removeItem(key);
}

const addToList = (key, value) => {
    const item = JSON.parse(localStorage.getItem(key));
    if(item) {
        item.push(value);
        localStorage.setItem(key, JSON.stringify(item));
    }
}

const updateItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
} 

const getItem = (key) => {
    return localStorage.getItem(key) || null;
}