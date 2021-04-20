from . import db

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100))
    password = db.Column(db.String(300))
    name = db.Column(db.String(50))
    email = db.Column(db.String(50))
    location = db.Column(db.String(250))
    biography = db.Column(db.String(2500))
    photo = db.Column(db.String(100))
    date = db.Column(db.DateTime)

    def __init__(self,username,password,name,email,location,biography,photo,date):
        self.username = username
        self.password = password
        self.name = name
        self.email = email
        self.location = location
        self.biography = biography
        self.photo = photo
        self.date = date

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Name %r>' % self.name



class Cars(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(1000))
    make = db.Column(db.String(100))
    model = db.Column(db.String(100))
    colour = db.Column(db.String(50))
    model = db.Column(db.String(4))
    transmission = db.Column(db.String(100))
    car_type = db.Column(db.String(100))
    price = db.Column(db.Float)
    photo = db.Column(db.String(100))
    userid= db.Column(db.Integer)

    def __init__(self,description,make,model,colour,transmission,car_type,price,photo,userid):
        self.description = description
        self.make = make
        self.model = model
        self.colour = colour
        self.transmission = transmission
        self.car_type = car_type
        self.price = price
        self.photo = photo
        self.userid= userid

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Description %r>' % self.description



class Favourites(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    car_id = db.Column(db.Integer)
    user_id = db.Column(db.Integer)

    def __init__(self,car_id,user_id):
        self.car_id = car_id
        self.user_id = user_id

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<Car ID %r>' % self.car_id


