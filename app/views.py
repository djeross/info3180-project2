"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""

from app import app, db, login_manager
from flask import render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from app.models import Users,Favourites,Cars
from werkzeug.security import check_password_hash,generate_password_hash
from .forms import RegisterForm, LoginForm, ExploreForm, CarForm
import datetime

###
# Routing for your application.
###

@app.route('/api/register', methods=['POST'])
def register():

    form = RegisterForm()

    if request.method == 'POST':

        if form.validate_on_submit():

            username = form.username.data
            password = form.password.data
            fullname = form.fullname.data
            email = form.email.data
            location = form.location.data
            biography = form.biography.data
            photo = form.photo.data
            date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            filename = secure_filename(photo.filename)

            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            
            flash('User successfully registered.', 'success')
            
            data = [
                {
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
            return jsonify(errors=form_errors(form))

@app.route('/api/auth/login', methods=['POST'])
def login():

    form = LoginForm()

    if request.method == 'POST':

        if form.validate_on_submit():

            pass

        else:
            return jsonify(errors=form_errors(form))

@app.route('/api/auth/logout', methods=['POST'])
def logout():

    data = [{'message': 'Log out successful'}]
    return jsonify(data=data)

@app.route('/api/cars', methods=['POST'])
def cars():

    form = CarForm()

    if request.method == 'POST':

        if form.validate_on_submit():

            make = form.make.data
            model = form.model.data
            colour = form.colour.data
            year = form.year.data
            price = form.price.data
            car_type = dict(form.car_type.choices).get(form.car_type.data)
            transmission = dict(form.transmission.choices).get(form.transmission.data)
            description = form.description.data
            photo = form.photo.data

            filename = secure_filename(photo.filename)

            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            flash('Car successfully added.', 'success')
            
            data = [
                {
                'description': description,
                'year': year,
                'make': make,
                'model': model,
                'colour': colour,
                'transmission': transmission,
                'type': car_type,
                'price': price,
                'photo': filename
            }]

            return jsonify(data=data)

        else:
            return jsonify(errors=form_errors(form))



@app.route('/test')
def test():
    return render_template("explore.html")


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
