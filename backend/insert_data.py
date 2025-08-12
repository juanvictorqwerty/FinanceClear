import sqlite3
import random
from datetime import datetime, timedelta
import os

# Connect to the database
db_path = os.path.join(os.path.dirname(__file__), 'database.sqlite')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    payment_sum REAL NOT NULL,
    payment_date DATE NOT NULL
)
''')

# Sample names for generation
first_names = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Dorothy", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Donna", "Andrew", "Emily", "Joshua", "Michelle",
    "Kenneth", "Carol", "Kevin", "Amanda", "Brian", "Melissa", "George", "Deborah",
    "Edward", "Stephanie", "Ronald", "Rebecca", "Timothy", "Laura", "Jason", "Sharon",
    "Jeffrey", "Cynthia", "Ryan", "Kathleen", "Jacob", "Helen", "Gary", "Amy",
    "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Anna", "Stephen", "Brenda",
    "Larry", "Emma", "Justin", "Samantha", "Scott", "Katherine", "Brandon", "Christine",
    "Frank", "Debra", "Benjamin", "Rachel", "Gregory", "Catherine", "Samuel", "Janet",
    "Raymond", "Ruth", "Patrick", "Maria", "Alexander", "Heather", "Jack", "Diane"
]

last_names = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia",
    "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez",
    "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez",
    "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
    "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts",
    "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker", "Cruz", "Edwards",
    "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy", "Cook", "Rogers",
    "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey", "Reed", "Kelly",
    "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson", "Watson", "Brooks",
    "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza", "Ruiz", "Hughes",
    "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers", "Long", "Ross"
]

# Generate and insert 100 records
records = []
for i in range(1, 101):
    # Generate random name
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    name = f"{first_name} {last_name}"
    
    # Generate user ID (format: USER001, USER002, etc.)
    user_id = f"USER{i:03d}"
    
    # Generate payment sum between 1 and 1,000,000
    payment_sum = round(random.uniform(1, 1000000), 2)
    
    # Generate random date within last 2 years
    days_ago = random.randint(1, 730)
    payment_date = datetime.now() - timedelta(days=days_ago)
    payment_date_str = payment_date.strftime('%Y-%m-%d')
    
    records.append((name, user_id, payment_sum, payment_date_str))

# Insert records into database
cursor.executemany('''
INSERT INTO payments (name, user_id, payment_sum, payment_date)
VALUES (?, ?, ?, ?)
''', records)

# Commit changes and close connection
conn.commit()

# Verify insertion
cursor.execute('SELECT COUNT(*) FROM payments')
count = cursor.fetchone()[0]
print(f"Successfully inserted {count} records into the payments table")

# Show first 5 records as sample
cursor.execute('SELECT * FROM payments LIMIT 5')
samples = cursor.fetchall()
print("\nFirst 5 records:")
for record in samples:
    print(f"ID: {record[0]}, Name: {record[1]}, User ID: {record[2]}, Payment: ${record[3]:,.2f}, Date: {record[4]}")

conn.close()
