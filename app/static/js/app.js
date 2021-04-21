/* Add your Application JavaScript */
// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <span class="navbar-brand mb-0 h1 nav-header"><i class="fa fa-car"></i>&nbsp&nbsp&nbsp&nbspUnited Auto Sales</span>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
            <div class="logged-in-links">
                <li class="nav-item active">
                    <router-link class="nav-link" to="/Explore">Explore <span class="sr-only">(current)</span></router-link>
                </li>
            </div>
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Register <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/">Login <span class="sr-only">(current)</span></router-link>
            </li>

        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
        <div class="d-flex align-items-center home-div col-md-12">
            <div class="row align-items-center col-md-6 intro">
                <h1 class="font-weight-bold">Buy and Sell Cars Online</h1>
                <p class="mt-2 mb-4 text-secondary">United Auto Sales provides the fastest, easiest and most user friendly way to buy or sell cars online. Find a Great Price on the Vehicle You Want</p>
                <div class="flex-area">
                    <button class="btn bg-primary text-white" type="button">Resister</button>
                    <button class="btn bg-secondary text-white" type="button">Login</button>
                </div>
            </div>
            <div class="fit col-md-6">
                <img class="" src="static/images/car3.jpg">
            </div>
        </div>
    `,
    data() {
        return {}
    }
};

const Explore = {
    name: 'Explore',
    template: `
        <div class="container" id="favcontainer">
            <div id="displayexplore">
                <h1>Explore</h1>
                <div id="explore-search">
                    <form id="explore-form" method="post">
                        <div class="form-group col-4">
                            <label for="make">Make</label>
                            <input type="text" class="form-control" name="make" />
                        </div>
                        <div class="form-group col-4">
                            <label for="model">Model</label>
                            <input type="text" class="form-control" name="model" />
                        </div>
                        <div class="form-group search-btn-div">
                            <button type="submit" class="btn btn-success search-btn">Search</button>
                            </div>
                    </form>
                </div>  

                <div class="carslist">
                <div v-for="cars in listOfCars.slice(0, 3)">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top favcar"  :src="cars.photo">
                        <div class="card-body">
                            <div class="name-model-price">

                                <div class="name-model">
                                    <span  class="car-name">{{cars.make}}</span>
                                    <span class="graytext">{{cars.model}}</span>
                                </div>

                                <a href="#" class="btn btn-success card-price-btn">
                                    <img class="icons" src='/static/images/tagicon.png'>
                                    <span><span>$</span>{{cars.price}}</span>
                                </a>

                            </div>
                            <a href="#" class="btn btn-primary card-view-btn">View more details</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            listOfCars : [{'photo':"/static/images/car1.jpg",'make':"Tesla",'model':"Model s",'price':"500,000"},
{'photo':"/static/images/car2.jpg",'make':"Toyota",'model':"RX Sport",'price':"1,000,000"},
{'photo':"/static/images/car3.jpg",'make':"Nissan",'model':"GTR-x",'price':"20,000,000"}]
        }
    }
};








const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    /*{ path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/logout", component: Logout },*/
    { path: "/explore", component: Explore },
    /*{ path: "/users/:id", component: User },
    { path: "/cars/new", component: AddCar },
    { path: "/cars/:id", component: Car },*/

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');