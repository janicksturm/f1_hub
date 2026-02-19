import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def validate_password(password, hash_password):
    return bcrypt.checkpw(password.encode('utf-8'), hash_password.encode('utf-8'))

