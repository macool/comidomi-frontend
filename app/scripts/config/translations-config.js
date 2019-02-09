(function () {
'use strict';

  angular
    .module('porttare.translations', ['pascalprecht.translate'])
    .config(translationConfig);

  function translationConfig($translateProvider) {
    $translateProvider.useSanitizeValueStrategy('escapeParameters');

    $translateProvider.translations('es', {
      login: {
        email: 'Correo electrónico',
        password: 'Contraseña',
        login: 'Iniciar Sesión',
        forgotPassword: '¿Olvidaste tu contraseña?',
        continueWithFacebook: 'Continuar con Facebook',
        unauthorized: 'No Autorizado'
      },
      menu: {
        category: 'Categorías',
        location: 'Ubicación',
        logout: 'Cerrar sesión',
        buyer: 'Comprador',
        changeTo: 'Cambiar a',
        product: 'Producto',
        profile: 'Ver Perfil',
        account: 'Cuenta',
        invite: 'Invitar',
        history: 'Historial',
        locations: 'Localidades',
        user:{
          courier: 'Entregar',
          buyer: 'Comprar',
          provider: 'Vender'
        },
        client: {
          category: 'Categorías',
          myOrders: 'Mis Pedidos',
          myLists: 'Mis Listas',
          coupon: 'Cuponera',
          payments: 'Pagos',
          provider: 'Proveedor',
          cart: 'Mi carro',
          billingAddresses: 'Facturación',
          providers: 'Proveedores',
        },
        provider: {
          orders: 'Pedidos',
          products: 'Productos',
          clients: 'Clientes',
          account: 'Cuenta',
          dispatchers: 'Despachadores',
          establishments: 'Establecimientos',
          promotionsAndDiscounts: 'promociones y descuentos',
          moviggoAdvertising: 'publicidad moviggo'
        },
        courier: {
          orders: 'Pedidos',
          account: 'Cuenta',
          payments: 'Pagos',
          history: 'Historial'
        },
        dispatcher: {
          dispatch: 'Despachos'
        }
      },
      provider: {
        profileName: 'Proveedor',
        successUpdateProfileProvider: 'Perfil actualizado éxitosamente',
        itemsProvider: 'Productos de Proveedor',
        formLegendFirst: 'Proveedor nuevo - Paso 1',
        formLegendSecond: 'Proveedor nuevo - Paso 2',
        updateInfoProvider:'Actualizar datos de Proveedor',
        businessName: 'Razón social',
        name: 'Nombre Establecimiento',
        economicActivity: 'Actividad económica',
        LegalRepresentative: 'Representante legal',
        phone: 'Número de teléfono',
        email: 'Correo electrónico',
        webSite: 'Sitio web',
        youtube:'Youtube',
        facebook:'Facebook',
        twitter:'Twitter',
        instagram:'Instagram',
        methodPayment: 'Forma de pago',
        category: 'Categoría',
        respondToCustomerRequestLegend: 'Responder petición',
        estimatedTimeForPreparation: 'Tiempo de preparación estimado',
        estimatedTimeForPreparationUnit: 'minutos',
        methods: {
          cash: 'Efectivo',
          creditCard: 'Tarjeta de crédito'
        },
        orders: 'pedidos',
        products:  'productos',
        logo: 'Logotipo',
        bank: {
          name: 'Nombre de su banco',
          account: 'Número de cuenta',
          type: 'Tipo de cuenta',
          savings:'Ahorros',
          credit: 'Crédito'
        },
        address: 'Dirección',
        city: 'Ciudad',
        openTime: 'Hora de Apertura',
        closeTime: 'Hora de Cierre',
        initialLaborDay: 'Inicio de Labores',
        finalLaborDay: 'Final de Labores',
        isRequired: 'Este campo es obligatorio',
        nextStep: 'Siguiente Paso',
        createProvider: 'Crear Proveedor',
        noMoreItems: 'No hay más productos que mostrar',
        acceptOrder: 'Aceptar orden',
        rejectOrder: 'Rechazar orden',
        reasonToReject: 'Razón',
        reasonToRejectPlaceholder: 'Especifica una razón',
        ruc: 'RUC',
        schedule: {
          closed: 'Cerrado',
          open: 'Abierto'
        }
      },
      courier: {
        successCourierSave: 'Te hemos registrado!',
        welcomeTitle: 'Conviértete en mensajero',
        welcomeDescription: 'puedes enviar productos y convertirte en mensajero',
        newCourierTitle: 'Nuevo Mensajero',
        firstFormLegend: 'Mensajero nuevo - Paso 1',
        secondFormLegend: 'Mensajero nuevo - Paso 2',
        names: 'Nombres completos',
        ruc: 'Cédula / RUC / Pasaporte',
        phone: 'Número de teléfono',
        email: 'Correo electrónico',
        location: 'Ubicación',
        mobilization: 'Tipo de medio de movilización',
        birthdate: 'Fecha de nacimiento',
        license: 'Licencia de conducir',
        orders: 'Pedidos',
        deliveryAddresses: 'Lugar de entrega',
        ready: 'Listo',
        customerOrderDeliveryUpdate: 'Datos de entrega actualizado éxitosamente',
        order: 'Pedido #',
        ordersNumber: 'Pedido número',
        dateDispatcher: 'Hora del despacho',
        nameDispatcher: 'Nombre despachador',
        nextStep: 'Siguiente paso',
        createCourier: 'Crear mensajero',
        deliveryETA: 'Tiempo estimado para la entrega',
        labels: {
          found: 'Encontramos',
          closeToYou: 'pedidos cerca de ti',
          currentLocation: 'de tu ubicación actual (apróx)',
          dispatchReady: 'despacho listo ',
          timeForDispatchSuffix: ' para el despacho'
        },
        form: {
          error: {
            wrongSubmission: 'No pudimos registrarte, por favor revisa los errores en el formulario'
          }
        }
      },
      globals: {
        new: 'Nuevo',
        list: 'Listar',
        edit: 'Editar',
        delete: 'Eliminar',
        seeMore: 'Ver más',
        see: 'Ver',
        save: 'Guardar',
        success: 'Éxito',
        cancel: 'Cancelar',
        options: 'Opciones',
        saving: 'Guardando',
        updating: 'Actualizando',
        deleting: 'Eliminando',
        pleaseTryAgain: 'Inténtalo nuevamente',
        leftData: 'Faltan datos',
        error: 'Error',
        or: 'o',
        index: 'Inicio',
        loading: 'Cargando',
        sending: 'Enviando',
        start: 'Empezar',
        sendRequest: 'Enviar solicitud',
        isRequired: 'Este campo es obligatorio',
        disabledUser: 'Su cuenta ha sido deshabilitada',
        id: 'Id',
        email: 'Email',
        confirmTitle: '¿Estás seguro?',
        dateDelivery: 'Fecha y hora de entrega',
        dayNames: {
          mon: 'Lunes',
          tue: 'Martes',
          wed: 'Miércoles',
          thu: 'Jueves',
          fri: 'Viernes',
          sat: 'Sábado',
          sun: 'Domingo'
        },
        accept:'Aceptar',
        geolocation: 'Geolocalizando...',
        somethingWentWrong: 'Algo salió mal'
      },
      item: {
        item: 'Producto',
        items: 'Productos',
        formLegend: 'Información del producto',
        publishItem: 'Publicar producto',
        successItemSave: 'Producto publicado éxitosamente',
        successUpdateItem: 'Producto actualizado éxitosamente',
        successDeleteItem: 'Producto eliminado éxitosamente',
        productName: 'Producto',
        quantity: 'Can',
        price: 'Precio',
        itemSearch: 'Buscar producto',
        titleWithoutItems: 'No tienes ningún producto que mostrar todavía.',
        subtitleWithoutItems: 'Presiona Nuevo Producto para empezar a vender.',
        titulo: 'Nombre del producto',
        descripcion: 'Descripción corta',
        stock:'Producto en Stock',
        precio: 'Precio',
        volumen: 'Volumen',
        peso: 'Peso',
        imagen: 'Fotografías',
        providerItemCategory: 'Categoría',
        addImages: 'Agregar fotografías',
        observaciones: 'Descripción larga',
        unidadMedida: 'Unidad de medida',
        valorMedida: 'Valor de medida',
        stockLabel: 'Producto en stock',
        productDetails:'Detalles del producto',
        cantidad: 'Cantidad máxima',
        cantidadPrefix: 'x',
        seeAsCustomer: 'Ver como cliente',
        unregisterItem: 'Dar de baja',
        confirmUnregisterItem: '¿Estás seguro de querer dar de baja este producto?',
        sortBy: {
          createdAt: 'Antigüedad',
          precio: 'Precio',
          titulo: 'Nombre'
        },
        currency: {
          USD: '$',
          PEN: 'S/.'
        }
      },
      actions: {
        showCategory: 'Lista de Categorías',
        newProvider: 'Nuevo Proveedor',
        edit: 'Editar',
        delete: 'Eliminar'
      },
      client: {
        formLegend: 'Información personal',
        client: 'Cliente',
        clients: 'Clientes',
        listOfClients: 'Lista de clientes',
        successClientSave: 'Cliente guardado éxitosamente',
        successUpdateClient: 'Cliente actualizado éxitosamente',
        successDeleteClient: 'Cliente eliminado éxitosamente',
        disable: 'Eliminar',
        confirmDisable: '¿Estás seguro de querer eliminar este cliente?',
        import: 'Importar',
        export: 'Exportar',
        clientName: 'Nombre del cliente',
        sortBy: 'Ordenar por',
        clientSearch: 'Buscar cliente',
        notas: 'Notas',
        ruc: 'Ruc',
        nombres: 'Nombres',
        direccion: 'Dirección',
        telefono: 'Teléfono',
        ciudad: 'Ciudad',
        email: 'E-mail',
        noClients: 'No tienes ningún cliente todavía.',
        addImage: 'Agregar fotografía',
        razonSocial: 'Razón social'
      },
      wishlist: {
        wishlists: 'Listas de deseos',
        searchBox: 'Buscar lista',
        new: 'Nueva lista',
        id: 'id',
        name: 'Nombre de la lista',
        edit: 'Ver lista',
        titleNew: 'Nueva lista',
        titleEdit: 'Editar lista',
        listName: 'Nombre de la lista',
        items: 'Items',
        shareWith: 'Compartir lista con',
        save: 'Guardar lista',
        remove: 'Eliminar lista',
        buttonAddItems: 'Agregar ítems +',
        buttonAddDate: 'Agregar hora y fecha +',
        buttonShare: 'Escoger usuario +',
        titleSelectItems: 'Seleccionar Items'
      },
      office: {
        office: 'Establecimiento',
        officeAddress: 'Dirección Establecimiento',
        officeMatrix: 'Matriz',
        officeSuccessSave: 'Establecimiento guardado éxitosamente',
        officeSuccessUpdate: 'Establecimiento actualizado éxitosamente',
        officeLegend: 'Datos del Establecimiento',
        place: 'Localidad',
        direccion: 'Dirección',
        telefono: 'Teléfono',
        officeNumber: 'Sucursal número',
        officeDelete: '¿Seguro quieres eliminar este establecimiento?',
        officeDeleteReasons: 'Cuéntanos las razones',
        officeDeleteMotive: 'Motivo del cierre',
        officeDeleteTime: 'Tiempo del cierre',
        officeDeleteDefinitive: 'Es un cierre definitivo',
        disableOffice: 'Dar de baja',
        officeSuccessDelete: 'Local eliminado',
        officeSuccess: 'Correctamente',
        officesAny: 'No dispone de ningún Establecimiento o Sucursal',
        locationNotFound: 'No he encontrado la dirección: ',
        taskInProgress: 'Tarea en progreso',
        yes: 'Si',
        not: 'No',
        officeEnabled: {
          true: 'Establecimiento activo',
          false: 'Establecimiento inactivo'
        },
        officeDisabled: 'Establecimiento inactivo',
        weekdays: {
          cerrado: 'Cerrado',
          selectHourPlaceholder: 'HH:MM',
          collectionTitle: 'Días laborables',
          openFromPlaceholder: 'de',
          openUntilPlaceholder: 'a'
        }
      },
      password: {
        updatePassword: 'Actualizar contraseña',
        current: 'Contraseña',
        confirm: 'Confirmar contraseña',
        update: 'Actualizar'
      },
      user: {
        profile: 'Perfil de Usuario',
        showProfile: 'Ver perfil',
        name: 'Nombre',
        email:  'Correo electrónico',
        age:  'Edad',
        country:  'Ciudad',
        image:  'Imagen',
        changeImagen: 'Cambiar Imagen',
        successUpdateProfile: 'Perfil actualizado éxitosamente',
        password: 'Contraseña',
        repeatPassword: 'Repita contraseña',
        birthdate:  'Fecha de Nacimiento',
        selectDatePlaceholder: 'Seleccionar fecha'
      },
      product: {
        more: 'mostrar más',
        less: 'mostrar menos',
        buyNow: 'Comprar Ahora',
        addCar: 'Añadir al carrito',
        addWishlist: 'Añadir a mi whishlist',
        modalTitle: 'Agregar a mi Wishlist o lista personalizada',
        modalButtonNew: 'Nueva Wishlist',
        modalInputNew: 'Nombre Wishlist',
        modalButtonSave: 'Guardar'
      },
      profile: {
        title: 'Perfil',
        tabs: {
          info: 'Datos',
          addresses: 'Direcciones',
          metrics:'Métricas',
          managements:'Gestiones'
        },
        addresses: {
          city: 'Ciudad',
          parish: 'Parroquia',
          neighborhood: 'Barrio',
          addressOne: 'Dirección 1',
          addressTwo: 'Dirección 2 (Opcional)',
          zipCode: 'Código postal',
          reference: 'Referencia',
          telephoneNumber: 'Número convencional',
          formLegendUpdate: 'Actualizar Dirección',
          formLegendNew: 'Nueva Dirección',
          name: 'Nombre',
          addAddressBtnText: 'Agregar Dirección',
          saveBtnText: 'Guardar Dirección',
          updateBtnText: 'Actualizar Dirección',
          noAddressesSaved: 'No has guardado ninguna dirección de envío'
        }
      },
      cart: {
        successfullyAdded: 'Ítem agregado exitosamente',
        buyItems: 'Comprar ítems',
        modalTitle: 'Finalizar pedido',
        placeOrder: 'Enviar pedido',
        observations: 'Observaciones',
        observacionesPlaceholder: 'Ej: sin cebollas',
        addDeliveryAddress: 'Agregar dirección de envío',
        deliveryAddress: 'Dirección de entrega',
        deliveryMethod: 'Método de entrega',
        paymentMethod: 'Método de pago',
        successfullyOrder: 'Pedido generado exitosamente',
        cantidadPlural: 'unidades',
        cantidadSingular: 'unidad',
        title: 'Carrito',
        deliverNow: 'Entregar inmediatamente',
        pickupNow: 'Inmediatamente',
        shippingCosts: '(costos de envío)',
        deliveryPlaceholder: 'Entrega:',
        pickupPlaceholder: 'Recoger',
        withoutDeliveryAddress: 'Definir dirección de envío',
        anonBillingAddress: 'Consumidor final',
        titleWithoutItems: 'Tu carrito de compras está vacío',
        subtitleWithoutItems: 'Agrega ítems a tu carrito para comprarlos',
        deliveryMethods: {
          pickup: 'Recoger en local',
          shipping: 'Enviar a domicilio',
        }
      },
      orders: {
        collectionTitle: 'Orden #',
        total: 'Total',
        titleFormOrders: 'Revisa todos los pedidos que los clientes hacen sobre tus productos.',
        inProcess: 'En gestión',
        completed: 'Completados',
        have: 'Tienes',
        ordersPendings: 'Pedidos pendientes',
        ordersEmpty: 'No hay pedidos',
        orderDetails: 'Detalles de la orden'
      },
      order: {
        submittedAt: 'Enviada',
        observations: 'Observaciones',
        customerInfo: 'Información de Cliente',
        dispatchAt: 'Hora de despacho',
        timeForDispatch: 'Tiempo para el despacho',
        providerProfile: {
          quantity: 'Can',
          price: 'Precio',
          item: {
            name: 'Producto',
            observations:'Observaciones:',
            cantidadPrefix: 'x'
          }
        },
        summary: {
          subtotal: 'Subtotal',
          shippingCosts: 'Costos de envío',
          VAT: '%',
          total: 'Total de Compra',
        },
        discount: {
          textCode: 'Código de Descuento',
          applyCode: 'Aplicar Código'
        },
        status: {
          submitted: 'Enviada'
        },
        delivery: {
          deliveryETA: 'Hora de entrega estimada',
          deliveryETAUnknown: 'calculando..',
          status: {
            pending: 'Esperando confirmación del proveedor',
            accepted: 'Aceptada por el proveedor',
            rejected: 'Rechazada'
          }
        }
      },
      form: {
        requiredField: 'Campo requerido. ',
        wrongEmail: 'Email incorrecto. ',
        dontMatch: 'Contraseñas no coinciden. ',
        leaveBlank: 'Dejar en blanco si no desea cambiar'
      },
      billingAddress: {
        legendForm: 'Dirección de facturación',
        newBillingAddress: 'agregar datos de facturación',
        anyBillingAddress: 'no has registrado tus datos para facturación',
        successSave: 'La dirección de facturación ha sido guardado éxitosamente',
        successUpdate: 'La dirección de facturación ha sido actualizado éxitosamente',
        noAddressesSaved: 'No has registrado ninguna dirección de facturación'
      },
      dispatchers:{
        dispatchers: 'Despachadores',
        dispatcher: 'Despachador',
        dispatcherSearch: 'Buscar Despachador',
        dispatcherAny: 'No has agregado ningún despachador todavía',
        dispacherClick:'Da click en Nuevo Despachador para empezar',
        dispacherOffice: 'Sucursal',
        dispatchersCreate: 'El Despachador ha sido guardado éxitosamente',
        dispatchersUpdate: 'El Despachador ha sido actualizado éxitosamente',
        dispatchersDelete: 'El Despachador ha sido eliminado éxitosamente',
        dispatchersData: 'Datos del Despachador',
        notAccepted: 'Esta invitación no ha sido aceptada todavía.'
      },
      termsAndConditions: {
        agreeTOS: 'Aceptar términos y condiciones'
      },
      places:{
        places: 'Localidades'
      },
      maps: {
        loading: 'Cargando mapa...',
        geocoding: 'Buscando direcciones...',
        geocoded: 'Las direcciones fueron llenadas con el resultado más acertado posible. Asegúrate de revisarlas',
        wontGeocode: 'No ha sido posible encontrar direcciones para esa ubicación',
        overGeocodeLimit: 'El número de búsquedas de direcciones excedió el límite, por favor prueba de nuevo en unos segundos'
      },
      shippingRequest: {
        noMoreItems: 'No hay más pedidos que mostrar',
        takeRequest: 'Tomar pedido',
        pickingUp: 'En la tienda',
        clientDetails: 'Datos del cliente',
        deliverToAddress: 'Dirección para la entrega',
        providerName: 'Proveedor',
        delivered: 'Entregado',
        availableRoutes: 'Rutas',
        routesStatus: {
          searching: 'Buscando rutas..',
          noRoutes: 'No hay rutas disponibles'
        },
        customerOrderItem: {
          cantidad: 'Cantidad'
        },
        status: {
          new: 'Nuevo',
          assigned: 'Camino a la tienda',
          in_progress: 'Camino a la entrega', // jshint ignore:line
          delivered: 'Entregado'
        },
        routeLegs: {
          customer_order_delivery: { // jshint ignore:line
            'leg0': 'A la tienda',
            'leg1': 'A la entrega'
          },
          ask_to_validate: { // jshint ignore:line
            'leg0': 'A la tienda'
          }
        }
      }
    });

    $translateProvider.preferredLanguage('es');
  }
})();
