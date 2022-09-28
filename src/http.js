async function getProducts(name, category=0, order=0) {
    const result = await $.ajax({
        url: `${API_URL}/product/?name=${name || ''}&category=${category}&order=${order}`,
        type: 'GET'
    });
    return result;
}

async function getCategories() {
    const result = await $.ajax({
        url: `${API_URL}/category/`,
        type: 'GET'
    });
    return result;
}