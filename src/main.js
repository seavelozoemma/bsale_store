$(() => {
    let products = [];
    let categories = [];
    let categoryId = 0;
    let orderId = 0;
    function onHandleInit() {
        showProductCount();
        addDefaultStorage();
        fetchProducts();
        fetchCategories();
    }

    onHandleInit();

    // agrego evento click a boton de agregar/quitar producto
    $('#content-product').on('click', '.btn-orange', function (e) {
        e.preventDefault();
        const productId = parseInt($(this).attr('product-id'));
        const product = products.find(product => productId === product.id);
        const quantity = parseInt($(this).attr('quantity'));
        if (quantity === 0) {
            addToCart(product);
            showAlertGlobal("¡En hora buena!", `${product.name} agregado a carrito`, 'success');
        } else {
            removeProductFromCart(product);
            showAlertGlobal("¡Información!", `${product.name} ha sido eliminado de carrito`, 'info');
        }
        showProducts();
    });

    // quita producto del carro
    $('#content-product').on('click', '.bi-caret-down-square-fill', function (e) {
        e.preventDefault();
        const productId = parseInt($(this).attr('product-id'));
        const product = products.find(product => productId === product.id);
        const result = addOrRemoveProductFromCart(product, '-');
        if (result === 'MIN_VALUE') {
            showAlertGlobal("¡Información!", `${product.name} ha sido eliminado de carrito`, 'info');
        }
        showProducts();
    });

    // este click se ejecuta al momento de limpiar
    $("#clear").click((e) => {
        e.preventDefault();
        $("#search").val("");
        categoryId = 0;
        orderId = 0;
        $("#order-label").text('Orden');
        $("#category-label").text('Categorias');
        fetchProducts(null, 0, 0);
    });

    /// este click se ejecuta al momento de filtrar
    $("#filter").click((e) => {
        e.preventDefault();
        const search = $("#search").val();
        fetchProducts(search || null, categoryId, orderId);
    });

    $("#cart-button").click((e) => {
        e.preventDefault();
        const template = getTemplateModalCart();
        var myModal = new bootstrap.Modal(document.getElementById('cartModal'))
        myModal.show()
        $("#modal-cart-body").empty().append(template);
    })

    $('#orders').on('click', 'li', function (e) {
        e.preventDefault();
        const id = parseInt($(this).attr('order-id'));
        const text = $(this).children('a')?.text();
        $("#order-label").text(toCapitalize(text));
        orderId = id;
    })

    $('#categories').on('click', 'li', function (e) {
        e.preventDefault();
        const id = parseInt($(this).attr('category-id'));
        if (id === 0) {
            $("#category-label").text("Categorias");
        } else {
            const category = categories.find(category => category.id === id);
            if (category) {
                $("#category-label").text(toCapitalize(category.name));
                categoryId = id;
            }
        }
    })

    // agrega producto del carro
    $('#content-product').on('click', '.bi-caret-up-square-fill', function (e) {
        e.preventDefault();
        const productId = parseInt($(this).attr('product-id'));
        const product = products.find(product => productId === product.id);
        const result = addOrRemoveProductFromCart(product, '+');
        if (result === 'MAX_VALUE') {
            showAlertGlobal("¡Advertencia!", `Solo puedes agregar ${MAX_STOCK} ${product.name}`, 'warning');
        }
        showProducts();
    });

    // agrego un valor por defecto siempre
    function addDefaultStorage() {
        const cart = getItem(STORAGE_NAME);
        if (!(cart && cart.length > 0)) {
            addItem(STORAGE_NAME, JSON.stringify([]));
        }
    }

    // llamado a servicio de productos
    async function fetchProducts(text = null, category = 0, order = 0) {
        $("#content-loader").show();
        try {
            products = await getProducts(text, category, order);
            $("#content-loader").hide();
            if (products) {
                $("#content-product").removeClass('hidden');
                showProducts()
            } else {
                $("#no-content-product").removeClass('hidden');
            }
        } catch {
            $("#content-loader").hide();
            $("#error-content-product").removeClass('hidden');
        }
    }

    // llamado a servicio de categorias
    async function fetchCategories() {
        $("#loader-category").empty().append('<i class="bi bi-gear-fill"></i>');
        try {
            categories = await getCategories();
            $("#loader-category").empty();
            if (categories) {
                showCategories();
            } else {
                $("#error-category").addClass('text-warning').text("No existen categorias")
            }
        } catch {
            $("#loader-category").empty();
            $("#error-category").addClass('text-danger').text("Categorias no cargadas")
        }
    }

    // funcion que muestra alerta
    function showAlertGlobal(title, message, type = 'success') {
        const $alertContent = $("#alert-content");
        const count = $alertContent.children('.alert').length;
        const template = getTemplateGlobalAlert(count, title, message, type);
        $alertContent.append(template);
        setTimeout(() => {
            $alertContent.children(`.alert-global--${count}`).children('button').click();
        }, 3000);

    }

    // funcion que actualiza DOM de productos
    function showProducts() {

        const template = getTemplateProduct(products);
        $("#content-product").empty().append(template);
        showProductCount();
    }

    // funcion que actualiza DOM de categorias
    function showCategories() {
        const template = getTemplateCategory(categories);
        $("#categories").empty().append(template);
    }

    // funcion que actualiza DOM de carrito de compra
    function showProductCount() {
        const template = getTemplateItemCart();
        const $productCount = $("#product-count");
        $productCount.empty().append(template);
    }
});