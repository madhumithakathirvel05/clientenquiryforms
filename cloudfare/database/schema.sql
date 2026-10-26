
CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    budget TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New'
        CHECK (status IN ('New', 'Contacted', 'In Progress', 'Completed', 'Closed')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created_at
ON enquiries(created_at);

CREATE INDEX IF NOT EXISTS idx_enquiries_email
ON enquiries(email);
