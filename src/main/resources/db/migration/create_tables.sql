-- Create places table
CREATE TABLE places (
                        id VARCHAR(255) NOT NULL PRIMARY KEY,
                        latitude VARCHAR(255) NOT NULL,
                        longitude VARCHAR(255) NOT NULL
);

-- Create sequence for points
CREATE SEQUENCE IF NOT EXISTS point_sequence START WITH 1 INCREMENT BY 1;

-- Create points table
CREATE TABLE point (
                       id BIGINT NOT NULL PRIMARY KEY,
                       session_id VARCHAR(255),
                       address VARCHAR(255),
                       day_start TIME,
                       day_end TIME,
                       lunch_start TIME,
                       lunch_end TIME,
                       created_at TIMESTAMP,
                       priority VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);
CREATE INDEX idx_point_session_id ON point(session_id);
CREATE INDEX idx_point_created_at ON point(created_at);
CREATE INDEX idx_point_priority ON point(priority);