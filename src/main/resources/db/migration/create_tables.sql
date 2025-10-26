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
                       sessionId VARCHAR(255),
                       address VARCHAR(255),
                       dayStart TIME,
                       dayEnd TIME,
                       lunchStart TIME,
                       lunchEnd TIME,
                       createdAt TIMESTAMP,
                       priority VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX idx_places_coordinates ON places(latitude, longitude);
CREATE INDEX idx_point_session_id ON point(sessionId);
CREATE INDEX idx_point_created_at ON point(createdAt);
CREATE INDEX idx_point_priority ON point(priority);