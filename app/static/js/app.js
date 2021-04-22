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
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" :key="$route.fullPath">
    <router-link class="nav-link text-white" to="/" v-if="!isLoggedIn()"><i class="fa fa-car"></i>&nbsp&nbsp&nbsp&nbspUnited Auto Sales</router-link>
    <router-link class="nav-link text-white" to="/explore" v-if="isLoggedIn()"><i class="fa fa-car"></i>&nbsp&nbsp&nbsp&nbspUnited Auto Sales</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        
        <ul class="navbar-nav mr-auto" v-if="isLoggedIn()">
            <li class="nav-item active">
                <router-link class="nav-link" to="/cars/new">Add Car <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
            </li>
            <li class="nav-item active">
                <router-link class="nav-link" to="/">My Profile <span class="sr-only">(current)</span></router-link>
            </li>
        </ul>
      
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active" v-if="!isLoggedIn()">
            <router-link class="nav-link" to="/register">Register <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="!isLoggedIn()">
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" v-if="isLoggedIn()">
            <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>

      </div>
    </nav>
    `,
    data() {
        return {}
    }, 
    methods: {
        isLoggedIn: function() {
            if (localStorage.hasOwnProperty('token') === true) {
                return true;
            }
            return false;
        }
    }
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
        }
    },
};

const Register = {
    name: 'Register',
    template: `
        <div class="maincontainer">
        <div class="register m-4">
            <h1 class="mb-4">Register New User</h1>
            <form method="POST" class="form" action="" id="register-form" @submit.prevent="registerUser()">
                <div class="d-flex flex-area1 mt-sm-1 mb-sm-1">
                    <div>
                        <label class="" for="username">Username</label><br>
                        <input type="text" class="form-control form-field" name="username" required>
                    </div>
                    <div>
                        <label class="" for="password">Password</label><br>
                        <input type="password" class="form-control form-field" name="password" required>
                    </div>
                </div>
                <div class="d-flex flex-area1 mt-sm-3 mb-sm-1">
                    <div>
                        <label class="" for="fullname">Fullname</label><br>
                        <input type="text" class="form-control form-field" name="fullname" required>
                    </div>
                    <div>
                        <label class="" for="email">Email</label><br>
                        <input type="email" class="form-control form-field" name="email" required>
                    </div>
                </div>
                <div class="mt-sm-3 mb-sm-1">
                    <label class="" for="location">Location</label><br>
                    <input type="text" class="form-control form-field" name="location" required>
                </div>
                <div class="mt-sm-3">
                    <label class="" for="biography">Biography</label><br>
                    <textarea name="biography" class="form-control" required></textarea><br>
                </div>
                <div class="">
                    <label class="" for="photo">Upload Photo</label><br>
                    <input type="file" class="form-control form-field" name="photo" accept=".jpeg, .jpg, .png">
                </div>
                <button type="submit" name="submit" class="btn bg-secondary text-white mt-sm-3 mb-sm-1">Register</button>
            </form>
        </div>
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
                router.push('/login');
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
        <div class="center-form m-4 login">
            <h2 class="text-center mb-4">Login to your account</h2>
            <form method="POST" class="form" action="" id="login-form" @submit.prevent="loginUser()">
                <div class="mt-sm-1 mb-sm-1">
                    <label class="" for="username">Username</label><br>
                    <input type="text" class="form-control form-field login-field" name="username" required>
                </div>
                <div class="mt-sm-3 mb-sm-1">
                    <label class="" for="biography">Password</label><br>
                    <input type="password" class="form-control form-field login-field" name="password" required>
                </div>
                <button type="submit" name="submit" class="btn bg-secondary text-white mt-sm-3 mb-sm-1 login-field">Login</button>
            </form>
        </div>
    `,
    data() {
        return {}
    },
    methods: {
        loginUser: function() {
            let self = this;
            let loginForm = document.getElementById('login-form');
            let form_data = new FormData(loginForm);

            fetch("/api/auth/login", {
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

                if(jsonResponse.token !== null) {
                    console.log('inside')
                    let jwt_token = jsonResponse.data.token;
                    let id = jsonResponse.data.id;

                    // stores token to localStorage
                    localStorage.setItem('token', jwt_token);
                    localStorage.setItem('current_user', id);
                    
                    router.push('/explore');

                }

            })
            .catch(function(error) {
                console.log(error);
            });
    
        }
    }
};

const Logout = {
    name: 'Logout',
    template: `
    <h1 class="mt-sm-3">Logging out...</h1>
    `,
    created: function() {
        fetch("api/auth/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'
        })
        .then(function(response){
          return response.json();
        })
        .then(function(jsonResponse){
          console.log(jsonResponse);
          console.log('logged out');
          localStorage.removeItem('token');
          localStorage.removeItem('current_user');
          console.info('Token and current user removed from localStorage.');
          
          router.push('/');
        })
        .catch(function(error){
          console.log(error);
        });
    }
};

const Explore = {
    name: 'Explore',
    template: `
        <div class="container maincontainer">
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
                                    <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
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
            listOfCars : [{'photo':"/static/images/car1.jpg",'make':"Tesla",'model':"Model s",'price':"500,000",'year':"2019"},
{'photo':"/static/images/car2.jpg",'make':"Toyota",'model':"RX Sport",'price':"1,000,000",'year':"2021"},
{'photo':"/static/images/car3.jpg",'make':"Nissan",'model':"GTR-x",'price':"20,000,000",'year':"2018"}]
        }
    },
    created: function() {
        fetch("/api/cars", {
            method: 'GET',
            headers: {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            credentials: 'same-origin'        
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonResponse) {
            console.log(jsonResponse);
            console.log(jsonResponse.data)
            self.listOfCars = jsonResponse.data;
        })
        .catch(function(error) {
            console.log(error);
        });
    }
};



const Profile = {
    name: 'Profile',
    template: `
        <div class="container maincontainer">
            <div id="displayfav">

                <div id="profile">
                    <div id="profileimagediv">
                        <img class="favcar" id="round" :src="userInfo[0].photo">
                    </div>
                    <div id="profiledetailsdiv" class="descriptions">
                        <h2 id="profile-name">{{userInfo[0].name}}</h2>
                        <h4 class="graytext">@<span>{{userInfo[0].username}}</span></h4>
                        <p class="graytext">{{userInfo[0].biography}}</p>
                        <div id="elj">
                            <div>
                                <p class="profile-user-info graytext">Email</p>
                                <p class="profile-user-info graytext">Location</p>
                                <p class="profile-user-info graytext">Joined</p>
                            </div>
                            <div>
                                <p class="profile-user-info">{{userInfo[0].email}}</p>
                                <p class="profile-user-info">{{userInfo[0].location}}</p>
                                <p class="profile-user-info">{{userInfo[0].date_joined}}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="carsfavtext"><h1>Cars Favourited</h1></div>

                <div class="carslist">
                <div v-for="cars in listOfCars.slice(0, 3)">
                    <div class="card" style="width: 18rem;">
                        <img class="card-img-top favcar"  :src="cars.photo">
                        <div class="card-body">
                            <div class="name-model-price">

                                <div class="name-model">
                                    <span  class="car-name">{{cars.year.concat(" ",cars.make)}}</span>
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
            listOfCars: [{'photo':"/static/images/car1.jpg",'make':"Tesla",'model':"Model s",'price':"500,000",'year':"2016"},
{'photo':"/static/images/car2.jpg",'make':"Toyota",'model':"RX Sport",'price':"1,000,000",'year':"2020"},
{'photo':"/static/images/car3.jpg",'make':"Nissan",'model':"GTR-x",'price':"20,000,000",'year':"2020"}],
            userInfo: [{'photo':"http://localhost:8080/static/images/car3.jpg",'username':"Mary",'name':"Mary Jane",'email':"maryjane@yahoo.com",'location':"London,England",
'biography':"A personal biography is a concise introduction that provides a summarized version of your professional accomplishments, your credentials and education, and other information that makes you who you are. Personal bios are often used when seeking employment to provide hiring managers with a synopsis of why you are the ideal candidate for the job. They can also be used on networking platforms and professional websites.",'date_joined':"April 1,2020"
}]
        }
    }, 
    methods: {
        getUser: function() {
            
        },

        getTopFavs: function() {
            
        },
    }
};

const CarDetails = {
    name: 'CarDetails',
    template: `
        <div class="container maincontainer">
            <div id="display-car-details">
                <div id="car-details-card">
                    <img id="car-d-image" class="car-detail-image" src='/static/images/car1.jpg' alt="car image in card">
                    
                    <div id="car-details">
                        <h1 id="car-d-heading"> {{details[0].year.concat(" ",details[0].make)}}</h1>
                        <h4 class="graytext">{{details[0].model}}</h4>
                        <p class="car-d-description graytext">{{details[0].description}}</p>
                        <div id="cpbd">
                            <div id="cp">
                                <div>
                                    <p class="car-d-spec graytext">Color</p>
                                    <p class="car-d-spec graytext">Price</p>
                                </div>
                                <div>
                                    <p class="car-d-spec">{{details[0].colour}}</p>
                                    <p class="car-d-spec">{{details[0].price}}</p>
                                </div>
                            </div>
                            <div id="bd">
                                <div>
                                    <p class="car-d-spec graytext">Body Type</p>
                                    <p class="car-d-spec graytext">Transmission</p>
                                </div>
                                <div>
                                    <p class="car-d-spec">{{details[0].car_type}}</p>
                                    <p class="car-d-spec">{{details[0].transmission}}</p>
                                </div>
                            </div>
                            <br>
                        </div>
                        <div id="card-d-btns" >
                            <a href="#" class="btn btn-success email-owner">Email Owner</a>
                            <div id="card-d-heart" >
                                <button href="#" @click="addFavourite" id="heartbtn" class="heart fa fa-heart-o"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
    `,
    data() {
        return {
            details: [{"id": 207,
    "description": "The best electic car anyone can buy. With the longest range and quickest acceleration of any electric vehicle in production, Model S Plaid is the highest performing sedan ever built",
    "year": "2018","make": "Tesla","model": "Model S Plaid","colour": "Red","transmission": "Automatic",
    "car_type": "Sedan","price": ".420420420","photo": "http://localhost/images/tesla.jpg","user_id": 2
            }]
        }
    }, 
    methods: {
        addFavourite: function(event) {
            event.target.classList.toggle("fa-heart-o");
            event.target.classList.toggle("fa-heart");
            if(event.target.classList.contains("fa-heart")===true){
                alert("added to Fav list");
            }
            else{
                alert("remove from Fav list");
            }
        }
    }
};

const AddCar = {
    name: 'AddCar',
    template: `
    <div class="m-4">
        <h1 class="mb-4">Add New Car</h1>
        <form method="POST" class="form" action="" id="car-form" @submit.prevent="addCar()">
            <div class="mt-sm-1 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="make">Make</label><br>
                    <input type="text" class="form-control form-field" name="make" required>
                </div>
                <div>
                    <label class="" for="model">Model</label><br>
                    <input type="text" class="form-control form-field" name="model" required>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="colour">Colour</label><br>
                    <input type="text" class="form-control form-field" name="colour" required>
                </div>
                <div>
                    <label class="" for="year">Year</label><br>
                    <input type="text" class="form-control form-field" name="year" required>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1 d-flex flex-area1">
                <div>
                    <label class="" for="price">Price</label><br>
                    <input type="number" class="form-control form-field" name="price" required>
                </div>
                <div>
                    <label class="" for="car_type">Car Type</label><br>
                    <select name="car_type" class="form-control form-field" required>
                        <option value="SUV">SUV</option>
                        <option value="Truck">Truck</option>
                        <option value="Sedan">Sedan</option>
                        <option value="Van">Van</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Wagon">Wagon</option>
                        <option value="Convertible">Convertible</option>
                        <option value="Sports Car">Sports Car</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Crossover">Crossover</option>
                        <option value="Luxury Car">Luxury Car</option>
                        <option value="Hybrid/Electric">Hybrid/Electric</option>
                        <option value="Super Car">Super Car</option>
                        <option value="Hyper Car">Hyper Car</option>
                    </select>
                </div>
            </div>
            <div class="mt-sm-3 mb-sm-1">
                <label class="" for="transmission">Transmission</label><br>
                <select name="transmission" class="form-control form-field" required>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                </select>
            </div>
            <div class="mt-sm-3 mb-sm-1">
                <label class="" for="description">Description</label><br>
                <textarea name="description" class="form-control" required></textarea><br>
            </div>
            <div class="">
                <label class="" for="photo">Upload Photo</label><br>
                <input type="file" class="form-control form-field" name="photo" accept="image/x-png,image/jpg" required>
            </div>
            <button type="submit" name="submit" class="btn bg-secondary text-white mt-sm-3 mb-sm-1">Save</button>
        </form>
    </div>
    `,
    data() {
        return {}
    }, 
    methods: {
        addCar: function() {

            let self = this;
            let carForm = document.getElementById('car-form');
            let form_data = new FormData(carForm);

            fetch("/api/cars", {
                method: 'POST',
                body: form_data,
                headers: {
                    'X-CSRFToken': token,
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                credentials: 'same-origin'        
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonResponse) {
                console.log('success');
                console.log(jsonResponse);
                router.push('/explore');
            })
            .catch(function(error) {
                console.log(error);
            });
    
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
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/logout", component: Logout },
    { path: "/explore", component: Explore },
    { path: "/users/:id", component: Profile },
    { path: "/cars/new", component: AddCar },
    { path: "/cars/:id", component: CarDetails},

    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');