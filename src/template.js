const toFormat = (amount) => {
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&.").replace('.00', '');
}

const toCapitalize = (value) => {
    return value.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

function getTemplateModalCart() {
    const list = getCart();
    var templates = list.map((product) => (
    `<div class="row">
        <div class="col-lg-6 col-md-6 col-xs-12">
           <span class="text-primary">${product.name}</span>
        </div>
        <div class="col-lg-1 col-md-1 col-xs-12">
            ${product.amount}
        </div>
        <div class="col-lg-2 col-md-2 col-xs-12">
            $ ${toFormat(product.price)}
        </div>
        <div class="col-lg-2 col-md-2 col-xs-12">
            <span class="text-secondary">$ ${toFormat(parseInt(product.price)*parseInt(product.amount))}</span>
        </div>
    </div> `));
    templates = templates.join(' ');
    const total = list.reduce((accumulator, current)=>{
        return accumulator + (parseInt(current.price)*parseInt(current.amount));
    }, 0)
    templates = templates +  `<div class="row">
            <div class="offset-lg-9 offset-md-9 col-lg-2 col-md-2 col-xs-4">
            <span class="text-primary">$ ${toFormat(total)}</span>
        </div>
    </div>`
    return templates;
}

function getTemplateItemCart() {
    const count = getProductCountFromCart();
    if (count === 0) {
        return '<span class="badge bg-secondary">0</span>';
    } else {
        return `<span class="position-absolute start-2 translate-middle badge rounded-pill bg-danger">
                    ${count}
                    <span class="visually-hidden">productos</span>
                </span>`;
    }
}

function getTemplateGlobalAlert(id, title, message, type = 'success') {
    return `
        <div class="alert-global--${id} alert alert-${type} alert-dismissible fade show" role="alert">
            <strong id="title">${title}</strong> <span id="text">${message}</span>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function getTemplateCategory(categories) {
    var message = '<li category-id="0"><a class="dropdown-item">Todas</a></li>';
    categories.forEach(category=>{
        message = message + `<li category-id="${category.id}"><a class="dropdown-item">${toCapitalize(category.name)}</a></li>`
    });
    return message;
}

function getTemplateProduct(products) {
    var message = '';
    products.forEach(product => {
        const quantity = getQuantity(product);
        message = message + `
        <div class="col-md-6 col-lg-4 col-xs-12 mb-5">
            <div class="w-100 position-relative d-flex justify-content-center">
                <div class="card p-1 product" style="width: 18rem">`;
        if (product.discount && product.discount > 0) {
            message = message + `<div class="discount position-absolute d-flex justify-content-center align-items-center"><span>${product.discount}%</span></div>`;
        }
        message = message + `<img src="${product.urlImage ? product.urlImage : '/assets/img/default-product.png'}" class="card-img-top d-flex align-self-center" alt="${toCapitalize(product.name)}">
                    <div class="card-body">
                        <small class="text-muted fw-lighter">${toCapitalize(product.category.name)}</small>
                        <h5 class="card-title"><span class="text-primary fs-5 fw-light">${product.name}</span></h5>
                        <p class="card-text">
                            <span class="text-danger fs-6 fw-bold">$ ${toFormat(product.price)}</span>
                            <span></span>
                        </p>
                        <div class="row">
                            <div ${quantity === 0 ? "style='display:none'" : ""} class="col-lg-6 col-md-6 col-xs-12">
                                <div class="in-cart">
                                    <div><i product-id="${product.id}" class="bi bi-caret-down-square-fill me-2 pointer"></i></div>
                                    <div>${quantity}</div>
                                    <div><i product-id="${product.id}" class="bi bi-caret-up-square-fill ms-2 pointer"></i></div>
                                </div>
                            </div>
                            <div class="col-lg-${quantity === 0 ? 12 : 6} col-md-${quantity === 0 ? 12 : 6} col-xs-12">
                                <button product-id="${product.id}" quantity="${quantity}" class="btn btn-orange w-100">
                                    <i class="bi ${quantity === 0 ? 'bi-cart-plus-fill' : 'bi-cart-x-fill'}"></i>
                                    ${quantity === 0 ? 'Agregar' : 'Quitar'}
                                </button>
                            </div>
                        </div>
                            
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    return message;
}