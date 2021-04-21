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
          <li class="nav-item active">
            <router-link class="nav-link" to="/register">Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
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
                    <button @click="toRegister" class="btn bg-primary text-white" type="button">Resister</button>
                    <button @click="toLogin" class="btn bg-secondary text-white" type="button">Login</button>
                </div>
            </div>
            <div class="fit col-md-6">
                <img class="" src="static/images/car3.jpg">
            </div>
        </div>
    `,
    data() {
        return {}
    }, 
    methods: {
        toRegister: function() {
            this.$router.push({ path: '/register' });
        },
        toLogin: function() {
            this.$router.push({ path: '/login' });
        },
    },
};

const Register = {
    name: 'Register',
    template: `
        <div>
            <h1>Register New User</h1>
            <form method="POST" action="" id="register-form" @submit.prevent="registerUser">
                <div>
                    <div>
                        <label class="" for="username">Username</label><br>
                        <input type="text" class="" name="username">
                    </div>
                    <div>
                        <label class="" for="password">Password</label><br>
                        <input type="password" class="" name="password">
                    </div>
                </div>
                <div>
                    <div>
                        <label class="" for="fullname">Fullname</label><br>
                        <input type="text" class="" name="fullname">
                    </div>
                    <div>
                        <label class="" for="email">Email</label><br>
                        <input type="email" class="" name="email">
                    </div>
                </div>
                <div>
                    <label class="" for="location">Location</label><br>
                    <input type="text" class="" name="location">
                </div>
                <div>
                    <label class="" for="biography">Biography</label><br>
                    <textarea name="biography" class=""></textarea><br>
                </div>
                <div>
                    <label class="" for="photo">Upload Photo</label><br>
                    <input type="file" class="" name="photo" accept="image/x-png,image/jpg">
                </div>
                <button type="submit" name="submit" class="btn btn-primary">Register</button>
            </form>
        </div>
    `,
    data: function() {
        return {
            
        };
    },
    methods: {
        registerUser: function() {
            let self = this;
            let registerForm = document.getElementById('register-form');
            let form_data = new FormData(registerForm);

            fetch("/api/register", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log('success');
                console.log(jsonResponse);

            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
    }
};

const Login = {
    name: 'Login',
    template: `
        <div>
            <h1>Login to your account</h1>
            <form method="POST" action="" id="loginForm" @submit.prevent="loginUser">
                <div>
                    <label class="" for="username">Username</label><br>
                    <input type="text" class="" name="username">
                </div>
                <div>
                    <label class="" for="biography">Password</label><br>
                    <input type="password" class="" name="password">
                </div>
                <button type="submit" name="submit" class="btn btn-primary">Login</button>
            </form>
        </div>
    `,
    data() {
        return {}
    },
    methods: {
        loginUser () {

        }
    },
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
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    /*{ path: "/logout", component: Logout },
    { path: "/explore", component: Explore },
    { path: "/users/:id", component: User },
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