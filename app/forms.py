  
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, TextAreaField, PasswordField, SelectField
from wtforms.validators import DataRequired, InputRequired, Email


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = StringField('Password', validators=[DataRequired()])
    fullname = StringField('Full Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    location = StringField('Location', validators=[DataRequired()])
    biography = TextAreaField('Biography', validators=[DataRequired()])
    photo = FileField('Upload Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')
    ])

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])

class ExploreForm(FlaskForm):
    make = StringField('Make', validators=[DataRequired()])
    model = StringField('Model', validators=[DataRequired()])

class CarForm(FlaskForm):
    make = StringField('Make', validators=[DataRequired()])
    model = StringField('Model', validators=[DataRequired()])
    colour = StringField('Colour', validators=[DataRequired()])
    year = StringField('Year', validators=[DataRequired()])
    price = StringField('Price', validators=[DataRequired()])
    car_type = SelectField('Car Type', 
        choices=[
            (1, 'SUV'), 
            (2, 'Truck'), 
            (3, 'Sedan'), 
            (4, 'Van'),
            (5, 'Coupe'),
            (6, 'Wagon'),
            (7, 'Convertible'),
            (8, 'Sports Car'),
            (9, 'Diesel'),
            (10, 'Crossover'),
            (11, 'Luxury Car'),
            (12, 'Hybrid/Electric'),
            (13, 'Super car'),
            (12, 'Hyper Car')
        ], 
        validators=[DataRequired()], 
        coerce=int
    )
    transmission = SelectField('Transmission', choices=[(1, 'Automatic'), (2, 'Manual')], validators=[DataRequired()], coerce=int)
    description = TextAreaField('Description', validators=[DataRequired()])
    photo = FileField('Photo', validators=[
        FileRequired(),
        FileAllowed(['jpg', 'png', 'jpeg'], 'Images only!')
    ])
