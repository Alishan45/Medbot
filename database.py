#database.py
import sqlite3
# Initialize the database
def initialize_db():
    conn = sqlite3.connect('medbot.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def add_user(name, email, password):
    """Adds a new user to the database.

    Args:
        name (str): Full name of the user.
        email (str): Email address of the user.
        password (str): Hashed password of the user.

    Returns:
        bool: True if the user was added successfully, False if the email already exists.
    """
    try:
        conn = sqlite3.connect('medbot.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
        conn.commit()
        return True
    except sqlite3.IntegrityError:
        # Email already exists
        return False
    finally:
        conn.close()


# Authenticate user (Login)
def authenticate_user(email, password):
    print(" login Connecting to the database...")
    conn = sqlite3.connect('medbot.db')
    print("login Connected successfully.")
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    user = cursor.fetchone()
    conn.close()
    return user is not None

# Update password (Forgot Password)
def update_password(email, new_password):
    print(" forget-passcode Connecting to the database...")
    conn = sqlite3.connect('medbot.db')
    print("forget-passcode Connected successfully.")
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET password = ? WHERE email = ?', (new_password, email))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0
