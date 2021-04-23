"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

import os
from app import app, db, login_manager, csrf
from flask import render_template, request, redirect, url_for, flash, jsonify, g
from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users,Favourites,Cars
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from .forms import RegisterForm, LoginForm, ExploreForm, CarForm
from app.models import Users, Cars, Favourites
import datetime

# Using JWT
import jwt
from flask import _request_ctx_stack
from functools import wraps

# Create a JWT @requires_auth decorator
# This decorator can be used to denote that a specific route should check
# for a valid JWT token before displaying the contents of that route.
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated

###
# Routing for your application.
###

@app.route('/api/register', methods=['POST'])
def register():

    form = RegisterForm()
    errors = []

    if request.method == 'POST':
        print("post")
        if form.validate_on_submit():

            username = form.username.data
            password = form.password.data
            fullname = form.fullname.data
            email = form.email.data
            location = form.location.data
            biography = form.biography.data
            photo = form.photo.data
            filename = secure_filename(photo.filename)
            date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            user1 = Users.query.filter_by(username=username).first()
            user2 = Users.query.filter_by(email=email).first()
            if user1 is None:
                if user2 is None:
                    
                    photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

                    newUser = Users(username=username, password=password, name=fullname, email=email,
                                    location=location, biography=biography, photo=filename, date=date)
                    
                    db.session.add(newUser)
                    db.session.commit()

                    flash('User successfully registered.', 'success')

                    user = Users.query.filter_by(username=username).first()

                    data = [
                        {
                        'id': user.id,
                        'username': username,
                        'name': fullname,
                        'photo': filename,
                        'email': email,
                        'location': location,
                        'biography': biography,
                        'date_joined': date
                    }]

                    return jsonify(data=data)
                else:
                    errors.append("Email is already taken")
            else:
                errors.append('Username is already taken')
        return jsonify(errors=form_errors(form) + errors)

@app.route('/api/auth/login', methods=['POST'])
def login():

    form = LoginForm()
    errors = []

    if request.method == 'POST':

        if form.validate_on_submit():

            username = form.username.data
            password = form.password.data
            print(username)
            print(password)
            user = Users.query.filter_by(username=username).first()

            if user is not None and check_password_hash(user.password, password):
                payload = {
                    'id': user.id,
                    'username': user.username,
                    'iat': datetime.datetime.now(datetime.timezone.utc),
                    'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=45)
                }

                token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

                return jsonify(data={'message': 'Login Successful', 'token': token, 'id': user.id})
            else:
                errors.append('Incorrect username or password')
        return jsonify(errors=form_errors(form) + errors)

@app.route('/api/auth/logout', methods=['POST'])
@requires_auth
def logout():
    return jsonify(data={'message': 'Log out successful'})

@app.route('/api/cars', methods=['POST'])
@requires_auth
def cars():

    form = CarForm()

    if request.method == 'POST':

        if form.validate_on_submit():

            make = form.make.data
            model = form.model.data
            colour = form.colour.data
            year = form.year.data
            price = format(float(form.price.data), '.2f')
            car_type = form.car_type.data
            transmission = form.transmission.data
            description = form.description.data
            photo = form.photo.data

            filename = secure_filename(photo.filename)

            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            newCar = Cars(description=description, make=make, model=model, colour=colour,
                        year=year, transmission=transmission, car_type=car_type, price=price,
                        photo=filename, userid=g.current_user["id"])

            db.session.add(newCar)
            db.session.commit()
            
            flash('Car successfully added.', 'success')

            data = [
                {
                #'id': id,
                'description': description,
                'year': year,
                'make': make,
                'model': model,
                'colour': colour,
                'transmission': transmission,
                'type': car_type,
                'price': price,
                'photo': filename,
                'user_id': '#'
            }]

            return jsonify(data=data)

        else:
            return jsonify(errors=form_errors(form))

@app.route('/api/cars', methods=["GET"])
@requires_auth
def get_all_cars():

    cars = db.session.query(Cars).all()
    data = []

    if cars is None:
        return jsonify({"message": "No cars available", 'errors': []})

    for car in cars:
        data.append({
            'id': car.id,
            'description': car.description,
            'year': car.year,
            'make': car.make,
            'model': car.model,
            'colour': car.colour,
            'transmission': car.transmission,
            'type': car.car_type,
            'price': car.price,
            'photo': car.photo,
            'user_id': car.userid
        })

    return jsonify(data=data)

@app.route("/api/cars/<car_id>", methods=["GET"])
@requires_auth
def get_car(car_id):

    car = Cars.query.filter_by(id=car_id).first()
    if car is None:
        return jsonify({"message": "Car does not exist", 'errors': []})

    data = [{
            'id': car.id,
            'description': car.description,
            'year': car.year,
            'make': car.make,
            'model': car.model,
            'colour': car.colour,
            'transmission': car.transmission,
            'type': car.car_type,
            'price': car.price,
            'photo': car.photo,
            'user_id': car.userid
    }]

    isFav = False
    test = Favourites.query.filter(Favourites.car_id == car.id).filter(Favourites.user_id == g.current_user['id'] ).first()

    if test is not None:
        isFav = True

    return jsonify(data=data, isFav=isFav)

@app.route("/api/cars/<car_id>/favourite", methods=["POST"])
@requires_auth
def favourite(car_id):
    json_favourite= request.get_json(silent=True)
    cid=json_favourite.get("car_id")
    uid=json_favourite.get("user_id")

    isFav=Favourites.query.filter(Favourites.car_id == cid).filter(Favourites.user_id == uid ).first()
   
    if isFav== None:
        favourite = Favourites(car_id=cid, user_id=uid)
        db.session.add(favourite)
        db.session.commit()
        data = {
            'message': 'Car Successfully Favourited',
            'id': car_id
        }
        return jsonify(data=data)
    return jsonify({"warning":"Car is Already a Favourite"})



@app.route("/api/cars/<car_id>/favourite/remove", methods=["POST"])
@requires_auth
def remove_favourite(car_id):

    Favourites.query.filter_by(car_id=car_id).delete()

    data = [{
        'message': 'Car Successfully Unfavourited',
        'id': car.id
    }]

    return jsonify(data=data)

@app.route('/api/search', methods=['GET'])
@requires_auth
def search():

    form = ExploreForm(request.args)

    
    make = form.make.data
    model = form.model.data
    
    if (make == "") and (model != ""):
        cars = Cars.query.filter_by(model=model).all()
    elif (make != "") and (model == ""):
        cars = Cars.query.filter_by(make=make).all()
    elif (make != "") and (model != ""):
        cars = Cars.query.filter_by(make=make,model=model).all()
    else:
        cars = cars = db.session.query(Cars).all()

    data = []

    if cars is None:
        return jsonify({"message": "No cars available with that criteria", 'errors': []})

    for car in cars:
        data.append({
            'id': car.id,
            'description': car.description,
            'year': car.year,
            'make': car.make,
            'model': car.model,
            'colour': car.colour,
            'transmission': car.transmission,
            'type': car.car_type,
            'price': car.price,
            'photo': car.photo,
            'user_id': car.userid
        })

    return jsonify(data=data)
   

@app.route("/api/users/<user_id>", methods=["GET"])
@requires_auth
def get_user(user_id):

    user = Users.query.filter_by(id=user_id).first()

    if user is None:
        return jsonify({"message": "User does not exist", 'errors': []})

    data = {
        'id': user.id,
        'username': user.username,
        'name': user.name,
        'photo': user.photo,
        'email': user.email,
        'location': user.location,
        'biography': user.biography,
        'date_joined': user.date
    }

    return jsonify(data=data)

@app.route("/api/users/<user_id>/favourites", methods=["GET"])
@requires_auth
def get_user_favourites(user_id):

    favourites = Favourites.query.filter_by(user_id=user_id).all()
    data = []

    if favourites is None:
        return jsonify({"message": "User has no favourites", 'errors': []})

    for favourite in favourites:

        car_id = favourite.car_id
        car = Cars.query.filter_by(id=car_id).first()

        data.append({
            'id': car.id,
            'description': car.description,
            'year': car.year,
            'make': car.make,
            'model': car.model,
            'colour': car.colour,
            'transmission': car.transmission,
            'type': car.car_type,
            'price': car.price,
            'photo': car.photo,
            'user_id': car.userid
        })

    return jsonify(data=data)



@app.route('/test')
def test():
    return render_template("fav.html")


# Please create all new routes and view functions above this route.
# This route is now our catch all route for our VueJS single page
# application.
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".

    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')




@login_manager.user_loader
def load_user(id):
    return UserProfile.query.get(int(id))

# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages


###
# The functions below should be applicable to all Flask apps.
###


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)


@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also tell the browser not to cache the rendered page. If we wanted
    to we could change max-age to 600 seconds which would be 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
